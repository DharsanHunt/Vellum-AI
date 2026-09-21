import React from 'react';
import { cn } from '../../lib/utils';
import { Severity, Verdict } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'genuine' | 'warning' | 'danger' | 'neural' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
}) => {
  const variantStyles = {
    genuine: 'bg-emerald-50/90 text-emerald-800 border-emerald-200/80 shadow-[0_1px_2px_rgba(16,185,129,0.08)]',
    warning: 'bg-amber-50/90 text-amber-900 border-amber-200/80 shadow-[0_1px_2px_rgba(245,158,11,0.08)]',
    danger: 'bg-rose-50/90 text-rose-900 border-rose-200/80 shadow-[0_1px_2px_rgba(239,68,68,0.08)]',
    neural: 'bg-zinc-100/90 text-zinc-900 border-zinc-200/80 shadow-subtle',
    neutral: 'bg-white/80 text-zinc-700 border-zinc-200/70 shadow-subtle',
    outline: 'bg-transparent text-zinc-700 border-zinc-300',
  };

  const dotColors = {
    genuine: 'bg-emerald-600',
    warning: 'bg-amber-600',
    danger: 'bg-rose-600',
    neural: 'bg-zinc-700',
    neutral: 'bg-zinc-400',
    outline: 'bg-zinc-500',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 font-medium tracking-tight',
    md: 'text-xs px-3 py-1 font-medium tracking-tight',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border backdrop-blur-sm transition-all select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full animate-pulse', dotColors[variant])} />
      )}
      {children}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
  switch (severity) {
    case 'AUTHENTIC':
      return <Badge variant="genuine" dot>Authentic</Badge>;
    case 'EVALUATION':
      return <Badge variant="warning" dot>Manual Review</Badge>;
    case 'SUSPICIOUS':
      return <Badge variant="warning" dot>Suspicious</Badge>;
    case 'CRITICAL_FRAUD':
      return <Badge variant="danger" dot>Critical Anomaly</Badge>;
    default:
      return <Badge variant="neutral">{severity}</Badge>;
  }
};

export const VerdictBadge: React.FC<{ verdict: Verdict }> = ({ verdict }) => {
  switch (verdict) {
    case 'APPROVED':
      return <Badge variant="genuine">Approved</Badge>;
    case 'ESCALATED':
      return <Badge variant="warning">Escalated</Badge>;
    case 'REJECTED':
      return <Badge variant="danger">Rejected</Badge>;
    case 'PENDING':
      return <Badge variant="neutral">Pending Triage</Badge>;
  }
};

export const KbdBadge: React.FC<{ kbd: string }> = ({ kbd }) => (
  <kbd className="inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-600 bg-white border border-zinc-200/90 rounded-md shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
    {kbd}
  </kbd>
);
