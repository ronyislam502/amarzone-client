"use client";

import { Search, Filter, RotateCcw, SlidersHorizontal } from "lucide-react";

export interface InventoryFilterState {
  stockStatus: string;
  buyBox: string;
  sort: string;
}

interface InventoryFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters: InventoryFilterState;
  onFilterChange: (filters: InventoryFilterState) => void;
  onReset: () => void;
}

const InventoryFilterBar = ({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  onReset,
}: InventoryFilterBarProps) => {
  const hasActiveFilters =
    search !== "" ||
    filters.stockStatus !== "" ||
    filters.buyBox !== "" ||
    filters.sort !== "";

  return (
    <div className="bg-base-100 p-4 rounded-2xl border border-base-200 shadow-sm space-y-3">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by ASIN, Product Title, or SKU..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input input-sm input-bordered w-full pl-10 rounded-xl bg-base-100 font-medium text-xs focus:outline-none focus:border-accent border-base-300"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Stock Status Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-base-content/60 uppercase">Stock:</span>
            <select
              value={filters.stockStatus}
              onChange={(e) =>
                onFilterChange({ ...filters, stockStatus: e.target.value })
              }
              className="select select-bordered select-sm rounded-xl text-xs font-semibold focus:outline-none focus:border-accent bg-base-100 border-base-300"
            >
              <option value="">All Statuses</option>
              <option value="in_stock">In Stock (&gt; 0)</option>
              <option value="low_stock">Low Stock (≤ 5)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>
          </div>

          {/* Buy Box Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-base-content/60 uppercase">Buy Box:</span>
            <select
              value={filters.buyBox}
              onChange={(e) =>
                onFilterChange({ ...filters, buyBox: e.target.value })
              }
              className="select select-bordered select-sm rounded-xl text-xs font-semibold focus:outline-none focus:border-accent bg-base-100 border-base-300"
            >
              <option value="">All Listings</option>
              <option value="winner">Winner Only 🏆</option>
              <option value="non_winner">Competitor Leading</option>
            </select>
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-base-content/50" />
            <select
              value={filters.sort}
              onChange={(e) =>
                onFilterChange({ ...filters, sort: e.target.value })
              }
              className="select select-bordered select-sm rounded-xl text-xs font-semibold focus:outline-none focus:border-accent bg-base-100 border-base-300"
            >
              <option value="">Sort: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="qty_asc">Stock: Low to High</option>
              <option value="qty_desc">Stock: High to Low</option>
            </select>
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="btn btn-sm btn-ghost hover:bg-base-200 text-error gap-1.5 text-xs font-bold"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryFilterBar;
