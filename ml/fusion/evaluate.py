"""
Evaluation script for Evidence Fusion Engine.
"""

import sys
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from ml.fusion.evidence_fusion import EvidenceFusionEngine
from ml.utils.metrics import compute_classification_metrics

MODELS_DIR = BASE_DIR / "models"


def evaluate():
    print("==================================================")
    print("  EVALUATING EVIDENCE FUSION ENGINE")
    print("==================================================")

    engine = EvidenceFusionEngine()
    
    scenarios = [
        {"signals": {"tampering_probability": 0.05, "signature_similarity": 0.92, "stamp_present": True, "cross_doc_consistency": 1.0, "issuer_match": True, "ocr_confidence": 0.95}, "label": 0},
        {"signals": {"tampering_probability": 0.88, "signature_similarity": 0.90, "stamp_present": True, "cross_doc_consistency": 0.95, "issuer_match": True, "ocr_confidence": 0.92}, "label": 1},
        {"signals": {"tampering_probability": 0.10, "signature_similarity": 0.35, "stamp_present": True, "cross_doc_consistency": 1.0, "issuer_match": True, "ocr_confidence": 0.95}, "label": 1},
        {"signals": {"tampering_probability": 0.12, "signature_similarity": 0.88, "stamp_present": False, "cross_doc_consistency": 0.90, "issuer_match": True, "ocr_confidence": 0.90}, "label": 1},
        {"signals": {"tampering_probability": 0.08, "signature_similarity": 0.90, "stamp_present": True, "cross_doc_consistency": 0.40, "issuer_match": True, "ocr_confidence": 0.95}, "label": 1},
        {"signals": {"tampering_probability": 0.08, "signature_similarity": 0.85, "stamp_present": True, "cross_doc_consistency": 1.0, "issuer_match": False, "ocr_confidence": 0.95}, "label": 1}
    ]

    y_true = []
    y_pred = []
    y_probs = []

    for item in scenarios:
        y_true.append(item["label"])
        res = engine.fuse(item["signals"])
        # Risk score > 0.35 indicates suspicious/fraudulent document
        is_risky = 1 if res["risk_score"] > 0.35 else 0
        y_pred.append(is_risky)
        y_probs.append(res["risk_score"])

    metrics = compute_classification_metrics(y_true, y_pred, y_probs)
    print("\n--- Evidence Fusion Decision Metrics ---")
    for k, v in metrics.items():
        print(f"  {k:<12}: {v}")

    # Register in model registry
    registry_file = MODELS_DIR / "model_registry.json"
    registry = {}
    if registry_file.exists():
        with open(registry_file, "r") as f:
            registry = json.load(f)

    registry["evidence_fusion_engine"] = {
        "version": "1.0.0",
        "algorithm": "ProbabilisticWeightedEvidenceFusion",
        "dataset": "MultiModal-Forensic-Fusion-Benchmark",
        "metrics": metrics
    }
    with open(registry_file, "w") as f:
        json.dump(registry, f, indent=2)

    return metrics


if __name__ == "__main__":
    evaluate()
