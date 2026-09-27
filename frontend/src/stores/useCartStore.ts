import { create } from 'zustand';

interface CartState {
  cartId: string;
  isCartOpen: boolean;
  totalItemsBadge: number;
  initCartId: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setTotalItemsBadge: (count: number) => void;
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const useCartStore = create<CartState>((set, get) => ({
  cartId: '',
  isCartOpen: false,
  totalItemsBadge: 0,

  initCartId: () => {
    if (typeof window === 'undefined') return;
    let stored = localStorage.getItem('ecomm_cart_id');
    if (!stored) {
      stored = generateUUID();
      localStorage.setItem('ecomm_cart_id', stored);
    }
    set({ cartId: stored });
  },

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  setTotalItemsBadge: (count) => set({ totalItemsBadge: count }),
}));
