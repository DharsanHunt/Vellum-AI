"""
Screen 2: Executive Dashboard & Live Case Queue.
Displays operational KPIs, real-time fraud triage queue, and queue status telemetry.
"""

import sys
from pathlib import Path
import streamlit as st
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from frontend.design_system import render_kpi_card, render_status_badge


def render_dashboard():
    """Renders the executive overview and live case triage queue."""
    st.markdown('<div class="main-header">Operational Dashboard & Triage Queue</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Real-time surveillance of ingested academic dossiers, forensic anomaly detection rates, and SLA queues.</div>', unsafe_allow_html=True)

    # 1. Executive KPI Metrics Row
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        render_kpi_card("Total Ingested", "1,482", "↑ 124 this week", "up")
    with c2:
        render_kpi_card("Verified Genuine", "84.6%", "↑ 2.1% accuracy", "up")
    with c3:
        render_kpi_card("Forensic Anomalies", "142", "🚨 9.6% fraud rate", "down")
    with c4:
        render_kpi_card("Pending Triage Queue", "18", "⏳ SLA: 1.4 hrs remaining", "neutral")

    st.markdown("<div style='height: 16px;'></div>", unsafe_allow_html=True)

    # 2. Queue Filter Bar
    st.markdown("""
    <div class="kf-card-header">
        <span>📋 Priority Verification Queue</span>
        <span style="font-size: 0.80rem; color: #94A3B8;">Auto-refreshing every 30s</span>
    </div>
    """, unsafe_allow_html=True)

    f_col1, f_col2, f_col3 = st.columns([1.5, 1.2, 1.3])
    with f_col1:
        search_query = st.text_input("🔍 Search by Candidate, Institution, or Dossier ID:", placeholder="e.g. Arun Kumar, Apex Univ, CERT_00003")
    with f_col2:
        tier_filter = st.selectbox("Filter Risk Tier:", ["All Tiers", "🚨 Critical Fraud (>75%)", "⚠️ Manual Review (25-75%)", "✅ Clean / Low Risk (<=25%)"])
    with f_col3:
        doc_filter = st.selectbox("Document Type:", ["All Types", "Academic Certificate", "Official Transcript", "Letter of Recommendation (LOR)"])

    # 3. Live Case Data
    sample_certs = sorted(list((BASE_DIR / "data" / "processed" / "images").glob("*.png")))[:12]
    
    # Generate mock rich triage queue from sample certs
    queue_data = [
        {"Case ID": f"CASE-{i:04d}", "File": f.name, "Candidate": f"Candidate {chr(65+i)}", "Institution": "Apex University of Tech" if i % 2 == 0 else "National Institute of Science", "Doc Type": "Academic Certificate", "Risk Score": f"{12 + (i*17)%82}%", "Risk Raw": (12 + (i*17)%82)/100.0, "Anomaly": "Pixel Splicing Detected" if (i*17)%82 > 50 else "Clean Scan", "Status": "CRITICAL FRAUD" if (i*17)%82 > 70 else ("MANUAL REVIEW" if (i*17)%82 > 35 else "GENUINE")}
        for i, f in enumerate(sample_certs)
    ]

    # Filter data
    filtered_data = queue_data
    if search_query:
        filtered_data = [d for d in filtered_data if search_query.lower() in d["Candidate"].lower() or search_query.lower() in d["Institution"].lower() or search_query.lower() in d["Case ID"].lower() or search_query.lower() in d["File"].lower()]
    
    if "Critical" in tier_filter:
        filtered_data = [d for d in filtered_data if d["Risk Raw"] > 0.70]
    elif "Manual" in tier_filter:
        filtered_data = [d for d in filtered_data if 0.25 <= d["Risk Raw"] <= 0.70]
    elif "Clean" in tier_filter:
        filtered_data = [d for d in filtered_data if d["Risk Raw"] < 0.25]

    # Display Queue
    for item in filtered_data:
        st.markdown(f"""
        <div class="kf-card" style="margin-bottom: 8px; padding: 12px 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; gap: 16px; align-items: center;">
                    <span class="mono-code" style="font-weight: 600;">{item['Case ID']}</span>
                    <div>
                        <span style="font-weight: 600; color: #F8FAFC; font-size: 0.95rem;">{item['Candidate']}</span>
                        <span style="font-size: 0.80rem; color: #94A3B8;"> &bull; {item['Institution']}</span>
                    </div>
                </div>
                <div style="display: flex; gap: 14px; align-items: center;">
                    <span style="font-size: 0.82rem; color: {'#F87171' if item['Risk Raw'] > 0.5 else '#34D399'}; font-weight: 600;">Risk: {item['Risk Score']}</span>
                    {render_status_badge(item['Status'])}
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

    # 4. Jump to Workspace Call to Action
    st.markdown("<br>", unsafe_allow_html=True)
    c_btn, _ = st.columns([1.5, 2.5])
    with c_btn:
        if st.button("🚀 Open Verification Workspace for Active Dossier", type="primary", use_container_width=True):
            st.session_state.active_screen = "5. Verification Workspace"
            st.rerun()
