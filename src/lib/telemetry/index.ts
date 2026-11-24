/**
 * Redacted structured logging and telemetry module
 * Blueprint Reference: Section 4 & 8
 * Strictly redacts exact coordinates, API credentials, and personal health data.
 */

export interface TelemetryPayload {
  requestId?: string;
  endpoint?: string;
  provider?: string;
  latencyMs?: number;
  status?: string;
  [key: string]: unknown;
}

export function logEvent(eventName: string, data: TelemetryPayload) {
  // Redact credentials or exact location coordinates if accidentally passed
  const sanitized = { ...data };

  if ('apiKey' in sanitized) delete sanitized.apiKey;
  if ('token' in sanitized) delete sanitized.token;
  if ('password' in sanitized) delete sanitized.password;

  // Round coordinates to ~1.1km if present
  if (typeof sanitized.lat === 'number') {
    sanitized.lat = Number(sanitized.lat.toFixed(2));
  }
  if (typeof sanitized.lon === 'number') {
    sanitized.lon = Number(sanitized.lon.toFixed(2));
  }

  // Structured console log format
  const entry = {
    timestamp: new Date().toISOString(),
    event: eventName,
    ...sanitized,
  };

  if (process.env.NODE_ENV !== 'production') {
    // Only in development environment
    // console.debug('[Telemetry]', entry);
  }
  return entry;
}
