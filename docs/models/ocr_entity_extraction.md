# OCR & Information Extraction Pipeline Documentation

## 1. Purpose
Extracts text lines, spatial bounding boxes, confidence scores, and structured academic entities (`student_name`, `institution`, `certificate_number`, `registration_number`, `course`, `degree`, `dates`, `marks`, `cgpa`, `percentage`, `recommender`, `relationship`).

## 2. Architecture & Approach
- **OCR Layer (`ml/ocr/ocr_service.py`)**: Multi-backend engine supporting PaddleOCR, PyTesseract, and native Computer Vision Adaptive Layout Bounding-Box extraction.
- **Entity Extraction Layer (`ml/nlp/entity_extractor.py`)**: Multi-strategy extraction combining:
  - Regex pattern matching for formatted identifiers (Cert IDs, Reg IDs, CGPA, Percentages, Dates).
  - Spatial layout heuristics (Header lines for Institutions, Certify-that anchors for Student Names).
  - Fuzzy string matching (Levenshtein & Token Set ratios) with phonetic variation handling.

## 3. Key Outputs
- Structured JSON dictionary of normalized entity fields.
- Coordinate bounding boxes linked to each extracted entity for downstream spatial tampering overlap explanation.

## 4. License & Failure Cases
- **License**: MIT
- **Failure Cases**: Heavily curved or calligraphy script fonts; unconventional non-standardized diploma syntax.
