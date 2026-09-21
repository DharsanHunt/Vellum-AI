import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp, ShieldCheck, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import { Dossier } from '../../types';
import { RiskGauge } from '../../components/common/RiskGauge';
import { SeverityBadge, Badge } from '../../components/common/Badge';

interface EvidencePanelProps {
  dossier: Dossier;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ dossier }) => {
  const [showTechnicalWeights, setShowTechnicalWeights] = useState(false);
  const isClean = dossier.riskScore <= 0.25;

  return (
    <div className="space-y-5">
      {/* Primary Verification Result Hero with Subtle Luminous Depth */}
      <div className={`rounded-3xl p-6 border transition-all duration-300 ${
        isClean 
          ? 'bg-gradient-to-b from-emerald-50/80 via-white to-white border-emerald-200/80 shadow-card'
          : 'bg-gradient-to-b from-rose-50/80 via-white to-white border-rose-200/80 shadow-card'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-zinc-900" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Multi-Modal Neural Verdict
            </span>
          </div>
          <SeverityBadge severity={dossier.verdictLabel} />
        </div>

        <div className="pt-4 space-y-2">
          <div className="flex items-center gap-2">
            {isClean ? (
              <ShieldCheck className="h-6 w-6 text-emerald-600 flex-shrink-0" />
            ) : (
              <ShieldAlert className="h-6 w-6 text-rose-600 flex-shrink-0" />
            )}
            <h2 className="font-serif text-2xl font-bold tracking-tight text-zinc-900">
              {isClean ? 'Credential Validated Genuine' : 'Forensic Discrepancy Flagged'}
            </h2>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">
            {isClean
              ? `All multi-modal signals — including UNet pixel forensics, Siamese signature verification, and official seal geometry — align perfectly with accredited records for ${dossier.institution}.`
              : `Multi-modal evaluation detected localized font manipulation and signature discrepancies requiring investigator review before final accreditation.`}
          </p>

          <div className="pt-3">
            <RiskGauge score={dossier.riskScore} />
          </div>
        </div>
      </div>

      {/* Key Verification Findings with Tactile Micro-Cards */}
      <div className="depth-card-static rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-zinc-600" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Key Verification Findings
            </h3>
          </div>
          <span className="font-mono text-[11px] text-zinc-400">
            {dossier.criticalAnomalies.length} Flagged Points
          </span>
        </div>

        <div className="space-y-2.5">
          {dossier.criticalAnomalies.length > 0 ? (
            dossier.criticalAnomalies.map((anomaly, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/70 text-xs text-rose-950 leading-relaxed shadow-[0_1px_2px_rgba(244,63,94,0.06)]"
              >
                <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{anomaly}</span>
              </div>
            ))
          ) : (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-xs text-emerald-950 leading-relaxed shadow-[0_1px_2px_rgba(16,185,129,0.06)]">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="font-medium">
                Pixel integrity, biometric signature velocity, and seal ink geometry match reference standards with zero anomalies.
              </span>
            </div>
          )}
        </div>

        {/* Progressive Disclosure: Technical Weights Drawer */}
        <div className="pt-2 border-t border-zinc-100">
          <button
            onClick={() => setShowTechnicalWeights(!showTechnicalWeights)}
            className="flex items-center justify-between w-full text-xs font-medium text-zinc-600 hover:text-zinc-950 py-1 transition-colors cursor-pointer"
          >
            <span>View Detailed Signal Contribution Weights</span>
            {showTechnicalWeights ? (
              <ChevronUp className="h-4 w-4 text-zinc-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            )}
          </button>

          {showTechnicalWeights && (
            <div className="pt-3 space-y-2 animate-in fade-in duration-150">
              {dossier.evidenceList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-zinc-50/80 border border-zinc-200/70 text-xs space-y-1 shadow-subtle"
                >
                  <div className="flex items-center justify-between font-semibold text-zinc-900">
                    <span>{item.signalName}</span>
                    <Badge
                      variant={
                        item.status === 'PASS'
                          ? 'genuine'
                          : item.status === 'FAIL'
                          ? 'danger'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {item.status} &bull; Weight {item.weight}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
