import React, { useEffect } from 'react';
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
import { ArrowLeft, MapPin, Phone, User, Package } from 'lucide-react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-PK', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
    <p className="text-sm text-gray-800 font-medium">{value}</p>
  </div>
);

const ShipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current, loadingDetail, errorDetail, history, loadingHistory, loadingAction } = useAppSelector(
    (s) => s.shipments
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchShipmentRequest(id));
      dispatch(fetchShipmentHistoryRequest(id));
    }
  }, [id, dispatch]);

  const canCancel =
    current &&
    !['delivered', 'cancelled', 'failed'].includes(current.status);

  const handleCancel = () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to cancel this shipment?')) {
      dispatch(cancelShipmentRequest(id));
    }
  };

  if (loadingDetail) {
    return (
      <div className="flex justify-center py-20">
        <span className="spinner spinner-orange" style={{ width: 28, height: 28 }} />
      </div>
    );
  }

  if (errorDetail) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-lg text-sm">
        {errorDetail}
      </div>
    );
  }

  if (!current) return null;

  const sectionClass = 'bg-white border border-gray-200 rounded-lg p-5';

  return (
    <div className="max-w-4xl space-y-5">
      <button
        onClick={() => navigate(ROUTES.SHIPMENTS)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={16} /> Back to Shipments
      </button>

      {/* Header */}
      <div className={`${sectionClass} flex items-center justify-between`}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-base font-semibold text-gray-900">
              {current.providerTrackingNo || current._id.slice(-8).toUpperCase()}
            </h2>
            <StatusBadge status={current.status} />
          </div>
          <p className="text-xs text-gray-400">
            Provider: <span className="uppercase font-medium text-gray-500">{current.provider}</span>
            &nbsp;·&nbsp;Created: {formatDate(current.createdAt)}
            &nbsp;·&nbsp;Updated: {formatDate(current.updatedAt)}
          </p>
        </div>
        {canCancel && (
          <Button variant="danger" size="sm" loading={loadingAction} onClick={handleCancel}>
            Cancel Shipment
          </Button>
        )}
      </div>

      {/* Sender + Receiver */}
      <div className="grid grid-cols-2 gap-5">
        <div className={sectionClass}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Sender</p>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <User size={14} className="text-gray-400 mt-0.5" />
              <InfoRow label="Name" value={current.sender.name} />
            </div>
            <div className="flex items-start gap-2.5">
              <Phone size={14} className="text-gray-400 mt-0.5" />
              <InfoRow label="Phone" value={current.sender.phone} />
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="text-gray-400 mt-0.5" />
              <InfoRow label="Address" value={`${current.sender.address}, ${current.sender.city}`} />
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Receiver</p>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <User size={14} className="text-gray-400 mt-0.5" />
              <InfoRow label="Name" value={current.receiver.name} />
            </div>
            <div className="flex items-start gap-2.5">
              <Phone size={14} className="text-gray-400 mt-0.5" />
              <InfoRow label="Phone" value={current.receiver.phone} />
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="text-gray-400 mt-0.5" />
              <InfoRow label="Address" value={`${current.receiver.address}, ${current.receiver.city}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Package Info */}
      <div className={sectionClass}>
        <div className="flex items-center gap-2 mb-4">
          <Package size={16} className="text-orange-500" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Package Details</p>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <InfoRow label="Weight" value={`${current.weight} kg`} />
          <InfoRow label="Package Type" value={current.packageType} />
          <InfoRow
            label="COD"
            value={
              current.isCOD ? (
                <span className="text-green-600">PKR {current.codAmount?.toLocaleString()}</span>
              ) : (
                'No'
              )
            }
          />
          {current.codStatus && <InfoRow label="COD Status" value={current.codStatus} />}
        </div>
        {current.description && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <InfoRow label="Description" value={current.description} />
          </div>
        )}
        {current.notes && (
          <div className="mt-3">
            <InfoRow label="Notes" value={current.notes} />
          </div>
        )}
      </div>

      {/* Status Timeline */}
      <div className={sectionClass}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Status History</p>
        <StatusTimeline history={history} loading={loadingHistory} />
      </div>
    </div>
  );
};

export default ShipmentDetail;
