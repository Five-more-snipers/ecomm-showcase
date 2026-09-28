'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, fetchCategories, updateAdminProduct, deleteAdminProduct } from '@/lib/api';
import { Product } from '@/types';

const FILTER_ACTIVE_CLASS = 'font-bold text-[#1d2327]';
const FILTER_HOVER_CLASS = 'hover:text-[#2271b1]';

function renderStockBadge(stockAvailable: number) {
  if (stockAvailable <= 0) {
    return <span className="text-[#d63638] font-bold">Out of stock (0)</span>;
  }
  if (stockAvailable <= 5) {
    return (
      <span className="text-[#b28209] font-bold">
        Low stock ({stockAvailable})
      </span>
    );
  }
  return (
    <span className="text-[#00a32a] font-semibold">
      In stock ({stockAvailable})
    </span>
  );
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [quickEditProduct, setQuickEditProduct] = useState<Product | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Quick edit form state
  const [qeTitle, setQeTitle] = useState('');
  const [qePrice, setQePrice] = useState<number>(0);
  const [qeSku, setQeSku] = useState('');
  const [qeStock, setQeStock] = useState<number>(0);
  const [qeCategoryId, setQeCategoryId] = useState<number>(1);
  const [qeIsFeatured, setQeIsFeatured] = useState(false);

  const { data: productData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts({ size: 100 }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const products = productData?.content || [];

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateAdminProduct(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setQuickEditProduct(null);
      setNotice(`Product "${updated.title}" updated successfully!`);
      setTimeout(() => setNotice(null), 4000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAdminProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setNotice('Product moved to trash / deactivated.');
      setTimeout(() => setNotice(null), 4000);
    },
  });

  const handleOpenQuickEdit = (product: Product) => {
    setQuickEditProduct(product);
    setQeTitle(product.title);
    setQePrice(product.price);
    setQeSku(product.sku);
    setQeStock(product.stockAvailable);
    setQeCategoryId(product.category?.id || 1);
    setQeIsFeatured(product.isFeatured);
  };

  const handleSaveQuickEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEditProduct) return;
    updateMutation.mutate({
      id: quickEditProduct.id,
      data: {
        title: qeTitle,
        price: Number(qePrice),
        sku: qeSku,
        stockQuantity: Number(qeStock),
        categoryId: Number(qeCategoryId),
        isFeatured: qeIsFeatured,
      },
    });
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = !selectedCategory || p.category?.slug === selectedCategory;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'instock' && p.stockAvailable > 5) ||
      (stockFilter === 'lowstock' && p.stockAvailable <= 5 && p.stockAvailable > 0) ||
      (stockFilter === 'outofstock' && p.stockAvailable <= 0);

    return matchesSearch && matchesCat && matchesStock;
  });

  return (
    <div className="space-y-4 max-w-7xl">
      {/* Page Title & Add New Button (WordPress signature style) */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-normal text-[#1d2327]">Products</h1>
        <Link
          href="/admin/products/new"
          className="border border-[#2271b1] bg-[#f6f7f7] text-[#2271b1] hover:bg-[#2271b1] hover:text-white rounded text-xs px-2.5 py-1 transition font-semibold"
        >
          Add New Product
        </Link>
      </div>

      {/* WordPress Notice Banner */}
      {notice && (
        <div className="bg-white border-l-4 border-l-[#00a32a] border border-[#c3c4c7] p-3 shadow-sm text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1d2327]">
            <CheckCircle2 size={16} className="text-[#00a32a]" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-gray-400 hover:text-black">
            &times;
          </button>
        </div>
      )}

      {/* Subsubsub Filters (WordPress classic All | In stock | Low stock) */}
      <div className="flex items-center gap-2 text-xs text-[#50575e] pt-1 border-b border-[#dcdcde] pb-2">
        <button
          onClick={() => setStockFilter('all')}
          className={`${stockFilter === 'all' ? FILTER_ACTIVE_CLASS : FILTER_HOVER_CLASS}`}
        >
          All ({products.length})
        </button>
        <span>|</span>
        <button
          onClick={() => setStockFilter('instock')}
          className={`${stockFilter === 'instock' ? FILTER_ACTIVE_CLASS : FILTER_HOVER_CLASS}`}
        >
          In Stock ({products.filter((p) => p.stockAvailable > 5).length})
        </button>
        <span>|</span>
        <button
          onClick={() => setStockFilter('lowstock')}
          className={`${stockFilter === 'lowstock' ? FILTER_ACTIVE_CLASS : FILTER_HOVER_CLASS}`}
        >
          Low Stock ({products.filter((p) => p.stockAvailable <= 5 && p.stockAvailable > 0).length})
        </button>
        <span>|</span>
        <button
          onClick={() => setStockFilter('outofstock')}
          className={`${stockFilter === 'outofstock' ? FILTER_ACTIVE_CLASS : FILTER_HOVER_CLASS}`}
        >
          Out of Stock ({products.filter((p) => p.stockAvailable <= 0).length})
        </button>
      </div>

      {/* Filter and Search Bar (Classic wp-list-table header) */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-[#8c8f94] rounded bg-white px-2.5 py-1 text-xs text-[#2c3338] outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="border border-[#8c8f94] rounded bg-white px-2.5 py-1 text-xs text-[#2c3338] outline-none"
          >
            <option value="all">Filter by stock status</option>
            <option value="instock">In stock</option>
            <option value="lowstock">Low stock (&le; 5)</option>
            <option value="outofstock">Out of stock</option>
          </select>

          <button
            onClick={() => { }}
            className="border border-[#2271b1] text-[#2271b1] bg-[#f6f7f7] hover:bg-[#2271b1] hover:text-white px-3 py-1 rounded font-semibold transition"
          >
            Filter
          </button>
        </div>

        {/* Search Box */}
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-[#8c8f94] rounded px-2.5 py-1 text-xs outline-none bg-white text-[#2c3338]"
          />
          <button
            onClick={() => { }}
            className="border border-[#2271b1] text-[#2271b1] bg-[#f6f7f7] hover:bg-[#2271b1] hover:text-white px-3 py-1 rounded font-semibold transition flex items-center gap-1"
          >
            <Search size={12} />
            <span>Search Products</span>
          </button>
        </div>
      </div>

      {/* WordPress List Table (`.wp-list-table`) */}
      <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#2c3338] font-semibold select-none">
              <th className="p-2.5 w-8 text-center">
                <input type="checkbox" className="rounded border-[#8c8f94]" />
              </th>
              <th className="p-2.5 w-14">Image</th>
              <th className="p-2.5">Name</th>
              <th className="p-2.5">SKU</th>
              <th className="p-2.5">Stock</th>
              <th className="p-2.5">Price</th>
              <th className="p-2.5">Categories</th>
              <th className="p-2.5">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f1]">
            {(() => {
              if (isLoading) {
                return (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-400">
                      Loading products...
                    </td>
                  </tr>
                );
              }
              if (filteredProducts.length === 0) {
                return (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      No products found.
                    </td>
                  </tr>
                );
              }
              return filteredProducts.map((p) => {
                const isQuickEditing = quickEditProduct?.id === p.id;
                // const isLowStock = p.stockAvailable <= 5;
                // const isOutOfStock = p.stockAvailable <= 0;

                return (
                  <React.Fragment key={p.id}>
                    <tr className="group hover:bg-[#f6f7f7] transition">
                      <td className="p-2.5 text-center">
                        <input type="checkbox" className="rounded border-[#8c8f94]" />
                      </td>
                      <td className="p-2.5">
                        <img
                          src={p.imageUrl || '/images/image_1.webp'}
                          alt={p.title}
                          className="w-10 h-10 object-cover rounded border border-gray-200 bg-gray-50"
                        />
                      </td>
                      <td className="p-2.5">
                        <div className="font-semibold text-[#2271b1] hover:underline cursor-pointer">
                          <Link href={`/admin/products/edit/${p.id}`}>{p.title}</Link>
                        </div>
                        {/* Hover Action Links (Iconic WordPress Row Actions) */}
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-400 opacity-90 group-hover:opacity-100">
                          <Link
                            href={`/admin/products/edit/${p.id}`}
                            className="text-[#2271b1] hover:underline"
                          >
                            Edit
                          </Link>
                          <span>|</span>
                          <button
                            onClick={() => handleOpenQuickEdit(p)}
                            className="text-[#2271b1] hover:underline"
                          >
                            Quick Edit
                          </button>
                          <span>|</span>
                          <button
                            onClick={() => {
                              if (confirm(`Move "${p.title}" to trash?`)) {
                                deleteMutation.mutate(p.id);
                              }
                            }}
                            className="text-[#d63638] hover:underline"
                          >
                            Trash
                          </button>
                          <span>|</span>
                          <Link
                            href="/#catalog-section"
                            target="_blank"
                            className="text-[#2271b1] hover:underline flex items-center gap-0.5"
                          >
                            <span>View</span>
                            <ExternalLink size={10} />
                          </Link>
                        </div>
                      </td>
                      <td className="p-2.5 font-mono text-[#50575e]">{p.sku}</td>
                      <td className="p-2.5">
                        {renderStockBadge(p.stockAvailable)}
                      </td>
                      <td className="p-2.5 font-bold text-[#1d2327]">
                        ${p.price?.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-[#50575e]">{p.category?.name || 'Uncategorized'}</td>
                      <td className="p-2.5 text-[11px] text-gray-500">
                        Published <br />
                        2026/09/27
                      </td>
                    </tr>

                    {/* WordPress Inline Quick Edit Drawer */}
                    {isQuickEditing && (
                      <tr className="bg-[#f0f0f1] border-y-2 border-[#2271b1]">
                        <td colSpan={8} className="p-4">
                          <form onSubmit={handleSaveQuickEdit} className="space-y-3">
                            <div className="font-semibold text-xs text-[#1d2327] uppercase tracking-wider mb-2">
                              Quick Edit Product: #{p.id}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                              <div className="sm:col-span-2">
                                <label htmlFor="qe-title" className="block text-[11px] font-semibold text-gray-700 mb-1">
                                  Title
                                </label>
                                <input
                                  id="qe-title"
                                  type="text"
                                  value={qeTitle}
                                  onChange={(e) => setQeTitle(e.target.value)}
                                  className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs outline-none bg-white focus:border-[#2271b1]"
                                />
                              </div>

                              <div>
                                <label htmlFor="qe-sku" className="block text-[11px] font-semibold text-gray-700 mb-1">
                                  SKU
                                </label>
                                <input
                                  id="qe-sku"
                                  type="text"
                                  value={qeSku}
                                  onChange={(e) => setQeSku(e.target.value)}
                                  className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs font-mono outline-none bg-white focus:border-[#2271b1]"
                                />
                              </div>

                              <div>
                                <label htmlFor="qe-price" className="block text-[11px] font-semibold text-gray-700 mb-1">
                                  Price ($)
                                </label>
                                <input
                                  id="qe-price"
                                  type="number"
                                  step="0.01"
                                  value={qePrice}
                                  onChange={(e) => setQePrice(Number.parseFloat(e.target.value) || 0)}
                                  className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs outline-none bg-white focus:border-[#2271b1]"
                                />
                              </div>

                              <div>
                                <label htmlFor="qe-stock" className="block text-[11px] font-semibold text-gray-700 mb-1">
                                  Stock Qty
                                </label>
                                <input
                                  id="qe-stock"
                                  type="number"
                                  value={qeStock}
                                  onChange={(e) => setQeStock(Number.parseInt(e.target.value, 10) || 0)}
                                  className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs outline-none bg-white focus:border-[#2271b1]"
                                />
                              </div>

                              <div>
                                <label htmlFor="qe-category" className="block text-[11px] font-semibold text-gray-700 mb-1">
                                  Category
                                </label>
                                <select
                                  id="qe-category"
                                  value={qeCategoryId}
                                  onChange={(e) => setQeCategoryId(Number.parseInt(e.target.value, 10))}
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none bg-white"
                                >
                                  {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <label className="flex items-center gap-1.5 text-xs text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={qeIsFeatured}
                                  onChange={(e) => setQeIsFeatured(e.target.checked)}
                                  className="rounded border-gray-300 text-[#2271b1]"
                                />
                                <span>Featured product (Homepage Hero / Highlights)</span>
                              </label>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setQuickEditProduct(null)}
                                  className="border border-[#c3c4c7] bg-white hover:bg-gray-100 text-[#2c3338] px-3 py-1 rounded text-xs transition"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={updateMutation.isPending}
                                  className="bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold px-4 py-1 rounded text-xs transition shadow-sm"
                                >
                                  {updateMutation.isPending ? 'Updating...' : 'Update'}
                                </button>
                              </div>
                            </div>
                          </form>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              });
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
