'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Truck, SlidersHorizontal, Sparkles, Settings } from 'lucide-react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCartStore } from '@/stores/useCartStore';
import { seedPresetCart } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function TopBar() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const simulationMode = useSimulatorStore((s) => s.simulationMode);
  const openOrderModal = useSimulatorStore((s) => s.openOrderModal);
  const activeOrderNumber = useSimulatorStore((s) => s.activeOrderNumber);
  const { cartId, openCart } = useCartStore();
  const queryClient = useQueryClient();

  const seedPresetMutation = useMutation({
    mutationFn: () => seedPresetCart(cartId),
    onSuccess: (seededCart) => {
      queryClient.setQueryData(['cart', cartId], seededCart);
      queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
      openCart();
    },
  });

  const handleTrackOrder = () => {
    const defaultOrder = activeOrderNumber || 'ORD-2026-DEMO01';
    const input = prompt(
      'Enter your Order Number to track (a demo order number is pre-filled for you):',
      defaultOrder
    );
    if (input && input.trim()) {
      openOrderModal(input.trim());
    }
  };

  return (
    <div className="bg-market-yellow text-market-black py-2 text-xs font-semibold border-b border-market-yellowDark">
      <div className="site-container flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3 tracking-wide">
          <span>WELCOME TO WORLDWIDE ECOMMERCE MARKETPLACE.</span>
          <span className="hidden sm:inline text-black/30">|</span>
          <button
            onClick={() => seedPresetMutation.mutate()}
            disabled={seedPresetMutation.isPending}
            className="hidden sm:flex items-center gap-1 bg-black/10 hover:bg-black/20 text-market-black px-2 py-0.5 rounded text-[11px] font-bold transition"
            title="Preload standard demo items with prices and stock"
          >
            <Sparkles size={11} className="text-amber-800" />
            <span>{seedPresetMutation.isPending ? 'Loading...' : '⚡ Try Demo Preset ($273.99)'}</span>
          </button>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden md:flex items-center gap-1.5">
            <MapPin size={13} className="text-market-black" />
            <span>Melbourne, Australia</span>
          </div>

          <button
            onClick={handleTrackOrder}
            className="flex items-center gap-1.5 hover:underline font-semibold"
            title="Track order with demo or custom order number"
          >
            <Truck size={13} className="text-market-black" />
            <span>Track Order (Demo Preset)</span>
          </button>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 bg-black/10 hover:bg-black/20 text-market-black px-2.5 py-0.5 rounded text-[11px] font-bold transition"
            title="Open WordPress-style Back Office Dashboard"
          >
            <Settings size={12} />
            <span>WP Admin</span>
          </Link>

          <div className="flex items-center gap-1.5 bg-black/10 px-2 py-0.5 rounded text-[11px] font-bold">
            <SlidersHorizontal size={11} />
            <span>Sim: {simulationMode}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
