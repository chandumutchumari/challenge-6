import { AQIScale } from '@/types';

/**
 * EPA US Air Quality Index Breakpoints
 * Documented thresholds: 0-50 Good, 51-100 Moderate, 101-150 USG,
 * 151-200 Unhealthy, 201-300 Very Unhealthy, 301-500 Hazardous
 */
export const EPA_AQI_CATEGORIES = [
  {
    min: 0,
    max: 50,
    level: 'good' as const,
    label: 'Good',
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    colorBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    indicatorColor: '#10b981',
  },
  {
    min: 51,
    max: 100,
    level: 'moderate' as const,
    label: 'Moderate',
    description: 'Air quality is acceptable; however, there may be some concern for sensitive individuals.',
    colorBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    indicatorColor: '#f59e0b',
  },
  {
    min: 101,
    max: 150,
    level: 'sensitive' as const,
    label: 'Unhealthy for Sensitive Groups',
    description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
    colorBadge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    indicatorColor: '#f97316',
  },
  {
    min: 151,
    max: 200,
    level: 'unhealthy' as const,
    label: 'Unhealthy',
    description: 'Some members of the general public may experience health effects; sensitive groups may experience more serious effects.',
    colorBadge: 'bg-red-500/20 text-red-300 border-red-500/30',
    indicatorColor: '#ef4444',
  },
  {
    min: 201,
    max: 300,
    level: 'very_unhealthy' as const,
    label: 'Very Unhealthy',
    description: 'Health alert: The risk of health effects is increased for everyone.',
    colorBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    indicatorColor: '#a855f7',
  },
  {
    min: 301,
    max: 9999,
    level: 'hazardous' as const,
    label: 'Hazardous',
    description: 'Health warning of emergency conditions: everyone is more likely to be affected.',
    colorBadge: 'bg-rose-950/60 text-rose-300 border-rose-700/60',
    indicatorColor: '#881337',
  },
];

/**
 * European Air Quality Index (EAQI) Breakpoints
 */
