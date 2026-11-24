import React, { useState } from 'react';
import { UserPreferences, CommuteMode, OutdoorActivityWindow, UnitSystem, AQIScale } from '@/types';
import { AirQualityService } from '@/features/air-quality/service';
import { GeminiAdvisorService } from '@/lib/gemini/advisor-service';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Trash2, 
  Key, 
  Layers, 
  Sliders, 
  Download 
} from 'lucide-react';

interface SettingsPageProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  onResetAllData: () => void;
  onProviderChange: (providerCode: string) => void;
  activeProviderCode: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  preferences,
  onUpdatePreferences,
  onResetAllData,
  onProviderChange,
  activeProviderCode,
}) => {
  const aqService = AirQualityService.getInstance();
  const geminiService = GeminiAdvisorService.getInstance();

  const [geminiKeyInput, setGeminiKeyInput] = useState(geminiService.getApiKey());
  const [keySaved, setKeySaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const providers = aqService.getAvailableProviders();

  const handleSaveGeminiKey = (e: React.FormEvent) => {
    e.preventDefault();
    geminiService.setApiKey(geminiKeyInput);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

  const handleExportData = () => {
    const exportPayload = {
      app: 'BreatheWise AI',
      version: '1.0.0',
      exported_at: new Date().toISOString(),
      preferences,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breathewise-data-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCommuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as CommuteMode;
    if (['walk', 'bike', 'transit', 'car', 'remote'].includes(val)) {
      onUpdatePreferences({ ...preferences, commute_mode: val });
    }
  };

  const handleActivityWindowChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as OutdoorActivityWindow;
    if (['morning', 'midday', 'evening', 'flexible'].includes(val)) {
      onUpdatePreferences({ ...preferences, outdoor_activity_window: val });
    }
  };

  const handleUnitSystemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as UnitSystem;
    if (val === 'metric' || val === 'imperial') {
      onUpdatePreferences({ ...preferences, unit_system: val });
    }
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as AQIScale;
    if (['US_AQI', 'EU_EAQI', 'UK_DAQI', 'UNKNOWN'].includes(val)) {
      onUpdatePreferences({ ...preferences, aqi_scale_preference: val });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-teal-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">Settings & Transparency Controls</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Manage your routine preferences, data privacy, provider connections, and AI model parameters.
        </p>
      </div>

      {/* Routine & Lifestyle Preferences */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <Sliders className="w-4 h-4 text-teal-400" />
          Routine & Lifestyle Customization
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Primary Commute Mode</label>
            <select
              value={preferences.commute_mode}
              onChange={handleCommuteChange}
              className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white focus:border-teal-400"
            >
              <option value="walk">Walking</option>
              <option value="bike">Bicycle / Cycling</option>
              <option value="transit">Public Transit (Bus / Rail)</option>
              <option value="car">Car (Vehicle Commute)</option>
              <option value="remote">Remote / Home Office</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Typical Outdoor Activity Window</label>
            <select
              value={preferences.outdoor_activity_window}
              onChange={handleActivityWindowChange}
              className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white focus:border-teal-400"
            >
              <option value="morning">Morning (6 AM - 10 AM)</option>
              <option value="midday">Midday (11 AM - 3 PM)</option>
              <option value="evening">Evening (4 PM - 8 PM)</option>
              <option value="flexible">Flexible / Any Time</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Unit System</label>
            <select
              value={preferences.unit_system}
              onChange={handleUnitSystemChange}
              className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white focus:border-teal-400"
            >
              <option value="metric">Metric (Kilometers, µg/m³)</option>
              <option value="imperial">Imperial (Miles, µg/m³)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">AQI Scale Preference</label>
            <select
              value={preferences.aqi_scale_preference}
              onChange={handleScaleChange}
              className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white focus:border-teal-400"
            >
              <option value="US_AQI">US EPA AQI (0–500)</option>
              <option value="EU_EAQI">European Air Quality Index (EAQI)</option>
            </select>
          </div>
        </div>

        {/* Sensitive-Group Guidance */}
        <div className="pt-3 border-t border-slate-800 flex items-start gap-3">
          <input
            type="checkbox"
            id="sensitive_opt_in"
            checked={preferences.sensitive_guidance_opt_in}
            onChange={(e) => onUpdatePreferences({ ...preferences, sensitive_guidance_opt_in: e.target.checked })}
            className="mt-1 w-4 h-4 rounded bg-navy-900 border-slate-700 text-teal-500 focus:ring-teal-400"
          />
          <label htmlFor="sensitive_opt_in" className="text-xs text-slate-300 cursor-pointer">
            <span className="font-semibold block text-white">Show Sensitive-Group Guidance</span>
            <span>
              Provides conservative health cautions tailored for individuals who are sensitive to particle pollution (e.g. respiratory sensitivity, elderly, children). <em>No medical diagnoses or clinical records are collected.</em>
            </span>
          </label>
        </div>
      </div>

      {/* Provider & Model Transparency */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-400" />
          Active Provider & Provenance Transparency
        </h2>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">Selected Air Quality Backend</label>
          <div className="grid gap-2">
            {providers.map((p) => (
              <label
                key={p.code}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                  activeProviderCode === p.code
                    ? 'bg-teal-500/10 border-teal-500/50 text-white'
                    : 'bg-navy-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="provider"
                    value={p.code}
                    checked={activeProviderCode === p.code}
                    onChange={() => onProviderChange(p.code)}
                    className="w-4 h-4 text-teal-500"
                  />
                  <div>
                    <span className="font-semibold block text-slate-200">{p.name}</span>
                    <span className="text-[10px] text-slate-400">{p.attribution}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-teal-300 border border-slate-700">
                    {p.valueType}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Gemini Developer API Key */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wide">
              Gemini Developer API Key (Optional)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            When omitted, BreatheWise operates automatically in <strong>Verified Deterministic Mode</strong> using rule-based EPA guidance. When provided, the assistant uses Gemini 1.5 Flash bounded by closed context.
          </p>

          <form onSubmit={handleSaveGeminiKey} className="flex gap-2">
            <input
              type="password"
              value={geminiKeyInput}
              onChange={(e) => setGeminiKeyInput(e.target.value)}
              placeholder="Enter Gemini API Key..."
              className="flex-1 px-3 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:border-teal-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-navy-950 text-xs font-bold rounded-xl transition-colors"
            >
              {keySaved ? 'Saved!' : 'Save Key'}
            </button>
          </form>
        </div>
      </div>

      {/* Privacy & Account Controls */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          Privacy & Data Erasure (Cascade Behavior)
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          BreatheWise is designed with <strong>Privacy by Default</strong>: coordinates are coarsened to ~1.1km, no clinical profiles are stored, and all data can be exported or permanently purged from your device.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-navy-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export My Data (JSON)</span>
          </button>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60 text-rose-300 hover:text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Saved Preferences & History</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onResetAllData();
                  setConfirmDelete(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Confirm Complete Deletion
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
