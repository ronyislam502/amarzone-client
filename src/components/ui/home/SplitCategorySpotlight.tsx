"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tv, Sparkles } from "lucide-react";
import { TProduct } from "@/src/types/product";
import ProductCard from "./ProductCard";

interface SplitCategorySpotlightProps {
    products: TProduct[];
    title?: string;
    bannerTitle?: string;
    bannerSubtitle?: string;
    bannerCta?: string;
    bannerLink?: string;
    reverse?: boolean;
}

export const SplitCategorySpotlight: React.FC<SplitCategorySpotlightProps> = ({
    products,
    title = "Host game day with ease",
    bannerTitle = "Touchdowns, blockbusters & high-fidelity sound",
    bannerSubtitle = "Upgrade your entertainment hub with ultra-crisp displays, Dolby soundbars, and quick-bite appliances.",
    bannerCta = "Shop entertainment",
    bannerLink = "/?department=electronics",
    reverse = false,
}) => {
    const displayProducts = products.slice(0, 3);

    return (
        <section aria-label={title} className="w-full select-none">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Everything you need to gather, watch, and celebrate
                    </p>
                </div>
                <Link
                    href={bannerLink}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0071dc] hover:underline"
                >
                    <span>Explore department</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Split 60/40 Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
                {/* Lifestyle Banner Side (4 Columns) */}
                <div
                    className={`lg:col-span-4 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] text-white shadow-md ${
                        reverse ? "lg:order-last" : ""
                    }`}
                >
                    <div className="relative z-10 space-y-3">
                        <span className="inline-flex items-center gap-1.5 bg-[#0071dc] text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                            <Tv className="w-3.5 h-3.5" />
                            Curated Collection
                        </span>

                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight pt-1">
                            {bannerTitle}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {bannerSubtitle}
                        </p>
                    </div>

                    <div className="relative z-10 pt-6">
                        <Link
                            href={bannerLink}
                            className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-xs transition-colors"
                        >
                            <span>{bannerCta}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Decorative gradient glow */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                </div>

                {/* Product Cards Side (8 Columns, 3 Cards) */}
                <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-full">
                        {displayProducts.map((prod) => (
                            <ProductCard
                                key={prod._id}
                                product={prod}
                                className="h-full"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SplitCategorySpotlight;
