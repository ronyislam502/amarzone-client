"use client";

import React from "react";
import { ChevronDown, RotateCcw, ShieldCheck, Sparkles, Store } from "lucide-react";
import { ProductPriceSectionProps } from "./types";

export const ProductPriceSection: React.FC<ProductPriceSectionProps> = ({
  dollars,
  cents,
  currentPrice,
  showReturnsInfo,
  setShowReturnsInfo,
  totalSellers = 0,
  onOpenVendorsDrawer,
}) => {
  // Realistic rollback calculations
  const originalPrice = Number((currentPrice * 1.22).toFixed(2));
  const savings = Number((originalPrice - currentPrice).toFixed(2));
  const savingsPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  return (
    <div className="space-y-3 py-2 border-y border-slate-200/80">
      {/* Walmart "Now $XX.YY" Price Block */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <div className="flex items-start text-slate-900 font-black">
          <span className="text-sm font-extrabold text-emerald-800 mr-1.5 self-center">Now</span>
          <span className="text-sm font-bold mt-1">$</span>
          <span className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
            {dollars}
          </span>
          <span className="text-sm font-bold leading-none mt-1">
            {cents}
          </span>
        </div>

        {/* Was Price */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="line-through font-medium">${originalPrice.toFixed(2)}</span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
            You save ${savings.toFixed(2)} ({savingsPercent}%)
          </span>
        </div>
      </div>

      <div className="text-xs text-slate-500 font-medium">
        Price when purchased online. Free shipping on orders over $35.
      </div>

      {/* Guarantees & Returns Strip */}
      <div className="space-y-1.5 pt-1 text-xs">
        <div className="flex items-center gap-4 flex-wrap text-slate-700">
          <button
            type="button"
            onClick={() => setShowReturnsInfo(!showReturnsInfo)}
            className="inline-flex items-center gap-1 text-[#0071dc] hover:underline font-bold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#0071dc]" />
            <span>Free 90-day returns</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${showReturnsInfo ? "rotate-180" : ""}`}
            />
          </button>

          <span className="text-slate-300">|</span>

          <span className="inline-flex items-center gap-1 text-slate-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Amarzone Buyer Protection</span>
          </span>
        </div>

        {/* Collapsible Returns Info Drawer */}
        {showReturnsInfo && (
          <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-slate-700 space-y-1 mt-2 animate-fadeIn">
            <p className="font-bold text-slate-900">Hassle-Free Returns</p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              You can return this item within 90 days for a full refund or replacement. Return by mail or at any partner drop-off point with zero restocking fees.
            </p>
          </div>
        )}
      </div>

      {/* Multi-Vendor Availability */}
      {totalSellers > 1 && (
        <div className="pt-1 flex items-center gap-1.5 text-xs text-slate-600">
          <Store className="w-3.5 h-3.5 text-[#0071dc]" />
          <span>Available from</span>
          <button
            type="button"
            onClick={onOpenVendorsDrawer}
            className="text-[#0071dc] hover:underline font-bold cursor-pointer"
          >
            {totalSellers} other sellers
          </button>
          <span>on Amarzone with competitive delivery options.</span>
        </div>
      )}
    </div>
  );
};

export default ProductPriceSection;
