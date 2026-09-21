"""
FastAPI REST API Server for Kana-Forge Document Verification Platform.
Exposes modular endpoints for document classification, OCR, entity extraction,
forensic tampering localization, signature & stamp verification, LOR NLP analysis,
cross-document verification, and evidence fusion.
"""

import os
import sys
import io
import json
from pathlib import Path
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import uvicorn

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
from ml.utils.hardware import detect_hardware

app = FastAPI(
    title="Kana-Forge Verification API",
    description="Multi-Modal AI Document Verification & Cross-Document Forensics Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ocr_service = get_ocr_service()
entity_extractor = EntityExtractor()
lor_analyzer = LORAnalyzer()
cross_verifier = CrossDocumentVerifier()


@app.get("/api/health")
def health_check():
    hw = detect_hardware()
    registry_path = BASE_DIR / "models" / "model_registry.json"
    registry = {}
    if registry_path.exists():
        with open(registry_path, "r") as f:
            registry = json.load(f)

    return {
        "status": "HEALTHY",
        "service": "Kana-Forge Document Verification Engine",
        "version": "1.0.0",
        "hardware": hw,
        "models_loaded": list(registry.keys())
    }


@app.get("/api/models/registry")
def get_model_registry():
    registry_path = BASE_DIR / "models" / "model_registry.json"
    if not registry_path.exists():
        raise HTTPException(status_code=404, detail="Model registry not initialized.")
    with open(registry_path, "r") as f:
        return json.load(f)


@app.post("/api/verify/single-document")
async def verify_single_document(
    file: UploadFile = File(...),
    reference_signature: Optional[UploadFile] = File(None),
    reference_stamp: Optional[UploadFile] = File(None)
):
    """
    Complete single document verification pipeline:
    Classification -> OCR -> Entity Extraction -> Tampering Forensics -> Signature -> Stamp -> Evidence Fusion.
    """
    try:
        contents = await file.read()
        pil_img = Image.open(io.BytesIO(contents)).convert("RGB")
        img_np = np.array(pil_img)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")

    # 1. Document Classifier
    cls_res = doc_module.predict(img_np)
    doc_type = cls_res["document_type"]

    # 2. OCR Service
    ocr_res = ocr_service.extract_text_and_layout(img_np)

    # 3. Entity Extraction
    extracted_entities = entity_extractor.extract_from_text_and_layout(ocr_res["full_text"], ocr_res["lines"])

    # 4. Tampering Forensics
    tamper_res = tamper_module.predict(img_np)

    # 5. Signature Verification
    ref_sig_img = None
    if reference_signature:
        ref_sig_bytes = await reference_signature.read()
        ref_sig_img = Image.open(io.BytesIO(ref_sig_bytes)).convert("L")
    sig_res = sig_module.predict(img_np, reference_signature=ref_sig_img)

    # 6. Stamp Verification
    ref_stamp_img = None
    if reference_stamp:
        ref_stamp_bytes = await reference_stamp.read()
        ref_stamp_img = Image.open(io.BytesIO(ref_stamp_bytes)).convert("RGB")
    stamp_res = stamp_module.predict(img_np, reference_stamp=ref_stamp_img)

    # 7. Evidence Fusion
    fusion_signals = {
        "tampering_probability": tamper_res["tampering_probability"],
        "signature_similarity": sig_res["similarity_score"] if sig_res["reference_available"] else None,
        "stamp_present": stamp_res["stamp_present"],
        "ocr_confidence": ocr_res["average_confidence"],
        "issuer_match": bool(extracted_entities.get("institution")),
        "qr_match": True
    }
    fusion_res = fuse(fusion_signals)

    return {
        "document_name": file.filename,
        "classification": cls_res,
        "ocr": {
            "full_text": ocr_res["full_text"][:500],
            "line_count": len(ocr_res["lines"]),
            "average_confidence": ocr_res["average_confidence"],
            "engine": ocr_res["engine"]
        },
        "extracted_entities": extracted_entities,
        "tampering_analysis": {
            "status": tamper_res["status"],
            "is_tampered": tamper_res["is_tampered"],
            "tampering_probability": tamper_res["tampering_probability"],
            "suspicious_regions_count": tamper_res["suspicious_regions_count"],
            "field_explanations": tamper_res["field_explanations"],
            "suspicious_bboxes": tamper_res["suspicious_bboxes"]
        },
        "signature_verification": sig_res,
        "stamp_verification": stamp_res,
        "evidence_fusion": fusion_res
    }


@app.post("/api/verify/cross-document")
def verify_cross_document(payload: Dict[str, Any]):
    """
    Cross-document portfolio consistency verification.
    Expects payload: {"documents": [{"doc_id": str, "doc_type": str, "entities": dict, "text": str}]}
    """
    docs = payload.get("documents", [])
    if not docs:
        raise HTTPException(status_code=400, detail="Payload must contain a non-empty 'documents' list.")
    
    result = cross_verifier.verify_portfolio(docs)
    
    # Run evidence fusion on portfolio
    signals = {
        "cross_doc_consistency": result["consistency_score"],
        "field_anomalies_count": result["conflicts_count"],
        "tampering_probability": 0.05,
        "issuer_match": True,
        "ocr_confidence": 0.95
    }
    fusion = fuse(signals)
    result["portfolio_fusion"] = fusion
    return result


@app.post("/api/lor/analyze")
def analyze_lor_endpoint(payload: Dict[str, Any]):
    """
    Recommendation Letter semantic & plagiarism analysis.
    Expects payload: {"text": str, "reference_profile": Optional[dict]}
    """
    text = payload.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="Text field cannot be empty.")
    ref_prof = payload.get("reference_profile")
    return lor_analyzer.analyze_lor(text, reference_profile=ref_prof)


if __name__ == "__main__":
    uvicorn.run("backend.app:app", host="127.0.0.1", port=8000, reload=False)
