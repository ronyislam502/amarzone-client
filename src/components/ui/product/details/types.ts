import { TProduct as TParentProduct, TVariant } from "@/types/product";

export interface ProductToastProps {
  message: string | null;
}

export interface ProductBrandBannerProps {
  brand?: string;
  categoryName?: string;
}

export interface ProductBreadcrumbsProps {
  departmentName?: string;
  categoryName?: string;
  productTitle: string;
}

export interface ProductGalleryProps {
  allImages: string[];
  selectedImage: string;
  setSelectedImage: (img: string) => void;
  productTitle: string;
  isPrivateLevel?: boolean;
}

export interface ProductInfoTitleProps {
  title: string;
  brand?: string;
  categoryName?: string;
}

export interface ProductPriceSectionProps {
  dollars: string;
  cents: string;
  currentPrice: number;
  showReturnsInfo: boolean;
  setShowReturnsInfo: (show: boolean) => void;
  totalSellers?: number;
  onOpenVendorsDrawer: () => void;
}

export interface ProductVariantSwatchesProps {
  variants?: TVariant[];
  selectedVariant: TVariant | null;
  onSelectVariant: (variant: TVariant) => void;
  selectedImage: string;
  currentPrice: number;
  activeColorAttr: string;
}

export interface ProductFeaturesListProps {
  features?: string[];
  description?: string;
}

export interface ProductDescriptionBoxProps {
  description?: string;
}

export interface ProductOrderSuccessProps {
  orderNo: string;
  totalPrice: number;
  onReset: () => void;
}

export interface ProductOtherSellersCardProps {
  totalSellers?: number;
  currentPrice: number;
  onOpenVendorsDrawer: () => void;
}
