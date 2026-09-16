import React from "react";
import { Info, RotateCcw, ShieldCheck } from "lucide-react";

interface ProductPriceBlockProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  hasDiscount?: boolean;
  savingsPercentage?: number;
}

export const ProductPriceBlock: React.FC<ProductPriceBlockProps> = ({
  price,
  originalPrice,
  currency = "$",
  hasDiscount,
  savingsPercentage,
}) => {
  const safePrice = typeof price === "number" && !isNaN(price) ? price : 0;
  const safeOriginalPrice =
    typeof originalPrice === "number" && !isNaN(originalPrice)
      ? originalPrice
      : safePrice > 0
      ? safePrice * 1.15
      : 0;

  const dollars = Math.floor(safePrice);
  const cents = Math.round((safePrice - dollars) * 100)
    .toString()
    .padStart(2, "0");

  const origDollars = Math.floor(safeOriginalPrice);
  const origCents = Math.round((safeOriginalPrice - origDollars) * 100)
    .toString()
    .padStart(2, "0");

  const discountPercent =
    savingsPercentage ||
    (safeOriginalPrice > safePrice && safeOriginalPrice > 0
      ? Math.round(((safeOriginalPrice - safePrice) / safeOriginalPrice) * 100)
      : 0);

  const showDiscount = hasDiscount || discountPercent > 0;

  return (
    <div className="py-2.5 border-b border-slate-200 select-none">
      {/* Price Main Row (Amazon Style) */}
      <div className="flex items-baseline gap-2 flex-wrap">
        {showDiscount && discountPercent > 0 && (
          <span className="text-2xl sm:text-3xl font-light text-[#cc0c39]">
            -{discountPercent}%
          </span>
        )}

        <div className="flex items-start text-slate-900 font-extrabold">
          <span className="text-sm font-semibold mt-1 mr-0.5 text-slate-700">
            {currency}
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none text-slate-900">
            {dollars}
          </span>
          <span className="text-sm font-semibold leading-none mt-1 ml-0.5 text-slate-700">
            {cents}
          </span>
        </div>
      </div>

      {/* List Price & Savings */}
      {showDiscount && safeOriginalPrice > safePrice && (
        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
          <span>List Price:</span>
          <span className="line-through text-slate-400 font-medium">
            {currency}
            {origDollars}.{origCents}
          </span>
          <div
            className="tooltip tooltip-bottom"
            data-tip="The List Price is the suggested retail price provided by a manufacturer or vendor."
          >
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>
        </div>
      )}

      {/* Trust & Guarantee Perks */}
      <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
        <div className="flex items-center gap-1 text-[#007185] hover:text-[#c7511f] cursor-pointer">
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-medium hover:underline">FREE Returns</span>
        </div>

        <div className="flex items-center gap-1 text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-medium">100% Authentic Guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default ProductPriceBlock;
