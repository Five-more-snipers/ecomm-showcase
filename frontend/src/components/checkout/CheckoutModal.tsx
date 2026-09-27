'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCart, executeCheckout, seedPresetCart } from '@/lib/api';
import { PaymentMethod } from '@/types';
import { X, CreditCard, Banknote, Sparkles, AlertTriangle, Loader2, PackageCheck } from 'lucide-react';

export default function CheckoutModal() {
  const { cartId } = useCartStore();
  const { isCheckoutOpen, closeCheckout, openOrderModal, simulationMode, setSimulationMode } = useSimulatorStore();
  const queryClient = useQueryClient();

  // Form state
  const [customerName, setCustomerName] = useState('John Tester');
  const [customerEmail, setCustomerEmail] = useState('john.tester@example.com');
  const [phone, setPhone] = useState('+1-555-0199');
  const [shippingAddress, setShippingAddress] = useState('123 Showcase Boulevard, Suite 400');
  const [shippingCity, setShippingCity] = useState('San Francisco');
  const [shippingPostalCode, setShippingPostalCode] = useState('94105');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MOCK_CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: cart } = useQuery({
    queryKey: ['cart', cartId],
    queryFn: () => fetchCart(cartId),
    enabled: !!cartId && isCheckoutOpen,
  });

  const seedPresetMutation = useMutation({
    mutationFn: () => seedPresetCart(cartId),
    onSuccess: (seededCart) => {
      queryClient.setQueryData(['cart', cartId], seededCart);
      queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
      setErrorMessage(null);
    },
  });

  const subtotal = cart?.subtotal ?? 0;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const shipping = subtotal >= 100.0 || subtotal === 0 ? 0.0 : 10.0;
  const total = Number((subtotal + tax + shipping).toFixed(2));

  const checkoutMutation = useMutation({
    mutationFn: () =>
      executeCheckout({
        cartId,
        customerEmail,
        customerName,
        phone,
        shippingAddress,
        shippingCity,
        shippingPostalCode,
        payment: {
          paymentMethod,
          cardNumber,
          cardExpiry,
          cardCvv,
          simulationMode,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeCheckout();
      openOrderModal(data.orderNumber);
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Checkout failed. Please review form.');
    },
  });

  const handleFillDemo = (type: 'success' | 'decline' | 'timeout') => {
    setCustomerName('Alice Demo');
    setCustomerEmail('alice.demo@example.com');
    setShippingAddress('789 Innovation Way');
    setShippingCity('Austin');
    setShippingPostalCode('78701');
    setPaymentMethod('MOCK_CREDIT_CARD');

    if (type === 'success') {
      setCardNumber('4242 4242 4242 4242');
      setSimulationMode('FORCE_SUCCESS');
    } else if (type === 'decline') {
      setCardNumber('4000 0000 0000 0002');
      setSimulationMode('FORCE_DECLINE');
    } else if (type === 'timeout') {
      setCardNumber('4000 0000 0000 0004');
      setSimulationMode('FORCE_TIMEOUT');
    }
  };

  if (!isCheckoutOpen) return null;

  const isCartEmpty = !cart?.items || cart.items.length === 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative border border-gray-200">
        <button
          onClick={closeCheckout}
          className="absolute top-5 right-5 text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-market-black font-sans uppercase tracking-wide">
            Checkout Simulation
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Simulate customer checkout, pessimistic stock locks, and payment validation.
          </p>
        </div>

        {/* Quick Fill Presets for Testers */}
        <div className="bg-market-yellowLight border border-market-yellowDark/30 rounded-md p-4 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-market-black uppercase tracking-wider mb-2.5">
            <Sparkles size={14} className="text-amber-600" />
            <span>Tester Fast-Fill Presets & Demo Items:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => seedPresetMutation.mutate()}
              disabled={seedPresetMutation.isPending}
              className="bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold text-xs px-3 py-1.5 rounded border border-market-yellowDark/40 flex items-center gap-1 transition"
              title="Add preset demo items ($273.99) to checkout"
            >
              <PackageCheck size={13} />
              <span>{seedPresetMutation.isPending ? 'Filling...' : '⚡ Fill Demo Items ($273.99)'}</span>
            </button>
            <button
              onClick={() => handleFillDemo('success')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-3 py-1.5 rounded transition"
            >
              Approved Card (4242)
            </button>
            <button
              onClick={() => handleFillDemo('decline')}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-3 py-1.5 rounded transition"
            >
              Force Decline (0002)
            </button>
            <button
              onClick={() => handleFillDemo('timeout')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-3 py-1.5 rounded transition"
            >
              Simulate Timeout (0004)
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-md mb-6 flex items-start gap-3 text-xs">
            <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Checkout Rejected:</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Empty Cart Warning Alert */}
        {isCartEmpty && (
          <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3.5 rounded-md mb-6 flex items-center justify-between gap-3 text-xs flex-wrap">
            <div>
              <strong>Cart is empty:</strong> Your order total is currently $0.00. Load preset items to test immediately.
            </div>
            <button
              onClick={() => seedPresetMutation.mutate()}
              disabled={seedPresetMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded transition whitespace-nowrap"
            >
              {seedPresetMutation.isPending ? 'Loading...' : '⚡ Load Demo Items'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer & Shipping Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-2 mb-4">
              1. Customer & Shipping
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-market-yellowDark"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-market-yellowDark"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Street Address</label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-market-yellowDark"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-market-yellowDark"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={shippingPostalCode}
                    onChange={(e) => setShippingPostalCode(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-market-yellowDark"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Totals */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-2 mb-4">
              2. Simulated Payment & Summary
            </h3>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('MOCK_CREDIT_CARD')}
                className={`p-2.5 rounded border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  paymentMethod === 'MOCK_CREDIT_CARD'
                    ? 'border-market-black bg-market-black text-white'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CreditCard size={14} /> Mock Card
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('MOCK_CASH_ON_DELIVERY')}
                className={`p-2.5 rounded border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  paymentMethod === 'MOCK_CASH_ON_DELIVERY'
                    ? 'border-market-black bg-market-black text-white'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Banknote size={14} /> Cash on Delivery
              </button>
            </div>

            {paymentMethod === 'MOCK_CREDIT_CARD' && (
              <div className="space-y-3 mb-4 text-xs">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono outline-none focus:border-market-yellowDark"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-market-yellowDark"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">CVV</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-market-yellowDark"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Authoritative Order Breakdown */}
            <div className="bg-gray-50 rounded-md p-4 border border-gray-200 mb-6 text-xs space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart?.totalItems ?? 0} items):</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%):</span>
                <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span className="font-semibold text-gray-900">
                  {shipping === 0 ? <span className="text-green-600 font-bold">FREE</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-market-black border-t border-gray-200 pt-2 mt-2">
                <span>Total Due:</span>
                <span className="text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setErrorMessage(null);
                checkoutMutation.mutate();
              }}
              disabled={checkoutMutation.isPending || isCartEmpty}
              className="w-full bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold uppercase tracking-wider text-xs py-3.5 rounded flex items-center justify-center gap-2 shadow transition disabled:opacity-50"
            >
              {checkoutMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing Checkout...</span>
                </>
              ) : (
                <span>Complete Order</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
