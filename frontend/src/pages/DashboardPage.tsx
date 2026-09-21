import React, { useState } from 'react';
import { Search, ArrowRight, ShieldCheck, ShieldAlert, Sparkles, FileText, Activity, Users, Clock, AlertTriangle } from 'lucide-react';
import { Dossier } from '../types';
import { SeverityBadge, VerdictBadge, Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { KpiCard } from '../components/common/KpiCard';

interface DashboardPageProps {
  dossiers: Dossier[];
  onSelectDossier: (dossierId: string) => void;
  onNavigate: (screen: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  dossiers,
  onSelectDossier,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');

  const filteredDossiers = dossiers.filter((d) => {
    const matchesSearch =
      d.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.caseNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (tierFilter === 'CRITICAL') return d.riskScore > 0.70;
    if (tierFilter === 'REVIEW') return d.riskScore >= 0.25 && d.riskScore <= 0.70;
    if (tierFilter === 'CLEAN') return d.riskScore < 0.25;
    return true;
  });

  return (
    <div className="space-y-10">
      {/* Editorial Greeting Header with Ambient Warm Lighting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200/80 relative">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Live Admissions &amp; Credential Surveillance
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-zinc-950">
            Good morning, <span className="italic font-normal">Dr. Jenkins</span>.
          </h1>
          <p className="text-sm text-zinc-500 max-w-xl leading-relaxed">
            18 academic credentials currently await verification triage in the priority review queue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => onNavigate('upload')}
            icon={<FileText className="h-4 w-4" />}
          >
            Intake Credential
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onSelectDossier(dossiers[0].id);
              onNavigate('workspace');
            }}
            icon={<ArrowRight className="h-4 w-4" />}
          >
            Open Verification Queue
          </Button>
        </div>
      </div>

      {/* Dimensional KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <KpiCard
          label="Total Ingested"
          value="1,482"
          delta="↑ 124 this week"
          deltaType="positive"
          subtext="Processed via DirectML multi-modal pipeline"
          icon={<FileText className="h-4 w-4" />}
        />
        <KpiCard
          label="Verified Genuine"
          value="84.6%"
          delta="Zero false positives"
          deltaType="positive"
          subtext="Validated against institutional registry"
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <KpiCard
          label="Anomalies Flagged"
          value="142"
          delta="9.6% intercepted"
          deltaType="negative"
          subtext="Pixel tampering & signature mismatches"
          icon={<ShieldAlert className="h-4 w-4" />}
        />
        <KpiCard
          label="Avg Triage SLA"
          value="42 sec"
          delta="↓ 18s faster"
          deltaType="positive"
          subtext="1.4 hours queue backlog remaining"
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* Priority Review Queue with Dimensional Depth Frame */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-zinc-950">Priority Verification Queue</h2>
            <p className="text-xs text-zinc-500">Live candidate dossiers ordered by anomaly probability and submission queue</p>
          </div>

          {/* Search & Filter Pills */}
          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search candidate, degree, institution..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-full border border-zinc-200/90 bg-white/90 pl-9 pr-3.5 py-2 text-zinc-900 placeholder:text-zinc-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
              />
            </div>

            <div className="flex items-center gap-1 bg-zinc-200/50 p-1 rounded-full border border-zinc-200/80 shadow-inner">
              {['ALL', 'CRITICAL', 'REVIEW', 'CLEAN'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
                    tierFilter === tier
                      ? 'bg-white text-zinc-950 shadow-[0_1px_3px_rgba(0,0,0,0.08)] font-semibold'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  {tier === 'ALL' ? 'All' : tier === 'CRITICAL' ? 'Flagged' : tier === 'REVIEW' ? 'Review' : 'Clean'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Spacious Dossier Rows with Micro Hover Elevate */}
        <div className="depth-card-static rounded-3xl overflow-hidden divide-y divide-zinc-100">
          {filteredDossiers.map((dossier) => (
            <div
              key={dossier.id}
              onClick={() => {
                onSelectDossier(dossier.id);
                onNavigate('workspace');
              }}
              className="flex items-center justify-between p-5 px-6 hover:bg-zinc-50/90 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-[#F5F1E8] border border-amber-900/10 flex items-center justify-center text-zinc-900 font-serif font-bold text-sm shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_1px_3px_rgba(0,0,0,0.04)]">
                  {dossier.candidateName.charAt(0)}
                </div>

                <div>
                  <div className="text-sm font-semibold text-zinc-950 group-hover:text-amber-900 transition-colors">
                    {dossier.candidateName}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {dossier.degree} &bull; <span className="text-zinc-700 font-medium">{dossier.institution}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <div className="font-mono text-xs font-bold text-zinc-950">
                    {(dossier.riskScore * 100).toFixed(1)}% Risk
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    {dossier.caseNumber}
                  </div>
                </div>

                <SeverityBadge severity={dossier.verdictLabel} />
                <VerdictBadge verdict={dossier.status} />

                <div className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 group-hover:bg-white group-hover:shadow-subtle transition-all">
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
