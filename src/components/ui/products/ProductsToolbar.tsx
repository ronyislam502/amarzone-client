"use client";

import React, { ChangeEvent } from "react";
import {
  SlidersHorizontal,
  RefreshCw,
  Search,
  X,
  ArrowUpDown,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { SORT_OPTIONS } from "./types";
import { TCategory } from "@/types/category";
import AZInput from "@/src/components/ui/shared/form/AZInput";
import AZSelect from "@/src/components/ui/shared/form/AZSelect";

export interface ProductsToolbarProps {
  totalResultsCount: number;
  filteredCount: number;
  isFetching: boolean;
  activeFilterCount: number;
  onOpenMobileFilters: () => void;

  // Active filter state
  urlSearch: string;
  onClearSearch: () => void;
  selectedCategory: string;
  categories: TCategory[];
  onClearCategory: () => void;
  selectedBrand: string;
  onClearBrand: () => void;
  inStockOnly: boolean;
  onClearInStock: () => void;
  minRating: number | "";
  onClearRating: () => void;
  minPrice?: number | "";
  maxPrice?: number | "";
  onClearPrice?: () => void;

  // Search input inside toolbar
  searchTerm: string;
  onSearchTermChange: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;

  // Sorting
  sortBy: string;
  onSelectSort: (val: string) => void;

  // View Mode
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export const ProductsToolbar: React.FC<ProductsToolbarProps> = ({
  totalResultsCount,
  filteredCount,
  isFetching,
  activeFilterCount,
  onOpenMobileFilters,

  urlSearch,
  onClearSearch,
  selectedCategory,
  categories,
  onClearCategory,
  selectedBrand,
  onClearBrand,
  inStockOnly,
  onClearInStock,
  minRating,
  onClearRating,
  minPrice,
  maxPrice,
  onClearPrice,

  searchTerm,
  onSearchTermChange,
  onSearchSubmit,

  sortBy,
  onSelectSort,

  viewMode,
  onViewModeChange,
}) => {
  const selectedCategoryName =
    categories.find((c) => c._id === selectedCategory)?.name || "Category";

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap bg-white p-4 rounded-2xl border border-slate-200 shadow-sm select-none">
      {/* Left Toolbar: Mobile Filter + Count + Active Filter Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Mobile filter button */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Result count */}
        <span className="text-sm text-slate-500">
          <span className="font-bold text-slate-900">{filteredCount}</span> of{" "}
          <span className="font-bold text-slate-900">
            {totalResultsCount.toLocaleString()}
          </span>{" "}
          products
          {isFetching && (
            <RefreshCw className="inline-block w-3 h-3 ml-1.5 animate-spin text-violet-500" />
          )}
        </span>

        {/* Active search filter chip */}
        {urlSearch && (
          <span className="flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
            <span>Search: &ldquo;{urlSearch}&rdquo;</span>
            <button
              type="button"
              onClick={onClearSearch}
              className="cursor-pointer hover:text-amber-950"
              title="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {/* Active category filter chip */}
        {selectedCategory && (
          <span className="flex items-center gap-1 text-[11px] font-bold bg-violet-100 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full">
            <span>{selectedCategoryName}</span>
            <button
              type="button"
              onClick={onClearCategory}
              className="cursor-pointer hover:text-violet-950"
              title="Clear category filter"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {/* Active brand filter chip */}
        {selectedBrand && (
          <span className="flex items-center gap-1 text-[11px] font-bold bg-violet-100 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full">
            <span>{selectedBrand}</span>
            <button
              type="button"
              onClick={onClearBrand}
              className="cursor-pointer hover:text-violet-950"
              title="Clear brand filter"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {/* Active in-stock filter chip */}
        {inStockOnly && (
          <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
            <span>In Stock</span>
            <button
              type="button"
              onClick={onClearInStock}
              className="cursor-pointer hover:text-emerald-950"
              title="Clear in-stock filter"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {/* Active rating filter chip */}
        {minRating !== "" && (
          <span className="flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
            <span>{minRating}★ & Up</span>
            <button
              type="button"
              onClick={onClearRating}
              className="cursor-pointer hover:text-amber-950"
              title="Clear rating filter"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {/* Active price range chip */}
        {(minPrice !== undefined && minPrice !== "" || maxPrice !== undefined && maxPrice !== "") && (
          <span className="flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
            <span>
              {minPrice !== undefined && minPrice !== "" && maxPrice !== undefined && maxPrice !== ""
                ? `$${minPrice} - $${maxPrice}`
                : minPrice !== undefined && minPrice !== ""
                ? `From $${minPrice}`
                : `Up to $${maxPrice}`}
            </span>
            {onClearPrice && (
              <button
                type="button"
                onClick={onClearPrice}
                className="cursor-pointer hover:text-amber-950"
                title="Clear price filter"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        )}
      </div>

      {/* Right Toolbar: Search (AZInput) + Sort (AZSelect) + View Mode */}
      <div className="flex items-center gap-2.5">
        {/* Reusable AZInput for search in toolbar */}
        <form
          onSubmit={onSearchSubmit}
          className="hidden md:block w-40 lg:w-48"
        >
          <AZInput
            name="toolbar-search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchTermChange(e.target.value)}
            icon={<Search className="w-3.5 h-3.5 text-slate-400" />}
            clearable
            onClear={onClearSearch}
            size="sm"
            inputClassName="!bg-slate-50 !border-slate-200 rounded-xl text-xs pl-8 pr-7 py-2 text-slate-800 focus:!border-violet-500"
            containerClassName="w-full"
          />
        </form>

        {/* Reusable AZSelect for sort */}
        <div className="w-40 sm:w-44">
          <AZSelect
            name="sort"
            placeholder="Featured"
            icon={<ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />}
            options={SORT_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            value={sortBy}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onSelectSort(e.target.value)}
            size="sm"
            selectClassName="!bg-white !border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs focus:!border-violet-500"
            containerClassName="w-full"
          />
        </div>

        {/* Grid / List View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === "list"
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="List view"
          >
            <LayoutList className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsToolbar;
