"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  LayoutGrid,
  LayoutList,
  Star,
  Heart,
  ShoppingCart,
  ChevronDown,
  X,
  Sparkles,
  Package,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Check,
  Tag,
  Zap,
  ShieldCheck,
  RefreshCw,
  BadgePercent,
  Search,
} from "lucide-react";
import { useAllProductsQuery } from "@/redux/features/product/productApi";
import { useAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { TProduct } from "@/types/product";
import { TCategory } from "@/types/category";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/src/redux/hooks";
import { addToCart } from "@/redux/features/order/orderSlice";
import {
  extractProductPriceInfo,
  getProductThumbnail,
} from "@/components/ui/home/homeUtils";

const LIMIT = 24;

const SORT_OPTIONS = [
  { label: "Featured", value: "" },
  { label: "Price: Low to High", value: "minPrice" },
  { label: "Price: High to Low", value: "-minPrice" },
  { label: "Newest Arrivals", value: "-createdAt" },
  { label: "Avg. Rating", value: "-averageRating" },
  { label: "Best Sellers", value: "-reviewCount" },
];

const RATING_OPTIONS = [4, 3, 2, 1];

const PRICE_PRESETS = [
  { label: "Under $25", max: 25 },
  { label: "$25 – $50", min: 25, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100 – $200", min: 100, max: 200 },
  { label: "$200+", min: 200 },
];

// ─── Product Grid Card ───────────────────────────────────────────────────────
const ProductGridCard: React.FC<{ product: TProduct }> = ({ product }) => {
  const dispatch = useAppDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const priceInfo = extractProductPriceInfo(product);
  const thumbnail = getProductThumbnail(product);
  const rating = product.averageRating ?? 4.2;
  const reviews = product.reviewCount ?? 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedToCart(true);
    const firstVariant = product.variants?.[0];
    const variantId = firstVariant?._id || product._id;
    const inv = (firstVariant as any)?.inventory?.[0];
    const seller = inv?.seller;
    const vendor = seller?.vendor || product.author;
    const vendorId =
      typeof vendor === "object"
        ? (vendor as any)?._id || (vendor as any)?.id
        : vendor;

    dispatch(
      addToCart({
        ...product,
        _id: variantId,
        variantId,
        variant: firstVariant,
        productId: product._id,
        title: product.title,
        thumbnail: firstVariant?.thumbnail || firstVariant?.images?.[0] || thumbnail,
        image: firstVariant?.thumbnail || firstVariant?.images?.[0] || thumbnail,
        brand: product.brand,
        category: (product.category as any)?.name || "General",
        price: priceInfo.price,
        originalPrice: priceInfo.originalPrice,
        quantity: 1,
        maxQuantity: seller?.quantity || 10,
        seller,
        vendor,
        vendorId,
        inStock: priceInfo.inStock,
        stockNote: priceInfo.inStock ? "In Stock" : "Out of Stock",
      } as any)
    );

    toast.success("Added to cart!", { position: "bottom-right", autoClose: 1500 });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <Link
      href={`/products/${product._id}`}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 overflow-hidden"
    >
      {/* Discount badge */}
      {priceInfo.discountPercent > 0 && (
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
          <BadgePercent className="w-3 h-3" />
          {priceInfo.discountPercent}% OFF
        </div>
      )}

      {/* Wishlist */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsWishlisted((v) => !v);
          toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!", {
            position: "bottom-right",
            autoClose: 1200,
          });
        }}
        className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm border border-slate-200 hover:bg-rose-50 transition-colors cursor-pointer"
      >
        <Heart
          className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400"
            }`}
        />
      </button>

      {/* Image */}
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

      {/* Content */}
      <div className="flex flex-col flex-1 p-3.5 space-y-2">
        {/* Brand + Category */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider truncate">
            {product.brand}
          </span>
          <span className="text-[10px] text-slate-400 truncate">
            {(product.category as any)?.name || ""}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-violet-700 transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3 h-3 ${s <= Math.round(rating)
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

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-slate-400 font-semibold">$</span>
              <span className="text-xl font-black text-slate-900 leading-none">
                {Math.floor(priceInfo.price)}
              </span>
              <span className="text-xs font-black text-slate-900 leading-none self-start mt-0.5">
                {(priceInfo.price % 1).toFixed(2).slice(1)}
              </span>
            </div>
            {priceInfo.savings > 0 && (
              <div className="text-[10px] text-slate-400 line-through">
                ${priceInfo.originalPrice.toFixed(2)}
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow-sm ${addedToCart
              ? "bg-emerald-500 text-white"
              : "bg-amber-400 hover:bg-amber-300 text-slate-900"
              }`}
          >
            {addedToCart ? (
              <><Check className="w-3.5 h-3.5" /> Added</>
            ) : (
              <><ShoppingCart className="w-3.5 h-3.5" /> Add</>
            )}
          </button>
        </div>

        {/* In-stock badge */}
        <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
          <ShieldCheck className="w-3 h-3" />
          <span>Free Delivery · Verified Seller</span>
        </div>
      </div>
    </Link>
  );
};

