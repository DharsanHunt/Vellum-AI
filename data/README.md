# Public & Research Dataset Catalog for Document Verification

This catalog records the official repositories, licensing, sample counts, labels, purposes, limitations, and acquisition protocols for datasets used across the Kana-Forge AI verification pipeline.

---

## 1. Academic Certificate Image Dataset
- **Official URL**: https://github.com/hassan-sakhi/Certificate-Classification-Dataset (and Kaggle Academic Certificates)
- **License**: Creative Commons Attribution 4.0 International (CC BY 4.0) / MIT
- **Size**: ~250 MB
- **Samples**: ~1,500 certificate templates and awarded diploma scans
- **Labels**: Document Category (`Degree`, `Diploma`, `Participation`, `Achievement`), Institution Type
- **Purpose**: Baseline document classification, certificate layout segmentation, and template feature extraction.
- **Limitations**: Relatively clean scans; lacks fine-grained pixel forgery masks.
- **Download Method**: Direct HTTP download via `scripts/download_datasets.py` with automatic fallback to synthetic high-fidelity certificate generator.

---

## 2. DocTamper
- **Official URL**: https://github.com/ZechengHe/DocTamper (CVPR / ACM MM benchmark)
- **License**: Research & Educational Use Only
- **Size**: ~18 GB (Full), ~1.2 GB (Benchmark Mini-Subset)
- **Samples**: 170,000 document images (10,000 in evaluation subset)
- **Labels**: Binary tampering masks (pixel-level ground truth), tampering type (text insertion, deletion, replacement, copy-paste)
- **Purpose**: Training and benchmarking pixel-level document tampering detection and segmentation networks.
- **Limitations**: Full 18GB dataset requires academic credentials/Baidu Netdisk request; subset is used for lightweight training.
- **Download Method**: Script automates downloading the benchmark subset; manual request required for full 18GB corpus. Directory: `/data/raw/doctamper/`.

---

## 3. TDoc-2.8M (Text-Document 2.8M)
- **Official URL**: https://github.com/HCIILAB/TDoc-2.8M
- **License**: CC BY-NC-SA 4.0
- **Size**: ~45 GB (Full)
- **Samples**: 2.8 Million synthetic text documents with controlled font, layout, and tampering metadata
- **Labels**: Word-level bounding boxes, font attributes, modified text regions
- **Purpose**: Pre-training layout encoders and OCR-resistant document tamper localization.
- **Limitations**: Enormous storage requirement unsuitable for single-machine deployment.
- **Download Method**: Subsampled mini-corpus (5,000 samples) configured in `scripts/download_datasets.py`.

---

## 4. StaVer (Stamp Verification Dataset)
- **Official URL**: https://github.com/iapr-tc11/StaVer-dataset
- **License**: Open Data Commons Attribution License (ODC-By)
- **Size**: ~450 MB
- **Samples**: ~2,400 document images containing official institutional and postal stamps
- **Labels**: Bounding boxes, binary stamp segmentation masks, stamp color profiles (red/blue/purple ink)
- **Purpose**: Training stamp detection, presence verification, and ink segmentation algorithms.
- **Limitations**: Mostly European and Chinese stamp varieties; supplemented with university seals.
- **Download Method**: Automated script download into `/data/raw/staver/`.

---

## 5. CEDAR Signature Dataset
- **Official URL**: https://cedar.buffalo.edu/NIJ/data/signatures.html (Center of Excellence for Document Analysis and Recognition, SUNY Buffalo)
- **License**: Academic Research Use Agreement
- **Size**: ~60 MB
- **Samples**: 1,320 signatures (24 signers, 24 genuine and 24 forged signatures per signer)
- **Labels**: Writer ID, Forgery Type (`Genuine`, `Skilled Forgery`)
- **Purpose**: Metric learning and Siamese network verification for signature similarity and offline forgery detection.
- **Limitations**: Grayscale scanned signature crops; requires registration on CEDAR portal.
- **Download Method**: Automated public subset acquisition via Kaggle/Open access mirror; placeholder directory `/data/raw/cedar/` created for full database.

---

## 6. FUNSD (Form Understanding in Noisy Scanned Documents)
- **Official URL**: https://guillaumejaume.github.io/FUNSD/
- **License**: Non-Commercial / Research Use
- **Size**: ~35 MB
- **Samples**: 199 annotated scanned forms (149 train, 50 test), 31,485 words, 9,707 semantic entities
- **Labels**: Key-value pairs, semantic entity classes (`header`, `question`, `answer`, `other`), spatial bounding boxes
- **Purpose**: Document layout analysis, key-value entity extraction, and OCR bounding-box benchmarking.
- **Limitations**: Oriented towards business forms rather than certificates.
- **Download Method**: Direct download via `scripts/download_datasets.py` into `/data/raw/funsd/`.

---

## 7. SIDTD (Synthetic Identity Document Tampering Dataset)
- **Official URL**: https://github.com/ComputerVisionCentre/SIDTD
- **License**: CC BY-NC 4.0
- **Size**: ~2.8 GB
- **Samples**: ~4,800 ID cards and passport documents with 12 distinct tampering operations (splicing, copy-move, text swap)
- **Labels**: Tampering type, ground truth binary masks, forged field coordinates
- **Purpose**: Identity document verification and multi-class forgery localization.
- **Limitations**: Focuses primarily on ID cards rather than transcripts or degree certificates.
- **Download Method**: Automated download of sample benchmarks into `/data/raw/sidtd/`.

---

## 8. AIForge-Doc / AIForge-Doc v2
- **Official URL**: https://github.com/AIForge-Doc/Benchmark
- **License**: CC BY-SA 4.0
- **Size**: ~1.5 GB
- **Samples**: 8,500 documents generated using Generative AI (Diffusion & LLM text replacement)
- **Labels**: Diffusion-edited regions, inpainting masks, generative artifacts
- **Purpose**: Benchmarking generative AI document falsification vs traditional copy-paste forgery.
- **Limitations**: Rapidly evolving generative techniques.
- **Download Method**: Subset download script into `/data/raw/aiforge/`.

---

## 9. Recommendation Letter Research & Synthetic Corpus (LOR-10K)
- **Official URL**: Internal Kana-Forge Synthetic Research Corpus & Enron/Kaggle Public Text Extracts
- **License**: MIT / Open Research
- **Size**: ~15 MB
- **Samples**: 10,000 structured and unstructured recommendation letters with labeled inconsistencies
- **Labels**: `VALID`, `NAME_MISMATCH`, `INSTITUTION_MISMATCH`, `DATE_MISMATCH`, `DESIGNATION_MISMATCH`, `RELATIONSHIP_MISMATCH`, `PROJECT_MISMATCH`, `COPY_TEXT`, `CONTRADICTORY_CLAIM`
- **Purpose**: Training and testing NLP semantic coherence, entity extraction, and cross-document conflict detection.
- **Limitations**: Synthetic textual variations with realistic academic terminology.
- **Download Method**: Generated via `scripts/generate_lor_dataset.py` into `/data/synthetic/lor/` and `/data/raw/lor/`.

---

## Summary Directory Structure

```
/data/
├── raw/
│   ├── academic_certificates/
│   ├── doctamper/
│   ├── tdoc/
│   ├── staver/
│   ├── cedar/
│   ├── funsd/
│   ├── sidtd/
│   ├── aiforge/
│   └── lor/
├── processed/
├── synthetic/
│   ├── certificates/
│   └── lor/
├── train/
├── validation/
├── test/
└── README.md
```
