-- BreatheWise AI Database Schema & RLS Security Migration
-- Blueprint Reference: Section 5 & 8
-- Strict Least-Privilege Grants & Row-Level Security

-- 1. Custom Types & Enums
CREATE TYPE commute_mode_enum AS ENUM ('walk', 'bike', 'transit', 'car', 'remote');
CREATE TYPE activity_window_enum AS ENUM ('morning', 'midday', 'evening', 'flexible');
CREATE TYPE budget_band_enum AS ENUM ('no_budget', 'low_cost', 'hepa_purifier');
CREATE TYPE unit_system_enum AS ENUM ('metric', 'imperial');
CREATE TYPE aqi_scale_enum AS ENUM ('US_AQI', 'EU_EAQI', 'UK_DAQI', 'UNKNOWN');
CREATE TYPE value_type_enum AS ENUM ('observed', 'estimate', 'forecast', 'aggregate', 'unknown');
CREATE TYPE freshness_enum AS ENUM ('fresh', 'delayed', 'stale', 'partial', 'unavailable');

-- 2. Profiles Table (Owner-Only RLS, No DOB/medical diagnosis)
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  locale TEXT NOT NULL DEFAULT 'en-US',
  unit_system unit_system_enum NOT NULL DEFAULT 'metric',
  aqi_scale_preference aqi_scale_enum NOT NULL DEFAULT 'US_AQI',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. User Preferences Table (Lifestyle enums only, no clinical health data)
CREATE TABLE public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  commute_mode commute_mode_enum NOT NULL DEFAULT 'transit',
  outdoor_activity_window activity_window_enum NOT NULL DEFAULT 'morning',
  indoor_budget_band budget_band_enum NOT NULL DEFAULT 'no_budget',
  sensitive_guidance_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  notification_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Saved Locations (Coarsened Coordinates to protect home privacy)
CREATE TABLE public.saved_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  latitude NUMERIC(6, 3), -- Coarsened ~1.1km
  longitude NUMERIC(6, 3),
  provider_place_ref TEXT,
  precision_level TEXT NOT NULL DEFAULT 'coarse',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_saved_locations_user ON public.saved_locations(user_id, created_at DESC);

-- 5. Provider Sources Registry (Admin managed, public read-only)
CREATE TABLE public.provider_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_code TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  terms_version TEXT NOT NULL,
  license_status TEXT NOT NULL,
  attribution_text TEXT NOT NULL,
  cache_ttl_seconds INT NOT NULL DEFAULT 1800,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Air Quality Snapshots (Short TTL cache table, only if license permits)
CREATE TABLE public.air_quality_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES public.saved_locations(id) ON DELETE SET NULL,
  provider_source_id UUID NOT NULL REFERENCES public.provider_sources(id),
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  observed_at TIMESTAMPTZ,
  value_type value_type_enum NOT NULL,
  aqi_value INT,
  aqi_scale aqi_scale_enum NOT NULL,
  category TEXT NOT NULL,
  dominant_pollutant TEXT,
  coverage_label TEXT,
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_snapshots_fetched ON public.air_quality_snapshots(provider_source_id, fetched_at DESC);

-- 7. Pollutant Readings (Separates AQI index from raw concentration and units)
CREATE TABLE public.pollutant_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id UUID NOT NULL REFERENCES public.air_quality_snapshots(id) ON DELETE CASCADE,
  pollutant_code TEXT NOT NULL,
  value NUMERIC(10, 2) NOT NULL,
  unit TEXT NOT NULL, -- e.g. µg/m³, ppm (Required)
  value_kind TEXT NOT NULL DEFAULT 'concentration', -- 'concentration' | 'subindex'
  averaging_period TEXT,
  source_timestamp TIMESTAMPTZ
);
CREATE INDEX idx_pollutants_snapshot ON public.pollutant_readings(snapshot_id, pollutant_code);

-- 8. Impact Calculations (Deterministic CO2e scenario math records)
CREATE TABLE public.impact_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  distance_value NUMERIC(8, 2) NOT NULL,
  distance_unit TEXT NOT NULL,
  baseline_mode TEXT NOT NULL,
  alternative_mode TEXT NOT NULL,
  factor_value NUMERIC(8, 2) NOT NULL,
  factor_unit TEXT NOT NULL DEFAULT 'g CO2e/passenger-km',
  factor_source_url TEXT NOT NULL,
  factor_region TEXT NOT NULL,
  estimated_delta NUMERIC(10, 2) NOT NULL,
  assumptions JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_impact_user ON public.impact_calculations(user_id, created_at DESC);

-- 9. Row Level Security Configuration & Grant Revocation
-- Blueprint Section 5: "Enable RLS on all exposed tables and explicitly revoke anon / authenticated table privileges before granting only required operations."

REVOKE ALL ON TABLE public.profiles FROM anon, authenticated;
REVOKE ALL ON TABLE public.user_preferences FROM anon, authenticated;
REVOKE ALL ON TABLE public.saved_locations FROM anon, authenticated;
REVOKE ALL ON TABLE public.provider_sources FROM anon, authenticated;
REVOKE ALL ON TABLE public.air_quality_snapshots FROM anon, authenticated;
REVOKE ALL ON TABLE public.pollutant_readings FROM anon, authenticated;
REVOKE ALL ON TABLE public.impact_calculations FROM anon, authenticated;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.air_quality_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pollutant_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_calculations ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_preferences TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_locations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impact_calculations TO authenticated;

-- Public read for provider sources display & attribution
GRANT SELECT ON public.provider_sources TO anon, authenticated;
GRANT SELECT ON public.air_quality_snapshots TO anon, authenticated;
GRANT SELECT ON public.pollutant_readings TO anon, authenticated;

-- Policies for Profiles
CREATE POLICY "Users can select own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE USING (auth.uid() = user_id);

-- Policies for User Preferences
CREATE POLICY "Users can select own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own preferences" ON public.user_preferences FOR DELETE USING (auth.uid() = user_id);

-- Policies for Saved Locations
CREATE POLICY "Users can select own saved locations" ON public.saved_locations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved locations" ON public.saved_locations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saved locations" ON public.saved_locations FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved locations" ON public.saved_locations FOR DELETE USING (auth.uid() = user_id);

-- Policies for Impact Calculations
CREATE POLICY "Users can select own impact records" ON public.impact_calculations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own impact records" ON public.impact_calculations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own impact records" ON public.impact_calculations FOR DELETE USING (auth.uid() = user_id);

-- Provider Sources read policy
CREATE POLICY "Public read for provider sources" ON public.provider_sources FOR SELECT USING (enabled = TRUE);
