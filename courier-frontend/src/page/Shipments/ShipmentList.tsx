import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchShipmentsRequest, setFilters, resetFilters } from '@/redux/slice/shipmentsSlice';
import { ROUTES } from '@/constants/routes';
import type { ShipmentFilters as FiltersType, Shipment } from '@/redux/slice/shipmentsSlice';
import Table from '@/components/ui/Table';
import type { Column } from '@/components/ui/Table';
import StatusBadge from '@/components/modules/shipments/StatusBadge';
import Button from '@/components/ui/Button';
import Navbar from '@/components/ui/Navbar';
import { exportShipmentsToExcel } from '@/lib/excel';
import {
  Plus, ChevronLeft, ChevronRight, Search, Filter,
  Download, X, RefreshCw
} from 'lucide-react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'booked',           label: '📦 Booked' },
  { value: 'received',         label: '🏭 Received' },
  { value: 'in_transit',       label: '🚚 In Transit' },
  { value: 'out_for_delivery', label: '🛵 Out for Delivery' },
  { value: 'delivered',        label: '✅ Delivered' },
  { value: 'failed',           label: '❌ Failed' },
  { value: 'cancelled',        label: '🚫 Cancelled' },
];

const PROVIDER_OPTIONS = [
  { value: '', label: 'All Couriers' },
  { value: 'tcs',      label: 'TCS' },
  { value: 'leopards', label: 'Leopards' },
  { value: 'trax',     label: 'Trax' },
  { value: 'mp',       label: 'M&P' },
];

const ShipmentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, total, filters, loading } = useAppSelector((s) => s.shipments);
  const [searchInput, setSearchInput] = useState(filters.search);

  const fetchData = useCallback((f: Partial<FiltersType>) => {
    dispatch(fetchShipmentsRequest(f));
  }, [dispatch]);

  useEffect(() => {
    fetchData(filters);
  }, [filters]);

  const handleFilterChange = (changed: Partial<FiltersType>) => {
    dispatch(setFilters({ ...filters, ...changed, page: 1 }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[ShipmentList] 🔍 Searching for:', searchInput);
    handleFilterChange({ search: searchInput });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    handleFilterChange({ search: '' });
  };

  const handleReset = () => {
    setSearchInput('');
    dispatch(resetFilters());
  };

  const hasActiveFilters = filters.search || filters.status || filters.provider || filters.isCOD;

  const totalPages = Math.max(1, Math.ceil(total / filters.limit));

  const handleSaveSheet = () => {
    console.log('[ShipmentList] 💾 Exporting', list.length, 'shipments to Excel...');
    exportShipmentsToExcel(list, `shipments-page-${filters.page}.xlsx`);
  };

  const columns: Column<Shipment>[] = [
    {
      key: 'providerTrackingNo',
      header: 'Tracking No',
      render: (row) => (
        <span className="font-mono text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
          {row.providerTrackingNo || row._id.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'receiver',
      header: 'Receiver',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800 text-sm">{row.receiver.name}</p>
          <p className="text-xs text-gray-400">{row.receiver.phone} · {row.receiver.city}</p>
        </div>
      ),
    },
    {
      key: 'provider',
      header: 'Courier',
      render: (row) => (
        <span className="uppercase text-xs font-bold text-white bg-gray-700 px-2 py-0.5 rounded">
          {row.provider}
        </span>
      ),
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
          <span className="text-green-700 text-xs font-semibold bg-green-50 px-2 py-0.5 rounded">PKR {row.codAmount?.toLocaleString()}</span>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
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
          className="text-green-600 hover:text-green-700 text-xs font-semibold border border-green-200 hover:border-green-400 px-3 py-1 rounded-full transition-colors"
        >
          View →
        </button>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f5]">
      <Navbar title="Shipments" />

      <main className="p-6 space-y-4">

        {/* ── Search + Filters Card ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <Filter size={14} className="text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Search & Filter</span>
          </div>

          <div className="flex flex-wrap gap-3 items-end mt-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-64">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by tracking no, receiver name or phone…"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                />
                {searchInput && (
                  <button type="button" onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                    <X size={13} />
                  </button>
                )}
              </div>
              <Button type="submit" size="sm">
                <Search size={13} /> Search
              </Button>
            </form>

            {/* Status */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
              className="py-2 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
            >
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Provider */}
            <select
              value={filters.provider}
              onChange={(e) => handleFilterChange({ provider: e.target.value })}
              className="py-2 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
            >
              {PROVIDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* COD */}
            <select
              value={filters.isCOD}
              onChange={(e) => handleFilterChange({ isCOD: e.target.value })}
              className="py-2 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700"
            >
              <option value="">All (COD & Non-COD)</option>
              <option value="true">COD Only</option>
              <option value="false">Non-COD Only</option>
            </select>

            {/* Reset */}
            {hasActiveFilters && (
              <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-semibold border border-red-200 px-3 py-2 rounded-lg transition-colors">
                <RefreshCw size={12} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {/* Table header bar */}
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">{total.toLocaleString()} Shipments</span>
              {filters.status && (
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">{filters.status}</span>
              )}
              {filters.provider && (
                <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded-full uppercase">{filters.provider}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleSaveSheet} disabled={list.length === 0}>
                <Download size={13} /> Save to Excel
              </Button>
              <Button size="sm" onClick={() => navigate(ROUTES.BOOK_PARCEL)}>
                <Plus size={14} /> Book Parcel
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            data={list}
            keyExtractor={(r) => r._id}
            loading={loading}
            onRowClick={(row) => navigate(ROUTES.SHIPMENT_DETAIL(row._id))}
            emptyMessage="No shipments found. Try changing your filters or book a new parcel."
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                Page {filters.page} of {totalPages} · Showing {list.length} of {total}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary" size="sm"
                  disabled={filters.page <= 1}
                  onClick={() => dispatch(setFilters({ ...filters, page: filters.page - 1 }))}
                >
                  <ChevronLeft size={14} /> Prev
                </Button>
                <Button
                  variant="secondary" size="sm"
                  disabled={filters.page >= totalPages}
                  onClick={() => dispatch(setFilters({ ...filters, page: filters.page + 1 }))}
                >
                  Next <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ShipmentList;
