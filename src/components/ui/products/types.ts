import { TCategory } from "@/types/category";

export type TProductsCatalogMode = "all" | "department" | "category";

export interface ReusableProductsPageProps {
  /** Mode: "all" (default) | "department" | "category" */
  mode?: TProductsCatalogMode;

  /** Department slug from route params (e.g. "electronics" or "pet-supplies") */
  departmentSlug?: string;

  /** Category slug from route params (e.g. "cat-food" or "laptops") */
  categorySlug?: string;

  /** Direct department ID override */
  departmentId?: string;

  /** Direct category ID override */
  categoryId?: string;

  /** Optional title override */
  title?: string;

  /** Optional subtitle override */
  subtitle?: string;

  /** Optional badge override */
  badge?: string;

  /** Default items limit per page (default: 24) */
  limit?: number;

  /** Initial sort option */
  defaultSort?: string;

  /** Optional additional CSS classes */
  className?: string;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface PricePreset {
  label: string;
  min?: number;
  max?: number;
}

export const SORT_OPTIONS: SortOption[] = [
  { label: "Featured", value: "" },
  { label: "Price: Low to High", value: "minPrice" },
  { label: "Price: High to Low", value: "-minPrice" },
  { label: "Newest Arrivals", value: "-createdAt" },
  { label: "Avg. Rating", value: "-averageRating" },
  { label: "Best Sellers", value: "-reviewCount" },
];

export const RATING_OPTIONS: number[] = [4, 3, 2, 1];

export const PRICE_PRESETS: PricePreset[] = [
  { label: "Under $25", max: 25 },
  { label: "$25 – $50", min: 25, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100 – $200", min: 100, max: 200 },
  { label: "$200+", min: 200 },
];

export interface ProductFiltersState {
  searchTerm: string;
  selectedCategory: string;
  selectedBrand: string;
  minPrice: number | "";
  maxPrice: number | "";
  minRating: number | "";
  inStockOnly: boolean;
  sortBy: string;
  currentPage: number;
  viewMode: "grid" | "list";
}

export interface ProductFilterSidebarProps {
  mode: TProductsCatalogMode;
  categories: TCategory[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  minPrice: number | "";
  maxPrice: number | "";
  onChangeMinPrice: (val: number | "") => void;
  onChangeMaxPrice: (val: number | "") => void;
  minRating: number | "";
  onSelectMinRating: (val: number | "") => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  availableBrands: string[];
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  activeFilterCount: number;
  onClearAll: () => void;
  className?: string;
}
