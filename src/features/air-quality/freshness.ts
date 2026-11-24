/**
 * Air Quality Freshness Engine
 * Blueprint Reference: Section 2, 5 & 10
 *
 * Rules:
 * - Fresh: observed within 60 minutes
 * - Delayed: observed 60 to 180 minutes ago
 * - Stale: observed over 180 minutes ago (suspends outdoor scheduling recommendations)
 * - Unavailable: missing or invalid observation timestamp
 */

import { FreshnessState } from '@/types';

export interface FreshnessCalculationResult {
  freshness: FreshnessState;
  reason: string;
  ageMinutes: number | null;
}

export function calculateFreshness(
  observedAt: string | null,
  fetchedAt: string
): FreshnessCalculationResult {
  if (!observedAt) {
    return {
      freshness: 'unavailable',
      reason: 'Missing observation timestamp from provider.',
      ageMinutes: null,
    };
  }

  const observedTime = new Date(observedAt).getTime();
  const fetchTime = new Date(fetchedAt).getTime();

  if (isNaN(observedTime) || isNaN(fetchTime)) {
    return {
      freshness: 'unavailable',
      reason: 'Invalid provider timestamp format.',
      ageMinutes: null,
    };
  }

  const ageMinutes = Math.max(0, Math.floor((fetchTime - observedTime) / (60 * 1000)));

  if (ageMinutes < 60) {
    return {
      freshness: 'fresh',
      reason: `Observed ${ageMinutes}m ago (Fresh within 60m threshold).`,
      ageMinutes,
    };
  } else if (ageMinutes <= 180) {
    return {
      freshness: 'delayed',
      reason: `Observed ${ageMinutes}m ago (Delayed between 1 and 3 hours).`,
      ageMinutes,
    };
  } else {
    return {
      freshness: 'stale',
      reason: `Observed ${Math.floor(ageMinutes / 60)}h ago (Exceeds 3 hr freshness threshold).`,
      ageMinutes,
    };
  }
}
