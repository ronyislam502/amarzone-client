"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  PackageOpen,
  ArrowUpDown,
  Filter,
  Check,
} from "lucide-react";
import { useGetVendorInventoryQuery } from "@/redux/features/inventory/inventoryApi";
import { useAllProductsQuery } from "@/redux/features/product/productApi";
import { TInventory } from "@/types/inventory";
import VendorProductCard from "./VendorProductCard";
import { ProductGridSkeleton } from "@/src/components/ui/skeleton";

interface VendorProductsSectionProps {
  vendorId: string;
  vendorName?: string;
  initialItems?: TInventory[];
}

export const VendorProductsSection: React.FC<VendorProductsSectionProps> = ({
  vendorId,
  vendorName = "Verified Merchant",
  initialItems = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<string>("featured");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // RTK Query hook connected to server endpoint: router.get("/ven-inventory/:id", InventoryControllers.vendorInventory)
  const { data: inventoryResponse, isLoading, isError, refetch } =
    useGetVendorInventoryQuery(
      {
        id: vendorId,
        params: {
          searchTerm: searchTerm.trim() || undefined,
          page: currentPage,
          limit: 24,
        },
      },
      { skip: !vendorId }
    );

  // Fallback to all products when direct inventory query returns empty
  const { data: allProductsResponse, isLoading: isLoadingFallback } =
    useAllProductsQuery(
      { limit: 100 },
      {
        skip: Boolean(
          inventoryResponse?.data && inventoryResponse.data.length > 0
        ),
      }
    );

  const rawData: TInventory[] = useMemo(() => {
    if (inventoryResponse && Array.isArray(inventoryResponse.data) && inventoryResponse.data.length > 0) {
      return inventoryResponse.data;
    }
    if (Array.isArray(inventoryResponse) && inventoryResponse.length > 0) {
      return inventoryResponse;
    }

    if (initialItems && initialItems.length > 0) {
      return initialItems;
    }

    // Secondary fallback: extract matching vendor inventory from products list
    if (allProductsResponse && Array.isArray(allProductsResponse.data)) {
      const extracted: TInventory[] = [];
      const vNameLower = vendorName.toLowerCase().trim();

      for (const prod of allProductsResponse.data) {
        if (Array.isArray(prod.variants)) {
          for (const variant of prod.variants) {
            if (Array.isArray(variant.inventory)) {
              for (const inv of variant.inventory) {
                const sVendor = inv?.seller?.vendor;
                const matchesId =
                  sVendor?._id === vendorId ||
                  sVendor?.id === vendorId ||
                  (typeof sVendor === "string" && sVendor === vendorId);
                const matchesName =
                  sVendor?.name &&
                  sVendor.name.toLowerCase().trim() === vNameLower;

                if (matchesId || matchesName) {
                  extracted.push({
                    _id: inv._id || `${variant._id}_${extracted.length}`,
                    asin: variant.asin || prod._id,
                    seller: {
                      ...inv.seller,
                      vendor: sVendor || { name: vendorName, _id: vendorId },
                    },
                    variant: {
                      ...variant,
                      product: prod,
                    },
                    createdAt: inv.createdAt || prod.createdAt,
                  });
                }
              }
            }
          }
        }
      }

      if (extracted.length > 0) {
        return extracted;
      }
    }

    return [];
  }, [inventoryResponse, initialItems, allProductsResponse, vendorId, vendorName]);

  // Client-side filtering and sorting for instant responsiveness
  const filteredProducts = useMemo(() => {
    let result = [...rawData];

    // In-stock filter
    if (onlyInStock) {
      result = result.filter(
        (item) => item?.seller?.isStock !== false && (item?.seller?.quantity ?? 1) > 0
      );
    }

    // Client-side text search fallback
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((item) => {
        const title = item?.variant?.product?.title?.toLowerCase() || "";
        const asin = item?.asin?.toLowerCase() || "";
        const brand = item?.variant?.product?.brand?.toLowerCase() || "";
        return title.includes(q) || asin.includes(q) || brand.includes(q);
      });
    }

    // Sorting
    if (sortOption === "price-asc") {
      result.sort((a, b) => (a.seller?.price ?? 0) - (b.seller?.price ?? 0));
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => (b.seller?.price ?? 0) - (a.seller?.price ?? 0));
    } else if (sortOption === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    }

    return result;
  }, [rawData, onlyInStock, searchTerm, sortOption]);

  const totalCount = filteredProducts.length;

  return (
    <section className="space-y-6 select-none" id="all-products-section">
      {/* SECTION HEADER & CONTROLS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>All Products</span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {totalCount} Items
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Browse authentic items directly listed and fulfilled by{" "}
              <span className="font-semibold text-slate-700">{vendorName}</span>
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search seller's inventory..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-amber-400 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* TOOLBAR: Filter options & View Mode */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`py-1.5 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                onlyInStock
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                  onlyInStock ? "border-white bg-white/20" : "border-slate-400"
                }`}
              >
                {onlyInStock && <Check className="w-3 h-3 text-white stroke-[3]" />}
              </div>
              <span>In Stock Only</span>
            </button>

            {searchTerm && (
              <span className="text-slate-500 font-medium">
                Filtering by &ldquo;{searchTerm}&rdquo;
              </span>
            )}
          </div>

          {/* Sorting & Layout */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="select select-bordered select-xs text-xs font-bold rounded-lg border-slate-200 bg-slate-50 py-1 px-2.5 cursor-pointer"
              >
                <option value="featured">Featured Listings</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-400 hover:text-slate-700"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-400 hover:text-slate-700"
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS DISPLAY GRID / LIST */}
      {(isLoading || isLoadingFallback) && filteredProducts.length === 0 ? (
        <ProductGridSkeleton
          count={8}
          gridClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        />
      ) : isError && filteredProducts.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm font-bold text-slate-800">
            Unable to load vendor inventory at the moment.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="py-2 px-4 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <PackageOpen className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              No products found
            </h3>
            <p className="text-xs text-slate-500">
              {searchTerm || onlyInStock
                ? "Try clearing your search keyword or relaxing filters to view all products."
                : "This merchant currently has no active inventory listed."}
            </p>
          </div>
          {(searchTerm || onlyInStock) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setOnlyInStock(false);
              }}
              className="py-2 px-4 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
              : "flex flex-col space-y-3"
          }
        >
          {filteredProducts.map((invItem) => (
            <VendorProductCard
              key={invItem._id}
              item={invItem}
              vendorName={vendorName}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default VendorProductsSection;
