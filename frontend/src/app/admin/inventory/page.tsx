'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Boxes,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, updateAdminInventory } from '@/lib/api';

export default function AdminInventoryPage() {
  const queryClient = useQueryClient();
  const [notice, setNotice] = useState<string | null>(null);
  const [stockInputs, setStockInputs] = useState<Record<number, number>>({});

  const { data: productData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts({ size: 100 }),
  });

  const products = productData?.content || [];

  const updateMutation = useMutation({
    mutationFn: ({ productId, qty }: { productId: number; qty: number }) =>
      updateAdminInventory(productId, qty),
    onSuccess: (updatedQty, vars) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setNotice(`Updated stock for Product #${vars.productId} to ${updatedQty} units.`);
      setTimeout(() => setNotice(null), 4000);
    },
  });

  const handleStockInputChange = (productId: number, val: number) => {
    setStockInputs((prev) => ({ ...prev, [productId]: val }));
  };

  const handleApplySingle = (productId: number) => {
    const qty = stockInputs[productId];
    if (qty !== undefined) {
      updateMutation.mutate({ productId, qty });
    }
  };

  const handleQuickPreset = (productId: number, qty: number) => {
    setStockInputs((prev) => ({ ...prev, [productId]: qty }));
    updateMutation.mutate({ productId, qty });
  };

  const handleSetAllTo50 = async () => {
    for (const p of products) {
      await updateAdminInventory(p.id, 50);
    }
    queryClient.invalidateQueries({ queryKey: ['products'] });
    setNotice('All product inventories replenished to 50 units!');
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Title & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-normal text-[#1d2327]">Stock & Concurrency Manager</h1>
          <p className="text-xs text-[#50575e] mt-0.5">
            Configure backend inventory quantities and test pessimistic lock limits behind the scenes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleQuickPreset(4, 1)}
            disabled={updateMutation.isPending}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs px-3 py-1.5 rounded font-semibold transition flex items-center gap-1.5 shadow-sm"
            title="Set Artisan Leather Weekender to 1 unit to test pessimistic lock"
          >
            <Lock size={13} />
            <span>Set Weekender to 1 (Lock Test)</span>
          </button>

          <button
            onClick={handleSetAllTo50}
            className="border border-[#c3c4c7] bg-white hover:bg-gray-100 text-[#2c3338] text-xs px-3 py-1.5 rounded font-semibold transition flex items-center gap-1.5"
          >
            <RefreshCw size={13} />
            <span>Replenish All to 50</span>
          </button>
        </div>
      </div>

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

      {/* Concurrency Guidance Box */}
      <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-sm p-4 text-xs">
        <div className="flex items-start gap-2.5">
          <ShieldAlert size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block text-amber-950 font-bold">
              How Pessimistic Inventory Locking Works Behind the Scenes:
            </strong>
            <p className="leading-relaxed text-amber-900/90">
              When a checkout order is executed, Spring Boot issues a transactional{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">
                SELECT * FROM inventories WHERE product_id = ? FOR UPDATE
              </code>
              . If two users concurrently attempt to purchase an item with only 1 unit remaining, the second transaction is immediately blocked and rolls back with HTTP 409 Conflict.
            </p>
          </div>
        </div>
      </div>

      {/* Stock Manager Table (`wp-list-table` style) */}
      <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#2c3338] font-semibold select-none">
              <th className="p-2.5 w-14">Image</th>
              <th className="p-2.5">Product Title</th>
              <th className="p-2.5">SKU</th>
              <th className="p-2.5">Current Stock</th>
              <th className="p-2.5">Status</th>
              <th className="p-2.5">Quick Presets</th>
              <th className="p-2.5 w-44">Adjust Quantity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f1]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-400">
                  Loading inventory data...
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const currentQty =
                  stockInputs[p.id] !== undefined ? stockInputs[p.id] : p.stockAvailable;
                const isOneUnit = p.stockAvailable === 1;
                const isOutOfStock = p.stockAvailable <= 0;

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-[#f6f7f7] transition ${
                      isOneUnit ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="p-2.5">
                      <img
                        src={p.imageUrl || '/images/image_1.webp'}
                        alt={p.title}
                        className="w-10 h-10 object-cover rounded border border-gray-200 bg-gray-50"
                      />
                    </td>
                    <td className="p-2.5 font-medium text-[#1d2327]">
                      <div>{p.title}</div>
                      {p.id === 4 && (
                        <span className="inline-block mt-0.5 text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
                          Concurrency Test Target
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 font-mono text-[#50575e]">{p.sku}</td>
                    <td className="p-2.5 font-bold text-sm text-[#1d2327]">
                      {p.stockAvailable}
                    </td>
                    <td className="p-2.5">
                      {isOutOfStock ? (
                        <span className="text-[#d63638] font-bold">Out of Stock</span>
                      ) : isOneUnit ? (
                        <span className="text-[#b28209] font-bold">1 Unit (Locked)</span>
                      ) : p.stockAvailable <= 5 ? (
                        <span className="text-[#b28209] font-semibold">Low Stock</span>
                      ) : (
                        <span className="text-[#00a32a] font-semibold">In Stock</span>
                      )}
                    </td>
                    <td className="p-2.5">
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => handleQuickPreset(p.id, 1)}
                          className="bg-[#f0f0f1] hover:bg-[#2271b1] hover:text-white text-[#2c3338] px-2 py-0.5 rounded text-[11px] font-semibold transition"
                          title="Set to 1 unit to test locking"
                        >
                          1 Unit
                        </button>
                        <button
                          onClick={() => handleQuickPreset(p.id, 0)}
                          className="bg-[#f0f0f1] hover:bg-[#d63638] hover:text-white text-[#2c3338] px-2 py-0.5 rounded text-[11px] font-semibold transition"
                          title="Set to 0 (out of stock)"
                        >
                          0 Units
                        </button>
                        <button
                          onClick={() => handleQuickPreset(p.id, 50)}
                          className="bg-[#f0f0f1] hover:bg-[#00a32a] hover:text-white text-[#2c3338] px-2 py-0.5 rounded text-[11px] font-semibold transition"
                          title="Set to 50 (in stock)"
                        >
                          50 Units
                        </button>
                      </div>
                    </td>
                    <td className="p-2.5">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          value={currentQty}
                          onChange={(e) =>
                            handleStockInputChange(p.id, Number.parseInt(e.target.value, 10) || 0)
                          }
                          className="w-16 border border-[#8c8f94] rounded px-2 py-1 text-xs outline-none bg-white text-center font-bold"
                        />
                        <button
                          onClick={() => handleApplySingle(p.id)}
                          disabled={updateMutation.isPending}
                          className="border border-[#2271b1] text-[#2271b1] hover:bg-[#2271b1] hover:text-white px-2.5 py-1 rounded text-xs font-semibold transition"
                        >
                          Save
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
