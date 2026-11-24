import React from 'react';

export const FAQSection: React.FC = () => {
  return (
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
  );
};
