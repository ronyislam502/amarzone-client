"use client";

import React from "react";
import Link from "next/link";
import { Star, ShieldCheck } from "lucide-react";

interface ProductHeaderInfoProps {
  brand?: string;
  title: string;
  averageRating?: number | string;
  totalRatings?: number;
  categoryName?: string;
  isBestSeller?: boolean;
}

export const ProductHeaderInfo: React.FC<ProductHeaderInfoProps> = ({
  brand,
  title,
  averageRating = 4.5,
  totalRatings = 0,
  categoryName,
  isBestSeller = false,
}) => {
  const numericRating = typeof averageRating === "string" ? parseFloat(averageRating) || 4.5 : averageRating;

  const scrollToReviews = (e: React.MouseEvent) => {
    e.preventDefault();
    const reviewsEl = document.getElementById("customer-reviews");
    if (reviewsEl) {
      reviewsEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-2 border-b border-slate-200 pb-3 select-none">
      {/* Brand Store Link */}
      {brand && (
        <div>
          <Link
            href={`/products?brand=${encodeURIComponent(brand)}`}
            className="text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline transition-colors"
          >
            Visit the {brand} Store
          </Link>
        </div>
      )}

      {/* Main Title */}
      <h1 className="text-xl sm:text-2xl lg:text-[26px] font-medium text-slate-900 leading-snug tracking-tight">
        {title}
      </h1>

      {/* Rating & Reviews Bar */}
      <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs pt-0.5">
        {/* Star visual */}
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={scrollToReviews}>
          <div className="flex items-center text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(numericRating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-200 text-slate-300"
                }`}
              />
            ))}
          </div>
          <span className="font-bold text-slate-800 ml-0.5">
            {numericRating.toFixed(1)}
          </span>
        </div>

        <span className="text-slate-300">•</span>

        {/* Total ratings link */}
        <a
          href="#customer-reviews"
          onClick={scrollToReviews}
          className="text-[#007185] hover:text-[#c7511f] hover:underline transition-colors font-medium"
        >
          {totalRatings > 0 ? `${totalRatings.toLocaleString()} ratings` : "No ratings yet"}
        </a>

        {/* Amarzone's Choice / Best Seller badge */}
        {categoryName && (
          <>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="inline-flex items-center gap-1.5 bg-[#232f3e] text-white text-[11px] px-2.5 py-0.5 rounded-sm font-semibold">
              <span className="text-amber-400 font-bold">Amarzone&apos;s</span>
              <span className="text-white font-normal">Choice</span>
              <span className="text-slate-300 text-[10px] hidden md:inline">
                in {categoryName}
              </span>
            </div>
          </>
        )}

        {isBestSeller && !categoryName && (
          <span className="badge badge-warning badge-sm font-bold">
            #1 Best Seller
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductHeaderInfo;
