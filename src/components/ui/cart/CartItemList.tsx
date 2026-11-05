"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import CartItemCard from "./CartItemCard";
import CartSavedForLater from "./CartSavedForLater";
import { TCartProduct } from "@/types/order";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart, removeFromCart, updateQuantity } from "@/redux/features/order/orderSlice";

interface CartItemListProps {
  items: TCartProduct[];
  onSelectionChange?: (
    selectedItems: TCartProduct[],
    subtotal: number,
    selectedCount: number
  ) => void;
}

export const CartItemList: React.FC<CartItemListProps> = ({
  items,
  onSelectionChange,
}) => {
  const dispatch = useAppDispatch();
  const [deselectedIds, setDeselectedIds] = useState<Set<string>>(new Set());
  const [savedItems, setSavedItems] = useState<TCartProduct[]>([]);

  const cartItems = useMemo<TCartProduct[]>(
    () =>
      items?.map((product) => {
        const id = product._id || product.variantId || product.id || "";
        return {
          ...product,
          _id: id,
          id,
          isSelected: !deselectedIds.has(id),
        };
      }),
    [items, deselectedIds]
  );

  const selectedItems = useMemo(
    () => cartItems.filter((item) => item.isSelected !== false),
    [cartItems]
  );
  const selectedCount = useMemo(
    () =>
      selectedItems.reduce((total, item) => total + (item.quantity || 1), 0),
    [selectedItems]
  );
  const subtotal = useMemo(
    () =>
      Number(
        selectedItems
          .reduce(
            (total, item) =>
              total + (item.price || 0) * (item.quantity || 1),
            0
          )
          .toFixed(2)
      ),
    [selectedItems]
  );
  const isAllSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length;

  useEffect(() => {
    onSelectionChange?.(selectedItems, subtotal, selectedCount);
  }, [onSelectionChange, selectedItems, subtotal, selectedCount]);

  const handleToggleSelect = (id: string) => {
    setDeselectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    setDeselectedIds(
      isAllSelected
        ? new Set(cartItems.map((item) => item._id || item.variantId || item.id || ""))
        : new Set()
    );
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    const item = cartItems.find(
      (cartItem) => (cartItem._id || cartItem.variantId || cartItem.id) === id
    );
    if (!item) return;

    const currentQuantity = item.quantity || 1;
    const changeCount = Math.abs(newQuantity - currentQuantity);
    const type =
      newQuantity > currentQuantity ? "increment" : "decrement";
    for (let change = 0; change < changeCount; change += 1) {
      dispatch(updateQuantity({ _id: id, type }));
    }
  };

  const handleDeleteItem = (id: string) => {
    const item = cartItems.find(
      (cartItem) => (cartItem._id || cartItem.variantId || cartItem.id) === id
    );
    dispatch(removeFromCart({ _id: id }));
    setDeselectedIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    toast.info(`Removed "${(item?.title || "Item").slice(0, 24)}..." from cart.`, {
      position: "bottom-right",
      autoClose: 1800,
    });
  };

  const handleSaveForLater = (id: string) => {
    const item = cartItems.find(
      (cartItem) => (cartItem._id || cartItem.variantId || cartItem.id) === id
    );
    if (!item) return;

    dispatch(removeFromCart({ _id: id }));
    setSavedItems((current) => [item, ...current]);
    setDeselectedIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    toast.info(`Saved "${item?.title?.slice(0, 24)}..." for later.`, {
      position: "bottom-right",
      autoClose: 1800,
    });
  };

  const handleMoveToCart = (id: string) => {
    const item = savedItems.find(
      (savedItem) =>
        (savedItem._id || savedItem.variantId || savedItem.id) === id
    );
    if (!item) return;

    setSavedItems((current) =>
      current.filter(
        (savedItem) =>
          (savedItem._id || savedItem.variantId || savedItem.id) !== id
      )
    );
    dispatch(addToCart(item));
    toast.success(`Moved "${item?.title?.slice(0, 24)}..." to cart!`, {
      position: "bottom-right",
      autoClose: 1800,
    });
  };

  const handleDeleteSavedItem = (id: string) => {
    setSavedItems((current) =>
      current.filter(
        (savedItem) =>
          (savedItem._id || savedItem.variantId || savedItem.id) !== id
      )
    );
    toast.info("Deleted from saved list.", {
      position: "bottom-right",
      autoClose: 1400,
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs select-none">
        {/* Cart Card Header */}
        <div className="flex items-baseline justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Shopping Cart
            </h1>
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer"
            >
              {isAllSelected ? "Deselect all items" : "Select all items"}
            </button>
          </div>

          <div className="hidden sm:block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            PRICE
          </div>
        </div>

        {/* Items List */}
        <div className="divide-y divide-slate-100">
          {items.map((item) => {
            const id = item._id || item.variantId || item.id || "";
            const currentItem = cartItems.find(
              (cartItem) =>
                (cartItem._id || cartItem.variantId || cartItem.id) === id
            );
            return (
              <CartItemCard
                key={id}
                item={currentItem || item}
                onToggleSelect={handleToggleSelect}
                onUpdateQuantity={handleUpdateQuantity}
                onDeleteItem={handleDeleteItem}
                onSaveForLater={handleSaveForLater}
              />
            );
          })}
        </div>

        {/* Cart Subtotal Footer */}
        <div className="border-t border-slate-200 pt-4 flex items-center justify-end text-sm sm:text-base select-none">
          <span className="text-slate-800 font-normal mr-1.5 text-base sm:text-lg">
            Subtotal ({selectedCount} {selectedCount === 1 ? "item" : "items"}):
          </span>
          <span className="font-extrabold text-slate-900 text-lg sm:text-xl">
            ${subtotal.toFixed(2)}
          </span>
        </div>
      </div>

      <CartSavedForLater
        savedItems={savedItems}
        onMoveToCart={handleMoveToCart}
        onDeleteSavedItem={handleDeleteSavedItem}
      />
    </>
  );
};

export default CartItemList;
