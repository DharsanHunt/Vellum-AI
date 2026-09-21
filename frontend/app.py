"""
Kana-Forge AI Document Verification Platform.
Complete 13-Screen Enterprise Application Router.
"""

import sys
from pathlib import Path
import streamlit as st

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from frontend.design_system import inject_custom_css, render_status_badge
from frontend.screens.login import render_login_screen
from frontend.screens.dashboard import render_dashboard
from frontend.screens.document_upload import render_document_upload
from frontend.screens.processing import render_processing_screen
from frontend.screens.verification_workspace import render_verification_workspace
from frontend.screens.verification_history import render_verification_history
from frontend.screens.audit_trail import render_audit_trail
from frontend.screens.analytics import render_analytics
from frontend.screens.administration import render_administration
from frontend.screens.settings import render_settings

# Page Configuration
st.set_page_config(
    page_title="Kana-Forge | AI Document Forensics",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Inject Dark Slate Design System CSS
inject_custom_css()

# Session State Initialization
if "authenticated" not in st.session_state:
    st.session_state.authenticated = True  # Default to authenticated for instant preview
    st.session_state.user_email = "lead.forensics@kana-forge.security"
    st.session_state.user_role = "Senior"
    st.session_state.role_full = "Senior Fraud Investigator"

if "active_screen" not in st.session_state:
    st.session_state.active_screen = "5. Verification Workspace"

# -------------------------------------------------------------
# AUTHENTICATION GATE
# -------------------------------------------------------------
if not st.session_state.authenticated:
    render_login_screen()
    st.stop()

# -------------------------------------------------------------
# SIDEBAR NAVIGATION
# -------------------------------------------------------------
with st.sidebar:
    st.markdown("""
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
        <span style="font-size: 1.8rem;">🛡️</span>
        <div>
            <div style="font-weight: 800; font-size: 1.25rem; color: #F8FAFC; letter-spacing: -0.02em;">Kana-Forge</div>
            <div style="font-size: 0.72rem; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em;">AI Forensic Intelligence</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # User Profile Pill
    st.markdown(f"""
    <div style="background-color: #111827; padding: 10px 12px; border-radius: 8px; border: 1px solid #1F2937; margin-bottom: 16px;">
        <div style="font-size: 0.75rem; color: #94A3B8;">Active Operator</div>
        <div style="font-weight: 600; font-size: 0.88rem; color: #F1F5F9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{st.session_state.role_full}</div>
        <div style="margin-top: 4px;">{render_status_badge('ONLINE')}</div>
    </div>
    """, unsafe_allow_html=True)

    screen_list = [
        "1. Login & Access Control",
        "2. Operational Dashboard",
        "3. Document Ingestion Wizard",
        "4. Neural Processing Pipeline",
        "5. Verification Workspace",
        "9. Verification History",
        "10. Cryptographic Audit Trail",
        "11. Institutional Analytics",
        "12. Administration & RBAC",
        "13. System Settings & Calibration"
    ]

    selected_screen = st.radio(
        "Platform Navigation:",
        screen_list,
        index=screen_list.index(st.session_state.active_screen) if st.session_state.active_screen in screen_list else 4
    )
    st.session_state.active_screen = selected_screen

    st.markdown("---")
    if st.button("🚪 Logout Session", use_container_width=True):
        st.session_state.authenticated = False
        st.session_state.active_screen = "1. Login & Access Control"
        st.rerun()

    st.caption("Kana-Forge v2.4 | Enterprise Dark Theme")

# -------------------------------------------------------------
# SCREEN ROUTER
# -------------------------------------------------------------
if st.session_state.active_screen == "1. Login & Access Control":
    render_login_screen()

elif st.session_state.active_screen == "2. Operational Dashboard":
    render_dashboard()

elif st.session_state.active_screen == "3. Document Ingestion Wizard":
    render_document_upload()

elif st.session_state.active_screen == "4. Neural Processing Pipeline":
    render_processing_screen()

elif st.session_state.active_screen == "5. Verification Workspace":
    render_verification_workspace()

elif st.session_state.active_screen == "9. Verification History":
    render_verification_history()

elif st.session_state.active_screen == "10. Cryptographic Audit Trail":
    render_audit_trail()

elif st.session_state.active_screen == "11. Institutional Analytics":
    render_analytics()

elif st.session_state.active_screen == "12. Administration & RBAC":
    render_administration()

elif st.session_state.active_screen == "13. System Settings & Calibration":
    render_settings()
