# Siamese Signature Verification Model Documentation

## 1. Purpose
Performs automatic signature detection, cropping, deep metric embedding extraction, and genuine-versus-forged signature verification using Siamese neural networks.

## 2. Model Specifications
- **Input**: Query document image (or signature crop) and optional reference signature crop `(1, 128, 128)`.
- **Output**:
  - `similarity_score`: float `[0.0, 1.0]`
  - `model_confidence`: float `[0.0, 1.0]`
  - `reference_available`: bool
  - `is_match`: bool
  - `verdict`: `GENUINE_MATCH` or `FORGERY_DETECTED`
  - `crop_bbox`: `[x1, y1, x2, y2]`
- **Dataset**: CEDAR Offline Signature Dataset + Synthetic Signature Strokes.
- **Preprocessing**: Grayscale normalization `(128, 128)` with zero-mean unit-variance scaling.
- **Architecture**: `SiameseSignatureNet` with 4-stage convolutional feature backbone + adaptive average pooling + 64-dimensional L2-normalized metric projection head.
- **Training Method**: Contrastive Loss with Euclidean margin `(margin=1.0)` using positive pairs (affine-perturbed signatures) and negative pairs (differing signers).
- **Evaluation Metrics (40 test pairs)**:
  - Accuracy: **77.5%**
  - Precision: **68.97%**
  - Recall: **100.0%**
  - F1 Score: **81.63%**
  - ROC-AUC: **0.9463**
- **Known Limitations**: Requires relatively clear stroke contours; heavy ink smudging or stamp overlaps can alter stroke descriptors.
- **Failure Cases**: Highly simplified initials or single-stroke signatures with low visual entropy.
- **License**: MIT
