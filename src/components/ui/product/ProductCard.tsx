"use client";

import React from "react";
import {
  ProductCardProps,
  ProductCardViewMode,
} from "./card/types";
import { extractProductCardData } from "./card/utils";
import ProductCardGridView from "./card/ProductCardGridView";
import ProductCardListView from "./card/ProductCardListView";

export type { ProductCardProps, ProductCardViewMode };

export {
  ProductCardRankBadge,
  ProductCardThumbnail,
  ProductCardRating,
  ProductCardPrice,
  ProductCardPrimeBadge,
  ProductCardAddToCart,
  ProductCardGridView,
  ProductCardListView,
} from "./card";

export default function ProductCard({
  product,
  rank,
  viewMode = "grid",
  href,
  onAddToCart,
}: ProductCardProps) {
  const data = extractProductCardData(product, href);

  if (viewMode === "list") {
    return (
      <ProductCardListView
        data={data}
        rank={rank}
        onAddToCart={onAddToCart}
      />
    );
  }

  return (
    <ProductCardGridView
      data={data}
      rank={rank}
      onAddToCart={onAddToCart}
    />
  );
}
