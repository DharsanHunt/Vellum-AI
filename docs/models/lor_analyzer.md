# Recommendation Letter (LOR) NLP & Plagiarism Analyzer Documentation

## 1. Purpose
Analyzes Letters of Recommendation (LORs) for boilerplate plagiarism, semantic specificity, recommender claims (projects, skills, superlatives), and cross-checks candidate entity consistency.

## 2. Model Specifications
- **Input**: Raw text body or document image + optional candidate profile dictionary.
- **Output**:
  - `status`: `AUTHENTIC_LIKE`, `SUSPICIOUS`, `CONFLICT`
  - `coherence_score`: float `[0.0, 1.0]`
  - `template_plagiarism_score`: float `[0.0, 1.0]`
  - `is_template_duplicate`: bool
  - `extracted_entities`: Dict of extracted names, titles, organizations
  - `claims`: Extracted research project titles and superlative rankings
  - `conflicts`: Detailed itemization of contradictions against verified profile
- **Dataset**: Synthetic-LOR-10K benchmark across 9 anomaly classes.
- **Evaluation Metrics (Test Split - 24 samples)**:
  - Accuracy: **75.0%**
  - Precision: **75.0%**
  - Recall: **100.0%**
  - F1 Score: **85.71%**
- **License**: MIT
