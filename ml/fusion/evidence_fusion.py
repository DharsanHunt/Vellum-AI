"""
Multi-Signal Evidence Fusion Engine.
Aggregates heterogeneous forensic signals (OCR confidence, tampering probability,
signature similarity, stamp presence, QR verification, issuer records, cross-document consistency)
into a calibrated risk score, verification status, and transparent evidence audit trail.
"""

import json
import numpy as np
from typing import Dict, List, Any, Optional
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class EvidenceFusionEngine:
    def __init__(self, weights: Optional[Dict[str, float]] = None):
        self.default_weights = weights or {
            "tampering_probability": 0.30,
            "signature_similarity": 0.20,
            "stamp_presence": 0.15,
            "cross_doc_consistency": 0.20,
            "issuer_verification": 0.10,
            "ocr_confidence": 0.05
        }

    def fuse(self, signals: Dict[str, Any]) -> Dict[str, Any]:
        """
        Fuses forensic signals into risk score and structured verification decision.
        """
        evidence_list = []
        accumulated_risk = 0.0
        total_active_weight = 0.0
        critical_anomaly_flags = []

        # 1. Tampering Forensic Signal (Weight: 0.30)
        t_prob = signals.get("tampering_probability")
        if t_prob is not None:
            w = self.default_weights["tampering_probability"]
            total_active_weight += w
            risk_contrib = t_prob * w
            accumulated_risk += risk_contrib
            if t_prob >= 0.55:
                critical_anomaly_flags.append(f"High visual tampering probability ({round(t_prob*100, 1)}%)")
            evidence_list.append({
                "signal": "tampering_forensics",
                "raw_value": round(float(t_prob), 4),
                "weight": w,
                "risk_contribution": round(float(risk_contrib), 4),
                "status": "PASS" if t_prob < 0.30 else ("WARNING" if t_prob < 0.55 else "FAIL"),
                "description": f"Image forensic anomaly probability is {round(t_prob * 100, 1)}%."
            })

        # 2. Signature Metric Similarity (Weight: 0.20)
        sig_sim = signals.get("signature_similarity")
        if sig_sim is not None:
            w = self.default_weights["signature_similarity"]
            total_active_weight += w
            sig_risk = max(0.0, 1.0 - sig_sim)
            risk_contrib = sig_risk * w
            accumulated_risk += risk_contrib
            if sig_sim < 0.65:
                critical_anomaly_flags.append(f"Low signature similarity match ({round(sig_sim*100, 1)}%)")
            evidence_list.append({
                "signal": "signature_verification",
                "raw_value": round(float(sig_sim), 4),
                "weight": w,
                "risk_contribution": round(float(risk_contrib), 4),
                "status": "PASS" if sig_sim >= 0.75 else ("WARNING" if sig_sim >= 0.65 else "FAIL"),
                "description": f"Siamese signature match score: {round(sig_sim * 100, 1)}%."
            })
        else:
            evidence_list.append({
                "signal": "signature_verification",
                "raw_value": None,
                "weight": 0.0,
                "status": "UNAVAILABLE",
                "description": "No reference signature specimen uploaded."
            })

        # 3. Stamp & Seal Verification (Weight: 0.15)
        stamp_pres = signals.get("stamp_present")
        if stamp_pres is not None:
            w = self.default_weights["stamp_presence"]
            total_active_weight += w
            stamp_risk = 0.0 if stamp_pres else 0.80
            risk_contrib = stamp_risk * w
            accumulated_risk += risk_contrib
            if not stamp_pres:
                critical_anomaly_flags.append("Missing or unverified institutional seal")
            evidence_list.append({
                "signal": "stamp_seal_presence",
                "raw_value": bool(stamp_pres),
                "weight": w,
                "risk_contribution": round(float(risk_contrib), 4),
                "status": "PASS" if stamp_pres else "FAIL",
                "description": "Official institutional stamp verified." if stamp_pres else "Missing or corrupted institutional seal."
            })

        # 4. Cross-Document Consistency (Weight: 0.20)
        cross_cons = signals.get("cross_doc_consistency")
        if cross_cons is not None:
            w = self.default_weights["cross_doc_consistency"]
            total_active_weight += w
            cross_risk = max(0.0, 1.0 - cross_cons)
            risk_contrib = cross_risk * w
            accumulated_risk += risk_contrib
            if cross_cons < 0.65:
                critical_anomaly_flags.append(f"Cross-document entity conflict (Consistency: {round(cross_cons*100, 1)}%)")
            evidence_list.append({
                "signal": "cross_document_consistency",
                "raw_value": round(float(cross_cons), 4),
                "weight": w,
                "risk_contribution": round(float(risk_contrib), 4),
                "status": "PASS" if cross_cons >= 0.85 else ("WARNING" if cross_cons >= 0.65 else "FAIL"),
                "description": f"Portfolio cross-entity consistency score: {round(cross_cons * 100, 1)}%."
            })

        # 5. Issuer Registry Verification (Weight: 0.10)
        issuer_match = signals.get("issuer_match")
        if issuer_match is not None:
            w = self.default_weights["issuer_verification"]
            total_active_weight += w
            iss_risk = 0.0 if issuer_match else 0.90
            risk_contrib = iss_risk * w
            accumulated_risk += risk_contrib
            if not issuer_match:
                critical_anomaly_flags.append("Institution could not be verified in accredited registries")
            evidence_list.append({
                "signal": "issuer_registry_lookup",
                "raw_value": bool(issuer_match),
                "weight": w,
                "risk_contribution": round(float(risk_contrib), 4),
                "status": "PASS" if issuer_match else "FAIL",
                "description": "Issuer verified in accredited institutional directory." if issuer_match else "Institution not found in accredited directory."
            })

        # 6. OCR Text Extraction Quality (Weight: 0.05)
        ocr_conf = signals.get("ocr_confidence", 0.95)
        w = self.default_weights["ocr_confidence"]
        total_active_weight += w
        ocr_risk = max(0.0, 1.0 - ocr_conf) * 0.4
        risk_contrib = ocr_risk * w
        accumulated_risk += risk_contrib
        evidence_list.append({
            "signal": "ocr_layout_confidence",
            "raw_value": round(float(ocr_conf), 4),
            "weight": w,
            "risk_contribution": round(float(risk_contrib), 4),
            "status": "PASS" if ocr_conf >= 0.80 else "WARNING",
            "description": f"OCR character recognition confidence: {round(ocr_conf * 100, 1)}%."
        })

        # Base weighted average risk
        weighted_risk = (accumulated_risk / total_active_weight) if total_active_weight > 0 else 0.50

        # Non-linear risk escalation if critical anomalies are present
        if critical_anomaly_flags:
            # Scale risk up proportionally to severity
            escalation = 0.40 + (len(critical_anomaly_flags) * 0.15)
            final_risk_score = max(weighted_risk, escalation)
        else:
            final_risk_score = weighted_risk

        if signals.get("field_anomalies_count", 0) > 0:
            final_risk_score = min(1.0, final_risk_score + (signals["field_anomalies_count"] * 0.20))
        if signals.get("is_template_duplicate", False):
            final_risk_score = max(final_risk_score, 0.70)

        final_risk_score = round(float(max(0.0, min(1.0, final_risk_score))), 4)

        if final_risk_score <= 0.25:
            verification_status = "GENUINE"
            verdict_label = "AUTHENTIC"
        elif final_risk_score <= 0.50:
            verification_status = "MANUAL_REVIEW"
            verdict_label = "MANUAL REVIEW REQUIRED"
        elif final_risk_score <= 0.75:
            verification_status = "SUSPICIOUS"
            verdict_label = "SUSPICIOUS / POTENTIAL TAMPERING"
        else:
            verification_status = "FRAUD_DETECTED"
            verdict_label = "HIGH RISK / FRAUD DETECTED"

        model_confidence = round(float(max(0.70, min(0.99, 1.0 - abs(final_risk_score - 0.5) * 0.2 + (total_active_weight * 0.10)))), 3)

        return {
            "verification_status": verification_status,
            "verdict_label": verdict_label,
            "risk_score": final_risk_score,
            "confidence": model_confidence,
            "critical_anomalies": critical_anomaly_flags,
            "signals_summary": {
                "tampering_probability": signals.get("tampering_probability"),
                "signature_similarity": signals.get("signature_similarity"),
                "stamp_present": signals.get("stamp_present"),
                "cross_doc_consistency": signals.get("cross_doc_consistency"),
                "issuer_match": signals.get("issuer_match", True)
            },
            "evidence_list": evidence_list
        }


_fusion_engine = None

def get_fusion_engine() -> EvidenceFusionEngine:
    global _fusion_engine
    if _fusion_engine is None:
        _fusion_engine = EvidenceFusionEngine()
    return _fusion_engine

def fuse(signals: Dict[str, Any]) -> Dict[str, Any]:
    return get_fusion_engine().fuse(signals)
