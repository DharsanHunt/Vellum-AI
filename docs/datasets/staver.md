# StaVer (Stamp Verification) Dataset Documentation

## 1. Overview & Purpose
StaVer is an official IAPR TC-11 benchmark for stamp detection, segmentation, and verification on scanned administrative and academic documents.

## 2. Dataset Metadata
- **Official Repository**: https://github.com/iapr-tc11/StaVer-dataset
- **License**: Open Data Commons Attribution License (ODC-By)
- **Size**: ~450 MB
- **Samples**: ~2,400 annotated documents
- **Labels**: Stamp bounding boxes, binary segmentation masks, ink color profiles.

## 3. Integration in Kana-Forge
- Used to benchmark the HSV color-space ink isolation and Hough transform circular seal detector (`ml/stamp/`).
- Target directory: `/data/raw/staver/`.
