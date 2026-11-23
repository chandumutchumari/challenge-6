import { AirQualityProviderAdapter } from './base';
import { AirQualitySnapshot } from '@/types';
import { calculateFreshness, getCategoryForAQI } from '@/lib/constants';

/**
 * Fixture Provider Adapter
 * Strictly for test scenarios and contract verification.
 * Blueprint Rule:
 * "Test-only fixtures must be visibly marked as fixtures and can never be confused with live data."
 */
export class FixtureAdapter implements AirQualityProviderAdapter {
  id = 'fixture-test-provider';
  code = 'fixture';
  name = 'Test Contract Fixtures [FIXTURE ONLY]';
  sourceUrl = 'https://breathewise.internal/test-fixtures';
  attribution = 'TEST ONLY FIXTURE — Recorded contract data for validation';
  licenseText = 'Synthetic and test-only data. Not live air quality readings.';
  valueType = 'observed' as const;
  cacheTtlSeconds = 0;

  isConfigured(): boolean {
    return true;
  }

  async fetchCurrent(lat: number, lon: number, locationLabel?: string): Promise<AirQualitySnapshot> {
    // Select fixture scenario based on coordinate hash or label
    const now = new Date();
    const fetchedAt = now.toISOString();

    if (locationLabel?.includes('Stale')) {
      const observedAt = new Date(Date.now() - 5 * 3600 * 1000).toISOString();
      const { freshness, reason } = calculateFreshness(observedAt, fetchedAt);
      return {
        id: 'fixture-stale-001',
        provider: {
          id: this.id,
          code: this.code,
          name: this.name,
          source_url: this.sourceUrl,
          attribution_text: this.attribution,
          license_status: this.licenseText,
          cache_ttl_seconds: 0,
          is_fixture: true,
        },
        location: {
          label: locationLabel || 'Stale Monitor Test Station',
          latitude: lat,
          longitude: lon,
          scope: 'station',
          station_id: 'STN-STALE-99',
          station_name: 'Stale Sensor Station',
        },
        fetched_at: fetchedAt,
        observed_at: observedAt,
        value_type: 'observed',
        aqi_value: 142,
        aqi_scale: 'US_AQI',
        category: getCategoryForAQI(142, 'US_AQI'),
        dominant_pollutant: 'pm25',
        pollutants: [
          { pollutant_code: 'pm25', displayName: 'PM2.5', value: 52.4, unit: 'µg/m³', value_kind: 'concentration' },
        ],
        freshness,
        freshness_reason: reason,
      };
    }

    if (locationLabel?.includes('Unavailable')) {
      return {
        id: 'fixture-unavailable-001',
        provider: {
          id: this.id,
          code: this.code,
          name: this.name,
          source_url: this.sourceUrl,
          attribution_text: this.attribution,
          license_status: this.licenseText,
          cache_ttl_seconds: 0,
          is_fixture: true,
        },
        location: {
          label: locationLabel || 'Offline Sensor Test Station',
          latitude: lat,
          longitude: lon,
          scope: 'station',
        },
        fetched_at: fetchedAt,
        observed_at: null,
        value_type: 'unknown',
        aqi_value: null,
        aqi_scale: 'UNKNOWN',
        category: getCategoryForAQI(null, 'UNKNOWN'),
        dominant_pollutant: null,
        pollutants: [],
        freshness: 'unavailable',
        freshness_reason: 'Provider reports monitor offline or calibration in progress.',
      };
    }

    // Default Good / Moderate Fixture
    const observedAt = new Date(Date.now() - 25 * 60 * 1000).toISOString();
    const { freshness, reason } = calculateFreshness(observedAt, fetchedAt);

    return {
      id: 'fixture-standard-001',
      provider: {
        id: this.id,
        code: this.code,
        name: this.name,
        source_url: this.sourceUrl,
        attribution_text: this.attribution,
        license_status: this.licenseText,
        cache_ttl_seconds: 0,
        is_fixture: true,
      },
      location: {
        label: locationLabel || 'Test Reference Monitor Station',
        latitude: lat,
        longitude: lon,
        scope: 'station',
        station_id: 'STN-REF-01',
        station_name: 'Metro Environmental Monitor A',
      },
      fetched_at: fetchedAt,
      observed_at: observedAt,
      value_type: 'observed',
      aqi_value: 42,
      aqi_scale: 'US_AQI',
      category: getCategoryForAQI(42, 'US_AQI'),
      dominant_pollutant: 'pm25',
      pollutants: [
        { pollutant_code: 'pm25', displayName: 'PM2.5', value: 10.2, unit: 'µg/m³', value_kind: 'concentration' },
        { pollutant_code: 'pm10', displayName: 'PM10', value: 18.5, unit: 'µg/m³', value_kind: 'concentration' },
        { pollutant_code: 'o3', displayName: 'Ozone (O₃)', value: 38.0, unit: 'µg/m³', value_kind: 'concentration' },
        { pollutant_code: 'no2', displayName: 'Nitrogen Dioxide (NO₂)', value: 15.2, unit: 'µg/m³', value_kind: 'concentration' },
      ],
      freshness,
      freshness_reason: reason,
      hourly_trend: [
        { time: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), aqi: 38 },
        { time: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), aqi: 40 },
        { time: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), aqi: 41 },
        { time: new Date().toISOString(), aqi: 42 },
        { time: new Date(Date.now() + 1 * 3600 * 1000).toISOString(), aqi: 45, is_forecast: true },
        { time: new Date(Date.now() + 2 * 3600 * 1000).toISOString(), aqi: 48, is_forecast: true },
      ],
    };
  }
}
