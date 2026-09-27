'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Lock,
  LayoutDashboard,
  Headphones,
  CheckCircle,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function Footer() {
  const pathname = usePathname();
  const { currentUser } = useAuthStore();

  if (pathname?.startsWith('/admin')) return null;

  const isStaff = currentUser?.role === 'ADMIN' || currentUser?.role === 'MODERATOR';

  return (
    <footer className="bg-[#1a1a1a] text-gray-300 pt-16 pb-8 border-t border-black">
      <div className="site-container">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-white/10 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-market-yellow/10 flex items-center justify-center text-market-yellow flex-shrink-0">
              <Truck size={22} />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Free Express Delivery</div>
              <div className="text-xs text-gray-400">Complimentary on orders over $100</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan-400/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="font-bold text-white text-sm">2-Year Warranty</div>
              <div className="text-xs text-gray-400">Inclusive hardware &amp; parts protection</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-400/10 flex items-center justify-center text-green-400 flex-shrink-0">
              <RotateCcw size={22} />
            </div>
            <div>
              <div className="font-bold text-white text-sm">30-Day Return Policy</div>
              <div className="text-xs text-gray-400">Hassle-free refunds &amp; exchanges</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-market-yellow/10 flex items-center justify-center text-market-yellow flex-shrink-0">
              <Lock size={22} />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Encrypted Security</div>
              <div className="text-xs text-gray-400">Salted SHA-256 cryptographic auth</div>
            </div>
          </div>
        </div>

        {/* Footer Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 text-xs text-gray-400 leading-relaxed">
          <div>
            <div className="font-heading text-lg font-bold text-white uppercase tracking-wider mb-3">
              ECOMMERCE <span className="text-market-yellow">SHOP</span>
            </div>
            <p className="mb-4">
              A high-end lifestyle marketplace curated with timeless craftsmanship and sustainable design. Built with full-stack enterprise reliability, distributed locking, and modern UX architecture.
            </p>
          </div>

          <div>
            <div className="font-bold text-white uppercase tracking-wider mb-3 text-sm">
              Customer Services
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog" className="text-gray-300 hover:text-market-yellow transition">
                  Browse Product Catalog &rarr;
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-market-yellow transition">
                  About Our Brand &amp; Heritage &rarr;
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-market-yellow transition">
                  Contact Customer Concierge &rarr;
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-gray-300 hover:text-market-yellow transition">
                  My Orders &amp; Account Security &rarr;
                </Link>
              </li>
            </ul>
          </div>

          <div>
            {isStaff ? (
              <>
                <div className="font-bold text-market-yellow uppercase tracking-wider mb-3 text-sm">
                  Staff Administrative Portal
                </div>
                <ul className="space-y-2">
                  <li>
                    <Link href="/admin" className="text-market-yellow hover:underline flex items-center gap-1 font-semibold">
                      <LayoutDashboard size={13} />
                      WordPress-Style Back Office &rarr;
                    </Link>
                  </li>
                  {currentUser?.role === 'ADMIN' && (
                    <li>
                      <Link href="/admin/users" className="text-gray-300 hover:text-white hover:underline flex items-center gap-1">
                        Manage Staff &amp; Customer Accounts &rarr;
                      </Link>
                    </li>
                  )}
                  <li>
                    <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white hover:underline flex items-center gap-1">
                      OpenAPI / Swagger UI Docs &rarr;
                    </a>
                  </li>
                </ul>
              </>
            ) : (
              <>
                <div className="font-bold text-white uppercase tracking-wider mb-3 text-sm">
                  Trust &amp; Compliance
                </div>
                <p className="mb-3 text-[11px] text-gray-400">
                  Every transaction is secured with bank-grade 256-bit encryption. Account credentials are protected using salted SHA-256 cryptographic hashing with zero plaintext storage.
                </p>
                <div className="flex items-center gap-2 text-green-400 font-semibold text-xs">
                  <CheckCircle size={14} />
                  <span>Verified Safe Shopping Environment</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-wrap justify-between items-center text-xs text-gray-500 gap-4">
          <div>&copy; {new Date().getFullYear()} Ecommerce Marketplace Showcase. All rights reserved.</div>
          <div>Protected by cryptographic salted hash security and deterministic transaction validation.</div>
        </div>
      </div>
    </footer>
  );
}
