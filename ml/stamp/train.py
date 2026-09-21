"""
Training & Calibration script for Stamp Verification Model.
"""

import sys
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from ml.stamp.model import StampModel
from ml.utils.metrics import compute_classification_metrics

TRAIN_DATA = BASE_DIR / "data" / "train" / "index.json"
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)


def train():
    print("==================================================")
    print("  CALIBRATING STAMP VERIFIER MODEL")
    print("==================================================")
    
    if not TRAIN_DATA.exists():
        print(f"[-] Training split {TRAIN_DATA} not found.")
        return

    with open(TRAIN_DATA, "r", encoding="utf-8") as f:
        data = json.load(f)

    certs = data.get("certificates", [])
    stamp_model = StampModel()

    y_true = []
    y_pred = []

    for item in certs:
        img_p = BASE_DIR / item["image_path"]
        if not img_p.exists():
            continue

        has_valid_stamp = (item.get("tampering_type") != "modified_stamp")
        y_true.append(1 if has_valid_stamp else 0)

        pred_res = stamp_model.predict(img_p)
        y_pred.append(1 if pred_res["stamp_present"] else 0)

    metrics = compute_classification_metrics(y_true, y_pred)
    print(f"[OK] Stamp Verifier Calibration Metrics: {metrics}")

    registry_file = MODELS_DIR / "model_registry.json"
    registry = {}
    if registry_file.exists():
        with open(registry_file, "r") as f:
            registry = json.load(f)

    registry["stamp_verifier"] = {
        "version": "1.0.0",
        "algorithm": "HSVInkIsolation_HoughGeometry_ColorHistCorr",
        "dataset": "StaVer+SyntheticStamps",
        "metrics": metrics
    }
    with open(registry_file, "w") as f:
        json.dump(registry, f, indent=2)

    print(f"[OK] Saved stamp verifier calibration to {registry_file}")


if __name__ == "__main__":
    train()
