import React from 'react';
import { Microscope, Scan, CheckCircle2, AlertTriangle, Crosshair } from 'lucide-react';
import { Dossier } from '../../types';
import { Badge } from '../../components/common/Badge';

interface ForensicLoupeProps {
  dossier: Dossier;
}

export const ForensicLoupe: React.FC<ForensicLoupeProps> = ({ dossier }) => {
  const hasTampering = dossier.suspiciousBboxes.length > 0;
  const targetAnomaly = hasTampering ? dossier.suspiciousBboxes[0].label : 'Biometric Seal & Signature Zone';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-sm">
            <Microscope className="h-4 w-4" />
          </div>
          <div>
            <span className="text-sm font-semibold text-zinc-950">2.5x Optical Magnification &amp; Error Level Analysis (ELA)</span>
            <p className="text-xs text-zinc-500">Pixel quantization residuals evaluated against uncompressed reference sensor curve.</p>
          </div>
        </div>
        <Badge variant={hasTampering ? 'danger' : 'genuine'} size="sm">
          {hasTampering ? 'Quantization Mismatch' : 'Uniform Residual'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Optical Magnification Crop */}
        <div className="depth-card rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-600 font-semibold pb-1 border-b border-zinc-100">
            <div className="flex items-center gap-1.5">
              <Crosshair className="h-3.5 w-3.5 text-zinc-500" />
              <span>Optical 2.5x Reticle Crop</span>
            </div>
            <span className="font-mono text-zinc-400">{targetAnomaly}</span>
          </div>

          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-200/90 bg-gradient-to-b from-[#FFFDFB] to-[#F7F3EB] shadow-inner flex items-center justify-center">
            {/* Glass Lens Specular Glare Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none" />

            <div className="p-4 text-center space-y-1 relative z-10">
              <div className="font-serif text-xl font-bold text-zinc-900 drop-shadow-sm">
                {dossier.candidateName}
              </div>
              <div className="font-mono text-xs text-zinc-600">
                {dossier.certificateNumber} &middot; {dossier.dateOfIssue}
              </div>
              {hasTampering && (
                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 font-mono text-[10px] font-bold shadow-sm">
                  <AlertTriangle className="h-3 w-3 text-rose-600" /> Spliced Font Boundary
                </div>
              )}
            </div>

            {/* Precision Optical Reticle */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="h-24 w-24 border border-zinc-400/50 rounded-full border-dashed" />
              <div className="h-12 w-12 border border-zinc-500/40 rounded-full" />
              <div className="absolute h-px w-full bg-zinc-400/30" />
              <div className="absolute h-full w-px bg-zinc-400/30" />
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 flex justify-between font-mono pt-1">
            <span>250% Optical Zoom</span>
            <span>300 DPI Raw Sensor</span>
          </div>
        </div>

        {/* ELA Frequency Residual */}
        <div className="depth-card rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-600 font-semibold pb-1 border-b border-zinc-100">
            <div className="flex items-center gap-1.5">
              <Scan className="h-3.5 w-3.5 text-zinc-500" />
              <span>ELA Frequency Residual</span>
            </div>
            <span className="font-mono text-zinc-400">Q: 90% | Scale: 20x</span>
          </div>

          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 bg-[#141416] shadow-inner flex items-center justify-center text-white">
            <div className="p-4 text-center space-y-2 relative z-10">
              <div className={`font-mono text-xs font-bold ${hasTampering ? 'text-rose-400' : 'text-emerald-400'}`}>
                {hasTampering ? 'HIGH RESIDUAL INTENSITY (Δ 42.8 dB)' : 'HOMOGENEOUS RESIDUAL (Δ < 4.1 dB)'}
              </div>
              <div className="text-[10px] text-zinc-400 max-w-xs mx-auto leading-relaxed">
                {hasTampering
                  ? 'Inconsistent JPEG quantization matrix confirms secondary text insertion.'
                  : 'Uniform compression artifacts across complete document scan.'}
              </div>
            </div>

            {/* Subtle Matrix Glow Line */}
            <div className={`absolute inset-x-0 bottom-0 h-1 ${hasTampering ? 'bg-rose-500 shadow-[0_0_12px_#F43F5E]' : 'bg-emerald-500 shadow-[0_0_12px_#10B981]'}`} />
          </div>

          <div className="text-[11px] text-zinc-400 flex justify-between font-mono pt-1">
            <span>Laplacian Residual Filter</span>
            <span className="font-semibold text-zinc-700">{hasTampering ? 'Anomaly Flagged' : 'Pristine'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
