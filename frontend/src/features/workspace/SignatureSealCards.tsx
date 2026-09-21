import React from 'react';
import { FileSignature, Stamp, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Dossier } from '../../types';
import { Badge } from '../../components/common/Badge';

interface SignatureSealCardsProps {
  dossier: Dossier;
}

export const SignatureSealCards: React.FC<SignatureSealCardsProps> = ({ dossier }) => {
  const sigMatch = dossier.signals.signatureSimilarity;
  const isSigPass = sigMatch >= 0.70;
  const isStampPass = dossier.signals.stampPresent;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Signature Verification Card */}
      <div className="depth-card rounded-3xl p-5 space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <FileSignature className="h-4 w-4 text-zinc-600" />
              <span className="text-xs font-semibold text-zinc-900">Biometric Signature</span>
            </div>
            <Badge variant={isSigPass ? 'genuine' : 'danger'} size="sm">
              {isSigPass ? 'Anchor Match' : 'Mismatch'}
            </Badge>
          </div>

          {/* Visual Cursive Vector Preview Box */}
          <div className="my-3 p-3 rounded-2xl bg-[#FAF8F5] border border-zinc-200/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] relative">
            <svg className="w-full h-10 text-zinc-900" viewBox="0 0 160 40" fill="none">
              <path
                d="M10 28 C25 15, 30 5, 45 22 C55 35, 60 12, 75 18 C90 24, 95 32, 115 15 C125 7, 135 25, 150 20"
                stroke={isSigPass ? '#18181B' : '#E11D48'}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute bottom-1 right-2 text-[9px] font-mono text-zinc-400">
              Anchor: Dr. Arvind S.
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className={`font-serif text-3xl font-bold tracking-tight ${isSigPass ? 'text-zinc-900' : 'text-rose-700'}`}>
              {(sigMatch * 100).toFixed(1)}%
            </span>
            <span className="text-[11px] font-mono text-zinc-500">Siamese Cosine Score</span>
          </div>
        </div>

        <p className="text-[11px] text-zinc-500 leading-relaxed pt-1 border-t border-zinc-100">
          Evaluated against registrar signature anchor registry with contrastive metric network.
        </p>
      </div>

      {/* Official Seal Card */}
      <div className="depth-card rounded-3xl p-5 space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Stamp className="h-4 w-4 text-zinc-600" />
              <span className="text-xs font-semibold text-zinc-900">Institutional Seal</span>
            </div>
            <Badge variant={isStampPass ? 'genuine' : 'danger'} size="sm">
              {isStampPass ? 'Validated' : 'Absent'}
            </Badge>
          </div>

          {/* 3D Circular Seal Graphic Preview */}
          <div className="my-3 p-2.5 rounded-2xl bg-[#FAF8F5] border border-zinc-200/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-center">
            <div className="h-11 w-11 rounded-full border-2 border-dashed border-rose-700/80 bg-rose-50 shadow-inner flex flex-col items-center justify-center text-[7px] font-bold text-rose-800">
              <span>SEAL</span>
              <span className="text-[6px] text-rose-600">★ 2024 ★</span>
            </div>
            <div className="ml-3 text-left">
              <div className="text-[11px] font-semibold text-zinc-900">{dossier.signals.stampColor}</div>
              <div className="text-[10px] font-mono text-zinc-400">Hough Transform: r=38px</div>
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className={`font-serif text-2xl font-bold tracking-tight ${isStampPass ? 'text-zinc-900' : 'text-rose-700'}`}>
              {isStampPass ? 'Present' : 'Missing'}
            </span>
            <span className="text-[11px] font-mono text-zinc-500">Geometry Check</span>
          </div>
        </div>

        <p className="text-[11px] text-zinc-500 leading-relaxed pt-1 border-t border-zinc-100">
          HSV color segmentation isolates pigment boundaries with circular edge confirmation.
        </p>
      </div>
    </div>
  );
};
