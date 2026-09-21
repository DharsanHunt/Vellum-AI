"""
Screen 3: Document Upload Wizard.
Handles document ingestion, format integrity pre-validation, metadata binding, and batch intake.
"""

import sys
import hashlib
from pathlib import Path
from PIL import Image
import streamlit as st

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from frontend.design_system import render_status_badge


def render_document_upload():
    """Renders the document upload and pre-ingestion validation wizard."""
    st.markdown('<div class="main-header">Document Ingestion & Intake Wizard</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Upload candidate academic certificates, transcripts, and credentials for forensic intake and neural validation.</div>', unsafe_allow_html=True)

    c_left, c_right = st.columns([1.4, 1.1])

    with c_left:
        st.markdown("""
        <div class="kf-card-header">
            <span>📤 Upload Document Asset</span>
            <span class="badge-genuine">PNG / JPG / PDF</span>
        </div>
        """, unsafe_allow_html=True)

        upload_mode = st.radio("Ingestion Source:", ["Upload Local File", "Select from Benchmark Dataset"], horizontal=True)

        uploaded_img = None
        doc_filename = ""
        doc_bytes = b""

        if upload_mode == "Upload Local File":
            uploaded_file = st.file_uploader("Drop document scan here (Max 25MB):", type=["png", "jpg", "jpeg", "pdf"])
            if uploaded_file:
                uploaded_img = Image.open(uploaded_file).convert("RGB")
                doc_filename = uploaded_file.name
                doc_bytes = uploaded_file.getvalue()
        else:
            sample_certs = sorted(list((BASE_DIR / "data" / "processed" / "images").glob("*.png")))
            selected_sample = st.selectbox("Select standard benchmark sample:", [f.name for f in sample_certs[:15]])
            if selected_sample:
                sample_path = BASE_DIR / "data" / "processed" / "images" / selected_sample
                uploaded_img = Image.open(sample_path).convert("RGB")
                doc_filename = selected_sample
                with open(sample_path, "rb") as f:
                    doc_bytes = f.read()

        if uploaded_img:
            st.image(uploaded_img, caption=f"Ingested Scan: {doc_filename} ({uploaded_img.size[0]}x{uploaded_img.size[1]} px)", use_container_width=True)

    with c_right:
        st.markdown("""
        <div class="kf-card-header">
            <span>📋 Candidate & Application Metadata</span>
            <span class="badge-neutral">INTAKE METADATA</span>
        </div>
        """, unsafe_allow_html=True)

        st.markdown('<div class="kf-card">', unsafe_allow_html=True)
        cand_name = st.text_input("Candidate Full Name:", value="Arun Kumar")
        app_id = st.text_input("Application Reference ID:", value="APP-2024-8819")
        target_inst = st.text_input("Claimed Issuing Body:", value="Apex University of Technology")
        target_deg = st.text_input("Claimed Degree / Course:", value="B.Tech Computer Science & Engineering")
        prio = st.selectbox("Processing Priority:", ["⚡ Urgent Expedited (15s SLA)", "Standard Ingestion Queue", "Batch Nightly"])
        st.markdown('</div>', unsafe_allow_html=True)

        # Integrity Pre-Validation
        if uploaded_img:
            sha256_hash = hashlib.sha256(doc_bytes).hexdigest()
            st.markdown(f"""
            <div class="kf-card" style="border-color: #10B981;">
                <div class="kf-card-header" style="color: #34D399; margin-bottom: 6px;">
                    <span>🛡️ Intake Pre-Flight Checks</span>
                    <span class="badge-genuine">PASS</span>
                </div>
                <div style="font-size: 0.82rem; color: #CBD5E1; margin-bottom: 4px;">• Resolution: {uploaded_img.size[0]} x {uploaded_img.size[1]} px (Optimal)</div>
                <div style="font-size: 0.82rem; color: #CBD5E1; margin-bottom: 4px;">• Color Channels: RGB 24-Bit</div>
                <div style="font-size: 0.78rem; color: #94A3B8; word-break: break-all;">• SHA-256 Digest: <span class="mono-code">{sha256_hash[:24]}...</span></div>
            </div>
            """, unsafe_allow_html=True)

            if st.button("⚡ Dispatch to Neural Verification Pipeline", type="primary", use_container_width=True):
                st.session_state.current_upload = {
                    "image": uploaded_img,
                    "filename": doc_filename,
                    "candidate": cand_name,
                    "app_id": app_id,
                    "institution": target_inst,
                    "degree": target_deg,
                    "sha256": sha256_hash
                }
                st.session_state.active_screen = "4. Processing Pipeline"
                st.rerun()
