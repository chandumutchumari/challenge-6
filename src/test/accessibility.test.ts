import { describe, it, expect } from 'vitest';
import { announceToScreenReader, formatAQIForScreenReader } from '@/lib/accessibility';

describe('Accessibility & Screen Reader Utilities', () => {
  it('formats descriptive AQI strings for screen readers accurately', () => {
    const formatted = formatAQIForScreenReader(42, 'US_AQI', 'Good', 'measured_station');
    expect(formatted).toBe('Air Quality Index: 42 on the US_AQI scale. Category: Good. Data type: measured_station.');
  });

  it('handles unavailable air quality data gracefully for screen readers', () => {
    const formatted = formatAQIForScreenReader(null, 'UNKNOWN', 'Unavailable', 'unknown');
    expect(formatted).toBe('Air quality data currently unavailable.');
  });

  it('safely handles announceToScreenReader in headless / SSR / Node environments without throwing', () => {
    expect(() => {
      announceToScreenReader('Air quality updated: AQI 45, Good');
    }).not.toThrow();
  });
});
