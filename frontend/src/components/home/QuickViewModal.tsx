'use client';

import React, { useState } from 'react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCartStore } from '@/stores/useCartStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProduct, addToCart } from '@/lib/api';
import { X, ShoppingCart, Plus, Minus, AlertTriangle } from 'lucide-react';

export default function QuickViewModal() {
  const { activeQuickViewProductId, closeQuickView } = useSimulatorStore();
  const { cartId, openCart } = useCartStore();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', activeQuickViewProductId],
    queryFn: () => fetchProduct(activeQuickViewProductId!),
    enabled: !!activeQuickViewProductId,
  });

  const addMutation = useMutation({
    mutationFn: () => addToCart(cartId, product!.id, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart', cartId], updatedCart);
      queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
      closeQuickView();
      openCart();
    },
    onError: (err: any) => {
      alert(`Could not add to cart: ${err.message}`);
    },
  });

  if (!activeQuickViewProductId) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full overflow-hidden relative border border-gray-200 grid grid-cols-1 md:grid-cols-2">
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-100 z-10 transition"
        >
          <X size={20} />
        </button>

        {/* Product Image Area */}
        <div className="bg-gray-50 flex items-center justify-center p-6 relative">
          <span className="onsale-vertical">
            SALE
          </span>
          <img
            src={product?.imageUrl || '/images/image_1.webp'}
            alt={product?.title || 'Product'}
            className="max-h-[300px] object-contain drop-shadow"
          />
        </div>

        {/* Product Info */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          {isLoading || !product ? (
            <div className="text-gray-400 text-sm">Loading product details...</div>
          ) : (
            <>
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  {product.category.name} &bull; SKU: {product.sku}
                </div>

                <h2 className="text-xl font-bold text-market-black font-sans uppercase mb-2">
                  {product.title}
                </h2>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="line-through text-sm text-gray-400">
                    ${(product.price * 1.25).toFixed(2)}
                  </span>
                  <span className="text-2xl font-bold text-market-black">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.stockAvailable === 1 && (
                    <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle size={10} /> ONLY 1 LEFT!
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  {product.description}
                </p>
              </div>

              <div>
                {/* Quantity Controls */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-semibold text-gray-600">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="px-3 text-xs font-bold text-gray-800 min-w-[24px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stockAvailable, q + 1))}
                      disabled={quantity >= product.stockAvailable}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    ({product.stockAvailable} in stock)
                  </span>
                </div>

                <button
                  onClick={() => addMutation.mutate()}
                  disabled={addMutation.isPending || product.stockAvailable === 0}
                  className="w-full bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold uppercase tracking-wider text-xs py-3 rounded flex items-center justify-center gap-2 shadow transition disabled:opacity-40"
                >
                  <ShoppingCart size={16} />
                  <span>
                    {addMutation.isPending
                      ? 'Adding...'
                      : product.stockAvailable === 0
                      ? 'Out of Stock'
                      : 'Add to Cart'}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
