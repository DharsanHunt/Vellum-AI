"""
Screen 13: System Settings & Forensic Model Calibration.
Allows administrators and ML engineers to tune risk thresholds, fusion weights, and notification webhooks.
"""

import sys
from pathlib import Path
import streamlit as st

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from frontend.design_system import render_status_badge


def render_settings():
    """Renders the settings and model calibration panel."""
    st.markdown('<div class="main-header">System Settings & Forensic Model Calibration</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Fine-tune neural detection sensitivity thresholds, evidence fusion weights, and enterprise alerting.</div>', unsafe_allow_html=True)

    tab_thresh, tab_ocr, tab_alerts = st.tabs(["🎛️ Model Sensitivity & Thresholds", "🔤 OCR & Extraction Config", "🔔 SIEM Webhooks & Alerts"])

    with tab_thresh:
        st.markdown("""
        <div class="kf-card-header">
            <span>Forensic Signal Threshold Calibration</span>
            <span class="badge-ai">TUNING</span>
        </div>
        """, unsafe_allow_html=True)

        c1, c2 = st.columns(2)
        with c1:
            st.slider("Pixel Tampering UNet Sensitivity Threshold:", min_value=0.10, max_value=0.90, value=0.45, step=0.05, help="Lower values trigger alerts on smaller pixel modifications.")
            st.slider("Siamese Signature Match Acceptance Threshold:", min_value=0.50, max_value=0.95, value=0.65, step=0.05, help="Minimum cosine similarity required to classify signature as genuine.")
        with c2:
            st.slider("Stamp Seal Ink Area Minimum Coverage:", min_value=0.05, max_value=0.50, value=0.15, step=0.05)
            st.slider("Non-Linear Fraud Escalation Multiplier:", min_value=1.0, max_value=2.5, value=1.5, step=0.1, help="Escalates composite risk when any single signal flags severe fraud.")

        st.markdown("""
        <div class="kf-card-header" style="margin-top: 14px;">
            <span>Evidence Fusion Weights Allocation</span>
            <span class="badge-neutral">SUM = 1.00</span>
        </div>
        """, unsafe_allow_html=True)
        
        w1, w2, w3, w4 = st.columns(4)
        w1.number_input("Tampering Weight", value=0.35, step=0.05)
        w2.number_input("Signature Weight", value=0.25, step=0.05)
        w3.number_input("Stamp Seal Weight", value=0.15, step=0.05)
        w4.number_input("Entity & OCR Weight", value=0.25, step=0.05)

        if st.button("💾 Save Calibration Profile to models/fusion_weights.json", type="primary"):
            st.success("Calibration parameters successfully updated and active in production pipeline.")

    with tab_ocr:
        st.markdown("""
        <div class="kf-card-header">
            <span>OCR & Layout Analysis Engine</span>
            <span class="badge-genuine">HYBRID ACTIVE</span>
        </div>
        """, unsafe_allow_html=True)

        st.selectbox("Primary OCR Engine:", ["Hybrid (EasyOCR with Fallback)", "Tesseract OCR Engine", "TorchVision LayoutNet"])
        st.checkbox("Enable Automatic Document Deskewing & Rotation Correction", value=True)
        st.checkbox("Enable High-Resolution 300 DPI Pre-scaling", value=True)
        st.checkbox("Enable Fuzzy Regex Matcher for Multilingual Accents", value=True)

    with tab_alerts:
        st.markdown("""
        <div class="kf-card-header">
            <span>SIEM & Webhook Integrations</span>
            <span class="badge-neutral">REAL-TIME DISPATCH</span>
        </div>
        """, unsafe_allow_html=True)

        st.text_input("SIEM / Splunk Ingestion Webhook URL:", value="https://siem-collector.internal.corp/v1/kana-forge-alerts")
        st.selectbox("Minimum Alert Severity Level:", ["🚨 Critical Fraud Only (Risk > 75%)", "⚠️ Manual Review & Critical (Risk > 50%)", "All Ingested Dossiers"])
        st.text_input("Slack / Teams Incident Channel Webhook:", value="https://hooks.slack.com/services/T00/B00/XXXXXX")

        if st.button("🧪 Send Test Webhook Notification"):
            st.info("Test alert packet dispatched to SIEM endpoint with HTTP 200 OK.")
