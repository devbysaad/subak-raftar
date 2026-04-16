import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { createShipmentRequest } from '@/redux/slice/shipmentsSlice';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface CreateShipmentFormProps {
  onSuccess?: (id: string) => void;
}

const PROVIDERS = ['tcs', 'leopards', 'trax', 'mp', 'self'];
const PACKAGE_TYPES = ['Document', 'Parcel', 'Fragile', 'Oversized'];

const CreateShipmentForm: React.FC<CreateShipmentFormProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const { loadingCreate, createError } = useAppSelector((s) => s.shipments);

  const [form, setForm] = useState({
    senderName: '', senderPhone: '', senderAddress: '', senderCity: '',
    receiverName: '', receiverPhone: '', receiverAddress: '', receiverCity: '',
    weight: '', packageType: 'Parcel', provider: 'tcs', description: '',
    isCOD: false, codAmount: '', notes: '',
  });

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      createShipmentRequest({
        sender: {
          name: form.senderName, phone: form.senderPhone,
          address: form.senderAddress, city: form.senderCity,
        },
        receiver: {
          name: form.receiverName, phone: form.receiverPhone,
          address: form.receiverAddress, city: form.receiverCity,
        },
        weight: Number(form.weight),
        packageType: form.packageType,
        provider: form.provider as 'tcs',
        description: form.description,
        isCOD: form.isCOD,
        codAmount: form.isCOD ? Number(form.codAmount) : 0,
        notes: form.notes,
      } as Parameters<typeof createShipmentRequest>[0])
    );
  };

  // Watch for new shipment created and call onSuccess
  const { list } = useAppSelector((s) => s.shipments);
  React.useEffect(() => {
    if (!loadingCreate && !createError && onSuccess && list[0]?._id) {
      // Called after success — parent will handle redirect
    }
  }, [loadingCreate]);

  const labelClass = 'text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block';
  const sectionClass = 'bg-white border border-gray-200 rounded-lg p-5';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Sender + Receiver */}
      <div className="grid grid-cols-2 gap-5">
        <div className={sectionClass}>
          <span className={labelClass}>Sender</span>
          <div className="space-y-3">
            <Input label="Name" required value={form.senderName} onChange={(e) => set('senderName', e.target.value)} placeholder="Sender name" />
            <Input label="Phone" required value={form.senderPhone} onChange={(e) => set('senderPhone', e.target.value)} placeholder="03XX-XXXXXXX" />
            <Input label="Address" required value={form.senderAddress} onChange={(e) => set('senderAddress', e.target.value)} placeholder="Street address" />
            <Input label="City" required value={form.senderCity} onChange={(e) => set('senderCity', e.target.value)} placeholder="City" />
          </div>
        </div>
        <div className={sectionClass}>
          <span className={labelClass}>Receiver</span>
          <div className="space-y-3">
            <Input label="Name" required value={form.receiverName} onChange={(e) => set('receiverName', e.target.value)} placeholder="Receiver name" />
            <Input label="Phone" required value={form.receiverPhone} onChange={(e) => set('receiverPhone', e.target.value)} placeholder="03XX-XXXXXXX" />
            <Input label="Address" required value={form.receiverAddress} onChange={(e) => set('receiverAddress', e.target.value)} placeholder="Street address" />
            <Input label="City" required value={form.receiverCity} onChange={(e) => set('receiverCity', e.target.value)} placeholder="City" />
          </div>
        </div>
      </div>

      {/* Package details */}
      <div className={sectionClass}>
        <span className={labelClass}>Package Details</span>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
            <input
              type="number" required min="0.1" step="0.1"
              value={form.weight} onChange={(e) => set('weight', e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="0.5"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Package Type</label>
            <select
              value={form.packageType} onChange={(e) => set('packageType', e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
              {PACKAGE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Provider</label>
            <select
              value={form.provider} onChange={(e) => set('provider', e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
              {PROVIDERS.map((p) => <option key={p} value={p}>{p.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <input
            value={form.description} onChange={(e) => set('description', e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Package contents description"
          />
        </div>

        {/* COD */}
        <div className="mt-4 flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox" className="sr-only peer"
              checked={form.isCOD} onChange={(e) => set('isCOD', e.target.checked)}
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-orange-400 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
          </label>
          <span className="text-sm font-medium text-gray-700">Cash on Delivery (COD)</span>
        </div>

        {form.isCOD && (
          <div className="mt-3 max-w-xs">
            <Input
              label="COD Amount (PKR)" type="number" required={form.isCOD}
              value={form.codAmount} onChange={(e) => set('codAmount', e.target.value)}
              placeholder="0"
            />
          </div>
        )}
      </div>

      {/* Notes */}
      <div className={sectionClass}>
        <span className={labelClass}>Additional Notes</span>
        <textarea
          value={form.notes} onChange={(e) => set('notes', e.target.value)}
          rows={3} placeholder="Any special instructions…"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />
      </div>

      {createError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {createError}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={loadingCreate}>
          Create Shipment
        </Button>
      </div>
    </form>
  );
};

export default CreateShipmentForm;
