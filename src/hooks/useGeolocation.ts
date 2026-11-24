import { useState, useCallback } from 'react';
import { LocationPreset } from '@/features/air-quality/service';

interface UseGeolocationReturn {
  getCurrentCoarsenedLocation: (onSuccess: (loc: LocationPreset) => void) => void;
  error: string | null;
}

/**
 * Custom hook to obtain device GPS with mandatory privacy coarsening
 * (~1.1 km precision at 2 decimal places) in adherence with Blueprint Section 8.
 */
export function useGeolocation(): UseGeolocationReturn {
  const [error, setError] = useState<string | null>(null);

  const getCurrentCoarsenedLocation = useCallback((onSuccess: (loc: LocationPreset) => void) => {
    if (!navigator.geolocation) {
      const msg = 'Geolocation is not supported by your browser.';
      setError(msg);
      alert(msg);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coarsenedLat = Number(pos.coords.latitude.toFixed(2));
        const coarsenedLon = Number(pos.coords.longitude.toFixed(2));
        const customLoc: LocationPreset = {
          id: `gps-${coarsenedLat}-${coarsenedLon}`,
          label: `Approx. Area (${coarsenedLat}°, ${coarsenedLon}°)`,
          city: 'Your Area',
          country: 'Local',
          lat: coarsenedLat,
          lon: coarsenedLon,
        };
        setError(null);
        onSuccess(customLoc);
      },
      (err) => {
        console.warn('Geolocation permission denied or error:', err);
        setError(err.message);
        alert('Could not access device location. Using default selected city.');
      },
      { timeout: 8000 }
    );
  }, []);

  return {
    getCurrentCoarsenedLocation,
    error,
  };
}
