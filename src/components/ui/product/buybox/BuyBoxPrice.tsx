"use client";

import React from "react";
import { BuyBoxPriceProps } from "./types";

export const BuyBoxPrice: React.FC<BuyBoxPriceProps> = ({ dollars, cents }) => {
  return (
    <div className="flex items-start text-slate-900 font-black">
      <span className="text-xs font-bold mr-1 text-emerald-800 self-center">Now</span>
      <span className="text-xs font-bold mt-1">$</span>
      <span className="text-3xl font-black tracking-tight leading-none">
        {dollars}
      </span>
      <span className="text-xs font-bold leading-none mt-1">
        {cents}
      </span>
    </div>
  );
};

export default BuyBoxPrice;
