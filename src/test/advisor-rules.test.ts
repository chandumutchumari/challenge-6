import { describe, it, expect } from 'vitest';
import { generateDeterministicAdvice } from '@/features/advisor/rule-engine';
import { AirQualitySnapshot, UserPreferences } from '@/types';

describe('Deterministic Rule Recommendation Engine', () => {
  const basePreferences: UserPreferences = {
    commute_mode: 'transit',
    outdoor_activity_window: 'morning',
    indoor_budget_band: 'no_budget',
    sensitive_guidance_opt_in: false,
    unit_system: 'metric',
    aqi_scale_preference: 'US_AQI',
  };

  const sampleFreshSnapshot: AirQualitySnapshot = {
    id: 'snap-001',
    provider: {
      id: 'om',
      code: 'open-meteo',
      name: 'Open-Meteo',
      source_url: 'https://open-meteo.com',
      attribution_text: 'Open-Meteo and Copernicus CAMS',
      license_status: 'CC BY 4.0',
      cache_ttl_seconds: 1800,
    },
    location: { label: 'Test City', latitude: 40.71, longitude: -74.0, scope: 'grid' },
    fetched_at: new Date().toISOString(),
    observed_at: new Date().toISOString(),
    value_type: 'estimate',
    aqi_value: 45,
    aqi_scale: 'US_AQI',
    category: {
      level: 'good',
      label: 'Good',
      colorBadge: 'bg-emerald-500/20',
      description: 'Air quality is satisfactory.',
    },
    dominant_pollutant: 'pm25',
    pollutants: [{ pollutant_code: 'pm25', displayName: 'PM2.5', value: 8.5, unit: 'µg/m³', value_kind: 'concentration' }],
    freshness: 'fresh',
  };

  it('generates evidence-bound recommendations for fresh good conditions', () => {
    const advice = generateDeterministicAdvice(sampleFreshSnapshot, basePreferences);
    expect(advice.actions.length).toBeGreaterThanOrEqual(2);
    expect(advice.generated_by).toBe('deterministic_fallback');
    expect(advice.actions.some((a) => a.evidence_ids.length > 0)).toBe(true);
    expect(advice.medical_caveat).toBeDefined();
  });

  it('suspends outdoor scheduling recommendations when data is stale', () => {
    const staleSnapshot: AirQualitySnapshot = {
      ...sampleFreshSnapshot,
      freshness: 'stale',
      freshness_reason: 'Observed 4 hours ago.',
    };

    const advice = generateDeterministicAdvice(staleSnapshot, basePreferences);
    expect(advice.summary).toContain('suspended');
    // None of the actions should propose scheduling outdoor routines
    const hasOutdoorRoutine = advice.actions.some((a) => a.type === 'outdoor');
    expect(hasOutdoorRoutine).toBe(false);
  });

  it('returns graceful guidance when snapshot is null or unavailable', () => {
    const advice = generateDeterministicAdvice(null, basePreferences);
    expect(advice.summary).toContain('unavailable');
    expect(advice.actions.some((a) => a.type === 'source_reduction')).toBe(true);
  });
});
