import React, { useState } from 'react';
import { AirQualitySnapshot } from '@/types';
import { PRESET_LOCATIONS, LocationPreset } from '../service';
import { 
  MapPin, 
  Table, 
  Map as MapIcon, 
  Compass, 
  Search 
} from 'lucide-react';

interface AirQualityExplorerProps {
  currentSnapshot: AirQualitySnapshot | null;
  selectedLocation: LocationPreset;
  onSelectLocation: (loc: LocationPreset) => void;
  onUseCurrentLocation: () => void;
}

export const AirQualityExplorer: React.FC<AirQualityExplorerProps> = ({
  currentSnapshot,
  selectedLocation,
  onSelectLocation,
  onUseCurrentLocation,
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [filterQuery, setFilterQuery] = useState('');

  // Calculate local distance in km using Haversine formula (Blueprint Section 3.4: local distance calculation)
  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  };

  const stationsWithDistance = PRESET_LOCATIONS.map((loc) => ({
    ...loc,
    distanceKm: calculateDistanceKm(selectedLocation.lat, selectedLocation.lon, loc.lat, loc.lon),
  })).sort((a, b) => a.distanceKm - b.distanceKm);

  const filteredStations = stationsWithDistance.filter(
    (s) =>
      s.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.country.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Explorer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-teal-400" />
            Air Quality Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse monitoring coverage, atmospheric model grids, and station relationships with clear provenance.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'map' ? 'bg-slate-800 text-teal-300 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              aria-label="Map View"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-teal-300 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              aria-label="Accessible Table Alternative"
            >
              <Table className="w-3.5 h-3.5" />
              <span>Accessible Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Location Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search stations, cities, or global regions..."
            className="w-full pl-9 pr-4 py-2 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
          />
        </div>
        <button
          onClick={onUseCurrentLocation}
          className="px-4 py-2 bg-navy-900 border border-slate-700 hover:border-teal-500/50 rounded-xl text-xs font-semibold text-teal-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
        >
          <MapPin className="w-4 h-4 text-teal-400" />
          <span>Approximate GPS Location</span>
        </button>
      </div>

      {/* Map / Table View Area */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          {/* Map Container */}
          <div className="relative h-[420px] rounded-2xl overflow-hidden border border-slate-800 bg-navy-950 shadow-inner">
            {/* Interactive OpenStreetMap Embed compliant with OSM tile terms & attribution */}
            <iframe
              title="OpenStreetMap Air Quality Geographic View"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedLocation.lon - 1.5}%2C${selectedLocation.lat - 1.0}%2C${selectedLocation.lon + 1.5}%2C${selectedLocation.lat + 1.0}&layer=mapnik&marker=${selectedLocation.lat}%2C${selectedLocation.lon}`}
              className="w-full h-full border-0 filter invert-[0.9] hue-rotate-[180deg] contrast-[0.9] opacity-80"
              loading="lazy"
            />

            {/* Overlay Station Card */}
            <div className="absolute top-4 left-4 max-w-sm glass-panel p-4 rounded-xl border border-slate-700/80 shadow-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                  Active Region
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {selectedLocation.lat.toFixed(2)}°, {selectedLocation.lon.toFixed(2)}°
                </span>
              </div>
              <h3 className="font-bold text-sm text-white">{selectedLocation.label}</h3>
              {currentSnapshot && (
                <div className="pt-2 border-t border-slate-800/80 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reported AQI:</span>
                    <strong className="text-white">
                      {currentSnapshot.aqi_value ?? 'N/A'} ({currentSnapshot.aqi_scale})
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="text-teal-300 font-medium">{currentSnapshot.category.label}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Value Type:</span>
                    <span className="text-slate-300 uppercase font-mono">{currentSnapshot.value_type}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 right-4 glass-panel p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5 shadow-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Coverage Legend
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 ring-2 ring-teal-400/30"></span>
                <span>Active Point / Regulatory Monitor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-400/80 border border-blue-400"></span>
                <span>Copernicus CAMS Grid (~11-45km)</span>
              </div>
            </div>
          </div>

          {/* OSM Tile Attribution Notice */}
          <div className="text-[11px] text-slate-500 flex items-center justify-between px-1">
            <span>
              Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">OpenStreetMap contributors</a>.
            </span>
            <span>Distances calculated locally via spherical Haversine formula.</span>
          </div>
        </div>
      ) : (
        /* Accessible Table Alternative */
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="text-[11px] uppercase bg-slate-900/90 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Location / Region</th>
                <th className="py-3 px-4 font-semibold">Coordinates</th>
                <th className="py-3 px-4 font-semibold">Local Distance</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {filteredStations.map((station) => (
                <tr
                  key={station.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    selectedLocation.id === station.id ? 'bg-teal-500/10' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <strong className="text-white block">{station.label}</strong>
                    <span className="text-[10px] text-slate-400">{station.country}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {station.lat.toFixed(2)}°, {station.lon.toFixed(2)}°
                  </td>
                  <td className="py-3 px-4 text-teal-300 font-mono">
                    {station.distanceKm === 0 ? '0 km (Active)' : `${station.distanceKm} km away`}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
                      Model Grid
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectLocation(station)}
                      disabled={selectedLocation.id === station.id}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                    >
                      {selectedLocation.id === station.id ? 'Selected' : 'Load Data'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
