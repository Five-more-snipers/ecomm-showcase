'use client';

import React, { useState } from 'react';
import {
  Settings,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCartStore } from '@/stores/useCartStore';
import { seedPresetCart } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { simulationMode, setSimulationMode } = useSimulatorStore();
  const { cartId } = useCartStore();

  const [siteTitle, setSiteTitle] = useState('Ecommerce Shop');
  const [tagline, setTagline] = useState('Modern Full-Stack Marketplace Platform');
  const [taxRate, setTaxRate] = useState('8.0');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('100.00');
  const [activeTab, setActiveTab] = useState<'general' | 'store' | 'simulation' | 'tools'>('general');
  const [notice, setNotice] = useState<string | null>(null);

  const seedMutation = useMutation({
    mutationFn: () => seedPresetCart(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries();
      setNotice('Presets and demo cart items re-seeded successfully!');
      setTimeout(() => setNotice(null), 4000);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice('Settings saved successfully.');
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="space-y-5 max-w-5xl">
      <h1 className="text-2xl font-normal text-[#1d2327]">Settings</h1>

      {notice && (
        <div className="bg-white border-l-4 border-l-[#00a32a] border border-[#c3c4c7] p-3 shadow-sm text-xs flex items-center justify-between text-[#1d2327]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#00a32a]" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-gray-400 hover:text-black">
            &times;
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 text-xs border-b border-[#c3c4c7] pt-1">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 border-b-2 font-semibold transition ${
            activeTab === 'general'
              ? 'border-[#2271b1] text-[#2271b1]'
              : 'border-transparent text-[#50575e] hover:text-[#2271b1]'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab('store')}
          className={`px-4 py-2 border-b-2 font-semibold transition ${
            activeTab === 'store'
              ? 'border-[#2271b1] text-[#2271b1]'
              : 'border-transparent text-[#50575e] hover:text-[#2271b1]'
          }`}
        >
          Store & Tax
        </button>
        <button
          onClick={() => setActiveTab('simulation')}
          className={`px-4 py-2 border-b-2 font-semibold transition ${
            activeTab === 'simulation'
              ? 'border-[#2271b1] text-[#2271b1]'
              : 'border-transparent text-[#50575e] hover:text-[#2271b1]'
          }`}
        >
          Simulation Engine
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 border-b-2 font-semibold transition ${
            activeTab === 'tools'
              ? 'border-[#2271b1] text-[#2271b1]'
              : 'border-transparent text-[#50575e] hover:text-[#2271b1]'
          }`}
        >
          Demo Data & Tools
        </button>
      </div>

      {/* Form Content (`.form-table` WordPress styling) */}
      <form onSubmit={handleSave} className="space-y-6 pt-2">
        <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm p-6">
          {activeTab === 'general' && (
            <table className="w-full text-xs">
              <tbody className="divide-y divide-[#f0f0f1]">
                <tr className="py-4">
                  <th className="w-1/3 text-left py-4 pr-4 align-top font-semibold text-[#1d2327]">
                    Site Title
                  </th>
                  <td className="py-4">
                    <input
                      type="text"
                      value={siteTitle}
                      onChange={(e) => setSiteTitle(e.target.value)}
                      className="w-full max-w-md border border-[#8c8f94] rounded px-3 py-1.5 text-xs outline-none focus:border-[#2271b1]"
                    />
                    <p className="text-[11px] text-[#646970] mt-1">
                      Displayed on the storefront header and browser title tag.
                    </p>
                  </td>
                </tr>

                <tr>
                  <th className="w-1/3 text-left py-4 pr-4 align-top font-semibold text-[#1d2327]">
                    Tagline
                  </th>
                  <td className="py-4">
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full max-w-md border border-[#8c8f94] rounded px-3 py-1.5 text-xs outline-none focus:border-[#2271b1]"
                    />
                    <p className="text-[11px] text-[#646970] mt-1">
                      In a few words, explain what this showcase is about.
                    </p>
                  </td>
                </tr>

                <tr>
                  <th className="w-1/3 text-left py-4 pr-4 align-top font-semibold text-[#1d2327]">
                    Administration Email Address
                  </th>
                  <td className="py-4">
                    <input
                      type="email"
                      defaultValue="admin@ecomm-showcase.local"
                      className="w-full max-w-md border border-[#8c8f94] rounded px-3 py-1.5 text-xs outline-none focus:border-[#2271b1]"
                    />
                    <p className="text-[11px] text-[#646970] mt-1">
                      This address is used for admin notifications.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === 'store' && (
            <table className="w-full text-xs">
              <tbody className="divide-y divide-[#f0f0f1]">
                <tr>
                  <th className="w-1/3 text-left py-4 pr-4 align-top font-semibold text-[#1d2327]">
                    Currency
                  </th>
                  <td className="py-4">
                    <select className="border border-[#8c8f94] rounded px-3 py-1.5 text-xs bg-white">
                      <option value="USD">United States dollar ($)</option>
                      <option value="EUR">Euro (&euro;)</option>
                      <option value="GBP">Pound sterling (&pound;)</option>
                    </select>
                  </td>
                </tr>

                <tr>
                  <th className="w-1/3 text-left py-4 pr-4 align-top font-semibold text-[#1d2327]">
                    Sales Tax Rate (%)
                  </th>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                        className="w-24 border border-[#8c8f94] rounded px-3 py-1.5 text-xs outline-none focus:border-[#2271b1]"
                      />
                      <span>%</span>
                    </div>
                    <p className="text-[11px] text-[#646970] mt-1">
                      Authoritative server-side tax rate applied to subtotal during checkout calculation.
                    </p>
                  </td>
                </tr>

                <tr>
                  <th className="w-1/3 text-left py-4 pr-4 align-top font-semibold text-[#1d2327]">
                    Free Shipping Threshold ($)
                  </th>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span>$</span>
                      <input
                        type="number"
                        step="1"
                        value={freeShippingThreshold}
                        onChange={(e) => setFreeShippingThreshold(e.target.value)}
                        className="w-28 border border-[#8c8f94] rounded px-3 py-1.5 text-xs outline-none focus:border-[#2271b1]"
                      />
                    </div>
                    <p className="text-[11px] text-[#646970] mt-1">
                      Orders with subtotal at or above this threshold receive free shipping ($0.00). Standard shipping is $10.00.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === 'simulation' && (
            <table className="w-full text-xs">
              <tbody className="divide-y divide-[#f0f0f1]">
                <tr>
                  <th className="w-1/3 text-left py-4 pr-4 align-top font-semibold text-[#1d2327]">
                    Active Payment Simulation Mode
                  </th>
                  <td className="py-4 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="simMode"
                        value="AUTO"
                        checked={simulationMode === 'AUTO'}
                        onChange={() => setSimulationMode('AUTO')}
                        className="text-[#2271b1]"
                      />
                      <span className="font-semibold text-gray-800">
                        Auto Mode (Determined by Card Number)
                      </span>
                    </label>
                    <p className="text-[11px] text-gray-500 pl-5">
                      Card ending in 4242 approves; 0002 simulates decline; 0004 simulates gateway timeout.
                    </p>

                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                      <input
                        type="radio"
                        name="simMode"
                        value="FORCE_SUCCESS"
                        checked={simulationMode === 'FORCE_SUCCESS'}
                        onChange={() => setSimulationMode('FORCE_SUCCESS')}
                        className="text-[#2271b1]"
                      />
                      <span className="font-semibold text-green-700">Force Success (Always Approve)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                      <input
                        type="radio"
                        name="simMode"
                        value="FORCE_DECLINE"
                        checked={simulationMode === 'FORCE_DECLINE'}
                        onChange={() => setSimulationMode('FORCE_DECLINE')}
                        className="text-[#2271b1]"
                      />
                      <span className="font-semibold text-red-700">Force Decline (Always Reject)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                      <input
                        type="radio"
                        name="simMode"
                        value="FORCE_TIMEOUT"
                        checked={simulationMode === 'FORCE_TIMEOUT'}
                        onChange={() => setSimulationMode('FORCE_TIMEOUT')}
                        className="text-[#2271b1]"
                      />
                      <span className="font-semibold text-amber-700">Force Timeout (10000ms delay)</span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-5 text-xs text-[#50575e]">
              <div>
                <strong className="block text-sm font-semibold text-[#1d2327] mb-1">
                  Re-seed Demo Presets
                </strong>
                <p className="mb-3 leading-relaxed">
                  Reset your shopping cart to the default preset items ($273.99 subtotal with Aura Headphones and Heavyweight Hoodie) to test checkout from scratch:
                </p>
                <button
                  type="button"
                  onClick={() => seedMutation.mutate()}
                  disabled={seedMutation.isPending}
                  className="bg-[#2271b1] hover:bg-[#135e96] text-white px-4 py-2 rounded font-semibold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Sparkles size={14} />
                  <span>{seedMutation.isPending ? 'Re-seeding...' : '⚡ Re-seed Preset Demo Cart'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save Changes Button (WordPress style) */}
        <div>
          <button
            type="submit"
            className="bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold text-xs px-5 py-2 rounded transition shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