// ─── Product List Card ───────────────────────────────────────────────────────
const ProductListCard: React.FC<{ product: TProduct }> = ({ product }) => {
  const dispatch = useAppDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const priceInfo = extractProductPriceInfo(product);
  const thumbnail = getProductThumbnail(product);
  const rating = product.averageRating ?? 4.2;
  const reviews = product.reviewCount ?? 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedToCart(true);
    const firstVariant = product.variants?.[0];
    const variantId = firstVariant?._id || product._id;
    const inv = (firstVariant as any)?.inventory?.[0];
    const seller = inv?.seller;
    const vendor = seller?.vendor || product.author;
    const vendorId =
      typeof vendor === "object"
        ? (vendor as any)?._id || (vendor as any)?.id
        : vendor;

    dispatch(
      addToCart({
        ...product,
        _id: variantId,
        variantId,
        variant: firstVariant,
        productId: product._id,
        title: product.title,
        thumbnail: firstVariant?.thumbnail || firstVariant?.images?.[0] || thumbnail,
        image: firstVariant?.thumbnail || firstVariant?.images?.[0] || thumbnail,
        brand: product.brand,
        category: (product.category as any)?.name || "General",
        price: priceInfo.price,
        originalPrice: priceInfo.originalPrice,
        quantity: 1,
        maxQuantity: seller?.quantity || 10,
        seller,
        vendor,
        vendorId,
        inStock: priceInfo.inStock,
        stockNote: "In Stock",
      } as any)
    );

    toast.success("Added to cart!", { position: "bottom-right", autoClose: 1500 });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <Link
      href={`/products/${product._id}`}
      className="group flex gap-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 p-4"
    >
      {/* Image */}
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
        {priceInfo.discountPercent > 0 && (
          <div className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
            -{priceInfo.discountPercent}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">
              {product.brand}
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-violet-700 transition-colors mt-0.5">
              {product.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted((v) => !v);
            }}
            className="shrink-0 w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Heart
              className={`w-3.5 h-3.5 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400"
                }`}
            />
          </button>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3 h-3 ${s <= Math.round(rating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-100 text-slate-300"
                  }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">
            {rating.toFixed(1)} {reviews > 0 && `(${reviews.toLocaleString()} reviews)`}
          </span>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed hidden sm:block">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 gap-3">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xs text-slate-400 font-semibold">$</span>
              <span className="text-2xl font-black text-slate-900 leading-none">
                {Math.floor(priceInfo.price)}
              </span>
              <span className="text-xs font-black text-slate-900 leading-none self-start mt-0.5">
                {(priceInfo.price % 1).toFixed(2).slice(1)}
              </span>
            </div>
            {priceInfo.savings > 0 && (
              <div className="text-[11px] text-slate-400">
                <span className="line-through">${priceInfo.originalPrice.toFixed(2)}</span>
                <span className="text-emerald-600 font-bold ml-1.5">
                  Save ${priceInfo.savings.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Free Delivery
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${addedToCart
                ? "bg-emerald-500 text-white"
                : "bg-amber-400 hover:bg-amber-300 text-slate-900"
                }`}
            >
              {addedToCart ? (
                <><Check className="w-3.5 h-3.5" /> Added</>
              ) : (
                <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
const GridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
        <div className="aspect-square bg-slate-100" />
        <div className="p-3.5 space-y-2">
          <div className="h-3 bg-slate-100 rounded-lg w-1/3" />
          <div className="h-4 bg-slate-100 rounded-lg w-5/6" />
          <div className="h-3 bg-slate-100 rounded-lg w-2/3" />
          <div className="h-6 bg-slate-100 rounded-lg w-1/2 mt-2" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AllProductsPage() {
  const router = useRouter();
  // Read search term from URL (set by Navbar search)
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [sortBy, setSortBy] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [minRating, setMinRating] = useState<number | "">("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Sync searchTerm when urlSearch changes (e.g. navbar search or navigation)
  useEffect(() => {
    setSearchTerm(urlSearch);
  }, [urlSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/products");
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    router.push("/products");
  };

  // Reset page when search term or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy, minPrice, maxPrice, minRating, inStockOnly]);

  const { data: productsResponse, isLoading, isFetching, isError, refetch } =
    useAllProductsQuery({
      search: searchTerm || urlSearch || undefined,
      page: currentPage,
      limit: LIMIT,
      category: selectedCategory || undefined,
      sort: sortBy || undefined,
    });

  const { data: categoriesResponse } = useAllCategoriesQuery({});
  const categories: TCategory[] = (categoriesResponse as any)?.data || [];

  const allProducts: TProduct[] = (productsResponse as any)?.data || [];
  const meta = (productsResponse as any)?.meta;
  const totalPages = meta ? Math.ceil(meta.total / LIMIT) : 1;

  // Extract unique brands from loaded products (client-side)
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    allProducts.forEach((p) => { if (p.brand) brands.add(p.brand); });
    return Array.from(brands).sort();
  }, [allProducts]);

  // Client-side filter for price, rating, stock, brand
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const priceInfo = extractProductPriceInfo(product);
      if (minPrice !== "" && priceInfo.price < minPrice) return false;
      if (maxPrice !== "" && priceInfo.price > maxPrice) return false;
      const rating = product.averageRating ?? 0;
      if (minRating !== "" && rating < minRating) return false;
      if (selectedBrand && product.brand !== selectedBrand) return false;
      return true;
    });
  }, [allProducts, minPrice, maxPrice, minRating, selectedBrand]);

  const activeFilterCount = [
    urlSearch ? 1 : null,
    selectedCategory,
    selectedBrand,
    minPrice !== "" ? 1 : null,
    maxPrice !== "" ? 1 : null,
    minRating !== "" ? 1 : null,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    if (urlSearch || searchTerm) {
      handleClearSearch();
    }
    setSelectedCategory("");
    setSelectedBrand("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.value === sortBy)?.label || "Featured";

  // ─── Sidebar Content ───────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
            <Filter className="w-3.5 h-3.5 text-violet-600" />
          </div>
          <span className="font-black text-slate-900 text-sm">Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-[11px] text-rose-500 hover:text-rose-600 font-bold cursor-pointer hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2.5">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" />
          Category
        </h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedCategory("")}
            className={`w-full text-left text-xs px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${selectedCategory === ""
              ? "bg-violet-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            All Categories
          </button>
          {categories.slice(0, 12).map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() =>
                setSelectedCategory(selectedCategory === cat._id ? "" : cat._id)
              }
              className={`w-full text-left text-xs px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer flex items-center justify-between ${selectedCategory === cat._id
                ? "bg-violet-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              <span className="truncate">{cat.name}</span>
              {selectedCategory === cat._id && <Check className="w-3 h-3 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <BadgePercent className="w-3.5 h-3.5" />
          Price Range
        </h4>
        <div className="space-y-1.5">
          {PRICE_PRESETS.map((preset) => {
            const isActive =
              (preset.min === undefined || minPrice === preset.min) &&
              (preset.max === undefined || maxPrice === preset.max);
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  if (isActive) {
                    setMinPrice("");
                    setMaxPrice("");
                  } else {
                    setMinPrice(preset.min ?? "");
                    setMaxPrice(preset.max ?? "");
                  }
                }}
                className={`w-full text-left text-xs px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${isActive
                  ? "bg-amber-400 text-slate-900"
                  : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        {/* Custom Price */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="number"
            placeholder="Min $"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-slate-700"
          />
          <span className="text-slate-300 font-bold">–</span>
          <input
            type="number"
            placeholder="Max $"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-slate-700"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-2.5">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5" />
          Customer Rating
        </h4>
        <div className="space-y-1">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setMinRating(minRating === r ? "" : r)}
              className={`w-full flex items-center gap-2 text-xs px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${minRating === r
                ? "bg-amber-50 border border-amber-200"
                : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3 h-3 ${s <= r
                      ? "fill-amber-400 text-amber-400"
                      : "fill-slate-100 text-slate-200"
                      }`}
                  />
                ))}
              </div>
              <span className="text-slate-600">& Up</span>
              {minRating === r && (
                <Check className="w-3 h-3 text-amber-500 ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      {availableBrands.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Brand
          </h4>
          <div className="space-y-1 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            <button
              type="button"
              onClick={() => setSelectedBrand("")}
              className={`w-full text-left text-xs px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${selectedBrand === ""
                ? "bg-violet-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              All Brands
            </button>
            {availableBrands.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrand(selectedBrand === brand ? "" : brand)}
                className={`w-full text-left text-xs px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer flex items-center justify-between ${selectedBrand === brand
                  ? "bg-violet-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                <span className="truncate">{brand}</span>
                {selectedBrand === brand && <Check className="w-3 h-3 shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f6f7fb]">
      {/* ── Hero Header ─────────────────────────────── */}

      {/* ── Main Content ────────────────────────────── */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="flex gap-7">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-60 xl:w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <SidebarContent />
            </div>
          </aside>

          {/* ── Product Panel ── */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Mobile filter toggle */}
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-black flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Result count */}
                <span className="text-sm text-slate-500">
                  <span className="font-bold text-slate-900">
                    {filteredProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-900">
                    {meta?.total?.toLocaleString() || allProducts.length}
                  </span>{" "}
                  products
                  {isFetching && (
                    <RefreshCw className="inline-block w-3 h-3 ml-1.5 animate-spin text-violet-500" />
                  )}
                </span>

                {/* Active filter chips */}
                {urlSearch && (
                  <span className="flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
                    <span>Search: &ldquo;{urlSearch}&rdquo;</span>
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="cursor-pointer hover:text-amber-950"
                      title="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="flex items-center gap-1 text-[11px] font-bold bg-violet-100 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full">
                    {categories.find((c) => c._id === selectedCategory)?.name || "Category"}
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("")}
                      className="cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrand && (
                  <span className="flex items-center gap-1 text-[11px] font-bold bg-violet-100 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full">
                    {selectedBrand}
                    <button
                      type="button"
                      onClick={() => setSelectedBrand("")}
                      className="cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              {/* Right: Sort + View toggle */}
              <div className="flex items-center gap-2">
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSortOpen((v) => !v)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    {currentSortLabel}
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSortOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {isSortOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsSortOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 z-20 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 py-1.5 overflow-hidden">
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setSortBy(opt.value);
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left text-xs px-4 py-2.5 font-semibold transition-colors cursor-pointer flex items-center justify-between ${sortBy === opt.value
                              ? "bg-violet-50 text-violet-700"
                              : "text-slate-600 hover:bg-slate-50"
                              }`}
                          >
                            {opt.label}
                            {sortBy === opt.value && (
                              <Check className="w-3 h-3 text-violet-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* View mode toggle */}
                <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "grid"
                      ? "bg-violet-600 text-white"
                      : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "list"
                      ? "bg-violet-600 text-white"
                      : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid / List */}
            {isLoading ? (
              <GridSkeleton />
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 space-y-4">
                <Package className="w-12 h-12 text-slate-300" />
                <p className="text-base font-bold text-slate-700">
                  Could not load products
                </p>
                <p className="text-sm text-slate-500">
                  Check your backend connection and try again.
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="btn btn-sm bg-violet-600 hover:bg-violet-500 text-white border-0 rounded-xl gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 space-y-4">
                <Search className="w-12 h-12 text-slate-200" />
                <p className="text-base font-bold text-slate-700">
                  No products found
                </p>
                <p className="text-sm text-slate-500">
                  Try adjusting your search or filters.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="btn btn-sm bg-violet-600 hover:bg-violet-500 text-white border-0 rounded-xl"
                >
                  Clear all filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductGridCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <ProductListCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>

                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 7) {
                    page = i + 1;
                  } else if (currentPage <= 4) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    page = totalPages - 6 + i;
                  } else {
                    page = currentPage - 3 + i;
                  }
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all cursor-pointer ${currentPage === page
                        ? "bg-violet-600 text-white shadow-md shadow-violet-300"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-sm"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Sidebar Drawer ─────────────────── */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 flex items-center justify-between px-5 py-4 z-10">
              <span className="font-black text-slate-900 text-sm">Filters & Refinements</span>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            <div className="p-5">
              <SidebarContent />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full btn btn-sm bg-violet-600 hover:bg-violet-500 text-white border-0 rounded-xl font-bold"
              >
                View {filteredProducts.length} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
