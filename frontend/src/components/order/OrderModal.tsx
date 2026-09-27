'use client';

import React from 'react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrder, fetchOrderTracking, advanceOrderStatus, cancelOrder } from '@/lib/api';
import { OrderStatus } from '@/types';
import { X, CheckCircle2, RotateCcw, AlertOctagon } from 'lucide-react';

export default function OrderModal() {
  const { activeOrderNumber, closeOrderModal } = useSimulatorStore();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', activeOrderNumber],
    queryFn: () => fetchOrder(activeOrderNumber!),
    enabled: !!activeOrderNumber,
  });

  const { data: tracking } = useQuery({
    queryKey: ['orderTracking', activeOrderNumber],
    queryFn: () => fetchOrderTracking(activeOrderNumber!),
    enabled: !!activeOrderNumber,
  });

  const advanceMutation = useMutation({
    mutationFn: (newStatus: OrderStatus) => advanceOrderStatus(activeOrderNumber!, newStatus),
    onSuccess: (updated) => {
      queryClient.setQueryData(['order', activeOrderNumber], updated);
      queryClient.invalidateQueries({ queryKey: ['orderTracking', activeOrderNumber] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrder(activeOrderNumber!),
    onSuccess: (updated) => {
      queryClient.setQueryData(['order', activeOrderNumber], updated);
      queryClient.invalidateQueries({ queryKey: ['orderTracking', activeOrderNumber] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: any) => {
      alert(`Could not cancel order: ${err.message}`);
    },
  });

  if (!activeOrderNumber) return null;

  const isCancelled = order?.status === 'CANCELLED';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative border border-gray-200">
        <button
          onClick={closeOrderModal}
          className="absolute top-5 right-5 text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>

        {isLoading || !order ? (
          <div className="text-center py-12 text-sm text-gray-400">
            Loading order details for {activeOrderNumber}...
          </div>
        ) : (
          <div>
            {/* Status Banner */}
            <div className={`p-4 rounded-md mb-6 border flex items-center justify-between flex-wrap gap-4 ${
              isCancelled
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-green-50 border-green-200 text-green-900'
            }`}>
              <div className="flex items-center gap-3">
                {isCancelled ? (
                  <AlertOctagon size={28} className="text-red-600 flex-shrink-0" />
                ) : (
                  <CheckCircle2 size={28} className="text-green-600 flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-bold text-sm md:text-base">
                    {isCancelled ? 'Order Cancelled (Stock Replenished)' : 'Order Successfully Confirmed!'}
                  </h3>
                  <p className="text-xs text-gray-600">
                    Order Number: <span className="font-bold text-market-black">{order.orderNumber}</span> &bull; Total: <span className="font-bold text-market-black">${order.total.toFixed(2)}</span>
                  </p>
                </div>
              </div>

              {!isCancelled && order.status !== 'DELIVERED' && (
                <button
                  onClick={() => cancelMutation.mutate()}
                  disabled={cancelMutation.isPending}
                  className="bg-white border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition"
                >
                  <RotateCcw size={13} />
                  <span>Cancel Order</span>
                </button>
              )}
            </div>

            {/* Visual Tracking Stepper */}
            {!isCancelled && tracking && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">
                  Live Lifecycle Stepper:
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {tracking.steps.map((step, idx) => (
                    <div
                      key={step.status}
                      className={`p-2.5 rounded border text-center transition ${
                        step.isCurrent
                          ? 'bg-market-yellow border-market-yellowDark text-market-black font-bold'
                          : step.isCompleted
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-white border-gray-200 text-gray-400'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-bold tracking-wider mb-0.5">
                        Step {idx + 1}
                      </div>
                      <div className="text-xs font-semibold">{step.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tester Status Transition Triggers */}
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-gray-500 font-semibold">Simulate Transition:</span>
                  <button
                    onClick={() => advanceMutation.mutate('PROCESSING')}
                    className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-[11px] font-semibold"
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => advanceMutation.mutate('SHIPPED')}
                    className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-[11px] font-semibold"
                  >
                    Shipped
                  </button>
                  <button
                    onClick={() => advanceMutation.mutate('DELIVERED')}
                    className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-[11px] font-semibold"
                  >
                    Delivered
                  </button>
                </div>
              </div>
            )}

            {/* Itemized Order Details & Simulated Receipt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-3 pb-1 border-b border-gray-200">
                  Ordered Products
                </h4>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-2 rounded bg-gray-50 border border-gray-100"
                    >
                      <div>
                        <div className="font-bold text-gray-900">{item.title}</div>
                        <div className="text-gray-500 text-[11px]">
                          Qty: {item.quantity} &times; ${item.unitPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="font-bold text-market-black">
                        ${item.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-3 pb-1 border-b border-gray-200">
                  Simulated Receipt
                </h4>
                <div className="bg-gray-50 border border-gray-100 rounded p-3 space-y-1.5 text-gray-600">
                  <div><strong>Customer:</strong> {order.customerName}</div>
                  <div><strong>Delivery To:</strong> {order.shippingAddress}, {order.shippingCity}</div>
                  <div>
                    <strong>Payment Ref:</strong>{' '}
                    <span className="font-mono text-cyan-700">{order.transactionRef || 'N/A'}</span>
                  </div>
                  <div><strong>Payment Method:</strong> {order.paymentMethod}</div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm text-market-black">
                    <span>Total Paid:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
