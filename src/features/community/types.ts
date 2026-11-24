/**
 * Community Feature Domain Types
 * Blueprint Reference: Section 3.9 & 12
 */

export interface ShareCardPayload {
  locationLabel: string;
  roundedLatitude: number;
  roundedLongitude: number;
  aqiValue: number;
  aqiScale: string;
  categoryLabel: string;
  sourceAttribution: string;
  timestamp: string;
}
