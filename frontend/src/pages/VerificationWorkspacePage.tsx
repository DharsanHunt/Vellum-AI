import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, GraduationCap, FileSpreadsheet, FileText, Contact, Scroll, Award, AlertTriangle } from 'lucide-react';
import { Dossier, Verdict } from '../types';
import { DocumentCanvas } from '../features/workspace/DocumentCanvas';
import { EvidencePanel } from '../features/workspace/EvidencePanel';
import { EntityMatrix } from '../features/workspace/EntityMatrix';
import { SignatureSealCards } from '../features/workspace/SignatureSealCards';
import { DecisionDock } from '../features/workspace/DecisionDock';
import { VerdictBadge, Badge } from '../components/common/Badge';

interface VerificationWorkspacePageProps {
  dossiers: Dossier[];
  activeDossierId: string;
  onSelectDossier: (dossierId: string) => void;
  onRecordDecision: (dossierId: string, verdict: Verdict, reason: string, notes: string) => void;
}

export const VerificationWorkspacePage: React.FC<VerificationWorkspacePageProps> = ({
  dossiers,
  activeDossierId,
  onSelectDossier,
  onRecordDecision,
}) => {
  const [activeLayer, setActiveLayer] = useState<number>(1);

  const currentDossier = dossiers.find((d) => d.id === activeDossierId) || dossiers[0];
  const currentIndex = dossiers.findIndex((d) => d.id === currentDossier.id);

  // Global Keyboard Navigation Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === '1') setActiveLayer(1);
      if (e.key === '2') setActiveLayer(2);
      if (e.key === '3') setActiveLayer(3);
      if (e.key === '4') setActiveLayer(4);

      if (e.key.toLowerCase() === 'a') {
        onRecordDecision(
          currentDossier.id,
          'APPROVED',
          'Clean Credential - Verified Genuine Against Registry',
          'Keyboard shortcut [A] approved by investigator.'
        );
      }
      if (e.key.toLowerCase() === 'e') {
        onRecordDecision(
          currentDossier.id,
          'ESCALATED',
          'Secondary Manual Committee Review Required',
          'Keyboard shortcut [E] escalated.'
        );
      }
      if (e.key.toLowerCase() === 'r') {
        onRecordDecision(
          currentDossier.id,
          'REJECTED',
          'Pixel Splicing Anomaly Detected in Certificate ID / Grades',
          'Keyboard shortcut [R] rejected.'
        );
      }
      if (e.key.toLowerCase() === 'j') {
        const nextIdx = (currentIndex + 1) % dossiers.length;
        onSelectDossier(dossiers[nextIdx].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentDossier.id, dossiers, onRecordDecision, onSelectDossier]);

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'Official Academic Transcript':
        return <FileSpreadsheet className="h-3.5 w-3.5" />;
      case 'Letter of Recommendation (LOR)':
        return <FileText className="h-3.5 w-3.5" />;
      case 'Identity Verification & Student Passport':
        return <Contact className="h-3.5 w-3.5" />;
      case 'Enrollment & Candidacy Verification':
        return <Scroll className="h-3.5 w-3.5" />;
      case 'Research Fellowship Award':
        return <Award className="h-3.5 w-3.5" />;
      case 'Academic Degree Certificate':
      default:
        return <GraduationCap className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Dossier Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-400">Dossier:</span>
            <select
              value={currentDossier.id}
              onChange={(e) => onSelectDossier(e.target.value)}
              className="text-xs font-serif font-bold rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-zinc-900 shadow-subtle focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
            >
              {dossiers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.caseNumber} &mdash; {d.candidateName} ({d.documentType})
                </option>
              ))}
            </select>
          </div>

          <div className="hidden md:flex items-center gap-6 pl-4 border-l border-zinc-200 text-xs text-zinc-600">
            <div>
              <span className="text-zinc-400 text-[10px] block">Candidate</span>
              <span className="font-semibold text-zinc-900">{currentDossier.candidateName}</span>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px] block">Issuing Body</span>
              <span className="font-medium text-zinc-700">{currentDossier.institution}</span>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px] block">Credential Type</span>
              <span className="text-zinc-700">{currentDossier.documentType}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <VerdictBadge verdict={currentDossier.status} />

          <div className="flex items-center gap-1 border-l border-zinc-200 pl-3">
            <button
              onClick={() => {
                const prevIdx = (currentIndex - 1 + dossiers.length) % dossiers.length;
                onSelectDossier(dossiers[prevIdx].id);
              }}
              className="p-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 transition-colors shadow-subtle cursor-pointer"
              title="Previous Dossier"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-mono text-zinc-500 px-1.5">
              {currentIndex + 1} / {dossiers.length}
            </span>
            <button
              onClick={() => {
                const nextIdx = (currentIndex + 1) % dossiers.length;
                onSelectDossier(dossiers[nextIdx].id);
              }}
              className="p-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 transition-colors shadow-subtle cursor-pointer"
              title="Next Dossier (J)"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Document Quick Switcher Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-zinc-400 whitespace-nowrap mr-1">Switch Document:</span>
        {dossiers.map((d) => {
          const isSelected = d.id === currentDossier.id;
          const hasTampering = d.suspiciousBboxes.length > 0;
          return (
            <button
              key={d.id}
              onClick={() => onSelectDossier(d.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer select-none whitespace-nowrap shadow-xs ${
                isSelected
                  ? 'bg-zinc-900 text-white font-semibold shadow-sm ring-2 ring-zinc-900 ring-offset-1'
                  : 'bg-white text-zinc-700 hover:bg-zinc-100/90 border border-zinc-200/90'
              }`}
            >
              <span className={isSelected ? 'text-amber-400' : 'text-zinc-500'}>
                {getDocIcon(d.documentType)}
              </span>
              <span>{d.candidateName}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                isSelected 
                  ? 'bg-zinc-800 text-zinc-300' 
                  : 'bg-zinc-100 text-zinc-500'
              }`}>
                {d.documentType.split(' ')[0]}
              </span>
              {hasTampering && (
                <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" title="Tampering Flagged" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Spacious Split Viewport */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left: Document Hero Viewport (7 cols) */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <DocumentCanvas
            dossier={currentDossier}
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
          />
        </div>

        {/* Right: Progressive Disclosure Evidence & Decision Dock (5 cols) */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <EvidencePanel dossier={currentDossier} />
          <SignatureSealCards dossier={currentDossier} />
          <EntityMatrix dossier={currentDossier} />
          <DecisionDock
            dossier={currentDossier}
            onRecordDecision={(verdict, reason, notes) =>
              onRecordDecision(currentDossier.id, verdict, reason, notes)
            }
          />
        </div>
      </div>
    </div>
  );
};
