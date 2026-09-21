# Academic Certificate Image Dataset Documentation

## 1. Overview & Purpose
The Academic Certificate Image Dataset comprises scanned diplomas, graduation certificates, degree titles, and transcripts from international universities and technical colleges. It provides baseline document layout templates and visual features for document category classification and entity field positioning.

## 2. Dataset Metadata
- **Official Repository**: https://github.com/hassan-sakhi/Certificate-Classification-Dataset
- **License**: Creative Commons Attribution 4.0 (CC BY 4.0)
- **Size**: ~250 MB
- **Samples**: ~1,500 real & synthetic templates
- **Annotations**: Document category (`Degree`, `Diploma`, `Participation`, `Achievement`), institution names, spatial text blocks.

## 3. Integration & Preprocessing
- Image dimension normalization: resized to 224x224 (for classification) and 1000x700 for full OCR layout parsing.
- RGB color standardization with SHA-256 integrity verification.
- Augmented with controlled synthetic forged variants in Kana-Forge.

## 4. Limitations & Manual Access
- **Limitations**: Original repository contains primarily clean document scans with minimal localized forgery annotations.
- **Manual Access**: Publicly accessible; automated download handled via `scripts/download_datasets.py`.
