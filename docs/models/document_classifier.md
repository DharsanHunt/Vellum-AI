# Document Type Classifier Documentation

## 1. Purpose
Classifies incoming single-page visual documents into standard verification categories (`ACADEMIC_CERTIFICATE`, `TRANSCRIPT`, `RECOMMENDATION_LETTER`, `ID_PASSPORT`, `INTERNSHIP_CERTIFICATE`) and computes a 128-dimensional spatial layout embedding.

## 2. Model Specifications
- **Input**: RGB Document Image (PNG / JPG / PDF render), shape `(3, 224, 224)`.
- **Output**: Document category string, class confidence `[0.0, 1.0]`, probability distribution, and 128-d layout embedding vector.
- **Dataset**: Academic Certificate Synthesis + FUNSD layouts.
- **Preprocessing**: Bilinear resize to 224x224, standard ImageNet RGB normalization.
- **Architecture**: Lightweight 4-stage convolutional backbone with batch normalization + global pooling + 128-d embedding projection head + softmax classification head.
- **Training Method**: Cross-Entropy Loss with Adam optimizer (lr=1e-3, weight_decay=1e-4, 8 epochs).
- **Evaluation Metrics**:
  - Accuracy: **100.0%**
  - Precision: **100.0%**
  - Recall: **100.0%**
  - F1 Score: **100.0%**
- **Known Limitations**: Optimized for single-page portrait/landscape documents; multi-page booklets require page-by-page inference.
- **Failure Cases**: Heavy rotations (>45 degrees) without orientation correction; highly blurred low-resolution scans (<100 DPI).
- **License**: MIT
