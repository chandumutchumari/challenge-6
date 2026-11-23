import React from 'react';
import { PollutantReading } from '@/types';
import { Activity, Wind, CloudSun, Flame } from 'lucide-react';

interface PollutantGridProps {
  pollutants: PollutantReading[];
}

export const PollutantGrid: React.FC<PollutantGridProps> = ({ pollutants }) => {
  if (!pollutants || pollutants.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500 text-center">
        No individual pollutant breakdown available from this provider.
      </div>
    );
  }

  const getPollutantIcon = (code: string) => {
    switch (code) {
      case 'pm25':
      case 'pm10':
        return <Activity className="w-4 h-4 text-teal-400" />;
      case 'o3':
        return <CloudSun className="w-4 h-4 text-amber-400" />;
      case 'no2':
      case 'so2':
      case 'co':
        return <Flame className="w-4 h-4 text-rose-400" />;
      default:
        return <Wind className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase flex items-center gap-2">
          <span>Measured Pollutant Concentrations</span>
        </h3>
        <span className="text-[11px] text-slate-500 font-mono">
          Semantics: Original Units (Never treated as AQI)
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {pollutants.map((pollutant) => (
          <div
            key={pollutant.pollutant_code}
            className="glass-card rounded-xl p-3.5 border border-slate-800/80 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {pollutant.pollutant_code}
              </span>
              {getPollutantIcon(pollutant.pollutant_code)}
            </div>

            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-white tabular-nums">
                {pollutant.value}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {pollutant.unit}
              </span>
            </div>

            <p className="mt-1 text-[10px] text-slate-400 truncate" title={pollutant.displayName}>
              {pollutant.displayName}
            </p>

            <div className="mt-2 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-500 font-mono">
              <span>{pollutant.value_kind}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
