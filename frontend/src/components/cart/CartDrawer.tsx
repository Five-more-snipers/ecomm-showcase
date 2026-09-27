'use client';

import React from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCart, updateCartItem, removeCartItem, seedPresetCart } from '@/lib/api';
import { X, Trash2, Plus, Minus, ShoppingCart, ArrowRight, Truck, Sparkles, RefreshCw } from 'lucide-react';

export default function CartDrawer() {
  const { cartId, isCartOpen, closeCart } = useCartStore();
  const openCheckout = useSimulatorStore((s) => s.openCheckout);
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart', cartId],
    queryFn: () => fetchCart(cartId),
    enabled: !!cartId && isCartOpen,
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      updateCartItem(cartId, itemId, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart', cartId], updatedCart);
      queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
    },
    onError: (err: any) => {
      alert(`Could not update cart: ${err.message}`);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: number) => removeCartItem(cartId, itemId),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart', cartId], updatedCart);
      queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
    },
  });

  const seedPresetMutation = useMutation({
    mutationFn: () => seedPresetCart(cartId),
    onSuccess: (seededCart) => {
      queryClient.setQueryData(['cart', cartId], seededCart);
      queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
    },
  });

  if (!isCartOpen) return null;

  const subtotal = cart?.subtotal ?? 0;
  const freeShippingThreshold = 100.0;
  const differenceToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckoutClick = () => {
    closeCart();
    openCheckout();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
      {/* Click outside to close */}
      <div className="flex-1" onClick={closeCart} />

      {/* Drawer */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-market-black" />
            <h2 className="text-base font-bold text-market-black uppercase tracking-wider">
              Shopping Cart ({cart?.totalItems ?? 0})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => seedPresetMutation.mutate()}
              disabled={seedPresetMutation.isPending}
              className="text-[11px] bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold px-2.5 py-1 rounded flex items-center gap-1 transition"
              title="Load standard demo items with prices and quantities"
            >
              <Sparkles size={12} />
              <span>Load Preset</span>
            </button>
            <button
              onClick={closeCart}
              className="p-1 rounded-full text-gray-500 hover:text-black hover:bg-gray-200 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress */}
        <div className="px-5 py-3.5 bg-market-yellowLight border-b border-market-yellowDark/20 text-xs">
          <div className="flex items-center gap-2 text-market-black font-medium mb-1.5">
            <Truck size={15} className="text-market-black" />
            {differenceToFreeShipping === 0 ? (
              <span className="text-green-700 font-bold">🎉 You unlocked FREE Shipping!</span>
            ) : (
              <span>
                Add <strong className="font-bold">${differenceToFreeShipping.toFixed(2)}</strong> more for Free Shipping
              </span>
            )}
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-market-yellowDark transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-sm text-gray-400">Loading cart...</div>
          ) : !cart?.items || cart.items.length === 0 ? (
            <div className="text-center py-12 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 my-4">
              <ShoppingCart size={44} className="mx-auto mb-3 opacity-30 text-gray-600" />
              <p className="font-bold text-gray-800 text-sm">Your cart is currently empty</p>
              <p className="text-xs text-gray-500 mt-1 mb-5 max-w-xs mx-auto">
                No items in your cart. Load preset demo items with pre-calculated prices and stock to test checkout immediately!
              </p>
              <button
                onClick={() => seedPresetMutation.mutate()}
                disabled={seedPresetMutation.isPending}
                className="bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold uppercase tracking-wider text-xs px-5 py-2.5 rounded shadow inline-flex items-center gap-2 transition"
              >
                <Sparkles size={14} className="text-amber-700" />
                <span>{seedPresetMutation.isPending ? 'Loading Preset...' : '⚡ Load Demo Preset Items ($273.99)'}</span>
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 border border-gray-100 rounded-lg hover:border-gray-200 bg-white shadow-sm transition"
              >
                <img
                  src={item.imageUrl || '/images/image_1.webp'}
                  alt={item.title}
                  className="w-16 h-20 object-cover rounded bg-gray-50 flex-shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs uppercase text-market-black line-clamp-1">
                      {item.title}
                    </h4>
                    <div className="text-xs font-bold text-market-black mt-1">
                      ${item.unitPrice.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                      <button
                        onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                        disabled={updateMutation.isPending}
                        className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 text-xs"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2 text-xs font-bold text-gray-800 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                        disabled={updateMutation.isPending}
                        className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 text-xs"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeMutation.mutate(item.id)}
                      disabled={removeMutation.isPending}
                      className="text-gray-400 hover:text-red-600 p-1 transition"
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Proceed to Checkout */}
        {cart && cart.items && cart.items.length > 0 && (
          <div className="p-5 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs uppercase font-semibold text-gray-500">Subtotal:</span>
              <span className="text-xl font-bold text-market-black">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-gray-400 mb-4">
              Taxes & shipping calculated at checkout.
            </p>

            <button
              onClick={handleCheckoutClick}
              className="w-full bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold uppercase tracking-wider text-xs py-3.5 rounded flex items-center justify-center gap-2 shadow transition"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
