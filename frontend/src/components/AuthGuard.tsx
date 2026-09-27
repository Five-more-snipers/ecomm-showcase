'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { ShieldCheck, Lock } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    // 1. If user is NOT logged in and not already on the login page:
    if (!currentUser && pathname !== '/login') {
      const redirectUrl = pathname === '/' ? '/login' : `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirectUrl);
      return;
    }

    // 2. If user IS logged in and attempts to visit /login:
    if (currentUser && pathname === '/login') {
      if (currentUser.role === 'ADMIN' || currentUser.role === 'MODERATOR') {
        router.replace('/admin');
      } else {
        router.replace('/account');
      }
    }
  }, [currentUser, isInitialized, pathname, router]);

  // Loading screen while initializing auth from storage
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#1c1c1c] text-white flex flex-col items-center justify-center p-6 select-none">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-market-yellow/30 border-t-market-yellow rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-market-yellow">
            <Lock size={20} />
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-extrabold uppercase tracking-widest text-market-yellow mb-1 font-heading">
            ECOMMERCE <span className="text-white">SECURITY</span>
          </div>
          <p className="text-xs text-gray-400">Verifying security session &amp; credentials...</p>
        </div>
      </div>
    );
  }

  // Intercept view if user is unauthenticated and attempting to view protected pages
  if (!currentUser && pathname !== '/login') {
    return (
      <div className="min-h-screen bg-[#1c1c1c] text-white flex flex-col items-center justify-center p-6 select-none">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-market-yellow/30 border-t-market-yellow rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-market-yellow">
            <Lock size={20} />
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-extrabold uppercase tracking-widest text-market-yellow mb-1 font-heading">
            ACCESS PROTOCOL <span className="text-white">ENFORCED</span>
          </div>
          <p className="text-xs text-gray-400">Authentication required. Redirecting to login gateway...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
