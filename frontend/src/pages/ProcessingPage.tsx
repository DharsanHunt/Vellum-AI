import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, Loader2, Cpu, Activity, Zap, Database } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface ProcessingPageProps {
  onComplete: () => void;
}

export const ProcessingPage: React.FC<ProcessingPageProps> = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);

  const stages = [
    { title: '1. Document Classification', desc: 'Lightweight ConvNet embedding classifier mapped to Academic Certificate.', latency: '18ms' },
    { title: '2. Spatial OCR & Layout Analysis', desc: 'Extracting bounding boxes, line geometries & spatial tokens.', latency: '64ms' },
    { title: '3. Named Entity Recognition (NER)', desc: 'Parsing candidate name, issuing institution, and registration IDs.', latency: '22ms' },
    { title: '4. Pixel Tampering & Splicing Detection', desc: 'Dual-Head UNet pixel segmentation & ELA residual analysis.', latency: '58ms' },
    { title: '5. Biometric Siamese Signature Match', desc: 'Contrastive metric network comparing against official anchor.', latency: '26ms' },
    { title: '6. Stamp Seal & Geometry Verification', desc: 'HSV ink isolation, Hough circle detector & color histogram.', latency: '16ms' },
    { title: '7. Probabilistic Evidence Fusion', desc: 'Non-linear risk fusion and calibrated decision synthesis.', latency: '14ms' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < stages.length) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [stages.length]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-1.5 pb-4 border-b border-zinc-200/80">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Real-Time Inference Telemetry
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-zinc-950">
          Multi-Modal Neural Pipeline
        </h1>
        <p className="text-xs text-zinc-500 max-w-xl leading-relaxed">
          Executing 7-stage neural verification and forensic signal fusion across DirectML runtime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Left 3 cols: Step list */}
        <div className="md:col-span-3 space-y-3">
          {stages.map((stage, idx) => {
            const isDone = idx < activeStep;
            const isCurrent = idx === activeStep;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                  isDone
                    ? 'depth-card border-zinc-200/90 text-zinc-950'
                    : isCurrent
                    ? 'bg-white border-zinc-900 shadow-[0_4px_16px_rgba(0,0,0,0.08)] text-zinc-950 scale-[1.01]'
                    : 'border-zinc-200/60 bg-zinc-50/40 text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {isDone ? (
                    <div className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="h-6 w-6 rounded-full bg-zinc-900 flex items-center justify-center text-white">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-full border border-zinc-300 bg-zinc-100 flex items-center justify-center text-[10px] font-mono text-zinc-500">
                      {idx + 1}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-semibold">{stage.title}</div>
                    <div className="text-[11px] text-zinc-500">{stage.desc}</div>
                  </div>
                </div>

                <div className="text-right">
                  {isDone && (
                    <span className="font-mono text-[10px] text-zinc-700 bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200/70 shadow-inner">
                      {stage.latency}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 cols: Telemetry Card */}
        <div className="md:col-span-2 space-y-4">
          <div className="depth-card-static rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <span className="text-xs font-semibold text-zinc-900">Execution Telemetry</span>
              <Badge variant="genuine" size="sm" dot>DirectML Live</Badge>
            </div>

            <div className="space-y-3.5 text-xs font-mono text-zinc-600">
              <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                <span className="text-zinc-500 font-sans">Total Latency:</span>
                <span className="text-zinc-950 font-bold text-sm">218 ms</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                <span className="text-zinc-500 font-sans">VRAM Memory:</span>
                <span className="text-zinc-800">342 MB</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-100">
                <span className="text-zinc-500 font-sans">Execution Target:</span>
                <span className="text-zinc-800">DirectML / CPU</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-500 font-sans">Graph Integrity:</span>
                <span className="text-emerald-700 font-semibold">100% Synced</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={onComplete}
                icon={<ArrowRight className="h-4 w-4" />}
                className="w-full py-3"
                disabled={activeStep < stages.length}
              >
                {activeStep < stages.length ? 'Computing Inferences...' : 'Launch Verification Workspace'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
