"""
Evaluation Script for LOR NLP Analyzer on Validation and Test Sets.
"""

import sys
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from ml.nlp.lor_analyzer import LORAnalyzer
from ml.utils.metrics import compute_classification_metrics

TEST_DATA = BASE_DIR / "data" / "test" / "index.json"
VAL_DATA = BASE_DIR / "data" / "validation" / "index.json"
MODELS_DIR = BASE_DIR / "models"


def evaluate_split(split_path: Path, split_name: str = "Test"):
    if not split_path.exists():
        print(f"[-] Data file {split_path} not found.")
        return None

    with open(split_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    lors = data.get("lors", [])
    analyzer = LORAnalyzer()
    
    y_true = []
    y_pred = []
    y_probs = []

    for item in lors:
        text = item["text"]
        is_conflict = not item["is_valid"]
        y_true.append(1 if is_conflict else 0)

        ref_prof = {
            "student_name": item["entities"].get("student_name"),
            "institution": item["entities"].get("institution")
        }
        res = analyzer.analyze_lor(text, reference_profile=ref_prof)
        pred_conflict = (res["status"] != "AUTHENTIC_LIKE")
        y_pred.append(1 if pred_conflict else 0)
        y_probs.append(1.0 - res["coherence_score"])

    metrics = compute_classification_metrics(y_true, y_pred, y_probs)
    print(f"\n--- LOR NLP Analyzer Evaluation [{split_name.upper()}] ({len(lors)} samples) ---")
    for k, v in metrics.items():
        print(f"  {k:<12}: {v}")

    if split_name == "Test":
        registry_file = MODELS_DIR / "model_registry.json"
        registry = {}
        if registry_file.exists():
            with open(registry_file, "r") as f:
                registry = json.load(f)

        registry["lor_nlp_analyzer"] = {
            "version": "1.0.0",
            "dataset": "Synthetic-LOR-10K",
            "algorithm": "HeuristicNER_FuzzyMatching_TemplateDetection",
            "metrics": metrics
        }
        with open(registry_file, "w") as f:
            json.dump(registry, f, indent=2)

    return metrics


def main():
    print("==================================================")
    print("  EVALUATING LOR NLP ANALYZER")
    print("==================================================")
    evaluate_split(VAL_DATA, "Validation")
    evaluate_split(TEST_DATA, "Test")


if __name__ == "__main__":
    main()
