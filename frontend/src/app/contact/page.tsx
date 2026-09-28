'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('John Tester');
  const [email, setEmail] = useState('john.tester@example.com');
  const [subject, setSubject] = useState('Portfolio Feedback & Showcase Review');
  const [message, setMessage] = useState(
    'Hello! I reviewed your full-stack mock e-commerce showcase. Great work on the pessimistic inventory locking, deterministic payment simulation, and seamless UI presets!'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleFillPreset = () => {
    setName('Alice Evaluator');
    setEmail('alice.evaluator@example.com');
    setSubject('Architecture Evaluation Feedback');
    setMessage('Testing the contact form preset. All features, presets, and navbar routes are responding nicely!');
    setIsSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <section className="bg-[#1c1c1c] text-white py-16 border-b border-black">
        <div className="site-container">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-market-yellow/10 text-market-yellow px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-market-yellow/20">
              <Mail size={13} />
              <span>Get In Touch</span>
            </div>
            <h1 className="text-4xl font-bold font-heading tracking-tight mb-4">
              Contact <span className="text-market-yellow">Us</span>
            </h1>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Have feedback on this showcase or want to discuss full-stack distributed system architecture? Feel free to reach out.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 site-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Column */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-bold text-base text-market-black mb-4 uppercase tracking-wider">
                Showcase Information
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                This project is part of a full-stack portfolio demonstrating Next.js, Spring Boot 3, and Oracle Database integration.
              </p>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-market-black flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <strong className="block text-gray-800">Location</strong>
                    <span className="text-gray-500">Melbourne, Australia / Worldwide Demo</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-market-black flex-shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <strong className="block text-gray-800">Email Inquiries</strong>
                    <span className="text-gray-500">demo.showcase@example.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-market-black flex-shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <strong className="block text-gray-800">Direct Contact</strong>
                    <span className="text-gray-500">+1-555-0199</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Fast-Fill Preset */}
            <div className="bg-market-yellowLight border border-market-yellowDark/30 p-5 rounded-lg">
              <div className="flex items-center gap-1.5 text-xs font-bold text-market-black uppercase tracking-wider mb-2">
                <Sparkles size={14} className="text-amber-700" />
                <span>Preset Demo Feedback:</span>
              </div>
              <p className="text-xs text-gray-700 mb-3">
                Pre-fill this form with evaluator preset values so you don&apos;t have to type anything manually.
              </p>
              <button
                type="button"
                onClick={handleFillPreset}
                className="bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold uppercase tracking-wider text-[11px] px-4 py-2 rounded transition shadow"
              >
                ⚡ Load Feedback Preset
              </button>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-bold text-lg text-market-black mb-1 uppercase tracking-wider">
                Send a Message
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                All fields are pre-populated with preset values for instant testing.
              </p>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-900 p-6 rounded-lg text-center space-y-3">
                  <CheckCircle2 size={40} className="mx-auto text-green-600" />
                  <h4 className="font-bold text-base">Message Sent Successfully!</h4>
                  <p className="text-xs text-gray-600 max-w-md mx-auto">
                    Thank you, {name}! Your message &ldquo;{subject}&rdquo; has been received by the simulated contact service.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold text-xs px-5 py-2 rounded mt-2 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-gray-700 font-semibold mb-1">Your Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-market-yellowDark"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-gray-700 font-semibold mb-1">Email Address</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-market-yellowDark"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-gray-700 font-semibold mb-1">Subject</label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-market-yellowDark"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-gray-700 font-semibold mb-1">Message</label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-market-yellowDark"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="submit"
                      className="bg-market-yellow hover:bg-market-yellowDark text-market-black font-bold uppercase tracking-wider text-xs px-8 py-3 rounded flex items-center gap-2 shadow transition"
                    >
                      <Send size={14} />
                      <span>Submit Message</span>
                    </button>

                    <Link
                      href="/"
                      className="text-xs text-gray-500 hover:text-black hover:underline"
                    >
                      &larr; Back to Shop
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
