"""
Evaluation script for Signature Verification Model.
"""

import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from ml.signature.signature_model import evaluate

if __name__ == "__main__":
    evaluate()
