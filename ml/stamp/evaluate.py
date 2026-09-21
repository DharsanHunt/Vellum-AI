"""
Evaluation script for Stamp Verifier Model.
"""

import sys
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from ml.stamp.model import StampModel
from ml.utils.metrics import compute_classification_metrics

TEST_DATA = BASE_DIR / "data" / "test" / "index.json"


def evaluate():
    print("==================================================")
    print("  EVALUATING STAMP VERIFIER MODEL")
    print("==================================================")

    if not TEST_DATA.exists():
        print(f"[-] Test split {TEST_DATA} not found.")
        return None

    with open(TEST_DATA, "r", encoding="utf-8") as f:
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
    print("\n--- Stamp Verifier Evaluation (Test Split) ---")
    for k, v in metrics.items():
        print(f"  {k:<12}: {v}")
    return metrics


if __name__ == "__main__":
    evaluate()
