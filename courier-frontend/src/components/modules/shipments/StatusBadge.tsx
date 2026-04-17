import React from 'react';
import type { ShipmentStatus } from '@/redux/slice/shipmentsSlice';

// MongoDB Atlas uses crisp, high-contrast badges (transparent backgrounds with solid borders, or very light fills)
const statusConfig: Record<ShipmentStatus, { label: string; bg: string; text: string; border: string }> = {
  booked: { label: 'Booked', bg: 'bg-[#E8EDEB]', text: 'text-[#5C6C75]', border: 'border-[#E8EDEB]' },
  received: { label: 'Received', bg: 'bg-[#E3FCF7]', text: 'text-[#018A8A]', border: 'border-[#018A8A]/30' },
  in_transit: { label: 'In Transit', bg: 'bg-[#FEF7EC]', text: 'text-[#EA800A]', border: 'border-[#EA800A]/30' },
  out_for_delivery: { label: 'Out for Delivery', bg: 'bg-[#F2EDFB]', text: 'text-[#8451ED]', border: 'border-[#8451ED]/30' },
  delivered: { label: 'Delivered', bg: 'bg-[#E3FCF7]', text: 'text-[#00684A]', border: 'border-[#00ED64]/50' },
  failed: { label: 'Failed', bg: 'bg-[#FCECEE]', text: 'text-[#C90D2A]', border: 'border-[#C90D2A]/30' },
  cancelled: { label: 'Cancelled', bg: 'bg-transparent', text: 'text-[#5C6C75]', border: 'border-[#E8EDEB]' },
};

interface StatusBadgeProps {
  status: ShipmentStatus;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = statusConfig[status] ?? { label: status, bg: 'bg-transparent', text: 'text-[#5C6C75]', border: 'border-[#E8EDEB]' };
  return (
    <span
      className={`
        inline-flex items-center rounded-md font-semibold border tracking-wide uppercase
        ${config.bg} ${config.text} ${config.border}
        ${size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[10px]'}
      `}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
