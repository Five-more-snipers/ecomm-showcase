'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Shield,
  ShieldCheck,
  Package,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Check,
  LogOut,
  LayoutDashboard,
  Users,
  ExternalLink,
  ShoppingBag,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminOrders } from '@/lib/api';
import { Order, OrderItem, UserRole } from '@/types';

export default function AccountPage() {
  const router = useRouter();
  const { currentUser, updateProfile, logout } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [postalCode, setPostalCode] = useState(currentUser?.postalCode || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName);
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
      setCity(currentUser.city || '');
      setPostalCode(currentUser.postalCode || '');
    }
  }, [currentUser]);

  // Fetch recent orders
  const { data: allOrders = [], isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ['adminOrders'],
    queryFn: fetchAdminOrders,
  });

  // Filter orders matching current user email or show recent orders if tester
  const userOrders = allOrders.filter(
    (o: Order) => o.customerEmail?.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  const displayOrders = userOrders.length > 0 ? userOrders : allOrders.slice(0, 3);

  if (!currentUser) {
    return (
      <div className="site-container py-20 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
          <UserIcon size={32} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">You are not signed in</h1>
        <p className="text-sm text-gray-600 mb-6">
          Please sign in to view your orders, shipping details, and account settings.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-market-yellow text-market-black font-extrabold px-6 py-3 rounded-lg hover:bg-market-yellowDark transition text-sm uppercase tracking-wider"
        >
          <span>Sign In With Your Password</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      phone,
      address,
      city,
      postalCode,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          desc: 'Full Administrator: Total control over inventory, orders, settings, and can create/remove user accounts.',
          label: 'System Administrator',
        };
      case 'MODERATOR':
        return {
          bg: 'bg-blue-100 text-blue-900 border-blue-300',
          desc: 'Store Moderator: Full control over catalog products, stock adjustments, and order workflows.',
          label: 'Store Operations Moderator',
        };
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          desc: 'Active Shopper: Full storefront access, orders tracking, and personal profile security.',
          label: 'Verified Customer',
        };
    }
  };

  const roleInfo = getRoleBadge(currentUser.role);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-140px)] py-10">
      <div className="site-container max-w-5xl">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">My Account</span>
        </div>

        {/* Top Header Card */}
        <div className="bg-[#1c1c1c] text-white p-6 sm:p-8 rounded-2xl shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-market-yellow text-market-black font-black text-2xl flex items-center justify-center flex-shrink-0 shadow-md">
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black">{currentUser.fullName}</h1>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${roleInfo.bg}`}>
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 flex items-center gap-2">
                <Mail size={13} className="text-market-yellow" />
                <span>{currentUser.email}</span>
                <span className="text-gray-500">&bull;</span>
                <span className="text-gray-400">
                  Member since {new Date(currentUser.createdAt).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Actions based on Role */}
          <div className="flex flex-wrap items-center gap-3">
            {(currentUser.role === 'ADMIN' || currentUser.role === 'MODERATOR') && (
              <Link
                href="/admin"
                className="bg-market-yellow hover:bg-market-yellowDark text-market-black font-extrabold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition shadow"
              >
                <LayoutDashboard size={14} />
                <span>WP Back Office</span>
                <ExternalLink size={12} className="opacity-70" />
              </Link>
            )}

            {currentUser.role === 'ADMIN' && (
              <Link
                href="/admin/users"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-lg border border-white/20 flex items-center gap-1.5 transition"
              >
                <Users size={14} className="text-market-yellow" />
                <span>Manage Accounts</span>
              </Link>
            )}

            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium text-xs px-3.5 py-2.5 rounded-lg border border-red-500/30 flex items-center gap-1.5 transition"
              title="Sign Out to change accounts"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Two Column Layout: Profile Details & Order History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Security Role Info & Profile Info */}
          <div className="space-y-6">
            {/* Security Privilege Details */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-market-yellow" />
                <span>Account Status &amp; Privileges</span>
              </h2>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 mb-3">
                <div className="font-bold text-gray-900 text-xs mb-1">{roleInfo.label}</div>
                <div className="text-[11px] text-gray-600 leading-relaxed">{roleInfo.desc}</div>
              </div>

              {currentUser.role === 'CUSTOMER' ? (
                <ul className="text-xs space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">&#10003;</span>
                    <span>Full storefront catalog browsing &amp; shopping</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">&#10003;</span>
                    <span>Free express shipping on all orders over $100</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">&#10003;</span>
                    <span>30-day money-back guarantee protection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">&#10003;</span>
                    <span>Salted cryptographic password encryption</span>
                  </li>
                </ul>
              ) : (
                <ul className="text-xs space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">&#10003;</span>
                    <span>WordPress Back Office administration access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">&#10003;</span>
                    <span>Add, edit products &amp; configure stock quantity</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">&#10003;</span>
                    <span>Manage WooCommerce orders &amp; shipments</span>
                  </li>
                  {currentUser.role === 'ADMIN' && (
                    <li className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">&#10003;</span>
                      <span>Administrator privilege: Add, update &amp; delete user accounts</span>
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Address & Contact Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                  <MapPin size={16} className="text-market-yellow" />
                  <span>Shipping Address</span>
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-market-black hover:text-amber-600 font-bold flex items-center gap-1 transition"
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {saveSuccess && (
                <div className="mb-4 p-2.5 bg-green-50 text-green-800 border border-green-200 rounded text-xs flex items-center gap-2 animate-in fade-in">
                  <Check size={14} className="text-green-600" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-market-yellow"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1-555-0100"
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-market-yellow"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Showcase Way"
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-market-yellow"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="San Francisco"
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-market-yellow"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="94105"
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-market-yellow"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold px-3 py-1.5 rounded text-xs transition"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium px-3 py-1.5 rounded text-xs transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-xs text-gray-600 space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-800">{currentUser.fullName}</div>
                      <div>{currentUser.address || 'No street address on file'}</div>
                      <div>
                        {currentUser.city ? `${currentUser.city}, ` : ''}
                        {currentUser.postalCode || ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                    <Phone size={14} className="text-gray-400 flex-shrink-0" />
                    <span>{currentUser.phone || 'No phone number specified'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order History & Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Package size={18} className="text-market-yellow" />
                    <span>Order History</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    View completed orders, tracking numbers, and fulfillment status.
                  </p>
                </div>
                <Link
                  href="/catalog"
                  className="bg-gray-100 hover:bg-market-yellow text-market-black font-bold text-xs px-3 py-2 rounded-lg transition flex items-center gap-1"
                >
                  <ShoppingBag size={14} />
                  <span>Shop Catalog</span>
                </Link>
              </div>

              {isLoadingOrders ? (
                <div className="py-12 text-center text-xs text-gray-400">Loading orders...</div>
              ) : displayOrders.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                    <Package size={24} />
                  </div>
                  <h3 className="font-bold text-sm text-gray-800 mb-1">No orders placed yet</h3>
                  <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
                    Add products from the catalog and experience our concurrency-safe simulated checkout!
                  </p>
                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-1.5 bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold text-xs px-4 py-2 rounded transition"
                  >
                    <span>Browse Product Catalog</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayOrders.map((order: Order) => (
                    <div
                      key={order.orderId || order.orderNumber}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900">
                            #{order.orderNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                              order.status === 'DELIVERED' || order.status === 'SHIPPED' || order.status === 'PAYMENT_CONFIRMED'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'CANCELLED' || order.status === 'PAYMENT_FAILED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="text-gray-500 flex items-center gap-1 text-[11px]">
                          <Clock size={12} />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-gray-800">
                            {order.items?.length || 1} item(s) ordered
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Delivered to: {order.customerName} ({order.shippingAddress || 'Showcase Address'})
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Total Paid</div>
                          <div className="text-base font-extrabold text-market-black">
                            ${Number(order.total || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {order.items && order.items.length > 0 && (
                        <div className="pt-2 border-t border-gray-50 text-[11px] text-gray-500 flex flex-wrap gap-2">
                          {order.items.map((item: OrderItem, idx: number) => (
                            <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded">
                              {item.title} &times; {item.quantity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
