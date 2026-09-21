# Recommendation Letter (LOR-10K) Research Corpus Documentation

## 1. Overview & Purpose
Because large public genuine-vs-fraudulent recommendation letter datasets are unavailable due to privacy regulations (FERPA / GDPR), this synthetic research dataset was generated using controlled linguistic and semantic manipulation to train and evaluate NLP entity consistency, template plagiarism, and cross-document discrepancy detection.

## 2. Dataset Metadata
- **Generator Script**: `scripts/generate_lor_dataset.py`
- **License**: MIT / Open Academic Research
- **Size**: ~15 MB
- **Samples**: 120 curated benchmark samples in repository (scalable to 10,000+).
- **Labels**: 9 Anomaly classes (`VALID`, `NAME_MISMATCH`, `INSTITUTION_MISMATCH`, `DATE_MISMATCH`, `DESIGNATION_MISMATCH`, `RELATIONSHIP_MISMATCH`, `PROJECT_MISMATCH`, `COPY_TEXT`, `CONTRADICTORY_CLAIM`).

## 3. Directory Layout
- Raw files: `/data/raw/lor/` and `/data/synthetic/lor/`
- Manifest: `/data/synthetic/lor/lor_dataset_manifest.json`
