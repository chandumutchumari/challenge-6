import React, { useState } from 'react';
import { Table, TrendingUp } from 'lucide-react';

interface HourlyTrendProps {
  trendData?: Array<{
    time: string;
    aqi: number;
    is_forecast?: boolean;
    is_gap?: boolean;
  }>;
  aqiScale: string;
}

export const HourlyTrend: React.FC<HourlyTrendProps> = ({ trendData, aqiScale }) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  if (!trendData || trendData.length === 0) {
    return null;
  }

  const maxAQI = Math.max(...trendData.map((d) => d.aqi), 120);
  const minAQI = Math.min(...trendData.map((d) => d.aqi), 0);
  const chartHeight = 100;
  const chartWidth = 500;
  const padding = 20;

  // Generate SVG path points
  const points = trendData.map((d, index) => {
    const x = padding + (index / (trendData.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - ((d.aqi - minAQI) / (maxAQI - minAQI || 1)) * (chartHeight - padding * 2);
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
            Hourly Multi-Hour Trend & Forecast Horizon
          </h3>
        </div>

        {/* View Switcher: Accessibility Table Alternative */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('chart')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              viewMode === 'chart' ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-white'
            }`}
            aria-label="View trend chart"
          >
            Chart
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-colors ${
              viewMode === 'table' ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-white'
            }`}
            aria-label="View accessible data table"
          >
            <Table className="w-3 h-3" />
            Table
          </button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <div className="relative overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-32 overflow-visible">
            {/* Horizontal Grid lines */}
            <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#334155" strokeDasharray="3 3" />
            <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="#334155" strokeDasharray="3 3" />
            <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#334155" />

            {/* Sparkline Path */}
            <path d={pathD} fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Individual Data Points */}
            {points.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  className={p.is_forecast ? 'fill-amber-400 stroke-navy-950 stroke-2' : 'fill-teal-400 stroke-navy-950 stroke-2'}
                />
              </g>
            ))}
          </svg>

          {/* Time Labels */}
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 px-2">
            <span>Past ({new Date(trendData[0].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
            <span className="text-teal-400 font-semibold">Now</span>
            <span className="text-amber-400 font-semibold">Forecast Horizon ({new Date(trendData[trendData.length - 1].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
          </div>

          <p className="mt-2 text-[10px] text-slate-500 text-right">
            Legend: <span className="text-teal-400">● Observed / Current</span> • <span className="text-amber-400">● Forecast Model Output</span> (Forecast is indicative, not a safety guarantee).
          </p>
        </div>
      ) : (
        /* Accessible Table Alternative */
        <div className="overflow-x-auto max-h-48">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase bg-slate-900/80 text-slate-400 sticky top-0">
              <tr>
                <th className="py-2 px-3">Time</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">{aqiScale} Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {trendData.map((d, index) => (
                <tr key={index} className="hover:bg-slate-800/40">
                  <td className="py-1.5 px-3">{new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="py-1.5 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${d.is_forecast ? 'bg-amber-500/20 text-amber-300' : 'bg-teal-500/20 text-teal-300'}`}>
                      {d.is_forecast ? 'Forecast' : 'Observed'}
                    </span>
                  </td>
                  <td className="py-1.5 px-3 font-bold">{d.aqi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
