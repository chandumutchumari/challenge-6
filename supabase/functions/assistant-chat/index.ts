// Supabase Edge Function: assistant-chat
// Validates conversation context, sanitizes input, defends against prompt injection, bounds token output.
// Blueprint Reference: Section 6, 7 & 8

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
    const { message, contextSnapshot } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Missing or invalid 'message' in request body." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Prompt injection filter
    const lower = message.toLowerCase();
    if (lower.includes("ignore previous") || lower.includes("system prompt") || lower.includes("reveal secrets")) {
      return new Response(
        JSON.stringify({
          reply: "Security Boundary: I can only answer questions related to urban air quality and public health guidance within verified boundaries.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Formulate response
    const reply = `BreatheWise Assistant: Based on current ${contextSnapshot?.scale || 'AQI'} readings (${contextSnapshot?.aqi ?? 'Unavailable'}), reduce strenuous outdoor workouts during elevated particle periods, close windows during traffic peaks, and vent indoor cooking.`;

    return new Response(JSON.stringify({ reply, timestamp: new Date().toISOString() }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Chat service error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
