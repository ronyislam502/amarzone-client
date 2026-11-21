"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Heart,
    ShoppingCart,
    Star,
    BadgePercent,
    ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart, addToCart as addToCartAction } from "@/redux/features/order/orderSlice";

interface AZProductCardProps {
    product: any;
    loading?: "eager" | "lazy";
    priority?: boolean;
}

const AZProductCard = ({ product, loading = "eager", priority }: AZProductCardProps) => {
    const dispatch = useAppDispatch();

    const discountPercentage = product?.discountPercentage || 0;
    const rawPrice =
        product?.price ??
        product?.seller?.price ??
        product?.inventoryPrice ??
        product?.inventoryListings?.[0]?.seller?.price ??
        null;
    const currentPrice =
        typeof rawPrice === "number" && !isNaN(rawPrice) && rawPrice > 0
            ? rawPrice
            : typeof rawPrice === "string" && !isNaN(parseFloat(rawPrice)) && parseFloat(rawPrice) > 0
            ? parseFloat(rawPrice)
            : 0;
    const originalPrice = product?.oldPrice || (discountPercentage > 0 && currentPrice > 0 ? currentPrice / (1 - discountPercentage / 100) : currentPrice);
    const savedAmount = originalPrice > currentPrice && currentPrice > 0 ? originalPrice - currentPrice : 0;
    const averageRating = Number(product?.rating || product?.averageRating || 0);
    const totalReviews = Number(product?.totalReviews || product?.ratingsCount || product?.reviewCount || (averageRating > 0 ? 1 : 0));

    const productHref = product?.variantId
        ? `/products/${product?.productId || product?._id}?variant=${product?.variantId}`
        : `/products/${product?.productId || product?._id}`;

    const handleAddToCart = (product: any) => {
        const cartProduct = {
            _id: product?._id,
            vendor: product.vendorId || product?.seller?.vendor,
            quantity: 1,
            title: product?.title,
            image: product.thumbnail,
            price: product.price,
        };

        dispatch(addToCart(cartProduct));
        toast.success(`🍽️ ${product?.title} in your collection!`, {
            autoClose: 1000,
        });
    }

    return (
        <div className="card w-full bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full justify-between">
            <Link
                key={product?.variantId}
                href={productHref}
                className="flex h-full"
            >
                <div>
                    {/* Image */}
                    <figure className="relative aspect-square overflow-hidden">
                        <Image
                            src={product?.thumbnail || product?.image || product?.images?.[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='225' height='225' viewBox='0 0 225 225'%3E%3Crect width='225' height='225' fill='%23f1f5f9'/%3E%3C/svg%3E"}
                            alt={product?.title || "Product"}
                            width={225}
                            height={225}
                            loading={loading}
                            priority={priority}
                            unoptimized
                            className="object-cover transition-transform duration-300 hover:scale-105"
                            style={{ width: "auto", height: "auto" }}
                        />

                        {/* Dynamic Discount Badge */}
                        {discountPercentage > 0 && (
                            <span className="badge badge-error absolute left-3 top-3 gap-1 text-white">
                                <BadgePercent className="h-3 w-3" />
                                {discountPercentage}% OFF
                            </span>
                        )}

                        {/* Wishlist */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="btn btn-circle btn-sm absolute right-3 top-3 bg-base-100/90 shadow-sm"
                        >
                            <Heart className="h-4 w-4 text-base-content/60" />
                        </button>
                    </figure>

                    {/* Body */}
                    <div className="card-body gap-2 p-4">
                        {/* Brand */}
                        {product?.brand && (
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                {product.brand}
                            </span>
                        )}

                        {/* Title */}
                        <h2 className="card-title line-clamp-2 text-base">
                            {product?.title}
                        </h2>

                        {/* Rating */}
                        {averageRating > 0 || totalReviews > 0 ? (
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-3.5 w-3.5 ${
                                                star <= Math.round(averageRating)
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "fill-slate-100 text-slate-200"
                                            }`}
                                        />
                                    ))}
                                </div>

                                <span className="text-xs font-semibold text-slate-700">
                                    {averageRating.toFixed(1)}
                                    {totalReviews > 0 && (
                                        <span className="text-slate-400 font-normal ml-1">
                                            ({totalReviews})
                                        </span>
                                    )}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className="h-3.5 w-3.5 fill-slate-100 text-slate-200"
                                        />
                                    ))}
                                </div>
                                <span className="text-[11px] text-slate-400">No ratings yet</span>
                            </div>
                        )}

                        {/* Price & Old Price */}
                        <div className="flex items-baseline gap-2">
                            {currentPrice > 0 ? (
                                <>
                                    <span className="text-2xl font-black">
                                        ${currentPrice.toFixed(2)}
                                    </span>

                                    {originalPrice > currentPrice && (
                                        <span className="text-xs text-base-content/40 line-through">
                                            ${originalPrice.toFixed(2)}
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-lg font-bold text-slate-400">
                                    Unavailable
                                </span>
                            )}
                        </div>

                        {/* Dynamic Savings */}
                        {savedAmount > 0 && currentPrice > 0 && (
                            <span className="text-xs font-bold text-error">
                                Save ${savedAmount.toFixed(2)}
                            </span>
                        )}

                        {/* Delivery */}
                        <div className="flex items-center gap-1 text-xs font-semibold text-success">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {product?.category?.name || "General"}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-success">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Free Delivery
                        </div>
                    </div>
                </div>
            </Link>

            {/* Action Button */}
            <div className="card-actions p-4 pt-0 mt-auto">
                <button
                    type="button"
                    disabled={currentPrice <= 0}
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-warning btn-sm w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ShoppingCart className="h-4 w-4" />
                    {currentPrice > 0 ? "Add" : "Out of Stock"}
                </button>
            </div>
        </div>
    );
};

export default AZProductCard;
