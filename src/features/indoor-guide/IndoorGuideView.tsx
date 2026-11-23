import React, { useState } from 'react';
import { 
  Home, 
  Wind, 
  ShieldCheck, 
  Sliders, 
  Flame, 
  Fan, 
  Sparkles, 
  Wrench, 
  DollarSign 
} from 'lucide-react';

interface IndoorGuideViewProps {
  outdoorAQI: number | null;
  outdoorScale: string;
}

export const IndoorGuideView: React.FC<IndoorGuideViewProps> = ({ outdoorAQI, outdoorScale }) => {
  const [roomAreaSqFt, setRoomAreaSqFt] = useState<number>(250);
  const [budgetBand, setBudgetBand] = useState<'no_budget' | 'low_cost' | 'hepa'>('no_budget');
  const [userSensorReading, setUserSensorReading] = useState<string>('');
  const [userSensorModel, setUserSensorModel] = useState<string>('');

  // Sizing calculation based on AHAM 2/3 rule:
  const recommendedSmokeCADR = Math.round((roomAreaSqFt * 2) / 3);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header with Mandatory Boundary Note */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-teal-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">Indoor Air Quality Action Guide</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Evidence-based strategies for source reduction, ventilation timing, and particle filtration that work without expensive sensors.
        </p>

        {/* Mandatory Principle Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/30 text-teal-200 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Core Boundary Rule:</strong> An outdoor air quality index does <em>not</em> represent your indoor air quality. Indoor pollutant concentrations depend on indoor cooking, heating combustion, dust resuspension, air cleaner operation, and building envelope infiltration.
          </div>
        </div>
      </div>

      {/* Topic Cards Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Topic 1: Source Reduction */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <Flame className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">1. Source Reduction (First Defense)</h2>
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

        {/* Topic 2: Ventilation Timing */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-500/30">
              <Wind className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">2. Outdoor-Aware Ventilation</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Natural ventilation timing must be coordinated with outdoor pollution levels:
          </p>
          <div className="p-3 rounded-xl bg-navy-900 border border-slate-800 text-xs">
            <span className="text-slate-400 block mb-1">
              Current Outdoor Status ({outdoorScale}):{' '}
              <strong className="text-white">{outdoorAQI !== null ? outdoorAQI : 'Unavailable'}</strong>
            </span>
            {outdoorAQI !== null && outdoorAQI <= 50 ? (
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

        {/* Topic 3: Cooking & Kitchen Management */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/30">
              <Fan className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">3. Cooking & Range Hood Best Practices</h2>
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

        {/* Topic 4: Dust & Cleaning */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">4. Dust Suppression & Cleaning</h2>
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
      </div>

      {/* Sizing & Filtration Guide */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wide flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
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
              <DollarSign className="w-4 h-4" />
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
                <strong>Weatherstripping & Draft Stoppers:</strong> Place rolled damp towels or low-cost draft stoppers at exterior door thresholds to reduce particulate infiltration.
              </li>
              <li>
                <strong>HVAC Recirculation:</strong> If you have central HVAC, ensure the thermostat is set to "Fan ON" or "Recirculate" with the cleanest filter your system allows.
              </li>
            </ul>
          </div>
        )}

        {budgetBand === 'low_cost' && (
          <div className="p-4 rounded-xl bg-navy-900 border border-teal-500/30 space-y-3">
            <h3 className="font-bold text-sm text-teal-300 flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              DIY Corsi-Rosenthal Box Air Cleaner
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              EPA and university research demonstrates that a standard 20-inch box fan paired with four MERV 13 furnace filters delivers comparable Clean Air Delivery Rates (CADR) to commercial HEPA cleaners at a fraction of the cost:
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
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Target Room Dimensions (Square Feet):
                </label>
                <input
                  type="number"
                  min="50"
                  max="2000"
                  value={roomAreaSqFt}
                  onChange={(e) => setRoomAreaSqFt(Number(e.target.value))}
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
              <strong>Selection Principles (No Brand Endorsements):</strong> Ensure the air cleaner uses true mechanical HEPA media. Avoid cleaners with ozone generators or unvalidated ionization features, which can produce harmful secondary respiratory irritants.
            </p>
          </div>
        )}
      </div>

      {/* Voluntary User Sensor Input Section */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">
            Voluntary Indoor Sensor Input
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          If you own a consumer indoor monitor, you may input its current reading here for reference.
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Device Make / Model (Optional):</label>
            <input
              type="text"
              value={userSensorModel}
              onChange={(e) => setUserSensorModel(e.target.value)}
              placeholder="e.g. PurpleAir, AirGradient, Temtop"
              className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Current Indoor PM2.5 (µg/m³):</label>
            <input
              type="number"
              value={userSensorReading}
              onChange={(e) => setUserSensorReading(e.target.value)}
              placeholder="e.g. 12"
              className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>

        {userSensorReading && (
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-700 text-xs flex items-center justify-between">
            <span className="text-slate-300">
              Indoor Reading: <strong className="text-white">{userSensorReading} µg/m³</strong> {userSensorModel && `(${userSensorModel})`}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              [User-Provided — Unverified]
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
