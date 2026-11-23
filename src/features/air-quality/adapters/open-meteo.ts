import { AirQualityProviderAdapter } from './base';
import { AirQualitySnapshot, PollutantReading } from '@/types';
import { calculateFreshness, getCategoryForAQI } from '@/lib/constants';

/**
 * Open-Meteo Air Quality API Adapter
 * Documentation: https://open-meteo.com/en/docs/air-quality-api
 * Blueprint Reference: Section 2 & 10
 *
 * Important Semantic Rules:
 * - Data source: CAMS (Copernicus Atmosphere Monitoring Service) Atmospheric Transport Model
 * - Value Type: "estimate" (model grid, not local regulatory monitor)
 * - Scope: "grid" (~11km Europe / ~45km Global)
 * - AQI is stored separately from raw concentrations.
 */
export class OpenMeteoAdapter implements AirQualityProviderAdapter {
  id = 'open-meteo-cams';
  code = 'open-meteo';
  name = 'Open-Meteo / Copernicus CAMS';
  sourceUrl = 'https://open-meteo.com/en/docs/air-quality-api';
  attribution = 'Open-Meteo & Copernicus Atmosphere Monitoring Service (CAMS) Model Data';
  licenseText = 'Attribution required under CC BY 4.0; non-commercial open data.';
  valueType = 'estimate' as const;
  cacheTtlSeconds = 1800; // 30 minutes

  isConfigured(): boolean {
    return true; // Open-Meteo operates without an API key requirement
  }

  async fetchCurrent(lat: number, lon: number, locationLabel?: string): Promise<AirQualitySnapshot> {
    const url = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
    url.searchParams.set('latitude', lat.toFixed(4));
    url.searchParams.set('longitude', lon.toFixed(4));
    url.searchParams.set('current', 'us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone');
    url.searchParams.set('hourly', 'us_aqi,european_aqi,pm2_5');
    url.searchParams.set('forecast_days', '2');
    url.searchParams.set('timezone', 'auto');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(url.toString(), { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Open-Meteo API returned HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      const current = json.current;
      if (!current) {
        throw new Error('Open-Meteo response missing "current" payload.');
      }

      const fetchedAt = new Date().toISOString();
      const observedAt = current.time ? new Date(current.time).toISOString() : null;
      const { freshness, reason: freshnessReason } = calculateFreshness(observedAt, fetchedAt);

      const aqiValue = typeof current.us_aqi === 'number' ? Math.round(current.us_aqi) : null;
      const category = getCategoryForAQI(aqiValue, 'US_AQI');

      // Preserve raw pollutant concentrations and units explicitly
      const pollutants: PollutantReading[] = [];
      if (typeof current.pm2_5 === 'number') {
        pollutants.push({
          pollutant_code: 'pm25',
          displayName: 'PM2.5 (Fine Particles)',
          value: Number(current.pm2_5.toFixed(1)),
          unit: 'µg/m³',
          value_kind: 'concentration',
          source_timestamp: observedAt || undefined,
        });
      }
      if (typeof current.pm10 === 'number') {
        pollutants.push({
          pollutant_code: 'pm10',
          displayName: 'PM10 (Coarse Particles)',
          value: Number(current.pm10.toFixed(1)),
          unit: 'µg/m³',
          value_kind: 'concentration',
          source_timestamp: observedAt || undefined,
        });
      }
      if (typeof current.ozone === 'number') {
        pollutants.push({
          pollutant_code: 'o3',
          displayName: 'Ozone (O₃)',
          value: Number(current.ozone.toFixed(1)),
          unit: 'µg/m³',
          value_kind: 'concentration',
          source_timestamp: observedAt || undefined,
        });
      }
      if (typeof current.nitrogen_dioxide === 'number') {
        pollutants.push({
          pollutant_code: 'no2',
          displayName: 'Nitrogen Dioxide (NO₂)',
          value: Number(current.nitrogen_dioxide.toFixed(1)),
          unit: 'µg/m³',
          value_kind: 'concentration',
          source_timestamp: observedAt || undefined,
        });
      }
      if (typeof current.sulphur_dioxide === 'number') {
        pollutants.push({
          pollutant_code: 'so2',
          displayName: 'Sulphur Dioxide (SO₂)',
          value: Number(current.sulphur_dioxide.toFixed(1)),
          unit: 'µg/m³',
          value_kind: 'concentration',
          source_timestamp: observedAt || undefined,
        });
      }
      if (typeof current.carbon_monoxide === 'number') {
        pollutants.push({
          pollutant_code: 'co',
          displayName: 'Carbon Monoxide (CO)',
          value: Number(current.carbon_monoxide.toFixed(1)),
          unit: 'µg/m³',
          value_kind: 'concentration',
          source_timestamp: observedAt || undefined,
        });
      }

      // Parse hourly trend
      const hourly = json.hourly;
      const hourly_trend: Array<{ time: string; aqi: number; is_forecast?: boolean }> = [];
      if (hourly && Array.isArray(hourly.time) && Array.isArray(hourly.us_aqi)) {
        const nowIndex = hourly.time.findIndex((t: string) => new Date(t).getTime() >= (observedAt ? new Date(observedAt).getTime() : Date.now()));
        const startIndex = Math.max(0, (nowIndex >= 0 ? nowIndex : 0) - 6);
        const endIndex = Math.min(hourly.time.length, startIndex + 18);

        for (let i = startIndex; i < endIndex; i++) {
          const t = hourly.time[i];
          const val = hourly.us_aqi[i];
          if (typeof val === 'number') {
            hourly_trend.push({
              time: t,
              aqi: Math.round(val),
              is_forecast: new Date(t).getTime() > Date.now(),
            });
          }
        }
      }

      return {
        id: `om-${lat.toFixed(2)}-${lon.toFixed(2)}-${Date.now()}`,
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
          label: locationLabel || `Coordinates (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
          latitude: lat,
          longitude: lon,
          scope: 'grid',
        },
        fetched_at: fetchedAt,
        observed_at: observedAt,
        value_type: this.valueType,
        aqi_value: aqiValue,
        aqi_scale: 'US_AQI',
        category,
        dominant_pollutant: 'pm25', // CAMS dominant particle index in standard surface model
        pollutants,
        freshness,
        freshness_reason: freshnessReason,
        hourly_trend,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      throw err;
    }
  }
}
