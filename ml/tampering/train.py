"""
Training pipeline for Dual-Head Tampering & Forgery Detection Network.
"""

import os
import sys
import json
import yaml
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from PIL import Image
from pathlib import Path
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from ml.tampering.model import TamperingUNet
from ml.utils.hardware import detect_hardware
from ml.utils.image_utils import image_to_tensor
from ml.utils.metrics import compute_classification_metrics, compute_segmentation_iou

CONFIG_PATH = Path(__file__).resolve().parent / "config.yaml"
TRAIN_DATA = BASE_DIR / "data" / "train" / "index.json"
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)


class TamperingDataset(Dataset):
    def __init__(self, index_file: Path, img_size=(256, 256)):
        self.samples = []
        self.img_size = img_size
        
        with open(index_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        for c in data.get("certificates", []):
            img_p = BASE_DIR / c["image_path"]
            mask_p = BASE_DIR / c["mask_path"]
            is_tampered = 1 if c.get("is_tampered", False) else 0
            if img_p.exists() and mask_p.exists():
                self.samples.append((img_p, mask_p, is_tampered))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_p, mask_p, is_tampered = self.samples[idx]
        img_tensor = image_to_tensor(str(img_p), target_size=self.img_size)

        with Image.open(mask_p) as mask:
            mask = mask.convert("L").resize(self.img_size, Image.NEAREST)
            mask_arr = np.array(mask, dtype=np.float32) / 255.0
            mask_tensor = torch.from_numpy(mask_arr).unsqueeze(0)

        return img_tensor, mask_tensor, is_tampered


def train():
    print("==================================================")
    print("  TRAINING DUAL-HEAD TAMPERING DETECTION U-NET")
    print("==================================================")
    
    with open(CONFIG_PATH, "r") as f:
        config = yaml.safe_load(f)

    hw = detect_hardware()
    device = torch.device(hw["device"])
    print(f"[*] Compute Hardware: {hw['device']} (RAM: {hw['system_ram_gb']} GB)")

    dataset = TamperingDataset(TRAIN_DATA, img_size=(256, 256))
    if len(dataset) == 0:
        print("[-] Training dataset is empty. Run prepare_datasets.py and create_splits.py.")
        return

    loader = DataLoader(dataset, batch_size=config["training"]["batch_size"], shuffle=True)

    model = TamperingUNet(in_channels=3).to(device)
    cls_criterion = nn.CrossEntropyLoss()
    mask_criterion = nn.BCELoss(reduction="mean")

    optimizer = optim.Adam(
        model.parameters(),
        lr=config["training"]["learning_rate"],
        weight_decay=config["training"]["weight_decay"]
    )

    epochs = config["training"]["epochs"]
    model.train()

    for epoch in range(epochs):
        total_loss = 0.0
        for images, masks, labels in loader:
            images, masks, labels = images.to(device), masks.to(device), labels.to(device)
            optimizer.zero_grad()
            
            cls_logits, pred_masks = model(images)
            
            loss_cls = cls_criterion(cls_logits, labels)
            loss_mask = mask_criterion(pred_masks, masks)
            
            # Dice loss component
            intersection = (pred_masks * masks).sum()
            dice_loss = 1.0 - ((2.0 * intersection + 1e-5) / (pred_masks.sum() + masks.sum() + 1e-5))
            
            loss = loss_cls + (2.0 * loss_mask) + dice_loss
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item() * images.size(0)

        avg_loss = total_loss / len(dataset)
        if (epoch + 1) % 2 == 0 or epoch == epochs - 1:
            print(f"  Epoch [{epoch+1}/{epochs}] Combined Loss: {avg_loss:.4f}")

    checkpoint_path = BASE_DIR / config["checkpoint"]
    torch.save(model.state_dict(), checkpoint_path)
    print(f"[OK] Tampering detector checkpoint saved to {checkpoint_path}")


if __name__ == "__main__":
    train()
