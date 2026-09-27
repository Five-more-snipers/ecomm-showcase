'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  ChevronDown,
  X,
  ShoppingCart,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Sparkles,
  Package,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, fetchCategories, addToCart } from '@/lib/api';
import { useCartStore } from '@/stores/useCartStore';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCatalogFilterStore } from '@/stores/useCatalogFilterStore';
import { Product } from '@/types';

export default function CatalogPage() {
  const queryClient = useQueryClient();
  const { cartId, openCart } = useCartStore();
  const { openQuickView } = useSimulatorStore();
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, resetFilters } =
    useCatalogFilterStore();

  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in_stock' | 'limited'>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const { data: productData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts({ size: 100 }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const allProducts = productData?.content || [];

  const addMutation = useMutation({
    mutationFn: (productId: number) => addToCart(cartId, productId, 1),
    onSuccess: (updatedCart, productId) => {
      queryClient.setQueryData(['cart', cartId], updatedCart);
      queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
      const addedProduct = allProducts.find((p) => p.id === productId);
      setAddedNotice(`Added "${addedProduct?.title || 'Item'}" to your cart!`);
      setTimeout(() => setAddedNotice(null), 3000);
      openCart();
    },
  });

  // Category counts map
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach((p) => {
      if (p.category?.slug) {
        counts[p.category.slug] = (counts[p.category.slug] || 0) + 1;
      }
    });
    return counts;
  }, [allProducts]);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // 1. Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // 2. Category filter
    if (selectedCategory) {
      result = result.filter((p) => p.category?.slug === selectedCategory);
    }

    // 3. Price preset filter
    if (priceFilter === 'under_50') {
      result = result.filter((p) => p.price < 50);
    } else if (priceFilter === '50_100') {
      result = result.filter((p) => p.price >= 50 && p.price <= 100);
    } else if (priceFilter === '100_200') {
      result = result.filter((p) => p.price >= 100 && p.price <= 200);
    } else if (priceFilter === 'over_200') {
      result = result.filter((p) => p.price > 200);
    } else if (priceFilter === 'custom') {
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    // 4. Availability filter
    if (availabilityFilter === 'in_stock') {
      result = result.filter((p) => p.stockAvailable > 0);
    } else if (availabilityFilter === 'limited') {
      result = result.filter((p) => p.stockAvailable <= 5 && p.stockAvailable > 0);
    }

    // 5. Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'stock_desc') {
      result.sort((a, b) => b.stockAvailable - a.stockAvailable);
    } else {
      // Featured: featured first, then ID
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [allProducts, searchTerm, selectedCategory, priceFilter, minPrice, maxPrice, availabilityFilter, sortBy]);

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (searchTerm ? 1 : 0) +
    (priceFilter !== 'all' ? 1 : 0) +
    (availabilityFilter !== 'all' ? 1 : 0);

  const clearAllFilters = () => {
    resetFilters();
    setPriceFilter('all');
    setMinPrice('');
    setMaxPrice('');
    setAvailabilityFilter('all');
    setSortBy('featured');
  };

  return (
    <main className="min-h-screen bg-[#fafafa] pb-24">
      {/* Top Breadcrumb & Title Bar */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="site-container">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Product Catalog</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-market-black font-sans tracking-tight">
                {selectedCategory
                  ? categories.find((c) => c.slug === selectedCategory)?.name || 'Filtered'
                  : 'All Products'}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Showing {filteredProducts.length} of {allProducts.length} curated essentials
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden bg-market-yellow text-market-black font-bold text-xs px-4 py-2 rounded flex items-center gap-2 shadow-sm"
            >
              <Filter size={14} />
              <span>Filters ({activeFiltersCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Added to Cart Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1c1c] text-white px-5 py-3 rounded-lg shadow-2xl border border-market-yellow flex items-center gap-3 text-xs animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 size={18} className="text-market-yellow" />
          <span>{addedNotice}</span>
        </div>
      )}

      <div className="site-container pt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ========================================================= */}
          {/* 1. Desktop Filter Sidebar */}
          {/* ========================================================= */}
          <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:block space-y-6">
            {/* Active Filters Clear Box */}
            {activeFiltersCount > 0 && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-market-black uppercase tracking-wider">
                  <span>Active Filters ({activeFiltersCount})</span>
                  <button
                    onClick={clearAllFilters}
                    className="text-red-600 hover:underline text-[11px] font-normal"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-[11px] px-2 py-0.5 rounded">
                      {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                      <button onClick={() => setSelectedCategory('')} className="hover:text-red-600">
                        &times;
                      </button>
                    </span>
                  )}
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-[11px] px-2 py-0.5 rounded">
                      &ldquo;{searchTerm}&rdquo;
                      <button onClick={() => setSearchTerm('')} className="hover:text-red-600">
                        &times;
                      </button>
                    </span>
                  )}
                  {priceFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-[11px] px-2 py-0.5 rounded">
                      Price filter
                      <button onClick={() => setPriceFilter('all')} className="hover:text-red-600">
                        &times;
                      </button>
                    </span>
                  )}
                  {availabilityFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-[11px] px-2 py-0.5 rounded">
                      {availabilityFilter === 'in_stock' ? 'In Stock' : 'Limited Stock'}
                      <button onClick={() => setAvailabilityFilter('all')} className="hover:text-red-600">
                        &times;
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Categories Filter Block */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-bold text-xs uppercase tracking-wider text-market-black mb-3 border-b border-gray-100 pb-2">
                Categories
              </h3>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left py-1.5 px-2 rounded flex items-center justify-between transition ${
                    selectedCategory === ''
                      ? 'bg-market-yellowLight font-bold text-market-black'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[11px] text-gray-400 font-mono">({allProducts.length})</span>
                </button>
                {categories.map((c) => {
                  const count = categoryCounts[c.slug] || 0;
                  const isSelected = selectedCategory === c.slug;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full text-left py-1.5 px-2 rounded flex items-center justify-between transition ${
                        isSelected
                          ? 'bg-market-yellowLight font-bold text-market-black'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-[11px] text-gray-400 font-mono">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter Block */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-bold text-xs uppercase tracking-wider text-market-black mb-3 border-b border-gray-100 pb-2">
                Price Range
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under_50', label: 'Under $50' },
                  { id: '50_100', label: '$50 to $100' },
                  { id: '100_200', label: '$100 to $200' },
                  { id: 'over_200', label: '$200 & Above' },
                  { id: 'custom', label: 'Custom Range' },
                ].map((tier) => (
                  <label key={tier.id} className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input
                      type="radio"
                      name="priceTier"
                      checked={priceFilter === tier.id}
                      onChange={() => setPriceFilter(tier.id)}
                      className="text-market-yellowDark focus:ring-0"
                    />
                    <span>{tier.label}</span>
                  </label>
                ))}

                {priceFilter === 'custom' && (
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-xs outline-none"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-xs outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Availability Filter Block */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-bold text-xs uppercase tracking-wider text-market-black mb-3 border-b border-gray-100 pb-2">
                Availability
              </h3>
              <div className="space-y-2 text-xs text-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availTier"
                    checked={availabilityFilter === 'all'}
                    onChange={() => setAvailabilityFilter('all')}
                    className="text-market-yellowDark focus:ring-0"
                  />
                  <span>All Products</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availTier"
                    checked={availabilityFilter === 'in_stock'}
                    onChange={() => setAvailabilityFilter('in_stock')}
                    className="text-market-yellowDark focus:ring-0"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availTier"
                    checked={availabilityFilter === 'limited'}
                    onChange={() => setAvailabilityFilter('limited')}
                    className="text-market-yellowDark focus:ring-0"
                  />
                  <span className="flex items-center gap-1">
                    <span>Rare / Limited Stock (&le; 5)</span>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* ========================================================= */}
          {/* 2. Main Product Content Area */}
          {/* ========================================================= */}
          <div className="flex-1 space-y-6">
            {/* Sorting & View Controls Bar */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <SlidersHorizontal size={14} className="text-gray-500" />
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-2.5 py-1 text-xs outline-none bg-white text-gray-800 font-semibold cursor-pointer"
                >
                  <option value="featured">Featured & Best Matches</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Product Name: A to Z</option>
                  <option value="stock_desc">Highest Stock Available</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 border border-gray-200 rounded p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition ${
                    viewMode === 'grid' ? 'bg-market-yellow text-market-black' : 'text-gray-400 hover:text-black'
                  }`}
                  title="Grid View"
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition ${
                    viewMode === 'list' ? 'bg-market-yellow text-market-black' : 'text-gray-400 hover:text-black'
                  }`}
                  title="List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>

            {/* Product Display */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse space-y-3">
                    <div className="w-full aspect-[4/5] bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center my-6 space-y-3">
                <Package size={44} className="mx-auto text-gray-300" />
                <h3 className="text-base font-bold text-gray-800">No matching products found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try adjusting your price range, clearing your search keyword, or selecting a different category.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold uppercase text-xs px-4 py-2 rounded transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((p) => {
                  const isRare = p.stockAvailable <= 1;
                  return (
                    <div
                      key={p.id}
                      className="group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-market-yellowDark/40 transition flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                        <img
                          src={p.imageUrl || '/images/image_1.webp'}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Stock Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                          {isRare ? (
                            <span className="bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow">
                              Only 1 Unit Left!
                            </span>
                          ) : p.stockAvailable <= 5 ? (
                            <span className="bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow">
                              Low Stock ({p.stockAvailable})
                            </span>
                          ) : null}

                          {p.isFeatured && (
                            <span className="bg-market-yellow text-market-black font-bold text-[10px] px-2 py-0.5 rounded shadow">
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Quick View Button */}
                        <button
                          onClick={() => openQuickView(p.id)}
                          className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-black flex items-center justify-center shadow-md transition opacity-0 group-hover:opacity-100"
                          title="Quick View"
                        >
                          <Eye size={15} />
                        </button>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                            {p.category?.name || 'Accessories'}
                          </div>
                          <h3 className="font-bold text-sm text-market-black line-clamp-2 mb-2 group-hover:text-amber-700 transition">
                            {p.title}
                          </h3>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <span className="text-base font-extrabold text-market-black">
                              ${p.price.toFixed(2)}
                            </span>
                          </div>

                          <button
                            onClick={() => addMutation.mutate(p.id)}
                            disabled={addMutation.isPending || p.stockAvailable <= 0}
                            className="bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold uppercase text-[11px] px-3.5 py-1.5 rounded transition flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <ShoppingCart size={13} />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-4">
                {filteredProducts.map((p) => {
                  const isRare = p.stockAvailable <= 1;
                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-5 items-center"
                    >
                      <div className="relative w-36 aspect-[4/5] bg-gray-50 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={p.imageUrl || '/images/image_1.webp'}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                        {isRare && (
                          <span className="absolute top-1.5 left-1.5 bg-red-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded">
                            Rare (1 left)
                          </span>
                        )}
                      </div>

                      <div className="flex-1 space-y-2 text-left">
                        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          {p.category?.name} &bull; SKU: <span className="font-mono">{p.sku}</span>
                        </div>
                        <h3 className="font-bold text-base text-market-black">{p.title}</h3>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                        <div className="text-xs text-gray-500">
                          Availability:{' '}
                          <strong className={p.stockAvailable > 5 ? 'text-green-600' : 'text-amber-600'}>
                            {p.stockAvailable} units in stock
                          </strong>
                        </div>
                      </div>

                      <div className="sm:border-l sm:border-gray-100 sm:pl-6 flex flex-col items-center sm:items-end justify-center gap-3 flex-shrink-0">
                        <div className="text-xl font-bold text-market-black">
                          ${p.price.toFixed(2)}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openQuickView(p.id)}
                            className="border border-gray-300 hover:bg-gray-100 text-gray-700 p-2 rounded text-xs transition"
                            title="Quick View"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() => addMutation.mutate(p.id)}
                            disabled={addMutation.isPending || p.stockAvailable <= 0}
                            className="bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold uppercase text-xs px-4 py-2 rounded transition flex items-center gap-1.5 shadow"
                          >
                            <ShoppingCart size={14} />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