export const EU_AQI_CATEGORIES = [
  { min: 1, max: 1, level: 'good' as const, label: 'Very Good', description: 'Air quality is very good.', colorBadge: 'bg-teal-500/20 text-teal-300 border-teal-500/30', indicatorColor: '#14b8a6' },
  { min: 2, max: 2, level: 'good' as const, label: 'Good', description: 'Air quality is good.', colorBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', indicatorColor: '#10b981' },
  { min: 3, max: 3, level: 'moderate' as const, label: 'Medium', description: 'Air quality is moderate.', colorBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', indicatorColor: '#f59e0b' },
  { min: 4, max: 4, level: 'unhealthy' as const, label: 'Poor', description: 'Air quality is poor.', colorBadge: 'bg-orange-500/20 text-orange-300 border-orange-500/30', indicatorColor: '#f97316' },
  { min: 5, max: 5, level: 'very_unhealthy' as const, label: 'Very Poor', description: 'Air quality is very poor.', colorBadge: 'bg-red-500/20 text-red-300 border-red-500/30', indicatorColor: '#ef4444' },
  { min: 6, max: 99, level: 'hazardous' as const, label: 'Extremely Poor', description: 'Air quality is extremely poor.', colorBadge: 'bg-rose-950/60 text-rose-300 border-rose-700/60', indicatorColor: '#881337' },
];

export function getCategoryForAQI(aqi: number | null, scale: AQIScale) {
  if (aqi === null || scale === 'UNKNOWN') {
    return {
      level: 'unknown' as const,
      label: 'Unknown',
      description: 'Scale or index value is not categorized.',
      colorBadge: 'bg-slate-800 text-slate-300 border-slate-700',
      indicatorColor: '#64748b',
    };
  }

  if (scale === 'US_AQI') {
    const match = EPA_AQI_CATEGORIES.find((c) => aqi >= c.min && aqi <= c.max);
    if (match) return match;
    return EPA_AQI_CATEGORIES[EPA_AQI_CATEGORIES.length - 1];
  }

  if (scale === 'EU_EAQI') {
    const match = EU_AQI_CATEGORIES.find((c) => aqi >= c.min && aqi <= c.max);
    if (match) return match;
    return EU_AQI_CATEGORIES[EU_AQI_CATEGORIES.length - 1];
  }

  return {
    level: 'unknown' as const,
    label: 'Uncategorized',
    description: `Index is reported on ${scale}.`,
    colorBadge: 'bg-slate-800 text-slate-300 border-slate-700',
    indicatorColor: '#64748b',
  };
}

/**
 * Standard Freshness Rules:
 * Fresh: < 60 minutes
 * Delayed: 60 - 180 minutes
 * Stale: > 180 minutes
 * Unavailable: No response or missing timestamp
 */
export { calculateFreshness } from '@/features/air-quality/freshness';

/**
 * Verified Emission Factors (g CO2e per passenger-km)
 * Sources:
 * - US EPA GHG Emission Factors for Greenhouse Gas Inventories (typical passenger vehicle: ~400 g CO2/mi ≈ 248 g CO2/km; avg 1.5 pass occupancy ≈ 165 g CO2/pass-km)
 * - UK DEFRA / BEIS Greenhouse Gas Conversion Factors
 */
export const EMISSION_FACTORS = {
  car_gasoline: {
    label: 'Passenger Car (Gasoline, single occupant)',
    factor: 192, // g CO2e / pass-km
    unit: 'g CO2e / pass-km',
    source: 'UK DEFRA & US EPA average car factors',
    sourceUrl: 'https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle',
    boundary: 'tailpipe' as const,
    region: 'US / UK Composite Baseline',
  },
  car_hybrid: {
    label: 'Passenger Car (Hybrid)',
    factor: 110,
    unit: 'g CO2e / pass-km',
    source: 'UK DEFRA Hybrid factors',
    sourceUrl: 'https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting',
    boundary: 'tailpipe' as const,
    region: 'UK / EU Documented Factors',
  },
  car_ev: {
    label: 'Passenger Car (Electric, grid average)',
    factor: 48,
    unit: 'g CO2e / pass-km',
    source: 'Average grid generation lifecycle (EEA / EPA eGRID)',
    sourceUrl: 'https://www.epa.gov/egrid',
    boundary: 'well_to_wheel_lifecycle' as const,
    region: 'Grid Average Estimate',
  },
  transit_bus: {
    label: 'Urban Transit Bus (average occupancy)',
    factor: 96,
    unit: 'g CO2e / pass-km',
    source: 'Federal Transit Administration (FTA) Transit Greenhouse Gas Emissions',
    sourceUrl: 'https://www.transit.dot.gov',
    boundary: 'tailpipe' as const,
    region: 'US Urban Transit Baseline',
  },
  transit_rail: {
    label: 'Urban Rail / Subway (electric transit)',
    factor: 35,
    unit: 'g CO2e / pass-km',
    source: 'FTA / UK DEFRA passenger rail average',
    sourceUrl: 'https://www.transit.dot.gov',
    boundary: 'well_to_wheel_lifecycle' as const,
    region: 'National Urban Rail Baseline',
  },
  bike: {
    label: 'Bicycle / Active Mobility',
    factor: 0,
    unit: 'g CO2e / pass-km',
    source: 'Direct zero tailpipe emissions',
    sourceUrl: 'https://www.epa.gov',
    boundary: 'tailpipe' as const,
    region: 'Universal Zero Tailpipe',
  },
  walk: {
    label: 'Walking',
    factor: 0,
    unit: 'g CO2e / pass-km',
    source: 'Direct zero tailpipe emissions',
    sourceUrl: 'https://www.epa.gov',
    boundary: 'tailpipe' as const,
    region: 'Universal Zero Tailpipe',
  },
};

export const APPROVED_PUBLIC_GUIDANCE = [
  {
    id: 'who-aq-guidelines',
    title: 'WHO Global Air Quality Guidelines',
    organization: 'World Health Organization (WHO)',
    url: 'https://www.who.int/publications/i/item/9789240034228',
    summary: 'Evidence-based guidance on particulate matter (PM2.5, PM10) thresholds and outdoor exposure risk reduction.',
  },
  {
    id: 'epa-aqi-guide',
    title: 'Air Quality Guide for Particle Pollution',
    organization: 'US Environmental Protection Agency (EPA AirNow)',
    url: 'https://www.airnow.gov/aqi/aqi-basics/',
    summary: 'Standard recommendations for sensitive populations and general public across AQI category boundaries.',
  },
  {
    id: 'epa-indoor-hepa',
    title: 'Indoor Air Quality: Air Cleaners and Filters in the Home',
    organization: 'US EPA Indoor Environments Division',
    url: 'https://www.epa.gov/indoor-air-quality-iaq/air-cleaners-and-air-filters-home',
    summary: 'Guidance on HEPA filtration, Clean Air Delivery Rate (CADR), and avoiding ozone-generating cleaners.',
  },
];
