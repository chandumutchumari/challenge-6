import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Dust Suppression & Cleaning Guidance Card
 * Blueprint Reference: Section 3.7
 */
export const DustCleaningCard: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
        </div>
        <h2 className="text-sm font-bold text-white uppercase tracking-wide">
          4. Dust Suppression & Cleaning
        </h2>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">
        Dry dusting and unsealed vacuuming resuspend settled fine particles into the breathing zone:
      </p>
      <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
        <li>Use damp microfiber cloths to capture dust rather than feather dusters.</li>
        <li>Ensure vacuum cleaners feature true sealed HEPA exhaust filtration.</li>
        <li>Wash bedding regularly in hot water to reduce dust mite allergens.</li>
      </ul>
    </div>
  );
};
