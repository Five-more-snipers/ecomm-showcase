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
  if (typeof crypto !== 'undefined' && crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  let cryptoObj: Crypto | undefined;
  if (typeof window !== 'undefined') {
    cryptoObj = window.crypto;
  } else if (typeof crypto !== 'undefined') {
    cryptoObj = crypto;
  }
  if (cryptoObj?.getRandomValues) {
    const bytes = new Uint8Array(16);
    cryptoObj.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10xx
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  throw new Error('Cryptographically secure random number generator is not available.');
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
