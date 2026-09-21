import React from 'react';
import { BarChart3, TrendingUp, Cpu, Activity, ShieldCheck, Sparkles } from 'lucide-react';
import { KpiCard } from '../components/common/KpiCard';
import { Badge } from '../components/common/Badge';

export const AnalyticsPage: React.FC = () => {
  const modalities = [
    { name: 'Pixel Splicing / Grade Tampering (UNet)', count: 64, pct: '45.1%' },
    { name: 'Biometric Signature Discrepancy (Siamese)', count: 38, pct: '26.8%' },
    { name: 'Unaccredited Issuing Body / Counterfeit', count: 22, pct: '15.5%' },
    { name: 'Official Seal Missing or Altered', count: 12, pct: '8.4%' },
    { name: 'Cross-Document Identity Conflict', count: 6, pct: '4.2%' },
  ];

  const modelMetrics = [
    { module: 'UNet Tampering Detector', arch: 'DualHead_Forensic_UNet', accuracy: '73.3%', precision: '73.3%', recall: '100.0%', f1: '84.6%' },
    { module: 'Siamese Signature Net', arch: 'SiameseContrastiveNet', accuracy: '77.5%', precision: '69.0%', recall: '100.0%', f1: '81.6%' },
    { module: 'Stamp & Seal Verifier', arch: 'HSV_Hough_Geometry', accuracy: '100.0%', precision: '100.0%', recall: '100.0%', f1: '100.0%' },
    { module: 'Document Classifier', arch: 'LightweightConvNet', accuracy: '98.0%', precision: '98.0%', recall: '98.0%', f1: '98.0%' },
    { module: 'Evidence Fusion Engine', arch: 'ProbabilisticWeightedFusion', accuracy: '100.0%', precision: '100.0%', recall: '100.0%', f1: '100.0%' },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-1.5 pb-4 border-b border-zinc-200/80">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-zinc-900" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Intelligence &amp; Forensic Analytics
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-zinc-950">
          Institutional Risk Analytics
        </h1>
        <p className="text-xs text-zinc-500 max-w-xl leading-relaxed">
          Aggregated fraud telemetry, anomaly modality distributions, and model performance metrics across 1,482 evaluated credentials.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <KpiCard
          label="Fraud Interception Rate"
          value="9.6%"
          delta="↑ 0.8% detected"
          deltaType="negative"
          subtext="Across 1,482 credentials"
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <KpiCard
          label="Avg Reviewer Triage Time"
          value="42 sec"
          delta="↓ 18s faster SLA"
          deltaType="positive"
          subtext="Target: < 90 seconds"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KpiCard
          label="Signature Similarity Mean"
          value="94.6%"
          delta="Benchmark"
          deltaType="positive"
          subtext="Cosine similarity mean"
          icon={<Activity className="h-4 w-4" />}
        />
        <KpiCard
          label="Fusion Model Precision"
          value="1.00"
          delta="Zero false positives"
          deltaType="positive"
          subtext="Calibrated evidence fusion"
          icon={<ShieldCheck className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Modality Breakdown */}
        <div className="depth-card-static rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <span className="text-xs font-semibold text-zinc-900">Fraud Modality Distribution</span>
            <Badge variant="neutral" size="sm">N = 142 CASES</Badge>
          </div>

          <div className="space-y-4 pt-1">
            {modalities.map((m, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-zinc-700">{m.name}</span>
                  <span className="font-mono font-bold text-zinc-950">{m.pct} ({m.count})</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-100 p-0.5 shadow-inner border border-zinc-200/60 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-zinc-800 to-zinc-950 rounded-full shadow-sm" style={{ width: m.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Model Registry Benchmark Metrics */}
        <div className="depth-card-static rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <span className="text-xs font-semibold text-zinc-900">Model Registry Metrics</span>
            <Badge variant="genuine" size="sm" dot>Live DirectML</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200/80 text-[11px] text-zinc-400 font-medium">
                  <th className="py-2.5 px-2">Module</th>
                  <th className="py-2.5 px-2 text-center">Accuracy</th>
                  <th className="py-2.5 px-2 text-center">Precision</th>
                  <th className="py-2.5 px-2 text-center">Recall</th>
                  <th className="py-2.5 px-2 text-right">F1 Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-mono text-[11px]">
                {modelMetrics.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-2 font-sans font-medium text-zinc-950 truncate max-w-[140px]">
                      {row.module}
                    </td>
                    <td className="py-3 px-2 text-center text-zinc-600">{row.accuracy}</td>
                    <td className="py-3 px-2 text-center text-zinc-600">{row.precision}</td>
                    <td className="py-3 px-2 text-center text-zinc-600">{row.recall}</td>
                    <td className="py-3 px-2 text-right font-bold text-zinc-950">{row.f1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
