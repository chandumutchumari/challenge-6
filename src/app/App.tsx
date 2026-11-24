import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AirQualityExplorer } from '@/features/air-quality/components/AirQualityExplorer';
import { DailyPlannerView } from '@/features/planner/DailyPlannerView';
import { IndoorGuideView } from '@/features/indoor-guide/IndoorGuideView';
import { ImpactTrackerView } from '@/features/impact/ImpactTrackerView';
import { SettingsPage } from '@/pages/SettingsPage';
import { AIAssistantDrawer } from '@/features/advisor/components/AIAssistantDrawer';
import { AirQualityService, PRESET_LOCATIONS, LocationPreset } from '@/features/air-quality/service';
import { GeminiAdvisorService } from '@/lib/gemini/advisor-service';
import { AirQualitySnapshot, UserPreferences, RecommendationResponse } from '@/types';
import { announceToScreenReader } from '@/lib/accessibility';

const DEFAULT_PREFERENCES: UserPreferences = {
  commute_mode: 'transit',
  outdoor_activity_window: 'morning',
  indoor_budget_band: 'no_budget',
  sensitive_guidance_opt_in: false,
  unit_system: 'metric',
  aqi_scale_preference: 'US_AQI',
};

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedLocation, setSelectedLocation] = useState<LocationPreset>(PRESET_LOCATIONS[0]);
  const [snapshot, setSnapshot] = useState<AirQualitySnapshot | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('breathewise_user_preferences');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const aqService = AirQualityService.getInstance();
  const advisor = GeminiAdvisorService.getInstance();
  const [activeProviderCode, setActiveProviderCode] = useState<string>(aqService.getActiveProviderCode());

  // Fetch air quality data and advice
  const loadAirQualityData = useCallback(
    async (loc: LocationPreset, forceRefresh = false) => {
      setIsLoading(true);
      try {
        const freshSnapshot = await aqService.fetchAirQuality(loc.lat, loc.lon, loc.label, forceRefresh);
        setSnapshot(freshSnapshot);

        announceToScreenReader(
          `Air quality data updated for ${loc.label}. AQI: ${freshSnapshot.aqi_value ?? 'Unavailable'}, category: ${freshSnapshot.category.label}.`
        );

        // Fetch evidence-linked recommendations (Gemini with closed context or deterministic fallback)
        const recs = await advisor.getRecommendations(freshSnapshot, preferences);
        setRecommendations(recs);
      } catch (err) {
        console.error('Failed to load air quality snapshot:', err);
        // Honest unavailable state, never inventing data
        setSnapshot({
          id: `unavail-${Date.now()}`,
          provider: {
            id: 'unavail',
            code: 'unavail',
            name: activeProviderCode,
            source_url: 'https://breathewise.ai',
            attribution_text: 'Provider unavailable',
            license_status: 'N/A',
            cache_ttl_seconds: 0,
          },
          location: {
            label: loc.label,
            latitude: loc.lat,
            longitude: loc.lon,
            scope: 'unknown',
          },
          fetched_at: new Date().toISOString(),
          observed_at: null,
          value_type: 'unknown',
          aqi_value: null,
          aqi_scale: 'UNKNOWN',
          category: {
            level: 'unknown',
            label: 'Unavailable',
            description: 'Could not contact active air quality provider.',
            colorBadge: 'bg-rose-950/40 text-rose-300 border-rose-800',
          },
          dominant_pollutant: null,
          pollutants: [],
          freshness: 'unavailable',
          freshness_reason: 'Provider connection failed or location not supported.',
        });
        const recs = await advisor.getRecommendations(null, preferences);
        setRecommendations(recs);
      } finally {
        setIsLoading(false);
      }
    },
    [activeProviderCode, preferences, aqService, advisor]
  );

  useEffect(() => {
    loadAirQualityData(selectedLocation);
  }, [selectedLocation, activeProviderCode, loadAirQualityData]);

  // Handle browser approximate location with privacy coarsening (Blueprint Section 3.2 & 8)
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Coarsen coordinates to 2 decimal places for privacy protection
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
        setSelectedLocation(customLoc);
      },
      (err) => {
        console.warn('Geolocation permission denied or error:', err);
        alert('Could not access device location. Using default selected city.');
      },
      { timeout: 8000 }
    );
  };

  const handleUpdatePreferences = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    try {
      localStorage.setItem('breathewise_user_preferences', JSON.stringify(newPrefs));
    } catch {
      // LocalStorage unavailable
    }
  };

  const handleResetAllData = () => {
    try {
      localStorage.removeItem('breathewise_user_preferences');
      localStorage.removeItem('breathewise_saved_places');
    } catch {
      // ignore
    }
    setPreferences(DEFAULT_PREFERENCES);
    setSelectedLocation(PRESET_LOCATIONS[0]);
    alert('All saved local preferences and cache have been completely cleared.');
  };

  const handleProviderChange = (code: string) => {
    aqService.setActiveProvider(code);
    setActiveProviderCode(code);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      {/* Accessible Skip Link (WCAG 2.2 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-400 focus:text-navy-950 focus:font-bold focus:rounded-lg focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white transition-all"
      >
        Skip to main content
      </a>

      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        onUseCurrentLocation={handleUseCurrentLocation}
        onOpenChat={() => setIsChatOpen(true)}
        activeProviderName={snapshot?.provider.name || activeProviderCode}
        freshness={snapshot?.freshness || 'unavailable'}
      />

      {/* Main Content Area */}
      <main
        id="main-content"
        role="main"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 focus:outline-none"
      >
        {currentTab === 'landing' && (
          <LandingPage
            onCheckMyArea={() => setCurrentTab('dashboard')}
            onExplore={() => setCurrentTab('explorer')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            snapshot={snapshot}
            isLoading={isLoading}
            onRefresh={() => loadAirQualityData(selectedLocation, true)}
            recommendations={recommendations}
            onNavigateToImpact={() => setCurrentTab('impact')}
            onNavigateToIndoor={() => setCurrentTab('indoor-guide')}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {currentTab === 'planner' && (
          <DailyPlannerView
            snapshot={snapshot}
            preferences={preferences}
          />
        )}

        {currentTab === 'explorer' && (
          <AirQualityExplorer
            currentSnapshot={snapshot}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            onUseCurrentLocation={handleUseCurrentLocation}
          />
        )}

        {currentTab === 'indoor-guide' && (
          <IndoorGuideView
            outdoorAQI={snapshot?.aqi_value ?? null}
            outdoorScale={snapshot?.aqi_scale ?? 'US_AQI'}
          />
        )}

        {currentTab === 'impact' && <ImpactTrackerView />}

        {currentTab === 'settings' && (
          <SettingsPage
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            onResetAllData={handleResetAllData}
            onProviderChange={handleProviderChange}
            activeProviderCode={activeProviderCode}
          />
        )}
      </main>

      {/* AI Assistant Drawer Modal */}
      <AIAssistantDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        snapshot={snapshot}
        preferences={preferences}
      />
    </div>
  );
};
