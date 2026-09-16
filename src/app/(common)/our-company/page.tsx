"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Users,
  Globe2,
  TrendingUp,
  ShieldCheck,
  Heart,
  Truck,
  Sparkles,
  ShoppingBag,
  Award,
  ArrowRight,
  Leaf,
  CheckCircle2,
  Home,
  ChevronRight,
  Target,
  Compass,
  Calendar,
  Layers,
  Store,
} from "lucide-react";

interface Milestone {
  year: string;
  badge: string;
  title: string;
  description: string;
  stats: string;
}

interface Leader {
  name: string;
  role: string;
  image: string;
  quote: string;
  bio: string;
}

const MILESTONES: Milestone[] = [
  {
    year: "2021",
    badge: "The Genesis",
    title: "A Bold Vision for Fair Digital Commerce",
    description:
      "Amarzone was founded with a straightforward goal: eliminate the middlemen, empower small local vendors, and give customers everyday rollback prices without compromising product quality.",
    stats: "First 100 Verified Merchants",
  },
  {
    year: "2022",
    badge: "Fulfillment Network",
    title: "Launching Nationwide 2-Day Delivery",
    description:
      "Built our proprietary real-time distributed inventory engine, enabling independent sellers to fulfill orders with rapid 2-day delivery across regional distribution centers.",
    stats: "1M+ Orders Fulfilled",
  },
  {
    year: "2023",
    badge: "Customer Delight",
    title: "Introducing Amarzone+ & 90-Day Returns",
    description:
      "Rolled out Amarzone+ free delivery membership and set a new retail benchmark with our hassle-free 90-day return policy and money-back guarantee.",
    stats: "5M+ Active Shoppers",
  },
  {
    year: "2024",
    badge: "Scale & Diversity",
    title: "50,000 Verified Vendor Storefronts",
    description:
      "Expanded our multi-vendor catalog to over 300,000 SKUs spanning Tech, Home Living, Grocery, Fashion, and Pet Care, supporting small business owners nationwide.",
    stats: "50,000+ Active Vendors",
  },
  {
    year: "2025",
    badge: "Green Logistics",
    title: "100% Recyclable Packaging & EV Fleets",
    description:
      "Transitioned our fulfillment hubs to 100% recyclable corrugated shipping materials and partnered with electric carrier fleets to reduce last-mile carbon footprints.",
    stats: "30% Lower Carbon Per Delivery",
  },
  {
    year: "2026",
    badge: "Next-Gen Platform",
    title: "Hyper-Personalized AI Marketplace",
    description:
      "Unveiled our redesigned ultra-wide marketplace experience, creator social video shopping, and real-time vendor price-matching algorithms.",
    stats: "150M+ Products Delivered",
  },
];

const LEADERS: Leader[] = [
  {
    name: "Marcus Vance",
    role: "Chief Executive Officer & Founder",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    quote:
      "Commerce works best when it builds wealth for independent merchants and savings for everyday families.",
    bio: "Former retail supply chain executive with 20+ years building large-scale digital logistics and consumer marketplaces.",
  },
  {
    name: "Elena Rostova",
    role: "Chief Technology Officer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    quote:
      "We engineer for millisecond latencies, bulletproof catalog reliability, and intuitive user delight.",
    bio: "Specialist in distributed microservices, vector search infrastructure, and real-time multi-tenant database systems.",
  },
  {
    name: "David K. O'Connor",
    role: "Head of Marketplace & Merchant Success",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    quote:
      "When our vendors succeed, our customers get the best selection and lowest prices. It's a virtuous cycle.",
    bio: "Advocate for small and medium-sized businesses, driving seller growth tools, fair fees, and automated dispute resolution.",
  },
  {
    name: "Amina Al-Mansoor",
    role: "VP of Global Supply Chain & Logistics",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    quote:
      "Speed without reliability is meaningless. We build logistical precision you can set your watch by.",
    bio: "Pioneered smart automated sorting hubs and regional fulfillment routing that reduced delivery times by 40%.",
  },
];

