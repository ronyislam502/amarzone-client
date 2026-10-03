"use client";

import React, { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Package,
  Search,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { useAllProductsQuery } from "@/redux/features/product/productApi";
import {
  useAllCategoriesQuery,
  useCategoriesByDepartmentQuery,
} from "@/redux/features/category/categoryApi";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { useDebounce } from "@/src/components/utilities/Debaounce";
import { TProduct } from "@/types/product";
import { TCategory } from "@/types/category";
import { TDepartment } from "@/types/department";
import { matchesSlug } from "@/utils/slug";
import { ProductGridSkeleton } from "@/src/components/ui/skeleton";
import Pagination from "@/src/components/ui/shared/Pagination";

import { ReusableProductsPageProps } from "./types";
import { ProductCard } from "./ProductCard";
import { ProductFilterSidebar } from "./ProductFilterSidebar";
import { ProductsHeader } from "./ProductsHeader";
import { ProductsToolbar } from "./ProductsToolbar";

const DEFAULT_LIMIT = 24;

/**
 * Master Reusable Products Page Component
 * Connects to server-side RTK Query matching AdminsData / ProductsData pattern:
 * - Server-side search, filtering, and sorting
 * - URL query state synchronization
 * - Reusable Pagination component integration
 */
function ReusableProductsPageContent({
  mode = "all",
  departmentSlug = "",
  categorySlug = "",
  departmentId,
  categoryId,
  title,
  subtitle,
  badge,
  limit = DEFAULT_LIMIT,
  defaultSort = "",
  className = "",
}: ReusableProductsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-driven query state
  const page = Number(searchParams.get("page")) || 1;
  const urlLimit = Number(searchParams.get("limit")) || limit;
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlBrand = searchParams.get("brand") || "";
  const urlSort = searchParams.get("sort") || defaultSort || "";
  const urlMinPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : "";
  const urlMaxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : "";
  const urlMinRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : "";
  const urlInStock = searchParams.get("inStock") === "true";

  // Local search input before debounce
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchTerm, 500);

  // View mode & mobile sidebar drawer
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync searchTerm when URL search param changes
  useEffect(() => {
    setSearchTerm(urlSearch);
  }, [urlSearch]);

  const updateUrl = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  useEffect(() => {
    if (debouncedSearch.trim() !== urlSearch) {
      updateUrl({ search: debouncedSearch.trim() || null, page: 1 });
    }
  }, [debouncedSearch, urlSearch, updateUrl]);

  // 1. Fetch departments
  const isDeptOrCategoryMode = mode === "department" || mode === "category";
  const { data: deptResponse, isLoading: isLoadingDepts } = useAllDepartmentsQuery(
    { limit: 100 },
    { skip: !isDeptOrCategoryMode && !departmentSlug }
  );

  const departments: TDepartment[] = useMemo(() => {
    return (deptResponse as { data?: TDepartment[] })?.data || [];
  }, [deptResponse]);

  // Match Department by slug
  const matchedDepartment = useMemo(() => {
    if (!departmentSlug) return null;
    return departments.find((d) => matchesSlug(d.name, departmentSlug)) || null;
  }, [departments, departmentSlug]);

  const activeDepartmentId = departmentId || matchedDepartment?._id;

  // 2. Fetch categories
  const { data: deptCategoriesResp, isLoading: isLoadingDeptCats } =
    useCategoriesByDepartmentQuery(activeDepartmentId || "", {
      skip: !activeDepartmentId,
    });

  const { data: allCategoriesResp } = useAllCategoriesQuery(
    { limit: 100 },
    { skip: Boolean(activeDepartmentId) }
  );

  const categories: TCategory[] = useMemo(() => {
    if (activeDepartmentId) {
      return (deptCategoriesResp as { data?: TCategory[] })?.data || [];
    }
    return (allCategoriesResp as { data?: TCategory[] })?.data || [];
  }, [activeDepartmentId, deptCategoriesResp, allCategoriesResp]);

  // Match Category by slug
  const matchedCategory = useMemo(() => {
    if (!categorySlug) return null;
    return categories.find((c) => matchesSlug(c.name, categorySlug)) || null;
  }, [categories, categorySlug]);

  const effectiveCategoryId =
    mode === "category"
      ? categoryId || matchedCategory?._id
      : urlCategory || categoryId;

  // 3. RTK Query server-side search, filter, sort, paginate
  const skipProducts =
    (mode === "department" && !activeDepartmentId && !isLoadingDepts) ||
    (mode === "category" && !effectiveCategoryId && !isLoadingDeptCats && !isLoadingDepts);

  const {
    data: responseData,
    isLoading: isLoadingProducts,
    isError,
    refetch,
    isFetching,
  } = useAllProductsQuery(
    {
      search: urlSearch || undefined,
      page: String(page),
      limit: String(urlLimit),
      department: activeDepartmentId || undefined,
      category: effectiveCategoryId || undefined,
      brand: urlBrand || undefined,
      sort: urlSort || undefined,
      minPrice: urlMinPrice !== "" ? String(urlMinPrice) : undefined,
      maxPrice: urlMaxPrice !== "" ? String(urlMaxPrice) : undefined,
      minRating: urlMinRating !== "" ? String(urlMinRating) : undefined,
      inStock: urlInStock ? true : undefined,
    },
    {
      skip: Boolean(skipProducts),
    }
  );

  const products: TProduct[] = responseData?.data || [];
  const meta = responseData?.meta;
  const total = meta?.total ?? products.length;

  // Extract unique brands for filtering
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [products]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (urlCategory && mode !== "category") count++;
    if (urlBrand) count++;
    if (urlSearch) count++;
    if (urlMinPrice !== "" || urlMaxPrice !== "") count++;
    if (urlMinRating !== "") count++;
    if (urlInStock) count++;
    return count;
  }, [urlCategory, urlBrand, urlSearch, urlMinPrice, urlMaxPrice, urlMinRating, urlInStock, mode]);

  // Filter change handlers with URL updates
  const handleSelectCategory = (id: string) => {
    updateUrl({ category: id || null, page: 1 });
  };

  const handleSelectBrand = (brand: string) => {
    updateUrl({ brand: brand || null, page: 1 });
  };

  const handleChangeMinPrice = (val: number | "") => {
    updateUrl({ minPrice: val === "" ? null : val, page: 1 });
  };

  const handleChangeMaxPrice = (val: number | "") => {
    updateUrl({ maxPrice: val === "" ? null : val, page: 1 });
  };

  const handleSelectMinRating = (rating: number | "") => {
    updateUrl({ minRating: rating === "" ? null : rating, page: 1 });
  };

  const handleToggleInStock = (checked: boolean) => {
    updateUrl({ inStock: checked ? "true" : null, page: 1 });
  };

  const handleSelectSort = (val: string) => {
    updateUrl({ sort: val || null, page: 1 });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    updateUrl({ search: null, page: 1 });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search: searchTerm.trim() || null, page: 1 });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    router.push(pathname);
  };

  // Safe checks for Department Not Found
  const isDeptNotFound =
    mode === "department" &&
    !isLoadingDepts &&
    departments.length > 0 &&
    !matchedDepartment &&
    !departmentId;

  if (isDeptNotFound) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">
          Department Not Found
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          We couldn&apos;t find the department &ldquo;{departmentSlug}&rdquo;. It
          may have been renamed or removed.
        </p>
        <Link
          href="/products"
          className="btn btn-sm bg-violet-600 hover:bg-violet-700 text-white rounded-xl gap-2 mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse All Products
        </Link>
      </div>
    );
  }

  const isInitialLoading =
    isLoadingProducts ||
    (isDeptOrCategoryMode && isLoadingDepts) ||
    (activeDepartmentId && isLoadingDeptCats);

  return (
    <main className={`min-h-screen bg-slate-50/60 text-slate-900 ${className}`}>
      {/* ── Products Header (Banner + Breadcrumbs + Category Chips) ─────────── */}
      <ProductsHeader
        mode={mode}
        departmentSlug={departmentSlug}
        categorySlug={categorySlug}
        matchedDepartment={matchedDepartment}
        matchedCategory={matchedCategory}
        categories={categories}
        selectedCategory={urlCategory}
        title={title}
        subtitle={subtitle}
        badge={badge}
        totalProductsCount={total}
      />

      {/* ── Main Catalog Content (Sidebar + Toolbar + Products Grid) ────────── */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="flex gap-7">
          {/* Desktop Sticky Sidebar */}
          <aside className="hidden lg:block w-60 xl:w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
              <ProductFilterSidebar
                mode={mode}
                categories={categories}
                selectedCategory={urlCategory}
                onSelectCategory={handleSelectCategory}
                minPrice={urlMinPrice}
                maxPrice={urlMaxPrice}
                onChangeMinPrice={handleChangeMinPrice}
                onChangeMaxPrice={handleChangeMaxPrice}
                minRating={urlMinRating}
                onSelectMinRating={handleSelectMinRating}
                inStockOnly={urlInStock}
                onToggleInStock={handleToggleInStock}
                availableBrands={availableBrands}
                selectedBrand={urlBrand}
                onSelectBrand={handleSelectBrand}
                activeFilterCount={activeFilterCount}
                onClearAll={clearAllFilters}
              />
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Toolbar */}
            <ProductsToolbar
              totalResultsCount={total}
              filteredCount={products.length}
              isFetching={isFetching}
              activeFilterCount={activeFilterCount}
              onOpenMobileFilters={() => setIsSidebarOpen(true)}
              urlSearch={urlSearch}
              onClearSearch={handleClearSearch}
              selectedCategory={urlCategory}
              categories={categories}
              onClearCategory={() => handleSelectCategory("")}
              selectedBrand={urlBrand}
              onClearBrand={() => handleSelectBrand("")}
              inStockOnly={urlInStock}
              onClearInStock={() => handleToggleInStock(false)}
              minRating={urlMinRating}
              onClearRating={() => handleSelectMinRating("")}
              minPrice={urlMinPrice}
              maxPrice={urlMaxPrice}
              onClearPrice={() => {
                handleChangeMinPrice("");
                handleChangeMaxPrice("");
              }}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              onSearchSubmit={handleSearchSubmit}
              sortBy={urlSort}
              onSelectSort={handleSelectSort}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {/* Products Layout / Skeletons / Empty States */}
            {isInitialLoading ? (
              <ProductGridSkeleton
                count={12}
                gridClassName="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              />
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 space-y-4 text-center p-6">
                <Package className="w-12 h-12 text-slate-300" />
                <p className="text-base font-bold text-slate-700">
                  Could not load products
                </p>
                <p className="text-sm text-slate-500 max-w-sm">
                  We encountered an issue communicating with the marketplace server.
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="btn btn-sm bg-violet-600 hover:bg-violet-500 text-white border-0 rounded-xl gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 space-y-4 text-center p-6">
                <Search className="w-12 h-12 text-slate-200" />
                <p className="text-base font-bold text-slate-700">
                  No products found
                </p>
                <p className="text-sm text-slate-500 max-w-sm">
                  Try clearing your filters or search keywords to discover more items.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="btn btn-sm bg-violet-600 hover:bg-violet-500 text-white border-0 rounded-xl cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    viewMode="grid"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    viewMode="list"
                  />
                ))}
              </div>
            )}

            {/* Reusable Pagination from project design system */}
            {total > 0 && (
              <div className="pt-2">
                <Pagination
                  page={page}
                  limit={urlLimit}
                  total={total}
                  onPageChange={(newPage) => updateUrl({ page: newPage })}
                  onLimitChange={(newLimit) => updateUrl({ limit: newLimit, page: 1 })}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Sidebar Drawer ─────────────────── */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
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
                ✕
              </button>
            </div>
            <div className="p-5">
              <ProductFilterSidebar
                mode={mode}
                categories={categories}
                selectedCategory={urlCategory}
                onSelectCategory={(id) => {
                  handleSelectCategory(id);
                  setIsSidebarOpen(false);
                }}
                minPrice={urlMinPrice}
                maxPrice={urlMaxPrice}
                onChangeMinPrice={handleChangeMinPrice}
                onChangeMaxPrice={handleChangeMaxPrice}
                minRating={urlMinRating}
                onSelectMinRating={(r) => {
                  handleSelectMinRating(r);
                  setIsSidebarOpen(false);
                }}
                inStockOnly={urlInStock}
                onToggleInStock={(checked) => {
                  handleToggleInStock(checked);
                  setIsSidebarOpen(false);
                }}
                availableBrands={availableBrands}
                selectedBrand={urlBrand}
                onSelectBrand={(b) => {
                  handleSelectBrand(b);
                  setIsSidebarOpen(false);
                }}
                activeFilterCount={activeFilterCount}
                onClearAll={() => {
                  clearAllFilters();
                  setIsSidebarOpen(false);
                }}
              />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full btn btn-sm bg-violet-600 hover:bg-violet-500 text-white border-0 rounded-xl font-bold cursor-pointer"
              >
                View {total} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export const ReusableProductsPage: React.FC<ReusableProductsPageProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
          <ProductGridSkeleton count={12} />
        </div>
      }
    >
      <ReusableProductsPageContent {...props} />
    </Suspense>
  );
};

// Aliases for convenience
export const ProductsPage = ReusableProductsPage;
export const ProductsCatalogView = ReusableProductsPage;

export default ReusableProductsPage;
