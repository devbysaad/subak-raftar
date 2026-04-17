import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { createShipmentRequest } from '@/redux/slice/shipmentsSlice';
import Button from '@/components/ui/Button';

const PROVIDERS = ['tcs', 'trax', 'leopards', 'mp', 'self'];
const PAKISTAN_CITIES = [
  'Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar','Quetta',
  'Sialkot','Gujranwala','Hyderabad','Bahawalpur','Abbottabad','Sukkur','Sargodha',
];

const emptyForm = {
  receiverName: '', receiverAddress: '', receiverEmail: '', receiverPhone: '', receiverCity: '',
  itemType: '', quantity: '1', specialInstruction: '', codAmount: '', weight: '', provider: 'tcs',
};

export default function BookParcel() {
  const dispatch = useAppDispatch();
  const { loading, lastCreated } = useAppSelector(s => s.shipments);
  const [form, setForm] = useState(emptyForm);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createShipmentRequest({
      receiver: {
        name:    form.receiverName,
        address: form.receiverAddress,
        email:   form.receiverEmail,
        phone:   form.receiverPhone,
        city:    form.receiverCity,
      },
      itemType:           form.itemType,
      quantity:           Number(form.quantity),
      specialInstruction: form.specialInstruction,
      codAmount:          Number(form.codAmount) || 0,
      weight:             Number(form.weight) || 0,
      provider:           form.provider as import('@/redux/slice/shipmentsSlice').Provider,
      isCOD:              Number(form.codAmount) > 0,
    }));
  };

  const fieldCls = "border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] w-full focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none";
  const labelCls = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1";

  return (
    <div className="space-y-4">

      {/* Excel Upload */}
      <div className="card p-5">
        <h2 className="font-semibold text-sm text-gray-700 mb-4">Book Parcel With Excel</h2>
        <div className="flex flex-col items-center gap-3 py-4">
          <input type="file" accept=".xlsx,.xls,.csv" className="text-sm text-gray-600" />
          <div className="flex items-center gap-3">
            <Button size="sm">Upload Excel Sheet</Button>
            <Button size="sm" variant="secondary">Save Sheet</Button>
            <Button size="sm" variant="secondary">Bulk Print</Button>
          </div>
          <a href="#" className="text-xs text-green-600 hover:underline font-medium">
            Download Sample Excel File For Format
          </a>
        </div>
      </div>

      {/* Manual Form */}
      <div className="card p-5">
        <h2 className="font-semibold text-sm text-gray-700 mb-4">Book Parcel Manually</h2>

        {lastCreated && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded p-3">
            <p className="text-sm font-semibold text-green-700">
              ✓ Parcel booked! Tracking No: <span className="font-bold">{(lastCreated as unknown as Record<string, string>).providerTrackingNo}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Left */}
            <div className="space-y-3">
              <div><label className={labelCls}>Consignee Name *</label><input required className={fieldCls} value={form.receiverName} onChange={set('receiverName')} /></div>
              <div><label className={labelCls}>Consignee Address *</label><input required className={fieldCls} value={form.receiverAddress} onChange={set('receiverAddress')} /></div>
              <div><label className={labelCls}>Consignee Email</label><input type="email" className={fieldCls} value={form.receiverEmail} onChange={set('receiverEmail')} /></div>
              <div><label className={labelCls}>Consignee Cell No *</label><input required className={fieldCls} placeholder="03XXXXXXXXX" value={form.receiverPhone} onChange={set('receiverPhone')} /></div>
              <div>
                <label className={labelCls}>Consignee City *</label>
                <select required className={fieldCls} value={form.receiverCity} onChange={set('receiverCity')}>
                  <option value="">Select City</option>
                  {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {/* Right */}
            <div className="space-y-3">
              <div><label className={labelCls}>Item Type *</label><input required className={fieldCls} value={form.itemType} onChange={set('itemType')} /></div>
              <div><label className={labelCls}>Quantity</label><input type="number" min="1" className={fieldCls} value={form.quantity} onChange={set('quantity')} /></div>
              <div><label className={labelCls}>Special Instruction</label><textarea className={`${fieldCls} h-[68px] resize-none`} value={form.specialInstruction} onChange={set('specialInstruction')} /></div>
              <div><label className={labelCls}>COD Amount (Rs)</label><input type="number" min="0" className={fieldCls} value={form.codAmount} onChange={set('codAmount')} /></div>
              <div><label className={labelCls}>Weight (kg)</label><input type="number" min="0" step="0.1" className={fieldCls} value={form.weight} onChange={set('weight')} /></div>
            </div>
          </div>

          {/* Provider select */}
          <div className="mb-5">
            <label className={labelCls}>Select Courier *</label>
            <select required className={fieldCls} value={form.provider} onChange={set('provider')}>
              {PROVIDERS.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
            </select>
          </div>

          <div className="flex justify-center">
            <Button type="submit" loading={loading} size="lg">Book Parcel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
