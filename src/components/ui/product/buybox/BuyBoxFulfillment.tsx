"use client";

import React from "react";
import { ShieldCheck, Store, Lock } from "lucide-react";
import { BuyBoxFulfillmentProps } from "./types";

export const BuyBoxFulfillment: React.FC<BuyBoxFulfillmentProps> = ({
  sellerName = "Amarzone Verified Partner",
  returnsPolicy = "Free 90-day returns",
}) => {
  return (
    <div className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-3">
      <div className="flex items-center justify-between gap-1">
        <span className="text-slate-500">Sold and shipped by</span>
        <span className="text-[#0071dc] font-bold truncate max-w-[170px] hover:underline cursor-pointer">
          {sellerName}
        </span>
      </div>

      <div className="flex items-center justify-between gap-1">
        <span className="text-slate-500">Fulfillment</span>
        <span className="font-semibold text-slate-800 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Amarzone Logistics</span>
        </span>
      </div>

      <div className="flex items-center justify-between gap-1">
        <span className="text-slate-500">Security</span>
        <span className="font-semibold text-slate-800 flex items-center gap-1">
          <Lock className="w-3 h-3 text-slate-500" />
          <span>Encrypted checkout</span>
        </span>
      </div>
    </div>
  );
};

export default BuyBoxFulfillment;
