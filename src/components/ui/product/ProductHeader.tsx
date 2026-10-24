"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";

interface ProductHeaderInfoProps {
  brand?: string;
  title: string;
  averageRating?: number | string;
  totalRatings?: number;
  categoryName?: string;
  isBestSeller?: boolean;
}

export const ProductHeader: React.FC<ProductHeaderInfoProps> = ({
  brand = "",
  title = "",
  averageRating = 0,
  totalRatings = 0,
  categoryName = "",
}) => {
  const numericRating =
    typeof averageRating === "string"
      ? isNaN(parseFloat(averageRating))
        ? 0
        : parseFloat(averageRating)
      : averageRating || 0;

  const displayRatingsCount = totalRatings;

  return (
    <div className="space-y-2 select-none">
      {/* Brand Store Link */}
      <div>
        <Link
          href={`/products?brand=${encodeURIComponent(brand)}`}
          className="text-xs font-normal text-[#007185] hover:text-[#c7511f] hover:underline transition-colors"
        >
          Visit the {brand} Store
        </Link>
      </div>

      {/* Main Title */}
      <h1 className="text-xl sm:text-2xl font-normal text-[#0f1111] leading-snug tracking-tight">
        {title}
      </h1>

      {/* Rating & Reviews Bar */}
      <div className="flex items-center flex-wrap gap-2 text-xs pt-0.5">
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="flex items-center text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="font-medium text-slate-800 ml-0.5">
            {numericRating > 0 ? numericRating.toFixed(1) : "5.0"}
          </span>
        </div>

        <span className="text-slate-400">·</span>

        <a
          href="#customer-reviews"
          className="text-[#007185] hover:text-[#c7511f] hover:underline transition-colors font-normal"
        >
          {displayRatingsCount} ratings
        </a>
      </div>

      {/* Amarzone's Choice Badge */}
      <div className="pt-1">
        <div className="inline-flex items-center gap-1.5 bg-[#0c1926] text-white text-xs px-2.5 py-1 rounded-sm font-medium">
          <span className="text-[#f08804] font-bold">Amarzone&apos;s</span>
          <span className="text-white font-normal">Choice</span>
          {categoryName && (
            <span className="text-slate-400 text-xs font-normal">
              in {categoryName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
