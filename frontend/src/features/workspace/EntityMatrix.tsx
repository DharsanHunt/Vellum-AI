import React from 'react';
import { FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { Dossier } from '../../types';
import { Badge } from '../../components/common/Badge';

interface EntityMatrixProps {
  dossier: Dossier;
}

export const EntityMatrix: React.FC<EntityMatrixProps> = ({ dossier }) => {
  return (
    <div className="depth-card-static rounded-3xl p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-zinc-600" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Extracted Entity Field Matrix
          </h3>
        </div>
        <span className="text-[11px] font-mono text-zinc-500 bg-zinc-100/90 px-2.5 py-0.5 rounded-full border border-zinc-200/60 shadow-inner">
          OCR Mean: {(dossier.signals.ocrConfidence * 100).toFixed(1)}%
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-200/80 text-[11px] text-zinc-400 font-medium">
              <th className="py-2.5 px-2">Field Key</th>
              <th className="py-2.5 px-3">Extracted Entity Value</th>
              <th className="py-2.5 px-2 text-center">Confidence</th>
              <th className="py-2.5 px-2 text-right">Validation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {dossier.entities.map((entity, idx) => (
              <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                <td className="py-3 px-2 font-medium text-zinc-600">
                  {entity.field}
                </td>
                <td className="py-3 px-3 font-semibold text-zinc-900">
                  {entity.value}
                </td>
                <td className="py-3 px-2 text-center font-mono text-zinc-500">
                  {(entity.confidence * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-2 text-right">
                  <Badge
                    variant={
                      entity.status === 'VERIFIED' ||
                      entity.status === 'ACCREDITED' ||
                      entity.status === 'MATCH'
                        ? 'genuine'
                        : entity.status === 'SUSPICIOUS' || entity.status === 'CONFLICT'
                        ? 'danger'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {entity.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
