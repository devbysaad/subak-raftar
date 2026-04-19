import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchShipmentsRequest } from '@/redux/slice/shipmentsSlice';
import axiosInstance from '@/lib/axios';
import { API } from '@/constants/api';
import StatusBadge from '@/components/modules/shipments/StatusBadge';
import Button from '@/components/ui/Button';
import Navbar from '@/components/ui/Navbar';
import { ROUTES } from '@/constants/routes';
import {
  Package, CheckCircle2, XCircle, Truck, Clock,
  ArrowRight, TrendingUp, DollarSign, BarChart3,
} from 'lucide-react';

interface CourierStat {
  provider: string;
  totalBooked: number;
  totalDelivered: number;
  totalFailed: number;
  totalInTransit: number;
  deliveryRatio: number;
  returnRatio: number;
}

export default function DashboardHome() {
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();
  const { list, total, loading } = useAppSelector((s) => s.shipments);
  const [courierStats, setCourierStats] = useState<CourierStat[]>([]);

  useEffect(() => {
    dispatch(fetchShipmentsRequest({ limit: 10 }));
    axiosInstance.get(API.SHIPMENTS.ANALYTICS).then(res => {
      setCourierStats(res.data?.data || []);
    }).catch(() => {});
  }, [dispatch]);

  // Stats from loaded shipments — but use the total count from the store
  const delivered = list.filter(s => s.status === 'delivered').length;
  const inProcess = list.filter(s => ['received','in_transit','out_for_delivery'].includes(s.status)).length;
  const pending   = list.filter(s => s.status === 'booked').length;
  const returned  = list.filter(s => s.status === 'failed').length;
  const codTotal  = list.reduce((acc, s) => acc + (s.codAmount || 0), 0);

  const statCards = [
    { label: 'Total Shipments', value: total, icon: <Package size={20} />,       color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { label: 'Delivered',       value: delivered, icon: <CheckCircle2 size={20} />, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
    { label: 'In Transit',     value: inProcess, icon: <Truck size={20} />,        color: 'bg-orange-50 text-orange-600', border: 'border-orange-100' },
    { label: 'Pending',        value: pending, icon: <Clock size={20} />,          color: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-100' },
    { label: 'Returned/Failed',value: returned, icon: <XCircle size={20} />,       color: 'bg-red-50 text-red-500', border: 'border-red-100' },
    { label: 'COD Collected',  value: `Rs ${codTotal.toLocaleString()}`, icon: <DollarSign size={20} />, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
  ];

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-PK', { day: '2-digit', month: 'short' });
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f5]">
      <Navbar title="Dashboard" />

      <main className="p-6 space-y-6">

        {/* ── Welcome + Quick Actions ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Welcome Back 👋</h2>
            <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your shipments today.</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => navigate(ROUTES.BOOK_PARCEL)}>
              <Package size={14} /> Book Parcel
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigate(ROUTES.SHIPMENTS)}>
              View All Shipments <ArrowRight size={14} />
            </Button>
          </div>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map(s => (
            <div key={s.label} className={`bg-white rounded-xl border ${s.border} p-4 shadow-sm hover:shadow-md transition-shadow`}>
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                {s.icon}
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Courier Performance Summary ── */}
        {courierStats.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-green-600" />
                <h3 className="font-semibold text-sm text-gray-800">Courier Performance Overview</h3>
              </div>
              <button onClick={() => navigate(ROUTES.COURIER_PERFORMANCE)} className="text-xs text-green-600 hover:text-green-700 font-semibold flex items-center gap-1">
                View Details <ArrowRight size={12} />
              </button>
            </div>
            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              {courierStats.map(c => (
                <div key={c.provider} className="border border-gray-100 rounded-lg p-4">
                  <p className="font-bold text-sm text-gray-800 uppercase mb-3">{c.provider}</p>
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Delivery Rate</span>
                        <span className="font-bold text-green-600">{c.deliveryRatio.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full transition-all duration-700" style={{ width: `${c.deliveryRatio}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Return Rate</span>
                        <span className="font-bold text-red-500">{c.returnRatio.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 rounded-full transition-all duration-700" style={{ width: `${c.returnRatio}%` }} />
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400">{c.totalBooked} total · {c.totalDelivered} delivered</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Recent Shipments ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-600" />
              <h3 className="font-semibold text-sm text-gray-800">Recent Shipments</h3>
            </div>
            <button onClick={() => navigate(ROUTES.SHIPMENTS)} className="text-xs text-green-600 hover:text-green-700 font-semibold flex items-center gap-1">
              View All <ArrowRight size={12} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <span className="spinner spinner-green" style={{ width: 24, height: 24 }} />
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-12">
              <Package size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No shipments yet. Book your first parcel!</p>
              <Button size="sm" className="mt-3" onClick={() => navigate(ROUTES.BOOK_PARCEL)}>
                <Package size={14} /> Book Parcel
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Tracking No</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Receiver</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Courier</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">COD</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {list.slice(0, 10).map(s => (
                    <tr
                      key={s._id}
                      onClick={() => navigate(ROUTES.SHIPMENT_DETAIL(s._id))}
                      className="border-b border-gray-50 hover:bg-green-50/30 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                          {s.providerTrackingNo || s._id.slice(-8)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{s.receiver?.name}</p>
                        <p className="text-xs text-gray-400">{s.receiver?.city}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="uppercase text-[10px] font-bold bg-gray-700 text-white px-2 py-0.5 rounded">{s.provider}</span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3">
                        {s.codAmount ? (
                          <span className="text-green-700 text-xs font-semibold">Rs {s.codAmount.toLocaleString()}</span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{formatDate(s.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span className="text-green-600 text-xs font-semibold">View →</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
