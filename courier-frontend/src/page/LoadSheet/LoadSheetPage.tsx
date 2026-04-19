import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { API } from '@/constants/api';
import Button from '@/components/ui/Button';
import Navbar from '@/components/ui/Navbar';
import { FileSpreadsheet, Plus, Trash2, Printer, Search, Calendar, CheckCircle2, Package } from 'lucide-react';

interface Sheet {
  _id: string;
  loadSheetNo: string;
  createdAt: string;
  parcelIds: unknown[];
  createdBy: { name: string };
}

export default function LoadSheetPage() {
  const [parcelInput, setParcelInput] = useState('');
  const [parcelList, setParcelList]   = useState<string[]>([]);
  const [creating, setCreating]       = useState(false);
  const [lastSheet, setLastSheet]     = useState<Sheet | null>(null);

  const [sheets, setSheets]   = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch]   = useState({ loadSheetNo: '', fromDate: '', toDate: '', page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors';
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && parcelInput.trim()) {
      e.preventDefault();
      if (!parcelList.includes(parcelInput.trim())) {
        setParcelList(l => [...l, parcelInput.trim()]);
      }
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
      loadSheets(); // refresh the list below
    } finally {
      setCreating(false);
    }
  };

  const loadSheets = async (override?: Partial<typeof search>) => {
    setLoading(true);
    try {
      const currentSearch = { ...search, ...override };
      const params = Object.fromEntries(Object.entries(currentSearch).filter(([,v]) => v));
      const res = await axiosInstance.get(API.LOAD_SHEETS.LIST, { params });
      setSheets(res.data?.data?.items ?? []);
      setTotalPages(res.data?.data?.pages ?? 1);
      setTotal(res.data?.data?.total ?? 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSheets(); }, []);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f5]">
      <Navbar title="Load Sheets" />

      <main className="p-6 space-y-5">

        {/* ── Create Load Sheet ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <FileSpreadsheet size={16} className="text-green-600" />
            <h3 className="font-semibold text-sm text-gray-800">Create New Load Sheet</h3>
          </div>
          <div className="p-5">
            <p className="text-sm text-gray-500 mb-4">
              Type a parcel tracking number and press <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono border border-gray-200">Enter</kbd> to add it.
              Once you've added all parcels, click <strong>Generate Load Sheet</strong>.
            </p>

            {/* Success */}
            {lastSheet && (
              <div className="mb-4 flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={18} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-800">Load Sheet Created!</p>
                  <p className="text-sm text-green-700 mt-0.5">
                    Sheet No: <span className="font-bold font-mono">{lastSheet.loadSheetNo}</span>
                    <span className="mx-1">·</span>
                    {lastSheet.parcelIds.length} parcels
                  </p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => window.print()}>
                  <Printer size={13} /> Print
                </Button>
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Plus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className={`${inputCls} pl-9 text-base`}
                  placeholder="Type tracking number and press Enter..."
                  value={parcelInput}
                  onChange={e => setParcelInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              {parcelList.length > 0 && (
                <button onClick={() => setParcelList([])} className="text-gray-400 hover:text-red-500 transition-colors px-3" title="Clear all">
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Parcel chips */}
            {parcelList.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-3 mb-4 max-h-48 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {parcelList.map((p, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                      <span className="font-mono text-xs text-green-800 font-medium">{p}</span>
                      <button onClick={() => removeParcel(i)} className="text-green-400 hover:text-red-500 transition-colors">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Package size={12} /> {parcelList.length} parcel{parcelList.length !== 1 ? 's' : ''} added
              </p>
              <Button onClick={generateSheet} loading={creating} disabled={parcelList.length === 0}>
                <FileSpreadsheet size={14} /> Generate Load Sheet
              </Button>
            </div>
          </div>
        </div>

        {/* ── Existing Load Sheets ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Search size={16} className="text-green-600" />
            <h3 className="font-semibold text-sm text-gray-800">Load Sheet History</h3>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-3 mb-4 items-end">
              <div className="flex-1 min-w-48">
                <label className={labelCls}>Load Sheet Number</label>
                <input placeholder="e.g. LS-1234..." className={inputCls} value={search.loadSheetNo} onChange={e => setSearch(s => ({...s, loadSheetNo: e.target.value}))} />
              </div>
              <div className="w-36">
                <label className={labelCls}><Calendar size={10} className="inline mr-1" />From Date</label>
                <input type="date" className={inputCls} value={search.fromDate} onChange={e => setSearch(s => ({...s, fromDate: e.target.value}))} />
              </div>
              <div className="w-36">
                <label className={labelCls}><Calendar size={10} className="inline mr-1" />To Date</label>
                <input type="date" className={inputCls} value={search.toDate} onChange={e => setSearch(s => ({...s, toDate: e.target.value}))} />
              </div>
              <Button onClick={() => { setSearch(s => ({ ...s, page: 1 })); loadSheets({ page: 1 }); }} loading={loading} size="sm">
                <Search size={13} /> Search
              </Button>
            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Load Sheet No</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Date Created</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Parcels</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Created By</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-12"><span className="spinner spinner-green inline-block" style={{width:20,height:20}} /></td></tr>
                  ) : sheets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12">
                        <FileSpreadsheet size={28} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">No load sheets found.</p>
                      </td>
                    </tr>
                  ) : sheets.map(s => (
                    <tr key={s._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">{s.loadSheetNo}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(s.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-100 text-gray-700 font-semibold text-xs px-2 py-0.5 rounded">{s.parcelIds.length} parcels</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.createdBy?.name || '—'}</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="secondary" onClick={() => window.print()}>
                          <Printer size={12} /> Print
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    Page {search.page} of {totalPages} · {total} load sheets
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary" size="sm"
                      disabled={search.page <= 1}
                      onClick={() => {
                        const newPage = search.page - 1;
                        setSearch(s => ({ ...s, page: newPage }));
                        loadSheets({ page: newPage });
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
                        loadSheets({ page: newPage });
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
