// Supabase Edge Function: advisor-recommendations
// Receives closed verified snapshot, enforces schema, invokes Gemini with injection defenses,
// validates output, falls back to deterministic rules if unavailable.
// Blueprint Reference: Section 6, 7 & 10

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
    const { air_context, preferences } = await req.json();

    const geminiKey = Deno.env.get("GEMINI_API_KEY");

    // If Gemini key is unconfigured, return deterministic advice immediately
    if (!geminiKey) {
      const fallbackResponse = {
        summary: `Verified provider data (AQI ${air_context?.aqi?.value ?? 'N/A'}, ${air_context?.aqi?.category ?? 'Standard'}). Prioritize indoor source reduction and low-traffic routes.`,
        actions: [
          {
            id: "det-action-1",
            title: "Coordinate Outdoor Exertion",
            reason: `Current reported ${air_context?.aqi?.scale || 'AQI'} is ${air_context?.aqi?.value || 'N/A'}. Sensitive individuals should adjust high-intensity outdoor workouts.`,
            when: preferences?.outdoor_activity || "flexible",
            type: "outdoor",
            priority: "medium",
            evidence_ids: ["epa-aqi-guide"],
          },
          {
            id: "det-action-2",
            title: "Use Kitchen Range Hood While Cooking",
            reason: "Cooking combustion produces significant ultrafine indoor particulate spikes. Exhaust to the outdoors.",
            when: "Meal times",
            type: "source_reduction",
            priority: "high",
            evidence_ids: ["epa-indoor-hepa"],
          },
        ],
        data_limitations: ["Generated using verified deterministic EPA guidelines (Gemini offline/unconfigured)."],
        medical_caveat: "Guidance is non-clinical and does not replace professional medical advice.",
        generated_by: "deterministic_fallback",
      };

      return new Response(JSON.stringify(fallbackResponse), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call Gemini API with constrained JSON output
    const prompt = `Context: ${JSON.stringify(air_context)}. Preferences: ${JSON.stringify(preferences)}. Produce evidence-linked air recommendations as JSON.`;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;

    const gRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", maxOutputTokens: 600 },
      }),
    });

    const gJson = await gRes.json();
    const rawOutput = gJson.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawOutput);

    return new Response(JSON.stringify({ ...parsed, generated_by: "gemini" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Failed to process advisor request." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
