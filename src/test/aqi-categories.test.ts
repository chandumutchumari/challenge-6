import { describe, it, expect } from 'vitest';
import { getCategoryForAQI } from '@/lib/constants';

describe('AQI Scale and Category Thresholds', () => {
  it('categorizes US EPA AQI thresholds correctly', () => {
    expect(getCategoryForAQI(25, 'US_AQI').level).toBe('good');
    expect(getCategoryForAQI(50, 'US_AQI').level).toBe('good');
    expect(getCategoryForAQI(51, 'US_AQI').level).toBe('moderate');
    expect(getCategoryForAQI(100, 'US_AQI').level).toBe('moderate');
    expect(getCategoryForAQI(101, 'US_AQI').level).toBe('sensitive');
    expect(getCategoryForAQI(150, 'US_AQI').level).toBe('sensitive');
    expect(getCategoryForAQI(151, 'US_AQI').level).toBe('unhealthy');
    expect(getCategoryForAQI(200, 'US_AQI').level).toBe('unhealthy');
    expect(getCategoryForAQI(201, 'US_AQI').level).toBe('very_unhealthy');
    expect(getCategoryForAQI(300, 'US_AQI').level).toBe('very_unhealthy');
    expect(getCategoryForAQI(301, 'US_AQI').level).toBe('hazardous');
    expect(getCategoryForAQI(450, 'US_AQI').level).toBe('hazardous');
  });

  it('handles unknown scale or null aqi without guessing', () => {
    const unknownScale = getCategoryForAQI(75, 'UNKNOWN');
    expect(unknownScale.level).toBe('unknown');

    const nullValue = getCategoryForAQI(null, 'US_AQI');
    expect(nullValue.level).toBe('unknown');
  });

  it('categorizes European EAQI correctly', () => {
    expect(getCategoryForAQI(1, 'EU_EAQI').label).toBe('Very Good');
    expect(getCategoryForAQI(2, 'EU_EAQI').label).toBe('Good');
    expect(getCategoryForAQI(3, 'EU_EAQI').label).toBe('Medium');
    expect(getCategoryForAQI(4, 'EU_EAQI').label).toBe('Poor');
  });
});
