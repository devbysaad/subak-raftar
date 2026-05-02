import React, { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { createShipmentRequest, clearCreateError } from '@/redux/slice/shipmentsSlice';
import type { Provider } from '@/redux/slice/shipmentsSlice';
import Button from '@/components/ui/Button';
import Navbar from '@/components/ui/Navbar';
import axiosInstance from '@/lib/axios';
import { API } from '@/constants/api';
import {
  generateSampleExcel,
  parseExcelFile,
  exportShipmentsToExcel,
  type ExcelRow,
  CITIES,
} from '@/lib/excel';
import {
  Upload,
  FileSpreadsheet,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Trash2,
  User,
  Phone,
  MapPin,
  Package,
  Truck,
  DollarSign,
  Weight,
} from 'lucide-react';

const PROVIDERS = [
  { value: 'tcs',      label: 'TCS' },
  { value: 'leopards', label: 'Leopards Courier' },
  { value: 'trax',     label: 'Trax' },
  { value: 'mp',       label: 'M&P' },
];

const emptyForm = {
  receiverName: '',
  receiverAddress: '',
  receiverPhone: '',
  receiverCity: '',
  itemType: '',
  quantity: '1',
  specialInstruction: '',
  codAmount: '',
  weight: '0.5',
  provider: 'tcs',
};

type Tab = 'manual' | 'excel';

export default function BookParcel() {
  const dispatch = useAppDispatch();
  const { loadingCreate, lastCreated, createError } = useAppSelector(s => s.shipments);

  const [tab, setTab] = useState<Tab>('manual');
  const [form, setForm]   = useState(emptyForm);
  const fileInputRef      = useRef<HTMLInputElement>(null);

  // Excel state
  const [excelRows, setExcelRows]       = useState<ExcelRow[]>([]);
  const [excelFile, setExcelFile]       = useState<File | null>(null);
  const [parsing, setParsing]           = useState(false);
  const [parseError, setParseError]     = useState<string | null>(null);
  const [uploading, setUploading]       = useState(false);
  const [uploadResult, setUploadResult] = useState<{ created: number; failed: number } | null>(null);
  const [printing, setPrinting]         = useState(false);

  /* ── helpers ── */
  const set = (k: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    dispatch(clearCreateError());
    setForm(f => ({ ...f, [k]: e.target.value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFile(file);
    setParseError(null);
    setUploadResult(null);
    setParsing(true);
    try {
      const rows = await parseExcelFile(file);
      setExcelRows(rows);
    } catch (err: any) {
      setParseError(err.message);
    } finally {
      setParsing(false);
    }
  };

  const handleUpload = async () => {
    const valid = excelRows.filter(r => r._valid);
    if (!valid.length) return;
    setUploading(true);
    try {
      const payload = valid.map(r => ({
        receiver: {
          name: r.receiverName, phone: r.receiverPhone,
          address: r.receiverAddress, city: r.receiverCity,
        },
        itemType: r.itemType,
        quantity: r.quantity,
        weight: r.weight,
        codAmount: r.codAmount,
        isCOD: r.codAmount > 0,
        provider: r.provider as Provider,
        specialInstruction: r.specialInstruction,
      }));
      const res = await axiosInstance.post(API.SHIPMENTS.BULK, payload);
      const result = res.data?.data;
      setUploadResult({ created: result?.created ?? 0, failed: result?.failed ?? 0 });
    } catch (err: any) {
      setParseError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSheet = () => {
    if (!excelRows.length) return;
    exportShipmentsToExcel(excelRows.map(r => ({
      providerTrackingNo: '(pending)',
      receiver: { name: r.receiverName, phone: r.receiverPhone, city: r.receiverCity },
      itemType: r.itemType,
      codAmount: r.codAmount,
      status: 'draft',
      provider: r.provider,
      createdAt: new Date().toISOString(),
    })), 'draft-shipments.xlsx');
  };

  const handleBulkPrint = () => {
    if (!excelRows.length) return;
    setPrinting(true);
    const printWindow = window.open('', '_blank');
    if (!printWindow) { setPrinting(false); return; }

    const rows = excelRows.filter(r => r._valid);
    const html = `
      <html><head><title>Shipping Labels</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; }
        .label { width: 90mm; border: 2px solid #000; padding: 10px; margin: 5px; display: inline-block; page-break-inside: avoid; }
        .courier { font-size: 18px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 5px; }
        .field { font-size: 11px; margin: 3px 0; }
        .label-title { font-size: 10px; color: #555; }
        .label-value { font-size: 12px; font-weight: bold; }
        .cod-box { border: 2px solid #000; padding: 3px 6px; display: inline-block; margin-top: 5px; }
        @media print { body { margin: 0; } }
      </style></head><body>
      ${rows.map(r => `
        <div class="label">
          <div class="courier">${(r.provider || 'TCS').toUpperCase()}</div>
          <div class="field"><span class="label-title">TO: </span><span class="label-value">${r.receiverName}</span></div>
          <div class="field">${r.receiverAddress}, ${r.receiverCity}</div>
          <div class="field">📞 ${r.receiverPhone}</div>
          <div class="field"><span class="label-title">Item: </span>${r.itemType || '—'} × ${r.quantity}</div>
          <div class="field"><span class="label-title">Weight: </span>${r.weight} kg</div>
          ${r.codAmount > 0 ? `<div class="cod-box">COD: PKR ${Number(r.codAmount).toLocaleString()}</div>` : ''}
        </div>
      `).join('')}
      </body></html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
    setPrinting(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createShipmentRequest({
      receiver: {
        name:    form.receiverName,
        address: form.receiverAddress,
        phone:   form.receiverPhone,
        city:    form.receiverCity,
      },
      itemType:           form.itemType,
      quantity:           Number(form.quantity),
      specialInstruction: form.specialInstruction,
      codAmount:          Number(form.codAmount) || 0,
      weight:             Number(form.weight) || 0.5,
      provider:           form.provider as Provider,
      isCOD:              Number(form.codAmount) > 0,
    }));
  };

  /* ── styles ── */
  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors';
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';
  const tabCls   = (t: Tab) => `flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
    tab === t ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-800'
  }`;

  const validCount   = excelRows.filter(r => r._valid).length;
  const invalidCount = excelRows.filter(r => !r._valid).length;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f5f5f5]">
      <Navbar title="Book Parcel" />

      <main className="p-6 space-y-5">

        {/* ── Tabs ── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="flex border-b border-gray-200">
            <button className={tabCls('manual')} onClick={() => setTab('manual')}>
              <Package size={15} /> Book Manually
            </button>
            <button className={tabCls('excel')} onClick={() => setTab('excel')}>
              <FileSpreadsheet size={15} /> Upload Excel
            </button>
          </div>

          {/* ════════════════════════════════════════ MANUAL TAB */}
          {tab === 'manual' && (
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-5">
                Fill in the form below to book a single parcel. Fields marked with <span className="text-red-500">*</span> are required.
              </p>

              {/* Success Banner */}
              {lastCreated && (
                <div className="mb-5 flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                  <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-semibold text-green-800">Parcel Booked Successfully!</p>
                    <p className="text-sm text-green-700 mt-0.5">
                      Tracking No: <span className="font-bold font-mono">{(lastCreated as any).providerTrackingNo}</span>
                      <span className="mx-2">·</span>
                      Courier: <span className="font-bold uppercase">{(lastCreated as any).provider}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {createError && (
                <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-red-700">{createError}</p>
                </div>
              )}

              <form onSubmit={handleManualSubmit}>
                {/* Section: Receiver Info */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <User size={12} /> Receiver Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-3 text-gray-400" />
                        <input required placeholder="e.g. Ali Khan" className={`${inputCls} pl-9`} value={form.receiverName} onChange={set('receiverName')} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-3 text-gray-400" />
                        <input required placeholder="03XXXXXXXXX" className={`${inputCls} pl-9`} value={form.receiverPhone} onChange={set('receiverPhone')} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Full Address <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-3 text-gray-400" />
                        <input required placeholder="House no, Street, Area" className={`${inputCls} pl-9`} value={form.receiverAddress} onChange={set('receiverAddress')} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>City <span className="text-red-500">*</span></label>
                      <select required className={inputCls} value={form.receiverCity} onChange={set('receiverCity')}>
                        <option value="">— Select City —</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-100 my-5" />

                {/* Section: Parcel Details */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Package size={12} /> Parcel Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Item Type <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Package size={14} className="absolute left-3 top-3 text-gray-400" />
                        <input required placeholder="e.g. Clothing, Electronics" className={`${inputCls} pl-9`} value={form.itemType} onChange={set('itemType')} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Quantity</label>
                      <input type="number" min="1" className={inputCls} value={form.quantity} onChange={set('quantity')} />
                    </div>
                    <div>
                      <label className={labelCls}>Weight (kg)</label>
                      <div className="relative">
                        <Weight size={14} className="absolute left-3 top-3 text-gray-400" />
                        <input type="number" min="0" step="0.1" className={`${inputCls} pl-9`} value={form.weight} onChange={set('weight')} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>COD Amount (Rs) — leave 0 if not COD</label>
                      <div className="relative">
                        <DollarSign size={14} className="absolute left-3 top-3 text-gray-400" />
                        <input type="number" min="0" placeholder="0" className={`${inputCls} pl-9`} value={form.codAmount} onChange={set('codAmount')} />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Special Instruction</label>
                      <textarea rows={1} placeholder="e.g. Fragile, Handle with care" className={`${inputCls} resize-none`} value={form.specialInstruction} onChange={set('specialInstruction')} />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-100 my-5" />

                {/* Section: Courier */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Truck size={12} /> Select Courier
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PROVIDERS.map(p => (
                      <label key={p.value} className={`flex items-center gap-3 border-2 rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                        form.provider === p.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input type="radio" name="provider" value={p.value} checked={form.provider === p.value} onChange={set('provider')} className="hidden" />
                        <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${form.provider === p.value ? 'border-green-500 bg-green-500' : 'border-gray-300'}`} />
                        <span className={`text-sm font-semibold ${form.provider === p.value ? 'text-green-700' : 'text-gray-700'}`}>{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" loading={loadingCreate} size="lg">
                    <Package size={16} /> Book Parcel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* ════════════════════════════════════════ EXCEL TAB */}
          {tab === 'excel' && (
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Upload an Excel file to book multiple parcels at once.</p>
                  <p className="text-xs text-gray-400">Accepted formats: .xlsx, .xls, .csv</p>
                </div>
                <button
                  onClick={generateSampleExcel}
                  className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-semibold border border-green-200 hover:border-green-400 rounded-lg px-4 py-2 transition-colors"
                >
                  <Download size={14} /> Download Template
                </button>
              </div>

              {/* Drop zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-green-400 rounded-xl p-10 text-center cursor-pointer transition-colors bg-gray-50 hover:bg-green-50"
              >
                <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                <p className="text-sm font-semibold text-gray-600">Click to choose an Excel file</p>
                <p className="text-xs text-gray-400 mt-1">{excelFile ? `📄 ${excelFile.name}` : 'or drag and drop here'}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Parse error */}
              {parseError && (
                <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{parseError}</p>
                </div>
              )}

              {/* Parsing spinner */}
              {parsing && (
                <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
                  <span className="spinner spinner-green" style={{ width: 16, height: 16 }} />
                  Reading file…
                </div>
              )}

              {/* Upload result */}
              {uploadResult && (
                <div className="mt-4 flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                  <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">Bulk Upload Complete</p>
                    <p className="text-sm text-green-700 mt-0.5">
                      <strong>{uploadResult.created}</strong> parcels booked
                      {uploadResult.failed > 0 && <span className="text-red-600"> · {uploadResult.failed} failed</span>}
                    </p>
                  </div>
                </div>
              )}

              {/* Preview Table */}
              {excelRows.length > 0 && (
                <div className="mt-5">
                  {/* Summary + Action Buttons */}
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1.5 bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">
                        <CheckCircle2 size={13} /> {validCount} Valid
                      </span>
                      {invalidCount > 0 && (
                        <span className="flex items-center gap-1.5 bg-red-100 text-red-700 font-semibold px-3 py-1 rounded-full">
                          <AlertCircle size={13} /> {invalidCount} Invalid
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={handleSaveSheet}>
                        <Download size={13} /> Save Sheet
                      </Button>
                      <Button variant="secondary" size="sm" onClick={handleBulkPrint} loading={printing}>
                        <Printer size={13} /> Bulk Print Labels
                      </Button>
                      <Button size="sm" onClick={handleUpload} loading={uploading} disabled={validCount === 0}>
                        <Upload size={13} /> Upload {validCount} Parcels
                      </Button>
                      <button onClick={() => { setExcelRows([]); setExcelFile(null); setUploadResult(null); setParseError(null); if(fileInputRef.current) fileInputRef.current.value = ''; }} className="text-gray-400 hover:text-red-500 transition-colors p-1.5">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="border border-gray-200 rounded-lg overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold text-gray-500">#</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-500">Status</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-500">Receiver</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-500">Phone</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-500">City</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-500">Item</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-500">COD</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-500">Courier</th>
                        </tr>
                      </thead>
                      <tbody>
                        {excelRows.map((row, i) => (
                          <tr key={i} className={`border-b border-gray-100 ${!row._valid ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                            <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                            <td className="px-3 py-2">
                              {row._valid
                                ? <span className="text-green-600 font-semibold">✓ OK</span>
                                : <span className="text-red-500 font-semibold" title={row._errors.join(', ')}>✗ Error</span>
                              }
                            </td>
                            <td className="px-3 py-2 font-medium text-gray-700">{row.receiverName || '—'}</td>
                            <td className="px-3 py-2 text-gray-600">{row.receiverPhone}</td>
                            <td className="px-3 py-2 text-gray-600">{row.receiverCity}</td>
                            <td className="px-3 py-2 text-gray-600">{row.itemType}</td>
                            <td className="px-3 py-2 text-gray-600">
                              {row.codAmount > 0 ? <span className="text-green-700 font-semibold">PKR {Number(row.codAmount).toLocaleString()}</span> : '—'}
                            </td>
                            <td className="px-3 py-2 uppercase font-semibold text-gray-500">{row.provider}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Error details */}
                  {invalidCount > 0 && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-xs font-semibold text-red-700 mb-1">Fix these errors in your Excel file before uploading:</p>
                      {excelRows.filter(r => !r._valid).map((r, i) => (
                        <p key={i} className="text-xs text-red-600">Row {excelRows.indexOf(r) + 2}: {r._errors.join(' · ')}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
