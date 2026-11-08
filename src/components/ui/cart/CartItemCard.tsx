"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Bookmark, Share2, Minus, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { TCartProduct } from "@/types/order";
import { useAppDispatch } from "@/redux/hooks";
import { updateCartItemDetails } from "@/redux/features/order/orderSlice";
import { useSingleProductQuery } from "@/redux/features/product/productApi";

interface CartItemCardProps {
  item: TCartProduct;
  onToggleSelect: (id: string) => void;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onDeleteItem: (id: string) => void;
  onSaveForLater: (id: string) => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onToggleSelect,
  onUpdateQuantity,
  onDeleteItem,
  onSaveForLater,
}) => {
  const dispatch = useAppDispatch();
  const itemId = item._id || item.variantId || item.id || "";
  const targetProductId = item.productId || item._id || item.id || "";

  // If item is missing title or thumbnail, fetch product details by targetProductId
  const needsFetch = !item.title || (!item.thumbnail && !item.image);
  const { data: productData } = useSingleProductQuery(targetProductId, {
    skip: !needsFetch || !targetProductId,
  });

  const fetchedProduct = productData?.data;

  useEffect(() => {
    if (fetchedProduct && needsFetch) {
      const fetchedImg =
        fetchedProduct.thumbnail ||
        (Array.isArray(fetchedProduct.images) ? fetchedProduct.images[0] : "") ||
        "";
      dispatch(
        updateCartItemDetails({
          _id: targetProductId,
          variantId: item.variantId,
          title: fetchedProduct.title,
          thumbnail: fetchedImg,
          image: fetchedImg,
          price: item.price || fetchedProduct.price || 0,
        })
      );
    }
  }, [fetchedProduct, needsFetch, dispatch, targetProductId, item.variantId, item.price]);

  const displayTitle = item.title || fetchedProduct?.title || "Product";
  const price = item.price || fetchedProduct?.price || 0;
  const originalPrice =
    item.originalPrice && item.originalPrice > price
      ? item.originalPrice
      : Number((price * 1.15).toFixed(2));

  const dollars = Math.floor(price);
  const cents = Math.round((price - dollars) * 100)
    .toString()
    .padStart(2, "0");

  const savings = originalPrice > price ? originalPrice - price : 0;
  const savingsPercent =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const imageUrl =
    item.thumbnail ||
    item.image ||
    item.variant?.thumbnail ||
    item.variant?.images?.[0] ||
    fetchedProduct?.thumbnail ||
    (Array.isArray(fetchedProduct?.images) ? fetchedProduct.images[0] : "") ||
    "https://m.media-amazon.com/images/I/81TsMF0Zr4L.jpg";

  const sellerName =
    item.seller?.vendor?.name ||
    item.vendor?.name ||
    item.sellerName ||
    item.brand ||
    "Dhaka Silicon Solutions";

  const fulfilledBy =
    item.seller?.fulfillmentBy || item.fulfilledBy || sellerName;

  const variantText =
    item.variantInfo ||
    (item.attributes && item.attributes.length > 0
      ? item.attributes.map((a) => `${a.type}: ${a.value}`).join(" | ")
      : item.variant?.attributes && item.variant.attributes.length > 0
        ? item.variant.attributes.map((a: any) => `${a.type}: ${a.value}`).join(" | ")
        : "");

  const inStock = item.inStock !== false;
  const maxQty = Math.max(item.maxQuantity || 10, 10);
  const isSelected = item.isSelected !== false;

  const productHref = `/products/${item.productId || item._id}`;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.origin + productHref);
    }
    toast.success(`Copied share link for "${displayTitle.slice(0, 24)}..."`, {
      position: "bottom-right",
      autoClose: 1800,
    });
  };

  return (
    <div
      className={`py-5 border-b border-slate-200 last:border-none transition-colors select-none ${
        !isSelected ? "opacity-60 bg-slate-50/40 rounded-xl p-3" : ""
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Checkbox */}
        <div className="pt-2 shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(itemId)}
            aria-label={`Select ${displayTitle}`}
            className="w-4 h-4 rounded-sm border-slate-300 accent-[#f08804] checked:bg-[#f08804] checked:border-[#f08804] cursor-pointer"
          />
        </div>

        {/* Product Image */}
        <Link
          href={productHref}
          className="relative w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-xl border border-slate-200 p-2 shrink-0 flex items-center justify-center overflow-hidden hover:opacity-95 transition-opacity"
        >
          <Image
            src={imageUrl}
            alt={displayTitle}
            fill
            sizes="(max-width: 640px) 96px, 128px"
            className="object-contain p-1"
          />
        </Link>

        {/* Details Column */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Top Row: Title + Desktop Price */}
          <div className="flex items-start justify-between gap-4">
            <Link
              href={productHref}
              className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-[#007185] cursor-pointer transition-colors"
            >
              {displayTitle}
            </Link>

            {/* Desktop Price */}
            <div className="hidden sm:block text-right shrink-0">
              <div className="flex items-start text-slate-900 font-extrabold justify-end">
                <span className="text-xs font-bold mt-1">$</span>
                <span className="text-2xl font-black">{dollars}</span>
                <span className="text-xs font-bold mt-1">{cents}</span>
              </div>

              {savings > 0 && (
                <div className="text-[11px] text-slate-500 space-x-1 mt-0.5">
                  <span className="line-through">${originalPrice.toFixed(2)}</span>
                  <span className="text-[#cc0c39] font-semibold">(-{savingsPercent}%)</span>
                </div>
              )}
            </div>
          </div>

          {/* Stock status */}
          <div className="text-xs font-bold">
            {inStock ? (
              <span className="text-[#007600]">{item.stockNote || "In Stock"}</span>
            ) : (
              <span className="text-rose-600">Currently unavailable</span>
            )}
          </div>

          {/* Free Shipping Badge */}
          <div className="text-[11px] text-slate-500">
            <span>Eligible for FREE Shipping</span>
          </div>

          {/* Variant specifications */}
          {variantText && (
            <div className="text-xs text-slate-600 font-medium">
              <span className="bg-[#f0f2f2] text-slate-700 px-2.5 py-0.5 rounded-md text-[11px] inline-block">
                {variantText}
              </span>
            </div>
          )}

          {/* Sold & Shipped by */}
          <div className="text-[11px] text-slate-500 flex items-center gap-1 flex-wrap">
            <span>Sold by:</span>
            <span className="text-[#007185] hover:underline cursor-pointer">
              {sellerName}
            </span>
            <span className="mx-0.5">•</span>
            <span>Fulfilled by</span>
            <span className="text-[#007185] hover:underline cursor-pointer">
              {fulfilledBy}
            </span>
          </div>

          {/* Mobile Price Display */}
          <div className="sm:hidden pt-1">
            <span className="text-base font-black text-slate-900">
              ${price.toFixed(2)}
            </span>
            {savings > 0 && (
              <span className="text-xs text-slate-400 line-through ml-2">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Action Row: Quantity Stepper, Delete, Save for Later, Share */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 pt-3">
            {/* Quantity +/- Stepper */}
            <div className="flex items-center bg-slate-100 rounded-lg border border-slate-300 overflow-hidden">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => onUpdateQuantity(itemId, Math.max((item.quantity || 1) - 1, 1))}
                disabled={(item.quantity || 1) <= 1}
                className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2.5 text-xs font-bold text-slate-800 select-none min-w-[24px] text-center">
                {item.quantity || 1}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => onUpdateQuantity(itemId, Math.min((item.quantity || 1) + 1, maxQty))}
                disabled={(item.quantity || 1) >= maxQty}
                className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <span className="text-slate-300 hidden sm:inline">|</span>

            {/* Delete button */}
            <button
              type="button"
              onClick={() => onDeleteItem(itemId)}
              className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-medium flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <span className="text-slate-300 hidden sm:inline">|</span>

            {/* Save for later button */}
            <button
              type="button"
              onClick={() => onSaveForLater(itemId)}
              className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-medium flex items-center gap-1 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save for later</span>
            </button>

            <span className="text-slate-300 hidden sm:inline">|</span>

            {/* Share button */}
            <button
              type="button"
              onClick={handleShare}
              className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-medium flex items-center gap-1 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
