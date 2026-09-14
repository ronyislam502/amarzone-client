"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, ArrowRight, Layers } from "lucide-react";
import { TProduct } from "@/src/types/product";
import ProductCard from "./ProductCard";

interface FeaturedProductsSectionProps {
    products: TProduct[];
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ products }) => {
    const [activeCategory, setActiveCategory] = useState<string>("all");

    // Extract dynamic unique categories from the product list
    const availableCategories = useMemo(() => {
        const categoryMap = new Map<string, string>();
        products.forEach((p) => {
            if (p.category && (p.category as any).name) {
                categoryMap.set((p.category as any).name, (p.category as any).name);
            }
        });
        return Array.from(categoryMap.keys()).slice(0, 5);
    }, [products]);

    // Filter products based on selected tab
    const filteredProducts = useMemo(() => {
        if (activeCategory === "all") return products.slice(0, 12);
        return products
            .filter((p) => (p.category as any)?.name === activeCategory)
            .slice(0, 12);
    }, [products, activeCategory]);

    return (
        <section id="featured-catalog" aria-label="Featured Products" className="w-full select-none">
            {/* Header: Title + Category Filter Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="badge badge-primary badge-sm font-black uppercase tracking-wider text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Curated Catalog
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Featured Everyday Essentials
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Top-rated products loved by shoppers across our multi-vendor catalog.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    <button
                        type="button"
                        onClick={() => setActiveCategory("all")}
                        className={`btn btn-sm rounded-full text-xs font-bold transition-all ${
                            activeCategory === "all"
                                ? "bg-[#0071dc] text-white hover:bg-[#005bb5] shadow-xs"
                                : "btn-ghost text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        All Items
                    </button>
                    {availableCategories.map((catName) => (
                        <button
                            key={catName}
                            type="button"
                            onClick={() => setActiveCategory(catName)}
                            className={`btn btn-sm rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                                activeCategory === catName
                                    ? "bg-[#0071dc] text-white hover:bg-[#005bb5] shadow-xs"
                                    : "btn-ghost text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            {catName}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Cards Grid: 2 to 6 columns on ultra-wide */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-4 mt-4">
                {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {/* Empty fallback if filtered category has no items */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                    <Layers className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm font-bold text-slate-700">No items found for this category.</p>
                    <button
                        type="button"
                        onClick={() => setActiveCategory("all")}
                        className="btn btn-sm btn-link text-[#0071dc]"
                    >
                        Show all products
                    </button>
                </div>
            )}
        </section>
    );
};

export default FeaturedProductsSection;
