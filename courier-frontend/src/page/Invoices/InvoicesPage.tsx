import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { API } from '@/constants/api';
import Button from '@/components/ui/Button';
import Navbar from '@/components/ui/Navbar';
import { FileText, Search, Calendar, DollarSign, Package, CheckCircle2 } from 'lucide-react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ period: 'monthly', fromDate: '', toDate: '', invoiceNo: '', paymentStatus: '' });

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors';
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';

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

  function fmtDate(d: unknown) {
    if (!d) return '—';
    return new Date(String(d)).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f5]">
      <Navbar title="Invoices" />

      <main className="p-6 space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <FileText size={16} className="text-green-600" />
            <h3 className="font-semibold text-sm text-gray-800">Invoice Reports</h3>
          </div>

          {/* Filters */}
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <p className="text-sm text-gray-500 mb-4">
              View auto-generated invoices based on your shipment history. Filter by date range or payment status.
            </p>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="w-32">
                <label className={labelCls}>Period</label>
                <select className={inputCls} value={filters.period} onChange={e => setFilters(f => ({...f, period: e.target.value}))}>
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div className="w-40">
                <label className={labelCls}>Invoice No</label>
                <input placeholder="e.g. INV-0001" className={inputCls} value={filters.invoiceNo} onChange={e => setFilters(f => ({...f, invoiceNo: e.target.value}))} />
              </div>
              <div className="w-36">
                <label className={labelCls}><Calendar size={10} className="inline mr-1" />From Date</label>
                <input type="date" className={inputCls} value={filters.fromDate} onChange={e => setFilters(f => ({...f, fromDate: e.target.value}))} />
              </div>
              <div className="w-36">
                <label className={labelCls}><Calendar size={10} className="inline mr-1" />To Date</label>
                <input type="date" className={inputCls} value={filters.toDate} onChange={e => setFilters(f => ({...f, toDate: e.target.value}))} />
              </div>
              <div className="w-36">
                <label className={labelCls}>Payment Status</label>
                <select className={inputCls} value={filters.paymentStatus} onChange={e => setFilters(f => ({...f, paymentStatus: e.target.value}))}>
                  <option value="">All</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="paid">✅ Paid</option>
                </select>
              </div>
              <Button onClick={load} loading={loading} size="sm">
                <Search size={13} /> Search
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <span className="spinner spinner-green" style={{ width: 24, height: 24 }} />
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No invoices found for the selected period.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Invoice No</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Period</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">From</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">To</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">
                      <span className="flex items-center gap-1"><Package size={11} /> Parcels</span>
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">
                      <span className="flex items-center gap-1"><CheckCircle2 size={11} /> Delivered</span>
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">
                      <span className="flex items-center gap-1"><DollarSign size={11} /> COD Amount</span>
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">{String(inv.invoiceNo)}</span>
                      </td>
                      <td className="px-4 py-3 capitalize text-gray-600">{String(inv.period)}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{fmtDate(inv.fromDate)}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{fmtDate(inv.toDate)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-700">{String(inv.parcels)}</td>
                      <td className="px-4 py-3 font-semibold text-green-600">{String(inv.delivered)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">Rs {Number(inv.codAmount).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full text-xs px-2.5 py-0.5 font-semibold ${
                          inv.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {inv.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
