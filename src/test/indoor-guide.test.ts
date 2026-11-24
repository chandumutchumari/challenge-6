import { describe, it, expect } from 'vitest';

describe('Indoor Guide & CADR Calculation Suite', () => {
  // AHAM 2/3 Rule: CADR (in cfm) should be at least 2/3 of the room area (in sq ft)
  function calculateRecommendedCADR(roomSqFt: number): number {
    return Math.ceil((roomSqFt * 2) / 3);
  }

  function getVentilationAdvice(outdoorAqi: number | null): 'open_windows' | 'close_windows' | 'filtered_only' {
    if (outdoorAqi === null) return 'close_windows';
    if (outdoorAqi <= 50) return 'open_windows';
    if (outdoorAqi <= 100) return 'filtered_only';
    return 'close_windows';
  }

  it('calculates correct AHAM 2/3 CADR for standard room sizes', () => {
    // 150 sq ft room -> 100 CADR
    expect(calculateRecommendedCADR(150)).toBe(100);

    // 300 sq ft room -> 200 CADR
    expect(calculateRecommendedCADR(300)).toBe(200);

    // 450 sq ft room -> 300 CADR
    expect(calculateRecommendedCADR(450)).toBe(300);
  });

  it('recommends opening windows when outdoor air is Good (AQI <= 50)', () => {
    expect(getVentilationAdvice(35)).toBe('open_windows');
    expect(getVentilationAdvice(50)).toBe('open_windows');
  });

  it('recommends keeping windows closed when outdoor air is Unhealthy (AQI > 100)', () => {
    expect(getVentilationAdvice(155)).toBe('close_windows');
    expect(getVentilationAdvice(220)).toBe('close_windows');
  });

  it('recommends filtered-only ventilation when outdoor air is Moderate (51-100)', () => {
    expect(getVentilationAdvice(75)).toBe('filtered_only');
  });

  it('safely falls back to closed windows when outdoor AQI is unavailable', () => {
    expect(getVentilationAdvice(null)).toBe('close_windows');
  });
});
