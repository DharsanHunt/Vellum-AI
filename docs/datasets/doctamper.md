# DocTamper Dataset Documentation

## 1. Overview & Purpose
DocTamper is a large-scale benchmark for document image tampering detection and localization (CVPR / ACM MM), containing pixel-level ground truth masks for spliced text, erased lines, and swapped names.

## 2. Dataset Metadata
- **Official Repository**: https://github.com/ZechengHe/DocTamper
- **License**: Research & Non-Commercial Educational License
- **Size**: ~18 GB (Full), ~1.2 GB (Benchmark Subset)
- **Samples**: 170,000 document images
- **Labels**: Binary pixel-level ground truth masks (0: untampered, 255: tampered area), tampering type labels.

## 3. Integration in Kana-Forge
- Used for pre-training and validating the dual-head U-Net forensic segmentation detector (`ml/tampering/`).
- Benchmark subset integrated into `/data/raw/doctamper/`.

## 4. Manual Acquisition Guidelines
- Due to Baidu Netdisk / Google Drive academic access controls, full 18GB corpus requires requesting access from the original authors.
- Subsets and synthetic equivalents run automatically in `/data/synthetic/certificates/`.
