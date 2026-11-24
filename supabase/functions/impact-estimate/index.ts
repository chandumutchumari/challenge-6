// Supabase Edge Function: impact-estimate
// Deterministic transport emissions math (does not invoke Gemini).
// Blueprint Reference: Section 6 & 9

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMISSION_FACTORS: Record<string, { factor: number; label: string }> = {
  car_gasoline: { factor: 192, label: "Passenger Car (Gasoline)" },
  car_hybrid: { factor: 110, label: "Passenger Car (Hybrid)" },
  car_ev: { factor: 48, label: "Passenger Car (Electric, grid average)" },
  transit_bus: { factor: 96, label: "Urban Transit Bus" },
  transit_rail: { factor: 35, label: "Urban Rail / Subway" },
  bike: { factor: 0, label: "Bicycle / Active Mobility" },
  walk: { factor: 0, label: "Walking" },
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { distance, distanceUnit = "km", baselineMode = "car_gasoline", alternativeMode = "transit_bus" } = await req.json();

    const rawDist = Math.max(0, Number(distance) || 0);
    const distanceKm = distanceUnit === "mi" ? rawDist * 1.609344 : rawDist;

    const base = EMISSION_FACTORS[baselineMode] || EMISSION_FACTORS.car_gasoline;
    const alt = EMISSION_FACTORS[alternativeMode] || EMISSION_FACTORS.transit_bus;

    const estimated_baseline = Math.round(distanceKm * base.factor);
    const estimated_alternative = Math.round(distanceKm * alt.factor);
    const estimated_savings = Math.round(estimated_baseline - estimated_alternative);

    return new Response(
      JSON.stringify({
        distance_km: Number(distanceKm.toFixed(2)),
        distance_unit: distanceUnit,
        baseline_mode: baselineMode,
        alternative_mode: alternativeMode,
        baseline_emissions_g: estimated_baseline,
        alternative_emissions_g: estimated_alternative,
        savings_g: estimated_savings,
        limitation_notice: "Greenhouse Gas (CO2e) math is distinct from local particulate (PM2.5) exposure.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to calculate impact.";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
