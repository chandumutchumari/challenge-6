import React from 'react';
import { Home, ShieldCheck } from 'lucide-react';
import { SourceReductionCard } from './components/SourceReductionCard';
import { VentilationCard } from './components/VentilationCard';
import { CookingManagementCard } from './components/CookingManagementCard';
import { DustCleaningCard } from './components/DustCleaningCard';
import { FiltrationCalculator } from './components/FiltrationCalculator';
import { VoluntarySensorCard } from './components/VoluntarySensorCard';

interface IndoorGuideViewProps {
  outdoorAQI: number | null;
  outdoorScale: string;
}

/**
 * Independent Indoor Air Action Guide View
 * Blueprint Reference: Section 3.7
 * Strictly disclaims measuring indoor air with ambient outdoor readings.
 */
export const IndoorGuideView: React.FC<IndoorGuideViewProps> = ({ outdoorAQI, outdoorScale }) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header with Mandatory Boundary Note */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-teal-400" aria-hidden="true" />
          <h1 className="text-xl font-bold text-white tracking-tight">Indoor Air Quality Action Guide</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Evidence-based strategies for source reduction, ventilation timing, and particle filtration that work without expensive sensors.
        </p>

        {/* Mandatory Principle Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/30 text-teal-200 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong>Core Boundary Rule:</strong> An outdoor air quality index does <em>not</em> represent your indoor air quality. Indoor pollutant concentrations depend on indoor cooking, heating combustion, dust resuspension, air cleaner operation, and building envelope infiltration.
          </div>
        </div>
      </div>

      {/* Modular Topic Cards Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <SourceReductionCard />
        <VentilationCard outdoorAQI={outdoorAQI} outdoorScale={outdoorScale} />
        <CookingManagementCard />
        <DustCleaningCard />
      </div>

      {/* Sizing & Filtration Guide */}
      <FiltrationCalculator />

      {/* Voluntary User Sensor Input Section */}
      <VoluntarySensorCard />
    </div>
  );
};
