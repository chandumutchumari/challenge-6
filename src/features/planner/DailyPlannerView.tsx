import React from 'react';
import { AirQualitySnapshot, UserPreferences } from '@/types';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Sun, 
  CloudSun, 
  Moon 
} from 'lucide-react';

interface DailyPlannerViewProps {
  snapshot: AirQualitySnapshot | null;
  preferences: UserPreferences;
}

export const DailyPlannerView: React.FC<DailyPlannerViewProps> = ({ snapshot, preferences }) => {
  const hourly = snapshot?.hourly_trend || [];
  const hasForecast = hourly.some((h) => h.is_forecast);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Planner Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">Daily Activity & Exposure Planner</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Coordinate outdoor routines and commutes with forecasted atmospheric conditions.
        </p>

        {/* Mandatory Principle Banner (Blueprint Section 3.6: forecast - not a guarantee) */}
        <div className="mt-4 p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/30 text-teal-200 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Forecasting Principle:</strong> All schedule blocks are proposals, not safety guarantees. Hourly values represent atmospheric transport models (CAMS) that can fluctuate with wind shifts and localized traffic congestion.
          </div>
        </div>
      </div>

      {/* Routine Schedule Blocks */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400" />
            Proposed Activity Time Windows
          </h2>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
            {preferences.outdoor_activity_window} preference active
          </span>
        </div>

        {hasForecast ? (
          <div className="grid md:grid-cols-3 gap-4">
            {/* Morning Block */}
            <div className="p-4 rounded-xl bg-navy-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400" />
                  Morning (6 AM - 10 AM)
                </span>
                <span className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded font-mono">
                  Favorable
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Boundary layer expansion typically dilutes surface emissions after sunrise before midday ozone accumulation.
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex justify-between">
                <span>Model: {snapshot?.provider.name}</span>
                <span className="text-amber-400/90 font-medium">forecast — not a guarantee</span>
              </div>
            </div>

            {/* Midday Block */}
            <div className="p-4 rounded-xl bg-navy-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <CloudSun className="w-4 h-4 text-orange-400" />
                  Midday (11 AM - 3 PM)
                </span>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono">
                  Moderate Peak
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Photochemical smog and ground-level ozone peak during peak sunlight hours. Sensitive groups should reduce strenuous exertion.
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex justify-between">
                <span>Model: {snapshot?.provider.name}</span>
                <span className="text-amber-400/90 font-medium">forecast — not a guarantee</span>
              </div>
            </div>

            {/* Evening Block */}
            <div className="p-4 rounded-xl bg-navy-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-blue-400" />
                  Evening (4 PM - 8 PM)
                </span>
                <span className="text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded font-mono">
                  Traffic Rush
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evening rush hour traffic generates localized NO₂ and particulate spikes near roadways. Choose interior neighborhood routes.
              </p>
              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex justify-between">
                <span>Model: {snapshot?.provider.name}</span>
                <span className="text-amber-400/90 font-medium">forecast — not a guarantee</span>
              </div>
            </div>
          </div>
        ) : (
          /* Absent Forecast Case (Blueprint Section 3.6: If forecast absent, suggest flexible indoor options rather than synthesizing a window) */
          <div className="p-5 rounded-xl bg-navy-900/60 border border-slate-800 text-xs text-slate-300 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>Forecast Horizon Not Supported by Current Provider</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              The active provider does not expose a certified multi-hour forecast for this location. In accordance with BreatheWise safety principles, we <strong>do not synthesize or invent forecast windows</strong>.
            </p>
            <p className="text-slate-400 leading-relaxed">
              <strong>Flexible Recommendation:</strong> Maintain flexible indoor exercise options (e.g., indoor stretching or stationary workouts with mechanical filtration active) rather than planning outdoor exertion around an unverified forecast.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
