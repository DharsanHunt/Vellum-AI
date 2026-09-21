"""
Screen 9: Verification History & Dossier Ledger.
Searchable historical ledger of all processed dossiers, reviewer decisions, and evidence archives.
"""

import sys
import json
from pathlib import Path
import pandas as pd
import streamlit as st

BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from frontend.design_system import render_status_badge


def render_verification_history():
    """Renders the searchable verification history ledger."""
    st.markdown('<div class="main-header">Verification History & Dossier Archive</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Search, inspect, and export historical verification decisions, reviewer notes, and forensic evidence logs.</div>', unsafe_allow_html=True)

    # Filter Bar
    c_f1, c_f2, c_f3 = st.columns([1.5, 1.2, 1.3])
    with c_f1:
        query = st.text_input("🔍 Search History by Candidate, ID, or Institution:", placeholder="e.g. Arun Kumar, CERT_00001, Apex")
    with c_f2:
        verdict_filter = st.selectbox("Verdict Filter:", ["All Verdicts", "APPROVED", "ESCALATED", "REJECTED"])
    with c_f3:
        time_filter = st.selectbox("Timeframe:", ["Past 24 Hours", "Past 7 Days", "Past 30 Days", "All History"])

    # Base History Dataset
    history_records = [
        {"Case ID": "CASE-0001", "Date": "2024-10-24 14:22 UTC", "Candidate": "Arun Kumar", "Institution": "Apex University of Technology", "Doc Type": "Degree Certificate", "Verdict": "APPROVED", "Risk Score": "12.4%", "Reviewer": "Officer REV-810", "Reason": "Clean Credential - Verified Genuine"},
        {"Case ID": "CASE-0002", "Date": "2024-10-24 13:45 UTC", "Candidate": "Kavita Sharma", "Institution": "National Institute of Science", "Doc Type": "Transcript", "Verdict": "REJECTED", "Risk Score": "91.2%", "Reviewer": "Lead REV-102", "Reason": "Pixel Splicing Anomaly in GPA"},
        {"Case ID": "CASE-0003", "Date": "2024-10-24 12:10 UTC", "Candidate": "Rohan Verma", "Institution": "Metropolitan University", "Doc Type": "Recommendation Letter", "Verdict": "ESCALATED", "Risk Score": "48.5%", "Reviewer": "Officer REV-810", "Reason": "Secondary Manual Investigation Required"},
        {"Case ID": "CASE-0004", "Date": "2024-10-23 18:30 UTC", "Candidate": "Priya Nair", "Institution": "Apex University of Technology", "Doc Type": "Degree Certificate", "Verdict": "APPROVED", "Risk Score": "8.7%", "Reviewer": "Officer REV-441", "Reason": "Clean Credential - Verified Genuine"},
        {"Case ID": "CASE-0005", "Date": "2024-10-23 16:15 UTC", "Candidate": "Sanjay Patel", "Institution": "Counterfeit Polytechnic", "Doc Type": "Degree Certificate", "Verdict": "REJECTED", "Risk Score": "98.5%", "Reviewer": "Lead REV-102", "Reason": "Unaccredited Counterfeit Institution"},
        {"Case ID": "CASE-0006", "Date": "2024-10-23 11:00 UTC", "Candidate": "Deepak Mehta", "Institution": "Apex University of Technology", "Doc Type": "Transcript", "Verdict": "APPROVED", "Risk Score": "14.1%", "Reviewer": "Officer REV-810", "Reason": "Clean Credential - Verified Genuine"}
    ]

    # Append any dynamic session logs
    if "audit_log" in st.session_state and st.session_state.audit_log:
        for item in st.session_state.audit_log:
            history_records.insert(0, {
                "Case ID": item.get("case_id", "CASE-NEW"),
                "Date": item.get("timestamp", "Just Now"),
                "Candidate": item.get("candidate", "Candidate"),
                "Institution": "Apex University of Technology",
                "Doc Type": "Academic Certificate",
                "Verdict": item.get("verdict", "APPROVED"),
                "Risk Score": f"{round(item.get('risk_score', 0.1)*100, 1)}%",
                "Reviewer": item.get("reviewer", "Admissions Officer"),
                "Reason": item.get("reason", "Standard Review")
            })

    # Apply Filters
    if query:
        history_records = [r for r in history_records if query.lower() in r["Candidate"].lower() or query.lower() in r["Case ID"].lower() or query.lower() in r["Institution"].lower()]
    if verdict_filter != "All Verdicts":
        history_records = [r for r in history_records if r["Verdict"] == verdict_filter]

    st.markdown("<div style='height: 12px;'></div>", unsafe_allow_html=True)
    
    # Table Display
    st.table(history_records)

    # Export Buttons
    c_exp1, c_exp2, _ = st.columns([1, 1, 2])
    with c_exp1:
        df = pd.DataFrame(history_records)
        csv_data = df.to_csv(index=False).encode('utf-8')
        st.download_button("📥 Export CSV Ledger", data=csv_data, file_name="verification_history.csv", mime="text/csv")
    with c_exp2:
        json_data = json.dumps(history_records, indent=2).encode('utf-8')
        st.download_button("📥 Export JSON Archive", data=json_data, file_name="verification_history.json", mime="application/json")
