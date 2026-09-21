import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Sparkles, ArrowRight, FileCheck, FileCode2, Shield } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface DocumentUploadPageProps {
  onStartProcessing: (data: any) => void;
}

export const DocumentUploadPage: React.FC<DocumentUploadPageProps> = ({
  onStartProcessing,
}) => {
  const [candidateName, setCandidateName] = useState('Arun Kumar');
  const [appId, setAppId] = useState('APP-2024-8819');
  const [institution, setInstitution] = useState('Apex University of Technology');
  const [degree, setDegree] = useState('B.Tech Computer Science & Engineering');
  const [sampleDoc, setSampleDoc] = useState('cert_00000.png');

  const handleDispatch = () => {
    onStartProcessing({
      candidateName,
      appId,
      institution,
      degree,
      sampleDoc,
      sha256: '88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
          Upload candidate credentials or select pre-calibrated forensic benchmark samples for 7-stage neural verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Left 3 cols: Upload Dropzone */}
        <div className="md:col-span-3 space-y-5">
          <div className="depth-card rounded-3xl p-10 text-center space-y-4 border-2 border-dashed border-zinc-200/90 hover:border-zinc-400/90 transition-all cursor-pointer group">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] group-hover:scale-105 transition-transform">
              <UploadCloud className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-zinc-900">
                Drag and drop credential image or PDF here
              </h3>
              <p className="text-xs text-zinc-400">
                Supports 24-Bit RGB PNG, JPG, or PDF up to 25MB
              </p>
            </div>

            <div className="pt-2">
              <span className="text-xs text-zinc-500 font-medium block mb-2.5">Or test with forensic benchmark samples:</span>
              <div className="flex justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSampleDoc('cert_00000.png')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                    sampleDoc === 'cert_00000.png'
                      ? 'depth-pill-active border-zinc-900 font-semibold'
                      : 'bg-zinc-50/80 text-zinc-700 border-zinc-200 hover:bg-white shadow-subtle'
                  }`}
                >
                  cert_00000.png (Clean)
                </button>
                <button
                  type="button"
                  onClick={() => setSampleDoc('cert_00001.png')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                    sampleDoc === 'cert_00001.png'
                      ? 'depth-pill-active border-zinc-900 font-semibold'
                      : 'bg-zinc-50/80 text-zinc-700 border-zinc-200 hover:bg-white shadow-subtle'
                  }`}
                >
                  cert_00001.png (Tampered)
                </button>
              </div>
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
              <div>&bull; Optical Resolution: 1000 × 700 px (300 DPI Raw)</div>
              <div>&bull; Color Channels: 24-Bit RGB (Full Dynamic Range)</div>
              <div>&bull; SHA-256 Digest: 88d4266fd4e6338d13b845...</div>
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
