import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { API } from '@/constants/api';
import Button from '@/components/ui/Button';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ period: 'monthly', fromDate: '', toDate: '', invoiceNo: '', paymentStatus: '' });

  const load = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([,v]) => v));
      const res = await axiosInstance.get(API.INVOICES.LIST, { params });
      setInvoices(res.data?.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const fieldCls = "border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] focus:ring-1 focus:ring-green-500 focus:outline-none";

  return (
    <div className="card p-5">
      <h2 className="font-semibold text-sm text-gray-700 mb-4">View Invoices</h2>

      {/* Filters */}
      <div className="grid grid-cols-5 gap-3 mb-3">
        <select className={fieldCls} value={filters.period} onChange={e => setFilters(f => ({...f, period: e.target.value}))}>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
        <input placeholder="Invoice No" className={fieldCls} value={filters.invoiceNo} onChange={e => setFilters(f => ({...f, invoiceNo: e.target.value}))} />
        <input type="date" className={fieldCls} value={filters.fromDate} onChange={e => setFilters(f => ({...f, fromDate: e.target.value}))} />
        <input type="date" className={fieldCls} value={filters.toDate} onChange={e => setFilters(f => ({...f, toDate: e.target.value}))} />
        <select className={fieldCls} value={filters.paymentStatus} onChange={e => setFilters(f => ({...f, paymentStatus: e.target.value}))}>
          <option value="">Payment Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>
      <div className="flex justify-end mb-4">
        <Button onClick={load} loading={loading}>Search</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th>Invoice No</th><th>Period</th><th>From</th><th>To</th>
              <th>Parcels</th><th>Delivered</th><th>COD Amount</th><th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8"><span className="spinner spinner-green inline-block" style={{width:20,height:20}} /></td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-red-500 font-medium">No Record Found</td></tr>
            ) : invoices.map((inv: Record<string, unknown>, i) => (
              <tr key={i}>
                <td className="text-green-600 font-medium">{String(inv.invoiceNo)}</td>
                <td className="capitalize">{String(inv.period)}</td>
                <td>{inv.fromDate ? new Date(String(inv.fromDate)).toLocaleDateString() : '—'}</td>
                <td>{inv.toDate ? new Date(String(inv.toDate)).toLocaleDateString() : '—'}</td>
                <td>{String(inv.parcels)}</td>
                <td>{String(inv.delivered)}</td>
                <td>Rs {Number(inv.codAmount).toLocaleString()}</td>
                <td>
                  <span className={`rounded-full text-xs px-2 py-0.5 font-medium ${
                    inv.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {String(inv.paymentStatus)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
