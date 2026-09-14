"use client";

import React from "react";
import { Users, ChevronRight, Store } from "lucide-react";
import { ProductOtherSellersCardProps } from "./types";

export const ProductOtherSellersCard: React.FC<ProductOtherSellersCardProps> = ({
  totalSellers = 0,
  currentPrice,
  onOpenVendorsDrawer,
}) => {
  if (totalSellers <= 1) return null;

  return (
    <div className="border border-slate-200/90 rounded-3xl p-4 sm:p-5 bg-white space-y-3 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Store className="w-4 h-4 text-[#0071dc]" />
          <h3 className="text-xs font-black text-slate-900">Compare Other Sellers</h3>
        </div>
        <span className="text-[11px] font-bold text-[#0071dc] bg-blue-50 px-2.5 py-0.5 rounded-full">
          {totalSellers} Available
        </span>
      </div>

      <p className="text-[11px] text-slate-500">
        Multiple verified vendors offer this product with varying shipping and pricing.
      </p>

      {/* Open Drawer Button */}
      <button
        type="button"
        onClick={onOpenVendorsDrawer}
        className="w-full py-2.5 px-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full flex items-center justify-between text-xs text-slate-900 font-bold transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#0071dc]" />
          <span>Compare offers from ${currentPrice.toFixed(2)}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  );
};

export default ProductOtherSellersCard;
