"use client";

import React from "react";
import { Plus, Zap, Check } from "lucide-react";
import { BuyBoxActionsProps } from "./types";

export const BuyBoxActions: React.FC<BuyBoxActionsProps> = ({
  handleAddToCart,
  handleBuyNow,
  isStock = true,
  buyLoading,
}) => {
  const isOutOfStock = isStock === false;

  return (
    <div className="space-y-2.5 pt-2">
      {/* Walmart Signature Primary Button: Large Rounded Pill + Add to cart */}
      <button
        type="button"
        onClick={() => handleAddToCart()}
        disabled={isOutOfStock}
        className="w-full py-3 bg-[#0071dc] hover:bg-[#005bb5] active:bg-[#004f9a] text-white font-black text-sm rounded-full shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>Add to cart</span>
      </button>

      {/* Secondary Buy Now Button */}
      <button
        type="button"
        onClick={() => handleBuyNow()}
        disabled={isOutOfStock || buyLoading}
        className="w-full py-2.5 bg-white hover:bg-slate-900 text-slate-900 hover:text-white border border-slate-900 font-bold text-xs rounded-full shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Zap className="w-3.5 h-3.5" />
        <span>{buyLoading ? "Processing..." : "Buy Now"}</span>
      </button>
    </div>
  );
};

export default BuyBoxActions;
