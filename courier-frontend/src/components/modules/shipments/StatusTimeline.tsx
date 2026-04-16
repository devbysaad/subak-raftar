import React from 'react';
import type { ShipmentHistory } from '@/redux/slice/shipmentsSlice';
import StatusBadge from './StatusBadge';

interface StatusTimelineProps {
  history: ShipmentHistory[];
  loading?: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ history, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <span className="spinner spinner-orange" style={{ width: 20, height: 20 }} />
      </div>
    );
  }

  if (!history.length) {
    return <p className="text-sm text-gray-400 py-4">No history available.</p>;
  }

  return (
    <ol className="relative border-l border-gray-200 ml-3">
      {history.map((entry, idx) => (
        <li key={entry._id || idx} className="mb-6 ml-5">
          <span className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-orange-400 border-2 border-white" />
          <div className="flex flex-col gap-1">
            <StatusBadge status={entry.status} size="sm" />
            {entry.note && <p className="text-sm text-gray-600">{entry.note}</p>}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{formatDate(entry.createdAt)}</span>
              {entry.updatedByName && (
                <>
                  <span>·</span>
                  <span>{entry.updatedByName}</span>
                </>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default StatusTimeline;
