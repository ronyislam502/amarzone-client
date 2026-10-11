"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Star,
  Check,
  BadgePercent,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { TProduct, TVariant } from "@/types/product";
import {
  extractProductPriceInfo,
  getProductThumbnail,
  formatWalmartPrice,
} from "@/components/ui/home/homeUtils";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/src/redux/hooks";
import { addToCart } from "@/redux/features/order/orderSlice";

export interface ProductCardProps {
  /** Product data item */
  product: TProduct;

  /** Specific variant to display as an individual product card */
  variant?: TVariant;

  /** Layout mode: "grid" (default) or "list" */
  viewMode?: "grid" | "list";

  /** Optional custom badge (e.g. "Rollback", "Best Seller", "New") */
  badgeLabel?: string;

  /** Highlight as rollback/deal */
  isRollback?: boolean;

  /** Optional custom class name applied to container */
  className?: string;

  /** Show verified seller / free delivery badge (defaults to true) */
  showFreeDelivery?: boolean;

  /** Show product description in list view (defaults to true) */
  showDescription?: boolean;

  /** Show star rating (defaults to true) */
  showRating?: boolean;

  /** Optional callback for custom add-to-cart behavior */
  onAddToCart?: (product: TProduct, e: React.MouseEvent) => void;

  /** Optional callback when wishlist toggle is triggered */
  onToggleWishlist?: (
    product: TProduct,
    isWishlisted: boolean,
    e: React.MouseEvent
  ) => void;
}

