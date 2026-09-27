'use client';

import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function HeroBanner() {
  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-[#f8e05d] overflow-hidden py-12 md:py-20 mb-12">
      <div className="site-container relative flex flex-col md:flex-row items-center justify-between">
        {/* Left Content Column */}
        <div className="w-full md:w-1/2 z-10 py-6">
          {/* Cursive Discount with Line */}
          <div className="mb-3">
            <span className="font-script text-2xl text-market-black discount-text-line">
              Up to 70% Off
            </span>
          </div>

          {/* Subhead */}
          <strong className="block text-lg font-bold text-market-black mb-2 tracking-wide uppercase">
            Summer Collection
          </strong>

          {/* Main Title in Oswald Bold */}
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-market-black mb-4 tracking-tight leading-none">
            Smart Headphone
          </h1>

          {/* Description */}
          <p className="text-market-black/80 font-normal text-sm md:text-base max-w-md mb-8 leading-relaxed">
            Experience high-definition audio with premium noise cancellation, rich bass, and up to 40 hours of playtime.
          </p>

          {/* Shop Now Button */}
          <button
            onClick={scrollToCatalog}
            className="border border-market-black text-market-black hover:bg-market-black hover:text-white font-semibold text-sm px-8 py-2.5 rounded transition uppercase tracking-wider"
          >
            Shop Now
          </button>
        </div>

        {/* Right Product Image Column */}
        <div className="w-full md:w-1/2 relative flex justify-center items-center mt-8 md:mt-0">
          <img
            src="/images/slider.png"
            alt="Smart Headphone"
            className="max-h-[380px] md:max-h-[460px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />

          {/* Slider Navigation Arrows (Matching screenshot.png on the right) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 z-20">
            <button
              onClick={scrollToCatalog}
              className="w-8 h-8 border border-market-black/40 rounded flex items-center justify-center bg-white/40 hover:bg-market-black hover:text-white transition"
              title="Next Slide"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={scrollToCatalog}
              className="w-8 h-8 border border-market-black/40 rounded flex items-center justify-center bg-white/40 hover:bg-market-black hover:text-white transition"
              title="Previous Slide"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
