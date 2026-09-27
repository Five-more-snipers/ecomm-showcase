'use client';

import React from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryBar from '@/components/home/CategoryBar';
import ProductGrid from '@/components/home/ProductGrid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCategories, fetchProducts, seedPresetCart } from '@/lib/api';
import { useCatalogFilterStore } from '@/stores/useCatalogFilterStore';
import { useCartStore } from '@/stores/useCartStore';
import { AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, resetFilters } =
    useCatalogFilterStore();
  const { cartId, openCart } = useCartStore();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: productData, isLoading } = useQuery({
    queryKey: ['products', selectedCategory, searchTerm],
    queryFn: () =>
      fetchProducts({
        category: selectedCategory || undefined,
        search: searchTerm || undefined,
        size: 20,
      }),
  });

  const seedPresetMutation = useMutation({
    mutationFn: () => seedPresetCart(cartId),
    onSuccess: (seededCart) => {
      queryClient.setQueryData(['cart', cartId], seededCart);
      queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
      openCart();
    },
  });

  const products = productData?.content || [];

  return (
    <main className="min-h-screen bg-white">
      <HeroBanner />

      <div className="site-container">
        {/* Tester Guidance Note with 1-Click Preset Action */}
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-md p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Concurrency & Stock Testing:</strong> Item{' '}
              <span className="font-semibold underline">Artisan Vintage Leather Weekender</span> has{' '}
              <span className="text-red-600 font-bold">only 1 unit in stock</span>. Order it to test backend pessimistic inventory locks and rollback validation!
            </div>
          </div>

          <button
            onClick={() => seedPresetMutation.mutate()}
            disabled={seedPresetMutation.isPending}
            className="self-start md:self-auto bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold uppercase tracking-wider text-[11px] px-4 py-2 rounded shadow flex items-center gap-1.5 transition flex-shrink-0"
            title="Populate cart with preset items ($273.99) and open drawer"
          >
            <Sparkles size={13} className="text-amber-800" />
            <span>{seedPresetMutation.isPending ? 'Loading...' : '⚡ Try Preset Demo Cart ($273.99)'}</span>
          </button>
        </div>

        {/* New Arrival Header with Horizontal Divider Line */}
        <section id="catalog-section" className="mb-16">
          <div className="relative flex items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-market-black font-sans tracking-tight whitespace-nowrap bg-white pr-4 z-10">
              {selectedCategory
                ? `${categories.find((c) => c.slug === selectedCategory)?.name || 'Filtered'} Products`
                : searchTerm
                ? `Search: "${searchTerm}"`
                : 'New Arrival'}
            </h2>

            {/* Middle Horizontal Line */}
            <div className="hidden sm:block flex-1 h-[1px] bg-[#d5d4d4]" />

            <button
              onClick={resetFilters}
              className="border border-[#252525] text-[#252525] hover:bg-[#252525] hover:text-white font-medium text-xs uppercase px-6 py-2 rounded transition whitespace-nowrap bg-white pl-4 z-10"
            >
              VIEW ALL
            </button>
          </div>

          <CategoryBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <ProductGrid products={products} isLoading={isLoading} />
        </section>
      </div>
    </main>
  );
}
