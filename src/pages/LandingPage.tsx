import React from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Compass, 
  Lock 
} from 'lucide-react';

interface LandingPageProps {
  onCheckMyArea: () => void;
  onExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onCheckMyArea, onExplore }) => {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-16 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-6">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
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
            <MapPin className="w-4 h-4 text-navy-950 stroke-[2.5]" />
            <span>Check My Area</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            onClick={onExplore}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Compass className="w-4 h-4 text-teal-400" />
            <span>Explore How It Works</span>
          </button>
        </div>

        {/* Privacy Note near CTA */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5 text-teal-400" />
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

      {/* Three-step Section: Check → Understand → Choose */}
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

      {/* Data Transparency Promise */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Layers className="w-5 h-5" />
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

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400">Frequently Asked Questions</h2>
          <p className="mt-2 text-2xl font-bold text-white">Understanding air quality and guidance</p>
        </div>

        <div className="space-y-3">
          <div className="glass-panel p-4 rounded-xl border border-slate-800 text-xs space-y-1">
            <h3 className="font-bold text-white text-sm">Does an outdoor AQI tell me how clean my indoor air is?</h3>
            <p className="text-slate-400 leading-relaxed">
              No. Outdoor readings measure ambient air. Indoor air quality depends significantly on cooking without range hoods, incense, dust resuspension, and whether you run mechanical filtration. BreatheWise features a dedicated indoor guide for sensor-free improvements.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800 text-xs space-y-1">
            <h3 className="font-bold text-white text-sm">Where does the live air data come from?</h3>
            <p className="text-slate-400 leading-relaxed">
              We query real atmospheric backends like Open-Meteo Copernicus CAMS and US EPA AirNow. We explicitly label whether each number is an observational station monitor or a gridded chemical transport model estimate.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800 text-xs space-y-1">
            <h3 className="font-bold text-white text-sm">How is my privacy protected?</h3>
            <p className="text-slate-400 leading-relaxed">
              We never track background GPS or require personal accounts for core features. All coordinates are coarsened to approximately 1.1km before querying providers or AI endpoints.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-slate-300">BreatheWise AI</span> — Urban Air Quality Assistant. Built for PromptWars Challenge 6.
        </div>
        <div className="flex items-center gap-4">
          <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy: Approximate coordinates only; no medical health profiling; complete user data deletion supported in Settings.'); }} className="hover:text-slate-400">Privacy Policy</a>
          <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms: Informational public health guidance only. Not medical diagnosis or guaranteed safety.'); }} className="hover:text-slate-400">Terms of Service</a>
          <a href="#accessibility" onClick={(e) => { e.preventDefault(); alert('Accessibility: WCAG 2.2 AA compliant contrast, table alternatives for maps and charts, screen reader ARIA support.'); }} className="hover:text-slate-400">Accessibility</a>
          <span>Contact: support@breathewise.internal</span>
        </div>
      </footer>
    </div>
  );
};
