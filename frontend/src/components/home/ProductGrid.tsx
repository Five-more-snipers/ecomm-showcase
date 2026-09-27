'use client';

import React from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { PackageX } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 my-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3 animate-pulse">
            <div className="w-full aspect-[4/5] bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded p-12 text-center my-8">
        <PackageX size={40} className="mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-bold text-gray-800 mb-1">No Products Found</h3>
        <p className="text-sm text-gray-500">
          Try clearing your search keyword or switching category filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 my-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
