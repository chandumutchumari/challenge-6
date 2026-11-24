import React from 'react';
import { useTransportImpact } from '@/hooks';
import { 
  Leaf, 
  AlertTriangle, 
  ExternalLink, 
  Calculator 
} from 'lucide-react';

export const ImpactTrackerView: React.FC = () => {
  const {
    distance,
    setDistance,
    unit,
    setUnit,
    baselineMode,
    setBaselineMode,
    alternativeMode,
    setAlternativeMode,
    impactResult: result,
  } = useTransportImpact();

  const handleBaselineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'car_gasoline' || val === 'car_hybrid' || val === 'car_ev') {
      setBaselineMode(val);
    }
  };

  const handleAlternativeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'walk' || val === 'bike' || val === 'transit_bus' || val === 'transit_rail') {
      setAlternativeMode(val);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-teal-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Transparent Transport Emissions Calculator
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Deterministic greenhouse gas (g CO₂e) differential calculations grounded in documented EPA and DEFRA conversion factors.
        </p>

        {/* Critical Distinction Banner */}
        <div className="mt-4 p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Critical Boundary Distinction:</strong> {result.limitation_notice}
          </div>
        </div>
      </div>

      {/* Input Controls Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <Calculator className="w-4 h-4 text-teal-400" />
          Route & Mode Inputs
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Distance Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Commute Distance</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0.5"
                max="500"
                step="0.5"
                value={distance}
                onChange={(e) => setDistance(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-sm text-white font-mono focus:border-teal-400"
              />
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setUnit('km')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    unit === 'km' ? 'bg-slate-800 text-teal-300' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  km
                </button>
                <button
                  onClick={() => setUnit('mi')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    unit === 'mi' ? 'bg-slate-800 text-teal-300' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  mi
                </button>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Normalized: {result.distance_km} km
            </span>
          </div>

          {/* Baseline Mode */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Current Baseline Mode</label>
            <select
              value={baselineMode}
              onChange={handleBaselineChange}
              className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white focus:border-teal-400"
            >
              <option value="car_gasoline">Passenger Car (Gasoline, single occupant)</option>
              <option value="car_hybrid">Passenger Car (Hybrid)</option>
              <option value="car_ev">Passenger Car (Electric, grid average)</option>
            </select>
            <span className="text-[10px] text-slate-500 font-mono block">
              Factor: {result.baseline_factor} g CO₂e/pass-km
            </span>
          </div>

          {/* Alternative Mode */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Alternative Green Mode</label>
            <select
              value={alternativeMode}
              onChange={handleAlternativeChange}
              className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white focus:border-teal-400"
            >
              <option value="transit_bus">Urban Transit Bus (average occupancy)</option>
              <option value="transit_rail">Urban Rail / Subway (electric)</option>
              <option value="bike">Bicycle / Active Mobility</option>
              <option value="walk">Walking</option>
            </select>
            <span className="text-[10px] text-slate-500 font-mono block">
              Factor: {result.alternative_factor} g CO₂e/pass-km
            </span>
          </div>
        </div>
      </div>

      {/* Results Comparison Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">
            Estimated Trip Emissions Differential
          </h2>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
            Scenario Estimate
          </span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-navy-900 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Baseline Trip Emissions</span>
            <div className="text-2xl font-extrabold text-slate-200 font-mono">
              {result.estimated_baseline_emissions_g.toLocaleString()}{' '}
              <span className="text-xs text-slate-500 font-normal">g CO₂e</span>
            </div>
            <span className="text-[10px] text-slate-500">
              ({(result.estimated_baseline_emissions_g / 1000).toFixed(2)} kg CO₂e)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-navy-900 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Alternative Trip Emissions</span>
            <div className="text-2xl font-extrabold text-teal-300 font-mono">
              {result.estimated_alternative_emissions_g.toLocaleString()}{' '}
              <span className="text-xs text-slate-500 font-normal">g CO₂e</span>
            </div>
            <span className="text-[10px] text-slate-500">
              ({(result.estimated_alternative_emissions_g / 1000).toFixed(2)} kg CO₂e)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40">
            <span className="text-xs text-emerald-400 block mb-1 font-semibold">Estimated CO₂e Savings</span>
            <div className="text-2xl font-extrabold text-emerald-300 font-mono">
              {result.estimated_savings_g >= 0 ? `+${result.estimated_savings_g.toLocaleString()}` : result.estimated_savings_g.toLocaleString()}{' '}
              <span className="text-xs text-emerald-400/80 font-normal">g CO₂e</span>
            </div>
            <span className="text-[10px] text-emerald-400/70">
              {result.estimated_baseline_emissions_g > 0
                ? `${Math.round((result.estimated_savings_g / result.estimated_baseline_emissions_g) * 100)}% reduction`
                : '0%'}
            </span>
          </div>
        </div>

        {/* Assumptions & Factor Documentation */}
        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
          <span className="font-semibold text-slate-300 block">Documented Methodology & Assumptions:</span>
          <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
            {result.assumptions.map((ass, idx) => (
              <li key={idx}>{ass}</li>
            ))}
          </ul>
          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>
              <strong>Factor Sources:</strong> {result.factor_source_name} ({result.factor_region})
            </span>
            <a
              href={result.factor_source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:underline flex items-center gap-1"
            >
              Verify source
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
