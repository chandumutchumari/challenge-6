import React from 'react';
import { Wind } from 'lucide-react';

interface VentilationCardProps {
  outdoorAQI: number | null;
  outdoorScale: string;
}

/**
 * Outdoor-Aware Ventilation Timing Card
 * Blueprint Reference: Section 3.7 & 5
 */
export const VentilationCard: React.FC<VentilationCardProps> = ({ outdoorAQI, outdoorScale }) => {
  const isOutdoorFavorable = outdoorAQI !== null && outdoorAQI <= 50;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-500/30">
          <Wind className="w-4 h-4" aria-hidden="true" />
        </div>
        <h2 className="text-sm font-bold text-white uppercase tracking-wide">
          2. Outdoor-Aware Ventilation
        </h2>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">
        Natural ventilation timing must be coordinated with outdoor pollution levels:
      </p>
      <div className="p-3 rounded-xl bg-navy-900 border border-slate-800 text-xs">
        <span className="text-slate-400 block mb-1">
          Current Outdoor Status ({outdoorScale}):{' '}
          <strong className="text-white">{outdoorAQI !== null ? outdoorAQI : 'Unavailable'}</strong>
        </span>
        {isOutdoorFavorable ? (
          <span className="text-emerald-400 font-medium">
            ✓ Outdoor conditions are favorable for opening windows to flush accumulated indoor CO₂.
          </span>
        ) : (
          <span className="text-amber-400 font-medium">
            ⚠ Keep windows and outside fresh-air dampers closed to prevent outdoor smoke and particulate infiltration.
          </span>
        )}
      </div>
    </div>
  );
};
