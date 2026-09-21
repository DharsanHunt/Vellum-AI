"""
FastAPI Backend Endpoint Verification Tests.
"""

import sys
from pathlib import Path
import pytest

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from fastapi.testclient import TestClient
from backend.app import app

client = TestClient(app)


def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert "hardware" in data
    assert "models_loaded" in data


def test_api_model_registry():
    response = client.get("/api/models/registry")
    assert response.status_code == 200
    data = response.json()
    assert "tampering_detector" in data
    assert "signature_siamese_model" in data
    assert "stamp_verifier" in data


def test_api_lor_analyze():
    payload = {
        "text": "I strongly recommend Arun Kumar for graduate studies in Computer Science at Apex University of Technology.",
        "reference_profile": {"student_name": "Arun Kumar", "institution": "Apex University of Technology"}
    }
    response = client.post("/api/lor/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "AUTHENTIC_LIKE"
    assert "coherence_score" in data


def test_api_cross_document():
    payload = {
        "documents": [
            {"doc_id": "CERT_1", "doc_type": "CERTIFICATE", "entities": {"student_name": "Arun Kumar", "institution": "Apex University of Technology"}},
            {"doc_id": "TRANSCRIPT_1", "doc_type": "TRANSCRIPT", "entities": {"student_name": "Arun Kumar", "institution": "Apex University of Technology"}}
        ]
    }
    response = client.post("/api/verify/cross-document", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["overall_status"] == "MATCH"
    assert "portfolio_fusion" in data


def test_api_single_document_upload():
    img_dir = BASE_DIR / "data" / "processed" / "images"
    sample_images = list(img_dir.glob("*.png"))
    assert len(sample_images) > 0

    with open(sample_images[0], "rb") as f:
        response = client.post(
            "/api/verify/single-document",
            files={"file": ("cert.png", f, "image/png")}
        )
    assert response.status_code == 200
    data = response.json()
    assert "classification" in data
    assert "ocr" in data
    assert "tampering_analysis" in data
    assert "signature_verification" in data
    assert "stamp_verification" in data
    assert "evidence_fusion" in data
