"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Award } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/order/orderSlice";

interface BestSellerCardProps {
    item: any;
    rank?: number;
}

export const BestSellerCard: React.FC<BestSellerCardProps> = ({ item, rank }) => {
    const dispatch = useAppDispatch();

    const displayRank = rank ?? item?.categoryRank ?? item?.departmentRank ?? item?.globalRank;
    const variantId = item?.variantId || item?.variant?._id || item?._id;
    const productId = item?.productId || item?.product?._id || item?.product || item?._id;
    const productHref = `/products/${productId}?variant=${variantId}`;

    const title = item?.title || item?.product?.title || "Product";
    const brand = item?.brand || item?.product?.brand;
    const thumbnail =
        item?.thumbnail ||
        item?.image ||
        item?.images?.[0] ||
        item?.product?.thumbnail ||
        item?.variant?.images?.[0] ||
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='225' height='225' viewBox='0 0 225 225'%3E%3Crect width='225' height='225' fill='%23f1f5f9'/%3E%3C/svg%3E";

    const price = typeof item?.price === "number" ? item.price : parseFloat(item?.price) || 0;
    const rating = Number(item?.rating ?? item?.product?.rating ?? 4.5);
    const totalReviews = Number(item?.totalReviews ?? item?.ratingsCount ?? item?.reviewCount ?? 120);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const cartItem = {
            _id: variantId,
            variantId: variantId,
            productId: productId,
            vendor: item?.vendorId || item?.seller?.vendor || item?.author?.id,
            quantity: 1,
            title: title,
            image: thumbnail,
            price: price,
        };

        dispatch(addToCart(cartItem));
        toast.success(`🛒 Added #${displayRank || 1} Best Seller to cart!`, {
            autoClose: 1500,
        });
    };

    return (
        <div className="card bg-white border border-slate-200/80 rounded-md p-3 relative flex flex-col justify-between h-full hover:shadow-md transition-shadow group select-none">
            {/* Amazon-style Rank Ribbon Tag */}
            {typeof displayRank === "number" && displayRank > 0 && (
                <div className="absolute top-0 left-0 z-10">
                    <span className="inline-flex items-center gap-0.5 bg-[#e77600] text-white font-black text-xs sm:text-sm px-2.5 py-1 rounded-br-md shadow-xs tracking-tight">
                        #{displayRank}
                    </span>
                </div>
            )}

            {/* Top Product Image */}
            <Link href={productHref} className="block pt-3 pb-2 text-center overflow-hidden">
                <figure className="relative aspect-square w-full max-w-[200px] mx-auto overflow-hidden bg-white flex items-center justify-center">
                    <Image
                        src={thumbnail}
                        alt={title}
                        width={200}
                        height={200}
                        unoptimized
                        className="object-contain max-h-[190px] w-auto transition-transform duration-200 group-hover:scale-105"
                    />
                </figure>
            </Link>

            {/* Product Metadata Stack */}
            <div className="flex flex-col flex-1 justify-between pt-2">
                <div>
                    {/* Brand */}
                    {brand && (
                        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block truncate">
                            {brand}
                        </span>
                    )}

                    {/* Title */}
                    <Link
                        href={productHref}
                        className="text-xs sm:text-[13px] font-medium text-[#007185] hover:text-[#c7511f] hover:underline line-clamp-2 leading-snug mt-0.5 block"
                        title={title}
                    >
                        {title}
                    </Link>

                    {/* Star Ratings + Review Count */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="flex items-center text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                        i < Math.floor(rating)
                                            ? "fill-amber-400 text-amber-500"
                                            : i < rating
                                            ? "fill-amber-400/50 text-amber-500"
                                            : "text-slate-300"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-[#007185] hover:underline cursor-pointer">
                            {totalReviews.toLocaleString()}
                        </span>
                    </div>

                    {/* Best Seller Badge if eligible */}
                    {item?.isBestSeller && (
                        <div className="mt-1">
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-[#b12704] text-[10px] font-bold px-1.5 py-0.5 rounded">
                                <Award className="w-2.5 h-2.5" />
                                Best Seller
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-xs text-slate-900 font-semibold align-top">$</span>
                        <span className="text-lg font-bold text-slate-900 leading-none">
                            {price.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* DaisyUI Add to Cart Button */}
                <div className="mt-3 pt-2 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        aria-label={`Add ${title} to cart`}
                        className="btn btn-sm bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-slate-900 border-[#fcd200] hover:border-[#fcd200] rounded-full w-full font-medium text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                        <ShoppingCart className="w-3.5 h-3.5 text-slate-800" />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BestSellerCard;
