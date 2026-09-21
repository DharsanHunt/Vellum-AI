"""
Kana-Forge Design System & Theme Components.
Implements reusable enterprise UI components, semantic status badges,
risk meters, and CSS tokens for all 13 application screens.
"""

import streamlit as st


def inject_custom_css():
    """Injects high-contrast, modern dark-slate enterprise theme CSS."""
    st.markdown("""
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        /* Base typography & resets */
        html, body, [class*="css"] {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #F8FAFC;
        }
        
        /* Headers */
        .main-header {
            font-size: 1.85rem;
            font-weight: 700;
            color: #F8FAFC;
            letter-spacing: -0.02em;
            margin-bottom: 2px;
        }
        
        .sub-header {
            font-size: 0.92rem;
            color: #94A3B8;
            margin-bottom: 20px;
            line-height: 1.4;
        }
        
        /* Premium Card Containers */
        .kf-card {
            background-color: #111827;
            border: 1px solid #1F2937;
            border-radius: 10px;
            padding: 16px;
            margin-bottom: 14px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25);
        }
        
        .kf-card:hover {
            border-color: #374151;
        }
        
        .kf-card-header {
            font-size: 1.0rem;
            font-weight: 600;
            color: #F1F5F9;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        /* Status Badge System */
        .badge-genuine {
            background-color: rgba(16, 185, 129, 0.15);
            color: #34D399;
            border: 1px solid rgba(16, 185, 129, 0.35);
            padding: 3px 10px;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 0.75rem;
            letter-spacing: 0.03em;
            text-transform: uppercase;
            display: inline-block;
        }
        
        .badge-warning {
            background-color: rgba(245, 158, 11, 0.15);
            color: #FBBF24;
            border: 1px solid rgba(245, 158, 11, 0.35);
            padding: 3px 10px;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 0.75rem;
            letter-spacing: 0.03em;
            text-transform: uppercase;
            display: inline-block;
        }
        
        .badge-danger {
            background-color: rgba(239, 68, 68, 0.15);
            color: #F87171;
            border: 1px solid rgba(239, 68, 68, 0.35);
            padding: 3px 10px;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 0.75rem;
            letter-spacing: 0.03em;
            text-transform: uppercase;
            display: inline-block;
        }
        
        .badge-ai {
            background-color: rgba(139, 92, 246, 0.15);
            color: #A78BFA;
            border: 1px solid rgba(139, 92, 246, 0.35);
            padding: 3px 10px;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 0.75rem;
            letter-spacing: 0.03em;
            text-transform: uppercase;
            display: inline-block;
        }

        .badge-neutral {
            background-color: rgba(100, 116, 139, 0.15);
            color: #94A3B8;
            border: 1px solid rgba(100, 116, 139, 0.30);
            padding: 3px 10px;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 0.75rem;
            letter-spacing: 0.03em;
            text-transform: uppercase;
            display: inline-block;
        }

        /* Monospace Data Snippets */
        .mono-code {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.82rem;
            color: #E2E8F0;
            background-color: #0F172A;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid #1E293B;
        }

        /* Keyboard Shortcut Badges */
        .kbd-key {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.72rem;
            color: #CBD5E1;
            background-color: #1F2937;
            border: 1px solid #374151;
            border-bottom: 2px solid #4B5563;
            padding: 1px 5px;
            border-radius: 3px;
            margin-right: 4px;
        }

        /* Risk Gauge Meter Component */
        .risk-meter-container {
            background-color: #1F2937;
            border-radius: 9999px;
            height: 10px;
            width: 100%;
            overflow: hidden;
            margin: 8px 0;
        }
        
        .risk-meter-fill {
            height: 100%;
            border-radius: 9999px;
            transition: width 0.4s ease-out;
        }
        
        /* KPI Cards */
        .kpi-card {
            background-color: #111827;
            border: 1px solid #1F2937;
            border-radius: 10px;
            padding: 16px;
            text-align: left;
        }
        
        .kpi-label {
            font-size: 0.80rem;
            font-weight: 500;
            color: #94A3B8;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        
        .kpi-value {
            font-size: 1.8rem;
            font-weight: 700;
            color: #F8FAFC;
            margin: 4px 0;
            font-family: 'Inter', sans-serif;
        }
        
        .kpi-delta {
            font-size: 0.78rem;
            font-weight: 500;
        }
        
        .kpi-delta-up { color: #34D399; }
        .kpi-delta-down { color: #F87171; }
        .kpi-delta-neutral { color: #94A3B8; }

        /* Step Pipeline Progress */
        .step-pill {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 6px;
            background-color: #111827;
            border: 1px solid #1F2937;
            margin-bottom: 6px;
        }
        
        .step-pill-active {
            border-color: #8B5CF6;
            background-color: rgba(139, 92, 246, 0.08);
        }

        .step-pill-done {
            border-color: #10B981;
            background-color: rgba(16, 185, 129, 0.08);
        }

        /* Table custom styling */
        div[data-testid="stTable"] table {
            background-color: #111827;
            color: #F8FAFC;
            border-collapse: collapse;
            border-radius: 8px;
            overflow: hidden;
            width: 100%;
        }
        
        div[data-testid="stTable"] th {
            background-color: #1F2937;
            color: #CBD5E1;
            font-weight: 600;
            font-size: 0.82rem;
            padding: 10px 12px;
        }
        
        div[data-testid="stTable"] td {
            border-top: 1px solid #1F2937;
            font-size: 0.82rem;
            padding: 8px 12px;
        }
    </style>
    """, unsafe_allow_html=True)


