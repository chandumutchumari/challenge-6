import React from 'react';
import { AirQualitySnapshot, RecommendationResponse } from '@/types';
import { PrimaryAQICard } from '@/features/air-quality/components/PrimaryAQICard';
import { PollutantGrid } from '@/features/air-quality/components/PollutantGrid';
import { HourlyTrend } from '@/features/air-quality/components/HourlyTrend';
import { ActionList } from '@/features/advisor/components/ActionList';
import { ShareCardView } from '@/features/community/ShareCardView';
import { ArrowRight, Leaf, ShieldCheck } from 'lucide-react';

interface DashboardPageProps {
  snapshot: AirQualitySnapshot | null;
  isLoading: boolean;
  onRefresh: () => void;
  recommendations: RecommendationResponse | null;
  onNavigateToImpact: () => void;
  onNavigateToIndoor: () => void;
  onOpenChat: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  snapshot,
  isLoading,
  onRefresh,
  recommendations,
  onNavigateToImpact,
  onNavigateToIndoor,
  onOpenChat,
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Primary AQI Card */}
      <PrimaryAQICard snapshot={snapshot} isLoading={isLoading} onRefresh={onRefresh} />

      {/* Pollutant Concentrations Grid (Original Units) */}
      {snapshot && snapshot.pollutants.length > 0 && (
        <PollutantGrid pollutants={snapshot.pollutants} />
      )}

      {/* Hourly Trend Chart & Accessible Alternative */}
      {snapshot && snapshot.hourly_trend && snapshot.hourly_trend.length > 0 && (
        <HourlyTrend trendData={snapshot.hourly_trend} aqiScale={snapshot.aqi_scale} />
      )}

      {/* Today's Practical Recommendations */}
      <ActionList
        recommendations={recommendations}
        isLoading={isLoading}
        onOpenChat={onOpenChat}
      />

      {/* Quick Navigation Teasers */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-sm text-white">Indoor Air Quality Action Guide</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Protect your living space with ventilation timing, range hood management, and low-cost DIY Corsi-Rosenthal box filters without buying expensive sensors.
          </p>
          <button
            onClick={onNavigateToIndoor}
            className="text-xs font-semibold text-teal-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Explore indoor guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-sm text-white">Transport Emissions Calculator</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Calculate your trip's greenhouse gas differential (g CO₂e) across walking, cycling, transit, and car travel with documented EPA and DEFRA factors.
          </p>
          <button
            onClick={onNavigateToImpact}
            className="text-xs font-semibold text-teal-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Calculate commute impact</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Share Card Module */}
      {snapshot && (
        <ShareCardView
          snapshot={snapshot}
          approximateLocationLabel={snapshot.location.label}
        />
      )}
    </div>
  );
};
