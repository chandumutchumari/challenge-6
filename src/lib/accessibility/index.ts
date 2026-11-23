/**
 * Accessibility utility functions
 * Provides screen reader announcements, contrast verification, and keyboard focus helpers.
 */

export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (typeof document === 'undefined') return;

  let liveRegion = document.getElementById('breathewise-a11y-live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'breathewise-a11y-live-region';
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
  }

  liveRegion.textContent = '';
  // Force browser re-render to announce
  setTimeout(() => {
    if (liveRegion) liveRegion.textContent = message;
  }, 50);
}

export function formatAQIForScreenReader(aqi: number | null, scale: string, category: string, valueType: string): string {
  if (aqi === null) {
    return 'Air quality data currently unavailable.';
  }
  return `Air Quality Index: ${aqi} on the ${scale} scale. Category: ${category}. Data type: ${valueType}.`;
}
