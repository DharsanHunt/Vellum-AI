import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full ${widthStyles[maxWidth]} rounded-2xl border border-zinc-200/80 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h3 className="text-base font-semibold text-zinc-900 tracking-tight">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} icon={<X className="h-4 w-4 text-zinc-400" />}>
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="overflow-y-auto p-6 text-sm text-zinc-600 space-y-4">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-zinc-100 px-6 py-4 bg-zinc-50/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
