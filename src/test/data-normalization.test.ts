import { describe, it, expect } from 'vitest';
import { PollutantReading, AirQualitySnapshot } from '@/types';
import { PollutantReadingSchema, AirQualitySnapshotSchema } from '@/lib/validation';

describe('Data Semantics & Normalization Integrity', () => {
  it('preserves raw pollutant concentrations and distinct physical units', () => {
    const rawReading: PollutantReading = {
      pollutant_code: 'pm25',
      displayName: 'PM2.5 (Fine Particulate)',
      value: 35.4,
      unit: 'µg/m³',
      value_kind: 'concentration',
      source_timestamp: '2026-11-23T10:00:00Z',
    };

    const validated = PollutantReadingSchema.parse(rawReading);

    expect(validated.value).toBe(35.4);
    expect(validated.unit).toBe('µg/m³');
    expect(validated.value_kind).toBe('concentration');
    expect(validated.pollutant_code).toBe('pm25');
  });

  it('strictly isolates AQI index from physical pollutant concentration', () => {
    const snapshot: AirQualitySnapshot = {
      id: 'test-norm-001',
      provider: {
        id: 'open-meteo',
        code: 'open-meteo',
        name: 'Open-Meteo',
        source_url: 'https://open-meteo.com',
        attribution_text: 'Open-Meteo CC BY 4.0',
        license_status: 'CC BY 4.0',
        cache_ttl_seconds: 1800,
        is_fixture: false,
      },
      location: {
        label: 'Test Grid Station',
        latitude: 37.77,
        longitude: -122.41,
        scope: 'grid',
      },
      fetched_at: '2026-11-23T10:05:00Z',
      observed_at: '2026-11-23T10:00:00Z',
      value_type: 'estimate',
      aqi_value: 98, // Index number
      aqi_scale: 'US_AQI',
      category: {
        label: 'Moderate',
        level: 'moderate',
        colorBadge: 'bg-amber-500',
        description: 'Moderate air quality',
      },
      dominant_pollutant: 'pm25',
      pollutants: [
        {
          pollutant_code: 'pm25',
          displayName: 'PM2.5',
          value: 34.8, // Physical concentration
          unit: 'µg/m³',
          value_kind: 'concentration',
        },
      ],
      freshness: 'fresh',
    };

    const validated = AirQualitySnapshotSchema.parse(snapshot);

    // Assert AQI is an integer index, distinct from raw PM2.5 concentration
    expect(validated.aqi_value).toBe(98);
    expect(validated.pollutants[0].value).toBe(34.8);
    expect(validated.pollutants[0].unit).toBe('µg/m³');
    expect(validated.aqi_value).not.toBe(validated.pollutants[0].value);
  });
});
