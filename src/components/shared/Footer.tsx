'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headset,
  Send,
  ShoppingCart,
  Tag,
  Store,
  Globe,
  ChevronDown,
  Check,
  ChevronUp,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

// Walmart 6-petal Spark component
function WalmartSpark({ className = "w-5 h-5 text-[#ffc220]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2L13.8 8.5L19.5 5.2L16.2 11L22.5 12.8L16.2 14.6L19.5 20.4L13.8 17.1L12 23.6L10.2 17.1L4.5 20.4L7.8 14.6L1.5 12.8L7.8 11L4.5 5.2L10.2 8.5L12 2Z" />
    </svg>
  );
}

export const Footer: React.FC = () => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#041e42] text-white font-sans border-t border-slate-700 select-none">
      {/* 1. WALMART TOP FEEDBACK & BACK TO TOP BANNER */}
      <div className="bg-[#e6f1fc] text-[#0071dc] py-4 px-4 sm:px-8 border-b border-blue-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold">
          <div className="flex items-center gap-3">
            <span>We&apos;d love to hear what you think!</span>
            <button
              type="button"
              onClick={() => setShowFeedbackModal(true)}
              className="px-4 py-1.5 rounded-full border-2 border-[#0071dc] hover:bg-[#0071dc] hover:text-white text-[#0071dc] transition-all font-bold flex items-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Give feedback</span>
            </button>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-slate-50 text-[#0071dc] border border-blue-200 transition-colors shadow-sm font-bold"
          >
            <span>Back to top</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. WALMART VALUE PROPOSITION STRIP */}
      <div className="bg-[#004f9a] py-6 px-4 sm:px-6 lg:px-8 border-b border-blue-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#ffc220] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Free shipping with no minimum</h4>
              <p className="text-[11px] text-blue-200">Restrictions apply. Free 2-day delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#ffc220] shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Free & easy returns</h4>
              <p className="text-[11px] text-blue-200">90-day return policy for peace of mind</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#ffc220] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Amarzone Protection</h4>
              <p className="text-[11px] text-blue-200">100% money back guarantee on orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#ffc220] shrink-0">
              <Headset className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">24/7 Customer Care</h4>
              <p className="text-[11px] text-blue-200">Live chat & instant phone support</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN DIRECTORY LINKS LIST (WALMART STYLE INLINE & MULTI-COLUMN) */}
      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-xs text-blue-100 mb-10">
          <div>
            <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-1">
              <span>Get to Know Us</span>
            </h3>
            <ul className="space-y-2 text-blue-200">
              <li><Link href="/" className="hover:underline">All Departments</Link></li>
              <li><Link href="/" className="hover:underline">Store Directory</Link></li>
              <li><Link href="/" className="hover:underline">Our Company</Link></li>
              <li><Link href="/" className="hover:underline">Careers</Link></li>
              <li><Link href="/" className="hover:underline">News & Newsroom</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-3 text-sm">Amarzone Services</h3>
            <ul className="space-y-2 text-blue-200">
              <li><Link href="/" className="hover:underline">Pharmacy & Health</Link></li>
              <li><Link href="/" className="hover:underline">Auto Care Center</Link></li>
              <li><Link href="/" className="hover:underline">Photo Center</Link></li>
              <li><Link href="/" className="hover:underline">Money Services</Link></li>
              <li><Link href="/" className="hover:underline">Protection Plans</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-3 text-sm">Amarzone+</h3>
            <ul className="space-y-2 text-blue-200">
              <li><Link href="/" className="hover:underline">About Amarzone+</Link></li>
              <li><Link href="/" className="hover:underline">Free Delivery Benefits</Link></li>
              <li><Link href="/" className="hover:underline">Member Savings</Link></li>
              <li><Link href="/" className="hover:underline">Join Amarzone+</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-3 text-sm">Customer Care</h3>
            <ul className="space-y-2 text-blue-200">
              <li><Link href="/" className="hover:underline">Help Center</Link></li>
              <li><Link href="/" className="hover:underline">Track Your Order</Link></li>
              <li><Link href="/" className="hover:underline">Returns & Refunds</Link></li>
              <li><Link href="/" className="hover:underline">Product Recalls</Link></li>
              <li><Link href="/" className="hover:underline">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-3 text-sm">In The Spotlight</h3>
            <ul className="space-y-2 text-blue-200">
              <li><Link href="/" className="hover:underline">Spring Savings</Link></li>
              <li><Link href="/" className="hover:underline">Flash Deals</Link></li>
              <li><Link href="/" className="hover:underline">Rollbacks</Link></li>
              <li><Link href="/" className="hover:underline">Clearance</Link></li>
              <li><Link href="/" className="hover:underline">Gift Cards</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-3 text-sm">Sell With Us</h3>
            <ul className="space-y-2 text-blue-200">
              <li><Link href="/" className="hover:underline">Sell on Amarzone</Link></li>
              <li><Link href="/" className="hover:underline">Seller Portal</Link></li>
              <li><Link href="/" className="hover:underline">Become a Supplier</Link></li>
              <li><Link href="/" className="hover:underline">Advertise With Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="border-t border-blue-900/80 pt-6">
          {/* Quick Legal Inline Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-blue-200 text-center mb-6">
            <Link href="/" className="hover:underline">All Departments</Link>
            <span>•</span>
            <Link href="/" className="hover:underline">Store Directory</Link>
            <span>•</span>
            <Link href="/" className="hover:underline">Careers</Link>
            <span>•</span>
            <Link href="/" className="hover:underline">Our Company</Link>
            <span>•</span>
            <Link href="/" className="hover:underline">Sell on Amarzone</Link>
            <span>•</span>
            <Link href="/" className="hover:underline">Help</Link>
            <span>•</span>
            <Link href="/" className="hover:underline">COVID-19 Info</Link>
            <span>•</span>
            <Link href="/" className="hover:underline">Terms of Use</Link>
            <span>•</span>
            <Link href="/" className="hover:underline">Privacy & Security</Link>
            <span>•</span>
            <Link href="/" className="hover:underline">CA Privacy Rights</Link>
            <span>•</span>
            <Link href="/" className="hover:underline">Your Privacy Choices</Link>
          </div>

          {/* Copyright & Spark */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-300">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm tracking-tight">Amarzone</span>
              <WalmartSpark className="w-4 h-4 text-[#ffc220]" />
              <span>&copy; 2026 Amarzone. All Rights Reserved.</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 bg-white text-[#0071dc] font-black text-xs rounded shadow-sm">
                VISA
              </div>
              <div className="px-2.5 py-1 bg-white text-slate-900 font-bold text-xs rounded shadow-sm flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block -ml-2" />
              </div>
              <div className="px-2.5 py-1 bg-[#006fcf] text-white font-black text-[10px] rounded shadow-sm">
                AMEX
              </div>
              <div className="px-2.5 py-1 bg-white text-[#003087] font-black text-xs rounded shadow-sm italic">
                PayPal
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEEDBACK MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-black text-slate-900 mb-1">Give Us Your Feedback</h3>
            <p className="text-xs text-slate-500 mb-4">How can we improve your shopping experience at Amarzone?</p>

            {feedbackSubmitted ? (
              <div className="py-6 text-center text-emerald-600 font-bold text-sm">
                <Check className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
                Thank you! Your feedback helps us serve you better.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFeedbackSubmitted(true);
                  setTimeout(() => {
                    setShowFeedbackModal(false);
                    setFeedbackSubmitted(false);
                  }, 2000);
                }}
                className="space-y-4"
              >
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you loved or what we can do better..."
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl outline-none focus:border-[#0071dc] resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0071dc] hover:bg-[#005bb5] text-white font-bold text-xs rounded-xl transition-colors shadow"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;