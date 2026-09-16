"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Store,
  TrendingUp,
  DollarSign,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowRight,
  Calculator,
  Sliders,
  Award,
  Clock,
  Layers,
  BarChart3,
  HelpCircle,
  ChevronDown,
  Home,
  ChevronRight,
  Zap,
  Globe2,
  Lock,
} from "lucide-react";

interface CategoryFee {
  id: string;
  name: string;
  feeRate: number; // e.g. 0.08 for 8%
}

const CATEGORIES: CategoryFee[] = [
  { id: "electronics", name: "Consumer Tech & Electronics", feeRate: 0.08 },
  { id: "home", name: "Home Living & Kitchen", feeRate: 0.10 },
  { id: "fashion", name: "Apparel, Shoes & Accessories", feeRate: 0.12 },
  { id: "pets", name: "Pet Healthcare & Supplies", feeRate: 0.08 },
  { id: "beauty", name: "Beauty & Personal Care", feeRate: 0.10 },
  { id: "pantry", name: "Pantry & Groceries", feeRate: 0.06 },
];

export const SellOnAmarzonePage: React.FC = () => {
  // Calculator state
  const [selectedCategory, setSelectedCategory] = useState<string>("electronics");
  const [unitPrice, setUnitPrice] = useState<number>(45);
  const [monthlyUnits, setMonthlyUnits] = useState<number>(350);

  // FAQ state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Calculations
  const activeCat = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];
  const grossRevenue = unitPrice * monthlyUnits;
  const platformFee = grossRevenue * activeCat.feeRate;
  const netEarnings = grossRevenue - platformFee;

  return (
    <main className="min-h-screen bg-[#f3f4f6]/50 text-slate-800 font-sans antialiased">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-slate-200/80 py-3">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="flex items-center gap-1 text-slate-600 hover:text-[#0071dc] transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span className="font-semibold">Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-600 font-medium">Merchant Services</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-bold">Sell on Amarzone</span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#170d2f] via-[#211244] to-[#120925] text-white py-16 sm:py-24">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 text-xs font-black uppercase tracking-wider text-amber-300">
              <Store className="w-3.5 h-3.5 text-amber-300" />
              <span>Amarzone Merchant Marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Reach Millions of Shoppers. <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                Grow Your Brand on Amarzone.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Join 50,000+ independent merchants selling with transparent low commission fees, 2-day delivery logistics, and daily automated payouts.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0071dc] hover:bg-[#005bb5] text-white font-black text-xs sm:text-sm rounded-full shadow-lg transition-all cursor-pointer"
              >
                <span>Start Selling Today</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#calculator"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm rounded-full backdrop-blur-xs transition-all cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculate Your Profit</span>
              </a>
            </div>

            {/* Quick Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10 text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">10M+</p>
                <p className="text-xs text-slate-400 font-medium">Active Buyers</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-amber-300">50,000+</p>
                <p className="text-xs text-slate-400 font-medium">Active Merchants</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">From 6%</p>
                <p className="text-xs text-slate-400 font-medium">Lowest Category Fees</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-sky-400">2-Day</p>
                <p className="text-xs text-slate-400 font-medium">Logistics Integration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 3. Interactive Profit & Fee Calculator */}
      <section id="calculator" className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-16 sm:py-20">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-blue-50 text-[#0071dc] flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-[#0071dc]">
                  Transparent Marketplace Economics
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Estimate Your Monthly Revenue & Profit
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              No hidden listing fees • No setup charges
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Category Selector */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  Select Product Category:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? "border-[#0071dc] bg-blue-50/50 text-[#0071dc] shadow-2xs"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <p className="truncate">{cat.name}</p>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {(cat.feeRate * 100).toFixed(0)}% referral fee
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Average Item Selling Price:
                  </span>
                  <span className="text-base font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                    ${unitPrice.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={300}
                  step={5}
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full accent-[#0071dc] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>$10</span>
                  <span>$150</span>
                  <span>$300</span>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Estimated Monthly Units Sold:
                  </span>
                  <span className="text-base font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                    {monthlyUnits.toLocaleString()} units
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={2500}
                  step={50}
                  value={monthlyUnits}
                  onChange={(e) => setMonthlyUnits(Number(e.target.value))}
                  className="w-full accent-[#0071dc] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>50 units</span>
                  <span>1,250 units</span>
                  <span>2,500 units</span>
                </div>
              </div>
            </div>

            {/* Right Result Card (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Monthly Projection
                </span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                  {(activeCat.feeRate * 100).toFixed(0)}% Fee Rate
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-400">Estimated Gross Revenue</span>
                  <p className="text-2xl sm:text-3xl font-black text-white">
                    ${grossRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-y border-white/10 text-slate-300">
                  <span>Amarzone Platform Referral ({(activeCat.feeRate * 100).toFixed(0)}%):</span>
                  <span className="text-rose-400 font-mono font-bold">
                    -${platformFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    Estimated Net Take-Home
                  </span>
                  <p className="text-3xl sm:text-4xl font-black text-emerald-300">
                    ${netEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <Link
                href="/signup"
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#0071dc] hover:bg-[#005bb5] text-white font-black text-xs sm:text-sm rounded-full shadow-md transition-all cursor-pointer"
              >
                <span>Register Storefront in this Category</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Sell on Amarzone? (6 Core Pillars) */}
      <section className="bg-white border-y border-slate-200/80 py-16 sm:py-24">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#0071dc] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              The Merchant Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why 50,000+ Brands Sell on Amarzone
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Built by e-commerce operators who understand what sellers need: fair fees, fast payouts, and zero predatory interference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-slate-200/90 bg-slate-50/50 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0071dc] flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-slate-900">Predictable, Fair Fees</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Category referral rates starting at just 6%. Absolutely zero listing fees, zero mandatory monthly subscription penalties, and zero surprise audit fees.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/90 bg-slate-50/50 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-slate-900">Seamless 2-Day Fulfillment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect directly into our regional fulfillment centers to offer 2-day delivery badges, or fulfill orders from your own facility with automated tracking sync.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/90 bg-slate-50/50 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-slate-900">Fair Buy Box Rotation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our algorithm rewards sellers with competitive prices, authentic stock, and fast dispatch. We never favor private-label over independent merchant listings.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/90 bg-slate-50/50 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-slate-900">Daily Automated Settlements</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Keep cash flowing into your business with daily payout disbursements, transparent dispute escrow, and instant ACH bank transfers.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/90 bg-slate-50/50 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-slate-900">Real-Time Seller Dashboard</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manage inventory across variants, view customer demand trends, track Buy Box share, and update prices in real time via our vendor portal.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/90 bg-slate-50/50 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-slate-900">Dedicated Seller Advocacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Speak directly to live merchant specialists. No automated bots closing seller tickets without human review. We protect your business from fraudulent returns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 4-Step Onboarding Roadmap */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-16 sm:py-24 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Quick Onboarding
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            From Sign-Up to First Sale in 24 Hours
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A frictionless launch sequence designed to get your catalog live in record time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Create Account",
              desc: "Provide basic company registration details, tax ID, and payout bank information.",
            },
            {
              step: "02",
              title: "Upload Catalog",
              desc: "Import product SKUs via bulk CSV file, Shopify sync, or direct REST API connection.",
            },
            {
              step: "03",
              title: "Set Stock & Prices",
              desc: "Define inventory levels, variant pricing, and select your preferred fulfillment method.",
            },
            {
              step: "04",
              title: "Ship & Get Paid",
              desc: "Orders flow into your portal. Dispatch to customers and receive automatic bank transfers.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <span className="text-3xl font-black text-[#0071dc]">{item.step}</span>
              <h4 className="font-black text-slate-900 text-base">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Marketplace Comparison Table */}
      <section className="bg-white border-y border-slate-200/80 py-16 sm:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How Amarzone Compares
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              See why high-growth e-commerce merchants are diversifying to Amarzone.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-4 font-black">Marketplace Feature</th>
                  <th className="p-4 font-black text-amber-300">Amarzone Marketplace</th>
                  <th className="p-4 font-normal text-slate-400">Traditional Marketplaces</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-white">
                  <td className="p-4 font-bold text-slate-800">Monthly Account Fee</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/40">$0 / Month (Free Tier)</td>
                  <td className="p-4 text-slate-500">$39.99 / Month Mandatory</td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="p-4 font-bold text-slate-800">Referral Commission Rate</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/40">6% to 12% Transparent</td>
                  <td className="p-4 text-slate-500">15% to 25% + Variable Closing Fees</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-4 font-bold text-slate-800">Payout Settlement Frequency</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/40">Daily Automated Disbursements</td>
                  <td className="p-4 text-slate-500">Every 14 to 28 Days</td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="p-4 font-bold text-slate-800">Buy Box Algorithm Fairness</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/40">100% Equal Opportunity</td>
                  <td className="p-4 text-slate-500">Heavily Favors First-Party Brands</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-4 font-bold text-slate-800">Seller Customer Support</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/40">Dedicated Live Merchant Desk</td>
                  <td className="p-4 text-slate-500">Automated Bot Ticket Responses</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. Seller FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Seller Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Have questions about fees, onboarding, or inventory? We have answers.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "What do I need to register as a verified vendor on Amarzone?",
              a: "You need a valid business entity tax ID (EIN/VAT), government-issued photo ID, verified bank account for payouts, and an active inventory list of items.",
            },
            {
              q: "Can I fulfill customer orders myself without using Amarzone warehouses?",
              a: "Yes! You can choose Merchant-Fulfilled (shipping directly from your own warehouse) or use Amarzone Logistics for automatic 2-day delivery badges.",
            },
            {
              q: "Are there any upfront listing fees or hidden charges?",
              a: "Zero! You only pay a small commission referral fee (6% - 12%) when you successfully make a sale.",
            },
            {
              q: "How does the Buy Box work for multi-vendor products?",
              a: "When multiple vendors list the same item, the Buy Box winner is calculated objectively based on price, shipping speed, and seller rating. Any qualified seller can win the Buy Box!",
            },
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    expandedFaq === idx ? "rotate-180 text-[#0071dc]" : ""
                  }`}
                />
              </button>
              {expandedFaq === idx && (
                <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Final CTA Banner */}
      <section className="bg-slate-100/70 border-t border-slate-200/80 py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
            <Zap className="w-3.5 h-3.5 fill-emerald-600" />
            <span>Launch Your Store in 24 Hours</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Ready to Accelerate Your Commerce Business?
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            Take advantage of the lowest category referral fees in the retail industry. Create your merchant storefront today and start reaching millions of active buyers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0071dc] hover:bg-[#005bb5] text-white font-black text-xs sm:text-sm rounded-full shadow-lg transition-all cursor-pointer"
            >
              <span>Register as a Merchant</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#flash-deals"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-900 text-slate-900 hover:text-white border border-slate-300 font-bold text-xs sm:text-sm rounded-full shadow-xs transition-all cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Explore Active Marketplace</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SellOnAmarzonePage;
