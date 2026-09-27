'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';
import AuthGuard from '@/components/AuthGuard';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 30, // 30 seconds
            retry: 1,
          },
        },
      })
  );

  const initCartId = useCartStore((s) => s.initCartId);
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initCartId();
    initAuth();
  }, [initCartId, initAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>{children}</AuthGuard>
    </QueryClientProvider>
  );
}
