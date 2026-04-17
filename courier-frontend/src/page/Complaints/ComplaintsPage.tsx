import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { API } from '@/constants/api';
import Button from '@/components/ui/Button';

interface Complaint { _id: string; parcelNo: string; status: string; remarks: string; rStatus: string; cStatus: string; createdAt: string; createdBy: { name: string } }

export default function ComplaintsPage() {
  const [form, setForm]     = useState({ parcelNo: '', status: 'open', remarks: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const [search, setSearch] = useState({ parcelNo: '', rStatus: '', cStatus: '', fromDate: '', toDate: '' });
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading]       = useState(false);
  const [searched, setSearched]     = useState(false);

  const statusOptions = ['open', 'in_progress', 'resolved', 'closed'];
  const fieldCls = "border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] focus:ring-1 focus:ring-green-500 focus:outline-none";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.post(API.COMPLAINTS.CREATE, form);
      setSubmitted(true);
      setForm({ parcelNo: '', status: 'open', remarks: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = Object.fromEntries(Object.entries(search).filter(([,v]) => v));
      const res = await axiosInstance.get(API.COMPLAINTS.LIST, { params });
      setComplaints(res.data?.data?.items ?? []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Complaint */}
      <div className="card p-5">
        <h2 className="font-semibold text-sm text-gray-700 mb-4">Add Complain</h2>
        {submitted && (
          <div className="mb-3 bg-green-50 border border-green-200 rounded p-2 text-sm font-medium text-green-700">
            ✓ Complaint submitted successfully.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Parcel No *</label>
              <input required className={fieldCls + ' w-full'} value={form.parcelNo} onChange={e => setForm(f => ({...f, parcelNo: e.target.value}))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Status</label>
              <select className={fieldCls + ' w-full'} value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Remarks</label>
            <textarea
              rows={3}
              className={fieldCls + ' w-full resize-none'}
              value={form.remarks}
              onChange={e => setForm(f => ({...f, remarks: e.target.value}))}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={submitting}>Submit Complain</Button>
          </div>
        </form>
      </div>

      {/* Search */}
      <div className="card p-5">
        <h2 className="font-semibold text-sm text-gray-700 mb-4">Complain Detail</h2>
        <div className="grid grid-cols-5 gap-3 mb-3">
          <input placeholder="Parcel No" className={fieldCls} value={search.parcelNo} onChange={e => setSearch(s => ({...s, parcelNo: e.target.value}))} />
          <select className={fieldCls} value={search.rStatus} onChange={e => setSearch(s => ({...s, rStatus: e.target.value}))}>
            <option value="">R-Status</option>
            {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
          </select>
          <select className={fieldCls} value={search.cStatus} onChange={e => setSearch(s => ({...s, cStatus: e.target.value}))}>
            <option value="">C-Status</option>
            {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
          </select>
          <input type="date" className={fieldCls} value={search.fromDate} onChange={e => setSearch(s => ({...s, fromDate: e.target.value}))} />
          <input type="date" className={fieldCls} value={search.toDate} onChange={e => setSearch(s => ({...s, toDate: e.target.value}))} />
        </div>
        <div className="flex justify-end mb-4">
          <Button onClick={handleSearch} loading={loading}>Search</Button>
        </div>
        {searched && (
          complaints.length === 0 ? (
            <p className="text-center text-red-500 font-medium py-4">No Record Found</p>
          ) : (
            <table className="tbl">
              <thead><tr><th>Parcel No</th><th>Status</th><th>R-Status</th><th>C-Status</th><th>Remarks</th><th>Date</th><th>By</th></tr></thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c._id}>
                    <td className="font-medium">{c.parcelNo}</td>
                    <td>{c.status}</td>
                    <td>{c.rStatus || '—'}</td>
                    <td>{c.cStatus || '—'}</td>
                    <td className="max-w-[200px] truncate text-gray-500 text-xs">{c.remarks}</td>
                    <td className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="text-xs">{c.createdBy?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}
