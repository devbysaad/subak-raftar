import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactElement<LucideIcon>;
  color?: 'mongo' | 'slate' | 'teal' | 'gray';
}

const colorMap = {
  mongo: { bg: 'bg-[#E3FCF7]', icon: 'text-[#00684A]', value: 'text-[#001E2B]' },
  slate: { bg: 'bg-[#E8EDEB]', icon: 'text-[#001E2B]', value: 'text-[#001E2B]' },
  teal:  { bg: 'bg-[#E1F7F6]', icon: 'text-[#018A8A]', value: 'text-[#018A8A]' },
  gray:  { bg: 'bg-gray-100',  icon: 'text-[#5C6C75]', value: 'text-[#001E2B]' },
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color = 'slate' }) => {
  const c = colorMap[color];
  return (
    <div className="atlas-card p-5 flex items-center gap-4 transition-transform hover:-translate-y-0.5 duration-200">
      <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0 border border-white`}>
        <span className={c.icon}>{icon}</span>
      </div>
      <div>
        <p className="text-xs text-[#5C6C75] font-semibold tracking-wide uppercase">{title}</p>
        <p className={`text-[28px] leading-tight font-bold ${c.value} mt-1`}>{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
