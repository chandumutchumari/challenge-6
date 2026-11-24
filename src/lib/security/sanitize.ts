/**
 * Security & Input Sanitization Utilities
 * Protects against XSS, script injection, prompt injection, and PII leakage.
 */

const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Encodes special HTML characters into safe HTML entities.
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/[&<>"'/]/g, (char) => HTML_ENTITY_MAP[char] || char);
}

/**
 * Strips script tags, iframe tags, javascript: URI schemes, and inline event handlers.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  let sanitized = input;

  // Remove script and iframe tags entirely
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // Strip dangerous schemes like javascript: or data:text/html
  sanitized = sanitized.replace(/javascript\s*:/gi, 'blocked:');
  sanitized = sanitized.replace(/vbscript\s*:/gi, 'blocked:');
  sanitized = sanitized.replace(/data\s*:\s*text\/html/gi, 'blocked:');

  // Strip inline HTML on* event handlers (e.g. onload=, onerror=, onclick=)
  sanitized = sanitized.replace(/\bon\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  return sanitized.trim();
}

/**
 * Redacts email addresses and high-precision coordinates for privacy preservation.
 */
export function redactPII(text: string): string {
  if (!text) return '';

  // Redact email addresses
  let cleaned = text.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    '[REDACTED_EMAIL]'
  );

  // Redact precise coordinates (>2 decimal places) e.g. 37.774929, -122.419416
  cleaned = cleaned.replace(
    /(-?\d+\.\d{3,})\s*,\s*(-?\d+\.\d{3,})/g,
    '[APPROXIMATE_LOCATION]'
  );

  return cleaned;
}
