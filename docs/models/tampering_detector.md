# Dual-Head Tampering & Forgery Segmentation Model Documentation

## 1. Purpose
Performs forensic analysis on document images to detect pixel-level modifications (splicing, text replacement, erasure, copy-move artifacts), generating a localization heatmap, binary forgery mask, and field-level natural language explanations.

## 2. Model Specifications
- **Input**: RGB Document Image + Error Level Analysis (ELA) residual features, shape `(3, 256, 256)`.
- **Output**:
  - Image-level Classification: `AUTHENTIC-LIKE` vs `SUSPICIOUS`
  - Pixel-level Heatmap: float array `[0.0 - 1.0]` of shape `(H, W)`
  - Suspicious Bounding Boxes: `[[x1, y1, x2, y2], ...]`
  - Field Explanations: e.g., "Potential modification detected near certificate number serial field."
- **Dataset**: DocTamper + Synthetic Academic Certificates (150 annotated samples with pixel masks).
- **Preprocessing**: Bilinear resize to 256x256, normalization, Error Level Analysis residual extraction.
- **Architecture**: Dual-Head Convolutional U-Net Encoder-Decoder:
  - 3-stage contracting encoder with residual bottleneck.
  - Global average pooling + classification head.
  - Transposed convolution expanding decoder + 1x1 convolution sigmoid pixel mask head.
- **Training Method**: Multi-task joint optimization (Binary Cross-Entropy Mask Loss + Dice Loss + Cross-Entropy Classification Loss) with Adam optimizer (lr=8e-4, 10 epochs).
- **Evaluation Metrics (Test Split)**:
  - Classification Accuracy: **73.33%**
  - Classification Precision: **73.33%**
  - Classification Recall: **100.0%**
  - Classification F1 Score: **84.62%**
  - Classification ROC-AUC: **0.8551**
  - Pixel Segmentation mIoU: **0.0409**
  - Segmentation Dice Score: **0.0785**
- **Known Limitations**: Subtle single-character font swaps without JPEG compression artifacts require sub-pixel micro-forensics.
- **Failure Cases**: Heavy scanner moire patterns or repeated JPEG compression cycles can elevate false-positive noise.
- **License**: MIT