export const OurCompanyPage: React.FC = () => {
  const [activeMilestone, setActiveMilestone] = useState<number>(0);

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
            <span className="text-slate-600 font-medium">About Us</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-bold">Our Company</span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#170d2f] via-[#211244] to-[#120925] text-white py-16 sm:py-24">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 text-xs font-black uppercase tracking-wider text-amber-300">
              <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>About Amarzone Marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Everyday Low Prices. <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                Infinite Variety. Built for Everyone.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              From our humble beginnings to a global commerce platform serving millions of shoppers, our mission has never wavered: save people money so they can live better.
            </p>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">10M+</p>
                <p className="text-xs text-slate-400 font-medium">Active Shoppers</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-amber-300">50,000+</p>
                <p className="text-xs text-slate-400 font-medium">Verified Merchants</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">150M+</p>
                <p className="text-xs text-slate-400 font-medium">Items Delivered</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-sky-400">99.4%</p>
                <p className="text-xs text-slate-400 font-medium">On-Time Delivery SLA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 3. Mission & Vision Pillars */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-16 sm:py-20 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-2xs space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0071dc] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-[#0071dc]">
              Our Mission
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              To make quality everyday essentials accessible and affordable for every home.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We leverage modern technology, real-time inventory aggregation, and competitive multi-vendor pricing to eliminate unneeded retail markups. We believe affordability is a fundamental customer right, not a luxury.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-2xs space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
              Our Vision
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Pioneering the world&apos;s most trusted multi-vendor digital commerce ecosystem.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We envision a future where independent local artisans, family businesses, and global brands stand on equal footing, supported by transparent algorithms, fast fulfillment, and complete buyer protection.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Interactive Milestone Timeline */}
      <section className="bg-white border-y border-slate-200/80 py-16 sm:py-24">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#0071dc] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Our Heritage & Growth
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              The Journey from Day One
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              How five years of relentless customer focus shaped the Amarzone marketplace.
            </p>
          </div>

          {/* Timeline Year Selectors */}
          <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar py-2">
            {MILESTONES.map((item, idx) => (
              <button
                key={item.year}
                type="button"
                onClick={() => setActiveMilestone(idx)}
                className={`px-5 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeMilestone === idx
                    ? "bg-[#0071dc] text-white shadow-sm scale-105"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item.year} • {item.badge}
              </button>
            ))}
          </div>

          {/* Active Milestone Card */}
          <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/40 rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xs max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 animate-fadeIn">
            <div className="w-28 h-28 rounded-3xl bg-[#0071dc] text-white flex flex-col items-center justify-center shrink-0 shadow-md">
              <Calendar className="w-6 h-6 mb-1 text-blue-200" />
              <span className="text-2xl font-black">{MILESTONES[activeMilestone].year}</span>
            </div>

            <div className="space-y-3 flex-1 text-left">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#0071dc] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                {MILESTONES[activeMilestone].badge}
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {MILESTONES[activeMilestone].title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {MILESTONES[activeMilestone].description}
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Key Impact: {MILESTONES[activeMilestone].stats}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. The Amarzone Ecosystem (3 Pillars) */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-16 sm:py-24 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            The Three Pillars
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How Our Ecosystem Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A balanced multi-sided network serving consumers, merchants, and local communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Pillar 1: For Customers */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0071dc] flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">For Our Shoppers</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Everyday rollbacks, verified genuine items, 2-day delivery on orders $35+, and our signature free 90-day return promise.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Price-drop alerts & instant rollbacks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% money-back buyer guarantee</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Encrypted checkout via Stripe & wallets</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: For Merchants */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">For Independent Merchants</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We empower 50,000+ vendors with fair commissions, real-time demand forecasting, automated catalog tools, and logistics support.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero hidden penalty fees or predatory terms</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant automated inventory sync</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Dedicated merchant advocacy & fast payouts</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: For Communities */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">For Local Communities</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Investing in regional fulfillment employment, small business incubation programs, and green supply chains.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>$5M+ invested in minority merchant grants</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% recyclable corrugated packaging</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Regional living-wage employment</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Executive Leadership Team */}
      <section className="bg-white border-y border-slate-200/80 py-16 sm:py-24">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#0071dc] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Executive Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Guided by Experienced Innovators
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Our executive team combines decades of retail, engineering, and supply chain leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEADERS.map((leader) => (
              <div
                key={leader.name}
                className="bg-slate-50/60 rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full bg-slate-200">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 space-y-2 text-left">
                  <h3 className="font-black text-base text-slate-900">{leader.name}</h3>
                  <p className="text-xs font-bold text-[#0071dc]">{leader.role}</p>
                  <p className="text-xs text-slate-500 italic pt-1">&quot;{leader.quote}&quot;</p>
                  <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/80">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Sustainability & Social Impact */}
      <section className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-16 sm:py-24">
        <div className="bg-gradient-to-br from-[#12281e] via-[#1b3d2f] to-[#0f2018] text-white rounded-3xl p-8 sm:p-14 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-emerald-400/20 text-emerald-300 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-400/30">
              <Leaf className="w-3.5 h-3.5" />
              Sustainability & Responsibility
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Committed to Zero Waste & Responsible Growth
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We understand that moving millions of packages has an environmental footprint. By 2028, 100% of Amarzone fulfillment centers will operate on renewable solar power, and 50% of local deliveries will be powered by electric delivery vehicles.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-left">
              <div>
                <p className="text-2xl font-black text-emerald-400">100%</p>
                <p className="text-xs text-slate-400">Recyclable Packaging</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-400">2028</p>
                <p className="text-xs text-slate-400">Net-Zero Energy Goal</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-400">5,000+</p>
                <p className="text-xs text-slate-400">EV Vans Contracted</p>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              href="/careers"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-full shadow-md transition-all cursor-pointer"
            >
              <span>Join Our Climate Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Dual CTA Section */}
      <section className="bg-slate-100/70 border-t border-slate-200/80 py-16 sm:py-20 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Be a Part of the Amarzone Story
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Whether you are discovering everyday values as a shopper, growing your independent brand as a vendor, or building the future of commerce on our global team — there has never been a better time to join us.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/#flash-deals"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0071dc] hover:bg-[#005bb5] text-white font-black text-xs sm:text-sm rounded-full shadow-md transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Our Marketplace</span>
            </Link>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-900 text-slate-900 hover:text-white border border-slate-300 font-bold text-xs sm:text-sm rounded-full shadow-xs transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Explore Open Careers</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OurCompanyPage;
