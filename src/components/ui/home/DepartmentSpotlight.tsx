"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { HeartPulse, ArrowRight, CheckCircle2 } from "lucide-react";
import { TProduct } from "@/src/types/product";
import ProductCard from "./ProductCard";

interface DepartmentSpotlightProps {
    products: TProduct[];
}

export const DepartmentSpotlight: React.FC<DepartmentSpotlightProps> = ({ products }) => {
    // Find products belonging to Pet Supplies or prominent department
    const petDepartmentProducts = useMemo(() => {
        const matching = products.filter(
            (p) =>
                (p.department as any)?.name?.toLowerCase().includes("pet") ||
                (p.category as any)?.name?.toLowerCase().includes("pet") ||
                p.tags?.some((t) => t.toLowerCase().includes("pet"))
        );
        return matching.length >= 4 ? matching.slice(0, 8) : products.slice(16, 24);
    }, [products]);

    if (petDepartmentProducts.length === 0) return null;

    return (
        <section
            id="department-spotlight"
            aria-label="Department Spotlight: Pet Health & Supplies"
            className="w-full"
        >
            <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border border-slate-200/80 rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xs">
                {/* Spotlight Header Banner */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="badge bg-amber-500 text-slate-950 font-black text-xs gap-1 border-0">
                                <HeartPulse className="w-3.5 h-3.5" />
                                Department Spotlight
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">
                                Veterinary Tested & Approved
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Pet Healthcare, Food & Living Solutions
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                            Keep your companions healthy and happy with top-rated flea prevention, nutritious treats, orthopedic bedding, and interactive toys from certified suppliers.
                        </p>
                    </div>

                    {/* Quick Category Chips */}
                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        {["Pet Healthcare", "Pet Beds", "Dog Food", "Cat Food", "Pet Toys"].map((chip) => (
                            <span
                                key={chip}
                                className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs hover:border-[#0071dc] hover:text-[#0071dc] transition-colors cursor-pointer"
                            >
                                {chip}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-4 mt-6">
                    {petDepartmentProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            badgeLabel={product.brand ? `By ${product.brand}` : "Pet Care"}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DepartmentSpotlight;
