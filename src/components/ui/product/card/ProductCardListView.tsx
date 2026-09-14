import React from "react";
import Link from "next/link";
import ProductCardRankBadge from "./ProductCardRankBadge";
import ProductCardThumbnail from "./ProductCardThumbnail";
import ProductCardRating from "./ProductCardRating";
import ProductCardPrice from "./ProductCardPrice";
import ProductCardPrimeBadge from "./ProductCardPrimeBadge";
import ProductCardAddToCart from "./ProductCardAddToCart";
import { ExtractedProductCardData } from "./types";

export interface ProductCardListViewProps {
  data: ExtractedProductCardData;
  rank?: number;
  onAddToCart?: () => void;
}

export default function ProductCardListView({
  data,
  rank,
  onAddToCart,
}: ProductCardListViewProps) {
  const { title, thumb, price, originalPrice, discountPct, rating, reviewCount, brand, productHref } = data;

  return (
    <div className="group flex gap-4 bg-base-100 border border-base-300 hover:border-base-content/30 hover:shadow-md transition-all duration-200 p-4 rounded-sm">
      {/* Thumbnail */}
      <ProductCardThumbnail
        thumb={thumb}
        title={title}
        productHref={productHref}
        viewMode="list"
      />

      {/* Details */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <Link href={productHref}>
          <h3 className="text-sm font-semibold text-base-content hover:text-[#c45500] hover:underline line-clamp-2 leading-snug">
            {title}
          </h3>
        </Link>

        {brand && (
          <p className="text-[12px] text-base-content/60">by {brand}</p>
        )}

        <ProductCardRating rating={rating} count={reviewCount} />

        {/* Price */}
        <ProductCardPrice
          price={price}
          originalPrice={originalPrice}
          discountPct={discountPct}
          viewMode="list"
        />

        <ProductCardPrimeBadge showDelivery />

        <p className="text-[12px] text-emerald-700 font-bold">In Stock</p>

        <ProductCardAddToCart viewMode="list" onClick={onAddToCart} />
      </div>

      {/* Rank badge */}
      {rank !== undefined && rank <= 3 && (
        <ProductCardRankBadge rank={rank} viewMode="list" />
      )}
    </div>
  );
}
