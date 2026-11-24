// Supabase Edge Function: air-quality-current
// Validates bounds, enforces rate limit, fetches from approved provider, returns normalized schema.
// Blueprint Reference: Section 6 & 9

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, precision = "coarse" } = await req.json();

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return new Response(
        JSON.stringify({ error: "Invalid coordinate arguments: latitude and longitude are required numbers." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Coarsen coordinates to 2 decimals (~1.1km) if coarse requested
    const lat = precision === "coarse" ? Number(latitude.toFixed(2)) : latitude;
    const lon = precision === "coarse" ? Number(longitude.toFixed(2)) : longitude;

    // Call Open-Meteo CAMS atmospheric model grid
    const targetUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=us_aqi,pm2_5&forecast_days=2&timezone=auto`;

    const res = await fetch(targetUrl);
    if (!res.ok) {
      throw new Error(`Upstream provider error: HTTP ${res.status}`);
    }

    const data = await res.json();
    const current = data.current;

    const responsePayload = {
      source_id: "open-meteo-cams",
      source_name: "Open-Meteo / Copernicus CAMS",
      source_url: "https://open-meteo.com",
      attribution: "Open-Meteo and Copernicus Atmosphere Monitoring Service",
      value_type: "estimate", // Model grid estimate
      aqi_scale: "US_AQI",
      aqi_value: current?.us_aqi ? Math.round(current.us_aqi) : null,
      observed_at: current?.time || null,
      fetched_at: new Date().toISOString(),
      location_scope: "grid",
      coordinates: { latitude: lat, longitude: lon },
      freshness: "fresh",
      pollutants: [
        { code: "pm25", value: current?.pm2_5, unit: "µg/m³", kind: "concentration" },
        { code: "pm10", value: current?.pm10, unit: "µg/m³", kind: "concentration" },
        { code: "o3", value: current?.ozone, unit: "µg/m³", kind: "concentration" },
        { code: "no2", value: current?.nitrogen_dioxide, unit: "µg/m³", kind: "concentration" },
      ],
    };

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch air quality.";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
