import React from 'react';
import { cn, formatPercentage } from '../../lib/utils';
import { Badge } from './Badge';

interface RiskGaugeProps {
  score: number;
  label?: string;
  showDetails?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  label = 'Forensic Risk Assessment',
  showDetails = true,
}) => {
  const pct = Math.min(100, Math.max(0, score * 100));

  let colorGradient = 'from-emerald-500 via-emerald-600 to-teal-600';
  let badgeVariant: 'genuine' | 'warning' | 'danger' = 'genuine';
  let badgeText = 'Low Risk (Validated Authentic)';

  if (score > 0.75) {
    colorGradient = 'from-rose-500 via-rose-600 to-red-700';
    badgeVariant = 'danger';
    badgeText = 'Critical Anomaly Detected';
  } else if (score > 0.50) {
    colorGradient = 'from-amber-500 via-amber-600 to-orange-600';
    badgeVariant = 'warning';
    badgeText = 'Elevated Risk (Manual Review)';
  } else if (score > 0.25) {
    colorGradient = 'from-amber-400 via-amber-500 to-yellow-600';
    badgeVariant = 'warning';
    badgeText = 'Moderate Risk';
  }

  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          {label}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold text-zinc-950 tracking-tight">
            {formatPercentage(score)}
          </span>
          <span className="text-[10px] text-zinc-400 uppercase font-medium">Risk Score</span>
        </div>
      </div>

      {/* Dimensional Progress Meter with Inset Shadow & Glass Bevel */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 p-0.5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] border border-zinc-200/80 relative">
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r shadow-[0_1px_4px_rgba(0,0,0,0.18)] transition-all duration-700 ease-out relative overflow-hidden',
            colorGradient
          )}
          style={{ width: `${pct}%` }}
        >
          {/* Internal Specular Highlight Bar */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-white/40" />
        </div>
      </div>

      {showDetails && (
        <div className="flex items-center justify-between pt-0.5">
          <Badge variant={badgeVariant} size="sm">
            {badgeText}
          </Badge>
          <span className="text-[11px] font-mono text-zinc-400 font-medium">
            Multi-Signal Neural Fusion
          </span>
        </div>
      )}
    </div>
  );
};
