import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Heart,
    ShoppingCart,
    Star,
    BadgePercent,
    ShieldCheck,
} from "lucide-react";
import { PRODUCT_PLACEHOLDER } from "@/lib/constants";

interface AZProductCardProps {
    product: any;
    loading?: "eager" | "lazy";
    priority?: boolean;
}

const AZProductCard = ({ product, loading = "eager", priority }: AZProductCardProps) => {
    // const rawImage = product?.thumbnail || product?.image;
    // const [imgSrc, setImgSrc] = useState(rawImage || PRODUCT_PLACEHOLDER);

    // useEffect(() => {
    //     setImgSrc(rawImage || PRODUCT_PLACEHOLDER);
    // }, [rawImage]);

    const discountPercentage = product?.discountPercentage || 0;
    const currentPrice = product?.price || 0;
    const originalPrice = product?.oldPrice || (discountPercentage > 0 ? currentPrice / (1 - discountPercentage / 100) : currentPrice);
    const savedAmount = originalPrice > currentPrice ? originalPrice - currentPrice : 0;
    const totalReviews = Number(product?.totalReviews || product?.ratingsCount || product?.reviewCount || 0);
    const averageRating = Number(product?.rating || product?.averageRating || 0);

    const productHref = product?.variantId
        ? `/products/${product?.productId || product?._id}?variant=${product?.variantId}`
        : `/products/${product?.productId || product?._id}`;

    return (
        <Link
            key={product?._id}
            href={productHref}
            className="flex h-full"
        >
            <div className="card w-full bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full justify-between">
                <div>
                    {/* Image */}
                    <figure className="relative aspect-square overflow-hidden">
                        <Image
                            src={product?.thumbnail || PRODUCT_PLACEHOLDER}
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
                        {totalReviews > 0 ? (
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-3.5 w-3.5 ${
                                                star <= Math.round(averageRating)
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-slate-300"
                                            }`}
                                        />
                                    ))}
                                </div>

                                <span className="text-xs text-base-content/60">
                                    {averageRating.toFixed(1)} ({totalReviews})
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-xs text-base-content/50">
                                <Star className="h-3.5 w-3.5 text-base-content/30" />
                                <span>No ratings yet</span>
                            </div>
                        )}

                        {/* Price & Old Price */}
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black">
                                ${currentPrice.toFixed(2)}
                            </span>

                            {originalPrice > currentPrice && (
                                <span className="text-xs text-base-content/40 line-through">
                                    ${originalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Dynamic Savings */}
                        {savedAmount > 0 && (
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

                {/* Action Button */}
                <div className="card-actions p-4 pt-0 mt-auto">
                    <button className="btn btn-warning btn-sm w-full">
                        <ShoppingCart className="h-4 w-4" />
                        Add
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default AZProductCard;