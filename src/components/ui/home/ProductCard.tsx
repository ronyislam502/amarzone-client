"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Star, Check, Sparkles, ShieldCheck } from "lucide-react";
import { TProduct } from "@/src/types/product";
import {
    extractProductPriceInfo,
    getProductThumbnail,
    formatWalmartPrice,
} from "./homeUtils";
import { toast } from "react-toastify";

export interface ProductCardProps {
    product: TProduct;
    badgeLabel?: string;
    isRollback?: boolean;
    className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    badgeLabel,
    isRollback = false,
    className = "",
}) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isAdded, setIsAdded] = useState(false);

    const priceInfo = extractProductPriceInfo(product);
    const thumbnail = getProductThumbnail(product);
    const { dollars, cents } = formatWalmartPrice(priceInfo.price);
    const { dollars: origDollars, cents: origCents } = formatWalmartPrice(priceInfo.originalPrice);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdded(true);
        toast.success(`Added "${product.title.slice(0, 22)}..." to cart!`, {
            position: "bottom-right",
            autoClose: 1800,
        });
        setTimeout(() => setIsAdded(false), 1600);
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
        toast.info(
            !isWishlisted ? "Saved to your list" : "Removed from your list",
            { position: "bottom-right", autoClose: 1400 }
        );
    };

    // Determine badge style
    const displayBadge =
        badgeLabel ||
        (isRollback || product.isBestSeller || priceInfo.savings > 4
            ? "Rollback"
            : null);

    return (
        <div
            className={`group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200/70 hover:border-slate-300 hover:shadow-md transition-all duration-200 p-3 sm:p-4 select-none min-w-[210px] sm:min-w-[240px] ${className}`}
        >
            {/* Top Row: Badge + Wishlist Heart */}
            <div className="flex items-start justify-between gap-1 z-10 min-h-[24px]">
                <div>
                    {displayBadge ? (
                        <span className="inline-flex items-center gap-1 bg-[#cc0000] text-white text-[11px] font-black px-2 py-0.5 rounded-sm tracking-tight">
                            <span className="text-xs">↓</span>
                            <span>{displayBadge}</span>
                        </span>
                    ) : (
                        <span className="h-5 inline-block" />
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-label="Save item"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-slate-100 transition-colors"
                >
                    <Heart
                        className={`w-4 h-4 transition-colors ${
                            isWishlisted ? "fill-rose-500 text-rose-500" : ""
                        }`}
                    />
                </button>
            </div>

            {/* Product Image Area */}
            <Link
                href={`/products/${product._id}`}
                className="relative w-full aspect-square my-2 flex items-center justify-center overflow-hidden rounded-xl p-2 bg-slate-50/40"
            >
                <Image
                    src={thumbnail}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-contain group-hover:scale-105 transition-transform duration-200 ease-out"
                    loading="lazy"
                />
            </Link>

            {/* Options / Add Button row (Walmart style) */}
            <div className="my-1.5">
                <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`inline-flex items-center justify-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                        isAdded
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "border-slate-800 text-slate-900 hover:bg-slate-900 hover:text-white"
                    }`}
                >
                    {isAdded ? (
                        <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Added</span>
                        </>
                    ) : priceInfo.variantCount > 1 ? (
                        <span>Options</span>
                    ) : (
                        <>
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Add</span>
                        </>
                    )}
                </button>
            </div>

            {/* Price Block: Walmart "Now $XX.YY" */}
            <div className="mt-1 space-y-1">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                    <div className="flex items-start text-slate-900 font-extrabold">
                        <span className="text-xs font-bold mr-1 text-emerald-800">Now</span>
                        <span className="text-xs font-bold mt-0.5">$</span>
                        <span className="text-xl sm:text-2xl font-black tracking-tight leading-none">
                            {dollars}
                        </span>
                        <span className="text-xs font-bold leading-none mt-0.5">
                            {cents}
                        </span>
                    </div>

                    {priceInfo.originalPrice > priceInfo.price && (
                        <span className="text-xs text-slate-400 line-through font-medium">
                            ${origDollars}.{origCents}
                        </span>
                    )}
                </div>

                {priceInfo.hasPriceRange && (
                    <p className="text-[11px] text-slate-500 font-medium">
                        Options from ${dollars}.{cents}
                    </p>
                )}

                {/* Title */}
                <Link
                    href={`/products/${product._id}`}
                    title={product.title}
                    className="text-xs sm:text-sm font-normal text-slate-800 hover:underline line-clamp-2 leading-snug pt-1"
                >
                    {product.title}
                </Link>

                {/* Rating & Vendor */}
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                    <div className="flex items-center text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                        <span className="font-bold text-slate-800">4.7</span>
                        <span className="text-slate-400 ml-0.5">(98)</span>
                    </div>
                    <span>•</span>
                    <span className="truncate max-w-[110px]">
                        {product.brand ? product.brand : priceInfo.vendorName}
                    </span>
                </div>

                {/* Fulfillment */}
                <div className="text-[11px] text-slate-600 font-medium pt-1">
                    <span className="font-bold text-slate-900">Free 2-day delivery</span>
                    <span className="text-slate-500 block text-[10px]">on orders $35+</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
