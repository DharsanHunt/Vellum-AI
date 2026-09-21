"""
Training & Calibration script for LOR NLP Analyzer.
"""

import os
import sys
import json
import yaml
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from ml.nlp.lor_analyzer import LORAnalyzer
from ml.utils.metrics import compute_classification_metrics

CONFIG_PATH = Path(__file__).resolve().parent / "config.yaml"
TRAIN_DATA = BASE_DIR / "data" / "train" / "index.json"
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)


def train():
    print("==================================================")
    print("  TRAINING / CALIBRATING LOR NLP ANALYZER")
    print("==================================================")
    
    with open(CONFIG_PATH, "r") as f:
        config = yaml.safe_load(f)

    if not TRAIN_DATA.exists():
        print(f"[-] Training split {TRAIN_DATA} not found. Run create_splits.py first.")
        return

    with open(TRAIN_DATA, "r", encoding="utf-8") as f:
        data = json.load(f)

    lors = data.get("lors", [])
    print(f"[*] Calibrating NLP analyzer on {len(lors)} training LOR samples...")

    analyzer = LORAnalyzer()
    y_true = []
    y_pred = []
    y_probs = []

    for item in lors:
        text = item["text"]
        is_conflict = not item["is_valid"]
        y_true.append(1 if is_conflict else 0)

        res = analyzer.analyze_lor(text)
        pred_conflict = (res["status"] != "AUTHENTIC_LIKE")
        y_pred.append(1 if pred_conflict else 0)
        y_probs.append(1.0 - res["coherence_score"])

    metrics = compute_classification_metrics(y_true, y_pred, y_probs)
    print(f"[OK] Training Calibration Metrics: {metrics}")

    registry_file = MODELS_DIR / "model_registry.json"
    registry = {}
    if registry_file.exists():
        with open(registry_file, "r") as f:
            registry = json.load(f)

    registry["lor_nlp_analyzer"] = {
        "version": config["version"],
        "dataset": config["dataset"],
        "algorithm": config["algorithm"],
        "metrics": metrics,
        "parameters": config["thresholds"]
    }

    with open(registry_file, "w") as f:
        json.dump(registry, f, indent=2)

    print(f"[OK] Saved model calibration to {registry_file}")


if __name__ == "__main__":
    train()
