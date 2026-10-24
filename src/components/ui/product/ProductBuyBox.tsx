"use client";

import React, { useState } from "react";
import {
  MapPin,
  Check,
  ShoppingCart,
  Zap,
  Lock,
  ChevronDown,
  Award,
} from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

interface ProductBuyBoxProps {
  price?: number;
  currency?: string;
  inStock?: boolean;
  vendorName?: string;
  vendorId?: string;
  fulfillmentBy?: string;
  shippingDays?: number;
  onAddToCart?: (quantity: number) => void;
  onBuyNow?: (quantity: number) => void;
  buyBoxListing?: any;
  totalSellers?: number;
  product?: any;
  selectedVariant?: any;
  isLoadingInventory?: boolean;
}

export const ProductBuyBox: React.FC<ProductBuyBoxProps> = ({
  price = 0,
  currency = "$",
  inStock = true,
  vendorName,
  vendorId,
  fulfillmentBy,
  onAddToCart,
  onBuyNow,
  buyBoxListing,
}) => {
  const effectivePrice = buyBoxListing?.seller?.price || buyBoxListing?.price || price || 0;
  const effectiveVendor =
    (typeof buyBoxListing?.seller?.vendor === "object"
      ? buyBoxListing?.seller?.vendor?.name
      : buyBoxListing?.seller?.fulfillmentBy) ||
    vendorName ||
    "Amarzone Seller";

  const effectiveVendorId =
    (typeof buyBoxListing?.seller?.vendor === "object"
      ? buyBoxListing?.seller?.vendor?._id
      : typeof buyBoxListing?.seller?.vendor === "string"
        ? buyBoxListing?.seller?.vendor
        : undefined) ||
    buyBoxListing?.seller?.vendorId ||
    buyBoxListing?.seller?.vendorid ||
    buyBoxListing?.vendorId ||
    vendorId;

  const isItemInStock =
    inStock &&
    Boolean(
      !buyBoxListing ||
      (buyBoxListing?.seller?.isStock && (buyBoxListing?.seller?.quantity ?? 0) > 0)
    );

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const formattedPrice =
    typeof effectivePrice === "number" && !isNaN(effectivePrice) && effectivePrice > 0
      ? effectivePrice.toFixed(2)
      : null;

  // Calculate dynamic delivery date based on shippingTime
  const shippingDays = buyBoxListing?.seller?.shippingTime || 2;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + shippingDays);
  const deliveryDateFormatted = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const effectiveFulfillment =
    buyBoxListing?.seller?.fulfillmentBy || fulfillmentBy || "Amarzone";

  const handleAddToCartClick = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      if (onAddToCart) {
        onAddToCart(quantity);
      } else {
        toast.success(`Added ${quantity} item(s) to Cart!`, {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    }, 250);
  };

  const handleBuyNowClick = () => {
    if (onBuyNow) {
      onBuyNow(quantity);
    } else {
      toast.info("Proceeding directly to checkout...", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3.5 select-none">
      {/* Buy Box Winner Badge */}
      {buyBoxListing && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80 w-fit">
          <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Featured Offer (Buy Box Winner)</span>
        </div>
      )}

      {/* Price Header */}
      {formattedPrice ? (
        <div className="text-2xl sm:text-[26px] font-bold text-[#0f1111] leading-tight">
          <span>{currency} </span>
          <span>{formattedPrice}</span>
        </div>
      ) : (
        <div className="text-base font-bold text-slate-800">
          Price available from sellers below
        </div>
      )}

      {/* Delivery Promise */}
      <div className="text-xs text-slate-700 leading-relaxed">
        <span>FREE delivery </span>
        <span className="font-bold text-[#0f1111]">{deliveryDateFormatted}</span>
        <span> on orders shipped by {effectiveFulfillment}.</span>
      </div>

      {/* Location Selector */}
      <div className="flex items-center gap-1.5 text-xs text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
        <MapPin className="w-3.5 h-3.5 text-[#007185] shrink-0" />
        <span>Deliver to your default location</span>
      </div>

      {/* Stock Status */}
      <div className={`flex items-center gap-1.5 text-base font-bold ${isItemInStock ? "text-[#007600]" : "text-amber-700"}`}>
        <Check className="w-4 h-4 stroke-[3]" />
        <span>{isItemInStock ? "In Stock" : "Currently Unavailable"}</span>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-2 pt-0.5">
        <label htmlFor="quantity-select" className="text-xs text-slate-700">
          Quantity:
        </label>
        <div className="relative inline-block">
          <select
            id="quantity-select"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="appearance-none bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 py-1 pl-2.5 pr-6 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#e77600]"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-2 pt-1">
        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCartClick}
          disabled={!isItemInStock || isAdding}
          className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-[#0f1111] font-medium text-xs sm:text-sm py-2 sm:py-2.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4 fill-slate-900/10 text-slate-900" />
          <span>Add to Cart</span>
        </button>

        {/* Buy Now */}
        <button
          type="button"
          onClick={handleBuyNowClick}
          disabled={!isItemInStock}
          className="w-full bg-[#ffa41c] hover:bg-[#fa8900] active:bg-[#e57b00] text-[#0f1111] font-medium text-xs sm:text-sm py-2 sm:py-2.5 px-4 rounded-full flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4 fill-slate-900 text-slate-900" />
          <span>Buy Now</span>
        </button>
      </div>

      {/* Secure Transaction Note */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-0.5">
        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>Secure transaction</span>
      </div>

      {/* Fulfillment Key-Value Table */}
      <div className="grid grid-cols-[76px_1fr] text-xs gap-y-1.5 pt-2 border-t border-slate-100">
        <span className="text-slate-500">Ships from</span>
        <span className="text-slate-800 font-normal truncate">{effectiveVendor}</span>

        <span className="text-slate-500">Sold by</span>
        <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer truncate font-medium">
          {effectiveVendorId ? (
            <Link href={`/vendors/${effectiveVendorId}`}>{effectiveVendor}</Link>
          ) : vendorId ? (
            <Link href={`/vendors/${vendorId}`}>{effectiveVendor}</Link>
          ) : (
            <span>{effectiveVendor}</span>
          )}
        </span>

        <span className="text-slate-500">Returns</span>
        <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
          30-day refund/replacement
        </span>

        <span className="text-slate-500">Payment</span>
        <span className="text-slate-700">Secure credit/debit</span>
      </div>
    </div >
  );
};

export default ProductBuyBox;
