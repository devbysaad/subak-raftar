import React from 'react';
import type { ShipmentFilters } from '@/redux/slice/shipmentsSlice';

interface ShipmentFiltersProps {
  filters: ShipmentFilters;
  onChange: (filters: Partial<ShipmentFilters>) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'booked', label: 'Booked' },
  { value: 'received', label: 'Received' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PROVIDER_OPTIONS = [
  { value: '', label: 'All Providers' },
  { value: 'tcs', label: 'TCS' },
  { value: 'leopards', label: 'Leopards' },
  { value: 'trax', label: 'Trax' },
  { value: 'mp', label: 'M&P' },
  { value: 'self', label: 'Self' },
];

const selectClass =
  'px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-700';

const ShipmentFilters: React.FC<ShipmentFiltersProps> = ({ filters, onChange }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Search */}
      <input
        type="text"
        placeholder="Search tracking no, receiver…"
        value={filters.search}
        onChange={(e) => onChange({ search: e.target.value, page: 1 })}
        className={`${selectClass} min-w-56`}
      />

      {/* Status */}
      <select
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value, page: 1 })}
        className={selectClass}
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Provider */}
      <select
        value={filters.provider}
        onChange={(e) => onChange({ provider: e.target.value, page: 1 })}
        className={selectClass}
      >
        {PROVIDER_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* COD */}
      <select
        value={filters.isCOD}
        onChange={(e) => onChange({ isCOD: e.target.value, page: 1 })}
        className={selectClass}
      >
        <option value="">All (COD)</option>
        <option value="true">COD Only</option>
        <option value="false">Non-COD</option>
      </select>
    </div>
  );
};

export default ShipmentFilters;
