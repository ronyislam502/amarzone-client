"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Heart,
  ShieldCheck,
  ShoppingCart,
  Star,
  Sparkles,
  Truck,
  Eye,
} from "lucide-react";
import { TInventory } from "@/types/inventory";
import { useAppDispatch } from "@/src/redux/hooks";
import { addToCart } from "@/redux/features/order/orderSlice";
import { toast } from "react-toastify";

interface VendorProductCardProps {
  item: TInventory;
  vendorName?: string;
  viewMode?: "grid" | "list";
}

export const VendorProductCard: React.FC<VendorProductCardProps> = ({
  item,
  vendorName = "Verified Merchant",
  viewMode = "grid",
}) => {
  const dispatch = useAppDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const variant = (item as any)?.variant;
  const product = variant?.product || {};
  const seller = item?.seller;

  const productId = product?._id || "";
  const variantId = variant?._id || "";
  const title = product?.title || variant?.asin || "Amarzone Product";
  const brand = product?.brand || "Amarzone";
  const category =
    typeof product?.category === "object" && product?.category !== null
      ? product.category.name
      : typeof product?.category === "string"
      ? product.category
      : "General";

  const price = seller?.price ?? product?.minPrice ?? 29.99;
  const originalPrice =
    product?.minPrice && product.minPrice > price
      ? product.minPrice
      : Number((price * 1.18).toFixed(2));
  const discountPercent =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const isStock = seller?.isStock !== false && (seller?.quantity ?? 1) > 0;
  const availableQty = seller?.quantity ?? 10;
  const shippingTime = seller?.shippingTime || 2;

  // Image resolution priority: variant thumbnail -> variant images -> product thumbnail
  const image =
    variant?.thumbnail ||
    (Array.isArray(variant?.images) && variant.images[0]) ||
    product?.thumbnail ||
    (Array.isArray(product?.images) && product.images[0]) ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600";

  // Attributes pill (e.g. Color: Black, Size: L)
  const attributes = Array.isArray(variant?.attributes) ? variant.attributes : [];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isStock) {
      toast.warning("This item is currently out of stock.");
      return;
    }

    setIsAdded(true);

    const vendorId =
      seller?.vendor?._id ||
      (typeof seller?.vendor === "string" ? seller.vendor : undefined) ||
      item?._id;

    dispatch(
      addToCart({
        ...product,
        _id: variantId || productId || item._id,
        variantId: variantId,
        variant: variant,
        productId: productId,
        title: title,
        thumbnail: image,
        image: image,
        brand: brand,
        category: category,
        price: price,
        originalPrice: originalPrice,
        quantity: 1,
        maxQuantity: Math.min(availableQty, 10),
        seller: seller,
        vendor: seller?.vendor || { name: vendorName, _id: vendorId },
        vendorId: vendorId,
        inStock: isStock,
        stockNote: isStock ? "In Stock" : "Out of Stock",
        shippingTime: shippingTime,
        attributes: attributes,
        isSelected: true,
      })
    );

    toast.success(`Added "${title.slice(0, 24)}..." to cart!`, {
      position: "bottom-right",
      autoClose: 1600,
    });

    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.info(!isWishlisted ? "Added to your wishlist!" : "Removed from wishlist", {
      position: "bottom-right",
      autoClose: 1200,
    });
  };

  const dollars = Math.floor(price);
  const cents = Math.round((price - dollars) * 100)
    .toString()
    .padStart(2, "0");

  const productUrl = productId ? `/products/${productId}` : "#";

  // -------------------------------------------------------------
  // LIST VIEW LAYOUT
  // -------------------------------------------------------------
  if (viewMode === "list") {
    return (
      <div className="group relative flex flex-col sm:flex-row gap-4 bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400/80 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-200 p-4 select-none">
        <Link href={productUrl} className="relative shrink-0 w-full sm:w-44 h-44 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center p-3">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, 180px"
          />
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </Link>

        <div className="flex flex-col flex-1 min-w-0 justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                    {brand}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] text-slate-400 font-medium">{category}</span>
                </div>
                <Link
                  href={productUrl}
                  className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors mt-1"
                >
                  {title}
                </Link>
              </div>

              <button
                type="button"
                onClick={handleToggleWishlist}
                className="shrink-0 w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400"
                  }`}
                />
              </button>
            </div>

            {attributes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {attributes.map((attr: any, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                  >
                    <span className="text-slate-400 mr-1">{attr.type}:</span>
                    {attr.value}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <Truck className="w-3.5 h-3.5" />
                {shippingTime <= 2 ? "Fast 2-Day Dispatch" : `Ships in ${shippingTime} days`}
              </span>
              <span className="text-slate-300">•</span>
              <span
                className={`font-semibold ${
                  isStock ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                {isStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
            <div>
              <div className="flex items-start text-slate-900 font-extrabold">
                <span className="text-xs mt-0.5 font-bold text-slate-600">$</span>
                <span className="text-2xl font-black leading-none">{dollars}</span>
                <span className="text-xs font-bold leading-none mt-0.5 text-slate-600">
                  .{cents}
                </span>
              </div>
              {originalPrice > price && (
                <div className="text-[11px] text-slate-400 line-through">
                  ${originalPrice.toFixed(2)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={productUrl}
                className="py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Details</span>
              </Link>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isStock}
                className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  isAdded
                    ? "bg-emerald-500 text-white"
                    : isStock
                    ? "bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 border border-[#fcd200]"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed border-transparent"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // GRID VIEW LAYOUT (Default)
  // -------------------------------------------------------------
  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400/80 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 overflow-hidden select-none">
      {/* Top badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {discountPercent > 0 && (
          <span className="inline-flex items-center gap-1 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
            -{discountPercent}% OFF
          </span>
        )}
        {item?.seller?.isBuyBoxWinner && (
          <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs">
            <Sparkles className="w-2.5 h-2.5" />
            Top Seller
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={handleToggleWishlist}
        aria-label="Save item"
        className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xs border border-slate-200 hover:bg-rose-50 transition-colors cursor-pointer"
      >
        <Heart
          className={`w-3.5 h-3.5 transition-colors ${
            isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400"
          }`}
        />
      </button>

      {/* Product Image */}
      <Link
        href={productUrl}
        className="relative w-full aspect-square bg-slate-50/70 overflow-hidden flex items-center justify-center p-3"
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>

      {/* Details Area */}
      <div className="flex flex-col flex-1 p-3.5 space-y-2">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider truncate">
            {brand}
          </span>
          <span className="text-[10px] text-slate-400 truncate">{category}</span>
        </div>

        <Link
          href={productUrl}
          className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors"
        >
          {title}
        </Link>

        {attributes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {attributes.slice(0, 2).map((attr: any, idx: number) => (
              <span
                key={idx}
                className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium truncate max-w-[120px]"
              >
                {attr.type}: {attr.value}
              </span>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* Pricing & Cart Action */}
        <div className="flex items-end justify-between gap-2 pt-1 border-t border-slate-100">
          <div>
            <div className="flex items-start text-slate-900 font-extrabold">
              <span className="text-xs mt-0.5 font-bold text-slate-600">$</span>
              <span className="text-xl font-black leading-none">{dollars}</span>
              <span className="text-xs font-bold leading-none mt-0.5 text-slate-600">
                .{cents}
              </span>
            </div>
            {originalPrice > price && (
              <div className="text-[10px] text-slate-400 line-through">
                ${originalPrice.toFixed(2)}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isStock}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isAdded
                ? "bg-emerald-500 text-white"
                : isStock
                ? "bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 border border-[#fcd200]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed border-transparent"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>

        {/* Shipping badge */}
        <div className="flex items-center justify-between text-[10px] pt-0.5">
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            {isStock ? "In Stock" : "Unavailable"}
          </span>
          <span className="text-slate-400">
            {shippingTime <= 2 ? "2-Day Delivery" : `${shippingTime}d Delivery`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VendorProductCard;
