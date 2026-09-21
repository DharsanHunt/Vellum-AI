import React, { useState } from 'react';
import { Search, FileSpreadsheet, FileJson, History } from 'lucide-react';
import { Dossier } from '../types';
import { VerdictBadge, SeverityBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

interface VerificationHistoryPageProps {
  dossiers: Dossier[];
}

export const VerificationHistoryPage: React.FC<VerificationHistoryPageProps> = ({
  dossiers,
}) => {
  const [search, setSearch] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('ALL');

  const historyRecords = [
    { id: 'REC-001', date: '2024-10-24 14:22 UTC', caseNumber: 'KF-2024-001', candidate: 'Arun Kumar', institution: 'Apex University of Technology', type: 'Degree Certificate', verdict: 'APPROVED', risk: '14.2%', reviewer: 'Dr. Sarah Jenkins', reason: 'Clean Credential - Verified Genuine' },
    { id: 'REC-002', date: '2024-10-24 13:45 UTC', caseNumber: 'KF-2024-002', candidate: 'Kavita Sharma', institution: 'National Institute of Science', type: 'Transcript', verdict: 'REJECTED', risk: '88.4%', reviewer: 'Dr. Sarah Jenkins', reason: 'Pixel Splicing Anomaly in GPA Field' },
    { id: 'REC-003', date: '2024-10-24 12:10 UTC', caseNumber: 'KF-2024-003', candidate: 'Rohan Verma', institution: 'Metropolitan University', type: 'Certificate', verdict: 'ESCALATED', risk: '46.5%', reviewer: 'Dr. Sarah Jenkins', reason: 'Secondary Manual Committee Review Required' },
    { id: 'REC-004', date: '2024-10-23 18:30 UTC', caseNumber: 'KF-2024-004', candidate: 'Priya Nair', institution: 'Apex University of Technology', type: 'Degree Certificate', verdict: 'APPROVED', risk: '8.7%', reviewer: 'Arun Kumar', reason: 'Clean Credential - Verified Genuine' },
    { id: 'REC-005', date: '2024-10-23 16:15 UTC', caseNumber: 'KF-2024-005', candidate: 'Sanjay Patel', institution: 'Counterfeit Polytechnic', type: 'Certificate', verdict: 'REJECTED', risk: '98.5%', reviewer: 'Dr. Sarah Jenkins', reason: 'Unaccredited Institution or Counterfeit Template' },
  ];

  const filtered = historyRecords.filter((r) => {
    const matchSearch =
      r.candidate.toLowerCase().includes(search.toLowerCase()) ||
      r.institution.toLowerCase().includes(search.toLowerCase()) ||
      r.caseNumber.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (verdictFilter !== 'ALL' && r.verdict !== verdictFilter) return false;
    return true;
  });

  const exportCSV = () => {
    const header = 'ID,Date,Case,Candidate,Institution,Type,Verdict,Risk,Reviewer,Reason\n';
    const rows = filtered.map(r => `${r.id},${r.date},${r.caseNumber},${r.candidate},${r.institution},${r.type},${r.verdict},${r.risk},${r.reviewer},"${r.reason}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kana_forge_verification_history.csv';
    a.click();
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kana_forge_verification_history.json';
    a.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-zinc-900" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Immutable Audit Ledger
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-zinc-950">
            Verification History &amp; Archive
          </h1>
          <p className="text-xs text-zinc-500 max-w-xl leading-relaxed">
            Immutable record of all processed credentials, forensic scores, and investigator sign-offs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={exportCSV} icon={<FileSpreadsheet className="h-3.5 w-3.5" />}>
            Export CSV
          </Button>
          <Button variant="secondary" size="sm" onClick={exportJSON} icon={<FileJson className="h-3.5 w-3.5" />}>
            Export JSON
          </Button>
        </div>
      </div>

      <div className="depth-card-static rounded-3xl p-6 space-y-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-100">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search history by candidate, case ID, or institution..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs rounded-full border border-zinc-200/90 bg-zinc-50/70 hover:bg-white pl-9 pr-3.5 py-2 text-zinc-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 bg-zinc-200/50 p-1 rounded-full border border-zinc-200/80 shadow-inner">
            {['ALL', 'APPROVED', 'ESCALATED', 'REJECTED'].map((v) => (
              <button
                key={v}
                onClick={() => setVerdictFilter(v)}
                className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
                  verdictFilter === v
                    ? 'bg-white text-zinc-950 shadow-[0_1px_3px_rgba(0,0,0,0.08)] font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {v === 'ALL' ? 'All' : v.charAt(0) + v.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200/80 text-[11px] text-zinc-400 font-medium">
                <th className="py-3 px-3">Date (UTC)</th>
                <th className="py-3 px-3">Case ID</th>
                <th className="py-3 px-3">Candidate</th>
                <th className="py-3 px-3">Institution</th>
                <th className="py-3 px-3 text-center">Verdict</th>
                <th className="py-3 px-3 text-center">Risk</th>
                <th className="py-3 px-3">Reviewer</th>
                <th className="py-3 px-3">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-mono">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3.5 px-3 text-zinc-500 font-sans text-xs">{row.date}</td>
                  <td className="py-3.5 px-3 font-semibold text-zinc-950">{row.caseNumber}</td>
                  <td className="py-3.5 px-3 font-sans font-semibold text-zinc-950">{row.candidate}</td>
                  <td className="py-3.5 px-3 font-sans text-zinc-700">{row.institution}</td>
                  <td className="py-3.5 px-3 text-center">
                    <VerdictBadge verdict={row.verdict as any} />
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-zinc-950">{row.risk}</td>
                  <td className="py-3.5 px-3 font-sans text-zinc-600 text-xs">{row.reviewer}</td>
                  <td className="py-3.5 px-3 font-sans text-zinc-500 text-xs max-w-xs truncate" title={row.reason}>
                    {row.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