def render_status_badge(status: str) -> str:
    """Renders high-visibility HTML status badge."""
    status_upper = str(status).upper()
    if any(k in status_upper for k in ["GENUINE", "AUTHENTIC", "PASS", "MATCH", "ACCREDITED", "CLEAN", "VALID"]):
        return f'<span class="badge-genuine">{status}</span>'
    elif any(k in status_upper for k in ["MANUAL", "REVIEW", "WARNING", "VARIATION", "PENDING", "EVAL"]):
        return f'<span class="badge-warning">{status}</span>'
    elif any(k in status_upper for k in ["FRAUD", "TAMPER", "FAIL", "CONFLICT", "SUSPICIOUS", "REJECT", "CRITICAL"]):
        return f'<span class="badge-danger">{status}</span>'
    elif any(k in status_upper for k in ["AI", "PIPELINE", "TRIAGE", "PROCESSING"]):
        return f'<span class="badge-ai">{status}</span>'
    else:
        return f'<span class="badge-neutral">{status}</span>'


def render_risk_gauge(risk_score: float, label: str = "Composite Forensic Risk"):
    """Renders calibrated visual risk progress bar."""
    pct = round(risk_score * 100, 1)
    if risk_score <= 0.25:
        color = "#10B981"
        badge = '<span class="badge-genuine">AUTHENTIC (LOW RISK)</span>'
    elif risk_score <= 0.50:
        color = "#F59E0B"
        badge = '<span class="badge-warning">EVALUATION REQUIRED</span>'
    elif risk_score <= 0.75:
        color = "#F97316"
        badge = '<span class="badge-warning">SUSPICIOUS ANOMALY</span>'
    else:
        color = "#EF4444"
        badge = '<span class="badge-danger">CRITICAL FRAUD ALERT</span>'

    st.markdown(f"""
    <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-weight: 600; font-size: 0.88rem; color: #CBD5E1;">{label}</span>
            <span style="font-weight: 700; font-size: 1.15rem; color: {color};">{pct}%</span>
        </div>
        <div class="risk-meter-container">
            <div class="risk-meter-fill" style="width: {pct}%; background-color: {color};"></div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
            {badge}
            <span style="font-size: 0.72rem; color: #64748B;">Calibrated via Evidence Fusion</span>
        </div>
    </div>
    """, unsafe_allow_html=True)


def render_kpi_card(label: str, value: str, delta: str = None, delta_type: str = "neutral"):
    """Renders high-density executive KPI card."""
    delta_class = f"kpi-delta kpi-delta-{delta_type}"
    delta_html = f'<div class="{delta_class}">{delta}</div>' if delta else ""
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-label">{label}</div>
        <div class="kpi-value">{value}</div>
        {delta_html}
    </div>
    """, unsafe_allow_html=True)
