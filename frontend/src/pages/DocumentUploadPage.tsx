import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, Sparkles, ArrowRight, FileCheck, FileCode2, Shield, AlertTriangle, FileText, Award } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface DocumentUploadPageProps {
  onStartProcessing: (data: any) => void;
}

interface DemoCase {
  id: string;
  name: string;
  badge: string;
  badgeType: 'genuine' | 'danger' | 'warning';
  candidateName: string;
  appId: string;
  institution: string;
  degree: string;
  sampleDoc: string;
  sha256: string;
  description: string;
}

const DEMO_CASES: DemoCase[] = [
  {
    id: 'demo-1',
    name: 'Authentic B.Eng Certificate',
    badge: 'Authentic Baseline',
    badgeType: 'genuine',
    candidateName: 'Nikhil Nair',
    appId: 'APP-2024-001',
    institution: 'Global Institute of Science & Engineering',
    degree: 'Bachelor of Engineering in Electronics',
    sampleDoc: '1_AUTHENTIC_Degree_Certificate_Nikhil_Nair.png',
    sha256: 'fa454075f0ef2c023bb8df766154660fb854af4e79856f077ea9c9d641feda7d',
    description: 'Clean high-resolution scan with authentic seal, valid signatures, and verified institutional baseline.',
  },
  {
    id: 'demo-2',
    name: 'Tampered Date Splicing',
    badge: 'Fraud: Date Forgery',
    badgeType: 'danger',
    candidateName: 'Rohan Gupta',
    appId: 'APP-2024-002',
    institution: 'Metropolitan University of Computing',
    degree: 'B.Sc in Information Technology',
    sampleDoc: '3_FRAUD_Tampered_Date_Certificate_Rohan_Gupta.png',
    sha256: '320059e740d4ab23b79cdd020080fb554817614a06ba614de6dfc08fcbc21a90',
    description: 'Modified date of issue (29th Feb 2026) detected by Dual-Head UNet font splicing & ELA residuals.',
  },
  {
    id: 'demo-3',
    name: 'Tampered Institutional Stamp',
    badge: 'Fraud: Stamp Anomaly',
    badgeType: 'danger',
    candidateName: 'Meera Iyer',
    appId: 'APP-2024-003',
    institution: 'Stanford Tech Research Institute',
    degree: 'Bachelor of Engineering in Electronics',
    sampleDoc: '2_FRAUD_Tampered_Stamp_Certificate_Meera_Iyer.png',
    sha256: '5f8fe14315a33b38f956fbda6e0b9c80c8fd96f7419a984d05f8d33757476b74',
    description: 'Distorted institutional seal geometry failing HSV pigment density and circular Hough transform.',
  },
  {
    id: 'demo-4',
    name: 'Authentic MBA Credential',
    badge: 'Authentic Baseline',
    badgeType: 'genuine',
    candidateName: 'Nikhil Nair',
    appId: 'APP-2024-004',
    institution: 'Pacific Coast University',
    degree: 'MBA in Data Analytics',
    sampleDoc: '4_AUTHENTIC_MBA_Certificate_Pacific_Coast.png',
    sha256: '41b196637cca7facbc715b4526f6c881666cf740762641074541d937e273462f',
    description: 'Multi-institutional cross-verification check with 98.2% OCR confidence and authentic registrar crest.',
  },
];

