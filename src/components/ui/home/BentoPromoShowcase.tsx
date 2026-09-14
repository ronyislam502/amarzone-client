"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, CreditCard, Flame, ShieldCheck } from "lucide-react";
import { TProduct } from "@/src/types/product";
import { extractProductPriceInfo, getProductThumbnail } from "./homeUtils";

interface BentoPromoShowcaseProps {
    products?: TProduct[];
}

export const BentoPromoShowcase: React.FC<BentoPromoShowcaseProps> = ({ products = [] }) => {
    const previewProducts = products.slice(0, 4);

    return (
        <section aria-label="Featured Bento Showcase" className="w-full select-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                {/* Column 1 (Left 5 Cols): Large Living & Seasonal Refresh Banner */}
                <div className="md:col-span-2 lg:col-span-5 bg-gradient-to-br from-[#eaf3f8] via-[#e2edf6] to-[#d6e7f4] rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-blue-100 shadow-xs relative overflow-hidden group">
                    <div className="relative z-10 space-y-3">
                        <span className="inline-flex items-center gap-1.5 bg-[#0071dc] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-[#ffc220] fill-[#ffc220]" />
                            Seasonal Spotlight
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight pt-1">
                            Elevate your living space with up to 40% off
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
                            Discover cozy sofas, ergonomic workspace gear, and ambient lighting curated from top-rated sellers.
                        </p>
                    </div>

                    {/* Preview Cards / Tags */}
                    <div className="relative z-10 my-6 flex flex-wrap gap-2">
                        <Link
                            href="/?department=home"
                            className="bg-white/90 hover:bg-white text-xs font-bold text-slate-800 px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs transition-all hover:scale-105"
                        >
                            Living room sets from $199
                        </Link>
                        <Link
                            href="/?department=home"
                            className="bg-white/90 hover:bg-white text-xs font-bold text-slate-800 px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs transition-all hover:scale-105"
                        >
                            Area rugs under $49
                        </Link>
                        <Link
                            href="/?department=home"
                            className="bg-white/90 hover:bg-white text-xs font-bold text-slate-800 px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs transition-all hover:scale-105"
                        >
                            Lighting & lamps under $29
                        </Link>
                    </div>

                    <div className="relative z-10 pt-2">
                        <Link
                            href="/?department=home"
                            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-xs transition-colors"
                        >
                            <span>Shop home refresh</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Decorative watermark / subtle visual */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-200/40 rounded-full blur-2xl pointer-events-none" />
                </div>

                {/* Column 2 (Center 4 Cols): Stacked 2 Cards */}
                <div className="md:col-span-1 lg:col-span-4 flex flex-col gap-4 sm:gap-6">
                    {/* Card A: Amarzone+ Rewards */}
                    <div className="bg-gradient-to-br from-[#fbf4e6] to-[#f4ebd4] rounded-3xl p-5 sm:p-6 border border-amber-200/70 shadow-xs flex flex-col justify-between flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                                Member Rewards
                            </span>
                            <CreditCard className="w-5 h-5 text-amber-800" />
                        </div>

                        <div className="my-2">
                            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                                Earn 5% cash back & free delivery
                            </h3>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                Join Amarzone+ for free 2-day delivery on all items with no minimum purchase required.
                            </p>
                        </div>

                        <div>
                            <Link
                                href="/#amarzone-plus"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 hover:text-black underline underline-offset-4"
                            >
                                <span>Try 30 days free</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Card B: Under $25 Deals */}
                    <div className="bg-gradient-to-br from-[#fbebee] to-[#f7e0e5] rounded-3xl p-5 sm:p-6 border border-rose-200/70 shadow-xs flex flex-col justify-between flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#cc0000] bg-rose-200/80 px-2.5 py-0.5 rounded-full">
                                <Flame className="w-3.5 h-3.5 fill-[#cc0000]" />
                                Rollback Spotlight
                            </span>
                        </div>

                        <div className="my-2">
                            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                                Everyday essentials under $25
                            </h3>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                Stock up on pantry favorites, paper goods, hygiene, and kitchen gadgets with instant savings.
                            </p>
                        </div>

                        <div>
                            <Link
                                href="/#rollbacks-bento"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-950 hover:text-black underline underline-offset-4"
                            >
                                <span>Shop deals under $25</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Column 3 (Right 3 Cols): Tall Curated Picks / Social Trend Card */}
                <div className="md:col-span-1 lg:col-span-3 bg-gradient-to-br from-[#f0f4f8] to-[#e8edf3] rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200">
                                Trending Now
                            </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                            Popular picks this week
                        </h3>
                        <p className="text-xs text-slate-600 mt-1">
                            Highest customer ratings across all categories
                        </p>
                    </div>

                    {/* Mini List of 2 preview items */}
                    <div className="space-y-2.5 my-4">
                        {previewProducts.slice(0, 2).map((prod) => {
                            const pInfo = extractProductPriceInfo(prod);
                            const img = getProductThumbnail(prod);
                            return (
                                <Link
                                    key={prod._id}
                                    href={`/products/${prod._id}`}
                                    className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all group"
                                >
                                    <div className="relative w-12 h-12 rounded-xl bg-slate-50 flex-shrink-0 p-1">
                                        <Image
                                            src={img}
                                            alt={prod.title}
                                            fill
                                            sizes="48px"
                                            className="object-contain group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#0071dc]">
                                            {prod.title}
                                        </h4>
                                        <p className="text-xs font-black text-slate-900 mt-0.5">
                                            ${pInfo.price.toFixed(2)}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div>
                        <Link
                            href="/#featured-catalog"
                            className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs py-2.5 px-4 rounded-full border border-slate-300 shadow-2xs transition-all"
                        >
                            <span>Explore top picks</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BentoPromoShowcase;
