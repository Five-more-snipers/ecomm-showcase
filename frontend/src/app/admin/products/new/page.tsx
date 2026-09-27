'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  DollarSign,
  Boxes,
  ArrowLeft,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCategories, createAdminProduct } from '@/lib/api';

export default function AdminNewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('49.99');
  const [stockQuantity, setStockQuantity] = useState('20');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState('/images/image_1.webp');
  const [isFeatured, setIsFeatured] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'inventory'>('general');
  const [notice, setNotice] = useState<string | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createAdminProduct({
        title,
        description,
        sku: sku || `SKU-${Date.now()}`,
        price: parseFloat(price) || 0,
        stockQuantity: parseInt(stockQuantity, 10) || 0,
        categoryId,
        imageUrl,
        isFeatured,
        isActive: true,
      }),
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setNotice(`Product "${newProduct.title}" created successfully! Redirecting...`);
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a product title.');
      return;
    }
    createMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-6xl">
      {/* Page Title & Back link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="text-gray-500 hover:text-[#2271b1] p-1 rounded hover:bg-gray-200 transition"
            title="Back to products list"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-normal text-[#1d2327]">Add New Product</h1>
        </div>
      </div>

      {notice && (
        <div className="bg-white border-l-4 border-l-[#00a32a] border border-[#c3c4c7] p-3 shadow-sm text-xs flex items-center gap-2 text-[#1d2327]">
          <CheckCircle2 size={16} className="text-[#00a32a]" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main 2-Column WordPress Layout (Editor on Left, Metaboxes on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width): Title, Description, WooCommerce Product Data */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. Large Title Field (WordPress Signature) */}
          <div>
            <input
              type="text"
              placeholder="Enter product title here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full text-lg md:text-xl font-normal text-[#1d2327] bg-white border border-[#8c8f94] rounded px-3.5 py-2.5 outline-none shadow-sm focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
            />
          </div>

          {/* 2. Description Box with Visual/Text tabs */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#f6f7f7] border-b border-[#dcdcde] text-xs">
              <span className="font-semibold text-gray-700">Product Description</span>
              <div className="flex gap-2">
                <span className="text-gray-700 bg-white border border-b-0 border-[#dcdcde] px-2 py-0.5 rounded-t font-semibold">
                  Visual
                </span>
                <span className="text-gray-500 hover:text-black cursor-pointer px-2 py-0.5">
                  Text
                </span>
              </div>
            </div>
            <textarea
              rows={8}
              placeholder="Describe the product features, specifications, and details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 text-xs text-[#2c3338] outline-none resize-y border-none"
            />
          </div>

          {/* 3. WooCommerce "Product Data" Metabox */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-4 py-2.5 bg-[#f6f7f7] border-b border-[#c3c4c7] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Package size={15} className="text-[#50575e]" />
                <span className="font-bold text-[#1d2327]">Product data &mdash;</span>
                <select className="border border-[#8c8f94] rounded px-2 py-0.5 text-xs bg-white">
                  <option>Simple product</option>
                  <option>Grouped product</option>
                  <option>Variable product</option>
                </select>
              </div>
            </div>

            {/* Metabox Content: Left vertical tabs, Right settings panels */}
            <div className="flex flex-col sm:flex-row min-h-[220px]">
              {/* Left tabs */}
              <div className="w-full sm:w-36 bg-[#f6f7f7] border-r border-[#c3c4c7] text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab('general')}
                  className={`w-full text-left px-3.5 py-2.5 border-b border-[#dcdcde] flex items-center gap-2 ${
                    activeTab === 'general'
                      ? 'bg-white border-l-4 border-l-[#2271b1] font-bold text-[#1d2327]'
                      : 'text-[#50575e] hover:bg-gray-100'
                  }`}
                >
                  <DollarSign size={14} />
                  <span>General</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('inventory')}
                  className={`w-full text-left px-3.5 py-2.5 border-b border-[#dcdcde] flex items-center gap-2 ${
                    activeTab === 'inventory'
                      ? 'bg-white border-l-4 border-l-[#2271b1] font-bold text-[#1d2327]'
                      : 'text-[#50575e] hover:bg-gray-100'
                  }`}
                >
                  <Boxes size={14} />
                  <span>Inventory</span>
                </button>
              </div>

              {/* Right Tab Content */}
              <div className="flex-1 p-5 text-xs space-y-4">
                {activeTab === 'general' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                      <label className="text-gray-700 font-semibold">Regular price ($):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="sm:col-span-2 border border-[#8c8f94] rounded px-3 py-1.5 text-xs outline-none focus:border-[#2271b1]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                      <label className="text-gray-500">Sale price ($):</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Optional promotional price"
                        className="sm:col-span-2 border border-[#8c8f94] rounded px-3 py-1.5 text-xs outline-none"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'inventory' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                      <label className="text-gray-700 font-semibold">SKU:</label>
                      <input
                        type="text"
                        placeholder="e.g. ELEC-WH2000"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="sm:col-span-2 border border-[#8c8f94] rounded px-3 py-1.5 text-xs font-mono outline-none focus:border-[#2271b1]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                      <label className="text-gray-700 font-semibold">Stock quantity:</label>
                      <input
                        type="number"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                        required
                        className="sm:col-span-2 border border-[#8c8f94] rounded px-3 py-1.5 text-xs outline-none focus:border-[#2271b1]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                      <label className="text-gray-700 font-semibold">Stock status:</label>
                      <select className="sm:col-span-2 border border-[#8c8f94] rounded px-2.5 py-1.5 text-xs bg-white outline-none">
                        <option>In stock</option>
                        <option>Out of stock</option>
                        <option>On backorder</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width): WordPress Sidebar Metaboxes */}
        <div className="space-y-5">
          {/* 1. "Publish" Metabox */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm">
            <div className="px-4 py-2.5 bg-[#f6f7f7] border-b border-[#c3c4c7] font-bold text-xs text-[#1d2327]">
              Publish
            </div>
            <div className="p-4 space-y-3 text-xs text-[#50575e]">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0f0f1]">
                <span>Status: <strong className="text-[#1d2327]">Draft</strong></span>
                <button type="button" className="text-[#2271b1] hover:underline text-[11px]">
                  Edit
                </button>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#f0f0f1]">
                <span>Visibility: <strong className="text-[#1d2327]">Public</strong></span>
                <button type="button" className="text-[#2271b1] hover:underline text-[11px]">
                  Edit
                </button>
              </div>
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => router.push('/admin/products')}
                  className="border border-[#c3c4c7] bg-[#f6f7f7] hover:bg-gray-100 text-[#2c3338] px-3 py-1.5 rounded text-xs transition"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold px-5 py-1.5 rounded text-xs transition shadow-sm"
                >
                  {createMutation.isPending ? 'Publishing...' : 'Publish Product'}
                </button>
              </div>
            </div>
          </div>

          {/* 2. "Product Categories" Metabox */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm">
            <div className="px-4 py-2.5 bg-[#f6f7f7] border-b border-[#c3c4c7] font-bold text-xs text-[#1d2327]">
              Product Categories
            </div>
            <div className="p-4 space-y-2 text-xs text-[#50575e] max-h-48 overflow-y-auto">
              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer hover:text-black">
                  <input
                    type="radio"
                    name="categorySelection"
                    checked={categoryId === c.id}
                    onChange={() => setCategoryId(c.id)}
                    className="text-[#2271b1]"
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. "Product Image" Metabox */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm">
            <div className="px-4 py-2.5 bg-[#f6f7f7] border-b border-[#c3c4c7] font-bold text-xs text-[#1d2327]">
              Product Image
            </div>
            <div className="p-4 space-y-3 text-xs text-center">
              <div className="w-full aspect-square max-h-40 bg-gray-50 border border-dashed border-[#c3c4c7] rounded flex items-center justify-center mx-auto overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as any).src = '/images/image_1.webp';
                  }}
                />
              </div>

              <div>
                <label className="block text-left text-[11px] font-semibold text-gray-700 mb-1">
                  Image Path / URL:
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full border border-[#8c8f94] rounded px-2.5 py-1 text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* 4. "Featured Status" Metabox */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm p-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-[#8c8f94] text-[#2271b1]"
              />
              <span className="font-semibold text-[#1d2327]">This is a featured product</span>
            </label>
            <p className="text-[11px] text-gray-500 mt-1 pl-5">
              Featured products appear highlighted on the storefront Hero and top section.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
