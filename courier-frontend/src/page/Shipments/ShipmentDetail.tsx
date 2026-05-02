import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
  fetchShipmentRequest,
  fetchShipmentHistoryRequest,
  cancelShipmentRequest,
} from '@/redux/slice/shipmentsSlice';
import { ROUTES } from '@/constants/routes';
import StatusBadge from '@/components/modules/shipments/StatusBadge';
import StatusTimeline from '@/components/modules/shipments/StatusTimeline';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Navbar from '@/components/ui/Navbar';
import { ArrowLeft, MapPin, Phone, User, Package, XCircle, Truck, DollarSign } from 'lucide-react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-PK', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const InfoRow: React.FC<{ label: string; value: React.ReactNode; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex items-start gap-2.5">
    {icon && <span className="text-gray-400 mt-0.5 shrink-0">{icon}</span>}
    <div>
      <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  </div>
);

const ShipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current, loadingDetail, errorDetail, history, loadingHistory, loadingAction } = useAppSelector(
    (s) => s.shipments
  );

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchShipmentRequest(id));
      dispatch(fetchShipmentHistoryRequest(id));
    }
  }, [id, dispatch]);

  const canCancel =
    current &&
    !['delivered', 'cancelled', 'failed'].includes(current.status);

  const handleCancelConfirm = () => {
    if (!id) return;
    dispatch(cancelShipmentRequest(id));
    setShowCancelDialog(false);
  };

  if (loadingDetail) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f5]">
        <Navbar title="Shipment Details" />
        <div className="flex-1 flex items-center justify-center">
          <span className="spinner spinner-green" style={{ width: 28, height: 28 }} />
        </div>
      </div>
    );
  }

  if (errorDetail) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f5]">
        <Navbar title="Shipment Details" />
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-lg text-sm">
            {errorDetail}
          </div>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const sectionClass = 'bg-white border border-gray-200 rounded-xl p-5 shadow-sm';

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f5]">
      <Navbar title="Shipment Details" />

      <main className="p-6 max-w-5xl space-y-5">
        {/* Back link */}
        <button
          onClick={() => navigate(ROUTES.SHIPMENTS)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Back to Shipments
        </button>

        {/* ── Header Card ── */}
        <div className={`${sectionClass} flex items-center justify-between flex-wrap gap-4`}>
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h2 className="text-lg font-bold text-gray-900 font-mono">
                {current.providerTrackingNo || current._id.slice(-8).toUpperCase()}
              </h2>
              <StatusBadge status={current.status} />
            </div>
            <p className="text-xs text-gray-400 flex flex-wrap gap-x-3 gap-y-1">
              <span>Courier: <span className="uppercase font-semibold text-gray-600">{current.provider}</span></span>
              <span>Created: {formatDate(current.createdAt)}</span>
              <span>Updated: {formatDate(current.updatedAt)}</span>
            </p>
          </div>
          {canCancel && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowCancelDialog(true)}
            >
              <XCircle size={14} /> Cancel Shipment
            </Button>
          )}
        </div>

        {/* ── Info Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Receiver */}
          <div className={sectionClass}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Receiver</h3>
            <div className="space-y-4">
              <InfoRow icon={<User size={14} />} label="Name" value={current.receiver?.name ?? '—'} />
              <InfoRow icon={<Phone size={14} />} label="Phone" value={current.receiver?.phone ?? '—'} />
              <InfoRow icon={<MapPin size={14} />} label="Address" value={`${current.receiver?.address ?? ''}, ${current.receiver?.city ?? ''}`} />
            </div>
          </div>

          {/* Package Details */}
          <div className={sectionClass}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Package Details</h3>
            <div className="space-y-4">
              <InfoRow icon={<Package size={14} />} label="Item Type" value={current.itemType ?? '—'} />
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Weight" value={`${current.weight} kg`} />
                <InfoRow label="Quantity" value={current.quantity ?? 1} />
              </div>
              <InfoRow
                icon={<DollarSign size={14} />}
                label="COD"
                value={
                  current.isCOD ? (
                    <span className="text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded">PKR {current.codAmount?.toLocaleString()}</span>
                  ) : (
                    <span className="text-gray-400">Not COD</span>
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Special Instruction / Notes */}
        {(current.specialInstruction || current.notes) && (
          <div className={sectionClass}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Notes</h3>
            {current.specialInstruction && (
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold text-gray-500">Special Instruction:</span> {current.specialInstruction}
              </p>
            )}
            {current.notes && (
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-500">Notes:</span> {current.notes}
              </p>
            )}
          </div>
        )}

        {/* ── Status Timeline ── */}
        <div className={sectionClass}>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Status History</h3>
          <StatusTimeline history={history} loading={loadingHistory} />
        </div>
      </main>

      {/* ── Cancel Confirmation Popup ── */}
      <ConfirmDialog
        open={showCancelDialog}
        title="Cancel This Shipment?"
        message={`You are about to cancel shipment ${current.providerTrackingNo || current._id.slice(-8).toUpperCase()}. This action cannot be undone. The courier provider will be notified and the shipment will be marked as cancelled.`}
        confirmLabel="Yes, Cancel Shipment"
        cancelLabel="Go Back"
        variant="danger"
        loading={loadingAction}
        onConfirm={handleCancelConfirm}
        onCancel={() => setShowCancelDialog(false)}
      />
    </div>
  );
};

export default ShipmentDetail;
