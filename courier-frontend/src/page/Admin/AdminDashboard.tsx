import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { API } from '@/constants/api';
import Button from '@/components/ui/Button';

/* ─── Settings Tab ─────────────────────────────────── */
export default function AdminDashboard() {
  const [info, setInfo]       = useState({ companyName: '', email: '', phone: '', address: '' });
  const [shopify, setShopify] = useState({ shopifyStoreName: '', shopifyApiKey: '', shopifyApiSecret: '' });
  const [keys, setKeys]       = useState<Record<string, { apiKey: string; apiPassword: string }>>({
    tcs:      { apiKey: '', apiPassword: '' },
    trax:     { apiKey: '', apiPassword: '' },
    leopards: { apiKey: '', apiPassword: '' },
    mp:       { apiKey: '', apiPassword: '' },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState('');
  const [saved, setSaved]     = useState('');

  useEffect(() => {
    axiosInstance.get(API.SETTINGS.GET).then((res) => {
      const d = res.data?.data ?? {};
      setInfo({
        companyName: d.companyName || '',
        email:       d.email       || '',
        phone:       d.phone       || '',
        address:     d.address     || '',
      });
      setShopify({
        shopifyStoreName:  d.shopifyStoreName  || '',
        shopifyApiKey:     d.shopifyApiKey     || '',
        shopifyApiSecret:  '',
      });
      if (d.providerKeys) {
        setKeys((k) => ({ ...k, ...d.providerKeys }));
      }
    }).finally(() => setLoading(false));
  }, []);

  const flash = (key: string) => {
    setSaved(key);
    setTimeout(() => setSaved(''), 2500);
  };

  const saveInfo = async () => {
    setSaving('info');
    try { await axiosInstance.patch(API.SETTINGS.UPDATE, info); flash('info'); }
    finally { setSaving(''); }
  };

  const saveShopify = async () => {
    setSaving('shopify');
    try { await axiosInstance.patch(API.SETTINGS.SHOPIFY, shopify); flash('shopify'); }
    finally { setSaving(''); }
  };

  const saveProvider = async (provider: string) => {
    setSaving(provider);
    try { await axiosInstance.patch(API.SETTINGS.PROVIDER(provider), keys[provider]); flash(provider); }
    finally { setSaving(''); }
  };

  if (loading) {
    return (
      <div className="card p-10 flex justify-center">
        <span className="spinner spinner-green inline-block" style={{ width: 22, height: 22 }} />
      </div>
    );
  }

  const fieldCls = 'border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] w-full focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none';
  const labelCls = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1';

  return (
    <div className="space-y-5">

      {/* ── Company Info ── */}
      <div className="card p-5">
        <h3 className="font-semibold text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">
          Company Information
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><label className={labelCls}>Company Name</label><input className={fieldCls} value={info.companyName} onChange={(e) => setInfo((i) => ({ ...i, companyName: e.target.value }))} /></div>
          <div><label className={labelCls}>Email</label><input type="email" className={fieldCls} value={info.email} onChange={(e) => setInfo((i) => ({ ...i, email: e.target.value }))} /></div>
          <div><label className={labelCls}>Phone</label><input className={fieldCls} value={info.phone} onChange={(e) => setInfo((i) => ({ ...i, phone: e.target.value }))} /></div>
          <div><label className={labelCls}>Address</label><input className={fieldCls} value={info.address} onChange={(e) => setInfo((i) => ({ ...i, address: e.target.value }))} /></div>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={saveInfo} loading={saving === 'info'}>Save Company Info</Button>
          {saved === 'info' && <span className="text-xs text-green-600 font-semibold">✓ Saved</span>}
        </div>
      </div>

      {/* ── Courier API Keys ── */}
      <div className="card p-5">
        <h3 className="font-semibold text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">
          Courier API Keys
        </h3>
        {Object.keys(keys).map((provider) => (
          <div key={provider} className="flex items-end gap-3 mb-4">
            <span className="text-xs font-bold uppercase text-gray-600 w-24 pb-2 shrink-0">{provider}</span>
            <div className="flex-1">
              <label className={labelCls}>API Key</label>
              <input
                className={fieldCls}
                value={keys[provider].apiKey}
                onChange={(e) => setKeys((k) => ({ ...k, [provider]: { ...k[provider], apiKey: e.target.value } }))}
              />
            </div>
            <div className="flex-1">
              <label className={labelCls}>API Password</label>
              <input
                type="password"
                className={fieldCls}
                value={keys[provider].apiPassword}
                onChange={(e) => setKeys((k) => ({ ...k, [provider]: { ...k[provider], apiPassword: e.target.value } }))}
              />
            </div>
            <div className="flex items-center gap-2 pb-0 shrink-0">
              <Button size="sm" onClick={() => saveProvider(provider)} loading={saving === provider}>Save</Button>
              {saved === provider && <span className="text-xs text-green-600 font-semibold">✓</span>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Shopify Integration ── */}
      <div className="card p-5">
        <h3 className="font-semibold text-sm text-gray-700 mb-4 pb-2 border-b border-gray-100">
          Shopify Integration
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div><label className={labelCls}>Store Name</label><input className={fieldCls} placeholder="yourstore.myshopify.com" value={shopify.shopifyStoreName} onChange={(e) => setShopify((s) => ({ ...s, shopifyStoreName: e.target.value }))} /></div>
          <div><label className={labelCls}>API Key</label><input className={fieldCls} value={shopify.shopifyApiKey} onChange={(e) => setShopify((s) => ({ ...s, shopifyApiKey: e.target.value }))} /></div>
          <div><label className={labelCls}>API Secret</label><input type="password" className={fieldCls} value={shopify.shopifyApiSecret} onChange={(e) => setShopify((s) => ({ ...s, shopifyApiSecret: e.target.value }))} /></div>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={saveShopify} loading={saving === 'shopify'}>Save Shopify</Button>
          {saved === 'shopify' && <span className="text-xs text-green-600 font-semibold">✓ Saved</span>}
        </div>
      </div>
    </div>
  );
}
