import { AirQualityProviderAdapter } from './base';
import { AirQualitySnapshot, PollutantReading } from '@/types';
import { calculateFreshness, getCategoryForAQI } from '@/lib/constants';

/**
 * US EPA AirNow API Adapter
 * Documentation: https://docs.airnowapi.org/
 * Only active when AIRNOW_API_KEY is supplied.
 */
export class AirNowAdapter implements AirQualityProviderAdapter {
  id = 'airnow-gov';
  code = 'airnow';
  name = 'US EPA AirNow';
  sourceUrl = 'https://www.airnow.gov';
  attribution = 'US EPA AirNow Program (Preliminary Agency Data)';
  licenseText = 'Public data from US EPA. Preliminary observational reporting.';
  valueType = 'observed' as const;
  cacheTtlSeconds = 3600;

  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || (typeof process !== 'undefined' ? process.env?.AIRNOW_API_KEY || '' : '');
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  async fetchCurrent(lat: number, lon: number, locationLabel?: string): Promise<AirQualitySnapshot> {
    if (!this.isConfigured()) {
      throw new Error('US EPA AirNow is unconfigured: missing AIRNOW_API_KEY.');
    }

    const url = new URL('https://www.airnowapi.org/aq/observation/latLong/current/');
    url.searchParams.set('format', 'application/json');
    url.searchParams.set('latitude', lat.toFixed(4));
    url.searchParams.set('longitude', lon.toFixed(4));
    url.searchParams.set('distance', '25');
    url.searchParams.set('API_KEY', this.apiKey);

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`AirNow API error: HTTP ${res.status}`);
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('AirNow returned no monitoring observations for this coordinate.');
    }

    // AirNow returns multiple rows per parameter (e.g. PM2.5, O3)
    const primary = data[0];
    const observedAt = primary.DateObserved && primary.HourObserved !== undefined
      ? new Date(`${primary.DateObserved}T${String(primary.HourObserved).padStart(2, '0')}:00:00Z`).toISOString()
      : null;
    const fetchedAt = new Date().toISOString();
    const { freshness, reason } = calculateFreshness(observedAt, fetchedAt);

    const aqiValue = primary.AQI !== undefined ? Math.round(primary.AQI) : null;
    const pollutants: PollutantReading[] = data.map((item) => ({
      pollutant_code: (item.ParameterName || 'aqi').toLowerCase().replace('.', ''),
      displayName: item.ParameterName || 'Pollutant',
      value: item.AQI,
      unit: 'AQI sub-index', // AirNow reports sub-indices rather than raw concentrations in this endpoint!
      value_kind: 'subindex',
      source_timestamp: observedAt || undefined,
    }));

    return {
      id: `airnow-${lat.toFixed(2)}-${lon.toFixed(2)}-${Date.now()}`,
      provider: {
        id: this.id,
        code: this.code,
        name: this.name,
        source_url: this.sourceUrl,
        attribution_text: this.attribution,
        license_status: this.licenseText,
        cache_ttl_seconds: this.cacheTtlSeconds,
        is_fixture: false,
      },
      location: {
        label: locationLabel || primary.ReportingArea || `US EPA Monitor (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
        latitude: lat,
        longitude: lon,
        scope: 'station',
        station_name: primary.ReportingArea,
      },
      fetched_at: fetchedAt,
      observed_at: observedAt,
      value_type: 'observed',
      aqi_value: aqiValue,
      aqi_scale: 'US_AQI',
      category: getCategoryForAQI(aqiValue, 'US_AQI'),
      dominant_pollutant: primary.ParameterName?.toLowerCase().replace('.', '') || null,
      pollutants,
      freshness,
      freshness_reason: reason,
    };
  }
}
