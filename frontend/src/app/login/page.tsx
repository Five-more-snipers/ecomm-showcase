'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Mail,
  User,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const { login, register, currentUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          if (redirectParam) {
            router.push(redirectParam);
          } else {
            // Check logged in user role from store
            const user = useAuthStore.getState().currentUser;
            if (user?.role === 'ADMIN' || user?.role === 'MODERATOR') {
              router.push('/admin');
            } else {
              router.push('/catalog');
            }
          }
        }, 800);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await register(fullName, email, password);
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          router.push('/catalog');
        }, 1000);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const autofillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setActiveTab('signin');
    setErrorMessage(null);
  };

  return (
    <main className="min-h-screen bg-[#141414] py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-market-yellow/10 text-market-yellow px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-market-yellow/20">
            <Lock size={12} />
            <span>Secure Authentication Gateway</span>
          </div>
          <div>
            <span className="text-market-yellow text-3xl font-black tracking-tighter">///</span>
            <span className="text-white text-2xl font-extrabold tracking-wider uppercase font-heading ml-2">
              ECOMMERCE <span className="text-market-yellow">SHOP</span>
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Please log in with your verified credentials to access the store or administration back office.
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-[#1f1f1f] text-white rounded-2xl border border-gray-800 shadow-2xl p-6 sm:p-8">
          {/* Tab Selector */}
          <div className="flex border-b border-gray-800 mb-6">
            <button
              onClick={() => {
                setActiveTab('signin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
                activeTab === 'signin'
                  ? 'border-market-yellow text-market-yellow'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
                activeTab === 'signup'
                  ? 'border-market-yellow text-market-yellow'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-950/80 border border-red-500/50 rounded-lg text-xs text-red-200 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-950/80 border border-green-500/50 rounded-lg text-xs text-green-200 flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Sign In Form */}
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@marketplace.com"
                    className="w-full bg-[#121212] border border-gray-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-market-yellow pl-9"
                  />
                  <Mail size={15} className="absolute left-3 top-3 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Password (Encrypted)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full bg-[#121212] border border-gray-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-market-yellow pl-9 pr-9"
                  />
                  <Lock size={15} className="absolute left-3 top-3 text-gray-500 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-market-yellow hover:bg-market-yellowDark disabled:opacity-50 text-market-black font-extrabold uppercase tracking-wider text-xs py-3 rounded-lg transition shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In To Account'}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full bg-[#121212] border border-gray-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-market-yellow pl-9"
                  />
                  <User size={15} className="absolute left-3 top-3 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jane@example.com"
                    className="w-full bg-[#121212] border border-gray-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-market-yellow pl-9"
                  />
                  <Mail size={15} className="absolute left-3 top-3 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full bg-[#121212] border border-gray-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-market-yellow pl-9 pr-9"
                  />
                  <Lock size={15} className="absolute left-3 top-3 text-gray-500 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-[#121212] border border-gray-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-market-yellow pl-9"
                  />
                  <KeyRound size={15} className="absolute left-3 top-3 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-market-yellow hover:bg-market-yellowDark disabled:opacity-50 text-market-black font-extrabold uppercase tracking-wider text-xs py-3 rounded-lg transition shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Register Customer Account'}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>

        {/* Credential Reference Card (Listed in README.md) */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4 text-xs text-gray-400 space-y-3">
          <div className="flex items-center gap-2 text-market-yellow font-bold text-xs uppercase tracking-wider">
            <KeyRound size={14} />
            <span>Pre-Configured Accounts (Documented in README.md):</span>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            All accounts are protected by <strong>salted SHA-256 encryption</strong>. Click any account below to populate the login form for testing:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => autofillCredentials('admin@marketplace.com', 'AdminPassword123!')}
              className="p-2.5 rounded-lg bg-[#242424] hover:bg-[#2e2e2e] border border-gray-700 text-left transition"
            >
              <div className="font-bold text-amber-400 mb-0.5">Admin</div>
              <div className="text-[10px] text-gray-300 truncate">admin@marketplace.com</div>
              <div className="text-[10px] text-gray-500 font-mono mt-1">AdminPassword123!</div>
            </button>

            <button
              type="button"
              onClick={() => autofillCredentials('moderator@marketplace.com', 'ModPassword123!')}
              className="p-2.5 rounded-lg bg-[#242424] hover:bg-[#2e2e2e] border border-gray-700 text-left transition"
            >
              <div className="font-bold text-blue-400 mb-0.5">Moderator</div>
              <div className="text-[10px] text-gray-300 truncate">moderator@marketplace.com</div>
              <div className="text-[10px] text-gray-500 font-mono mt-1">ModPassword123!</div>
            </button>

            <button
              type="button"
              onClick={() => autofillCredentials('customer@marketplace.com', 'CustomerPass123!')}
              className="p-2.5 rounded-lg bg-[#242424] hover:bg-[#2e2e2e] border border-gray-700 text-left transition"
            >
              <div className="font-bold text-emerald-400 mb-0.5">Customer</div>
              <div className="text-[10px] text-gray-300 truncate">customer@marketplace.com</div>
              <div className="text-[10px] text-gray-500 font-mono mt-1">CustomerPass123!</div>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
