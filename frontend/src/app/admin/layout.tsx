'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  Settings,
  ChevronDown,
  ExternalLink,
  Plus,
  MessageSquare,
  HelpCircle,
  Menu,
  X,
  SlidersHorizontal,
  Store,
  Layers,
  Sparkles,
  Users,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useAuthStore } from '@/stores/useAuthStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { simulationMode, setSimulationMode } = useSimulatorStore();
  const { currentUser, logout } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isScreenOptionsOpen, setIsScreenOptionsOpen] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
      href: '/admin',
      activeMatch: (p: string) => p === '/admin',
    },
    {
      title: 'Products',
      icon: <Package size={18} />,
      href: '/admin/products',
      activeMatch: (p: string) => p.startsWith('/admin/products'),
      subItems: [
        { title: 'All Products', href: '/admin/products' },
        { title: 'Add New', href: '/admin/products/new' },
      ],
    },
    {
      title: 'Stock & Concurrency',
      icon: <Boxes size={18} />,
      href: '/admin/inventory',
      activeMatch: (p: string) => p.startsWith('/admin/inventory'),
    },
    {
      title: 'WooCommerce',
      icon: <ShoppingCart size={18} />,
      href: '/admin/orders',
      activeMatch: (p: string) => p.startsWith('/admin/orders'),
      subItems: [{ title: 'Orders', href: '/admin/orders' }],
    },
    {
      title: 'Users',
      icon: <Users size={18} />,
      href: '/admin/users',
      activeMatch: (p: string) => p.startsWith('/admin/users'),
      adminOnlyBadge: currentUser?.role !== 'ADMIN',
      subItems: [{ title: 'All Users', href: '/admin/users' }],
    },
    {
      title: 'Settings',
      icon: <Settings size={18} />,
      href: '/admin/settings',
      activeMatch: (p: string) => p.startsWith('/admin/settings'),
    },
  ];

  // Access Guard: only MODERATOR and ADMIN are permitted into the back office
  const isAuthorized = currentUser?.role === 'ADMIN' || currentUser?.role === 'MODERATOR';

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#2c3338] font-sans antialiased flex flex-col">
      {/* 1. WordPress Admin Top Bar (#1d2327, 32px height) */}
      <header className="h-8 bg-[#1d2327] text-[#c3c4c7] text-[13px] flex items-center justify-between px-3 fixed top-0 left-0 right-0 z-50 select-none border-b border-black/20">
        {/* Left items */}
        <div className="flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden text-[#c3c4c7] hover:text-white p-1"
          >
            {isMobileSidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          {/* WordPress Logo Mark */}
          <div className="flex items-center gap-1.5 hover:text-[#72aee6] cursor-pointer">
            <span className="w-5 h-5 rounded-full bg-[#3858e9] text-white font-bold flex items-center justify-center text-[11px] font-serif shadow-sm">
              W
            </span>
          </div>

          {/* Site Name -> Visit Store */}
          <div className="group relative">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-[#72aee6] transition py-1 font-medium"
            >
              <Store size={14} />
              <span>Ecommerce Shop</span>
            </Link>
          </div>

          {/* Quick + New Product */}
          <div className="hidden sm:flex items-center">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-1 hover:text-[#72aee6] transition py-1 text-xs"
            >
              <Plus size={13} />
              <span>New Product</span>
            </Link>
          </div>

          {/* Direct link back to storefront */}
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1 text-[11px] text-[#72aee6] hover:underline"
          >
            <span>Visit Storefront</span>
            <ExternalLink size={11} />
          </Link>
        </div>

        {/* Right items */}
        <div className="flex items-center gap-3">
          {/* Simulator Mode pill */}
          <div className="flex items-center gap-1.5 bg-[#2c3338] px-2 py-0.5 rounded text-[11px] text-white">
            <SlidersHorizontal size={11} className="text-[#dba617]" />
            <span>Sim:</span>
            <select
              value={simulationMode}
              onChange={(e) => setSimulationMode(e.target.value as any)}
              className="bg-transparent text-white outline-none cursor-pointer font-semibold text-[11px]"
            >
              <option value="AUTO" className="text-black">Auto</option>
              <option value="FORCE_SUCCESS" className="text-black">Force Success</option>
              <option value="FORCE_DECLINE" className="text-black">Force Decline</option>
              <option value="FORCE_TIMEOUT" className="text-black">Force Timeout</option>
            </select>
          </div>

          {/* User profile */}
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/account"
              className="flex items-center gap-1.5 hover:text-[#72aee6] transition"
              title="View Account Profile"
            >
              <span>Howdy, <strong className="text-white">{currentUser?.fullName.split(' ')[0] || 'Guest'}</strong></span>
              <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${
                currentUser?.role === 'ADMIN'
                  ? 'bg-[#dba617] text-black'
                  : currentUser?.role === 'MODERATOR'
                  ? 'bg-blue-400 text-white'
                  : 'bg-emerald-400 text-white'
              }`}>
                {currentUser?.role || 'Guest'}
              </span>
              <div className="w-5 h-5 rounded-full bg-[#dba617] text-black font-bold flex items-center justify-center text-[10px]">
                {currentUser ? currentUser.fullName.charAt(0).toUpperCase() : 'G'}
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Screen Options & Help drawer tabs (WordPress signature) */}
      <div className="fixed top-8 right-5 z-40 flex gap-1">
        <button
          onClick={() => setIsHelpOpen(!isHelpOpen)}
          className="bg-white text-[#50575e] text-xs px-2.5 py-0.5 border border-t-0 border-[#c3c4c7] rounded-b shadow-sm hover:text-[#2271b1] flex items-center gap-1"
        >
          <span>Help</span>
          <ChevronDown size={11} className={`transition-transform ${isHelpOpen ? 'rotate-180' : ''}`} />
        </button>
        <button
          onClick={() => setIsScreenOptionsOpen(!isScreenOptionsOpen)}
          className="bg-white text-[#50575e] text-xs px-2.5 py-0.5 border border-t-0 border-[#c3c4c7] rounded-b shadow-sm hover:text-[#2271b1] flex items-center gap-1"
        >
          <span>Screen Options</span>
          <ChevronDown size={11} className={`transition-transform ${isScreenOptionsOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isHelpOpen && (
        <div className="fixed top-14 right-5 w-80 bg-white border border-[#c3c4c7] shadow-lg rounded p-4 z-40 text-xs text-[#50575e] animate-in fade-in duration-150">
          <strong className="block text-[#1d2327] mb-1 font-semibold">WordPress-Style Back Office Help</strong>
          <p className="mb-2">
            This administrative portal allows you to configure store values behind the scenes:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Products:</strong> Add, edit price/SKU/title, or deactivate items.</li>
            <li><strong>Stock & Concurrency:</strong> Set available inventory to 1 unit to test pessimistic locks.</li>
            <li><strong>WooCommerce Orders:</strong> Inspect customer details and advance order statuses.</li>
            <li><strong>Settings:</strong> Modify tax rate and payment simulation behavior.</li>
          </ul>
        </div>
      )}

      {isScreenOptionsOpen && (
        <div className="fixed top-14 right-5 w-72 bg-white border border-[#c3c4c7] shadow-lg rounded p-4 z-40 text-xs text-[#50575e] animate-in fade-in duration-150">
          <strong className="block text-[#1d2327] mb-2 font-semibold">Screen Display Options</strong>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-[#8c8f94] text-[#2271b1]" />
              <span>Show Product Thumbnails</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-[#8c8f94] text-[#2271b1]" />
              <span>Show Real-Time Stock Status</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded border-[#8c8f94] text-[#2271b1]" />
              <span>Display Simulation Controls</span>
            </label>
          </div>
        </div>
      )}

      {/* Main Container: Left Sidebar + Right Content */}
      <div className="flex-1 flex pt-8">
        {/* 2. Left WordPress Admin Sidebar (#1d2327) */}
        <aside
          className={`bg-[#1d2327] text-[#c3c4c7] flex-shrink-0 transition-all duration-200 z-30 select-none ${
            isSidebarCollapsed ? 'w-12' : 'w-44'
          } hidden md:flex flex-col justify-between`}
        >
          <div>
            <nav className="py-2 space-y-0.5">
              {menuItems.map((item) => {
                const isActive = item.activeMatch(pathname);
                return (
                  <div key={item.title} className="group relative">
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium transition ${
                        isActive
                          ? 'bg-[#2271b1] text-white font-semibold'
                          : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                      }`}
                      title={item.title}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!isSidebarCollapsed && <span>{item.title}</span>}
                    </Link>

                    {/* Submenu for active item */}
                    {isActive && item.subItems && !isSidebarCollapsed && (
                      <div className="bg-[#2c3338] py-1">
                        {item.subItems.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.title}
                              href={sub.href}
                              className={`block pl-9 pr-3 py-1 text-xs transition ${
                                isSubActive
                                  ? 'text-white font-bold'
                                  : 'text-[#c3c4c7] hover:text-[#72aee6]'
                              }`}
                            >
                              {sub.title}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Collapse sidebar button */}
          <div className="p-3 border-t border-[#2c3338]">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="flex items-center gap-2 text-xs text-[#a7aaad] hover:text-[#72aee6] transition"
            >
              <span>{isSidebarCollapsed ? '►' : '◄'}</span>
              {!isSidebarCollapsed && <span>Collapse menu</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {isMobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex">
            <div className="w-56 bg-[#1d2327] text-[#c3c4c7] h-full pt-10 flex flex-col justify-between">
              <nav className="py-2 space-y-0.5">
                {menuItems.map((item) => {
                  const isActive = item.activeMatch(pathname);
                  return (
                    <div key={item.title}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition ${
                          isActive
                            ? 'bg-[#2271b1] text-white font-semibold'
                            : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                        }`}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                      {item.subItems && isActive && (
                        <div className="bg-[#2c3338] py-1">
                          {item.subItems.map((sub) => (
                            <Link
                              key={sub.title}
                              href={sub.href}
                              onClick={() => setIsMobileSidebarOpen(false)}
                              className="block pl-10 pr-4 py-1.5 text-xs text-[#c3c4c7] hover:text-[#72aee6]"
                            >
                              {sub.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-[#2c3338]">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xs text-[#72aee6] hover:underline"
                >
                  <Store size={14} />
                  <span>Return to Public Store</span>
                </Link>
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
          </div>
        )}

        {/* 3. Main Content Workspace (#f0f0f1) */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto max-w-full">
          {!isAuthorized ? (
            <div className="max-w-xl mx-auto py-12">
              <div className="bg-white border-l-4 border-[#d63638] shadow-sm p-6 rounded-r">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-[#d63638] flex-shrink-0">
                    <ShieldAlert size={22} />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-lg font-bold text-[#1d2327] mb-1">
                      Sorry, you are not allowed to access this page.
                    </h1>
                    <p className="text-xs text-[#50575e] leading-relaxed mb-4">
                      The WordPress Back Office requires <strong className="text-black font-semibold">Moderator</strong> or <strong className="text-black font-semibold">Administrator</strong> privileges. Your current account ({currentUser?.email || 'Guest'}) has the <strong className="text-black font-semibold">{currentUser?.role || 'CUSTOMER'}</strong> role.
                    </p>

                    <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-3">
                      <Link
                        href="/login"
                        onClick={() => logout()}
                        className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 transition shadow-sm"
                      >
                        <LogOut size={13} />
                        <span>Sign Out &amp; Sign In with Staff Account</span>
                      </Link>
                      <Link
                        href="/"
                        className="border border-[#c3c4c7] hover:bg-gray-100 text-[#2c3338] text-xs font-semibold px-3 py-2 rounded flex items-center gap-1 transition"
                      >
                        <span>Return to Store</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
