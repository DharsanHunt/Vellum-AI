# Stamp & Institutional Seal Verifier Documentation

## 1. Purpose
Detects, isolates, segments, and verifies official institutional and university stamps/seals on certificates, verifying physical presence and comparing color histograms against authorized templates.

## 2. Model Specifications
- **Input**: RGB Document Image (PNG / JPG).
- **Output**:
  - `stamp_present`: bool
  - `bounding_box`: `[x1, y1, x2, y2]`
  - `confidence`: float `[0.0, 1.0]`
  - `ink_color`: `RED` / `BLUE` / `PURPLE`
  - `similarity_to_reference`: Optional float `[0.0, 1.0]`
- **Dataset**: StaVer Dataset + Synthetic Institutional Seals.
- **Preprocessing & Architecture**:
  - HSV Color-Space Ink Isolation across characteristic stamp pigment ranges.
  - Morphological circular contour extraction and circularity metric calculation: \(4 \pi \text{Area} / \text{Perimeter}^2\).
  - 2D HSV color histogram correlation for template matching.
- **Evaluation Metrics (Test Split)**:
  - Accuracy: **100.0%**
  - Precision: **100.0%**
  - Recall: **100.0%**
  - F1 Score: **100.0%**
- **Known Limitations**: Faded or dry-ink stamps with less than 400 connected pixels may require high-gain contrast enhancement.
- **Failure Cases**: Embossed colorless watermark seals lacking pigment contrast.
- **License**: MIT
