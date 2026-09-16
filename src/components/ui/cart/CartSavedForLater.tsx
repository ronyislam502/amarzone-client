"use client";

import React from "react";
import Image from "next/image";
import { TCartProduct } from "./cartTypes";
import { Bookmark, ShoppingCart, Trash2 } from "lucide-react";

interface CartSavedForLaterProps {
  savedItems: TCartProduct[];
  onMoveToCart: (id: string) => void;
  onDeleteSavedItem: (id: string) => void;
}

export const CartSavedForLater: React.FC<CartSavedForLaterProps> = ({
  savedItems,
  onMoveToCart,
  onDeleteSavedItem,
}) => {
  if (savedItems.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 select-none">
      <div className="border-b border-slate-200 pb-3 flex items-center gap-2">
        <Bookmark className="w-5 h-5 text-amber-500" />
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          Saved for later ({savedItems.length} {savedItems.length === 1 ? "item" : "items"})
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {savedItems.map((item) => {
          const itemId = item._id || item.variantId || item.id || "";
          const imgSrc =
            item.image ||
            item.thumbnail ||
            "https://m.media-amazon.com/images/I/81TsMF0Zr4L.jpg";

          return (
            <div
              key={itemId}
              className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full h-32 bg-white rounded-lg p-2 flex items-center justify-center overflow-hidden mb-2">
                  <Image
                    src={imgSrc}
                    alt={item.title || "Product"}
                    fill
                    sizes="(max-width: 640px) 100vw, 200px"
                    className="object-contain"
                  />
                </div>

                <h4
                  className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug"
                  title={item.title}
                >
                  {item.title}
                </h4>

                <div className="text-sm font-black text-slate-900 mt-1">
                  ${(item.price || 0).toFixed(2)}
                </div>

                <div className="text-[11px] font-bold text-[#007600] mt-0.5">
                  {item.stockNote || "In Stock"}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onMoveToCart(itemId)}
                  className="btn btn-xs btn-outline border-slate-300 hover:bg-slate-900 hover:text-white rounded-lg flex-1 text-[11px] font-bold gap-1 cursor-pointer"
                >
                  <ShoppingCart className="w-3 h-3" />
                  <span>Move to cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteSavedItem(itemId)}
                  className="btn btn-xs btn-ghost text-slate-400 hover:text-rose-500"
                  title="Delete saved item"
                  aria-label="Delete saved item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartSavedForLater;
