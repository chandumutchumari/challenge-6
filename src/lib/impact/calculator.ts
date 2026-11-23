import { TransportImpactCalculation } from '@/types';
import { EMISSION_FACTORS } from '@/lib/constants';

export interface CalculateImpactParams {
  distance_value: number;
  distance_unit: 'km' | 'mi';
  baseline_mode: 'car_gasoline' | 'car_hybrid' | 'car_ev';
  alternative_mode: 'walk' | 'bike' | 'transit_bus' | 'transit_rail';
}

/**
 * Deterministic Transport Impact Calculator
 * Formula specified in Blueprint Section 9:
 * estimated emissions (g CO2e) = distance (km) × factor (g CO2e / passenger-km)
 * estimated savings = baseline emissions − alternative emissions
 *
 * Strict constraint:
 * Greenhouse Gas (CO2e) math is distinct from local particulate (PM2.5) exposure.
 * Never claim a transport switch directly reduced local street-level PM2.5.
 */
export function calculateTransportImpact({
  distance_value,
  distance_unit,
  baseline_mode,
  alternative_mode,
}: CalculateImpactParams): TransportImpactCalculation {
  // Validate boundaries
  const rawDist = Math.max(0, Number(distance_value) || 0);

  // Convert distance to kilometers if in miles (1 mi = 1.60934 km)
  const distance_km = distance_unit === 'mi' ? rawDist * 1.609344 : rawDist;

  const baselineConfig = EMISSION_FACTORS[baseline_mode] || EMISSION_FACTORS.car_gasoline;
  const alternativeConfig = EMISSION_FACTORS[alternative_mode] || EMISSION_FACTORS.transit_bus;

  const estimated_baseline_emissions_g = Math.round(distance_km * baselineConfig.factor);
  const estimated_alternative_emissions_g = Math.round(distance_km * alternativeConfig.factor);
  const estimated_savings_g = Math.round(estimated_baseline_emissions_g - estimated_alternative_emissions_g);

  return {
    distance_value: rawDist,
    distance_unit,
    distance_km: Number(distance_km.toFixed(2)),
    baseline_mode,
    alternative_mode,
    baseline_factor: baselineConfig.factor,
    alternative_factor: alternativeConfig.factor,
    estimated_baseline_emissions_g,
    estimated_alternative_emissions_g,
    estimated_savings_g,
    factor_source_name: `${baselineConfig.source} / ${alternativeConfig.source}`,
    factor_source_url: baselineConfig.sourceUrl,
    factor_region: baselineConfig.region,
    factor_boundary: baselineConfig.boundary,
    is_illustrative_scenario: true,
    assumptions: [
      `Distance: ${rawDist} ${distance_unit} (${distance_km.toFixed(2)} km).`,
      `Baseline factor: ${baselineConfig.factor} g CO₂e/pass-km (${baselineConfig.label}).`,
      `Alternative factor: ${alternativeConfig.factor} g CO₂e/pass-km (${alternativeConfig.label}).`,
      'Calculations assume average fleet passenger occupancy. Cold start variations and terrain gradients are excluded.',
    ],
    limitation_notice:
      'CRITICAL: Greenhouse Gas (CO₂e) emissions estimates are NOT local PM2.5 or particulate exposure reductions. Localized air quality exposure depends heavily on street canyon topography, traffic distance, and wind conditions.',
  };
}
