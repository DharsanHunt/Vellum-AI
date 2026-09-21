import React, { useState } from 'react';
import { Users, Key, Server, Plus, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const AdministrationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'keys' | 'system'>('users');
  const [apiKeys, setApiKeys] = useState([
    { alias: 'Admissions Ingestion Gateway', prefix: 'kf_live_9a8f...', scope: 'doc:verify, doc:read', created: '2024-09-01', status: 'Active' },
    { alias: 'Automated Batch Ingestion Daemon', prefix: 'kf_live_3c2d...', scope: 'doc:verify_batch', created: '2024-09-15', status: 'Active' },
    { alias: 'SIEM Security Audit Sync', prefix: 'kf_read_77e1...', scope: 'audit:read', created: '2024-10-01', status: 'Active' },
  ]);

  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const generateKey = () => {
    const randomHex = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newKey = `kf_live_${randomHex}`;
    setCreatedKey(newKey);
    setApiKeys((prev) => [
      { alias: 'New Operator Scoped Key', prefix: `${newKey.slice(0, 12)}...`, scope: 'doc:verify', created: 'Just Now', status: 'Active' },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1.5 pb-4 border-b border-zinc-200/80">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-zinc-900" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Governance &amp; Controls
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-zinc-950">
          Administration &amp; Access Control
        </h1>
        <p className="text-xs text-zinc-500 max-w-xl leading-relaxed">
          Manage operator accounts, provision scoped API credentials, and monitor DirectML compute telemetry.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 bg-zinc-200/50 p-1 rounded-full border border-zinc-200/80 shadow-inner w-fit">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
            activeTab === 'users' ? 'bg-white text-zinc-950 shadow-[0_1px_3px_rgba(0,0,0,0.08)] font-semibold' : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          <Users className="h-3.5 w-3.5" /> Operator Directory
        </button>
        <button
          onClick={() => setActiveTab('keys')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
            activeTab === 'keys' ? 'bg-white text-zinc-950 shadow-[0_1px_3px_rgba(0,0,0,0.08)] font-semibold' : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          <Key className="h-3.5 w-3.5" /> Scoped API Keys
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${
            activeTab === 'system' ? 'bg-white text-zinc-950 shadow-[0_1px_3px_rgba(0,0,0,0.08)] font-semibold' : 'text-zinc-600 hover:text-zinc-950'
          }`}
        >
          <Server className="h-3.5 w-3.5" /> Compute Telemetry
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="depth-card-static rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <span className="text-xs font-semibold text-zinc-900">Authorized Operators</span>
            <Badge variant="genuine" size="sm" dot>5 Accounts Active</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200/80 text-[11px] text-zinc-400 font-medium">
                  <th className="py-2.5 px-3">Operator</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-zinc-950">Dr. Sarah Jenkins</td>
                  <td className="py-3.5 px-3 font-mono text-zinc-500">lead.forensics@vellum.security</td>
                  <td className="py-3.5 px-3"><Badge variant="neutral" size="sm">Senior Fraud Investigator</Badge></td>
                  <td className="py-3.5 px-3 text-zinc-600">Forensic Review Unit</td>
                  <td className="py-3.5 px-3 text-right"><Badge variant="genuine" size="sm">Active</Badge></td>
                </tr>
                <tr className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-zinc-950">Arun Kumar</td>
                  <td className="py-3.5 px-3 font-mono text-zinc-500">arun.officer@apex-admissions.edu</td>
                  <td className="py-3.5 px-3"><Badge variant="neutral" size="sm">Admissions Reviewer</Badge></td>
                  <td className="py-3.5 px-3 text-zinc-600">Undergraduate Admissions</td>
                  <td className="py-3.5 px-3 text-right"><Badge variant="genuine" size="sm">Active</Badge></td>
                </tr>
                <tr className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-zinc-950">Alex Rivera</td>
                  <td className="py-3.5 px-3 font-mono text-zinc-500">admin@vellum.internal</td>
                  <td className="py-3.5 px-3"><Badge variant="neutral" size="sm">Platform Admin</Badge></td>
                  <td className="py-3.5 px-3 text-zinc-600">Infrastructure &amp; AI</td>
                  <td className="py-3.5 px-3 text-right"><Badge variant="genuine" size="sm">Active</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'keys' && (
        <div className="depth-card-static rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <span className="text-xs font-semibold text-zinc-900">API Credentials</span>
              <p className="text-xs text-zinc-500">Scoped keys for automated system-to-system verification</p>
            </div>
            <Button variant="primary" size="sm" onClick={generateKey} icon={<Plus className="h-3.5 w-3.5" />}>
              Create Key
            </Button>
          </div>

          {createdKey && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5 shadow-sm">
              <span className="font-semibold">New API Key Created:</span>
              <div className="font-mono text-xs text-zinc-900 bg-white p-2.5 rounded-xl border border-emerald-200 select-all shadow-inner">
                {createdKey}
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200/80 text-[11px] text-zinc-400 font-medium">
                  <th className="py-2.5 px-3">Alias</th>
                  <th className="py-2.5 px-3">Prefix</th>
                  <th className="py-2.5 px-3">Scope Permissions</th>
                  <th className="py-2.5 px-3">Created</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-mono text-xs">
                {apiKeys.map((k, i) => (
                  <tr key={i} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-sans font-semibold text-zinc-950">{k.alias}</td>
                    <td className="py-3.5 px-3 text-zinc-600">{k.prefix}</td>
                    <td className="py-3.5 px-3 text-zinc-500 font-sans">{k.scope}</td>
                    <td className="py-3.5 px-3 text-zinc-400 font-sans text-xs">{k.created}</td>
                    <td className="py-3.5 px-3 text-right"><Badge variant="genuine" size="sm">{k.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="depth-card-static rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <span className="text-xs font-semibold text-zinc-900">Compute Hardware Telemetry</span>
            <Badge variant="genuine" size="sm" dot>DirectML Online</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="depth-card rounded-2xl p-5 space-y-1">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Compute Target</span>
              <div className="font-serif text-2xl font-bold text-zinc-950">DirectML / CPU</div>
              <span className="text-xs text-emerald-700 font-semibold">Hardware acceleration active</span>
            </div>
            <div className="depth-card rounded-2xl p-5 space-y-1">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">CPU Allocation</span>
              <div className="font-serif text-2xl font-bold text-zinc-950">12 Cores</div>
              <span className="text-xs text-zinc-500">Average load: 14.2%</span>
            </div>
            <div className="depth-card rounded-2xl p-5 space-y-1">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">System Memory</span>
              <div className="font-serif text-2xl font-bold text-zinc-950">16.0 GB</div>
              <span className="text-xs text-zinc-500">Available: 9.8 GB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
