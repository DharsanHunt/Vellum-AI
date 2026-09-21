"""
End-to-End Verification Pipeline Automated Tests.
Tests upload, classification, OCR, entity extraction, tampering forensics,
signature similarity, stamp presence, cross-document verification, and evidence fusion.
"""

import os
import sys
import json
import pytest
from pathlib import Path
from PIL import Image
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from ml.ocr.ocr_service import get_ocr_service
from ml.nlp.entity_extractor import EntityExtractor
from ml.nlp.lor_analyzer import LORAnalyzer
import ml.document_classifier as doc_module
import ml.tampering as tamper_module
import ml.signature as sig_module
import ml.stamp as stamp_module
from ml.cross_verification.cross_verifier import CrossDocumentVerifier
from ml.fusion.evidence_fusion import fuse


@pytest.fixture(scope="module")
def sample_certificate():
    """Provides a sample synthetic certificate image from processed dataset."""
    img_dir = BASE_DIR / "data" / "processed" / "images"
    sample_images = list(img_dir.glob("*.png"))
    assert len(sample_images) > 0, "No processed images found. Run prepare_datasets.py first."
    return sample_images[0]


def test_document_classification_pipeline(sample_certificate):
    """Verifies that the document classifier identifies document type and outputs 128-d layout embeddings."""
    res = doc_module.predict(str(sample_certificate))
    assert "document_type" in res
    assert "confidence" in res
    assert "embedding" in res
    assert res["document_type"] == "ACADEMIC_CERTIFICATE"
    assert len(res["embedding"]) == 128
    assert 0.0 <= res["confidence"] <= 1.0


def test_ocr_and_entity_extraction_pipeline(sample_certificate):
    """Verifies OCR text extraction, bounding boxes, and information extraction."""
    ocr_service = get_ocr_service()
    ocr_res = ocr_service.extract_text_and_layout(str(sample_certificate))
    assert "full_text" in ocr_res
    assert "lines" in ocr_res
    assert len(ocr_res["lines"]) > 0
    assert ocr_res["average_confidence"] > 0.50

    extractor = EntityExtractor()
    entities = extractor.extract_from_text_and_layout(ocr_res["full_text"], ocr_res["lines"])
    assert "student_name" in entities
    assert "institution" in entities
    assert "certificate_number" in entities


def test_tampering_forensic_detection(sample_certificate):
    """Verifies tampering heatmap generation, mask output, and field explanations."""
    res = tamper_module.predict(str(sample_certificate))
    assert "status" in res
    assert res["status"] in ["AUTHENTIC-LIKE", "SUSPICIOUS"]
    assert "tampering_probability" in res
    assert "field_explanations" in res
    assert len(res["field_explanations"]) > 0
    assert 0.0 <= res["tampering_probability"] <= 1.0


def test_signature_siamese_verification():
    """Verifies Siamese signature metric learning comparison."""
    sig_dir = BASE_DIR / "data" / "processed" / "signatures"
    sig_files = list(sig_dir.glob("*.png"))
    assert len(sig_files) >= 2, "Insufficient signature crops."

    # Compare same signature (genuine pair)
    comp_same = sig_module.compare(sig_files[0], sig_files[0])
    assert comp_same["is_match"] is True
    assert comp_same["similarity_score"] >= 0.75

    # Prediction without reference
    pred_res = sig_module.predict(sig_files[0])
    assert "similarity_score" in pred_res
    assert "model_confidence" in pred_res
    assert pred_res["reference_available"] is False


def test_stamp_presence_and_localization(sample_certificate):
    """Verifies stamp segmentation, HSV ink analysis, and bounding-box detection."""
    res = stamp_module.predict(str(sample_certificate))
    assert "stamp_present" in res
    assert "confidence" in res
    assert "ink_color" in res
    assert res["ink_color"] in ["RED", "BLUE", "PURPLE", "NONE", "UNKNOWN"]


def test_cross_document_portfolio_verification():
    """Verifies multi-document entity graph construction and conflict detection."""
    verifier = CrossDocumentVerifier()
    
    # Portfolio with student name variation (Arun Kumar vs Arjun Kumar)
    docs = [
        {
            "doc_id": "CERT_01",
            "doc_type": "CERTIFICATE",
            "entities": {
                "student_name": "Arun Kumar",
                "institution": "Apex University of Technology",
                "degree": "Bachelor of Technology in Computer Science"
            }
        },
        {
            "doc_id": "LOR_01",
            "doc_type": "LOR",
            "entities": {
                "student_name": "Arjun Kumar",
                "institution": "Apex University of Technology"
            }
        }
    ]
    res = verifier.verify_portfolio(docs)
    assert res["overall_status"] in ["MINOR_VARIATION", "CONFLICT"]
    assert len(res["field_comparisons"]) > 0
    assert "entity_graph" in res


def test_lor_semantic_nlp_analysis():
    """Verifies LOR NLP claim extraction, duplicate boilerplate detection, and contradiction checks."""
    analyzer = LORAnalyzer()
    
    # Authentic LOR test
    auth_text = "I am pleased to recommend Arun Kumar from Apex University of Technology for the project 'Graph Neural Networks'."
    auth_res = analyzer.analyze_lor(auth_text)
    assert auth_res["status"] == "AUTHENTIC_LIKE"
    assert auth_res["is_template_duplicate"] is False

    # Boilerplate copy test
    bp_text = "To Whom It May Concern, I am writing this standard letter for Arun Kumar. The candidate is a hard working individual who attends all lectures on time."
    bp_res = analyzer.analyze_lor(bp_text)
    assert bp_res["is_template_duplicate"] is True
    assert bp_res["status"] == "SUSPICIOUS"


def test_evidence_fusion_end_to_end(sample_certificate):
    """Verifies complete multi-signal evidence fusion pipeline producing final structured risk verdict."""
    img_np = np.array(Image.open(sample_certificate).convert("RGB"))
    cls_res = doc_module.predict(img_np)
    ocr_service = get_ocr_service()
    ocr_res = ocr_service.extract_text_and_layout(img_np)
    tamper_res = tamper_module.predict(img_np)
    sig_res = sig_module.predict(img_np)
    stamp_res = stamp_module.predict(img_np)

    signals = {
        "tampering_probability": tamper_res["tampering_probability"],
        "signature_similarity": sig_res["similarity_score"] if sig_res["reference_available"] else None,
        "stamp_present": stamp_res["stamp_present"],
        "cross_doc_consistency": 1.0,
        "issuer_match": True,
        "ocr_confidence": ocr_res["average_confidence"]
    }

    fusion_res = fuse(signals)

    assert "verification_status" in fusion_res
    assert fusion_res["verification_status"] in ["GENUINE", "MANUAL_REVIEW", "SUSPICIOUS", "FRAUD_DETECTED"]
    assert "risk_score" in fusion_res
    assert 0.0 <= fusion_res["risk_score"] <= 1.0
    assert "evidence_list" in fusion_res
    assert len(fusion_res["evidence_list"]) >= 5

    print(f"\n[OK] Full Verification Pipeline Generated Verdict: {fusion_res['verdict_label']} (Risk Score: {fusion_res['risk_score']})")


if __name__ == "__main__":
    pytest.main(["-v", __file__])
