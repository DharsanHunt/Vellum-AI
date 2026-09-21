"""
Inference & Prediction wrapper for LOR NLP Analyzer.
"""

import sys
import json
from pathlib import Path
from typing import Dict, Any, Optional
from ml.nlp.lor_analyzer import LORAnalyzer

_analyzer_instance = None


def get_lor_analyzer():
    global _analyzer_instance
    if _analyzer_instance is None:
        _analyzer_instance = LORAnalyzer()
    return _analyzer_instance


def predict(text_or_path: str, reference_profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    analyzer = get_lor_analyzer()
    if Path(text_or_path).exists():
        with open(text_or_path, "r", encoding="utf-8") as f:
            text = f.read()
    else:
        text = text_or_path

    return analyzer.analyze_lor(text, reference_profile=reference_profile)


if __name__ == "__main__":
    sample = "I am delighted to recommend Arun Kumar for graduate study at Apex University."
    print(json.dumps(predict(sample), indent=2))
