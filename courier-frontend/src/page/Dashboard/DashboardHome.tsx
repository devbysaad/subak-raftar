import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchShipmentsRequest } from '@/redux/slice/shipmentsSlice';
import StatusBadge from '@/components/modules/shipments/StatusBadge';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

const PROVIDERS = ['TCS', 'TRAX', 'LEOPARDS', 'MP', 'SELF'];
const STATUSES  = ['booked','received','in_transit','out_for_delivery','delivered','failed','cancelled'];

const PAKISTAN_CITIES = [
  'Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar','Quetta',
  'Sialkot','Gujranwala','Hyderabad','Bahawalpur','Abbottabad','Sukkur','Sargodha',
];

const PROVIDER_COLORS: Record<string, string> = {
  TCS: 'bg-red-600', TRAX: 'bg-green-600', LEOPARDS: 'bg-yellow-500',
  MP: 'bg-gray-900', SELF: 'bg-blue-600',
};

export default function DashboardHome() {
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();
  const { list, total, loading } = useAppSelector((s) => s.shipments);

  const [filters, setFilters] = useState({
    provider: '', parcelNo: '', city: '', status: '', orderRef: '',
    fromDate: '', toDate: '', name: '', address: '', phone: '', product: '', thirdParty: '',
  });

  useEffect(() => {
    dispatch(fetchShipmentsRequest({}));
  }, [dispatch]);

  const handleSearch = () => {
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    dispatch(fetchShipmentsRequest(params));
  };

  // Stats
  const delivered    = list.filter(s => s.status === 'delivered').length;
  const inProcess    = list.filter(s => ['received','in_transit','out_for_delivery'].includes(s.status)).length;
  const pending      = list.filter(s => s.status === 'booked').length;
  const returned     = list.filter(s => s.status === 'failed').length;
  const codTotal     = list.reduce((acc, s) => acc + (s.codAmount || 0), 0);
  const deliveredCOD = list.filter(s => s.status === 'delivered').reduce((acc, s) => acc + (s.codAmount || 0), 0);

  return (
    <div className="space-y-4">

      {/* Stats Row */}
      <div className="grid grid-cols-6 gap-3">
        {[
          { label: 'Delivered', count: delivered, amount: deliveredCOD },
          { label: 'Returned',  count: returned,  amount: 0 },
          { label: 'In Process',count: inProcess, amount: 0 },
          { label: 'Pending',   count: pending,   amount: 0 },
          { label: 'Ready For Return', count: 0,  amount: 0 },
          { label: 'Load Sheet', count: 0,         amount: 0 },
        ].map((stat) => (
          <div key={stat.label} className="card p-3">
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.count}</p>
            {stat.amount > 0 && (
              <p className="text-xs text-green-600 font-semibold">Rs {stat.amount.toLocaleString()}</p>
            )}
          </div>
        ))}
      </div>

      {/* Courier Ratio */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm text-gray-700">Courier Wise Return / Delivery Ratio</h2>
          <div className="flex items-center gap-2">
            <input type="date" className="border border-gray-300 rounded px-2 py-1 text-xs bg-[#fafaf5]" />
            <span className="text-xs text-gray-400">to</span>
            <input type="date" className="border border-gray-300 rounded px-2 py-1 text-xs bg-[#fafaf5]" />
            <Button size="sm">Search</Button>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {PROVIDERS.map((p) => (
            <div key={p} className={`${PROVIDER_COLORS[p]} rounded p-3 text-white text-center`}>
              <div className="flex justify-between text-[10px] opacity-80 mb-1">
                <span>RTN RATIO</span><span>DEL RATIO</span>
              </div>
              <p className="font-bold text-base">{p}</p>
              <div className="flex justify-between text-[10px] opacity-80 mt-1">
                <span>0%</span><span>0%</span>
              </div>
            </div>
          ))}
          <div className="bg-indigo-900 rounded p-3 text-white text-center">
            <div className="flex justify-between text-[10px] opacity-80 mb-1">
              <span>RTN RATIO</span><span>DEL RATIO</span>
            </div>
            <p className="font-bold text-base">Total</p>
            <div className="flex justify-between text-[10px] opacity-80 mt-1">
              <span>0%</span><span>0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Panel */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm text-gray-700">User Dashboard</h2>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-5 gap-3 mb-3">
          <select
            value={filters.provider}
            onChange={e => setFilters(f => ({ ...f, provider: e.target.value }))}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none"
          >
            <option value="">Select Courier</option>
            {PROVIDERS.map(p => <option key={p} value={p.toLowerCase()}>{p}</option>)}
          </select>
          <input
            placeholder="Parcel No"
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none"
            value={filters.parcelNo}
            onChange={e => setFilters(f => ({ ...f, parcelNo: e.target.value }))}
          />
          <select
            value={filters.city}
            onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none"
          >
            <option value="">Consignee City</option>
            {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none"
          >
            <option value="">Parcel Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
          </select>
          <input
            placeholder="Order Ref"
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none"
            value={filters.orderRef}
            onChange={e => setFilters(f => ({ ...f, orderRef: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-5 gap-3 mb-3">
          <input type="date" className="border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] focus:ring-1 focus:ring-green-500 focus:outline-none" value={filters.fromDate} onChange={e => setFilters(f => ({...f, fromDate: e.target.value}))} />
          <input type="date" className="border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] focus:ring-1 focus:ring-green-500 focus:outline-none" value={filters.toDate} onChange={e => setFilters(f => ({...f, toDate: e.target.value}))} />
          <input placeholder="Consignee Name" className="border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] focus:ring-1 focus:ring-green-500 focus:outline-none" value={filters.name} onChange={e => setFilters(f => ({...f, name: e.target.value}))} />
          <input placeholder="Consignee Address" className="border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] focus:ring-1 focus:ring-green-500 focus:outline-none" value={filters.address} onChange={e => setFilters(f => ({...f, address: e.target.value}))} />
          <input placeholder="Consignee Cell" className="border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] focus:ring-1 focus:ring-green-500 focus:outline-none" value={filters.phone} onChange={e => setFilters(f => ({...f, phone: e.target.value}))} />
        </div>
        <div className="grid grid-cols-5 gap-3 mb-4">
          <input placeholder="Product Detail" className="border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] focus:ring-1 focus:ring-green-500 focus:outline-none" value={filters.product} onChange={e => setFilters(f => ({...f, product: e.target.value}))} />
          <input placeholder="ThirdParty No" className="border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] focus:ring-1 focus:ring-green-500 focus:outline-none" value={filters.thirdParty} onChange={e => setFilters(f => ({...f, thirdParty: e.target.value}))} />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Button onClick={handleSearch} loading={loading}>Search</Button>
          <Button variant="secondary" size="md">Print Selected</Button>
          <Button variant="secondary" size="md">Cancel Selected</Button>
          <Button variant="secondary" size="md">Generate Load Sheet</Button>
          <Button variant="secondary" size="md">Generate Excel</Button>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Parcel No</th>
                <th>Consignee Name</th>
                <th>City</th>
                <th>Status</th>
                <th>Provider</th>
                <th>COD Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center py-8"><span className="spinner spinner-green inline-block" style={{width:20,height:20}} /></td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-8 text-gray-400">No records found.</td></tr>
              ) : (
                list.map(s => (
                  <tr key={s._id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <button
                        onClick={() => navigate(ROUTES.SHIPMENT_DETAIL(s._id))}
                        className="text-green-600 hover:underline font-medium text-xs"
                      >
                        {s.providerTrackingNo || s._id.slice(-8)}
                      </button>
                    </td>
                    <td>{s.receiver?.name || '—'}</td>
                    <td>{s.receiver?.city || '—'}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td className="uppercase text-xs">{s.provider}</td>
                    <td>{s.codAmount ? `Rs ${s.codAmount.toLocaleString()}` : '—'}</td>
                    <td className="text-xs text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="text-xs text-blue-600 hover:underline" onClick={() => navigate(ROUTES.SHIPMENT_DETAIL(s._id))}>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {total > 0 && (
          <p className="text-xs text-gray-400 mt-2 text-right">Showing {list.length} of {total} records</p>
        )}
      </div>
    </div>
  );
}
