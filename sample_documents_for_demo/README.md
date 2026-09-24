# 📁 Sample Demo Documents for Vellum-AI Verification

This folder contains pre-calibrated test credentials and documents that you can directly upload or demonstrate on the **Vellum-AI** verification platform.

---

## 📄 Test Documents List

### 1. `1_AUTHENTIC_Degree_Certificate_Nikhil_Nair.png`
- **Document Type**: Academic Degree Certificate (Bachelor of Engineering in Electronics)
- **Status**: ✅ **100% AUTHENTIC / GENUINE**
- **What it demonstrates**:
  - Valid institutional header: *Global Institute of Science & Engineering*
  - Authentic circular embossed gold/crimson wax seal
  - Valid cursive registrar signature with 89%+ Siamese cosine similarity
  - Pristine pixel matrix (Zero UNet splicing anomalies, homogeneous ELA residual)

---

### 2. `2_FRAUD_Tampered_Stamp_Certificate_Meera_Iyer.png`
- **Document Type**: Academic Degree Certificate
- **Status**: 🚨 **FRAUDULENT (Tampered Stamp / Seal)**
- **What it demonstrates**:
  - The institutional seal has been modified / spliced
  - The **Stamp Verifier** flags an anomaly in the HSV color distribution and circular Hough transform
  - Risk score elevated to critical tier

---

### 3. `3_FRAUD_Tampered_Date_Certificate_Rohan_Gupta.png`
- **Document Type**: Academic Degree Certificate
- **Status**: 🚨 **FRAUDULENT (Tampered Date of Issue)**
- **What it demonstrates**:
  - The date field has been artificially modified to `'29th February 2026'`
  - **Dual-Head UNet Tampering Detector** flags the exact pixel bounding box around the date
  - **Error Level Analysis (ELA)** reveals high-frequency compression quantization residuals (Δ > 40 dB)

---

### 4. `4_AUTHENTIC_MBA_Certificate_Pacific_Coast.png`
- **Document Type**: Master of Business Administration in Data Analytics
- **Status**: ✅ **100% AUTHENTIC**
- **What it demonstrates**:
  - Pacific Coast University credential
  - Full cross-document entity consistency matching registry database

---

### 5. `5_Reference_Official_Seal_Stamp.png`
- **Type**: High-resolution reference seal crop
- **Use Case**: Used as reference anchor for the stamp verification engine

---

### 6. `6_Reference_Registrar_Signature.png`
- **Type**: Vector / raster registrar signature crop
- **Use Case**: Used as ground-truth anchor for the Siamese biometric signature model

---

### 7. `7_Sample_Letter_of_Recommendation_Aditya_Verma.txt`
- **Type**: Recommendation Letter Text Body
- **Use Case**: Copy & paste or upload to test the **LOR NLP Semantic & Plagiarism Analyzer** (`POST /api/lor/analyze`)

---

## 🚀 How to Show the Live Demo

1. Open your browser to **`http://localhost:5173/`**
2. Click **Document Intake** (or **Upload**) in the navigation sidebar
3. Drag & drop any image from this folder, or click any of the **Quick Demo Presets**:
   - Click `Authentic B.Eng Certificate` -> Click **Initiate Multi-Modal Verification**
   - Click `Tampered Date Splicing` -> Click **Initiate Multi-Modal Verification**
4. Watch the animated **7-Stage Neural Pipeline** compute the forensic score in real time
5. Explore the interactive **Verification Workspace**:
   - Press <kbd>1</kbd> for Pristine Scan
   - Press <kbd>2</kbd> for Tampering Heatmap (see the glowing red spliced zone)
   - Press <kbd>3</kbd> for OCR Spatial Anchors
   - Press <kbd>4</kbd> for 2.5x Loupe & ELA Frequency Residual
   - Press <kbd>A</kbd> to Approve or <kbd>R</kbd> to Reject and sign the immutable audit trail
