import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useRedux';
import { ROUTES } from '@/constants/routes';
import CreateShipmentForm from '@/components/modules/shipments/CreateShipmentForm';
import { ArrowLeft } from 'lucide-react';

const ShipmentCreate: React.FC = () => {
  const navigate = useNavigate();
  const { list, loadingCreate } = useAppSelector((s) => s.shipments);
  const prevLoadingRef = useRef(false);

  // Detect successful creation: was loading, now not loading, list has items
  useEffect(() => {
    if (prevLoadingRef.current && !loadingCreate && list.length > 0) {
      navigate(ROUTES.SHIPMENT_DETAIL(list[0]._id), { replace: true });
    }
    prevLoadingRef.current = loadingCreate;
  }, [loadingCreate, list, navigate]);

  return (
    <div className="max-w-4xl">
      <button
        onClick={() => navigate(ROUTES.SHIPMENTS)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5"
      >
        <ArrowLeft size={16} /> Back to Shipments
      </button>
      <CreateShipmentForm />
    </div>
  );
};

export default ShipmentCreate;
