'use client';

import React from 'react';
import { Category } from '@/types';
import { Layers, Laptop, Shirt, Home, Book, Activity } from 'lucide-react';

interface CategoryBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export default function CategoryBar({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryBarProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'laptop':
        return <Laptop size={14} />;
      case 'shirt':
        return <Shirt size={14} />;
      case 'home':
        return <Home size={14} />;
      case 'book':
        return <Book size={14} />;
      case 'activity':
        return <Activity size={14} />;
      default:
        return <Layers size={14} />;
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
      <button
        onClick={() => onSelectCategory('')}
        className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap ${
          selectedCategory === ''
            ? 'bg-market-black text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-market-yellow hover:text-market-black'
        }`}
      >
        <Layers size={14} />
        <span>All</span>
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.slug)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap ${
              isSelected
                ? 'bg-market-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-market-yellow hover:text-market-black'
            }`}
          >
            {getIcon(cat.iconName)}
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
