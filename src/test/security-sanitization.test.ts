import { describe, it, expect } from 'vitest';
import { escapeHtml, sanitizeInput, redactPII } from '@/lib/security/sanitize';

describe('Security & Input Sanitization Suite', () => {
  it('escapes dangerous HTML characters into HTML entities', () => {
    const raw = '<div class="test" data-val=\'true\'>Hello & "World" /</div>';
    const escaped = escapeHtml(raw);

    expect(escaped).not.toContain('<div');
    expect(escaped).toContain('&lt;div');
    expect(escaped).toContain('&amp;');
    expect(escaped).toContain('&quot;');
    expect(escaped).toContain('&#x27;');
  });

  it('strips script and iframe tags completely', () => {
    const dirty = 'Hello <script>alert("pwned")</script> World <iframe src="evil.com"></iframe>';
    const clean = sanitizeInput(dirty);

    expect(clean).toBe('Hello  World');
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('evil.com');
  });

  it('neutralizes javascript: and event handlers', () => {
    const malicious = '<img src="x" onerror="alert(1)" /> <a href="javascript:doEvil()">Click</a>';
    const clean = sanitizeInput(malicious);

    expect(clean).not.toContain('onerror');
    expect(clean).not.toContain('javascript:');
    expect(clean).toContain('blocked:');
  });

  it('redacts email addresses to preserve user privacy', () => {
    const text = 'Contact researcher at alice.smith@epa.gov or bob@cleanair.org for details.';
    const redacted = redactPII(text);

    expect(redacted).not.toContain('alice.smith@epa.gov');
    expect(redacted).not.toContain('bob@cleanair.org');
    expect(redacted).toContain('[REDACTED_EMAIL]');
  });

  it('redacts high-precision GPS coordinates (>2 decimal places)', () => {
    const text = 'User reported sensor coordinates at 37.774929, -122.419416.';
    const redacted = redactPII(text);

    expect(redacted).not.toContain('37.774929');
    expect(redacted).not.toContain('-122.419416');
    expect(redacted).toContain('[APPROXIMATE_LOCATION]');
  });
});
