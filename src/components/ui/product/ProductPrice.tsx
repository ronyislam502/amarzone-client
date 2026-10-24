"use client";

import React from "react";
import { Info, RotateCcw, ShieldCheck } from "lucide-react";

interface ProductPriceBlockProps {
  price?: number;
  originalPrice?: number;
  currency?: string;
  hasDiscount?: boolean;
  savingsPercentage?: number;
}

export const ProductPriceBlock: React.FC<ProductPriceBlockProps> = ({
  price = 0,
  originalPrice = 0,
  currency = "$",
  savingsPercentage,
}) => {
  const safePrice = typeof price === "number" && !isNaN(price) && price > 0 ? price : 0;
  const safeOriginalPrice =
    typeof originalPrice === "number" && !isNaN(originalPrice) && originalPrice > safePrice
      ? originalPrice
      : 0;

  if (safePrice <= 0) {
    return (
      <div className="py-3 border-y border-slate-200/80 select-none">
        <span className="text-sm font-semibold text-slate-700">Price available at checkout / Check sellers</span>
      </div>
    );
  }

  const dollars = Math.floor(safePrice);
  const cents = Math.round((safePrice - dollars) * 100)
    .toString()
    .padStart(2, "0");

  const origFormatted = safeOriginalPrice.toFixed(2);
  const discountPercent =
    savingsPercentage ||
    (safeOriginalPrice > safePrice
      ? Math.round(((safeOriginalPrice - safePrice) / safeOriginalPrice) * 100)
      : 0);

  return (
    <div className="py-3 border-y border-slate-200/80 space-y-2 select-none">
      {/* Price Main Row */}
      <div className="flex items-start gap-2">
        {discountPercent > 0 && (
          <span className="text-3xl font-light text-[#cc0c39] leading-none">
            -{discountPercent}%
          </span>
        )}

        <div className="flex items-start text-[#0f1111] leading-none">
          <span className="text-xs font-medium text-slate-800 mt-1 mr-0.5">
            {currency}
          </span>
          <span className="text-3xl font-bold tracking-tight text-[#0f1111]">
            {dollars}
          </span>
          <span className="text-xs font-semibold text-slate-800 mt-1 ml-0.5">
            {cents}
          </span>
        </div>
      </div>

      {/* List Price & Savings */}
      {safeOriginalPrice > safePrice && (
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span>List Price:</span>
          <span className="line-through text-slate-500 font-normal">
            {currency}{origFormatted}
          </span>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
            title="The List Price is the suggested retail price provided by the manufacturer."
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Trust & Guarantee Perks */}
      <div className="flex items-center gap-5 pt-1 text-xs">
        <div className="flex items-center gap-1.5 text-[#007185] hover:text-[#c7511f] cursor-pointer">
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hover:underline">FREE Returns</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="hover:underline cursor-pointer">100% Authentic Guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default ProductPriceBlock;
