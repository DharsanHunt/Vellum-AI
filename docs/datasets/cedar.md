# CEDAR Signature Dataset Documentation

## 1. Overview & Purpose
CEDAR (Center of Excellence for Document Analysis and Recognition, SUNY Buffalo) is the standard academic benchmark for offline signature verification and metric learning (genuine vs. skilled forgeries).

## 2. Dataset Metadata
- **Official URL**: https://cedar.buffalo.edu/NIJ/data/signatures.html
- **License**: Academic Research Use Agreement
- **Size**: ~60 MB
- **Samples**: 1,320 signatures (24 genuine signers, 24 genuine and 24 forged signatures per signer).
- **Labels**: Signer ID, Forgery Label (`Genuine`, `Forged`).

## 3. Integration & Model Training
- Used to train the Siamese Metric Learning Neural Network (`ml/signature/signature_model.py`) with Contrastive Loss.
- Directory: `/data/raw/cedar/` and `/data/processed/signatures/`.
