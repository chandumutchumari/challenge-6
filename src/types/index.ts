export type ValueType = 'observed' | 'estimate' | 'forecast' | 'aggregate' | 'unknown';

export type FreshnessState = 'fresh' | 'delayed' | 'stale' | 'partial' | 'unavailable';

export type AQIScale = 'US_AQI' | 'EU_EAQI' | 'UK_DAQI' | 'UNKNOWN';

export type LocationScope = 'station' | 'grid' | 'area' | 'unknown';

export type PollutantCode = 'pm25' | 'pm10' | 'o3' | 'no2' | 'so2' | 'co' | string;

export interface PollutantReading {
  pollutant_code: PollutantCode;
  displayName: string;
  value: number;
  unit: string; // e.g. "µg/m³", "ppm", "ppb" - Never treat AQI as concentration!
  value_kind: 'concentration' | 'subindex';
  averaging_period?: string;
  source_timestamp?: string;
}

export interface LocationMetadata {
  label: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  scope: LocationScope;
  distance_km?: number;
  station_id?: string;
  station_name?: string;
}

export interface ProviderMetadata {
  id: string;
  code: string;
  name: string;
  source_url: string;
  attribution_text: string;
  license_status: string;
  cache_ttl_seconds: number;
  is_fixture?: boolean;
}

export interface AirQualitySnapshot {
  id: string;
  provider: ProviderMetadata;
  location: LocationMetadata;
  fetched_at: string; // ISO
  observed_at: string | null; // ISO
  value_type: ValueType;
  aqi_value: number | null;
  aqi_scale: AQIScale;
  category: {
    label: string;
    level: 'good' | 'moderate' | 'sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous' | 'unknown';
    colorBadge: string;
    description: string;
  };
  dominant_pollutant: string | null;
  pollutants: PollutantReading[];
  freshness: FreshnessState;
  freshness_reason?: string;
  hourly_trend?: Array<{
    time: string;
    aqi: number;
    is_forecast?: boolean;
    is_gap?: boolean;
  }>;
  raw_payload_ref?: string;
}

export type CommuteMode = 'walk' | 'bike' | 'transit' | 'car' | 'remote';
export type OutdoorActivityWindow = 'morning' | 'midday' | 'evening' | 'flexible';
export type IndoorBudgetBand = 'no_budget' | 'low_cost' | 'hepa_purifier';
export type UnitSystem = 'metric' | 'imperial';

export interface UserPreferences {
  user_id?: string;
  commute_mode: CommuteMode;
  outdoor_activity_window: OutdoorActivityWindow;
  indoor_budget_band: IndoorBudgetBand;
  sensitive_guidance_opt_in: boolean; // Broad preference, no diagnosis collected
  unit_system: UnitSystem;
  aqi_scale_preference: AQIScale | 'AUTO';
  saved_places?: Array<{
    id: string;
    label: string;
    latitude: number;
    longitude: number;
    precision_level: 'coarse' | 'city';
  }>;
}

export interface ActionRecommendation {
  id: string;
  title: string;
  reason: string;
  when: string | null;
  type: 'outdoor' | 'indoor' | 'commute' | 'source_reduction';
  priority: 'high' | 'medium' | 'low';
  evidence_ids: string[];
  caveats?: string;
}

export interface RecommendationResponse {
  summary: string;
  actions: ActionRecommendation[];
  data_limitations: string[];
  medical_caveat: string;
  generated_by: 'gemini' | 'deterministic_fallback';
  model_name?: string;
  latency_ms?: number;
}

export interface TransportImpactCalculation {
  distance_value: number;
  distance_unit: 'km' | 'mi';
  distance_km: number;
  baseline_mode: 'car_gasoline' | 'car_hybrid' | 'car_ev';
  alternative_mode: 'walk' | 'bike' | 'transit_bus' | 'transit_rail';
  baseline_factor: number; // g CO2e / pass-km
  alternative_factor: number; // g CO2e / pass-km
  estimated_baseline_emissions_g: number;
  estimated_alternative_emissions_g: number;
  estimated_savings_g: number;
  factor_source_name: string;
  factor_source_url: string;
  factor_region: string;
  factor_boundary: 'tailpipe' | 'well_to_wheel_lifecycle';
  is_illustrative_scenario: boolean;
  assumptions: string[];
  limitation_notice: string;
}
