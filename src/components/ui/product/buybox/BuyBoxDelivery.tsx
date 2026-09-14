"use client";

import React from "react";
import { Truck, RotateCcw, ShieldCheck, MapPin } from "lucide-react";
import { BuyBoxDeliveryProps } from "./types";

export const BuyBoxDelivery: React.FC<BuyBoxDeliveryProps> = ({
  deliveryDate = "Free 2-day shipping",
  cutoffText = "Arrives in 2-3 business days",
  location = "Select delivery ZIP code",
}) => {
  return (
    <div className="space-y-2.5 text-xs text-slate-700 py-2 border-y border-slate-100">
      {/* Shipping details */}
      <div className="flex items-start gap-2.5">
        <Truck className="w-4 h-4 text-[#0071dc] shrink-0 mt-0.5" />
        <div>
          <p className="font-extrabold text-slate-900">
            Free delivery on orders $35+
          </p>
          <p className="text-[11px] text-slate-500">
            {cutoffText}
          </p>
        </div>
      </div>

      {/* Free 90-day returns */}
      <div className="flex items-start gap-2.5">
        <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-900">Free 90-day returns</p>
          <p className="text-[11px] text-slate-500">Full refund or instant replacement</p>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-slate-500 pt-0.5 text-[11px]">
        <MapPin className="w-3.5 h-3.5 text-slate-400" />
        <span className="hover:text-[#0071dc] cursor-pointer hover:underline">
          {location}
        </span>
      </div>
    </div>
  );
};

export default BuyBoxDelivery;
