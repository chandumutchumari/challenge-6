import React, { useState } from 'react';
import { Sliders } from 'lucide-react';

/**
 * Voluntary User Sensor Input Card
 * Blueprint Reference: Section 3.7 (Explicitly label as user-provided, not verified)
 */
export const VoluntarySensorCard: React.FC = () => {
  const [userSensorReading, setUserSensorReading] = useState<string>('');
  const [userSensorModel, setUserSensorModel] = useState<string>('');

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
      <div className="flex items-center gap-2">
        <Sliders className="w-4 h-4 text-slate-400" aria-hidden="true" />
        <h2 className="text-sm font-bold text-white uppercase tracking-wide">
          Voluntary Indoor Sensor Input
        </h2>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        If you own a consumer indoor monitor, you may input its current reading here for reference.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="sensor-model-input" className="text-xs text-slate-400 block mb-1">
            Device Make / Model (Optional):
          </label>
          <input
            id="sensor-model-input"
            type="text"
            value={userSensorModel}
            onChange={(e) => setUserSensorModel(e.target.value)}
            placeholder="e.g. PurpleAir, AirGradient, Temtop"
            className="w-full px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
          />
        </div>
        <div>
          <label htmlFor="sensor-reading-input" className="text-xs text-slate-400 block mb-1">
            Current Indoor PM2.5 (µg/m³):
          </label>
          <input
            id="sensor-reading-input"
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
  );
};
