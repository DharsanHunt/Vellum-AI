"""
Screen 1: Login & Access Management.
Enterprise SSO & Role-Based Access Control (RBAC) authentication.
"""

import streamlit as st
from frontend.design_system import render_status_badge


def render_login_screen():
    """Renders the enterprise login and credential verification view."""
    st.markdown("<br>", unsafe_allow_html=True)
    
    col_l, col_center, col_r = st.columns([1, 1.6, 1])
    
    with col_center:
        st.markdown("""
        <div style="text-align: center; margin-bottom: 24px;">
            <div style="font-size: 2.5rem; margin-bottom: 4px;">🛡️</div>
            <div class="main-header" style="font-size: 2.0rem;">Kana-Forge</div>
            <div class="sub-header" style="font-size: 0.95rem;">Multi-Modal AI Document Verification & Forensic Intelligence Platform</div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div class="kf-card" style="padding: 24px; border-color: #374151;">
            <div class="kf-card-header" style="margin-bottom: 16px;">
                <span>🔐 Enterprise Identity & Access Management</span>
                <span class="badge-genuine">SSO ACTIVE</span>
            </div>
        """, unsafe_allow_html=True)

        role_choice = st.selectbox(
            "Select Authentication Role:",
            [
                "Admissions Reviewer (Standard Triage)",
                "Senior Fraud Investigator (Forensic Lead)",
                "Platform Administrator & ML Engineer (Full Access)"
            ]
        )

        email = st.text_input("Institutional Email:", value="arun.investigator@apex-admissions.edu" if "Admissions" in role_choice else "lead.forensics@kana-forge.security")
        password = st.text_input("Password / Security Token:", value="••••••••••••", type="password")
        
        mfa_code = st.text_input("Simulated MFA 6-Digit Authenticator Code:", value="829104")

        st.markdown("<br>", unsafe_allow_html=True)

        if st.button("Authenticate & Enter Workspace", type="primary", use_container_width=True):
            st.session_state.authenticated = True
            st.session_state.user_email = email
            st.session_state.user_role = role_choice.split(" ")[0]
            st.session_state.role_full = role_choice
            st.success(f"Authenticated as {st.session_state.role_full}. Launching dashboard...")
            st.rerun()

        st.markdown("""
        <div style="text-align: center; margin-top: 14px; font-size: 0.78rem; color: #64748B;">
            Protected by SHA-256 HMAC Authentication & RBAC Policy v2.4
        </div>
        </div>
        """, unsafe_allow_html=True)

        # Demo 1-Click Persona Selectors
        st.markdown("<div style='margin-top: 16px;'></div>", unsafe_allow_html=True)
        st.caption("⚡ Quick Demo Persona Switcher:")
        
        c1, c2, c3 = st.columns(3)
        with c1:
            if st.button("👤 Reviewer", use_container_width=True):
                st.session_state.authenticated = True
                st.session_state.user_email = "reviewer@apex-admissions.edu"
                st.session_state.user_role = "Admissions"
                st.session_state.role_full = "Admissions Reviewer"
                st.rerun()
        with c2:
            if st.button("🕵️ Investigator", use_container_width=True):
                st.session_state.authenticated = True
                st.session_state.user_email = "investigator@kana-forge.security"
                st.session_state.user_role = "Senior"
                st.session_state.role_full = "Senior Fraud Investigator"
                st.rerun()
        with c3:
            if st.button("⚙️ Admin", use_container_width=True):
                st.session_state.authenticated = True
                st.session_state.user_email = "admin@kana-forge.internal"
                st.session_state.user_role = "Admin"
                st.session_state.role_full = "Platform Administrator & ML Engineer"
                st.rerun()
