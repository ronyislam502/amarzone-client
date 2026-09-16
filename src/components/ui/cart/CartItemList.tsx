"use client";

import React from "react";
import { TCartProduct } from "./cartTypes";
import CartItemCard from "./CartItemCard";

interface CartItemListProps {
  items: TCartProduct[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  isAllSelected: boolean;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onDeleteItem: (id: string) => void;
  onSaveForLater: (id: string) => void;
  subtotal: number;
  selectedCount: number;
}

export const CartItemList: React.FC<CartItemListProps> = ({
  items,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  onUpdateQuantity,
  onDeleteItem,
  onSaveForLater,
  subtotal,
  selectedCount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs select-none">
      {/* Cart Card Header */}
      <div className="flex items-baseline justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <button
            type="button"
            onClick={onToggleSelectAll}
            className="text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer"
          >
            {isAllSelected ? "Deselect all items" : "Select all items"}
          </button>
        </div>

        <div className="hidden sm:block text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Price
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <CartItemCard
            key={item._id || item.variantId || item.id}
            item={item}
            onToggleSelect={onToggleSelect}
            onUpdateQuantity={onUpdateQuantity}
            onDeleteItem={onDeleteItem}
            onSaveForLater={onSaveForLater}
          />
        ))}
      </div>

      {/* Cart Subtotal Footer */}
      <div className="border-t border-slate-200 pt-4 flex items-center justify-end text-sm sm:text-base select-none">
        <span className="text-slate-700 font-normal mr-1.5">
          Subtotal ({selectedCount} {selectedCount === 1 ? "item" : "items"}):
        </span>
        <span className="font-extrabold text-slate-900 text-lg sm:text-xl">
          ${subtotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default CartItemList;
