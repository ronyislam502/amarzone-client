"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

interface CartEmptyStateProps {
  onExploreProducts?: () => void;
}

export const CartEmptyState: React.FC<CartEmptyStateProps> = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs space-y-6 select-none max-w-2xl mx-auto">
      <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-[#e77600] shadow-xs">
        <ShoppingCart className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Your Amarzone Cart is empty
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Your shopping cart lives to serve. Give it purpose — discover today&apos;s
          top items, electronics, and trending products from verified Amarzone sellers.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="btn btn-sm sm:btn-md gap-2 rounded-full font-bold bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 border border-[#fcd200] shadow-xs cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop Today&apos;s Deals</span>
        </Link>

        <Link
          href="/login"
          className="btn btn-sm sm:btn-md btn-outline border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white rounded-full font-bold gap-2"
        >
          <span>Sign In to Your Account</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default CartEmptyState;
