import React, { useState } from 'react';
import { Wind, MapPin, Compass, Home, Gauge, Settings, MessageSquare, AlertCircle } from 'lucide-react';
import { PRESET_LOCATIONS, LocationPreset } from '@/features/air-quality/service';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  selectedLocation: LocationPreset;
  onSelectLocation: (loc: LocationPreset) => void;
  onUseCurrentLocation: () => void;
  onOpenChat: () => void;
  activeProviderName: string;
  freshness: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  selectedLocation,
  onSelectLocation,
  onUseCurrentLocation,
  onOpenChat,
  activeProviderName,
  freshness,
}) => {
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [customSearch, setCustomSearch] = useState('');

  const filteredPresets = PRESET_LOCATIONS.filter(
    (p) =>
      p.label.toLowerCase().includes(customSearch.toLowerCase()) ||
      p.country.toLowerCase().includes(customSearch.toLowerCase())
  );

  return (
    <header role="banner" className="sticky top-0 z-40 w-full border-b border-slate-800 bg-navy-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('landing')}
              className="flex items-center gap-2 group text-left focus:outline-none"
              aria-label="BreatheWise AI Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-navy-950 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Wind className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  BreatheWise<span className="text-teal-400"> AI</span>
                </span>
                <span className="hidden sm:block text-[11px] text-slate-400 font-medium tracking-wide">
                  Breathe Better. Live Smarter.
                </span>
              </div>
            </button>
          </div>

          {/* Location Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-700/70 hover:border-teal-500/50 text-sm text-slate-200 hover:text-white transition-all shadow-sm"
              aria-expanded={locationDropdownOpen}
              aria-label="Change current location"
              title={`Active provider: ${activeProviderName}`}
            >
              <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span className="font-medium truncate max-w-[140px] sm:max-w-[200px]">
                {selectedLocation.label}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  freshness === 'fresh'
                    ? 'bg-emerald-400'
                    : freshness === 'delayed'
                    ? 'bg-amber-400'
                    : freshness === 'stale'
                    ? 'bg-rose-400'
                    : 'bg-slate-500'
                }`}
                title={`Freshness: ${freshness} | Provider: ${activeProviderName}`}
              />
            </button>

            {locationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-navy-900 border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Select Location
                  </span>
                  <button
                    onClick={() => {
                      setLocationDropdownOpen(false);
                      onUseCurrentLocation();
                    }}
                    className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Use Device GPS
                  </button>
                </div>

                <div className="mb-2">
                  <input
                    type="text"
                    value={customSearch}
                    onChange={(e) => setCustomSearch(e.target.value)}
                    placeholder="Search city or country..."
                    className="w-full px-2.5 py-1.5 text-xs bg-navy-950 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                  {filteredPresets.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        onSelectLocation(loc);
                        setLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        selectedLocation.id === loc.id
                          ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{loc.label}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {loc.lat.toFixed(2)}°, {loc.lon.toFixed(2)}°
                      </span>
                    </button>
                  ))}
                  {filteredPresets.length === 0 && (
                    <p className="text-xs text-slate-500 py-3 text-center">No matching locations found.</p>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-teal-400 flex-shrink-0" />
                  <span>Coordinates are coarsened to ~1.1km for privacy.</span>
                </div>
              </div>
            )}
          </div>

          {/* Nav Tab Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'dashboard'
                  ? 'bg-slate-800 text-teal-300 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onSelectTab('planner')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'planner'
                  ? 'bg-slate-800 text-teal-300 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Planner
            </button>
            <button
              onClick={() => onSelectTab('explorer')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'explorer'
                  ? 'bg-slate-800 text-teal-300 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Explorer & Map
            </button>
            <button
              onClick={() => onSelectTab('indoor-guide')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'indoor-guide'
                  ? 'bg-slate-800 text-teal-300 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Indoor Guide
            </button>
            <button
              onClick={() => onSelectTab('impact')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'impact'
                  ? 'bg-slate-800 text-teal-300 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Impact Tracker
            </button>
            <button
              onClick={() => onSelectTab('settings')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'settings'
                  ? 'bg-slate-800 text-teal-300 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 inline-block mr-1 text-slate-400" />
              Settings
            </button>
          </nav>

          {/* Right Action: AI Assistant Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/15 border border-teal-500/40 text-teal-300 hover:bg-teal-500/25 text-xs font-semibold shadow-sm transition-all focus:ring-2 focus:ring-teal-400"
              aria-label="Open AI Assistant"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Assistant</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/60 text-xs">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex flex-col items-center gap-1 ${currentTab === 'dashboard' ? 'text-teal-400 font-semibold' : 'text-slate-400'}`}
          >
            <Gauge className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => onSelectTab('explorer')}
            className={`flex flex-col items-center gap-1 ${currentTab === 'explorer' ? 'text-teal-400 font-semibold' : 'text-slate-400'}`}
          >
            <Compass className="w-4 h-4" />
            <span>Explorer</span>
          </button>
          <button
            onClick={() => onSelectTab('indoor-guide')}
            className={`flex flex-col items-center gap-1 ${currentTab === 'indoor-guide' ? 'text-teal-400 font-semibold' : 'text-slate-400'}`}
          >
            <Home className="w-4 h-4" />
            <span>Indoor</span>
          </button>
          <button
            onClick={() => onSelectTab('impact')}
            className={`flex flex-col items-center gap-1 ${currentTab === 'impact' ? 'text-teal-400 font-semibold' : 'text-slate-400'}`}
          >
            <Wind className="w-4 h-4" />
            <span>Impact</span>
          </button>
          <button
            onClick={() => onSelectTab('settings')}
            className={`flex flex-col items-center gap-1 ${currentTab === 'settings' ? 'text-teal-400 font-semibold' : 'text-slate-400'}`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
