# TDoc-2.8M Dataset Documentation

## 1. Overview & Purpose
TDoc-2.8M is a massive text-document dataset providing word-level bounding boxes, font attributes, and controlled text manipulations to train layout and document representation models.

## 2. Dataset Metadata
- **Official Repository**: https://github.com/HCIILAB/TDoc-2.8M
- **License**: CC BY-NC-SA 4.0
- **Size**: ~45 GB (Full)
- **Samples**: 2.8 Million documents
- **Labels**: Word-level bounding boxes, text positions, character layouts.

## 3. Usage & Subset Configuration
- In accordance with Section 41 (Compute-Aware Storage & Download Limits), a 5,000-sample mini-subset is designated in `/data/raw/tdoc/`.
- Full corpus should not be downloaded automatically on college/single-machine project environments.
