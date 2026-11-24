import { describe, it, expect } from 'vitest';
import { APPROVED_PUBLIC_GUIDANCE } from '@/lib/constants';
import { ActionRecommendationSchema } from '@/lib/validation';

describe('Evidence Validation and Hallucination Protection', () => {
  const approvedIds = new Set(APPROVED_PUBLIC_GUIDANCE.map((g) => g.id));

  it('verifies that all approved reference guides are accessible with URLs', () => {
    expect(approvedIds.size).toBeGreaterThanOrEqual(3);
    for (const guide of APPROVED_PUBLIC_GUIDANCE) {
      expect(guide.url).toMatch(/^https?:\/\//);
      expect(guide.summary.length).toBeGreaterThan(15);
    }
  });

  it('accepts actions that reference approved evidence IDs', () => {
    const validAction = {
      id: 'act-valid-1',
      title: 'Run Indoor Air Cleaner',
      reason: 'Reduces particulate infiltration during elevated outdoor periods.',
      when: 'Continuous',
      type: 'indoor' as const,
      priority: 'high' as const,
      evidence_ids: ['epa-indoor-hepa'],
    };

    const parsed = ActionRecommendationSchema.parse(validAction);
    const hasValidEvidence = parsed.evidence_ids.every((id) => approvedIds.has(id));

    expect(hasValidEvidence).toBe(true);
  });

  it('flags unapproved or hallucinated evidence citations', () => {
    const hallucinatedAction = {
      id: 'act-hallucinated-1',
      title: 'Magic Air Solution',
      reason: 'Guaranteed 100% clean air everywhere.',
      when: 'Now',
      type: 'indoor' as const,
      priority: 'low' as const,
      evidence_ids: ['fake-unverified-citation-999'],
    };

    const parsed = ActionRecommendationSchema.parse(hallucinatedAction);
    const hasValidEvidence = parsed.evidence_ids.every((id) => approvedIds.has(id));

    expect(hasValidEvidence).toBe(false);
  });
});
