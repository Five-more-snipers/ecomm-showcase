'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  Boxes,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  SlidersHorizontal,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, fetchCategories, fetchAdminOrders, updateAdminInventory } from '@/lib/api';
import { useSimulatorStore } from '@/stores/useSimulatorStore';

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const { simulationMode, setSimulationMode } = useSimulatorStore();
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const { data: productData } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts({ size: 100 }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: fetchAdminOrders,
  });

  const products = productData?.content || [];
  const lowStockCount = products.filter((p) => p.stockAvailable <= 5).length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const setStockMutation = useMutation({
    mutationFn: ({ productId, qty }: { productId: number; qty: number }) =>
      updateAdminInventory(productId, qty),
    onSuccess: (updatedQty, vars) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setSuccessNotice(`Inventory for product #${vars.productId} updated to ${updatedQty} units!`);
      setTimeout(() => setSuccessNotice(null), 4000);
    },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* WordPress Admin Title */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-normal text-[#1d2327]">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="border border-[#2271b1] bg-[#f6f7f7] text-[#2271b1] hover:bg-[#2271b1] hover:text-white rounded text-xs px-3 py-1.5 transition font-semibold flex items-center gap-1"
          >
            <Plus size={14} />
            <span>Add New Product</span>
          </Link>
          <Link
            href="/"
            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs px-3 py-1.5 rounded transition font-semibold flex items-center gap-1 shadow-sm"
          >
            <span>Visit Storefront</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* WordPress Classic Notice Banner */}
      {successNotice && (
        <div className="bg-white border-l-4 border-l-[#00a32a] border border-[#c3c4c7] p-3 shadow-sm text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1d2327]">
            <CheckCircle2 size={16} className="text-[#00a32a]" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice(null)} className="text-gray-400 hover:text-black">
            &times;
          </button>
        </div>
      )}

      {/* WordPress Welcome Panel */}
      <div className="bg-white border border-[#c3c4c7] p-6 shadow-sm rounded-sm">
        <div className="max-w-3xl">
          <h2 className="text-xl font-medium text-[#1d2327] mb-2">
            Welcome to the WordPress-Style Back Office!
          </h2>
          <p className="text-xs text-[#50575e] leading-relaxed mb-4">
            Configure live store values behind the scenes: adjust product prices and titles, simulate concurrency locking by limiting inventory, review WooCommerce-style customer orders, and alter payment simulation rules.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <Link
              href="/admin/products"
              className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3.5 py-1.5 rounded transition flex items-center gap-1.5"
            >
              <Package size={14} />
              <span>Manage Products & Prices</span>
            </Link>
            <Link
              href="/admin/inventory"
              className="text-[#2271b1] hover:underline flex items-center gap-1"
            >
              <Boxes size={14} />
              <span>Configure Stock & Locks</span>
            </Link>
            <Link
              href="/admin/orders"
              className="text-[#2271b1] hover:underline flex items-center gap-1"
            >
              <ShoppingCart size={14} />
              <span>Inspect Orders ({orders.length})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard 2-Column Grid of WordPress Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Widget 1: At a Glance (Iconic WordPress Dashboard Widget) */}
        <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm">
          <div className="px-4 py-3 border-b border-[#f0f0f1] font-semibold text-sm text-[#1d2327] flex items-center justify-between">
            <span>At a Glance</span>
            <span className="text-[11px] text-gray-400 font-normal">WordPress 6.5 / WooCommerce</span>
          </div>
          <div className="p-4 space-y-4 text-xs text-[#50575e]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-[#f0f0f1]">
              <div className="p-3 bg-[#f6f7f7] rounded border border-[#dcdcde]">
                <div className="text-gray-500 font-medium">Products</div>
                <div className="text-xl font-bold text-[#1d2327] mt-0.5">{products.length}</div>
              </div>
              <div className="p-3 bg-[#f6f7f7] rounded border border-[#dcdcde]">
                <div className="text-gray-500 font-medium">Categories</div>
                <div className="text-xl font-bold text-[#1d2327] mt-0.5">{categories.length}</div>
              </div>
              <div className="p-3 bg-[#f6f7f7] rounded border border-[#dcdcde]">
                <div className="text-gray-500 font-medium">Total Orders</div>
                <div className="text-xl font-bold text-[#1d2327] mt-0.5">{orders.length}</div>
              </div>
              <div className="p-3 bg-[#f6f7f7] rounded border border-[#dcdcde]">
                <div className="text-gray-500 font-medium">Gross Sales</div>
                <div className="text-xl font-bold text-[#00a32a] mt-0.5">${totalRevenue.toFixed(2)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#00a32a]" />
                <span>All backend systems operational (Spring Boot + Oracle/H2)</span>
              </div>
              {lowStockCount > 0 && (
                <Link
                  href="/admin/inventory"
                  className="text-[#d63638] font-semibold hover:underline flex items-center gap-1"
                >
                  <AlertTriangle size={13} />
                  <span>{lowStockCount} Low Stock Alert</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Widget 2: Concurrency & Inventory Control */}
        <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm">
          <div className="px-4 py-3 border-b border-[#f0f0f1] font-semibold text-sm text-[#1d2327] flex items-center justify-between">
            <span>Behind-the-Scenes Stock & Concurrency Controls</span>
            <Boxes size={16} className="text-[#2271b1]" />
          </div>
          <div className="p-4 space-y-3 text-xs text-[#50575e]">
            <p className="leading-relaxed">
              Use these quick buttons to simulate backend concurrency locking, race conditions, or inventory exhaustion without writing code:
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-[#f6f7f7] border border-[#dcdcde] rounded">
                <div>
                  <strong className="text-[#1d2327] block">Artisan Leather Weekender (ID: 4)</strong>
                  <span className="text-[11px] text-gray-500">
                    Currently: {products.find((p) => p.id === 4)?.stockAvailable ?? 1} in stock
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setStockMutation.mutate({ productId: 4, qty: 1 })}
                    disabled={setStockMutation.isPending}
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white px-2.5 py-1 rounded text-[11px] font-semibold transition"
                    title="Set stock to 1 unit to test pessimistic locking"
                  >
                    Set to 1 (Lock Test)
                  </button>
                  <button
                    onClick={() => setStockMutation.mutate({ productId: 4, qty: 25 })}
                    disabled={setStockMutation.isPending}
                    className="border border-[#c3c4c7] bg-white hover:bg-gray-100 text-[#2c3338] px-2.5 py-1 rounded text-[11px] font-semibold transition"
                  >
                    Replenish (25)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#f6f7f7] border border-[#dcdcde] rounded">
                <div>
                  <strong className="text-[#1d2327] block">Aura Headphones (ID: 1)</strong>
                  <span className="text-[11px] text-gray-500">
                    Currently: {products.find((p) => p.id === 1)?.stockAvailable ?? 50} in stock
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setStockMutation.mutate({ productId: 1, qty: 0 })}
                    disabled={setStockMutation.isPending}
                    className="border border-[#d63638] text-[#d63638] hover:bg-red-50 px-2.5 py-1 rounded text-[11px] font-semibold transition"
                    title="Set to 0 to test out-of-stock validation"
                  >
                    Set Out of Stock
                  </button>
                  <button
                    onClick={() => setStockMutation.mutate({ productId: 1, qty: 50 })}
                    disabled={setStockMutation.isPending}
                    className="border border-[#c3c4c7] bg-white hover:bg-gray-100 text-[#2c3338] px-2.5 py-1 rounded text-[11px] font-semibold transition"
                  >
                    Reset (50)
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <Link href="/admin/inventory" className="text-[#2271b1] font-semibold hover:underline">
                Open Full Stock Manager &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Widget 3: Quick Payment Simulator Settings */}
        <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm">
          <div className="px-4 py-3 border-b border-[#f0f0f1] font-semibold text-sm text-[#1d2327] flex items-center justify-between">
            <span>Payment Simulation Mode</span>
            <SlidersHorizontal size={16} className="text-[#dba617]" />
          </div>
          <div className="p-4 space-y-3 text-xs text-[#50575e]">
            <p className="leading-relaxed">
              Configure how simulated checkouts behave for all users testing the frontend:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSimulationMode('AUTO')}
                className={`p-2.5 rounded border text-left transition ${
                  simulationMode === 'AUTO'
                    ? 'border-[#2271b1] bg-blue-50 font-bold text-[#2271b1]'
                    : 'border-[#dcdcde] bg-[#f6f7f7] hover:bg-gray-100 text-[#2c3338]'
                }`}
              >
                <div className="font-semibold">Auto (Card Ending)</div>
                <div className="text-[10px] text-gray-500 font-normal">
                  4242=Pass, 0002=Fail, 0004=Timeout
                </div>
              </button>

              <button
                onClick={() => setSimulationMode('FORCE_SUCCESS')}
                className={`p-2.5 rounded border text-left transition ${
                  simulationMode === 'FORCE_SUCCESS'
                    ? 'border-[#00a32a] bg-green-50 font-bold text-[#00a32a]'
                    : 'border-[#dcdcde] bg-[#f6f7f7] hover:bg-gray-100 text-[#2c3338]'
                }`}
              >
                <div className="font-semibold text-green-700">Force Success</div>
                <div className="text-[10px] text-gray-500 font-normal">
                  Always approve payments immediately
                </div>
              </button>

              <button
                onClick={() => setSimulationMode('FORCE_DECLINE')}
                className={`p-2.5 rounded border text-left transition ${
                  simulationMode === 'FORCE_DECLINE'
                    ? 'border-[#d63638] bg-red-50 font-bold text-[#d63638]'
                    : 'border-[#dcdcde] bg-[#f6f7f7] hover:bg-gray-100 text-[#2c3338]'
                }`}
              >
                <div className="font-semibold text-red-700">Force Decline</div>
                <div className="text-[10px] text-gray-500 font-normal">
                  Simulate card decline & test rollback
                </div>
              </button>

              <button
                onClick={() => setSimulationMode('FORCE_TIMEOUT')}
                className={`p-2.5 rounded border text-left transition ${
                  simulationMode === 'FORCE_TIMEOUT'
                    ? 'border-[#dba617] bg-amber-50 font-bold text-[#b28209]'
                    : 'border-[#dcdcde] bg-[#f6f7f7] hover:bg-gray-100 text-[#2c3338]'
                }`}
              >
                <div className="font-semibold text-amber-700">Force Timeout</div>
                <div className="text-[10px] text-gray-500 font-normal">
                  Simulate gateway network timeout
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Widget 4: Recent WooCommerce Orders */}
        <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm">
          <div className="px-4 py-3 border-b border-[#f0f0f1] font-semibold text-sm text-[#1d2327] flex items-center justify-between">
            <span>Recent Orders</span>
            <Link href="/admin/orders" className="text-xs text-[#2271b1] font-normal hover:underline">
              View All Orders &rarr;
            </Link>
          </div>
          <div className="p-4 text-xs">
            {orders.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                No orders placed yet. Place an order on the storefront to see it here!
              </div>
            ) : (
              <div className="divide-y divide-[#f0f0f1]">
                {orders.slice(0, 4).map((order) => (
                  <div key={order.orderNumber} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#1d2327]">{order.orderNumber}</div>
                      <div className="text-[11px] text-gray-500">
                        {order.customerName} &bull; {order.items.length} items
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#1d2327]">${order.total?.toFixed(2)}</div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-green-100 text-green-800">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
