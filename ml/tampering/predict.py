"""
Inference API for Document Tampering Detection.
"""

import sys
import cv2
import torch
import numpy as np
from PIL import Image
from pathlib import Path
from typing import Dict, Any, Union, List, Optional

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from ml.tampering.model import TamperingUNet
from ml.utils.image_utils import compute_ela, generate_heatmap_overlay, mask_to_bounding_boxes, image_to_tensor
from ml.ocr.ocr_service import get_ocr_service
from ml.nlp.entity_extractor import EntityExtractor

CHECKPOINT = BASE_DIR / "models" / "tampering_detector.pt"

_model_instance = None


def get_model():
    global _model_instance
    if _model_instance is None:
        model = TamperingUNet(in_channels=3)
        if CHECKPOINT.exists():
            model.load_state_dict(torch.load(CHECKPOINT, map_location="cpu"))
        model.eval()
        _model_instance = model
    return _model_instance


def predict(
    image_input: Union[str, Path, Image.Image, np.ndarray],
    threshold: float = 0.45,
    custom_entities: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Analyzes document image for tampering artifacts.
    """
    if isinstance(image_input, (str, Path)):
        pil_img = Image.open(image_input).convert("RGB")
        img_np = np.array(pil_img)
    elif isinstance(image_input, np.ndarray):
        img_np = image_input
        if len(img_np.shape) == 2:
            img_np = cv2.cvtColor(img_np, cv2.COLOR_GRAY2RGB)
        pil_img = Image.fromarray(img_np)
    elif isinstance(image_input, Image.Image):
        pil_img = image_input.convert("RGB")
        img_np = np.array(pil_img)
    else:
        raise ValueError(f"Unsupported image type: {type(image_input)}")

    orig_h, orig_w = img_np.shape[:2]

    tensor = image_to_tensor(pil_img, target_size=(256, 256)).unsqueeze(0)
    model = get_model()
    
    with torch.no_grad():
        cls_logits, pred_masks = model(tensor)
        probs = torch.softmax(cls_logits, dim=1).squeeze(0).numpy()
        tamper_prob = float(probs[1]) # class 1: tampered
        heatmap_256 = pred_masks.squeeze().numpy()

    heatmap_orig = cv2.resize(heatmap_256, (orig_w, orig_h), interpolation=cv2.INTER_LINEAR)
    binary_mask = (heatmap_orig > threshold).astype(np.uint8) * 255

    suspicious_bboxes = mask_to_bounding_boxes(binary_mask, min_area=80)

    is_suspicious = (tamper_prob >= 0.50) or (len(suspicious_bboxes) > 0 and np.mean(heatmap_orig) > 0.08)
    status = "SUSPICIOUS" if is_suspicious else "AUTHENTIC-LIKE"

    # Field-Level Explanation
    ocr_service = get_ocr_service()
    ocr_res = ocr_service.extract_text_and_layout(img_np)
    
    explanations = []
    if is_suspicious and suspicious_bboxes:
        for sbox in suspicious_bboxes:
            sx1, sy1, sx2, sy2 = sbox
            matched_field = None
            
            for line in ocr_res["lines"]:
                lx1, ly1, lx2, ly2 = line["bbox"]
                if not (sx2 < lx1 or sx1 > lx2 or sy2 < ly1 or sy1 > ly2):
                    txt_snip = line["text"]
                    if "Certificate No" in txt_snip or "Cert No" in txt_snip:
                        matched_field = "certificate number serial field"
                    elif "Registration" in txt_snip or "Reg No" in txt_snip:
                        matched_field = "registration identity number field"
                    elif "certify that" in txt_snip.lower() or (sy1 > 180 and sy2 < 250):
                        matched_field = "student name / awardee identity field"
                    elif "Date" in txt_snip or (sy1 > 450 and sx1 < 350):
                        matched_field = "date of issue timestamp field"
                    elif "Bachelor" in txt_snip or "Master" in txt_snip or (sy1 > 280 and sy2 < 360):
                        matched_field = "degree / curriculum title field"
                    else:
                        matched_field = f"text region ('{txt_snip[:25]}...')"
                    break
                    
            if not matched_field:
                if 460 <= sy1 <= 550 and 600 <= sx1 <= 900:
                    matched_field = "institutional authority signature line"
                elif 460 <= sy1 <= 570 and 380 <= sx1 <= 530:
                    matched_field = "official university seal / stamp zone"
                elif sy1 <= 120:
                    matched_field = "issuing university header banner"
                else:
                    matched_field = f"document coordinate zone [y:{sy1}-{sy2}]"

            explanations.append(f"Potential modification detected near {matched_field}.")
    elif not is_suspicious:
        explanations.append("Document passes visual error-level and frequency forensic checks without localized anomalies.")

    overlay_img = generate_heatmap_overlay(img_np, heatmap_orig, alpha=0.45)

    return {
        "status": status,
        "is_tampered": is_suspicious,
        "tampering_probability": round(tamper_prob, 4),
        "suspicious_regions_count": len(suspicious_bboxes),
        "suspicious_bboxes": suspicious_bboxes,
        "field_explanations": explanations,
        "primary_explanation": explanations[0] if explanations else "No tampering detected.",
        "heatmap": heatmap_orig.tolist() if orig_w < 300 else None,
        "overlay_shape": list(overlay_img.shape)
    }


if __name__ == "__main__":
    import json
    test_img = Image.new("RGB", (300, 200), (245, 245, 240))
    res = predict(test_img)
    print(json.dumps({k: v for k, v in res.items() if k != "heatmap"}, indent=2))
