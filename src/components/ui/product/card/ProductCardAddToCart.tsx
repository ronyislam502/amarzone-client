import React from "react";
import { ShoppingCart } from "lucide-react";

export interface ProductCardAddToCartProps {
  onClick?: () => void;
  viewMode?: "grid" | "list";
  disabled?: boolean;
}

export default function ProductCardAddToCart({
  onClick,
  viewMode = "grid",
  disabled = false,
}: ProductCardAddToCartProps) {
  if (viewMode === "list") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="mt-1 px-4 py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#ddb200] border border-[#fcd200] text-[#0f1111] text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <ShoppingCart className="w-3.5 h-3.5" />
        Add to Cart
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-auto w-full py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#ddb200] border border-[#fcd200] text-[#0f1111] text-[10px] font-bold rounded-full flex items-center justify-center gap-1 transition-colors cursor-pointer"
    >
      <ShoppingCart className="w-3 h-3" />
      Add to cart
    </button>
  );
}
