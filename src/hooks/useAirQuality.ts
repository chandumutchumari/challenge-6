import { useState, useCallback, useEffect } from 'react';
import { AirQualityService, LocationPreset } from '@/features/air-quality/service';
import { GeminiAdvisorService } from '@/lib/gemini/advisor-service';
import { AirQualitySnapshot, RecommendationResponse, UserPreferences } from '@/types';
import { announceToScreenReader } from '@/lib/accessibility';

interface UseAirQualityReturn {
  snapshot: AirQualitySnapshot | null;
  recommendations: RecommendationResponse | null;
  isLoading: boolean;
  loadAirQualityData: (loc: LocationPreset, forceRefresh?: boolean) => Promise<void>;
  activeProviderCode: string;
  setActiveProviderCode: (code: string) => void;
}

/**
 * Custom hook to manage Air Quality data fetching, screen reader announcements,
 * and Gemini/deterministic recommendation loading.
 */
export function useAirQuality(
  selectedLocation: LocationPreset,
  preferences: UserPreferences
): UseAirQualityReturn {
  const [snapshot, setSnapshot] = useState<AirQualitySnapshot | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const aqService = AirQualityService.getInstance();
  const advisor = GeminiAdvisorService.getInstance();
  const [activeProviderCode, setActiveProviderCodeState] = useState<string>(
    aqService.getActiveProviderCode()
  );

  const setActiveProviderCode = useCallback(
    (code: string) => {
      aqService.setActiveProvider(code);
      setActiveProviderCodeState(code);
    },
    [aqService]
  );

  const loadAirQualityData = useCallback(
    async (loc: LocationPreset, forceRefresh = false) => {
      setIsLoading(true);
      try {
        const freshSnapshot = await aqService.fetchAirQuality(
          loc.lat,
          loc.lon,
          loc.label,
          forceRefresh
        );
        setSnapshot(freshSnapshot);

        announceToScreenReader(
          `Air quality data updated for ${loc.label}. AQI: ${freshSnapshot.aqi_value ?? 'Unavailable'}, category: ${freshSnapshot.category.label}.`
        );

        const recs = await advisor.getRecommendations(freshSnapshot, preferences);
        setRecommendations(recs);
      } catch (err) {
        console.error('Failed to load air quality snapshot:', err);
        setSnapshot({
          id: `unavail-${Date.now()}`,
          provider: {
            id: 'unavail',
            code: 'unavail',
            name: activeProviderCode,
            source_url: 'https://breathewise.ai',
            attribution_text: 'Provider unavailable',
            license_status: 'N/A',
            cache_ttl_seconds: 0,
          },
          location: {
            label: loc.label,
            latitude: loc.lat,
            longitude: loc.lon,
            scope: 'unknown',
          },
          fetched_at: new Date().toISOString(),
          observed_at: null,
          value_type: 'unknown',
          aqi_value: null,
          aqi_scale: 'UNKNOWN',
          category: {
            level: 'unknown',
            label: 'Unavailable',
            description: 'Could not contact active air quality provider.',
            colorBadge: 'bg-rose-950/40 text-rose-300 border-rose-800',
          },
          dominant_pollutant: null,
          pollutants: [],
          freshness: 'unavailable',
          freshness_reason: 'Provider connection failed or location not supported.',
        });
        const recs = await advisor.getRecommendations(null, preferences);
        setRecommendations(recs);
      } finally {
        setIsLoading(false);
      }
    },
    [activeProviderCode, preferences, aqService, advisor]
  );

  useEffect(() => {
    loadAirQualityData(selectedLocation);
  }, [selectedLocation, activeProviderCode, loadAirQualityData]);

  return {
    snapshot,
    recommendations,
    isLoading,
    loadAirQualityData,
    activeProviderCode,
    setActiveProviderCode,
  };
}
