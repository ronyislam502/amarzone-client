import React from "react";

export interface ProductCardPriceProps {
  price: number;
  originalPrice?: string | number;
  discountPct?: number;
  viewMode?: "grid" | "list";
}

export default function ProductCardPrice({
  price,
  originalPrice,
  discountPct,
  viewMode = "grid",
}: ProductCardPriceProps) {
  const calculatedOriginal = originalPrice ?? (price * 1.25).toFixed(2);
  const calculatedDiscount =
    discountPct ??
    Math.round(((price * 1.25 - price) / (price * 1.25)) * 100);

  if (viewMode === "list") {
    return (
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-[18px] font-bold text-base-content">
          ${price.toFixed(2)}
        </span>
        <span className="text-[13px] text-slate-400 line-through">
          ${calculatedOriginal}
        </span>
        <span className="text-[12px] text-red-600 font-bold">
          -{calculatedDiscount}%
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-1 flex-wrap">
      <span className="text-[13px] font-bold text-base-content">
        ${price.toFixed(2)}
      </span>
      <span className="text-[10px] text-slate-400 line-through">
        ${calculatedOriginal}
      </span>
      <span className="text-[10px] text-red-600 font-bold">
        -{calculatedDiscount}%
      </span>
    </div>
  );
}
