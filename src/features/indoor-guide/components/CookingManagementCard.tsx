import React from 'react';
import { Fan } from 'lucide-react';

/**
 * Cooking & Kitchen Management Guidance Card
 * Blueprint Reference: Section 3.7
 */
export const CookingManagementCard: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/30">
          <Fan className="w-4 h-4" aria-hidden="true" />
        </div>
        <h2 className="text-sm font-bold text-white uppercase tracking-wide">
          3. Cooking & Range Hood Best Practices
        </h2>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">
        High-temperature frying and unvented gas ranges generate ultrafine particles and NO₂:
      </p>
      <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
        <li>Turn on exhaust hoods <strong>before</strong> turning on stove burners to establish airflow draft.</li>
        <li>Cook on rear burners whenever possible; range hood capture efficiency is 20–40% higher on rear burners.</li>
        <li>Cover pots and pans to minimize oil splatter aerosolization.</li>
      </ul>
    </div>
  );
};
