# Kana-Forge Design System & Information Architecture Specification

## 1. Design Token Architecture

```css
:root {
  /* Surface & Base Tokens */
  --kf-bg-app: #0B0F17;            /* Deep obsidian slate background */
  --kf-bg-card: #111827;           /* Card background */
  --kf-bg-elevated: #1F2937;       /* Elevated drawers & popups */
  --kf-bg-subtle: #1E293B;         /* Table headers and input backgrounds */
  
  --kf-border-subtle: #2D3748;     /* 1px subtle divider */
  --kf-border-strong: #4A5568;     /* Focused / active borders */
  --kf-border-accent: #6366F1;     /* Primary brand outline */

  /* Text & Foreground Tokens */
  --kf-text-primary: #F9FAFB;      /* 100% white-slate high contrast */
  --kf-text-secondary: #94A3B8;    /* Muted label / subtext */
  --kf-text-tertiary: #64748B;     /* Placeholder and timestamp text */

  /* Semantic Feedback & Verification Status Tokens */
  --kf-color-genuine: #10B981;     /* Emerald Green - Verified */
  --kf-color-genuine-bg: rgba(16, 185, 129, 0.12);
  --kf-color-warning: #F59E0B;     /* Amber Yellow - Minor Variation / Manual Review */
  --kf-color-warning-bg: rgba(245, 158, 11, 0.12);
  --kf-color-danger: #EF4444;      /* Crimson Red - Fraud / Tampering Detected */
  --kf-color-danger-bg: rgba(239, 68, 68, 0.14);
  --kf-color-ai-violet: #8B5CF6;   /* AI / Neural Model Layer */
  --kf-color-ai-violet-bg: rgba(139, 92, 246, 0.15);
  --kf-color-info-blue: #3B82F6;   /* Info / Active Selection */
  --kf-color-info-blue-bg: rgba(59, 130, 246, 0.12);

  /* Typography Scale */
  --kf-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --kf-font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --kf-text-xs: 0.75rem;    /* 12px - Badges, captions */
  --kf-text-sm: 0.875rem;   /* 14px - Body, table rows, form inputs */
  --kf-text-base: 1.0rem;   /* 16px - Section body */
  --kf-text-lg: 1.125rem;   /* 18px - Card headings */
  --kf-text-xl: 1.375rem;   /* 22px - Subtitles, screen headers */
  --kf-text-2xl: 1.875rem;  /* 30px - Hero metrics & risk scores */

  /* 8pt Spacing Grid */
  --kf-space-1: 4px;
  --kf-space-2: 8px;
  --kf-space-3: 12px;
  --kf-space-4: 16px;
  --kf-space-6: 24px;
  --kf-space-8: 32px;

  /* Elevation & Curves */
  --kf-radius-sm: 4px;
  --kf-radius-md: 8px;
  --kf-radius-lg: 12px;
  --kf-radius-pill: 9999px;
  --kf-shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.18);
  --kf-shadow-glow-danger: 0 0 15px rgba(239, 68, 68, 0.35);
  --kf-shadow-glow-genuine: 0 0 15px rgba(16, 185, 129, 0.35);
}
```

---

## 2. Complete Information Architecture (13 Key Screens)

```
Kana-Forge Application Navigation
├── 1. Login & Identity Access Management (MFA / Role-Based Access)
├── 2. Executive Dashboard & Live Case Queue
├── 3. Document Ingestion & Upload Wizard
├── 4. Real-Time Neural Processing & Pipeline Execution State
├── 5. Verification Workspace (Core Human-in-the-Loop Triage)
├── 6. Multi-Layer Document Viewer Canvas
├── 7. AI Findings & Explainability Provenance Panel
├── 8. Manual Review & Escalation Workflow
├── 9. Verification History & Search Filter Catalog
├── 10. Cryptographic & Regulatory Audit Trail
├── 11. Fraud Telemetry & Verification Analytics
├── 12. Institutional Administration & API Keys
└── 13. System Settings & Model Hyperparameter Tuning
```
