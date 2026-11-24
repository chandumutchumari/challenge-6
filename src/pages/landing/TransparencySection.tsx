import React from 'react';
import { Layers } from 'lucide-react';

export const TransparencySection: React.FC = () => {
  return (
    <section className="max-w-5xl mx-auto px-4">
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <Layers className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">The BreatheWise Transparency Promise</h2>
            <p className="text-xs text-slate-400">Strict safety and architectural boundaries built into our core codebase</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3.5 bg-navy-900 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-white block">1. No Invented Live Readings</strong>
            <p className="text-slate-400">
              If provider data is unavailable or expired, we display an honest "Data unavailable" state. We never fabricate plausible numbers.
            </p>
          </div>

          <div className="p-3.5 bg-navy-900 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-white block">2. Preserve Data Semantics</strong>
            <p className="text-slate-400">
              AQI is an index, not a concentration. We preserve raw units (µg/m³, ppm) and separate model forecasts from ground measurements.
            </p>
          </div>

          <div className="p-3.5 bg-navy-900 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-white block">3. No All-Clear Guarantees</strong>
            <p className="text-slate-400">
              We say "conditions may be more favorable", never "safe" or "guaranteed safe". A regional reading does not represent every street or room.
            </p>
          </div>

          <div className="p-3.5 bg-navy-900 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-white block">4. Advice is Not Medical Care</strong>
            <p className="text-slate-400">
              We provide public health guidance with source links and respectful caveats. We never diagnose, prescribe, or collect medical records.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
