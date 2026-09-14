"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Store, ShieldCheck, ArrowRight, Truck, Gift } from "lucide-react";

export const PromoBanners: React.FC = () => {
    return (
        <section aria-label="Promotional Banners" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Banner 1: Amarzone+ Membership */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#041e42] via-[#004f9a] to-[#0071dc] text-white p-6 sm:p-8 flex flex-col justify-between shadow-sm min-h-[220px]">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="badge bg-[#ffc220] text-slate-950 font-black text-[10px] uppercase tracking-wider border-0">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Amarzone+
                            </span>
                            <span className="text-xs text-blue-200 font-semibold">
                                Free 30-day trial
                            </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                            Free Shipping with No Order Minimum
                        </h3>
                        <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-md">
                            Get free next-day & 2-day delivery on thousands of items, exclusive member rewards, and early access to rollbacks.
                        </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                        <Link
                            href="/login"
                            className="btn btn-sm rounded-full bg-[#ffc220] hover:bg-[#e5ad19] text-slate-950 font-black border-0 gap-1.5 shadow-sm"
                        >
                            <span>Try Amarzone+ Free</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-blue-200 font-medium">
                            <Truck className="w-4 h-4 text-[#ffc220]" />
                            <span className="hidden sm:inline">No delivery minimum</span>
                        </div>
                    </div>
                </div>

                {/* Banner 2: Multi-Vendor Marketplace Hub */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 flex flex-col justify-between shadow-sm min-h-[220px]">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="badge bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider border-0">
                                <Store className="w-3 h-3 mr-1" />
                                Verified Stores
                            </span>
                            <span className="text-xs text-slate-300 font-semibold">
                                Multi-Vendor Marketplace
                            </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                            Shop Trusted Independent Merchants
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300/80 mt-1 max-w-md">
                            Buy directly from verified domestic & global storefronts with guaranteed genuine products, verified reviews, and prompt buyer dispute resolution.
                        </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                        <Link
                            href="/login"
                            className="btn btn-sm rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold border-0 gap-1.5 shadow-sm"
                        >
                            <span>Become a Seller</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                            <ShieldCheck className="w-4 h-4" />
                            <span>100% Escrow Protection</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoBanners;
