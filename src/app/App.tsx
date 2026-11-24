import React, { useState } from 'react';
import { Navbar } from '@/components';
import { LandingPage, DashboardPage, SettingsPage } from '@/pages';
import { AirQualityExplorer } from '@/features/air-quality';
import { DailyPlannerView } from '@/features/planner';
import { IndoorGuideView } from '@/features/indoor-guide';
import { ImpactTrackerView } from '@/features/impact';
import { AIAssistantDrawer } from '@/features/advisor';
import { PRESET_LOCATIONS, LocationPreset } from '@/features/air-quality/service';
import { useAirQuality, useGeolocation, useUserPreferences } from '@/hooks';

/**
 * App Root Component
 * Orchestrates application navigation tabs, custom hooks, and layout.
 */
export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedLocation, setSelectedLocation] = useState<LocationPreset>(PRESET_LOCATIONS[0]);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Custom Hooks
  const { preferences, updatePreferences, resetAllData } = useUserPreferences();
  const {
    snapshot,
    recommendations,
    isLoading,
    loadAirQualityData,
    activeProviderCode,
    setActiveProviderCode,
  } = useAirQuality(selectedLocation, preferences);
  const { getCurrentCoarsenedLocation } = useGeolocation();

  const handleUseCurrentLocation = () => {
    getCurrentCoarsenedLocation((loc) => setSelectedLocation(loc));
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

      {/* Top Navigation Bar */}
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

      {/* Main Content Landmark */}
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
            onUpdatePreferences={updatePreferences}
            onResetAllData={resetAllData}
            onProviderChange={setActiveProviderCode}
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
