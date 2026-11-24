import React from 'react';

export const WorkflowSection: React.FC = () => {
  return (
    <section className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400">Our Workflow</h2>
        <p className="mt-2 text-2xl font-bold text-white">Three steps from data to everyday choices</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-base border border-teal-500/20">
            1
          </div>
          <h3 className="text-base font-bold text-white">Check</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fetch verified readings from reputable atmospheric providers with full provenance: scale, timestamp, source, and measurement type.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-base border border-blue-500/20">
            2
          </div>
          <h3 className="text-base font-bold text-white">Understand</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Differentiate model grids from physical monitoring stations. See explicit freshness flags (Fresh, Delayed, Stale) and never assume missing data means clean air.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/20">
            3
          </div>
          <h3 className="text-base font-bold text-white">Choose</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Take actionable steps for outdoor timing, indoor source reduction, and commute emissions backed by EPA and WHO public health guidance.
          </p>
        </div>
      </div>
    </section>
  );
};
