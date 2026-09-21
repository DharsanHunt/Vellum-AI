import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, AlertTriangle, XCircle, FileSignature, ShieldCheck, ArrowRight } from 'lucide-react';
import { Dossier, Verdict } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface DecisionDockProps {
  dossier: Dossier;
  onRecordDecision: (verdict: Verdict, reason: string, notes: string) => void;
}

export const DecisionDock: React.FC<DecisionDockProps> = ({
  dossier,
  onRecordDecision,
}) => {
  const isTampered = dossier.suspiciousBboxes.length > 0;

  const reasonCodes = [
    'Clean Credential - Verified Genuine Against Registry',
    'Pixel Splicing Anomaly Detected in Certificate ID / Grades',
    'Biometric Signature Discrepancy vs Anchor',
    'Official Institutional Seal Absent or Spliced',
    'Entity Inconsistency with Application Portfolio',
    'Unaccredited Institution or Counterfeit Template',
    'Secondary Manual Committee Review Required',
  ];

  const defaultReason = isTampered ? reasonCodes[1] : reasonCodes[0];
  const [selectedReason, setSelectedReason] = useState<string>(defaultReason);
  const [auditNotes, setAuditNotes] = useState<string>(
    `${defaultReason}. Multi-modal neural verification evaluated by investigator.`
  );

  const handleApprove = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#10B981', '#34D399', '#6EE7B7', '#D1FAE5'],
    });
    onRecordDecision('APPROVED', selectedReason, auditNotes);
  };

  const handleEscalate = () => {
    onRecordDecision('ESCALATED', selectedReason, auditNotes);
  };

  const handleReject = () => {
    onRecordDecision('REJECTED', selectedReason, auditNotes);
  };

  return (
    <div className="depth-dock rounded-3xl p-6 space-y-5 border border-zinc-200/90 shadow-floating-dock relative overflow-hidden">
      {/* Ambient Top Light Reflection */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      <div className="flex items-center justify-between border-b border-zinc-200/70 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-sm">
            <FileSignature className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-900">Reviewer Decision Dock</span>
            <div className="text-[10px] text-zinc-400">Cryptographic Sign-Off Console</div>
          </div>
        </div>
        <Badge variant="neutral" size="sm">
          Operator: REV-810
        </Badge>
      </div>

      <div className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Verification Reason Code:
          </label>
          <div className="relative">
            <select
              value={selectedReason}
              onChange={(e) => {
                setSelectedReason(e.target.value);
                setAuditNotes(`${e.target.value}. Verified via 7-stage neural pipeline.`);
              }}
              className="w-full text-xs font-medium rounded-2xl border border-zinc-200/90 bg-zinc-50/70 hover:bg-white px-4 py-2.5 text-zinc-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors cursor-pointer"
            >
              {reasonCodes.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Investigator Audit Log Note:
          </label>
          <input
            type="text"
            value={auditNotes}
            onChange={(e) => setAuditNotes(e.target.value)}
            className="w-full text-xs rounded-2xl border border-zinc-200/90 bg-zinc-50/70 hover:bg-white px-4 py-2.5 text-zinc-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2">
        <Button
          variant="primary"
          onClick={handleApprove}
          kbd="A"
          icon={<CheckCircle className="h-4 w-4 text-emerald-300" />}
          className="w-full py-2.5"
        >
          Approve
        </Button>

        <Button
          variant="warning"
          onClick={handleEscalate}
          kbd="E"
          icon={<AlertTriangle className="h-4 w-4" />}
          className="w-full py-2.5"
        >
          Escalate
        </Button>

        <Button
          variant="danger"
          onClick={handleReject}
          kbd="R"
          icon={<XCircle className="h-4 w-4 text-rose-300" />}
          className="w-full py-2.5"
        >
          Reject
        </Button>
      </div>
    </div>
  );
};
