import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactElement<LucideIcon>;
  color?: 'orange' | 'blue' | 'green' | 'gray';
}

const colorMap = {
  orange: { bg: 'bg-orange-50', icon: 'text-orange-500', value: 'text-orange-600' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-500', value: 'text-blue-600' },
  green: { bg: 'bg-green-50', icon: 'text-green-500', value: 'text-green-600' },
  gray: { bg: 'bg-gray-100', icon: 'text-gray-500', value: 'text-gray-700' },
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color = 'orange' }) => {
  const c = colorMap[color];
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}>
        <span className={c.icon}>{icon}</span>
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <p className={`text-2xl font-bold ${c.value} mt-0.5`}>{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
