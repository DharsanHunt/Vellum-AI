import React from 'react';
import { cn } from '../../lib/utils';
import { KbdBadge } from './Badge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  kbd?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  kbd,
  icon,
  isLoading,
  className,
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-zinc-900 hover:bg-zinc-800 text-white shadow-[0_2px_8px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] border border-zinc-950 hover:shadow-[0_4px_12px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
    secondary:
      'bg-white hover:bg-zinc-50/90 text-zinc-900 border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:border-zinc-300 hover:shadow-[0_3px_8px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
    danger:
      'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 shadow-[0_1px_3px_rgba(239,68,68,0.06)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
    warning:
      'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 shadow-[0_1px_3px_rgba(245,158,11,0.06)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 border-transparent',
    outline:
      'bg-transparent hover:bg-white text-zinc-800 border border-zinc-300 hover:border-zinc-400 shadow-subtle',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg font-medium',
    md: 'text-xs px-4 py-2 gap-2 rounded-xl font-medium',
    lg: 'text-sm px-5 py-2.5 gap-2.5 rounded-xl font-semibold',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
      <span>{children}</span>
      {kbd && <KbdBadge kbd={kbd} />}
    </button>
  );
};
