'use client';

import React from 'react';
import { Product } from '@/types';
import { ShoppingCart, Eye, AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCart } from '@/lib/api';
import { useCartStore } from '@/stores/useCartStore';
import { useSimulatorStore } from '@/stores/useSimulatorStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();
  const { cartId, openCart } = useCartStore();
  const openQuickView = useSimulatorStore((s) => s.openQuickView);

  const addMutation = useMutation({
    mutationFn: () => addToCart(cartId, product.id, 1),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart', cartId], updatedCart);
      queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
      openCart();
    },
    onError: (err: any) => {
      alert(`Could not add to cart: ${err.message}`);
    },
  });

  const isLowStock = product.stockAvailable === 1;
  const regularPrice = (product.price * 1.25).toFixed(2);

  return (
    <div className="group relative flex flex-col bg-white overflow-hidden transition-all duration-300">
      {/* Product Image Area */}
      <div className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden flex items-center justify-center">
        {/* Upright SALE Badge (from reference style.css) */}
        <span className="onsale-vertical">
          SALE
        </span>

        {/* 1-Stock Tester Indicator */}
        {isLowStock && (
          <span className="absolute top-2 right-2 bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow z-10 flex items-center gap-1">
            <AlertTriangle size={10} /> ONLY 1 LEFT!
          </span>
        )}

        <img
          src={product.imageUrl || '/images/image_1.webp'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick View Hover Button */}
        <button
          onClick={() => openQuickView(product.id)}
          title="Quick View"
          className="absolute right-3 bottom-3 w-9 h-9 rounded-full bg-white/90 hover:bg-black hover:text-white text-gray-800 shadow flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
        >
          <Eye size={16} />
        </button>
      </div>

      {/* Product Details Area */}
      <div className="pt-4 pb-2 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-semibold text-base text-market-black group-hover:text-black transition tracking-normal mb-1 uppercase font-sans">
            {product.title}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-1 mb-3">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart Circle (from reference style.css) */}
        <div className="flex items-center gap-3 pt-1">
          {/* Circular Black Add to Cart Button */}
          <button
            onClick={() => addMutation.mutate()}
            disabled={addMutation.isPending || product.stockAvailable === 0}
            className="w-10 h-10 rounded-full bg-[#222222] hover:bg-black text-white flex items-center justify-center shadow transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            title={product.stockAvailable === 0 ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingCart size={17} />
          </button>

          {/* Pricing: struck through regular + bold price */}
          <div className="flex items-baseline gap-2">
            <span className="line-through text-xs text-gray-400 font-sans">
              ${regularPrice}
            </span>
            <span className="text-base font-bold text-market-black font-sans">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
