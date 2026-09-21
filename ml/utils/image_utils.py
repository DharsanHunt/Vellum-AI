"""
Image Processing & Forensic Utilities.
"""

import io
import cv2
import torch
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
from pathlib import Path
from typing import Tuple, List, Dict, Any, Union


def image_to_tensor(
    img: Union[Image.Image, np.ndarray, str, Path],
    target_size: Tuple[int, int] = (224, 224),
    mean: List[float] = [0.485, 0.456, 0.406],
    std: List[float] = [0.229, 0.224, 0.225],
    grayscale: bool = False
) -> torch.Tensor:
    """Converts PIL Image, Path, or numpy array to normalized PyTorch tensor."""
    if isinstance(img, (str, Path)):
        img = Image.open(img)
    elif isinstance(img, np.ndarray):
        img = Image.fromarray(img)
        
    if grayscale:
        img = img.convert("L").resize(target_size, Image.BILINEAR)
        arr = np.array(img, dtype=np.float32) / 255.0
        arr = (arr - 0.5) / 0.5
        tensor = torch.from_numpy(arr).unsqueeze(0)
    else:
        img = img.convert("RGB").resize(target_size, Image.BILINEAR)
        arr = np.array(img, dtype=np.float32) / 255.0
        arr = np.transpose(arr, (2, 0, 1))
        for c in range(3):
            arr[c] = (arr[c] - mean[c]) / std[c]
        tensor = torch.from_numpy(arr)
        
    return tensor


def compute_ela(image_input, quality: int = 90, scale: int = 15) -> np.ndarray:
    if isinstance(image_input, (str, Path)):
        img = Image.open(image_input).convert("RGB")
    elif isinstance(image_input, Image.Image):
        img = image_input.convert("RGB")
    elif isinstance(image_input, np.ndarray):
        img = Image.fromarray(image_input).convert("RGB")
    else:
        raise ValueError("Unsupported image type for ELA")

    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=quality)
    buffer.seek(0)
    resaved = Image.open(buffer)

    diff = ImageChops.difference(img, resaved)
    extrema = diff.getextrema()
    max_diff = max([ex[1] for ex in extrema])
    if max_diff == 0:
        max_diff = 1
    scale_factor = scale * (255.0 / max_diff)

    enhancer = ImageEnhance.Brightness(diff)
    ela_image = enhancer.enhance(scale_factor / 15.0)
    return np.array(ela_image)


def compute_noise_residual(image_np: np.ndarray) -> np.ndarray:
    if len(image_np.shape) == 3:
        gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
    else:
        gray = image_np

    denoised = cv2.medianBlur(gray, 3)
    residual = cv2.absdiff(gray, denoised)
    norm_residual = cv2.normalize(residual, None, 0, 255, cv2.NORM_MINMAX)
    return norm_residual


def generate_heatmap_overlay(original_img: np.ndarray, heatmap_2d: np.ndarray, alpha: float = 0.45) -> np.ndarray:
    h, w = original_img.shape[:2]
    heatmap_resized = cv2.resize(heatmap_2d, (w, h), interpolation=cv2.INTER_LINEAR)
    heatmap_norm = np.clip(heatmap_resized, 0.0, 1.0)
    heatmap_uint8 = (heatmap_norm * 255).astype(np.uint8)

    colored_heatmap = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    colored_heatmap = cv2.cvtColor(colored_heatmap, cv2.COLOR_BGR2RGB)

    overlay = cv2.addWeighted(colored_heatmap, alpha, original_img, 1.0 - alpha, 0)
    return overlay


def mask_to_bounding_boxes(mask: np.ndarray, min_area: int = 150) -> List[List[int]]:
    if len(mask.shape) == 3:
        mask = cv2.cvtColor(mask, cv2.COLOR_RGB2GRAY)
        
    _, binary = cv2.threshold(mask, 127, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    bboxes = []
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area >= min_area:
            x, y, w, h = cv2.boundingRect(cnt)
            bboxes.append([x, y, x + w, y + h])
            
    return bboxes


def compute_iou(boxA: List[int], boxB: List[int]) -> float:
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    interArea = max(0, xB - xA) * max(0, yB - yA)
    boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])

    denom = float(boxAArea + boxBArea - interArea)
    if denom <= 0:
        return 0.0
    return interArea / denom
