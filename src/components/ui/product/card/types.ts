export type ProductCardViewMode = "grid" | "list";

export interface ProductCardProps {
  product: any;
  /** 1-based display rank (shows "#1 Best Seller" badge on rank 1) */
  rank?: number;
  /** "grid" (default) or "list" */
  viewMode?: ProductCardViewMode;
  /** Override the href; defaults to /product/[_id] */
  href?: string;
  onAddToCart?: () => void;
}

export interface ExtractedProductCardData {
  thumb: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  brand: string;
  originalPrice: string;
  discountPct: number;
  productHref: string;
}
