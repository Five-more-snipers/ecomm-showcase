'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  User as UserIcon,
  ShoppingCart,
  ChevronDown,
  SlidersHorizontal,
  Sparkles,
  LogOut,
  Shield,
  LayoutDashboard,
  CheckCircle,
} from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCatalogFilterStore } from '@/stores/useCatalogFilterStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCart, fetchCategories, seedPresetCart } from '@/lib/api';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  if (pathname?.startsWith('/admin')) return null;

  const { cartId, openCart } = useCartStore();
  const { simulationMode, setSimulationMode } = useSimulatorStore();
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } = useCatalogFilterStore();
  const { currentUser, logout } = useAuthStore();

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: cart } = useQuery({
    queryKey: ['cart', cartId],
    queryFn: () => fetchCart(cartId),
    enabled: !!cartId,
  });

  const seedPresetMutation = useMutation({
    mutationFn: () => seedPresetCart(cartId),
    onSuccess: (seededCart) => {
      queryClient.setQueryData(['cart', cartId], seededCart);
      queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
      openCart();
    },
  });

  const totalItems = cart?.totalItems ?? 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname !== '/catalog') {
      router.push('/catalog');
    }
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setIsCategoryMenuOpen(false);
    if (pathname !== '/catalog') {
      router.push('/catalog');
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Catalog', href: '/catalog' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-amber-400 text-black font-extrabold';
      case 'MODERATOR':
        return 'bg-blue-500 text-white font-bold';
      default:
        return 'bg-emerald-500 text-white font-semibold';
    }
  };

  return (
    <header className="w-full relative z-40">
      {/* 1. Black Main Menu Bar */}
      <div className="bg-[#1c1c1c] text-white py-3.5 border-b border-black">
        <div className="site-container flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="flex items-center gap-1">
              <span className="text-market-yellow text-2xl font-black tracking-tighter group-hover:scale-110 transition-transform">
                ///
              </span>
              <span className="text-white text-xl font-extrabold tracking-wider uppercase font-heading">
                ECOMMERCE <span className="text-market-yellow">SHOP</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`transition pb-1 ${
                  isLinkActive(link.href)
                    ? 'text-market-yellow font-bold border-b-2 border-market-yellow'
                    : 'text-gray-200 hover:text-market-yellow'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden text-white p-1.5 hover:text-market-yellow transition"
            aria-label="Toggle navigation menu"
          >
            {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileNavOpen && (
          <div className="md:hidden bg-[#242424] border-t border-gray-800 px-6 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileNavOpen(false)}
                className={`block text-sm py-1.5 transition ${
                  isLinkActive(link.href)
                    ? 'text-market-yellow font-bold'
                    : 'text-gray-200 hover:text-market-yellow'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {(currentUser?.role === 'ADMIN' || currentUser?.role === 'MODERATOR') && (
              <div className="pt-3 border-t border-gray-700 flex items-center justify-between">
                <button
                  onClick={() => {
                    seedPresetMutation.mutate();
                    setIsMobileNavOpen(false);
                  }}
                  className="bg-market-yellow text-market-black font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1"
                >
                  <Sparkles size={12} />
                  <span>Load Demo Preset</span>
                </button>

                <select
                  value={simulationMode}
                  onChange={(e) => setSimulationMode(e.target.value as any)}
                  className="bg-black/40 text-xs text-white px-2 py-1 rounded border border-gray-700 outline-none"
                >
                  <option value="AUTO">Sim: Auto</option>
                  <option value="FORCE_SUCCESS">Sim: Success</option>
                  <option value="FORCE_DECLINE">Sim: Decline</option>
                  <option value="FORCE_TIMEOUT">Sim: Timeout</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. White Search & Category Bar */}
      <div className="bg-white py-4 border-b border-gray-200 shadow-sm relative z-30">
        <div className="site-container flex flex-wrap items-center justify-between gap-4">
          {/* CATEGORIES dropdown button */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold uppercase text-xs tracking-wider px-5 py-3 flex items-center gap-2 rounded transition"
            >
              <Menu size={16} />
              <span>CATEGORIES</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isCategoryMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-gray-200 shadow-xl rounded z-50 py-2">
                <button
                  onClick={() => handleCategorySelect('')}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-market-yellowLight transition ${
                    selectedCategory === ''
                      ? 'bg-market-yellowLight font-bold text-market-black'
                      : 'text-gray-700'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCategorySelect(c.slug)}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-market-yellowLight transition ${
                      selectedCategory === c.slug
                        ? 'bg-market-yellowLight font-bold text-market-black'
                        : 'text-gray-700'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Box with Yellow SEARCH Button */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl flex items-center">
            <div className="relative w-full flex">
              <input
                type="text"
                placeholder="Search products in catalog (e.g. Headphones, Watch, Sneakers)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-market-yellow"
              />
              <button
                type="submit"
                className="bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold uppercase text-xs tracking-wider px-6 transition flex items-center gap-1.5"
              >
                <Search size={14} />
                <span className="hidden sm:inline">SEARCH</span>
              </button>
            </div>
          </form>

          {/* User Account & Cart Controls */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Simulation & Demo controls (strictly restricted to Admin & Moderator) */}
            {(currentUser?.role === 'ADMIN' || currentUser?.role === 'MODERATOR') && (
              <>
                <button
                  onClick={() => seedPresetMutation.mutate()}
                  disabled={seedPresetMutation.isPending}
                  className="hidden xl:flex items-center gap-1.5 bg-market-yellowLight hover:bg-market-yellow text-market-black border border-market-yellowDark/30 px-3 py-1.5 rounded text-xs font-bold transition"
                  title="Quick-load preset items, prices, and stock"
                >
                  <Sparkles size={13} className="text-amber-700" />
                  <span>{seedPresetMutation.isPending ? 'Loading...' : '⚡ Demo Preset'}</span>
                </button>

                <div className="hidden lg:flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-full text-xs">
                  <SlidersHorizontal size={13} className="text-gray-500" />
                  <select
                    value={simulationMode}
                    onChange={(e) => setSimulationMode(e.target.value as any)}
                    className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer"
                  >
                    <option value="AUTO">Sim: Auto</option>
                    <option value="FORCE_SUCCESS">Sim: Success</option>
                    <option value="FORCE_DECLINE">Sim: Decline</option>
                    <option value="FORCE_TIMEOUT">Sim: Timeout</option>
                  </select>
                </div>
              </>
            )}

            {/* User Account Dropdown */}
            <div className="relative" ref={userMenuRef}>
              {currentUser ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 py-1 px-2.5 rounded-lg border border-gray-200 hover:border-gray-400 bg-gray-50 transition text-left"
                  title="My Account & Roles"
                >
                  <div className="w-8 h-8 rounded-full bg-market-black text-market-yellow flex items-center justify-center font-bold text-xs">
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[100px]">
                      {currentUser.fullName.split(' ')[0]}
                    </div>
                    <span className={`inline-block text-[9px] uppercase px-1.5 py-0.2 rounded ${getRoleBadgeStyle(currentUser.role)}`}>
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-gray-500 hidden md:block" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 bg-market-black hover:bg-gray-800 text-market-yellow text-xs font-bold px-3.5 py-2 rounded transition shadow-sm"
                >
                  <UserIcon size={14} />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Account Dropdown Menu */}
              {currentUser && isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 shadow-2xl rounded-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/70">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 truncate">
                        {currentUser.fullName}
                      </span>
                      <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${getRoleBadgeStyle(currentUser.role)}`}>
                        {currentUser.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 truncate mt-0.5">
                      {currentUser.email}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-100 transition"
                    >
                      <UserIcon size={15} className="text-gray-500" />
                      <span>My Account & Orders</span>
                    </Link>

                    {(currentUser.role === 'ADMIN' || currentUser.role === 'MODERATOR') && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-amber-700 bg-amber-50/50 hover:bg-amber-100/60 font-semibold transition"
                      >
                        <LayoutDashboard size={15} />
                        <span>WP Back Office</span>
                      </Link>
                    )}

                    {currentUser.role === 'ADMIN' && (
                      <Link
                        href="/admin/users"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-blue-700 bg-blue-50/40 hover:bg-blue-100/60 font-semibold transition"
                      >
                        <Shield size={15} />
                        <span>Manage Users & Roles</span>
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-gray-100">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                        router.push('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition font-medium"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon with badge */}
            <button
              onClick={openCart}
              className="relative text-market-black hover:text-gray-600 transition flex items-center"
              title="Shopping Cart"
            >
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2.5 bg-market-yellow text-market-black font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border border-black/10">
                {totalItems < 10 ? `0${totalItems}` : totalItems}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
