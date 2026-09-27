import { create } from 'zustand';

interface CatalogFilterState {
  searchTerm: string;
  selectedCategory: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (slug: string) => void;
  resetFilters: () => void;
}

export const useCatalogFilterStore = create<CatalogFilterState>((set) => ({
  searchTerm: '',
  selectedCategory: '',
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setSelectedCategory: (slug: string) => set({ selectedCategory: slug }),
  resetFilters: () => set({ searchTerm: '', selectedCategory: '' }),
}));
