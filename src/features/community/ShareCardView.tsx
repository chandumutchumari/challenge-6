import React, { useState } from 'react';
import { AirQualitySnapshot } from '@/types';
import { Share2, Check, ShieldCheck, Copy } from 'lucide-react';

interface ShareCardViewProps {
  snapshot: AirQualitySnapshot | null;
  approximateLocationLabel: string;
}

export const ShareCardView: React.FC<ShareCardViewProps> = ({ snapshot, approximateLocationLabel }) => {
  const [copied, setCopied] = useState(false);

  if (!snapshot || snapshot.aqi_value === null) {
    return null;
  }

  // Round coordinates to protect privacy (Blueprint Section 3.9: remove profile identifiers and round coordinates)
  const roundedLat = snapshot.location.latitude !== undefined ? snapshot.location.latitude.toFixed(1) : null;
  const roundedLon = snapshot.location.longitude !== undefined ? snapshot.location.longitude.toFixed(1) : null;

  const shareText = `BreatheWise Air Quality Report for ${approximateLocationLabel} (${roundedLat}°, ${roundedLon}°):
• Reported AQI: ${snapshot.aqi_value} (${snapshot.category.label})
• Scale: ${snapshot.aqi_scale}
• Observed: ${snapshot.observed_at ? new Date(snapshot.observed_at).toLocaleString() : 'N/A'}
• Source: ${snapshot.provider.attribution_text}
• Verified at: https://breathewise.ai`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-teal-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">
            Privacy-Preserving Community Share Card
          </h2>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
          Source Attributed
        </span>
      </div>

      {/* Share Card Preview */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 border border-teal-500/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
            <span className="font-bold text-sm text-white">{approximateLocationLabel} Area</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Approx. {roundedLat}°, {roundedLon}°
          </span>
        </div>

        <div className="flex items-baseline gap-3 my-2">
          <span className="text-4xl font-extrabold text-white tabular-nums">{snapshot.aqi_value}</span>
          <div>
            <span className="text-xs uppercase font-bold text-teal-400 block">{snapshot.category.label}</span>
            <span className="text-[10px] text-slate-400 font-mono">{snapshot.aqi_scale} Standard</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Observed: {snapshot.observed_at ? new Date(snapshot.observed_at).toLocaleTimeString() : 'Recent'}</span>
          <span>Source: {snapshot.provider.name}</span>
        </div>
      </div>

      {/* Copy Actions */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>No personal profile data or precise coordinates are included.</span>
        </div>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Link & Text' : 'Share Card'}</span>
        </button>
      </div>
    </div>
  );
};
