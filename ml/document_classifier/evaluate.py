"""
Evaluation Script for Document Classifier.
"""

import sys
import json
import torch
from pathlib import Path
from torch.utils.data import DataLoader
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from ml.document_classifier.model import DocumentClassifier, DOCUMENT_CLASSES
from ml.document_classifier.train import DocumentDataset
from ml.utils.metrics import compute_classification_metrics

TEST_DATA = BASE_DIR / "data" / "test" / "index.json"
CHECKPOINT = BASE_DIR / "models" / "document_classifier.pt"


def evaluate():
    print("==================================================")
    print("  EVALUATING DOCUMENT TYPE CLASSIFIER")
    print("==================================================")

    if not CHECKPOINT.exists():
        print(f"[-] Checkpoint {CHECKPOINT} not found. Run train.py first.")
        return

    dataset = DocumentDataset(TEST_DATA)
    if len(dataset) == 0:
        print("[-] Test split is empty.")
        return

    loader = DataLoader(dataset, batch_size=8, shuffle=False)

    model = DocumentClassifier(num_classes=5)
    model.load_state_dict(torch.load(CHECKPOINT, map_location="cpu"))
    model.eval()

    y_true = []
    y_pred = []

    with torch.no_grad():
        for images, labels in loader:
            logits, _ = model(images)
            preds = torch.argmax(logits, dim=1)
            y_true.extend(labels.tolist())
            y_pred.extend(preds.tolist())

    metrics = compute_classification_metrics(y_true, y_pred)
    print("\n--- Document Classifier Evaluation (Test Split) ---")
    for k, v in metrics.items():
        print(f"  {k:<12}: {v}")
    return metrics


if __name__ == "__main__":
    evaluate()
