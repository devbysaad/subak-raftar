import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { API } from '@/constants/api';
import Button from '@/components/ui/Button';

interface Sheet { _id: string; loadSheetNo: string; createdAt: string; parcelIds: unknown[]; createdBy: { name: string } }

export default function LoadSheetPage() {
  const [parcelInput, setParcelInput] = useState('');
  const [parcelList, setParcelList]   = useState<string[]>([]);
  const [creating, setCreating]       = useState(false);
  const [lastSheet, setLastSheet]     = useState<Sheet | null>(null);

  const [sheets, setSheets]   = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch]   = useState({ loadSheetNo: '', fromDate: '', toDate: '' });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && parcelInput.trim()) {
      e.preventDefault();
      setParcelList(l => [...l, parcelInput.trim()]);
      setParcelInput('');
    }
  };

  const removeParcel = (i: number) => setParcelList(l => l.filter((_, idx) => idx !== i));

  const generateSheet = async () => {
    if (parcelList.length === 0) return;
    setCreating(true);
    try {
      const res = await axiosInstance.post(API.LOAD_SHEETS.CREATE, { parcelIds: parcelList });
      setLastSheet(res.data?.data);
      setParcelList([]);
    } finally {
      setCreating(false);
    }
  };

  const loadSheets = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(search).filter(([,v]) => v));
      const res = await axiosInstance.get(API.LOAD_SHEETS.LIST, { params });
      setSheets(res.data?.data?.items ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSheets(); }, []);

  const fieldCls = "border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] focus:ring-1 focus:ring-green-500 focus:outline-none";

  return (
    <div className="space-y-4">
      {/* Create */}
      <div className="card p-5">
        <h2 className="font-semibold text-sm text-gray-700 mb-3">Enter Parcel Here!</h2>

        {lastSheet && (
          <div className="mb-3 bg-green-50 border border-green-200 rounded p-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-green-700">
              ✓ Load Sheet Created: <span className="font-bold">{lastSheet.loadSheetNo}</span>
            </p>
            <Button size="sm" variant="secondary">Print</Button>
          </div>
        )}

        <div className="flex gap-2 mb-3">
          <input
            className={`${fieldCls} flex-1 text-base`}
            placeholder="Type parcel number and press Enter..."
            value={parcelInput}
            onChange={e => setParcelInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button variant="secondary" onClick={() => setParcelList([])}>Clear All</Button>
        </div>

        {parcelList.length > 0 && (
          <div className="border border-gray-200 rounded p-3 mb-3 space-y-1 max-h-48 overflow-y-auto">
            {parcelList.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="font-mono text-gray-700">{i + 1}. {p}</span>
                <button onClick={() => removeParcel(i)} className="text-red-400 hover:text-red-600 text-xs font-bold">✕</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">{parcelList.length} parcel(s) added</p>
          <Button onClick={generateSheet} loading={creating} disabled={parcelList.length === 0}>
            Generate Load Sheet
          </Button>
        </div>
      </div>

      {/* Report */}
      <div className="card p-5">
        <h2 className="font-semibold text-sm text-gray-700 mb-3">Report Load Sheet</h2>
        <div className="flex gap-3 mb-4">
          <input placeholder="Load Sheet No" className={fieldCls} value={search.loadSheetNo} onChange={e => setSearch(s => ({...s, loadSheetNo: e.target.value}))} />
          <input type="date" className={fieldCls} value={search.fromDate} onChange={e => setSearch(s => ({...s, fromDate: e.target.value}))} />
          <input type="date" className={fieldCls} value={search.toDate} onChange={e => setSearch(s => ({...s, toDate: e.target.value}))} />
          <Button onClick={loadSheets} loading={loading}>Search</Button>
        </div>

        <table className="tbl">
          <thead><tr><th>Load Sheet No</th><th>Date</th><th>Parcels</th><th>Created By</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8"><span className="spinner spinner-green inline-block" style={{width:20,height:20}} /></td></tr>
            ) : sheets.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-6 text-red-500 font-medium">No Record Found</td></tr>
            ) : sheets.map(s => (
              <tr key={s._id}>
                <td className="text-green-600 font-medium">{s.loadSheetNo}</td>
                <td className="text-xs text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                <td>{s.parcelIds.length}</td>
                <td>{s.createdBy?.name}</td>
                <td><Button size="sm" variant="secondary">Print</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
