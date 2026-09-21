import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Layers, Sparkles, Eye, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Dossier } from '../../types';
import { Badge, KbdBadge } from '../../components/common/Badge';
import { ForensicLoupe } from './ForensicLoupe';

interface DocumentCanvasProps {
  dossier: Dossier;
  activeLayer: number;
  onLayerChange: (layer: number) => void;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  dossier,
  activeLayer,
  onLayerChange,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [hoveredBox, setHoveredBox] = useState<string | null>(null);

  const numAnomalies = dossier.suspiciousBboxes.length;

  return (
    <div className="depth-card-static rounded-3xl overflow-hidden flex flex-col transition-all duration-300">
      {/* Top Canvas Bar with Frosted Layer Switchers */}
      <div className="border-b border-zinc-200/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-zinc-50/90 via-white to-zinc-50/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-[0_2px_6px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)]">
            <Layers className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-950">Optical Inspection Stage</span>
            <span className="font-mono text-[10px] text-zinc-400 ml-1.5 font-normal">({dossier.resolution})</span>
          </div>
        </div>

        {/* Zoom & Fit Controls with Inset Capsule */}
        <div className="flex items-center gap-1 bg-zinc-100/90 rounded-full p-1 border border-zinc-200/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
          <button
            onClick={() => setZoomLevel((z) => Math.max(75, z - 25))}
            className="p-1 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-white transition-all cursor-pointer shadow-none hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-[11px] font-semibold text-zinc-700 px-2 min-w-[42px] text-center">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
            className="p-1 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-white transition-all cursor-pointer shadow-none hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(100)}
            className="p-1 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-white transition-all ml-0.5 border-l border-zinc-200/80 cursor-pointer shadow-none hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            title="Reset Fit (100%)"
          >
            <Maximize2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Layer Switcher Tabs with Dimensional Inset Depth */}
      <div className="border-b border-zinc-200/70 px-6 py-2.5 flex items-center gap-2 bg-[#FAF8F5]/90 overflow-x-auto">
        <button
          onClick={() => onLayerChange(1)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
            activeLayer === 1
              ? 'depth-pill-active'
              : 'depth-pill-inactive border border-transparent hover:border-zinc-200/80'
          }`}
        >
          <KbdBadge kbd="1" />
          <span>Pristine Scan</span>
        </button>

        <button
          onClick={() => onLayerChange(2)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
            activeLayer === 2
              ? 'depth-pill-active'
              : 'depth-pill-inactive border border-transparent hover:border-zinc-200/80'
          }`}
        >
          <KbdBadge kbd="2" />
          <span>Tampering Heatmap</span>
          {numAnomalies > 0 ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
              {numAnomalies} Flagged
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              Clean
            </span>
          )}
        </button>

        <button
          onClick={() => onLayerChange(3)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
            activeLayer === 3
              ? 'depth-pill-active'
              : 'depth-pill-inactive border border-transparent hover:border-zinc-200/80'
          }`}
        >
          <KbdBadge kbd="3" />
          <span>OCR Anchors</span>
        </button>

        <button
          onClick={() => onLayerChange(4)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
            activeLayer === 4
              ? 'depth-pill-active'
              : 'depth-pill-inactive border border-transparent hover:border-zinc-200/80'
          }`}
        >
          <KbdBadge kbd="4" />
          <span>2.5x Loupe &amp; ELA</span>
        </button>
      </div>

      {/* Main Recessed Inspection Mat Viewport with Ambient Lighting */}
      <div className="p-8 md:p-12 bg-mat-gradient shadow-[inset_0_4px_28px_rgba(28,25,23,0.08)] flex items-center justify-center min-h-[540px] overflow-auto relative">
        {/* Subtle Archival Light Ring Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.7)_0%,transparent_70%)] pointer-events-none" />

        {activeLayer === 4 ? (
          <div className="w-full relative z-10">
            <ForensicLoupe dossier={dossier} />
          </div>
        ) : (
          /* Multi-Layer Physical Certificate with Depth Shadows & Bevels */
          <div
            className="relative transition-transform duration-300 ease-out origin-center depth-paper text-zinc-900 rounded-sm p-10 md:p-12 border border-[#E2DAD0] w-[680px] min-h-[490px] flex flex-col justify-between select-none z-10"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {/* Ornate Guilloché Border Frame with Dual Gold Accent Insets */}
            <div className="absolute inset-3 border-2 border-amber-800/15 rounded-xs pointer-events-none" />
            <div className="absolute inset-4.5 border border-amber-900/10 rounded-xs pointer-events-none" />
            <div className="absolute inset-[19px] border border-amber-700/5 rounded-xs pointer-events-none" />

            {/* Certificate Header with Embossed Golden Crest */}
            <div className="text-center space-y-2 relative z-10">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#FFF5D6] via-[#E8D08D] to-[#C49B3E] border border-amber-400/80 text-amber-950 text-xl shadow-[0_2px_8px_rgba(180,140,50,0.2),inset_0_1px_1px_rgba(255,255,255,0.9)] mb-1">
                🏛️
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight uppercase text-zinc-950">
                {dossier.institution}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-amber-900/20" />
                <p className="text-[10px] tracking-[0.2em] uppercase text-amber-950/70 font-semibold">
                  Official Academic Credential &bull; Board of Regents
                </p>
                <span className="h-px w-8 bg-amber-900/20" />
              </div>
            </div>

            {/* Candidate Body */}
            <div className="text-center space-y-4 my-6 relative z-10">
              <p className="font-serif italic text-sm text-zinc-600">This certifies that</p>
              <div className="font-serif text-3xl md:text-4xl font-bold text-zinc-950 border-b border-zinc-300/80 pb-2.5 mx-8 tracking-tight drop-shadow-sm">
                {dossier.candidateName}
              </div>
              <p className="font-serif italic text-xs md:text-sm text-zinc-600">
                has successfully fulfilled all prescribed requirements for the conferral of the degree of
              </p>
              <div className="font-sans font-bold text-base md:text-lg text-zinc-900 tracking-tight">
                {dossier.degree}
              </div>
              <div className="font-mono text-[10px] text-zinc-400 pt-1 flex items-center justify-center gap-3">
                <span>Certificate ID: <strong className="text-zinc-700">{dossier.certificateNumber}</strong></span>
                <span>&bull;</span>
                <span>Reg No: <strong className="text-zinc-700">{dossier.registrationNumber}</strong></span>
              </div>
            </div>

            {/* Certificate Footer: Vector Signature & 3D Embossed Stamp Seal */}
            <div className="flex items-end justify-between pt-6 border-t border-zinc-200/80 relative z-10">
              {/* Handwritten Vector Cursive Signature */}
              <div className="text-center space-y-1 w-44">
                <div className="relative pb-1">
                  <svg className="w-36 h-10 mx-auto text-zinc-900" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 28 C25 15, 30 5, 45 22 C55 35, 60 12, 75 18 C90 24, 95 32, 115 15 C125 7, 135 25, 150 20"
                      stroke="#18181B"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M25 22 C50 26, 90 24, 140 22"
                      stroke="#18181B"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="border-b border-zinc-400/80 mt-1" />
                </div>
                <div className="font-serif text-xs font-semibold text-zinc-800">
                  Dr. Arvind Swaminathan
                </div>
                <div className="text-[9px] text-zinc-400 uppercase tracking-wider font-medium">
                  Registrar &amp; Dean of Admissions
                </div>
              </div>

              {/* 3D Dimensional Embossed Wax / Ink Stamp with Bevel Depth */}
              <div className="relative group cursor-pointer">
                <div className="h-22 w-22 rounded-full border-2 border-dashed border-rose-700/80 bg-gradient-to-br from-rose-50 via-rose-100/70 to-rose-200/50 shadow-[0_6px_16px_rgba(225,29,72,0.18),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(150,20,40,0.15)] flex flex-col items-center justify-center text-center p-1 text-rose-800 transition-transform duration-200 group-hover:scale-105">
                  <div className="h-18 w-18 rounded-full border border-rose-600/40 flex flex-col items-center justify-center p-1 bg-white/30 backdrop-blur-[1px]">
                    <span className="text-[8px] font-bold uppercase tracking-tight text-rose-900">OFFICIAL SEAL</span>
                    <span className="text-[7px] font-mono font-bold text-rose-800">APEX UNIV</span>
                    <span className="text-[7px] text-rose-700 font-mono mt-0.5">★ 2024 ★</span>
                  </div>
                </div>
              </div>

              {/* Date of Inscription */}
              <div className="text-right space-y-0.5 w-44">
                <div className="font-mono text-xs font-semibold text-zinc-900">{dossier.dateOfIssue}</div>
                <div className="text-[9px] text-zinc-400 uppercase tracking-wider font-medium">Date of Inscription</div>
                <div className="text-[9px] font-mono text-zinc-400">Class of 2024</div>
              </div>
            </div>

            {/* Layer 2: Tampering Heatmap Overlay with Luminous Pulse */}
            {activeLayer === 2 && (
              <div className="absolute inset-0 pointer-events-none rounded-sm bg-zinc-950/15 backdrop-blur-[0.5px] z-20">
                {dossier.suspiciousBboxes.map((box, idx) => (
                  <div
                    key={idx}
                    className="absolute border-2 border-rose-500 bg-rose-500/30 flex items-start justify-start p-1.5 rounded-sm shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse"
                    style={{
                      left: `${(box.x1 / 1000) * 100}%`,
                      top: `${(box.y1 / 700) * 100}%`,
                      width: `${((box.x2 - box.x1) / 1000) * 100}%`,
                      height: `${((box.y2 - box.y1) / 700) * 100}%`,
                    }}
                  >
                    <span className="text-[9px] font-mono font-bold bg-rose-600 text-white px-2 py-0.5 rounded shadow-sm border border-rose-400/50 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 inline" /> {box.label || 'SPLICED ZONE'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Layer 3: OCR Spatial Bounding Boxes Overlay with Interactive Hover */}
            {activeLayer === 3 && (
              <div className="absolute inset-0 pointer-events-auto rounded-sm z-20">
                {dossier.ocrBboxes.map((box, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredBox(box.label || `Box ${idx}`)}
                    onMouseLeave={() => setHoveredBox(null)}
                    className="absolute border border-indigo-500/70 bg-indigo-500/10 hover:bg-indigo-500/30 hover:border-indigo-600 transition-all cursor-pointer group rounded-xs shadow-sm"
                    style={{
                      left: `${(box.x1 / 1000) * 100}%`,
                      top: `${(box.y1 / 700) * 100}%`,
                      width: `${((box.x2 - box.x1) / 1000) * 100}%`,
                      height: `${((box.y2 - box.y1) / 700) * 100}%`,
                    }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-0 text-[10px] font-mono bg-zinc-900 text-white px-2 py-0.5 rounded-md shadow-lg z-30 whitespace-nowrap border border-zinc-700 pointer-events-none transition-opacity">
                      {box.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Context Banner */}
      <div className="border-t border-zinc-200/80 px-6 py-3 bg-gradient-to-r from-zinc-50/90 via-white to-zinc-50/90 flex items-center justify-between text-xs text-zinc-500">
        <div>
          {numAnomalies > 0 ? (
            <span className="text-rose-800 font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
              <strong>Tampering Anomaly:</strong> {dossier.criticalAnomalies[0]}
            </span>
          ) : (
            <span className="text-emerald-800 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <strong>Pristine Inspection:</strong> Document structure conforms to verified institutional baseline.
            </span>
          )}
        </div>
        <span className="font-mono text-[11px] text-zinc-400">
          SHA-256: {dossier.sha256.slice(0, 16)}...
        </span>
      </div>
    </div>
  );
};
