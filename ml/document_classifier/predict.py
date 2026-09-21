"""
Inference API for Document Type Classifier.
Returns document category, class confidence, and 128-d layout embedding vector.
"""

import sys
import torch
import numpy as np
from PIL import Image
from pathlib import Path
from typing import Dict, Any, Union

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from ml.document_classifier.model import DocumentClassifier, DOCUMENT_CLASSES
from ml.utils.image_utils import image_to_tensor

CHECKPOINT = BASE_DIR / "models" / "document_classifier.pt"

_model_instance = None


def get_model():
    global _model_instance
    if _model_instance is None:
        model = DocumentClassifier(num_classes=5)
        if CHECKPOINT.exists():
            model.load_state_dict(torch.load(CHECKPOINT, map_location="cpu"))
        model.eval()
        _model_instance = model
    return _model_instance


def predict(image_input: Union[str, Path, Image.Image, np.ndarray]) -> Dict[str, Any]:
    tensor = image_to_tensor(image_input, target_size=(224, 224)).unsqueeze(0)
    model = get_model()

    with torch.no_grad():
        logits, embed = model(tensor)
        probs = torch.softmax(logits, dim=1).squeeze(0).numpy()
        pred_idx = int(np.argmax(probs))
        confidence = float(probs[pred_idx])
        embedding_vec = embed.squeeze(0).numpy().tolist()

    return {
        "document_type": DOCUMENT_CLASSES[pred_idx],
        "document_type_id": pred_idx,
        "confidence": round(confidence, 4),
        "class_probabilities": {cls: round(float(probs[i]), 4) for i, cls in enumerate(DOCUMENT_CLASSES)},
        "embedding": embedding_vec
    }


if __name__ == "__main__":
    import json
    test_img = Image.new("RGB", (224, 224), (240, 240, 240))
    res = predict(test_img)
    print("Prediction Result:")
    print(json.dumps({k: v for k, v in res.items() if k != "embedding"}, indent=2))