/**
 * Reusable Product Card Component
 * Supports both "grid" and "list" view modes, complete with
 * variant-level image rendering, stock handling, wishlist toggle, discount badges,
 * and direct Redux cart dispatch with the specific selected variant.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant,
  viewMode = "grid",
  badgeLabel,
  isRollback = false,
  className = "",
  showFreeDelivery = true,
  showDescription = true,
  showRating = true,
  onAddToCart,
  onToggleWishlist,
}) => {
  const dispatch = useAppDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Active target variant for this card
  const targetVariant = variant || product.variants?.[0];

  // Variant's own image (prioritizes variant's image gallery, then thumbnail, then parent product fallback)
  const thumbnail =
    (targetVariant?.images && Array.isArray(targetVariant.images) && targetVariant.images[0]) ||
    targetVariant?.thumbnail ||
    getProductThumbnail(product);

  // Link directly to the product details page with this variant selected
  const productHref = targetVariant?._id
    ? `/products/${product._id}?variantId=${targetVariant._id}`
    : `/products/${product._id}`;

  const priceInfo = extractProductPriceInfo(product);

  // 1. Extract in-stock sellers from this specific variant's inventory
  const variantInventories = (targetVariant as any)?.inventory;
  const sellers: any[] = Array.isArray(variantInventories)
    ? variantInventories.filter(
        (inv: any) => inv?.seller && inv.seller.isStock !== false
      )
    : [];

  // 2. Buy Box winner for this specific variant (matches [id]/page.tsx Buy Box selection)
  const buyBoxWinner =
    sellers.find((l: any) => l.seller?.isBuyBoxWinner) ||
    (sellers.length > 0
      ? [...sellers].sort(
          (a: any, b: any) => (a.seller?.price ?? 0) - (b.seller?.price ?? 0)
        )[0]
      : null);

  // 3. Variant's own specific price
  const variantPrice: number =
    buyBoxWinner?.seller?.price ??
    (sellers[0]?.seller?.price ??
      (targetVariant as any)?.price ??
      product?.minPrice ??
      24.99);

  const targetSeller = buyBoxWinner?.seller || sellers[0]?.seller;
  const isTargetInStock =
    sellers.length > 0
      ? sellers.some((s: any) => (s.seller?.quantity ?? 0) > 0)
      : priceInfo.inStock;

  const originalPrice = Number((variantPrice * 1.22).toFixed(2));
  const savings = Number((originalPrice - variantPrice).toFixed(2));
  const discountPercent = Math.round(
    ((originalPrice - variantPrice) / originalPrice) * 100
  );

  const { dollars, cents } = formatWalmartPrice(variantPrice);
  const rating = product.averageRating ?? 4.2;
  const reviews = product.reviewCount ?? 0;

  const categoryName =
    typeof product.category === "object" && product.category !== null
      ? product.category.name
      : typeof product.category === "string"
        ? product.category
        : "";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product, e);
      return;
    }

    setAddedToCart(true);

    const variantId = targetVariant?._id || product._id;
    const inv = (targetVariant as any)?.inventory?.[0];
    const seller = targetSeller || inv?.seller;
    const vendor = seller?.vendor || product.author;
    const vendorId =
      typeof vendor === "object" && vendor !== null
        ? (vendor as { _id?: string; id?: string })._id ||
          (vendor as { _id?: string; id?: string }).id
        : vendor;

    dispatch(
      addToCart({
        ...product,
        _id: variantId,
        variantId,
        variant: targetVariant,
        productId: product._id,
        title: product.title,
        thumbnail,
        image: thumbnail,
        brand: product.brand,
        category: categoryName || "General",
        price: variantPrice,
        originalPrice,
        quantity: 1,
        maxQuantity: seller?.quantity || 10,
        seller,
        vendor,
        vendorId,
        inStock: isTargetInStock,
        stockNote: isTargetInStock ? "In Stock" : "Out of Stock",
        shippingTime: (seller as any)?.shippingTime || 2,
        attributes: targetVariant?.attributes || [],
        isSelected: true,
      })
    );

    toast.success(`Added "${product.title.slice(0, 24)}..." to cart!`, {
      position: "bottom-right",
      autoClose: 1600,
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);

    if (onToggleWishlist) {
      onToggleWishlist(product, nextState, e);
    } else {
      toast.success(
        nextState ? "Added to your wishlist!" : "Removed from wishlist",
        {
          position: "bottom-right",
          autoClose: 1200,
        }
      );
    }
  };

  // Determine active badge: custom badge > rollback > discount percentage
  const displayBadge =
    badgeLabel ||
    (isRollback ? "Rollback" : product.isBestSeller ? "Best Seller" : null);

  // ──────────────────────────────────────────────────────────────────────────
  // LIST VIEW LAYOUT
  // ──────────────────────────────────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <Link
        href={productHref}
        className={`group flex gap-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 p-4 select-none ${className}`}
      >
        {/* Image & Badges */}
        <div className="relative shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-xl bg-slate-50 overflow-hidden">
          <Image
            src={thumbnail}
            alt={product.title}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            sizes="160px"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400";
            }}
          />
          {displayBadge ? (
            <div className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
              {displayBadge}
            </div>
          ) : discountPercent > 0 ? (
            <div className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
              -{discountPercent}%
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold text-violet-600 uppercase tracking-wider truncate">
                {product.brand || "Amarzone"}
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-violet-700 transition-colors mt-0.5">
                {product.title}
              </h3>
              {categoryName && (
                <span className="text-[10px] text-slate-400">{categoryName}</span>
              )}

              {/* Variant Attributes Chips */}
              {targetVariant?.attributes && targetVariant.attributes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {targetVariant.attributes.map((attr, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200"
                    >
                      <span className="text-slate-400 mr-0.5 font-normal">{attr.type}:</span>
                      <span>{attr.value}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={handleToggleWishlist}
              aria-label="Save item"
              className="shrink-0 w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400"
                }`}
              />
            </button>
          </div>

          {/* Rating */}
          {showRating && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3 h-3 ${
                      s <= Math.round(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-100 text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">
                {rating.toFixed(1)}{" "}
                {reviews > 0 && `(${reviews.toLocaleString()} reviews)`}
              </span>
            </div>
          )}

          {/* Description */}
          {showDescription && product.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed hidden sm:block">
              {product.description}
            </p>
          )}

          {/* Bottom Bar: Price & Add to Cart */}
          <div className="flex items-center justify-between mt-auto pt-3 gap-3">
            <div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xs text-slate-400 font-semibold">$</span>
                <span className="text-2xl font-black text-slate-900 leading-none">
                  {dollars}
                </span>
                <span className="text-xs font-black text-slate-900 leading-none self-start mt-0.5">
                  .{cents}
                </span>
              </div>
              {savings > 0 && (
                <div className="text-[11px] text-slate-400">
                  <span className="line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                  <span className="text-emerald-600 font-bold ml-1.5">
                    Save ${savings.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {showFreeDelivery && (
                <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 hidden md:flex">
                  <ShieldCheck className="w-3 h-3" />
                  Free Delivery
                </div>
              )}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                  addedToCart
                    ? "bg-emerald-500 text-white"
                    : "bg-amber-400 hover:bg-amber-300 text-slate-900"
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
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
      </Link>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // GRID VIEW LAYOUT (Default)
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <Link
      href={productHref}
      className={`group relative flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 overflow-hidden select-none ${className}`}
    >
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {displayBadge ? (
          <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
            <Sparkles className="w-3 h-3" />
            {displayBadge}
          </span>
        ) : discountPercent > 0 ? (
          <div className="flex items-center gap-1 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
            <BadgePercent className="w-3 h-3" />
            {discountPercent}% OFF
          </div>
        ) : null}
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={handleToggleWishlist}
        aria-label="Save item"
        className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm border border-slate-200 hover:bg-rose-50 transition-colors cursor-pointer"
      >
        <Heart
          className={`w-3.5 h-3.5 transition-colors ${
            isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400"
          }`}
        />
      </button>

      {/* Product Image (Variant-Specific) */}
      <div className="relative w-full aspect-square bg-slate-50 overflow-hidden">
        <Image
          src={thumbnail}
          alt={product.title}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400";
          }}
        />
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-3.5 space-y-2">
        {/* Brand & Category */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider truncate">
            {product.brand || "Amarzone"}
          </span>
          {categoryName && (
            <span className="text-[10px] text-slate-400 truncate">
              {categoryName}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-violet-700 transition-colors">
          {product.title}
        </h3>

        {/* Variant Attributes Badges */}
        {targetVariant?.attributes && targetVariant.attributes.length > 0 && (
          <div className="flex flex-wrap gap-1 items-center pt-0.5">
            {targetVariant.attributes.map((attr, idx) => (
              <span
                key={idx}
                className="inline-flex items-center text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200/80"
              >
                <span className="text-slate-400 mr-0.5 font-normal">{attr.type}:</span>
                <span>{attr.value}</span>
              </span>
            ))}
          </div>
        )}

        {/* Rating */}
        {showRating && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${
                    s <= Math.round(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-slate-100 text-slate-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">
              {rating.toFixed(1)}
              {reviews > 0 && ` (${reviews.toLocaleString()})`}
            </span>
          </div>
        )}

        <div className="flex-1" />

        {/* Price & Add to Cart */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xs text-slate-400 font-semibold">$</span>
              <span className="text-xl font-black text-slate-900 leading-none">
                {dollars}
              </span>
              <span className="text-xs font-black text-slate-900 leading-none self-start mt-0.5">
                .{cents}
              </span>
            </div>
            {savings > 0 && (
              <div className="text-[10px] text-slate-400 line-through">
                ${originalPrice.toFixed(2)}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow-sm ${
              addedToCart
                ? "bg-emerald-500 text-white"
                : "bg-amber-400 hover:bg-amber-300 text-slate-900"
            }`}
          >
            {addedToCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
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

        {/* Delivery / Verification Badge */}
        {showFreeDelivery && (
          <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
            <ShieldCheck className="w-3 h-3" />
            <span>Free Delivery · Verified Seller</span>
          </div>
        )}
      </div>
    </Link>
  );
};

/**
 * Convenience wrapper for grid view mode
 */
export const ProductGridCard: React.FC<Omit<ProductCardProps, "viewMode">> = (
  props
) => <ProductCard {...props} viewMode="grid" />;

/**
 * Convenience wrapper for list view mode
 */
export const ProductListCard: React.FC<Omit<ProductCardProps, "viewMode">> = (
  props
) => <ProductCard {...props} viewMode="list" />;

export default ProductCard;
