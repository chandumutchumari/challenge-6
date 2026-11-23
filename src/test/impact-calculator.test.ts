import { describe, it, expect } from 'vitest';
import { calculateTransportImpact } from '@/lib/impact/calculator';

describe('Deterministic Transport Impact Calculator', () => {
  it('correctly calculates emissions and savings in kilometers', () => {
    const result = calculateTransportImpact({
      distance_value: 10,
      distance_unit: 'km',
      baseline_mode: 'car_gasoline', // 192 g/km
      alternative_mode: 'transit_bus', // 96 g/km
    });

    expect(result.distance_km).toBe(10);
    expect(result.estimated_baseline_emissions_g).toBe(1920);
    expect(result.estimated_alternative_emissions_g).toBe(960);
    expect(result.estimated_savings_g).toBe(960);
    expect(result.limitation_notice).toContain('NOT local PM2.5');
  });

  it('converts miles to kilometers accurately', () => {
    const result = calculateTransportImpact({
      distance_value: 5,
      distance_unit: 'mi',
      baseline_mode: 'car_gasoline',
      alternative_mode: 'bike', // 0 g/km
    });

    // 5 mi ≈ 8.05 km
    expect(result.distance_km).toBeCloseTo(8.05, 1);
    expect(result.estimated_alternative_emissions_g).toBe(0);
    expect(result.estimated_savings_g).toBe(result.estimated_baseline_emissions_g);
  });

  it('handles zero or negative distance boundaries gracefully', () => {
    const result = calculateTransportImpact({
      distance_value: 0,
      distance_unit: 'km',
      baseline_mode: 'car_gasoline',
      alternative_mode: 'walk',
    });

    expect(result.distance_km).toBe(0);
    expect(result.estimated_baseline_emissions_g).toBe(0);
    expect(result.estimated_savings_g).toBe(0);
  });
});
