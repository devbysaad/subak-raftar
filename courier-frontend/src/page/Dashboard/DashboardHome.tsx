import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchShipmentsRequest } from '@/redux/slice/shipmentsSlice';
import { ROUTES } from '@/constants/routes';
import StatsCard from '@/components/modules/dashboard/StatsCard';
import Table from '@/components/ui/Table';
import StatusBadge from '@/components/modules/shipments/StatusBadge';
import type { Shipment } from '@/redux/slice/shipmentsSlice';
import type { Column } from '@/components/ui/Table';
import { Package, CheckCircle, Clock, DollarSign } from 'lucide-react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
}

const DashboardHome: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, total, loading } = useAppSelector((s) => s.shipments);

  useEffect(() => {
    dispatch(fetchShipmentsRequest({ page: 1, limit: 50 }));
  }, [dispatch]);

  const delivered = list.filter((s) => s.status === 'delivered').length;
  const pending = list.filter((s) => !['delivered', 'cancelled', 'failed'].includes(s.status)).length;
  const cod = list.filter((s) => s.isCOD).length;
  const recent = [...list].slice(0, 10);

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
      key: 'createdAt',
      header: 'Date',
      render: (row) => <span className="text-gray-500 text-xs">{formatDate(row.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          title="Total Shipments"
          value={total || list.length}
          icon={<Package size={22} />}
          color="orange"
        />
        <StatsCard
          title="Delivered"
          value={delivered}
          icon={<CheckCircle size={22} />}
          color="green"
        />
        <StatsCard
          title="Pending"
          value={pending}
          icon={<Clock size={22} />}
          color="blue"
        />
        <StatsCard
          title="COD Shipments"
          value={cod}
          icon={<DollarSign size={22} />}
          color="gray"
        />
      </div>

      {/* Recent table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Recent Shipments</h2>
        </div>
        <Table
          columns={columns}
          data={recent}
          keyExtractor={(r) => r._id}
          loading={loading}
          onRowClick={(row) => navigate(ROUTES.SHIPMENT_DETAIL(row._id))}
          emptyMessage="No shipments yet."
        />
      </div>
    </div>
  );
};

export default DashboardHome;
