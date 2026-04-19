import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { API } from '@/constants/api';
import Navbar from '@/components/ui/Navbar';
import { Truck, CheckCircle2, XCircle, Package } from 'lucide-react';

interface CourierAnalytics {
  provider: string;
  totalBooked: number;
  totalDelivered: number;
  totalFailed: number;
  totalInTransit: number;
  deliveryRatio: number;
  returnRatio: number;
}

const CourierPerformance: React.FC = () => {
  const [data, setData] = useState<CourierAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(API.SHIPMENTS.ANALYTICS);
        setData(res.data?.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f5]">
        <Navbar title="Courier Performance" />
        <div className="flex-1 flex items-center justify-center">
          <span className="spinner spinner-green" style={{ width: 28, height: 28 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f5]">
        <Navbar title="Courier Performance" />
        <div className="p-6">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f5]">
      <Navbar title="Courier Performance" />

      <main className="p-6">
        <div className="mb-6 flex items-center gap-2">
          <Truck className="text-gray-500" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">Delivery & Return Analytics</h2>
        </div>

        {data.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No courier data available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map((courier) => (
              <div key={courier.provider} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h3 className="font-bold text-gray-800 uppercase tracking-wide">{courier.provider}</h3>
                  <div className="w-8 h-8 rounded bg-white shadow-sm border border-gray-200 flex items-center justify-center">
                    <Truck size={14} className="text-green-600" />
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Package size={12}/> Total</p>
                      <p className="text-xl font-semibold text-gray-800">{courier.totalBooked.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Truck size={12}/> Transit</p>
                      <p className="text-xl font-semibold text-orange-600">{courier.totalInTransit.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Delivery Bar */}
                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-green-500" /> Delivered
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        {courier.deliveryRatio.toFixed(1)}% <span className="text-xs font-normal text-gray-400">({courier.totalDelivered})</span>
                      </p>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${courier.deliveryRatio}%` }}
                      />
                    </div>
                  </div>

                  {/* Returns Bar */}
                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <XCircle size={12} className="text-red-400" /> Returned/Failed
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        {courier.returnRatio.toFixed(1)}% <span className="text-xs font-normal text-gray-400">({courier.totalFailed})</span>
                      </p>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-400 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${courier.returnRatio}%` }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CourierPerformance;
