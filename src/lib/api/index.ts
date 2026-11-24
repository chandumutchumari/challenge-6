/**
 * API client layer for server-side Edge Functions
 * Enforces correlation IDs and timeouts.
 */

import { AirQualitySnapshot, RecommendationResponse, UserPreferences } from '@/types';
import { logEvent } from '@/lib/telemetry';

export interface ApiClientOptions {
  baseUrl?: string;
  timeoutMs?: number;
}

export class ApiClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl || '/api';
    this.timeoutMs = options.timeoutMs || 8000;
  }

  public async fetchCurrentAirQuality(lat: number, lon: number): Promise<Partial<AirQualitySnapshot>> {
    const requestId = `req_${Date.now()}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      logEvent('api_request', { requestId, endpoint: 'air-quality-current', lat: Number(lat.toFixed(2)), lon: Number(lon.toFixed(2)) });
      const res = await fetch(`${this.baseUrl}/air-quality-current`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Request-Id': requestId },
        body: JSON.stringify({ latitude: lat, longitude: lon, precision: 'coarse' }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Edge Function returned HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err: unknown) {
      clearTimeout(timeout);
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logEvent('api_error', { requestId, message: msg });
      throw err;
    }
  }

  public async fetchRecommendations(
    snapshot: AirQualitySnapshot | null,
    preferences: UserPreferences
  ): Promise<RecommendationResponse | null> {
    const requestId = `req_${Date.now()}`;
    try {
      logEvent('api_request', { requestId, endpoint: 'advisor-recommendations' });
      const res = await fetch(`${this.baseUrl}/advisor-recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Request-Id': requestId },
        body: JSON.stringify({ air_context: snapshot, preferences }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}
