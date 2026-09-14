"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { TProduct } from "@/src/types/product";
import { extractProductPriceInfo, getProductThumbnail } from "./homeUtils";

interface RollbacksBentoGridProps {
    products: TProduct[];
}

interface ColumnTileConfig {
    title: string;
    subtitle: string;
    filterParam?: string;
    badgeColor?: string;
}

const COLUMN_CONFIGS: ColumnTileConfig[] = [
    {
        title: "Tech & electronics",
        subtitle: "Laptops, audio & wearables",
        filterParam: "electronics",
    },
    {
        title: "Kitchen & dining",
        subtitle: "Cookware, blenders & coffee",
        filterParam: "home",
    },
    {
        title: "Pet supplies & care",
        subtitle: "Nutrition, beds & healthcare",
        filterParam: "pets",
    },
    {
        title: "Fashion & beauty",
        subtitle: "Apparel, footwear & skincare",
        filterParam: "fashion",
    },
    {
        title: "Deals under $25",
        subtitle: "Pantry, organizers & gadgets",
        filterParam: "under-25",
    },
];

export const RollbacksBentoGrid: React.FC<RollbacksBentoGridProps> = ({ products }) => {
    // Partition products across the 5 columns (4 items per column = 20 items)
    const getColumnProducts = (colIndex: number): TProduct[] => {
        if (!products || products.length === 0) return [];
        const start = (colIndex * 4) % products.length;
        const slice = products.slice(start, start + 4);
        if (slice.length < 4 && products.length > 0) {
            // wrap around if needed
            return [...slice, ...products.slice(0, 4 - slice.length)];
        }
        return slice;
    };

    return (
        <section id="rollbacks-bento" aria-label="Walmart Rollbacks and More" className="w-full select-none">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#cc0000] text-white">
                        <Tag className="w-4 h-4 fill-white" />
                    </span>
                    <div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <span>Rollbacks & more</span>
                            <span className="text-xs font-bold text-[#cc0000] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                Up to 50% off
                            </span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                            Hundreds of price drops across verified vendors
                        </p>
                    </div>
                </div>

                <Link
                    href="/#flash-deals"
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0071dc] hover:underline"
                >
                    <span>View all deals</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* 5-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {COLUMN_CONFIGS.map((config, colIdx) => {
                    const colProducts = getColumnProducts(colIdx);

                    return (
                        <div
                            key={config.title}
                            className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
                        >
                            {/* Card Header */}
                            <div>
                                <h3 className="text-sm font-black text-slate-900 leading-tight">
                                    {config.title}
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                    {config.subtitle}
                                </p>
                            </div>

                            {/* 2x2 Mini Product Grid */}
                            <div className="grid grid-cols-2 gap-2.5 my-3.5">
                                {colProducts.map((prod) => {
                                    const priceInfo = extractProductPriceInfo(prod);
                                    const thumbnail = getProductThumbnail(prod);

                                    return (
                                        <Link
                                            key={prod._id}
                                            href={`/products/${prod._id}`}
                                            className="group flex flex-col items-start bg-slate-50/60 hover:bg-slate-100/70 rounded-xl p-2 transition-colors"
                                        >
                                            <div className="relative w-full aspect-square mb-1.5 rounded-lg bg-white p-1 overflow-hidden flex items-center justify-center">
                                                <Image
                                                    src={thumbnail}
                                                    alt={prod.title}
                                                    fill
                                                    sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 10vw"
                                                    className="object-contain group-hover:scale-105 transition-transform duration-200"
                                                    loading="lazy"
                                                />
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xs font-black text-slate-900">
                                                    ${priceInfo.price.toFixed(2)}
                                                </span>
                                                {priceInfo.originalPrice > priceInfo.price && (
                                                    <span className="text-[10px] text-slate-400 line-through">
                                                        ${priceInfo.originalPrice.toFixed(0)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title Snippet */}
                                            <span className="text-[10px] text-slate-600 truncate w-full group-hover:text-[#0071dc]">
                                                {prod.title}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Footer Link */}
                            <div className="pt-1 border-t border-slate-100">
                                <Link
                                    href={`/?department=${config.filterParam}`}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0071dc] hover:underline"
                                >
                                    <span>Shop all</span>
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default RollbacksBentoGrid;
