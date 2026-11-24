import React from 'react';
import { Wind, MessageSquare } from 'lucide-react';
import { LocationPreset } from '@/features/air-quality/service';
import { LocationDropdown } from './navbar/LocationDropdown';
import { NavLinks } from './navbar/NavLinks';

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

/**
 * Navbar component
 * Top application header providing brand identity, location selection,
 * navigation tabs, and AI assistant quick launch.
 */
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

          {/* Location Selector */}
          <LocationDropdown
            selectedLocation={selectedLocation}
            onSelectLocation={onSelectLocation}
            onUseCurrentLocation={onUseCurrentLocation}
            activeProviderName={activeProviderName}
            freshness={freshness}
          />

          {/* Desktop Nav Tab Navigation */}
          <NavLinks currentTab={currentTab} onSelectTab={onSelectTab} variant="desktop" />

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
        <NavLinks currentTab={currentTab} onSelectTab={onSelectTab} variant="mobile" />
      </div>
    </header>
  );
};
