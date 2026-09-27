import { SimulationMode } from '@/types';
import { create } from 'zustand';

interface SimulatorState {
  simulationMode: SimulationMode;
  isCheckoutOpen: boolean;
  activeOrderNumber: string | null;
  activeQuickViewProductId: number | null;
  setSimulationMode: (mode: SimulationMode) => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  openOrderModal: (orderNumber: string) => void;
  closeOrderModal: () => void;
  openQuickView: (productId: number) => void;
  closeQuickView: () => void;
}

export const useSimulatorStore = create<SimulatorState>((set) => ({
  simulationMode: 'AUTO',
  isCheckoutOpen: false,
  activeOrderNumber: null,
  activeQuickViewProductId: null,

  setSimulationMode: (mode) => set({ simulationMode: mode }),
  openCheckout: () => set({ isCheckoutOpen: true }),
  closeCheckout: () => set({ isCheckoutOpen: false }),
  openOrderModal: (orderNumber) => set({ activeOrderNumber: orderNumber }),
  closeOrderModal: () => set({ activeOrderNumber: null }),
  openQuickView: (productId) => set({ activeQuickViewProductId: productId }),
  closeQuickView: () => set({ activeQuickViewProductId: null }),
}));
