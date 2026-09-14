"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { BuyBoxQuantitySelectorProps } from "./types";

export const BuyBoxQuantitySelector: React.FC<BuyBoxQuantitySelectorProps> = ({
  quantity,
  setQuantity,
  disabled = false,
}) => {
  const handleDecrement = () => {
    if (quantity > 1 && !disabled) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < 20 && !disabled) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs font-bold text-slate-700">Quantity:</span>

      <div className="flex items-center border border-slate-300 rounded-full bg-slate-50 p-0.5 shadow-2xs">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || quantity <= 1}
          aria-label="Decrease quantity"
          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-700 hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="w-8 text-center text-xs font-bold text-slate-900 select-none">
          {quantity}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || quantity >= 20}
          aria-label="Increase quantity"
          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-700 hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default BuyBoxQuantitySelector;
