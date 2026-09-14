import React from "react";
import Link from "next/link";
import ProductCardRankBadge from "./ProductCardRankBadge";
import ProductCardThumbnail from "./ProductCardThumbnail";
import ProductCardRating from "./ProductCardRating";
import ProductCardPrice from "./ProductCardPrice";
import ProductCardPrimeBadge from "./ProductCardPrimeBadge";
import ProductCardAddToCart from "./ProductCardAddToCart";
import { ExtractedProductCardData } from "./types";

export interface ProductCardGridViewProps {
  data: ExtractedProductCardData;
  rank?: number;
  onAddToCart?: () => void;
}

export default function ProductCardGridView({
  data,
  rank,
  onAddToCart,
}: ProductCardGridViewProps) {
  const { title, thumb, price, originalPrice, discountPct, rating, productHref } = data;

  return (
    <div className="group relative flex flex-col h-full bg-base-100 border border-base-300 hover:border-base-content/30 hover:shadow-[0_2px_10px_rgba(0,0,0,0.15)] transition-all duration-200 overflow-hidden rounded-sm">
      {/* Rank badge */}
      {rank !== undefined && <ProductCardRankBadge rank={rank} viewMode="grid" />}

      {/* Thumbnail */}
      <ProductCardThumbnail
        thumb={thumb}
        title={title}
        productHref={productHref}
        viewMode="grid"
      />

      {/* Details */}
      <div className="flex flex-col flex-1 px-2 pb-2.5 pt-1.5 border-t border-base-300 space-y-1">
        <Link href={productHref}>
          <p className="text-[11px] font-medium text-base-content line-clamp-2 leading-tight hover:text-[#c45500] hover:underline">
            {title}
          </p>
        </Link>

        <ProductCardRating rating={rating} />

        {/* Price */}
        <ProductCardPrice
          price={price}
          originalPrice={originalPrice}
          discountPct={discountPct}
          viewMode="grid"
        />

        <ProductCardPrimeBadge />

        {/* Add to cart */}
        <ProductCardAddToCart viewMode="grid" onClick={onAddToCart} />
      </div>
    </div>
  );
}
