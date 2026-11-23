import { describe, it, expect } from 'vitest';
import { calculateFreshness } from '@/lib/constants';

describe('Freshness State Engine', () => {
  const fetchTime = '2026-11-23T12:00:00.000Z';

  it('marks readings under 60 minutes as fresh', () => {
    const observedAt = '2026-11-23T11:45:00.000Z'; // 15 mins ago
    const res = calculateFreshness(observedAt, fetchTime);
    expect(res.freshness).toBe('fresh');
    expect(res.reason).toContain('Fresh');
  });

  it('marks readings between 60 and 180 minutes as delayed', () => {
    const observedAt = '2026-11-23T10:30:00.000Z'; // 90 mins ago
    const res = calculateFreshness(observedAt, fetchTime);
    expect(res.freshness).toBe('delayed');
    expect(res.reason).toContain('Delayed');
  });

  it('marks readings older than 180 minutes as stale', () => {
    const observedAt = '2026-11-23T08:00:00.000Z'; // 4 hours ago
    const res = calculateFreshness(observedAt, fetchTime);
    expect(res.freshness).toBe('stale');
    expect(res.reason).toContain('Exceeds 3 hr freshness threshold');
  });

  it('marks null or invalid timestamps as unavailable without fabricating freshness', () => {
    const nullRes = calculateFreshness(null, fetchTime);
    expect(nullRes.freshness).toBe('unavailable');

    const invalidRes = calculateFreshness('invalid-timestamp-string', fetchTime);
    expect(invalidRes.freshness).toBe('unavailable');
  });
});
