'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Award,
  Globe2,
  ArrowRight,
  Leaf,
  Clock,
  CheckCircle2,
  Quote,
} from 'lucide-react';

export default function AboutUsPage() {
  const brandPillars = [
    {
      icon: <Award className="text-market-yellowDark" size={28} />,
      title: 'Artisanal Integrity',
      description:
        'Every item in our collection is curated from independent workshops and master artisans who refuse to compromise on material quality, stitching, or longevity.',
    },
    {
      icon: <Leaf className="text-green-600" size={28} />,
      title: 'Sustainable Sourcing',
      description:
        'From full-grain vegetable-tanned leathers to organic French terry cotton, our products are responsibly crafted with minimal environmental footprints.',
    },
    {
      icon: <HeartHandshake className="text-amber-600" size={28} />,
      title: 'Direct-to-Consumer Honesty',
      description:
        'By partnering directly with makers, we eliminate traditional retail markups and licensing middlemen, passing genuine value directly to you.',
    },
    {
      icon: <Truck className="text-blue-600" size={28} />,
      title: 'Carbon-Neutral Delivery',
      description:
        'We deliver globally across 45+ countries with full transit insurance, carbon-offset shipping partners, and prompt real-time tracking from dispatch to door.',
    },
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Humble Beginnings',
      desc: 'Founded as a boutique studio workshop in Melbourne, curating limited-run leather goods and mechanical desk gear for discerning creatives.',
    },
    {
      year: '2022',
      title: 'Expanding the Marketplace',
      desc: 'Grew to include sustainable apparel, ergonomic home living essentials, and specialty audio equipment with strict durability standards.',
    },
    {
      year: '2024',
      title: 'Global Express Logistics',
      desc: 'Launched worldwide fulfillment hubs, bringing delivery times under 3–5 business days to North America, Europe, and Asia-Pacific.',
    },
    {
      year: 'Today',
      title: 'The Modern Lifestyle Destination',
      desc: 'Over 50,000 satisfied customers across the globe, united by a shared appreciation for enduring quality and intentional design.',
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Banner */}
      <section className="relative bg-[#1c1c1c] text-white py-20 md:py-28 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-market-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="site-container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-market-yellow/10 text-market-yellow px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-market-yellow/20">
              <Sparkles size={14} />
              <span>Our Story & Philosophy</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold font-heading tracking-tight mb-6 leading-tight">
              Crafted for Life. <br />
              <span className="text-market-yellow">Designed for Intentional Living.</span>
            </h1>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
              We founded Ecommerce Shop on a simple belief: everyday products should be built with
              soul, exceptional craftsmanship, and materials that grow better with age.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/catalog"
                className="bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded transition flex items-center gap-2 shadow-lg"
              >
                <span>Explore the Collection</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="border border-white/30 hover:border-white text-white font-bold uppercase tracking-wider text-xs px-7 py-3.5 rounded transition"
              >
                Contact Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Strip */}
      <section className="bg-market-yellow text-market-black py-8 border-y border-market-yellowDark">
        <div className="site-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-black font-heading">50,000+</div>
              <div className="text-xs uppercase font-bold tracking-wider mt-1 text-market-black/80">
                Happy Customers
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black font-heading">99.4%</div>
              <div className="text-xs uppercase font-bold tracking-wider mt-1 text-market-black/80">
                Satisfaction Rating
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black font-heading">45+</div>
              <div className="text-xs uppercase font-bold tracking-wider mt-1 text-market-black/80">
                Countries Shipped To
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black font-heading">3 Years</div>
              <div className="text-xs uppercase font-bold tracking-wider mt-1 text-market-black/80">
                Craft Warranty
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Brand Story & Artisan Heritage */}
      <section className="py-20 site-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">
              Authentic Craftsmanship
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-market-black tracking-tight mb-6">
              Rejecting Disposable Culture, Embracing Timeless Value.
            </h2>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                In a world flooded with fast-fashion and planned obsolescence, we chose a different
                path. Every bag, audio accessory, and home piece we offer has been tested in
                real-world conditions to guarantee it stands up to everyday rigor.
              </p>
              <p>
                Our signature leathers are vegetable-tanned in family-run tanneries, developing a rich,
                distinctive patina over years of use. Our electronics and mechanical devices feature
                modular components designed to be repaired and cherished, not discarded.
              </p>
              <p>
                When you buy from us, you aren&apos;t just purchasing an item &mdash; you are investing
                in a relationship with honest design and fair artisan labor.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-6 pt-6 border-t border-gray-100">
              <div>
                <strong className="block text-base font-bold text-market-black">
                  Alex & Morgan Vance
                </strong>
                <span className="text-xs text-gray-500">Co-Founders & Creative Directors</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl bg-gray-100 border border-gray-200">
              <img
                src="/images/slider.png"
                alt="Artisan craftsmanship workshop"
                className="w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-[#1c1c1c] text-white p-5 rounded-lg shadow-2xl max-w-xs hidden sm:block">
              <div className="flex items-center gap-2 text-market-yellow text-xs font-bold uppercase tracking-wider mb-1">
                <CheckCircle2 size={16} />
                <span>30-Day Risk-Free Trial</span>
              </div>
              <p className="text-[11px] text-gray-300">
                Experience our goods in your home. If you don&apos;t absolutely love them, returns are
                100% free and easy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Pillars Grid */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">
              Our Core Promises
            </span>
            <h2 className="text-3xl font-bold text-market-black tracking-tight mb-4">
              What Sets Our Marketplace Apart
            </h2>
            <p className="text-sm text-gray-500">
              From source workshop to final unboxing, we hold ourselves accountable to the highest standard of excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {brandPillars.map((p, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-5">
                    {p.icon}
                  </div>
                  <h3 className="font-bold text-base text-market-black mb-2">{p.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Company Milestones */}
      <section className="py-20 site-container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">
            The Journey
          </span>
          <h2 className="text-3xl font-bold text-market-black tracking-tight mb-4">
            How We Grew
          </h2>
          <p className="text-sm text-gray-500">
            A timeline of milestones reflecting our commitment to continuous design improvement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative p-5 bg-white border border-gray-200 rounded-lg">
              <span className="text-2xl font-black text-market-yellowDark font-heading block mb-1">
                {m.year}
              </span>
              <h3 className="text-sm font-bold text-market-black mb-2">{m.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Customer Testimonial Quote */}
      <section className="py-16 bg-[#1c1c1c] text-white">
        <div className="site-container max-w-3xl text-center">
          <Quote size={40} className="mx-auto text-market-yellow mb-6 opacity-60" />
          <blockquote className="text-lg md:text-xl font-medium leading-relaxed mb-6 text-gray-200">
            &ldquo;The Artisan Leather Weekender is by far the best travel bag I have ever owned.
            The hardware is heavy and solid, the leather smells incredible, and after two years of
            flights it looks even better than the day it arrived.&rdquo;
          </blockquote>
          <div className="font-bold text-sm text-market-yellow">David H. &mdash; San Francisco, CA</div>
          <div className="text-xs text-gray-400 mt-0.5">Verified Purchaser &bull; Artisan Weekender</div>
        </div>
      </section>

      {/* 7. Bottom Call to Action */}
      <section className="py-20 site-container text-center">
        <h2 className="text-3xl font-bold text-market-black mb-4">
          Ready to experience genuine craftsmanship?
        </h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto mb-8">
          Browse our new arrivals, enjoy free worldwide shipping on orders over $100, and elevate your everyday carry.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold uppercase tracking-wider text-xs px-8 py-4 rounded shadow-md transition"
        >
          <span>Explore Storefront Catalog</span>
          <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
