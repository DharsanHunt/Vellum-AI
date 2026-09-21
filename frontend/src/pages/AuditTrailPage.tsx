import React, { useState } from 'react';
import { Lock, ShieldCheck, RefreshCw, Key, Hash, Clock, UserCheck } from 'lucide-react';
import { MOCK_AUDIT_BLOCKS } from '../data/mockData';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const AuditTrailPage: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleReverify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
    }, 600);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Cryptographic Chain of Custody
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-zinc-950">
            Immutable Audit Trail
          </h1>
          <p className="text-xs text-zinc-500 max-w-xl leading-relaxed">
            SHA-256 hash-chained event blocks ensuring non-repudiation, tamper-evidence, and compliance.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleReverify}
          isLoading={isVerifying}
          icon={<RefreshCw className="h-3.5 w-3.5" />}
        >
          Re-Validate Chain Hashes
        </Button>
      </div>

      {/* Integrity Banner with Luminous Emerald Glow */}
      <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 via-white to-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-100/80 border border-emerald-300/80 flex items-center justify-center text-emerald-800 shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-emerald-950">
              Chain Integrity 100% Cryptographically Validated
            </div>
            <div className="text-xs text-emerald-800 leading-relaxed">
              All 4 blocks verified against SHA-256 parent hash pointers with zero unauthorized mutations.
            </div>
          </div>
        </div>

        <Badge variant="genuine" size="md" dot>Verified &amp; Synced</Badge>
      </div>

      {/* Event Block Timeline */}
      <div className="space-y-5 relative">
        {MOCK_AUDIT_BLOCKS.map((block, idx) => (
          <div
            key={block.blockId}
            className="depth-card rounded-3xl p-6 space-y-4 relative"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 px-3 py-1 rounded-xl border border-zinc-200/70 shadow-inner">
                  {block.blockId}
                </span>
                <span className="text-sm font-semibold text-zinc-950">
                  {block.eventType}
                </span>
              </div>
              <span className="font-mono text-xs text-zinc-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {block.timestamp}
              </span>
            </div>

            <div className="text-xs text-zinc-600 leading-relaxed">
              <strong className="text-zinc-900 font-semibold">Actor:</strong> {block.actor} &nbsp;|&nbsp;{' '}
              <strong className="text-zinc-900 font-semibold">Action Summary:</strong> {block.details}
            </div>

            <div className="rounded-2xl bg-zinc-50/80 p-4 border border-zinc-200/70 font-mono text-[11px] space-y-2 text-zinc-600 shadow-inner">
              <div className="flex items-center gap-3">
                <span className="text-zinc-400 w-24 flex-shrink-0 font-sans font-medium text-[11px]">Parent Hash:</span>
                <span className="text-zinc-500 truncate bg-white px-2 py-0.5 rounded border border-zinc-200/60 w-full">{block.prevHash}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-zinc-400 w-24 flex-shrink-0 font-sans font-medium text-[11px]">Block Digest:</span>
                <span className="text-zinc-900 truncate font-bold bg-white px-2 py-0.5 rounded border border-zinc-200/60 w-full">{block.currHash}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
