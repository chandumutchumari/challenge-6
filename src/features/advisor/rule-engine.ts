import { AirQualitySnapshot, UserPreferences, ActionRecommendation, RecommendationResponse } from '@/types';

/**
 * Deterministic Rule-Based Recommendation Engine
 * Blueprint Reference: Section 7 & 10
 *
 * Generates verified, actionable advice without requiring an LLM.
 * Serves as the primary engine when Gemini is unconfigured or in offline/fallback mode.
 * Grounded in US EPA AQI Action Guides and WHO guidelines.
 */
export function generateDeterministicAdvice(
  snapshot: AirQualitySnapshot | null,
  preferences: UserPreferences
): RecommendationResponse {
  // Case 1: Snapshot unavailable or missing
  if (!snapshot || snapshot.freshness === 'unavailable' || snapshot.aqi_value === null) {
    return {
      summary: 'Current air quality observation is unavailable for this location. Routine adjustments cannot be recommended without verified data.',
      actions: [
        {
          id: 'action-source-check',
          title: 'Check Provider Connection',
          reason: 'No verified outdoor air quality observation was received. Verify provider settings or select another nearby area.',
          when: null,
          type: 'source_reduction',
          priority: 'high',
          evidence_ids: ['provider-status-check'],
          caveats: 'Do not assume air is clean in the absence of sensor or model data.',
        },
        {
          id: 'action-indoor-baseline',
          title: 'Maintain General Indoor Source Reduction',
          reason: 'Regardless of outdoor conditions, minimizing indoor smoke from cooking, incense, and unvented combustion improves baseline indoor air.',
          when: null,
          type: 'indoor',
          priority: 'medium',
          evidence_ids: ['epa-indoor-hepa'],
          caveats: 'Indoor guidance is general and does not measure indoor particulate levels.',
        },
      ],
      data_limitations: ['No active verified provider observation for this coordinate.'],
      medical_caveat: 'General public-health guidance only. Consult a healthcare professional for personal medical conditions.',
      generated_by: 'deterministic_fallback',
    };
  }

  // Case 2: Stale Snapshot - Do NOT offer scheduling advice based on stale data
  if (snapshot.freshness === 'stale') {
    return {
      summary: `Observation is stale (${snapshot.freshness_reason || 'observed over 3 hours ago'}). Actionable scheduling recommendations are suspended until a fresh observation is retrieved.`,
      actions: [
        {
          id: 'action-refresh-needed',
          title: 'Awaiting Updated Provider Data',
          reason: 'Air pollution levels can change rapidly with diurnal boundary layer and traffic shifts. Stale data must not guide outdoor activity planning.',
          when: null,
          type: 'source_reduction',
          priority: 'high',
          evidence_ids: ['freshness-stale-rule'],
          caveats: 'Scheduling actions are suspended during stale data periods.',
        },
        {
          id: 'action-indoor-precaution',
          title: 'Keep Air Cleaners Running',
          reason: 'If indoor filtration is available, continue steady operation while outdoor reading freshness is restored.',
          when: null,
          type: 'indoor',
          priority: 'medium',
          evidence_ids: ['epa-indoor-hepa'],
        },
      ],
      data_limitations: [`Reading timestamp is ${snapshot.observed_at || 'unknown'}. Freshness state: Stale.`],
      medical_caveat: 'Guidance is non-clinical. Do not rely on stale measurements for sensitive health decisions.',
      generated_by: 'deterministic_fallback',
    };
  }

  const aqi = snapshot.aqi_value;
  const isSensitive = preferences.sensitive_guidance_opt_in;
  const commute = preferences.commute_mode;
  const actions: ActionRecommendation[] = [];

  // Logic grounded in EPA AQI action criteria
  if (aqi <= 50) {
    // Good (0-50)
    actions.push({
      id: 'act-outdoor-favorable',
      title: 'Outdoor Activities Favorable',
      reason: `Reported index is ${aqi} (${snapshot.category.label}) on the ${snapshot.aqi_scale} scale. Conditions are generally favorable for outdoor routines.`,
      when: preferences.outdoor_activity_window === 'flexible' ? 'Anytime' : preferences.outdoor_activity_window,
      type: 'outdoor',
      priority: 'low',
      evidence_ids: ['epa-aqi-guide'],
      caveats: 'Conditions may vary near local arterial roads or active point emissions.',
    });

    if (commute === 'walk' || commute === 'bike') {
      actions.push({
        id: 'act-commute-active',
        title: `Active Commute (${commute === 'walk' ? 'Walking' : 'Cycling'}) Favorable`,
        reason: 'Current reported particulate levels support active commuting without elevated ambient air quality concern.',
        when: 'Normal commute window',
        type: 'commute',
        priority: 'low',
        evidence_ids: ['who-aq-guidelines'],
      });
    }

    actions.push({
      id: 'act-ventilation-open',
      title: 'Opportunity for Outdoor Air Exchange',
      reason: 'When outdoor particulate levels are reported low, opening windows provides natural dilution for indoor CO₂ and indoor VOC build-up.',
      when: 'Morning or midday',
      type: 'indoor',
      priority: 'medium',
      evidence_ids: ['epa-indoor-hepa'],
      caveats: 'Verify outdoor air remains clean before extended ventilation, especially near construction or busy streets.',
    });
  } else if (aqi <= 100) {
    // Moderate (51-100)
    if (isSensitive) {
      actions.push({
        id: 'act-sensitive-caution',
        title: 'Moderate Activity for Sensitive Groups',
        reason: `Reported AQI is ${aqi}. Unusually sensitive individuals may consider taking more breaks during prolonged outdoor exertion.`,
        when: preferences.outdoor_activity_window,
        type: 'outdoor',
        priority: 'high',
        evidence_ids: ['epa-aqi-guide'],
        caveats: 'This is general public advice. Individual respiratory sensitivities vary.',
      });
    } else {
      actions.push({
        id: 'act-general-moderate',
        title: 'Routine Outdoor Activities Acceptable',
        reason: `Current index is ${aqi} (${snapshot.category.label}). General public is unlikely to experience immediate adverse effects.`,
        when: preferences.outdoor_activity_window,
        type: 'outdoor',
        priority: 'low',
        evidence_ids: ['epa-aqi-guide'],
      });
    }

    actions.push({
      id: 'act-commute-buffer',
      title: commute === 'walk' || commute === 'bike' ? 'Choose Low-Traffic Commute Route' : 'Plan Standard Commute with Closed Windows',
      reason: 'Moderate ambient particulate often spikes near congested corridors. Setting vehicle ventilation to recirculate or walking on side streets lowers peak exposure.',
      when: 'Peak traffic hours',
      type: 'commute',
      priority: 'medium',
      evidence_ids: ['who-aq-guidelines'],
    });

    actions.push({
      id: 'act-indoor-source',
      title: 'Vent Kitchen During Cooking',
      reason: 'Cooking on gas or high-heat frying produces localized indoor PM2.5 spikes. Use exhaust ventilation ducted outdoors.',
      when: 'Meal preparation',
      type: 'source_reduction',
      priority: 'medium',
      evidence_ids: ['epa-indoor-hepa'],
    });
  } else if (aqi <= 150) {
    // Unhealthy for Sensitive Groups (101-150)
    actions.push({
      id: 'act-reduce-outdoor-exertion',
      title: isSensitive ? 'Reduce Strenuous Outdoor Exertion' : 'Consider Moderate Outdoor Pace',
      reason: `Reported AQI is ${aqi} (Unhealthy for Sensitive Groups). Sensitive groups should reduce prolonged outdoor exertion; take frequent rest breaks.`,
      when: 'Peak daylight / afternoon',
      type: 'outdoor',
      priority: 'high',
      evidence_ids: ['epa-aqi-guide'],
      caveats: 'Never guaranteed safe. Relocate indoors if irritation or shortness of breath occurs.',
    });

    if (commute === 'walk' || commute === 'bike') {
      actions.push({
        id: 'act-commute-transit-alt',
        title: 'Consider Enclosed Transit Option',
        reason: 'Walking or cycling during elevated particulate periods increases inhaled dose due to higher minute ventilation.',
        when: 'Commute hours',
        type: 'commute',
        priority: 'high',
        evidence_ids: ['who-aq-guidelines'],
      });
    }

    actions.push({
      id: 'act-indoor-filtration-run',
      title: 'Run Indoor Air Filtration on Medium/High',
      reason: 'Outdoor particles infiltrate indoor spaces. Operating a mechanical HEPA or MERV-13 filter reduces indoor concentrations.',
      when: 'Continuous',
      type: 'indoor',
      priority: 'high',
      evidence_ids: ['epa-indoor-hepa'],
    });
  } else {
    // Unhealthy / Very Unhealthy / Hazardous (>150)
    actions.push({
      id: 'act-avoid-prolonged-outdoor',
      title: 'Avoid Strenuous Outdoor Exertion',
      reason: `Reported AQI is ${aqi} (${snapshot.category.label}). Risk of health effects is elevated for everyone; sensitive individuals should stay indoors.`,
      when: 'All periods',
      type: 'outdoor',
      priority: 'high',
      evidence_ids: ['epa-aqi-guide'],
      caveats: 'Do not ignore worsening respiratory symptoms.',
    });

    actions.push({
      id: 'act-keep-windows-closed',
      title: 'Keep Windows Closed & Recirculate Vehicle Air',
      reason: 'Prevent outdoor ambient smoke and fine particulate infiltration. Use cabin recirculation in transit or vehicles.',
      when: 'All day',
      type: 'indoor',
      priority: 'high',
      evidence_ids: ['epa-indoor-hepa'],
    });

    actions.push({
      id: 'act-source-reduction-strict',
      title: 'Eliminate Indoor Combustion Sources',
      reason: 'Avoid burning candles, incense, woodstoves, or vacuuming without a sealed HEPA exhaust during high outdoor pollution events.',
      when: 'Throughout day',
      type: 'source_reduction',
      priority: 'high',
      evidence_ids: ['epa-indoor-hepa'],
    });
  }

  return {
    summary: `Based on verified ${snapshot.provider.name} data (AQI ${aqi}, ${snapshot.category.label}), here are ${actions.length} evidence-linked recommendations tailored to your routine.`,
    actions: actions.slice(0, 4),
    data_limitations: [
      `Data type: ${snapshot.value_type} (${snapshot.location.scope} scope).`,
      `Provider: ${snapshot.provider.attribution_text}.`,
      'Model grids and station readings do not reflect hyper-local microclimates or indoor air quality.',
    ],
    medical_caveat: 'Public health advice based on standard AQI categories. Not individual medical diagnosis or treatment.',
    generated_by: 'deterministic_fallback',
  };
}
