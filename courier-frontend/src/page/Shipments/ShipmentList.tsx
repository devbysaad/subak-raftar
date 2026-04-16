import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchShipmentsRequest, setFilters } from '@/redux/slice/shipmentsSlice';
import { ROUTES } from '@/constants/routes';
import type { ShipmentFilters as FiltersType, Shipment } from '@/redux/slice/shipmentsSlice';
import Table from '@/components/ui/Table';
import type { Column } from '@/components/ui/Table';
import StatusBadge from '@/components/modules/shipments/StatusBadge';
import ShipmentFilters from '@/components/modules/shipments/ShipmentFilters';
import Button from '@/components/ui/Button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
}

const ShipmentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, total, filters, loading } = useAppSelector((s) => s.shipments);

  const fetchData = useCallback(
    (f: Partial<FiltersType>) => {
      dispatch(fetchShipmentsRequest(f));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchData(filters);
  }, [filters]);

  const handleFilterChange = (changed: Partial<FiltersType>) => {
    const next = { ...filters, ...changed };
    dispatch(setFilters(next));
  };

  const totalPages = Math.max(1, Math.ceil(total / filters.limit));

  const columns: Column<Shipment>[] = [
    {
      key: 'providerTrackingNo',
      header: 'Tracking No',
      render: (row) => (
        <span className="font-mono text-xs font-medium text-gray-700">
          {row.providerTrackingNo || row._id.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'receiver',
      header: 'Receiver',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">{row.receiver.name}</p>
          <p className="text-xs text-gray-400">{row.receiver.city}</p>
        </div>
      ),
    },
    {
      key: 'provider',
      header: 'Provider',
      render: (row) => <span className="uppercase text-xs font-semibold text-gray-500">{row.provider}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'isCOD',
      header: 'COD',
      render: (row) =>
        row.isCOD ? (
          <span className="text-green-600 text-xs font-medium">PKR {row.codAmount?.toLocaleString()}</span>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (row) => <span className="text-gray-500 text-xs">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          onClick={(e) => { e.stopPropagation(); navigate(ROUTES.SHIPMENT_DETAIL(row._id)); }}
          className="text-orange-500 hover:text-orange-600 text-xs font-medium"
        >
          View →
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <ShipmentFilters filters={filters} onChange={handleFilterChange} />
        <Button
          onClick={() => navigate(ROUTES.SHIPMENT_CREATE)}
          className="flex-shrink-0"
        >
          <Plus size={16} />
          Create Shipment
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">{total} shipment{total !== 1 ? 's' : ''}</span>
        </div>
        <Table
          columns={columns}
          data={list}
          keyExtractor={(r) => r._id}
          loading={loading}
          onRowClick={(row) => navigate(ROUTES.SHIPMENT_DETAIL(row._id))}
          emptyMessage="No shipments found."
        />
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Page {filters.page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={filters.page <= 1}
                onClick={() => handleFilterChange({ page: filters.page - 1 })}
              >
                <ChevronLeft size={14} /> Prev
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={filters.page >= totalPages}
                onClick={() => handleFilterChange({ page: filters.page + 1 })}
              >
                Next <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentList;
