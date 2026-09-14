"use client";

import React from "react";
import Link from "next/link";
import { Award, ArrowRight, TrendingUp } from "lucide-react";
import { TProduct } from "@/src/types/product";
import ProductCard from "./ProductCard";

interface BestSellingSectionProps {
    products: TProduct[];
}

export const BestSellingSection: React.FC<BestSellingSectionProps> = ({ products }) => {
    // Select best sellers (matching isBestSeller or top 8)
    const bestSellers = products
        .filter((p) => p.isBestSeller)
        .slice(0, 8);

    // Fallback to general products if few marked as isBestSeller
    const displayedProducts =
        bestSellers.length >= 4 ? bestSellers : products.slice(8, 16);

    if (displayedProducts.length === 0) return null;

    return (
        <section id="best-sellers" aria-label="Best Selling Products" className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                        <span className="badge bg-[#0071dc] text-white font-black text-xs uppercase tracking-wider gap-1 border-0">
                            <Award className="w-3.5 h-3.5" />
                            Popular Demand
                        </span>
                        <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                            Updated hourly
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Best Sellers in Store
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                        The most purchased and highly reviewed products by Amarzone shoppers this week.
                    </p>
                </div>

                <Link
                    href="#featured-catalog"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0071dc] hover:underline shrink-0"
                >
                    <span>View all best sellers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mt-4">
                {displayedProducts.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        badgeLabel="Best Seller"
                    />
                ))}
            </div>
        </section>
    );
};

export default BestSellingSection;
