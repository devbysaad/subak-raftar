import React, { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchShipmentsRequest, setFilters } from '@/redux/slice/shipmentsSlice';
import type { ShipmentFilters as ShipmentFiltersType } from '@/redux/slice/shipmentsSlice';
import AdminShipmentsTable from '@/components/modules/admin/AdminShipmentsTable';
import ShipmentFilters from '@/components/modules/shipments/ShipmentFilters';
import Button from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters, total } = useAppSelector((s) => s.shipments);

  const fetchData = useCallback(
    (f: Partial<ShipmentFiltersType>) => {
      dispatch(fetchShipmentsRequest(f));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchData(filters);
  }, [filters]);

  const handleFilterChange = (changed: Partial<ShipmentFiltersType>) => {
    const next = { ...filters, ...changed };
    dispatch(setFilters(next));
  };

  const totalPages = Math.max(1, Math.ceil(total / filters.limit));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <ShipmentFilters filters={filters} onChange={handleFilterChange} />
        <span className="text-sm text-gray-500 flex-shrink-0">{total} total shipments</span>
      </div>

      <AdminShipmentsTable />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
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
  );
};

export default AdminDashboard;
