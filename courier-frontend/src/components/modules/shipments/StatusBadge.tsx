import React from 'react';
import type { ShipmentStatus } from '@/redux/slice/shipmentsSlice';

const statusConfig: Record<ShipmentStatus, { label: string; bg: string; text: string }> = {
  booked: { label: 'Booked', bg: 'bg-gray-100', text: 'text-gray-600' },
  received: { label: 'Received', bg: 'bg-blue-100', text: 'text-blue-600' },
  in_transit: { label: 'In Transit', bg: 'bg-amber-100', text: 'text-amber-700' },
  out_for_delivery: { label: 'Out for Delivery', bg: 'bg-orange-100', text: 'text-orange-600' },
  delivered: { label: 'Delivered', bg: 'bg-green-100', text: 'text-green-700' },
  failed: { label: 'Failed', bg: 'bg-red-100', text: 'text-red-600' },
  cancelled: { label: 'Cancelled', bg: 'bg-gray-200', text: 'text-gray-500' },
};

interface StatusBadgeProps {
  status: ShipmentStatus;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = statusConfig[status] ?? { label: status, bg: 'bg-gray-100', text: 'text-gray-500' };
  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${config.bg} ${config.text}
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}
      `}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
