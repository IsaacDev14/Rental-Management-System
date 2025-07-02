import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Import icons for change indicator
import type { StatCardProps } from '../../types/common'; // Use type-only import for the interface

/**
 * Reusable StatCard component for displaying key metrics.
 * Features a title, value, an icon, a customizable color scheme, and an optional change indicator.
 */
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, change }) => {
  // Define color classes based on the 'color' prop for background and text
  const colorClasses = {
    cyan: { bg: 'bg-cyan-900/40', text: 'text-cyan-400' },
    teal: { bg: 'bg-teal-900/40', text: 'text-teal-400' },
    emerald: { bg: 'bg-emerald-900/40', text: 'text-emerald-400' },
    amber: { bg: 'bg-amber-900/40', text: 'text-amber-400' },
    red: { bg: 'bg-red-900/40', text: 'text-red-400' },
    blue: { bg: 'bg-blue-900/40', text: 'text-blue-400' },
  };

  // Select the appropriate color scheme, defaulting to cyan if not found
  const selectedColor = colorClasses[color] || colorClasses.cyan;

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 transition-all duration-300 hover:shadow-cyan-500/20 hover:scale-[1.01]">
      <div className="flex items-center space-x-4">
        {/* Icon container with dynamic background color */}
        <div className={`p-4 rounded-full ${selectedColor.bg} flex items-center justify-center`}>
          <Icon className={`h-7 w-7 ${selectedColor.text}`} /> {/* Render the passed icon */}
        </div>
        <div>
          {/* Title of the statistic */}
          <p className="text-sm text-gray-400">{title}</p>
          {/* Value of the statistic */}
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
      </div>
      {/* Optional change indicator with up/down arrow */}
      {change && (
        <p className={`text-xs mt-3 ${change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'} flex items-center`}>
          {change.startsWith('+') ? <ChevronUp size={14} className="mr-1" /> : <ChevronDown size={14} className="mr-1" />}
          {change} vs last month
        </p>
      )}
    </div>
  );
};

export default StatCard;
