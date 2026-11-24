/**
 * Indoor Guide Domain Types
 * Blueprint Reference: Section 3.7 & 12
 */

export type BudgetBand = 'no_budget' | 'low_cost' | 'hepa_purifier';

export interface PurifierSizingRecommendation {
  roomAreaSqFt: number;
  recommendedSmokeCADR: number;
  filterStandard: string;
  budgetBand: BudgetBand;
}
