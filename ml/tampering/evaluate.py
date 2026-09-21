"""
Evaluation script for Document Tampering Detector.
Evaluates pixel mIoU, Dice coefficient, and image-level classification metrics on Test split.
"""

import sys
import json
import torch
import numpy as np
from pathlib import Path
from torch.utils.data import DataLoader
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from ml.tampering.model import TamperingUNet
from ml.tampering.train import TamperingDataset
from ml.utils.metrics import compute_classification_metrics, compute_segmentation_iou, compute_dice_coefficient

TEST_DATA = BASE_DIR / "data" / "test" / "index.json"
CHECKPOINT = BASE_DIR / "models" / "tampering_detector.pt"
MODELS_DIR = BASE_DIR / "models"


def evaluate():
    print("==================================================")
    print("  EVALUATING TAMPERING DETECTION U-NET")
    print("==================================================")

    if not CHECKPOINT.exists():
        print(f"[-] Checkpoint {CHECKPOINT} not found.")
        return None

    dataset = TamperingDataset(TEST_DATA, img_size=(256, 256))
    if len(dataset) == 0:
        print("[-] Test split is empty.")
        return None

    loader = DataLoader(dataset, batch_size=4, shuffle=False)

    model = TamperingUNet(in_channels=3)
    model.load_state_dict(torch.load(CHECKPOINT, map_location="cpu"))
    model.eval()

    y_true_cls = []
    y_pred_cls = []
    y_prob_cls = []

    all_pred_masks = []
    all_true_masks = []

    with torch.no_grad():
        for images, masks, labels in loader:
            cls_logits, pred_masks = model(images)
            probs = torch.softmax(cls_logits, dim=1)[:, 1]
            
            # Combine classification logits and spatial heatmap peak for robust forensic detection
            for i in range(len(labels)):
                prob = float(probs[i])
                mask_peak = float(pred_masks[i].max())
                # If either the classification head or the localized heatmap indicates forgery
                is_forged = (prob >= 0.50) or (mask_peak > 0.45)
                
                y_true_cls.append(int(labels[i]))
                y_pred_cls.append(1 if is_forged else 0)
                y_prob_cls.append(max(prob, mask_peak))

            all_pred_masks.append(pred_masks.squeeze(1).numpy())
            all_true_masks.append(masks.squeeze(1).numpy())

    pred_masks_cat = np.concatenate(all_pred_masks, axis=0)
    true_masks_cat = np.concatenate(all_true_masks, axis=0)

    cls_metrics = compute_classification_metrics(y_true_cls, y_pred_cls, y_prob_cls)
    iou = compute_segmentation_iou(pred_masks_cat, true_masks_cat, threshold=0.35)
    dice = compute_dice_coefficient(pred_masks_cat, true_masks_cat, threshold=0.35)

    results = {
        "classification": cls_metrics,
        "segmentation_iou": iou,
        "dice_coefficient": dice
    }

    print("\n--- Tampering Detector Evaluation (Test Split) ---")
    print(f"  Classification Accuracy : {cls_metrics['accuracy']}")
    print(f"  Classification Precision: {cls_metrics['precision']}")
    print(f"  Classification Recall   : {cls_metrics['recall']}")
    print(f"  Classification F1       : {cls_metrics['f1']}")
    print(f"  Classification ROC-AUC  : {cls_metrics.get('roc_auc', 'N/A')}")
    print(f"  Pixel Segmentation mIoU : {iou}")
    print(f"  Segmentation Dice Score : {dice}")

    # Register in model registry
    registry_file = MODELS_DIR / "model_registry.json"
    registry = {}
    if registry_file.exists():
        with open(registry_file, "r") as f:
            registry = json.load(f)

    registry["tampering_detector"] = {
        "version": "1.0.0",
        "architecture": "DualHead_Forensic_UNet",
        "dataset": "DocTamper+Synthetic-Certificates",
        "metrics": {
            "accuracy": cls_metrics["accuracy"],
            "precision": cls_metrics["precision"],
            "recall": cls_metrics["recall"],
            "f1": cls_metrics["f1"],
            "roc_auc": cls_metrics.get("roc_auc", 0.0),
            "pixel_iou": iou,
            "dice": dice
        }
    }
    with open(registry_file, "w") as f:
        json.dump(registry, f, indent=2)

    return results


if __name__ == "__main__":
    evaluate()
