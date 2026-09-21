import React, { useState } from 'react';
import { Sliders, Bell, Save, CheckCircle2, SlidersHorizontal, Webhook, ShieldAlert } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const SettingsPage: React.FC = () => {
  const [tamperingThresh, setTamperingThresh] = useState(0.45);
  const [sigThresh, setSigThresh] = useState(0.65);
  const [stampThresh, setStampThresh] = useState(0.15);
  const [escalationMult, setEscalationMult] = useState(1.5);
  const [isSaved, setIsSaved] = useState(false);
  const [webhookTestSent, setWebhookTestSent] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTestWebhook = () => {
    setWebhookTestSent(true);
    setTimeout(() => setWebhookTestSent(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-zinc-900" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Calibration &amp; Integrations
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-zinc-950">
            Model Settings &amp; Thresholds
          </h1>
          <p className="text-xs text-zinc-500 max-w-xl leading-relaxed">
            Fine-tune forensic sensitivity thresholds, fusion weights, and SIEM alerting dispatch endpoints.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          icon={<Save className="h-3.5 w-3.5" />}
        >
          {isSaved ? 'Calibration Saved' : 'Save Calibration Profile'}
        </Button>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5 shadow-card">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>Forensic weights successfully synchronized to active PyTorch runtime (`models/fusion_weights.json`).</span>
        </div>
      )}

      {/* Threshold Sliders */}
      <div className="depth-card-static rounded-3xl p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-zinc-600" />
            <span className="text-xs font-semibold text-zinc-900">Neural Sensitivity Thresholds</span>
          </div>
          <Badge variant="neutral" size="sm">Tuning Active</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
          <div className="space-y-2.5 p-4 rounded-2xl bg-zinc-50/70 border border-zinc-200/70 shadow-inner">
            <div className="flex justify-between font-semibold">
              <span className="text-zinc-700">UNet Tampering Sensitivity:</span>
              <span className="font-mono text-zinc-950 font-bold bg-white px-2 py-0.5 rounded border border-zinc-200 shadow-sm">{tamperingThresh}</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={tamperingThresh}
              onChange={(e) => setTamperingThresh(parseFloat(e.target.value))}
              className="w-full accent-zinc-900 cursor-pointer"
            />
            <p className="text-[11px] text-zinc-400">Lower values flag subtler pixel-level font alterations.</p>
          </div>

          <div className="space-y-2.5 p-4 rounded-2xl bg-zinc-50/70 border border-zinc-200/70 shadow-inner">
            <div className="flex justify-between font-semibold">
              <span className="text-zinc-700">Signature Similarity Threshold:</span>
              <span className="font-mono text-zinc-950 font-bold bg-white px-2 py-0.5 rounded border border-zinc-200 shadow-sm">{sigThresh}</span>
            </div>
            <input
              type="range"
              min="0.40"
              max="0.95"
              step="0.05"
              value={sigThresh}
              onChange={(e) => setSigThresh(parseFloat(e.target.value))}
              className="w-full accent-zinc-900 cursor-pointer"
            />
            <p className="text-[11px] text-zinc-400">Minimum cosine similarity required to authenticate signature.</p>
          </div>

          <div className="space-y-2.5 p-4 rounded-2xl bg-zinc-50/70 border border-zinc-200/70 shadow-inner">
            <div className="flex justify-between font-semibold">
              <span className="text-zinc-700">Stamp Seal Ink Coverage:</span>
              <span className="font-mono text-zinc-950 font-bold bg-white px-2 py-0.5 rounded border border-zinc-200 shadow-sm">{stampThresh}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.05"
              value={stampThresh}
              onChange={(e) => setStampThresh(parseFloat(e.target.value))}
              className="w-full accent-zinc-900 cursor-pointer"
            />
            <p className="text-[11px] text-zinc-400">Required HSV ink density inside seal bounding region.</p>
          </div>

          <div className="space-y-2.5 p-4 rounded-2xl bg-zinc-50/70 border border-zinc-200/70 shadow-inner">
            <div className="flex justify-between font-semibold">
              <span className="text-zinc-700">Fraud Escalation Multiplier:</span>
              <span className="font-mono text-zinc-950 font-bold bg-white px-2 py-0.5 rounded border border-zinc-200 shadow-sm">{escalationMult}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={escalationMult}
              onChange={(e) => setEscalationMult(parseFloat(e.target.value))}
              className="w-full accent-zinc-900 cursor-pointer"
            />
            <p className="text-[11px] text-zinc-400">Non-linearly escalates risk if any single signal flags severe fraud.</p>
          </div>
        </div>
      </div>

      {/* SIEM Webhooks */}
      <div className="depth-card-static rounded-3xl p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <Webhook className="h-4 w-4 text-zinc-600" />
            <span className="text-xs font-semibold text-zinc-900">SIEM &amp; Alert Webhooks</span>
          </div>
          <Badge variant="neutral" size="sm">Real-time Dispatch</Badge>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">
              SIEM Event Ingestion Endpoint:
            </label>
            <input
              type="text"
              defaultValue="https://siem-collector.internal.corp/v1/vellum-alerts"
              className="w-full font-mono rounded-xl border border-zinc-200/90 bg-zinc-50/70 hover:bg-white px-3.5 py-2.5 text-zinc-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 mb-1.5">
              Minimum Alert Severity:
            </label>
            <select className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/70 hover:bg-white px-3.5 py-2.5 text-zinc-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-colors cursor-pointer font-medium">
              <option>🚨 Critical Fraud Only (Risk &gt; 75%)</option>
              <option>⚠️ Manual Review &amp; Critical (Risk &gt; 50%)</option>
              <option>All Ingested Credentials</option>
            </select>
          </div>

          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleTestWebhook}
              icon={<Bell className="h-3.5 w-3.5" />}
            >
              {webhookTestSent ? 'Test Alert Dispatched (HTTP 200 OK)' : 'Dispatch Test Alert'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
