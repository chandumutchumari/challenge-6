import React from 'react';
import { Flame } from 'lucide-react';

/**
 * Source Reduction Guidance Card (First line of defense)
 * Blueprint Reference: Section 3.7
 */
export const SourceReductionCard: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
          <Flame className="w-4 h-4" aria-hidden="true" />
        </div>
        <h2 className="text-sm font-bold text-white uppercase tracking-wide">
          1. Source Reduction (First Defense)
        </h2>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">
        Eliminating pollution at the source is the most cost-effective way to preserve clean indoor air:
      </p>
      <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
        <li>Avoid burning candles, incense, or decorative scented combustion indoors.</li>
        <li>Do not smoke or vape in enclosed living areas.</li>
        <li>Maintain space heaters and fuel-burning appliances with certified annual inspections.</li>
        <li>Avoid chemical aerosol sprays and fragranced cleaning products during stagnant periods.</li>
      </ul>
    </div>
  );
};
