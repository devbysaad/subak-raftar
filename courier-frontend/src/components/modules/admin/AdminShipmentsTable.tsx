import React, { useState } from 'react';
import type { Shipment, ShipmentStatus } from '@/redux/slice/shipmentsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { updateShipmentStatusRequest } from '@/redux/slice/shipmentsSlice';
import Table from '@/components/ui/Table';
import StatusBadge from '@/components/modules/shipments/StatusBadge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import type { Column } from '@/components/ui/Table';

const STATUSES: ShipmentStatus[] = [
  'booked', 'received', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'cancelled',
];

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  booked: 'Booked', received: 'Received', in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered', failed: 'Failed', cancelled: 'Cancelled',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
}

const AdminShipmentsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading, loadingAction } = useAppSelector((s) => s.shipments);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [newStatus, setNewStatus] = useState<ShipmentStatus>('booked');
  const [note, setNote] = useState('');

  const openUpdateModal = (shipment: Shipment) => {
    setSelected(shipment);
    setNewStatus(shipment.status);
    setNote('');
    setModalOpen(true);
  };

  const handleUpdate = () => {
    if (!selected) return;
    dispatch(updateShipmentStatusRequest({ id: selected._id, status: newStatus, note }));
    setModalOpen(false);
  };

  const selectClass =
    'px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-400 bg-white';

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
          <span className="text-green-600 text-xs font-medium">
            PKR {row.codAmount?.toLocaleString()}
          </span>
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
      header: 'Actions',
      render: (row) => (
        <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); openUpdateModal(row); }}>
          Update Status
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <Table
          columns={columns}
          data={list}
          keyExtractor={(r) => r._id}
          loading={loading}
          emptyMessage="No shipments found."
        />
      </div>

      {/* Update Status Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Update Shipment Status">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Tracking: <span className="font-medium text-gray-700">{selected?.providerTrackingNo || selected?._id.slice(-8).toUpperCase()}</span></p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ShipmentStatus)}
              className={`${selectClass} py-2 text-sm`}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Note (optional)</label>
            <textarea
              value={note} onChange={(e) => setNote(e.target.value)}
              rows={3} placeholder="Add a note about this status update…"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} loading={loadingAction}>Update</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminShipmentsTable;
