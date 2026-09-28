'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  Package,
  CheckCircle2,
  DollarSign,
  Boxes,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProduct, fetchCategories, updateAdminProduct, deleteAdminProduct } from '@/lib/api';

const DEFAULT_PRODUCT_IMAGE = '/images/image_1.webp';

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const productId = Number(params?.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('0.00');
  const [stockQuantity, setStockQuantity] = useState('0');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState(DEFAULT_PRODUCT_IMAGE);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'inventory'>('general');
  const [notice, setNotice] = useState<string | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
    enabled: !Number.isNaN(productId),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setDescription(product.description || '');
      setSku(product.sku);
      setPrice(product.price.toString());
      setStockQuantity(product.stockAvailable.toString());
      setCategoryId(product.category?.id || 1);
      setImageUrl(product.imageUrl || DEFAULT_PRODUCT_IMAGE);
      setIsFeatured(product.isFeatured);
      setIsActive(product.isActive);
    }
  }, [product]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateAdminProduct(productId, {
        title,
        description,
        sku,
        price: Number.parseFloat(price) || 0,
        stockQuantity: Number.parseInt(stockQuantity, 10) || 0,
        categoryId,
        imageUrl,
        isFeatured,
        isActive,
      }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      setNotice(`Product "${updated.title}" updated successfully!`);
      setTimeout(() => setNotice(null), 4000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAdminProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push('/admin/products');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a product title.');
      return;
    }
    updateMutation.mutate();
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-gray-500">Loading product #{productId}...</div>;
  }

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
          <h1 className="text-2xl font-normal text-[#1d2327]">Edit Product</h1>
          <Link
            href="/admin/products/new"
            className="border border-[#2271b1] bg-[#f6f7f7] text-[#2271b1] hover:bg-[#2271b1] hover:text-white rounded text-xs px-2.5 py-1 transition font-semibold"
          >
            Add New
          </Link>
        </div>
      </div>

      {notice && (
        <div className="bg-white border-l-4 border-l-[#00a32a] border border-[#c3c4c7] p-3 shadow-sm text-xs flex items-center justify-between text-[#1d2327]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#00a32a]" />
            <span>{notice}</span>
          </div>
          <Link href="/#catalog-section" target="_blank" className="text-[#2271b1] hover:underline font-semibold flex items-center gap-1">
            <span>View on storefront</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      )}

      {/* Main 2-Column WordPress Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title Field */}
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

          {/* Description Box */}
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

          {/* WooCommerce "Product Data" Metabox */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 bg-[#f6f7f7] border-b border-[#c3c4c7] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Package size={15} className="text-[#50575e]" />
                <span className="font-bold text-[#1d2327]">Product data &mdash;</span>
                <span className="text-[#50575e]">Simple product</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row min-h-[220px]">
              {/* Left tabs */}
              <div className="w-full sm:w-36 bg-[#f6f7f7] border-r border-[#c3c4c7] text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab('general')}
                  className={`w-full text-left px-3.5 py-2.5 border-b border-[#dcdcde] flex items-center gap-2 ${activeTab === 'general'
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
                  className={`w-full text-left px-3.5 py-2.5 border-b border-[#dcdcde] flex items-center gap-2 ${activeTab === 'inventory'
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
                      <label htmlFor="edit-product-price" className="text-gray-700 font-semibold">Regular price ($):</label>
                      <input
                        id="edit-product-price"
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="sm:col-span-2 border border-[#8c8f94] rounded px-3 py-1.5 text-xs outline-none focus:border-[#2271b1]"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'inventory' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                      <label htmlFor="edit-product-sku" className="text-gray-700 font-semibold">SKU:</label>
                      <input
                        id="edit-product-sku"
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="sm:col-span-2 border border-[#8c8f94] rounded px-3 py-1.5 text-xs font-mono outline-none focus:border-[#2271b1]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                      <label htmlFor="edit-product-stock" className="text-gray-700 font-semibold">Stock quantity:</label>
                      <input
                        id="edit-product-stock"
                        type="number"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                        required
                        className="sm:col-span-2 border border-[#8c8f94] rounded px-3 py-1.5 text-xs outline-none focus:border-[#2271b1]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                      <span className="text-gray-700 font-semibold">Quick Set Stock:</span>
                      <div className="sm:col-span-2 flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setStockQuantity('1')}
                          className="bg-[#2271b1] text-white px-2 py-0.5 rounded text-[11px]"
                        >
                          1 (Lock Test)
                        </button>
                        <button
                          type="button"
                          onClick={() => setStockQuantity('0')}
                          className="border border-red-300 text-red-600 px-2 py-0.5 rounded text-[11px]"
                        >
                          0 (Out)
                        </button>
                        <button
                          type="button"
                          onClick={() => setStockQuantity('50')}
                          className="border border-gray-300 px-2 py-0.5 rounded text-[11px]"
                        >
                          50 (Full)
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width): Metaboxes */}
        <div className="space-y-5">
          {/* Publish Metabox */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm">
            <div className="px-4 py-2.5 bg-[#f6f7f7] border-b border-[#c3c4c7] font-bold text-xs text-[#1d2327]">
              Publish
            </div>
            <div className="p-4 space-y-3 text-xs text-[#50575e]">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0f0f1]">
                <span>Status: <strong className="text-[#1d2327]">{isActive ? 'Published' : 'Draft'}</strong></span>
                <label className="flex items-center gap-1 cursor-pointer text-[#2271b1]">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-[#2271b1]"
                  />
                  <span>Active</span>
                </label>
              </div>
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete this product?')) deleteMutation.mutate();
                  }}
                  className="text-[#d63638] hover:underline text-xs"
                >
                  Move to Trash
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold px-5 py-1.5 rounded text-xs transition shadow-sm"
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>

          {/* Product Categories Metabox */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm">
            <div className="px-4 py-2.5 bg-[#f6f7f7] border-b border-[#c3c4c7] font-bold text-xs text-[#1d2327]">
              Product Categories
            </div>
            <div className="p-4 space-y-2 text-xs text-[#50575e]">
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

          {/* Product Image Metabox */}
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
                    (e.target as any).src = DEFAULT_PRODUCT_IMAGE;
                  }}
                />
              </div>

              <div>
                <label htmlFor="edit-product-image-url" className="block text-left text-[11px] font-semibold text-gray-700 mb-1">
                  Image Path / URL:
                </label>
                <input
                  id="edit-product-image-url"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full border border-[#8c8f94] rounded px-2.5 py-1 text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* Featured Status Metabox */}
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
          </div>
        </div>
      </div>
    </form>
  );
}
