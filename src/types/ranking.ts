export interface TRankingScope {
  rank: number;
  formattedRank: string;
  departmentId?: string;
  departmentName?: string;
  categoryId?: string;
  categoryName?: string;
  scope?: string;
}

export interface TVariantRanking {
  variantId: string;
  asin: string;
  sku: string;
  isBuyBoxEligible?: boolean;
  product?: {
    productId?: string;
    title?: string;
    brand?: string;
    thumbnail?: string;
    isBestSeller?: boolean;
  };
  globalRank: number;
  formattedGlobalRank: string;
  departmentRank: number;
  departmentName: string;
  formattedDepartmentRank: string;
  categoryRank: number;
  categoryName: string;
  formattedCategoryRank: string;
  globalRanking?: TRankingScope;
  departmentRanking?: TRankingScope;
  categoryRanking?: TRankingScope;
  isBestSeller?: boolean;
  salesScore?: number;
  totalSalesCount?: number;
  recentSalesCount?: number;
  calculatedAt?: string;
}
