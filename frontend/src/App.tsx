import React, { useState } from 'react';
import { AppLayout } from './layouts/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DocumentUploadPage } from './pages/DocumentUploadPage';
import { ProcessingPage } from './pages/ProcessingPage';
import { VerificationWorkspacePage } from './pages/VerificationWorkspacePage';
import { VerificationHistoryPage } from './pages/VerificationHistoryPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AdministrationPage } from './pages/AdministrationPage';
import { SettingsPage } from './pages/SettingsPage';
import { MOCK_DOSSIERS, INITIAL_USER } from './data/mockData';
import { Dossier, UserProfile, Verdict } from './types';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [currentScreen, setCurrentScreen] = useState<string>('workspace');
  const [dossiers, setDossiers] = useState<Dossier[]>(MOCK_DOSSIERS);
  const [activeDossierId, setActiveDossierId] = useState<string>('case-001');
  const [activeUploadData, setActiveUploadData] = useState<any>(null);

  const handleRecordDecision = (
    dossierId: string,
    verdict: Verdict,
    reason: string,
    notes: string
  ) => {
    setDossiers((prev) =>
      prev.map((d) =>
        d.id === dossierId
          ? {
              ...d,
              status: verdict,
              reasonCode: reason,
              reviewNotes: notes,
              reviewedBy: currentUser.name,
              reviewTimestamp: new Date().toISOString(),
            }
          : d
      )
    );
  };

  const handleStartProcessing = (uploadData: any) => {
    setActiveUploadData(uploadData);

    const docName = (uploadData.sampleDoc || '').toLowerCase();
    const candidate = uploadData.candidateName || 'Candidate';
    const institution = uploadData.institution || 'Apex University of Technology';
    const degree = uploadData.degree || 'Bachelor of Science';

    let newDossier: Dossier;

    // Case 1: Tampered Date (Rohan Gupta / Date Splicing)
    if (docName.includes('date') || docName.includes('rohan') || candidate.toLowerCase().includes('rohan')) {
      newDossier = {
        id: 'case-rohan-' + Date.now(),
        caseNumber: 'VEL-2024-UPL-02',
        candidateName: candidate || 'Rohan Gupta',
        institution: institution || 'Metropolitan University of Computing',
        degree: degree || 'Bachelor of Science in Information Technology',
        dateOfIssue: '29th February 2026 (Tampered)',
        certificateNumber: 'MUC-20230002',
        registrationNumber: 'REG336506',
        documentType: 'Academic Degree Certificate',
        imageUrl: uploadData.sampleDoc || 'cert_00002.png',
        resolution: '1000 × 700 px (300 DPI)',
        sha256: uploadData.sha256 || '320059e740d4ab23b79cdd020080fb554817614a06ba614de6dfc08fcbc21a90',
        riskScore: 0.884,
        verdictLabel: 'CRITICAL_FRAUD',
        criticalAnomalies: [
          'Dual-Head UNet identified localized font splicing in date of issue field: "29th February 2026".',
          'Significant JPEG Error Level Analysis (ELA) frequency residual mismatch: Δ 42.8 dB.',
          'Chronological failure: 2026 is a standard year (February 29 does not exist).'
        ],
        entities: [
          { field: 'Candidate Name', value: candidate || 'Rohan Gupta', confidence: 0.985, status: 'VERIFIED' },
          { field: 'Issuing Body', value: institution || 'Metropolitan University of Computing', confidence: 0.991, status: 'ACCREDITED' },
          { field: 'Degree / Major', value: degree || 'B.Sc in Information Technology', confidence: 0.965, status: 'MATCH' },
          { field: 'Certificate ID', value: 'MUC-20230002', confidence: 0.988, status: 'VERIFIED' },
          { field: 'Registration No', value: 'REG336506', confidence: 0.974, status: 'VERIFIED' },
          { field: 'Date of Issue', value: '29th February 2026 (Tampered)', confidence: 0.612, status: 'SUSPICIOUS' },
        ],
        signals: {
          tamperingProbability: 0.895,
          signatureSimilarity: 0.882,
          stampPresent: true,
          stampColor: 'Crimson Red (HSV 0-10)',
          ocrConfidence: 0.942,
          issuerMatch: true,
          crossDocConsistency: 0.68,
        },
        evidenceList: [
          { signalName: 'Pixel Tampering & Splicing (UNet)', weight: 0.35, riskContribution: 0.313, description: 'Localized pixel manipulation detected in date field ROI.', status: 'FAIL' },
          { signalName: 'Biometric Siamese Signature', weight: 0.25, riskContribution: 0.020, description: 'Dean signature stroke matches reference anchor with 88.2% similarity.', status: 'PASS' },
          { signalName: 'Institutional Seal & Geometry', weight: 0.15, riskContribution: 0.000, description: 'Circular Hough geometry verified with intact ink boundaries.', status: 'PASS' },
          { signalName: 'Chronological & Calendar Integrity', weight: 0.25, riskContribution: 0.250, description: 'Impossible calendar date: 29th February 2026.', status: 'FAIL' },
        ],
        suspiciousBboxes: [
          { x1: 540, y1: 540, x2: 900, y2: 650, label: 'Spliced Date Zone (29-Feb-2026)' }
        ],
        ocrBboxes: [
          { x1: 200, y1: 180, x2: 800, y2: 240, label: 'University Header' },
          { x1: 300, y1: 320, x2: 700, y2: 370, label: `Candidate: ${candidate}` },
          { x1: 240, y1: 420, x2: 760, y2: 470, label: `Degree: ${degree}` },
          { x1: 540, y1: 540, x2: 900, y2: 650, label: 'Date ROI (Tampered)' }
        ],
        sealBbox: { x1: 420, y1: 520, x2: 600, y2: 680, label: 'Official Seal ROI' },
        status: 'PENDING'
      };
    }
    // Case 2: Tampered Stamp (Meera Iyer / Stamp Anomaly)
    else if (docName.includes('stamp') || docName.includes('meera') || candidate.toLowerCase().includes('meera')) {
      newDossier = {
        id: 'case-meera-' + Date.now(),
        caseNumber: 'VEL-2024-UPL-03',
        candidateName: candidate || 'Meera Iyer',
        institution: institution || 'Stanford Tech Research Institute',
        degree: degree || 'Bachelor of Engineering in Electronics',
        dateOfIssue: '15th July 2022',
        certificateNumber: 'STRI-20230001',
        registrationNumber: 'REG137190',
        documentType: 'Academic Degree Certificate',
        imageUrl: uploadData.sampleDoc || 'cert_00001.png',
        resolution: '1000 × 700 px (300 DPI)',
        sha256: uploadData.sha256 || '5f8fe14315a33b38f956fbda6e0b9c80c8fd96f7419a984d05f8d33757476b74',
        riskScore: 0.825,
        verdictLabel: 'SUSPICIOUS',
        criticalAnomalies: [
          'Institutional seal anomaly: distorted seal verification profile failing HSV pigment boundary and circular Hough transform.',
          'Boundary edge blur detected around seal region (blur variance: 12.4 vs baseline 88.0).'
        ],
        entities: [
          { field: 'Candidate Name', value: candidate || 'Meera Iyer', confidence: 0.985, status: 'VERIFIED' },
          { field: 'Issuing Body', value: institution || 'Stanford Tech Research Institute', confidence: 0.991, status: 'ACCREDITED' },
          { field: 'Degree / Major', value: degree || 'B.Eng Electronics', confidence: 0.965, status: 'MATCH' },
          { field: 'Certificate ID', value: 'STRI-20230001', confidence: 0.988, status: 'VERIFIED' },
          { field: 'Registration No', value: 'REG137190', confidence: 0.974, status: 'VERIFIED' },
          { field: 'Institutional Seal', value: 'DISTORTED / TAMPERED', confidence: 0.420, status: 'CONFLICT' },
        ],
        signals: {
          tamperingProbability: 0.785,
          signatureSimilarity: 0.875,
          stampPresent: true,
          stampColor: 'Distorted Faded Red',
          ocrConfidence: 0.965,
          issuerMatch: true,
          crossDocConsistency: 0.72,
        },
        evidenceList: [
          { signalName: 'Pixel Tampering & Splicing (UNet)', weight: 0.35, riskContribution: 0.275, description: 'Seal contour shows non-standard boundary artifacts.', status: 'FAIL' },
          { signalName: 'Biometric Siamese Signature', weight: 0.25, riskContribution: 0.025, description: 'Signature matches academic provost reference.', status: 'PASS' },
          { signalName: 'Institutional Seal & Geometry', weight: 0.20, riskContribution: 0.180, description: 'Hough circle metric failed (eccentricity: 0.64).', status: 'FAIL' },
          { signalName: 'OCR & Layout Integrity', weight: 0.20, riskContribution: 0.010, description: 'Layout text aligns with STRI baseline template.', status: 'PASS' },
        ],
        suspiciousBboxes: [
          { x1: 400, y1: 500, x2: 620, y2: 690, label: 'Distorted Stamp Seal ROI' }
        ],
        ocrBboxes: [
          { x1: 200, y1: 180, x2: 800, y2: 240, label: 'STRI Header' },
          { x1: 300, y1: 320, x2: 700, y2: 370, label: `Candidate: ${candidate}` },
          { x1: 240, y1: 420, x2: 760, y2: 470, label: `Degree: ${degree}` },
          { x1: 400, y1: 500, x2: 620, y2: 690, label: 'Seal ROI (Tampered)' }
        ],
        sealBbox: { x1: 400, y1: 500, x2: 620, y2: 690, label: 'Distorted Seal ROI' },
        status: 'PENDING'
      };
    }
    // Case 3: Clean / Authentic Document (Nikhil Nair / Pacific Coast / Custom)
    else {
      newDossier = {
        id: 'case-clean-' + Date.now(),
        caseNumber: 'VEL-2024-UPL-01',
        candidateName: candidate,
        institution: institution,
        degree: degree,
        dateOfIssue: '15th July 2024',
        certificateNumber: uploadData.appId || 'GISE-20230000',
        registrationNumber: 'REG' + Math.floor(100000 + Math.random() * 900000),
        documentType: 'Academic Degree Certificate',
        imageUrl: uploadData.sampleDoc || 'cert_00000.png',
        resolution: '1000 × 700 px (300 DPI)',
        sha256: uploadData.sha256 || 'fa454075f0ef2c023bb8df766154660fb854af4e79856f077ea9c9d641feda7d',
        riskScore: 0.048,
        verdictLabel: 'AUTHENTIC',
        criticalAnomalies: [],
        entities: [
          { field: 'Candidate Name', value: candidate, confidence: 0.992, status: 'VERIFIED' },
          { field: 'Issuing Body', value: institution, confidence: 0.995, status: 'ACCREDITED' },
          { field: 'Degree / Major', value: degree, confidence: 0.985, status: 'MATCH' },
          { field: 'Certificate ID', value: uploadData.appId || 'GISE-20230000', confidence: 0.991, status: 'VERIFIED' },
          { field: 'Registration No', value: 'REG272890', confidence: 0.982, status: 'VERIFIED' },
          { field: 'Issue Date', value: '15th July 2024', confidence: 0.978, status: 'VERIFIED' },
        ],
        signals: {
          tamperingProbability: 0.032,
          signatureSimilarity: 0.912,
          stampPresent: true,
          stampColor: 'Crimson & Gold (HSV 0-15)',
          ocrConfidence: 0.989,
          issuerMatch: true,
          crossDocConsistency: 0.99,
        },
        evidenceList: [
          { signalName: 'Pixel Tampering & Splicing (UNet)', weight: 0.35, riskContribution: 0.010, description: 'Uniform pixel quantization and natural paper grain. Zero splicing detected.', status: 'PASS' },
          { signalName: 'Biometric Siamese Signature', weight: 0.25, riskContribution: 0.015, description: '91.2% cosine match against registrar signature profile.', status: 'PASS' },
          { signalName: 'Institutional Seal & Geometry', weight: 0.20, riskContribution: 0.000, description: 'Authentic circular crest with verified radial geometry.', status: 'PASS' },
          { signalName: 'OCR & Layout Integrity', weight: 0.20, riskContribution: 0.002, description: 'Font metrics and baseline alignment conform 100% to verified institutional registry.', status: 'PASS' },
        ],
        suspiciousBboxes: [],
        ocrBboxes: [
          { x1: 200, y1: 180, x2: 800, y2: 240, label: `${institution} Header` },
          { x1: 300, y1: 320, x2: 700, y2: 370, label: `Candidate: ${candidate}` },
          { x1: 240, y1: 420, x2: 760, y2: 470, label: `Degree: ${degree}` },
          { x1: 150, y1: 580, x2: 350, y2: 640, label: 'Registrar Signature ROI' },
          { x1: 650, y1: 560, x2: 850, y2: 660, label: 'Official Seal' },
        ],
        sealBbox: { x1: 650, y1: 560, x2: 850, y2: 660, label: 'Official Seal ROI' },
        status: 'PENDING'
      };
    }

    // Prepend new dossier to the dossier pool and set as active
    setDossiers((prev) => [newDossier, ...prev.filter((d) => d.id !== newDossier.id)]);
    setActiveDossierId(newDossier.id);
    setCurrentScreen('processing');
  };

  const handleProcessingComplete = () => {
    setCurrentScreen('workspace');
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
          setCurrentScreen('dashboard');
        }}
      />
    );
  }

  return (
    <AppLayout
      currentScreen={currentScreen}
      onNavigate={setCurrentScreen}
      currentUser={currentUser}
      onSwitchUser={setCurrentUser}
      onLogout={() => setIsAuthenticated(false)}
    >
      {currentScreen === 'dashboard' && (
        <DashboardPage
          dossiers={dossiers}
          onSelectDossier={(id) => {
            setActiveDossierId(id);
            setCurrentScreen('workspace');
          }}
          onNavigate={setCurrentScreen}
        />
      )}

      {currentScreen === 'workspace' && (
        <VerificationWorkspacePage
          dossiers={dossiers}
          activeDossierId={activeDossierId}
          onSelectDossier={setActiveDossierId}
          onRecordDecision={handleRecordDecision}
        />
      )}

      {currentScreen === 'upload' && (
        <DocumentUploadPage onStartProcessing={handleStartProcessing} />
      )}

      {currentScreen === 'processing' && (
        <ProcessingPage
          uploadData={activeUploadData}
          onComplete={handleProcessingComplete}
        />
      )}

      {currentScreen === 'history' && (
        <VerificationHistoryPage dossiers={dossiers} />
      )}

      {currentScreen === 'audit' && <AuditTrailPage />}

      {currentScreen === 'analytics' && <AnalyticsPage />}

      {currentScreen === 'administration' && <AdministrationPage />}

      {currentScreen === 'settings' && <SettingsPage />}
    </AppLayout>
  );
}

export default App;
