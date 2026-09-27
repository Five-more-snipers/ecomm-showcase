'use client';

import React from 'react';
import Link from 'next/link';
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  CreditCard,
  Gift,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export default function ServicesPage() {
  const customerServices = [
    {
      icon: <Truck size={28} className="text-amber-600" />,
      title: 'Free Express Shipping',
      description:
        'Enjoy complimentary express delivery on all orders over $100. Every parcel is safely packed in eco-friendly protective materials and includes end-to-end tracking.',
      badge: 'Complimentary on $100+',
    },
    {
      icon: <RotateCcw size={28} className="text-cyan-600" />,
      title: '30-Day Hassle-Free Returns',
      description:
        'Not completely satisfied with your order? Return any unworn item with original tags within 30 days for an instant replacement or full refund.',
      badge: 'Risk-Free Guarantee',
    },
    {
      icon: <ShieldCheck size={28} className="text-green-600" />,
      title: '2-Year Hardware Warranty',
      description:
        'All electronics, smart accessories, and premium timepieces carry an inclusive 24-month manufacturer warranty covering defects and repairs.',
      badge: 'Extended Coverage',
    },
    {
      icon: <Headphones size={28} className="text-purple-600" />,
      title: '24/7 Customer Concierge',
      description:
        'Our dedicated support team is available around the clock via live chat, phone, and email to assist with sizing, order updates, or inquiries.',
      badge: '24/7 Availability',
    },
    {
      icon: <CreditCard size={28} className="text-market-yellowDark" />,
      title: 'Encrypted & Safe Checkout',
      description:
        'All transactions are processed through 256-bit bank-grade encryption protocols supporting major credit cards and instant digital wallets.',
      badge: '100% Secure',
    },
    {
      icon: <Gift size={28} className="text-rose-600" />,
      title: 'Complimentary Gift Packaging',
      description:
        'Sending a gift to someone special? Select complimentary gift box wrapping and personalized handwritten message cards at checkout.',
      badge: 'Premium Touch',
    },
  ];

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Hero Header */}
      <section className="bg-[#1c1c1c] text-white py-16 border-b border-black">
        <div className="site-container">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-market-yellow/10 text-market-yellow px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-market-yellow/20">
              <Sparkles size={13} />
              <span>Customer Care &amp; Shopping Perks</span>
            </div>
            <h1 className="text-4xl font-bold font-heading tracking-tight mb-4">
              Our Customer <span className="text-market-yellow">Commitment</span>
            </h1>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              From free expedited shipping and 30-day returns to our 24/7 concierge, discover the premium care that elevates your shopping experience.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 site-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {customerServices.map((s, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-market-yellow transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 bg-gray-50 rounded-xl">{s.icon}</div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                    {s.badge}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-market-black mb-2.5">{s.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">{s.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
                  <CheckCircle size={13} />
                  <span>Standard on every order</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-[#1c1c1c] text-white rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto shadow-lg">
          <h2 className="text-2xl font-bold font-heading mb-3">
            Experience Premium Shopping Today
          </h2>
          <p className="text-xs md:text-sm text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Browse our curated catalog of electronics, fashion, and lifestyle essentials with complete peace of mind.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/catalog"
              className="bg-market-yellow hover:bg-market-yellowDark text-market-black font-extrabold uppercase tracking-wider text-xs px-7 py-3.5 rounded-lg shadow transition flex items-center gap-2"
            >
              <ShoppingBag size={15} />
              <span>Explore The Catalog</span>
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold uppercase tracking-wider text-xs px-7 py-3.5 rounded-lg transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
