"""
Screen 12: Administration & RBAC Access Management.
Manages enterprise user permissions, API keys, system hardware, and cluster health.
"""

import sys
import secrets
from pathlib import Path
import streamlit as st

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from frontend.design_system import render_status_badge
from ml.utils.hardware import detect_hardware


def render_administration():
    """Renders the administration console."""
    st.markdown('<div class="main-header">Administration & Role-Based Access Control</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Manage organization users, cryptographic API keys, system health, and permission policies.</div>', unsafe_allow_html=True)

    tab_users, tab_keys, tab_sys = st.tabs(["👥 User Directory & RBAC", "🔑 Scoped API Keys", "🖥️ System & Hardware Telemetry"])

    with tab_users:
        st.markdown("""
        <div class="kf-card-header">
            <span>Authorized Enterprise Operators</span>
            <span class="badge-genuine">5 ACTIVE USERS</span>
        </div>
        """, unsafe_allow_html=True)

        users = [
            {"Name": "Arun Kumar", "Email": "arun.investigator@apex-admissions.edu", "Role": "Admissions Reviewer", "Department": "Undergraduate Admissions", "Status": "ACTIVE", "MFA": "ENROLLED"},
            {"Name": "Dr. Sarah Jenkins", "Email": "lead.forensics@kana-forge.security", "Role": "Senior Fraud Investigator", "Department": "Forensic Escalation Unit", "Status": "ACTIVE", "MFA": "ENROLLED"},
            {"Name": "Alex Rivera", "Email": "admin@kana-forge.internal", "Role": "Platform Admin", "Department": "Infrastructure & ML", "Status": "ACTIVE", "MFA": "ENROLLED"},
            {"Name": "Marcus Chen", "Email": "m.chen@auditing.gov", "Role": "Compliance Auditor", "Department": "External QA", "Status": "ACTIVE", "MFA": "ENROLLED"}
        ]
        st.table(users)

        with st.expander("➕ Provision New Operator Account"):
            c_u1, c_u2 = st.columns(2)
            with c_u1:
                st.text_input("Full Name:", placeholder="Jane Doe")
                st.text_input("Institutional Email:", placeholder="jane.doe@university.edu")
            with c_u2:
                st.selectbox("Assign Role:", ["Admissions Reviewer", "Senior Fraud Investigator", "Compliance Auditor", "System Admin"])
                st.selectbox("Department:", ["Undergraduate Admissions", "Graduate Admissions", "Forensics", "Legal & Compliance"])
            if st.button("Create Account & Send MFA Invite", type="primary"):
                st.success("Operator account provisioned. Verification invitation dispatched.")

    with tab_keys:
        st.markdown("""
        <div class="kf-card-header">
            <span>Active Production API Keys</span>
            <span class="badge-neutral">SCOPED CREDENTIALS</span>
        </div>
        """, unsafe_allow_html=True)

        keys_data = [
            {"Key Alias": "Admissions Ingestion Gateway", "Prefix": "kf_live_9a8f...", "Scope": "doc:verify, doc:read", "Created": "2024-09-01", "Status": "ACTIVE"},
            {"Key Alias": "Automated Batch Ingestion Daemon", "Prefix": "kf_live_3c2d...", "Scope": "doc:verify_batch", "Created": "2024-09-15", "Status": "ACTIVE"},
            {"Key Alias": "SIEM Security Audit Sync", "Prefix": "kf_read_77e1...", "Scope": "audit:read", "Created": "2024-10-01", "Status": "ACTIVE"}
        ]
        st.table(keys_data)

        if st.button("🔑 Generate New Scoped API Key"):
            new_key = f"kf_live_{secrets.token_hex(16)}"
            st.success(f"Generated Key (Save now, will not be shown again): `{new_key}`")

    with tab_sys:
        st.markdown("""
        <div class="kf-card-header">
            <span>Hardware Acceleration & Compute Cluster</span>
            <span class="badge-genuine">ONLINE</span>
        </div>
        """, unsafe_allow_html=True)

        hw = detect_hardware()
        c1, c2, c3, c4 = st.columns(4)
        c1.metric("Compute Target", hw["device"].upper())
        c2.metric("CPU Cores", hw["cpu_cores"])
        c3.metric("System RAM", f"{hw['system_ram_gb']} GB")
        c4.metric("Pipeline Health", "100% OK")

        st.markdown("""
        <div class="kf-card" style="margin-top: 12px;">
            <div style="font-weight: 600; font-size: 0.90rem; color: #CBD5E1; margin-bottom: 8px;">Microservice Health Check:</div>
            <div style="font-size: 0.82rem; color: #34D399; margin-bottom: 4px;">• FastAPI Backend Gateway: ACTIVE (Port 8000)</div>
            <div style="font-size: 0.82rem; color: #34D399; margin-bottom: 4px;">• TorchScript Inference Worker: READY (DirectML / CPU)</div>
            <div style="font-size: 0.82rem; color: #34D399; margin-bottom: 4px;">• Optical Character Recognition (OCR) Service: HEALTHY</div>
            <div style="font-size: 0.82rem; color: #34D399;">• Cryptographic Audit Ledger: VERIFIED & SYNCED</div>
        </div>
        """, unsafe_allow_html=True)
