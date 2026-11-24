import React from 'react';
import { MapPin, ShieldCheck, ArrowRight, Compass, Lock } from 'lucide-react';

interface HeroSectionProps {
  onCheckMyArea: () => void;
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCheckMyArea, onExplore }) => {
  return (
    <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-16 text-center max-w-4xl mx-auto px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-6">
        <ShieldCheck className="w-4 h-4 text-teal-400" aria-hidden="true" />
        <span>Decision-Grade Air Quality Intelligence</span>
      </div>

      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
        Air-quality information <br className="hidden sm:inline" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-teal-200">
          you can act on.
        </span>
      </h1>

      <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Families and communities need to make daily decisions during smog events. BreatheWise AI delivers
        evidence-linked routine choices without fabricated readings, false safety promises, or clinical diagnoses.
      </p>

      {/* CTAs */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onCheckMyArea}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-navy-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <MapPin className="w-4 h-4 text-navy-950 stroke-[2.5]" aria-hidden="true" />
          <span>Check My Area</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
        </button>

        <button
          onClick={onExplore}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Compass className="w-4 h-4 text-teal-400" aria-hidden="true" />
          <span>Explore How It Works</span>
        </button>
      </div>

      {/* Privacy Note */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
        <Lock className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
        <span>Privacy note: We request approximate location only (~1.1km). Exact coordinates are never stored.</span>
      </div>

      {/* Illustrative Sample with Explicit Disclaimer */}
      <div className="mt-12 max-w-lg mx-auto p-5 rounded-2xl glass-card border border-slate-700/60 shadow-2xl relative text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
            Illustrative example — not live air-quality data
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Sample UI</span>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <span className="text-4xl font-extrabold text-white tabular-nums">42</span>
            <span className="text-xs text-slate-400 ml-2">US AQI (Good)</span>
          </div>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Low Exposure Risk
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-300">
          "Reported conditions support morning outdoor routines; keep kitchen range hoods active during cooking."
        </p>
      </div>
    </section>
  );
};
