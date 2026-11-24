import { useState, useCallback } from 'react';
import { UserPreferences } from '@/types';

export const DEFAULT_PREFERENCES: UserPreferences = {
  commute_mode: 'transit',
  outdoor_activity_window: 'morning',
  indoor_budget_band: 'no_budget',
  sensitive_guidance_opt_in: false,
  unit_system: 'metric',
  aqi_scale_preference: 'US_AQI',
};

const STORAGE_KEY = 'breathewise_user_preferences';

interface UseUserPreferencesReturn {
  preferences: UserPreferences;
  updatePreferences: (newPrefs: UserPreferences) => void;
  resetAllData: () => void;
}

/**
 * Custom hook to manage UserPreferences with safe localStorage persistence.
 */
export function useUserPreferences(): UseUserPreferencesReturn {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const updatePreferences = useCallback((newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const resetAllData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('breathewise_saved_places');
    } catch {
      // ignore
    }
    setPreferences(DEFAULT_PREFERENCES);
    alert('All saved local preferences and cache have been completely cleared.');
  }, []);

  return {
    preferences,
    updatePreferences,
    resetAllData,
  };
}
