import React, { useState } from 'react';
import { Sliders, DollarSign, Wrench } from 'lucide-react';

type BudgetBand = 'no_budget' | 'low_cost' | 'hepa';

/**
 * Filtration Sizing & CADR Calculator Card
 * Blueprint Reference: Section 3.7 (AHAM 2/3 rule, no brand endorsements, DIY path)
 */
export const FiltrationCalculator: React.FC = () => {
  const [roomAreaSqFt, setRoomAreaSqFt] = useState<number>(250);
  const [budgetBand, setBudgetBand] = useState<BudgetBand>('no_budget');

  const recommendedSmokeCADR = Math.round((roomAreaSqFt * 2) / 3);

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-400" aria-hidden="true" />
            Filtration Sizing & Budget Guide
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Select air cleaning capacity based on Association of Home Appliance Manufacturers (AHAM) CADR principles.
          </p>
        </div>

        {/* Budget Band Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setBudgetBand('no_budget')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              budgetBand === 'no_budget' ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            No Purifier Budget
          </button>
          <button
            onClick={() => setBudgetBand('low_cost')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              budgetBand === 'low_cost' ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            DIY / Low-Cost
          </button>
          <button
            onClick={() => setBudgetBand('hepa')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              budgetBand === 'hepa' ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Commercial HEPA
          </button>
        </div>
      </div>

      {budgetBand === 'no_budget' && (
        <div className="p-4 rounded-xl bg-navy-900 border border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-teal-300 flex items-center gap-2">
            <DollarSign className="w-4 h-4" aria-hidden="true" />
            Zero-Cost Protection Pathway
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            If an air purifier is not in your budget, clean indoor air can still be achieved through behavioral barriers:
          </p>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
            <li>
              <strong>Establish a Clean Sleeping Sanctuary:</strong> Choose the bedroom with the tightest windows. Keep doors closed and eliminate all smoking/candles inside.
            </li>
            <li>
              <strong>Weatherstripping & Draft Stoppers:</strong> Place rolled damp towels or low-cost draft stoppers at exterior door thresholds.
            </li>
            <li>
              <strong>HVAC Recirculation:</strong> Set central thermostat to "Fan ON" or "Recirculate" with the cleanest filter your system allows.
            </li>
          </ul>
        </div>
      )}

      {budgetBand === 'low_cost' && (
        <div className="p-4 rounded-xl bg-navy-900 border border-teal-500/30 space-y-3">
          <h3 className="font-bold text-sm text-teal-300 flex items-center gap-2">
            <Wrench className="w-4 h-4" aria-hidden="true" />
            DIY Corsi-Rosenthal Box Air Cleaner
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            A standard 20-inch box fan paired with four MERV 13 furnace filters delivers comparable Clean Air Delivery Rates (CADR) to commercial HEPA cleaners at a fraction of the cost:
          </p>
          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-200 block mb-1">Parts Needed:</span>
              <span className="text-slate-400">1x 20" Box Fan, 4x 20x20x2" MERV 13 filters, duct tape, cardboard shroud.</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-200 block mb-1">Effective CADR:</span>
              <span className="text-slate-400">~200–250 CFM for smoke and particulate matter with quiet fan operation.</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-200 block mb-1">Safety Notice:</span>
              <span className="text-slate-400">Use box fans manufactured after 2012 with fused safety plugs.</span>
            </div>
          </div>
        </div>
      )}

      {budgetBand === 'hepa' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-baseline justify-between gap-3 p-4 bg-navy-900 rounded-xl border border-slate-800">
            <div>
              <label htmlFor="room-area-input" className="text-xs font-semibold text-slate-300 block mb-1">
                Target Room Dimensions (Square Feet):
              </label>
              <input
                id="room-area-input"
                type="number"
                min="50"
                max="2000"
                value={roomAreaSqFt}
                onChange={(e) => setRoomAreaSqFt(Math.max(10, Number(e.target.value) || 0))}
                className="px-3 py-1.5 rounded-lg bg-navy-950 border border-slate-700 text-sm text-white font-mono focus:border-teal-400 w-36"
              />
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Recommended Smoke CADR:</span>
              <span className="text-2xl font-bold text-teal-300 font-mono">
                ≥ {recommendedSmokeCADR} <span className="text-xs text-slate-400">CFM</span>
              </span>
              <span className="text-[10px] text-slate-500 block">Based on AHAM 2/3 Rule (EPA IAQ Guidance)</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            <strong>Selection Principles (No Brand Endorsements):</strong> Ensure the air cleaner uses true mechanical HEPA media. Avoid cleaners with ozone generators or unvalidated ionization features.
          </p>
        </div>
      )}
    </div>
  );
};
