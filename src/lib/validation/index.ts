import { z } from 'zod';

export const PollutantReadingSchema = z.object({
  pollutant_code: z.string(),
  displayName: z.string(),
  value: z.number(),
  unit: z.string(), // Must preserve original unit, never treat AQI as concentration!
  value_kind: z.enum(['concentration', 'subindex']),
  averaging_period: z.string().optional(),
  source_timestamp: z.string().optional(),
});

export const LocationMetadataSchema = z.object({
  label: z.string(),
  city: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  scope: z.enum(['station', 'grid', 'area', 'unknown']),
  distance_km: z.number().optional(),
  station_id: z.string().optional(),
  station_name: z.string().optional(),
});

export const ProviderMetadataSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  source_url: z.string().url(),
  attribution_text: z.string(),
  license_status: z.string(),
  cache_ttl_seconds: z.number(),
  is_fixture: z.boolean().optional(),
});

export const AirQualitySnapshotSchema = z.object({
  id: z.string(),
  provider: ProviderMetadataSchema,
  location: LocationMetadataSchema,
  fetched_at: z.string(),
  observed_at: z.string().nullable(),
  value_type: z.enum(['observed', 'estimate', 'forecast', 'aggregate', 'unknown']),
  aqi_value: z.number().nullable(),
  aqi_scale: z.enum(['US_AQI', 'EU_EAQI', 'UK_DAQI', 'UNKNOWN']),
  category: z.object({
    label: z.string(),
    level: z.enum(['good', 'moderate', 'sensitive', 'unhealthy', 'very_unhealthy', 'hazardous', 'unknown']),
    colorBadge: z.string(),
    description: z.string(),
  }),
  dominant_pollutant: z.string().nullable(),
  pollutants: z.array(PollutantReadingSchema),
  freshness: z.enum(['fresh', 'delayed', 'stale', 'partial', 'unavailable']),
  freshness_reason: z.string().optional(),
});

export const ActionRecommendationSchema = z.object({
  id: z.string(),
  title: z.string().max(120),
  reason: z.string().max(300),
  when: z.string().nullable(),
  type: z.enum(['outdoor', 'indoor', 'commute', 'source_reduction']),
  priority: z.enum(['high', 'medium', 'low']),
  evidence_ids: z.array(z.string()),
  caveats: z.string().optional(),
});

export const GeminiAdvisorOutputSchema = z.object({
  summary: z.string().max(500),
  actions: z.array(ActionRecommendationSchema).min(1).max(5),
  data_limitations: z.array(z.string()).min(1),
  medical_caveat: z.string(),
});

export const UserPreferencesSchema = z.object({
  commute_mode: z.enum(['walk', 'bike', 'transit', 'car', 'remote']),
  outdoor_activity_window: z.enum(['morning', 'midday', 'evening', 'flexible']),
  indoor_budget_band: z.enum(['no_budget', 'low_cost', 'hepa_purifier']),
  sensitive_guidance_opt_in: z.boolean(),
  unit_system: z.enum(['metric', 'imperial']),
  aqi_scale_preference: z.enum(['US_AQI', 'EU_EAQI', 'UK_DAQI', 'UNKNOWN', 'AUTO']),
});

export const TransportImpactInputSchema = z.object({
  distance_value: z.number().positive(),
  distance_unit: z.enum(['km', 'mi']),
  baseline_mode: z.enum(['car_gasoline', 'car_hybrid', 'car_ev']),
  alternative_mode: z.enum(['walk', 'bike', 'transit_bus', 'transit_rail']),
});