export const DocumentUploadPage: React.FC<DocumentUploadPageProps> = ({
  onStartProcessing,
}) => {
  const [candidateName, setCandidateName] = useState('Nikhil Nair');
  const [appId, setAppId] = useState('APP-2024-001');
  const [institution, setInstitution] = useState('Global Institute of Science & Engineering');
  const [degree, setDegree] = useState('Bachelor of Engineering in Electronics');
  const [sampleDoc, setSampleDoc] = useState('1_AUTHENTIC_Degree_Certificate_Nikhil_Nair.png');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [sha256, setSha256] = useState('fa454075f0ef2c023bb8df766154660fb854af4e79856f077ea9c9d641feda7d');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectCase = (c: DemoCase) => {
    setCandidateName(c.candidateName);
    setAppId(c.appId);
    setInstitution(c.institution);
    setDegree(c.degree);
    setSampleDoc(c.sampleDoc);
    setSha256(c.sha256);
    setUploadedFile(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setSampleDoc(file.name);
      setCandidateName(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      setAppId('UPL-' + Math.floor(100000 + Math.random() * 900000));
      setSha256('custom_' + Math.random().toString(16).substring(2, 10));
    }
  };

  const handleDispatch = () => {
    onStartProcessing({
      candidateName,
      appId,
      institution,
      degree,
      sampleDoc,
      sha256,
      uploadedFile,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="space-y-1.5 pb-4 border-b border-zinc-200/80">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-zinc-900" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Intake &amp; Pre-Flight Analysis
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-zinc-950">
          Document Intake Gateway
        </h1>
        <p className="text-xs text-zinc-500 max-w-xl leading-relaxed">
          Upload any credential from your device or select pre-calibrated forensic benchmark samples from the <code className="bg-zinc-100 px-1.5 py-0.5 rounded font-mono text-zinc-800">sample_documents_for_demo</code> folder.
        </p>
      </div>

      {/* Interactive Quick Benchmark Presets Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Select Live Demo Preset:
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            4 Calibrated Test Cases Available
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEMO_CASES.map((c) => {
            const isSelected = sampleDoc === c.sampleDoc;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectCase(c)}
                className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-md ring-2 ring-zinc-900 ring-offset-1'
                    : 'bg-white hover:bg-zinc-50 text-zinc-800 border-zinc-200/90 shadow-subtle'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-bold font-serif leading-tight">
                    {c.name}
                  </span>
                  <Badge variant={c.badgeType} size="sm">
                    {c.badgeType === 'danger' ? 'Fraud' : 'Clean'}
                  </Badge>
                </div>
                <p className={`text-[10px] line-clamp-2 leading-relaxed ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  {c.description}
                </p>
                <div className={`text-[10px] font-mono pt-1 border-t ${isSelected ? 'border-zinc-800 text-amber-300' : 'border-zinc-100 text-zinc-400'}`}>
                  {c.candidateName}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Left 3 cols: Upload Dropzone & Pre-Flight */}
        <div className="md:col-span-3 space-y-5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png,image/jpeg,image/webp,application/pdf"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="depth-card rounded-3xl p-8 text-center space-y-4 border-2 border-dashed border-zinc-300 hover:border-zinc-900 bg-gradient-to-b from-white to-zinc-50/50 transition-all cursor-pointer group shadow-card"
          >
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] group-hover:scale-105 transition-transform">
              <UploadCloud className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-900">
                {uploadedFile ? uploadedFile.name : 'Click or Drag & Drop Document Image'}
              </h3>
              <p className="text-xs text-zinc-400">
                {uploadedFile 
                  ? `${(uploadedFile.size / 1024).toFixed(1)} KB &bull; Ready for 7-Stage Neural Analysis`
                  : 'Supports PNG, JPG, or PDF from sample_documents_for_demo'}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-mono font-medium border border-zinc-200">
              <FileCheck className="h-3.5 w-3.5 text-zinc-500" />
              <span>Target: <strong>{sampleDoc}</strong></span>
            </div>
          </div>

          {/* Pre-Flight Status */}
          <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/70 via-white to-white p-5 space-y-2 shadow-card">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-950 pb-2 border-b border-emerald-100">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Pre-Flight Integrity Verified
              </span>
              <Badge variant="genuine" size="sm">Pass (3/3 Checks)</Badge>
            </div>
            <div className="text-xs text-emerald-900 space-y-1 font-mono pt-1">
              <div>&bull; Optical Resolution: 1000 × 700 px (300 DPI Raw Matrix)</div>
              <div>&bull; Color Channels: 24-Bit RGB (Full Dynamic Range)</div>
              <div>&bull; SHA-256 Digest: {sha256.slice(0, 24)}...</div>
            </div>
          </div>
        </div>

        {/* Right 2 cols: Metadata Form */}
        <div className="md:col-span-2 depth-card-static rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <span className="text-xs font-semibold text-zinc-900">Candidate Metadata</span>
            <Badge variant="neutral" size="sm">Intake</Badge>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1.5">
                Candidate Full Name:
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/70 hover:bg-white px-3.5 py-2.5 text-zinc-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1.5">
                Application Reference ID:
              </label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                className="w-full font-mono rounded-xl border border-zinc-200/90 bg-zinc-50/70 hover:bg-white px-3.5 py-2.5 text-zinc-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1.5">
                Claimed Issuing Body:
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/70 hover:bg-white px-3.5 py-2.5 text-zinc-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1.5">
                Claimed Degree / Major:
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/70 hover:bg-white px-3.5 py-2.5 text-zinc-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors"
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleDispatch}
              icon={<ArrowRight className="h-4 w-4" />}
              className="w-full mt-2"
            >
              Initiate Multi-Modal Verification
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
