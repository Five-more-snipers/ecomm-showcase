'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Eye,
  X,
  CreditCard,
  Truck,
  Package,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminOrders, advanceOrderStatus, cancelOrder } from '@/lib/api';
import { Order, OrderStatus } from '@/types';

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: fetchAdminOrders,
  });

  const advanceMutation = useMutation({
    mutationFn: ({ orderNumber, status }: { orderNumber: string; status: OrderStatus }) =>
      advanceOrderStatus(orderNumber, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['order', updated.orderNumber] });
      setSelectedOrder(updated);
      setNotice(`Order ${updated.orderNumber} advanced to ${updated.status}.`);
      setTimeout(() => setNotice(null), 4000);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (orderNumber: string) => cancelOrder(orderNumber),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setSelectedOrder(updated);
      setNotice(`Order ${updated.orderNumber} cancelled! Reserved stock restored to warehouse.`);
      setTimeout(() => setNotice(null), 4000);
    },
  });

  const filteredOrders = orders.filter((o) => {
    if (selectedStatusFilter === 'all') return true;
    return o.status === selectedStatusFilter;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="bg-[#c6e1c6] text-[#2c6b2f] px-2 py-0.5 rounded font-bold text-[10px]">Delivered</span>;
      case 'SHIPPED':
        return <span className="bg-[#cbe3f7] text-[#1c65a6] px-2 py-0.5 rounded font-bold text-[10px]">Shipped</span>;
      case 'PROCESSING':
        return <span className="bg-[#f8dda4] text-[#8f5d07] px-2 py-0.5 rounded font-bold text-[10px]">Processing</span>;
      case 'PAYMENT_CONFIRMED':
        return <span className="bg-[#d2f4d3] text-[#1b7a21] px-2 py-0.5 rounded font-bold text-[10px]">Confirmed</span>;
      case 'CANCELLED':
        return <span className="bg-[#eba3a3] text-[#761919] px-2 py-0.5 rounded font-bold text-[10px]">Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-bold text-[10px]">{status}</span>;
    }
  };

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    if (current === 'PENDING') return 'PAYMENT_CONFIRMED';
    if (current === 'PAYMENT_CONFIRMED') return 'PROCESSING';
    if (current === 'PROCESSING') return 'SHIPPED';
    if (current === 'SHIPPED') return 'DELIVERED';
    return null;
  };

  return (
    <div className="space-y-4 max-w-7xl">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-normal text-[#1d2327]">WooCommerce Orders</h1>
        <span className="text-xs text-gray-500">{orders.length} total orders</span>
      </div>

      {notice && (
        <div className="bg-white border-l-4 border-l-[#00a32a] border border-[#c3c4c7] p-3 shadow-sm text-xs flex items-center justify-between text-[#1d2327]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#00a32a]" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-gray-400 hover:text-black">
            &times;
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-[#50575e] pt-1 border-b border-[#dcdcde] pb-2">
        <button
          onClick={() => setSelectedStatusFilter('all')}
          className={`hover:text-[#2271b1] ${selectedStatusFilter === 'all' ? 'font-bold text-[#1d2327]' : ''}`}
        >
          All ({orders.length})
        </button>
        <span>|</span>
        <button
          onClick={() => setSelectedStatusFilter('PAYMENT_CONFIRMED')}
          className={`hover:text-[#2271b1] ${selectedStatusFilter === 'PAYMENT_CONFIRMED' ? 'font-bold text-[#1d2327]' : ''}`}
        >
          Confirmed ({orders.filter((o) => o.status === 'PAYMENT_CONFIRMED').length})
        </button>
        <span>|</span>
        <button
          onClick={() => setSelectedStatusFilter('PROCESSING')}
          className={`hover:text-[#2271b1] ${selectedStatusFilter === 'PROCESSING' ? 'font-bold text-[#1d2327]' : ''}`}
        >
          Processing ({orders.filter((o) => o.status === 'PROCESSING').length})
        </button>
        <span>|</span>
        <button
          onClick={() => setSelectedStatusFilter('SHIPPED')}
          className={`hover:text-[#2271b1] ${selectedStatusFilter === 'SHIPPED' ? 'font-bold text-[#1d2327]' : ''}`}
        >
          Shipped ({orders.filter((o) => o.status === 'SHIPPED').length})
        </button>
        <span>|</span>
        <button
          onClick={() => setSelectedStatusFilter('DELIVERED')}
          className={`hover:text-[#2271b1] ${selectedStatusFilter === 'DELIVERED' ? 'font-bold text-[#1d2327]' : ''}`}
        >
          Delivered ({orders.filter((o) => o.status === 'DELIVERED').length})
        </button>
        <span>|</span>
        <button
          onClick={() => setSelectedStatusFilter('CANCELLED')}
          className={`hover:text-[#2271b1] ${selectedStatusFilter === 'CANCELLED' ? 'font-bold text-[#1d2327]' : ''}`}
        >
          Cancelled ({orders.filter((o) => o.status === 'CANCELLED').length})
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#2c3338] font-semibold select-none">
              <th className="p-2.5">Order</th>
              <th className="p-2.5">Date</th>
              <th className="p-2.5">Status</th>
              <th className="p-2.5">Customer & Shipping</th>
              <th className="p-2.5">Items</th>
              <th className="p-2.5">Total</th>
              <th className="p-2.5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f1]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">
                  Loading orders...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No orders match this filter. Try placing an order through the store checkout!
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const nextStatus = getNextStatus(order.status);
                const isCancelled = order.status === 'CANCELLED';

                return (
                  <tr key={order.orderNumber} className="hover:bg-[#f6f7f7] transition">
                    <td className="p-2.5 font-bold text-[#2271b1]">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="hover:underline flex items-center gap-1 text-left"
                      >
                        <span>{order.orderNumber}</span>
                      </button>
                    </td>
                    <td className="p-2.5 text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'}
                    </td>
                    <td className="p-2.5">{getStatusBadge(order.status)}</td>
                    <td className="p-2.5">
                      <div className="font-semibold text-[#1d2327]">{order.customerName}</div>
                      <div className="text-[11px] text-gray-500">
                        {order.shippingCity || 'San Francisco'}, {order.shippingPostalCode}
                      </div>
                    </td>
                    <td className="p-2.5 text-[#50575e]">
                      {order.items?.length || 0} item(s)
                    </td>
                    <td className="p-2.5 font-bold text-[#1d2327]">
                      ${order.total?.toFixed(2)}
                    </td>
                    <td className="p-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="border border-[#8c8f94] bg-white hover:bg-gray-100 text-[#2c3338] px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1"
                          title="View order details"
                        >
                          <Eye size={11} />
                          <span>View</span>
                        </button>

                        {nextStatus && (
                          <button
                            onClick={() =>
                              advanceMutation.mutate({
                                orderNumber: order.orderNumber,
                                status: nextStatus,
                              })
                            }
                            disabled={advanceMutation.isPending}
                            className="bg-[#2271b1] hover:bg-[#135e96] text-white px-2 py-0.5 rounded text-[11px] font-semibold transition"
                            title={`Advance order status to ${nextStatus}`}
                          >
                            Mark {nextStatus.replace('_', ' ')}
                          </button>
                        )}

                        {!isCancelled && order.status !== 'DELIVERED' && (
                          <button
                            onClick={() => {
                              if (confirm(`Cancel ${order.orderNumber} and replenish stock?`)) {
                                cancelMutation.mutate(order.orderNumber);
                              }
                            }}
                            disabled={cancelMutation.isPending}
                            className="border border-red-300 text-red-600 hover:bg-red-50 px-2 py-0.5 rounded text-[11px] transition"
                            title="Cancel order and replenish inventory"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-[#c3c4c7] shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <X size={20} />
            </button>

            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#f0f0f1]">
              <div>
                <h3 className="text-lg font-bold text-[#1d2327]">
                  Order {selectedOrder.orderNumber}
                </h3>
                <div className="text-xs text-gray-500">
                  Payment via {selectedOrder.paymentMethod || 'Mock Card'} &bull; Transaction Ref:{' '}
                  <code className="text-[11px] text-gray-800">
                    {selectedOrder.transactionRef || 'N/A'}
                  </code>
                </div>
              </div>
              <div>{getStatusBadge(selectedOrder.status)}</div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-6 p-3 bg-[#f6f7f7] border border-[#dcdcde] rounded">
              <div>
                <strong className="block text-gray-800 mb-1">Customer:</strong>
                <div>{selectedOrder.customerName}</div>
                <div className="text-gray-500">{selectedOrder.customerEmail}</div>
              </div>
              <div>
                <strong className="block text-gray-800 mb-1">Shipping Address:</strong>
                <div>{selectedOrder.shippingAddress}</div>
                <div className="text-gray-500">
                  {selectedOrder.shippingCity}, {selectedOrder.shippingPostalCode}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3 mb-6">
              <strong className="block text-xs uppercase tracking-wider text-gray-600">
                Purchased Items ({selectedOrder.items?.length || 0}):
              </strong>
              <div className="divide-y divide-[#f0f0f1] border border-[#dcdcde] rounded">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#1d2327]">{item.title}</div>
                      <div className="text-[11px] text-gray-500">
                        SKU: {item.sku} &bull; Qty: {item.quantity} &times; ${item.unitPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="font-bold text-[#1d2327]">
                      ${(item.totalPrice || item.unitPrice * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="bg-[#f6f7f7] p-3 rounded text-xs space-y-1.5 mb-6 border border-[#dcdcde]">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>${selectedOrder.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%):</span>
                <span>${selectedOrder.tax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span>
                  {selectedOrder.shipping === 0 ? 'FREE' : `$${selectedOrder.shipping?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1d2327] border-t border-[#dcdcde] pt-2">
                <span>Total:</span>
                <span>${selectedOrder.total?.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="border border-[#c3c4c7] bg-white hover:bg-gray-100 text-[#2c3338] px-4 py-1.5 rounded text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
