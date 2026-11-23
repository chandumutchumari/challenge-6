import { AirQualitySnapshot } from '@/types';

export interface AirQualityProviderAdapter {
  id: string;
  code: string;
  name: string;
  sourceUrl: string;
  attribution: string;
  licenseText: string;
  valueType: 'observed' | 'estimate' | 'forecast' | 'aggregate' | 'unknown';
  cacheTtlSeconds: number;
  
  isConfigured(): boolean;
  fetchCurrent(lat: number, lon: number, locationLabel?: string): Promise<AirQualitySnapshot>;
}
