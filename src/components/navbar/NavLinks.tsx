import React from 'react';
import { Gauge, Compass, Home, Wind, Settings } from 'lucide-react';

interface NavLinksProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  variant: 'desktop' | 'mobile';
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Gauge },
  { id: 'planner', label: 'Planner', icon: null },
  { id: 'explorer', label: 'Explorer & Map', mobileLabel: 'Explorer', icon: Compass },
  { id: 'indoor-guide', label: 'Indoor Guide', mobileLabel: 'Indoor', icon: Home },
  { id: 'impact', label: 'Impact Tracker', mobileLabel: 'Impact', icon: Wind },
  { id: 'settings', label: 'Settings', mobileLabel: 'Settings', icon: Settings },
];

/**
 * NavLinks component
 * Renders navigation buttons for either desktop header or mobile bottom bar.
 */
export const NavLinks: React.FC<NavLinksProps> = ({ currentTab, onSelectTab, variant }) => {
  if (variant === 'desktop') {
    return (
      <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              currentTab === item.id
                ? 'bg-slate-800 text-teal-300 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {item.icon && item.id === 'settings' && (
              <Settings className="w-4 h-4 inline-block mr-1 text-slate-400" />
            )}
            {item.label}
          </button>
        ))}
      </nav>
    );
  }

  // Mobile navigation
  return (
    <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/60 text-xs">
      {NAV_ITEMS.filter((item) => item.icon !== null).map((item) => {
        const Icon = item.icon!;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center gap-1 ${
              isActive ? 'text-teal-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.mobileLabel || item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
