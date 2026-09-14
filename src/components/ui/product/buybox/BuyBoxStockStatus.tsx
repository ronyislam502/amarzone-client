"use client";

import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { BuyBoxStockStatusProps } from "./types";

export const BuyBoxStockStatus: React.FC<BuyBoxStockStatusProps> = ({
  inventoryLoading = false,
  isStock = true,
}) => {
  if (inventoryLoading) {
    return (
      <div className="h-5 bg-slate-100 rounded-md animate-pulse w-24" />
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs">
      {isStock ? (
        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-600 text-white" />
          <span>In stock</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
          <AlertCircle className="w-3.5 h-3.5 fill-rose-600 text-white" />
          <span>Out of stock</span>
        </span>
      )}
    </div>
  );
};

export default BuyBoxStockStatus;
