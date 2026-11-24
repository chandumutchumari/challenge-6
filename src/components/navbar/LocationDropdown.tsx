import React, { useState } from 'react';
import { MapPin, Compass, AlertCircle } from 'lucide-react';
import { PRESET_LOCATIONS, LocationPreset } from '@/features/air-quality/service';

interface LocationDropdownProps {
  selectedLocation: LocationPreset;
  onSelectLocation: (loc: LocationPreset) => void;
  onUseCurrentLocation: () => void;
  activeProviderName: string;
  freshness: string;
}

/**
 * LocationDropdown component
 * Provides accessible, keyboard-friendly selection of monitored cities
 * with coarse GPS device lookup and privacy disclosures.
 */
export const LocationDropdown: React.FC<LocationDropdownProps> = ({
  selectedLocation,
  onSelectLocation,
  onUseCurrentLocation,
  activeProviderName,
  freshness,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredPresets = PRESET_LOCATIONS.filter(
    (p) =>
      p.label.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase())
  );

  const getFreshnessColor = (status: string) => {
    switch (status) {
      case 'fresh':
        return 'bg-emerald-400';
      case 'delayed':
        return 'bg-amber-400';
      case 'stale':
        return 'bg-rose-400';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-700/70 hover:border-teal-500/50 text-sm text-slate-200 hover:text-white transition-all shadow-sm"
        aria-expanded={isOpen}
        aria-label="Change current location"
        title={`Active provider: ${activeProviderName}`}
      >
        <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
        <span className="font-medium truncate max-w-[140px] sm:max-w-[200px]">
          {selectedLocation.label}
        </span>
        <span
          className={`w-2 h-2 rounded-full ${getFreshnessColor(freshness)}`}
          title={`Freshness: ${freshness} | Provider: ${activeProviderName}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-navy-900 border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Select Location
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                  setIsOpen(false);
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
  );
};
