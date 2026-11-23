import { AirQualityProviderAdapter } from './adapters/base';
import { OpenMeteoAdapter } from './adapters/open-meteo';
import { FixtureAdapter } from './adapters/fixture';
import { AirNowAdapter } from './adapters/airnow';
import { AirQualitySnapshot } from '@/types';

export interface LocationPreset {
  id: string;
  label: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export const PRESET_LOCATIONS: LocationPreset[] = [
  { id: 'nyc', label: 'New York, USA', city: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
  { id: 'la', label: 'Los Angeles, USA', city: 'Los Angeles', country: 'United States', lat: 34.0522, lon: -118.2437 },
  { id: 'london', label: 'London, UK', city: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { id: 'paris', label: 'Paris, France', city: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { id: 'delhi', label: 'New Delhi, India', city: 'New Delhi', country: 'India', lat: 28.6139, lon: 77.209 },
  { id: 'tokyo', label: 'Tokyo, Japan', city: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
];

export class AirQualityService {
  private static instance: AirQualityService;
  private adapters: Map<string, AirQualityProviderAdapter> = new Map();
  private activeProviderCode: string = 'open-meteo';
  private cache: Map<string, { snapshot: AirQualitySnapshot; expiresAt: number }> = new Map();

  private constructor() {
    this.registerAdapter(new OpenMeteoAdapter());
    this.registerAdapter(new FixtureAdapter());
    this.registerAdapter(new AirNowAdapter());
  }

  public static getInstance(): AirQualityService {
    if (!AirQualityService.instance) {
      AirQualityService.instance = new AirQualityService();
    }
    return AirQualityService.instance;
  }

  public registerAdapter(adapter: AirQualityProviderAdapter) {
    this.adapters.set(adapter.code, adapter);
  }

  public getAvailableProviders() {
    return Array.from(this.adapters.values()).map((a) => ({
      code: a.code,
      name: a.name,
      configured: a.isConfigured(),
      attribution: a.attribution,
      license: a.licenseText,
      valueType: a.valueType,
    }));
  }

  public setActiveProvider(code: string) {
    if (this.adapters.has(code)) {
      this.activeProviderCode = code;
    }
  }

  public getActiveProviderCode(): string {
    return this.activeProviderCode;
  }

  public async fetchAirQuality(lat: number, lon: number, locationLabel?: string, forceRefresh = false): Promise<AirQualitySnapshot> {
    const adapter = this.adapters.get(this.activeProviderCode);
    if (!adapter) {
      throw new Error(`Air quality provider '${this.activeProviderCode}' is not registered.`);
    }

    if (!adapter.isConfigured()) {
      throw new Error(`Provider '${adapter.name}' is unconfigured. Please configure its credentials or select Open-Meteo.`);
    }

    // Coarsen coordinates to 2 decimal places (~1.1km) for privacy and cache alignment
    const coarseLat = Number(lat.toFixed(2));
    const coarseLon = Number(lon.toFixed(2));
    const cacheKey = `${adapter.code}:${coarseLat}:${coarseLon}`;

    const cached = this.cache.get(cacheKey);
    const now = Date.now();
    if (!forceRefresh && cached && cached.expiresAt > now) {
      return cached.snapshot;
    }

    const snapshot = await adapter.fetchCurrent(coarseLat, coarseLon, locationLabel);

    // Save to cache respecting provider TTL
    if (adapter.cacheTtlSeconds > 0) {
      this.cache.set(cacheKey, {
        snapshot,
        expiresAt: now + adapter.cacheTtlSeconds * 1000,
      });
    }

    return snapshot;
  }
}
