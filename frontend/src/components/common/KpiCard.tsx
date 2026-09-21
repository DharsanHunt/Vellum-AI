import React from 'react';
import { cn } from '../../lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  subtext?: string;
  icon?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  delta,
  deltaType = 'neutral',
  subtext,
  icon,
}) => {
  return (
    <div className="depth-card rounded-3xl p-6 flex flex-col justify-between select-none">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {label}
        </span>
        {icon && <div className="text-zinc-400 p-1.5 rounded-xl bg-zinc-50 border border-zinc-100">{icon}</div>}
      </div>

      <div className="mt-4 flex items-baseline gap-2.5">
        <span className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-zinc-950">
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              'inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full',
              deltaType === 'positive' && 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
              deltaType === 'negative' && 'bg-rose-50 text-rose-800 border border-rose-200/60',
              deltaType === 'neutral' && 'bg-zinc-100 text-zinc-600'
            )}
          >
            {deltaType === 'positive' && <ArrowUpRight className="h-3 w-3 mr-0.5" />}
            {deltaType === 'negative' && <ArrowDownRight className="h-3 w-3 mr-0.5" />}
            {deltaType === 'neutral' && <Minus className="h-3 w-3 mr-0.5" />}
            {delta}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-2 text-xs text-zinc-400 font-normal leading-relaxed pt-2 border-t border-zinc-100">
          {subtext}
        </p>
      )}
    </div>
  );
};
