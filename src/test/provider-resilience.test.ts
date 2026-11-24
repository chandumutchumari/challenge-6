import { describe, it, expect } from 'vitest';
import { FixtureAdapter } from '@/features/air-quality/adapters/fixture';
import { AirNowAdapter } from '@/features/air-quality/adapters/airnow';

describe('Provider Resilience & Contract Tests', () => {
  it('identifies unconfigured state honestly when API keys are absent', () => {
    const airNowAdapter = new AirNowAdapter('');
    expect(airNowAdapter.isConfigured()).toBe(false);
  });

  it('serves stale fixture contract scenario accurately without treating as current', async () => {
    const fixtureAdapter = new FixtureAdapter();
    const staleSnapshot = await fixtureAdapter.fetchCurrent(40.71, -74.0, 'Stale Test Monitor');

    expect(staleSnapshot.freshness).toBe('stale');
    expect(staleSnapshot.provider.is_fixture).toBe(true);
    expect(staleSnapshot.provider.name).toContain('[FIXTURE ONLY]');
    expect(staleSnapshot.provider.attribution_text).toContain('TEST ONLY FIXTURE');
  });

  it('serves unavailable fixture contract scenario accurately when monitor is offline', async () => {
    const fixtureAdapter = new FixtureAdapter();
    const offlineSnapshot = await fixtureAdapter.fetchCurrent(40.71, -74.0, 'Unavailable Test Station');

    expect(offlineSnapshot.freshness).toBe('unavailable');
    expect(offlineSnapshot.aqi_value).toBeNull();
    expect(offlineSnapshot.category.level).toBe('unknown');
    expect(offlineSnapshot.value_type).toBe('unknown');
  });
});
