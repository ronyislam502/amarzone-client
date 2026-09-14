import React from "react";

export interface ProductCardPrimeBadgeProps {
  showDelivery?: boolean;
}

export default function ProductCardPrimeBadge({
  showDelivery = false,
}: ProductCardPrimeBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[9px] bg-[#232f3e] text-[#febd69] font-black px-1.5 py-0.5 rounded-sm">
        prime
      </span>
      {showDelivery && (
        <span className="text-[11px] text-emerald-700 font-semibold">
          FREE Delivery by Tomorrow
        </span>
      )}
      {!showDelivery && (
        <span className="text-[9px] text-emerald-700 font-semibold">FREE</span>
      )}
    </div>
  );
}
