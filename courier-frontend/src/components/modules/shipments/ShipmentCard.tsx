import React from 'react';
import type { Shipment } from '@/redux/slice/shipmentsSlice';
import StatusBadge from './StatusBadge';
import { Package } from 'lucide-react';

interface ShipmentCardProps {
  shipment: Shipment;
  onClick?: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const ShipmentCard: React.FC<ShipmentCardProps> = ({ shipment, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package size={16} className="text-orange-500" />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">
              {shipment.providerTrackingNo || shipment._id.slice(-8).toUpperCase()}
            </p>
            <p className="text-xs text-gray-500">To: {shipment.receiver.name}, {shipment.receiver.city}</p>
          </div>
        </div>
        <StatusBadge status={shipment.status} size="sm" />
      </div>
      <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
        <span className="uppercase font-medium text-gray-500">{shipment.provider}</span>
        {shipment.isCOD && (
          <span className="text-green-600 font-medium">COD: PKR {shipment.codAmount?.toLocaleString()}</span>
        )}
        <span>{formatDate(shipment.createdAt)}</span>
      </div>
    </div>
  );
};

export default ShipmentCard;
