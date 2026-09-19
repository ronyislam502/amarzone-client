"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Layers,
  Sparkles,
  ChevronRight,
  Package,
  Star,
  Heart,
  ShoppingCart,
  Check,
  ShieldCheck,
  BadgePercent,
  SlidersHorizontal,
  LayoutGrid,
  LayoutList,
  RefreshCw,
  Tag,
  ArrowLeft,
  Search,
} from "lucide-react";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { useCategoriesByDepartmentQuery } from "@/redux/features/category/categoryApi";
import { useAllProductsQuery } from "@/redux/features/product/productApi";
import { TDepartment } from "@/types/department";
import { TCategory } from "@/types/category";
import { TProduct } from "@/types/product";
import { matchesSlug, slugify } from "@/utils/slug";
import { useAppDispatch } from "@/src/redux/hooks";
import { addToCart } from "@/redux/features/order/orderSlice";
import {
  extractProductPriceInfo,
  getProductThumbnail,
} from "@/components/ui/home/homeUtils";
import { toast } from "react-toastify";

// ─── Product Card Component ──────────────────────────────────────────────────
const DepartmentProductCard: React.FC<{ product: TProduct }> = ({ product }) => {
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
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 overflow-hidden"
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
          className={`w-3.5 h-3.5 transition-colors ${
            isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400"
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
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider truncate">
            {product.brand}
          </span>
          <span className="text-[10px] text-slate-400 truncate">
            {(product.category as any)?.name || ""}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-violet-700 transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
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

        <div className="flex-1" />

        {/* Price & Add */}
        <div className="flex items-end justify-between gap-2 pt-1">
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
              <><Check className="w-3.5 h-3.5" /> Added</>
            ) : (
              <><ShoppingCart className="w-3.5 h-3.5" /> Add</>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
          <ShieldCheck className="w-3 h-3" />
          <span>Verified Quality</span>
        </div>
      </div>
    </Link>
  );
};

// ─── Department Page Main Component ──────────────────────────────────────────
export default function DepartmentPage() {
  const params = useParams();
  const router = useRouter();
  const departmentSlug = (params?.department as string) || "";

  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch departments from database
  const { data: deptResponse, isLoading: isLoadingDepts } = useAllDepartmentsQuery({
    limit: 100,
  });
  const departments: TDepartment[] = (deptResponse as any)?.data || [];

  // Match the department from database by URL slug
  const matchedDepartment = useMemo(() => {
    return departments.find((d) => matchesSlug(d.name, departmentSlug));
  }, [departments, departmentSlug]);

  const departmentId = matchedDepartment?._id;

  // 2. Fetch categories belonging to this specific department from database
  const {
    data: catResponse,
    isLoading: isLoadingCategories,
  } = useCategoriesByDepartmentQuery(
    departmentId ? { id: departmentId, limit: 100 } : "",
    { skip: !departmentId }
  );
  const categories: TCategory[] = (catResponse as any)?.data || [];

  // 3. Fetch products belonging to this department from database
  const {
    data: prodResponse,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
  } = useAllProductsQuery(
    departmentId
      ? {
          department: departmentId,
          limit: 100,
          sort: sortBy || undefined,
          search: searchTerm || undefined,
        }
      : undefined,
    { skip: !departmentId }
  );

  const products: TProduct[] = (prodResponse as any)?.data || [];
  const meta = (prodResponse as any)?.meta;

  if (isLoadingDepts) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-violet-600 mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading department...</p>
      </div>
    );
  }

  if (!matchedDepartment && !isLoadingDepts) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Department Not Found</h1>
        <p className="text-sm text-slate-500 mb-6">
          The department &ldquo;{decodeURIComponent(departmentSlug)}&rdquo; does not exist in our database.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Browse All Products
        </Link>
      </div>
    );
  }

  const deptDisplayName = matchedDepartment?.name || "";
  const currentDeptSlug = slugify(deptDisplayName);

  return (
    <main className="min-h-screen bg-[#f8f9fc] pb-16">
      {/* ── Breadcrumb & Department Banner ──────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white py-10 px-4 sm:px-6 lg:px-10 border-b border-slate-700">
        <div className="max-w-[1720px] mx-auto space-y-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/products" className="hover:text-white transition-colors">
              Products
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-amber-400 font-bold">{deptDisplayName}</span>
          </nav>

          {/* Department Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold mb-2 border border-violet-400/30">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Department Store
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {deptDisplayName}
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Explore all categories and authentic products available in the {deptDisplayName} department.
              </p>
            </div>

            {/* Department Quick Stats */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/10 text-center">
                <div className="text-lg font-black text-amber-400">
                  {categories.length}
                </div>
                <div className="text-[11px] text-slate-300 font-medium">Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/10 text-center">
                <div className="text-lg font-black text-emerald-400">
                  {meta?.total ?? products.length}
                </div>
                <div className="text-[11px] text-slate-300 font-medium">Products</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Selected Department & Categories Section ────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-3.5">
          {/* Selected Department Indicator */}
          <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase font-black tracking-wider text-slate-400">
                Selected Department:
              </span>
              <Link
                href={`/${currentDeptSlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-black hover:bg-violet-200 transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-violet-600" />
                {deptDisplayName}
                <span className="text-[10px] bg-violet-600 text-white rounded-full px-1.5 py-0.2">All</span>
              </Link>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline-block">
              Click any category below to filter products
            </span>
          </div>

          {/* Categories List Belonging to this Department */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {/* All Products in this Department pill */}
            <Link
              href={`/${currentDeptSlug}`}
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all bg-slate-900 text-white shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              All {deptDisplayName}
              <span className="ml-1 text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-full">
                {products.length}
              </span>
            </Link>

            {isLoadingCategories && (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                <RefreshCw className="w-3 h-3 animate-spin" /> Loading categories...
              </div>
            )}

            {!isLoadingCategories && categories.length === 0 && (
              <span className="text-xs text-slate-400 py-2">No sub-categories in this department</span>
            )}

            {categories.map((cat) => {
              const catSlug = slugify(cat.name);
              return (
                <Link
                  key={cat._id}
                  href={`/${currentDeptSlug}/${catSlug}`}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-violet-100 hover:text-violet-900 border border-slate-200/70 hover:border-violet-300 transition-all cursor-pointer"
                >
                  <Tag className="w-3 h-3 text-slate-400 group-hover:text-violet-600" />
                  {cat.name.trim()}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Product Listing & Filter Toolbar ────────────────────── */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-800">
              All Products in {deptDisplayName}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              ({products.length} {products.length === 1 ? "product" : "products"} found)
            </span>
            {isFetchingProducts && (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-violet-600" />
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                <option value="">Featured</option>
                <option value="minPrice">Price: Low to High</option>
                <option value="-minPrice">Price: High to Low</option>
                <option value="-createdAt">Newest Arrivals</option>
                <option value="-averageRating">Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Products Grid ── */}
        {isLoadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse p-3 space-y-3"
              >
                <div className="aspect-square bg-slate-100 rounded-xl" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-4 bg-slate-100 rounded w-5/6" />
                <div className="h-6 bg-slate-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {products.map((product) => (
              <DepartmentProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12 space-y-4">
            <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              No products found in {deptDisplayName}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find any products in this department at the moment.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
