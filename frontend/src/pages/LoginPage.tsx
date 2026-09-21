import React, { useState } from 'react';
import { Shield, Lock, Mail, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { UserProfile } from '../types';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('lead.forensics@kana-forge.security');
  const [role, setRole] = useState<'Senior Fraud Investigator' | 'Admissions Reviewer' | 'Platform Admin'>('Senior Fraud Investigator');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: 'usr-810',
      name: role === 'Admissions Reviewer' ? 'Arun Kumar' : role === 'Platform Admin' ? 'Alex Rivera' : 'Dr. Sarah Jenkins',
      email: email,
      role: role,
      department: role === 'Admissions Reviewer' ? 'Admissions Office' : 'Forensic Triage Unit',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 flex items-center justify-center p-6 selection:bg-zinc-900 selection:text-white bg-subtle-mesh">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-[0_4px_16px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.2)]">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-4xl font-normal tracking-tight text-zinc-950">
            Kana-Forge
          </h1>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
            Multi-Modal AI Document Verification &amp; Forensic Intelligence
          </p>
        </div>

        {/* Login Card with Depth */}
        <div className="depth-card rounded-3xl p-8 space-y-6 shadow-card">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <span className="text-xs font-semibold text-zinc-900">Enterprise Access Gateway</span>
            <Badge variant="genuine" size="sm" dot>SSO ACTIVE</Badge>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 mb-1.5">
                Authentication Role:
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full rounded-2xl border border-zinc-200/90 bg-zinc-50/70 hover:bg-white px-3.5 py-2.5 text-zinc-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors cursor-pointer font-medium"
              >
                <option value="Senior Fraud Investigator">Senior Fraud Investigator (Forensic Lead)</option>
                <option value="Admissions Reviewer">Admissions Reviewer (Standard Triage)</option>
                <option value="Platform Admin">Platform Admin &amp; ML Engineer</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1.5">
                Institutional Email:
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200/90 bg-zinc-50/70 hover:bg-white pl-10 pr-3.5 py-2.5 text-zinc-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1.5">
                Security Token:
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                <input
                  type="password"
                  defaultValue="••••••••••••"
                  className="w-full rounded-2xl border border-zinc-200/90 bg-zinc-50/70 hover:bg-white pl-10 pr-3.5 py-2.5 text-zinc-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 mb-1.5">
                MFA Authenticator Code:
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  defaultValue="829104"
                  className="w-full font-mono rounded-2xl border border-zinc-200/90 bg-zinc-50/70 hover:bg-white pl-10 pr-3.5 py-2.5 text-zinc-900 tracking-wider shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full mt-3 py-3" icon={<ArrowRight className="h-4 w-4" />}>
              Sign In to Workspace
            </Button>
          </form>

          {/* Quick Persona Buttons */}
          <div className="pt-4 border-t border-zinc-100 space-y-2.5">
            <span className="text-[11px] font-medium text-zinc-400 block text-center">1-Click Test Persona Switcher:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRole('Admissions Reviewer');
                  setEmail('arun.officer@apex-admissions.edu');
                }}
                className="px-2.5 py-2 rounded-xl bg-zinc-50 hover:bg-white border border-zinc-200/80 text-xs font-medium text-zinc-800 text-center shadow-subtle hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                Reviewer
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('Senior Fraud Investigator');
                  setEmail('lead.forensics@kana-forge.security');
                }}
                className="px-2.5 py-2 rounded-xl bg-zinc-50 hover:bg-white border border-zinc-200/80 text-xs font-medium text-zinc-800 text-center shadow-subtle hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                Investigator
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('Platform Admin');
                  setEmail('admin@kana-forge.internal');
                }}
                className="px-2.5 py-2 rounded-xl bg-zinc-50 hover:bg-white border border-zinc-200/80 text-xs font-medium text-zinc-800 text-center shadow-subtle hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-zinc-400 font-mono">
          Protected by SHA-256 HMAC Authentication &amp; RBAC Policy
        </div>
      </div>
    </div>
  );
};
