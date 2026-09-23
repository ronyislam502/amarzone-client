"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Truck } from "lucide-react";

export const HomeHeroBanner: React.FC = () => {
    return (
        <section aria-label="Featured Promotions & Deals" className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                {/* Main Hero Card (8 cols) */}
                <div className="lg:col-span-8 relative overflow-hidden rounded-3xl  from-[#0c1e3d] via-[#004f9a] to-[#0071dc] text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between shadow-md">
                    {/* Background glow orbs */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

                    {/* Top Callout */}
                    <div className="relative z-10 flex items-center gap-2 flex-wrap">
                        <span className="badge bg-[#ffc220] text-slate-950 font-black border-0 gap-1 px-3 py-2 text-xs uppercase tracking-wider shadow-sm">
                            <Zap className="w-3.5 h-3.5 fill-slate-950" />
                            Spring Super Savings
                        </span>
                        <span className="badge bg-white/15 text-white border border-white/20 text-xs font-semibold backdrop-blur-xs">
                            Limited Time Offers
                        </span>
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 max-w-xl my-4">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                            Everything You Need,{" "}
                            <span className="text-[#ffc220]">Unbeatable Everyday Prices</span>
                        </h1>
                        <p className="mt-3 text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
                            Explore hundreds of verified sellers across pet healthcare, electronics, home essentials, and apparel with fast 2-day doorstep delivery.
                        </p>
                    </div>

                    {/* CTA Buttons & Perks */}
                    <div className="relative z-10 flex flex-wrap items-center gap-3 pt-2">
                        <Link
                            href="#flash-deals"
                            className="btn bg-[#ffc220] hover:bg-[#e5ad19] text-slate-950 border-0 rounded-full px-6 font-black gap-2 shadow-lg transition-transform hover:scale-102"
                        >
                            <span>Shop Rollback Deals</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="#featured-catalog"
                            className="btn btn-outline border-white text-white hover:bg-white hover:text-slate-900 rounded-full px-6 font-bold"
                        >
                            Browse All Products
                        </Link>
                    </div>

                    {/* Footer perks banner */}
                    <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center gap-4 sm:gap-8 text-xs font-semibold text-blue-100">
                        <div className="flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-[#ffc220]" />
                            <span>Free shipping over $35</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-[#ffc220]" />
                            <span>100% Buyer Protection</span>
                        </div>
                    </div>
                </div>

                {/* Secondary Promo Tiles (4 cols) */}
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6">
                    {/* Secondary Tile 1: Pet Healthcare & Wellness */}
                    <div className="flex-1 relative overflow-hidden rounded-3xl  from-amber-500/15 via-orange-500/10 to-amber-600/5 border border-amber-200/60 p-6 flex flex-col justify-between shadow-sm">
                        <div>
                            <span className="badge badge-warning font-black text-[10px] tracking-wider uppercase mb-2">
                                Top Trending
                            </span>
                            <h2 className="text-xl font-black text-slate-900 leading-snug">
                                Pet Health & Wellness Solutions
                            </h2>
                            <p className="text-xs text-slate-600 mt-1">
                                Veterinary-grade flea, tick & grooming essentials.
                            </p>
                        </div>
                        <div className="pt-3">
                            <Link
                                href="#department-spotlight"
                                className="inline-flex items-center gap-1 text-xs font-black text-amber-700 hover:text-amber-900 transition-colors"
                            >
                                <span>Explore Pet Care</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Secondary Tile 2: Multi-Vendor Storefronts */}
                    <div className="flex-1 relative overflow-hidden rounded-3xl  from-indigo-500/15 via-purple-500/10 to-blue-600/5 border border-indigo-200/60 p-6 flex flex-col justify-between shadow-sm">
                        <div>
                            <span className="badge badge-primary font-black text-[10px] tracking-wider uppercase mb-2">
                                Direct From Makers
                            </span>
                            <h2 className="text-xl font-black text-slate-900 leading-snug">
                                Verified Local & Global Sellers
                            </h2>
                            <p className="text-xs text-slate-600 mt-1">
                                Discover independent stores and unique curated collections.
                            </p>
                        </div>
                        <div className="pt-3">
                            <Link
                                href="#best-sellers"
                                className="inline-flex items-center gap-1 text-xs font-black text-[#0071dc] hover:text-[#004f9a] transition-colors"
                            >
                                <span>Shop Best Sellers</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeHeroBanner;
