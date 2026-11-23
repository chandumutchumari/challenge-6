import React, { useState } from 'react';
import { AirQualitySnapshot } from '@/types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  Info, 
  RotateCw, 
  Database, 
  Layers, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { formatAQIForScreenReader } from '@/lib/accessibility';

interface PrimaryAQICardProps {
  snapshot: AirQualitySnapshot | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const PrimaryAQICard: React.FC<PrimaryAQICardProps> = ({ snapshot, isLoading, onRefresh }) => {
  const [showExplanation, setShowExplanation] = useState(false);

  if (isLoading) {
    return (
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-slate-800 rounded w-1/2 mb-6"></div>
        <div className="h-4 bg-slate-800 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-800 rounded w-3/4"></div>
      </div>
    );
  }

  // Unavailable State
  if (!snapshot || snapshot.freshness === 'unavailable' || snapshot.aqi_value === null) {
    return (
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-rose-900/40 bg-rose-950/10 text-slate-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Data Currently Unavailable</h2>
              <p className="text-xs text-rose-300 font-medium">
                {snapshot?.freshness_reason || 'No verified observation received from active provider.'}
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
            aria-label="Retry fetching air quality"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
        <p className="mt-4 text-xs text-slate-400 leading-relaxed">
          In accordance with BreatheWise safety principles, we never substitute fabricated or assumed numbers when live provider data is missing. Please check your provider credentials or select another location.
        </p>
      </div>
    );
  }

  const isStale = snapshot.freshness === 'stale';
  const a11ySummary = formatAQIForScreenReader(
    snapshot.aqi_value,
    snapshot.aqi_scale,
    snapshot.category.label,
    snapshot.value_type
  );

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-700/60 shadow-xl relative overflow-hidden">
      {/* Screen Reader Announcement */}
      <span className="sr-only" aria-live="polite">
        {a11ySummary}
      </span>

      {/* Fixture Marker Warning (Blueprint Section 1: Test fixtures must carry conspicuous badge) */}
      {snapshot.provider.is_fixture && (
        <div className="mb-4 px-3 py-1.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>[TEST FIXTURE ONLY] — Synthetic contract verification record. Not live observation.</span>
        </div>
      )}

      {/* Stale Warning Banner (Blueprint Section 2 & 3.3) */}
      {isStale && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-orange-950/40 border border-orange-500/50 text-orange-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <span>
              <strong>Observation is Stale:</strong> Observed{' '}
              {snapshot.observed_at ? new Date(snapshot.observed_at).toLocaleTimeString() : 'over 3h ago'}. Scheduling
              guidance is suspended.
            </span>
          </div>
          <button
            onClick={onRefresh}
            className="text-xs font-bold text-orange-400 hover:underline flex items-center gap-1 ml-2"
          >
            <RotateCw className="w-3 h-3" /> Refresh
          </button>
        </div>
      )}

      {/* Top Metadata Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Data Type Badge */}
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
            <Layers className="w-3 h-3 text-teal-400" />
            {snapshot.value_type}
          </span>

          {/* Scope Badge */}
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800/80 text-slate-400 border border-slate-700/60">
            Scope: {snapshot.location.scope}
          </span>

          {/* Freshness Badge */}
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase flex items-center gap-1 ${
              snapshot.freshness === 'fresh'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : snapshot.freshness === 'delayed'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {snapshot.freshness === 'fresh' ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <AlertTriangle className="w-3 h-3" />
            )}
            {snapshot.freshness}
          </span>
        </div>

        {/* Source Attribution Link */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Source:</span>
          <a
            href={snapshot.provider.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 underline underline-offset-2 flex items-center gap-1 font-medium"
            title={snapshot.provider.attribution_text}
          >
            {snapshot.provider.name}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Primary AQI Display & Category */}
      <div className="mt-6 flex flex-col md:flex-row md:items-baseline justify-between gap-6">
        <div>
          <div className="flex items-baseline gap-3">
            <span
              className="text-6xl sm:text-7xl font-extrabold tracking-tight tabular-nums text-white"
              aria-label={`AQI value ${snapshot.aqi_value}`}
            >
              {snapshot.aqi_value}
            </span>
            <div className="text-slate-400">
              <span className="text-xs uppercase tracking-wider font-semibold block">{snapshot.aqi_scale}</span>
              <span className="text-[11px] text-slate-500">Air Quality Index</span>
            </div>
          </div>

          {/* Text Category + Non-Color-Alone Indicator */}
          <div className="mt-3 flex items-center gap-2.5">
            <span
              className={`px-3 py-1 rounded-lg text-sm font-bold tracking-wide border flex items-center gap-1.5 ${snapshot.category.colorBadge}`}
            >
              <ShieldCheck className="w-4 h-4" />
              {snapshot.category.label}
            </span>
            {snapshot.dominant_pollutant && (
              <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/60">
                Primary Driver: <strong className="text-slate-200 uppercase">{snapshot.dominant_pollutant}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Compact "What this means" Card */}
        <div className="md:max-w-xs bg-navy-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-teal-400" />
              What this means
            </span>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-[11px] text-teal-400 hover:underline"
            >
              {showExplanation ? 'Hide details' : 'Learn scale'}
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{snapshot.category.description}</p>
          {showExplanation && (
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p>
                The <strong>{snapshot.aqi_scale}</strong> standard translates raw particulate and gas concentrations into an
                action index. It communicates outdoor exposure risk and should never be conflated with indoor air.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Timestamps and Provenance Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span>
            <strong>Observed:</strong>{' '}
            {snapshot.observed_at ? new Date(snapshot.observed_at).toLocaleString() : 'N/A (model step)'}
          </span>
          <span>•</span>
          <span>
            <strong>Fetched:</strong> {new Date(snapshot.fetched_at).toLocaleTimeString()}
          </span>
        </div>
        <button
          onClick={onRefresh}
          className="hover:text-teal-400 flex items-center gap-1 transition-colors"
          title="Refresh live data"
        >
          <RotateCw className="w-3 h-3" />
          <span>Sync Now</span>
        </button>
      </div>
    </div>
  );
};
