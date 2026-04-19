import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { API } from '@/constants/api';
import Button from '@/components/ui/Button';
import Navbar from '@/components/ui/Navbar';
import { CheckCircle2, AlertCircle, MessageSquare, Search, Calendar } from 'lucide-react';

interface Complaint {
  _id: string;
  parcelNo: string;
  status: string;
  remarks: string;
  rStatus: string;
  cStatus: string;
  createdAt: string;
  createdBy: { name: string };
}

export default function ComplaintsPage() {
  const [form, setForm]     = useState({ parcelNo: '', status: 'open', remarks: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const [search, setSearch] = useState({ parcelNo: '', rStatus: '', cStatus: '', fromDate: '', toDate: '', page: 1 });
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(false);
  const [searched, setSearched]     = useState(false);

  const statusOptions = ['open', 'in_progress', 'resolved', 'closed'];
  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors';
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';

  const statusLabel = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const statusColor = (s: string) => {
    if (s === 'open') return 'bg-red-100 text-red-700';
    if (s === 'in_progress') return 'bg-yellow-100 text-yellow-700';
    if (s === 'resolved') return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-600';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.post(API.COMPLAINTS.CREATE, form);
      setSubmitted(true);
      setForm({ parcelNo: '', status: 'open', remarks: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearch = async (override?: Partial<typeof search>) => {
    setLoading(true);
    setSearched(true);
    try {
      const currentSearch = { ...search, ...override };
      const params = Object.fromEntries(Object.entries(currentSearch).filter(([,v]) => v));
      const res = await axiosInstance.get(API.COMPLAINTS.LIST, { params });
      setComplaints(res.data?.data?.items ?? []);
      setTotalPages(res.data?.data?.pages ?? 1);
      setTotal(res.data?.data?.total ?? 0);
    } finally {
      setLoading(false);
    }
  };

  // Load complaints on mount
  useEffect(() => { handleSearch(); }, []);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f5]">
      <Navbar title="Complaints" />

      <main className="p-6 space-y-5">

        {/* ── Add Complaint ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <MessageSquare size={16} className="text-green-600" />
            <h3 className="font-semibold text-sm text-gray-800">Submit a New Complaint</h3>
          </div>
          <div className="p-5">
            <p className="text-sm text-gray-500 mb-4">
              Enter the tracking number of the parcel you have an issue with. Our team will investigate and update you.
            </p>

            {submitted && (
              <div className="mb-4 flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-semibold text-green-800">Complaint Submitted!</p>
                  <p className="text-sm text-green-700 mt-0.5">We'll review it and update the status shortly.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCls}>Tracking / Parcel Number <span className="text-red-500">*</span></label>
                  <input required placeholder="e.g. TCS12345678" className={inputCls} value={form.parcelNo} onChange={e => setForm(f => ({...f, parcelNo: e.target.value}))} />
                </div>
                <div>
                  <label className={labelCls}>Complaint Status</label>
                  <select className={inputCls} value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                    {statusOptions.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className={labelCls}>What's the Issue? (Describe your complaint)</label>
                <textarea
                  rows={3}
                  placeholder="Describe what happened — e.g. Customer says they were home but courier marked as failed..."
                  className={`${inputCls} resize-none`}
                  value={form.remarks}
                  onChange={e => setForm(f => ({...f, remarks: e.target.value}))}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" loading={submitting}>
                  <MessageSquare size={14} /> Submit Complaint
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* ── Search Existing Complaints ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Search size={16} className="text-green-600" />
            <h3 className="font-semibold text-sm text-gray-800">Search Complaints</h3>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-3 mb-4 items-end">
              <div className="flex-1 min-w-48">
                <label className={labelCls}>Tracking Number</label>
                <input placeholder="Search by parcel number..." className={inputCls} value={search.parcelNo} onChange={e => setSearch(s => ({...s, parcelNo: e.target.value}))} />
              </div>
              <div className="w-40">
                <label className={labelCls}>Resolution Status</label>
                <select className={inputCls} value={search.rStatus} onChange={e => setSearch(s => ({...s, rStatus: e.target.value}))}>
                  <option value="">All</option>
                  {statusOptions.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
                </select>
              </div>
              <div className="w-40">
                <label className={labelCls}>Complaint Status</label>
                <select className={inputCls} value={search.cStatus} onChange={e => setSearch(s => ({...s, cStatus: e.target.value}))}>
                  <option value="">All</option>
                  {statusOptions.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
                </select>
              </div>
              <div className="w-36">
                <label className={labelCls}><Calendar size={10} className="inline mr-1" />From Date</label>
                <input type="date" className={inputCls} value={search.fromDate} onChange={e => setSearch(s => ({...s, fromDate: e.target.value}))} />
              </div>
              <div className="w-36">
                <label className={labelCls}><Calendar size={10} className="inline mr-1" />To Date</label>
                <input type="date" className={inputCls} value={search.toDate} onChange={e => setSearch(s => ({...s, toDate: e.target.value}))} />
              </div>
              <Button onClick={() => { setSearch(s => ({ ...s, page: 1 })); handleSearch({ page: 1 }); }} loading={loading} size="sm">
                <Search size={13} /> Search
              </Button>
            </div>

            {/* Results */}
            {searched && (
              complaints.length === 0 ? (
                <div className="text-center py-10 border border-gray-100 rounded-lg bg-gray-50">
                  <AlertCircle size={28} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No complaints found matching your search.</p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Tracking No</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Resolution</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Remarks</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Created By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map(c => (
                        <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{c.parcelNo}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(c.status)}`}>
                              {statusLabel(c.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {c.rStatus ? (
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(c.rStatus)}`}>
                                {statusLabel(c.rStatus)}
                              </span>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 max-w-[220px] truncate text-gray-600 text-xs">{c.remarks || '—'}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                          <td className="px-4 py-3 text-xs text-gray-600">{c.createdBy?.name || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        Page {search.page} of {totalPages} · {total} complaints
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary" size="sm"
                          disabled={search.page <= 1}
                          onClick={() => {
                            const newPage = search.page - 1;
                            setSearch(s => ({ ...s, page: newPage }));
                            handleSearch({ page: newPage });
                          }}
                        >
                          Prev
                        </Button>
                        <Button
                          variant="secondary" size="sm"
                          disabled={search.page >= totalPages}
                          onClick={() => {
                            const newPage = search.page + 1;
                            setSearch(s => ({ ...s, page: newPage }));
                            handleSearch({ page: newPage });
                          }}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
