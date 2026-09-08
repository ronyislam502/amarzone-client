"use client";

import { Filter, RotateCcw, ShieldCheck, Globe, ArrowUpDown } from "lucide-react";

export interface VendorsFilterState {
  status: string;
  country: string;
  sort: string;
}

interface VendorsFilterBarProps {
  filters: VendorsFilterState;
  onFilterChange: (newFilters: Partial<VendorsFilterState>) => void;
  onReset: () => void;
}

const VendorsFilterBar = ({
  filters,
  onFilterChange,
  onReset,
}: VendorsFilterBarProps) => {
  const hasActiveFilters =
    Boolean(filters.status) ||
    Boolean(filters.country) ||
    Boolean(filters.sort);

  return (
    <div className="card bg-base-100 shadow-md border border-base-200">
      <div className="card-body p-4 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left: Section Label */}
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-base-content/80">
            <Filter className="w-4 h-4 text-warning" />
            <span>Merchant Directory Filters</span>
          </div>

          {/* Right: Reset Action */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-ghost btn-xs text-error gap-1 font-bold hover:bg-error/10 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Filters Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Status Filter */}
          <div className="form-control">
            <label className="label py-1">
              <span className="text-[11px] font-bold text-base-content/70 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-success" />
                Partner Status
              </span>
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="select select-bordered select-sm w-full font-medium"
            >
              <option value="">All Statuses</option>
              <option value="active">Active Storefronts</option>
              <option value="inactive">Inactive / Suspended</option>
            </select>
          </div>

          {/* Country / Region Filter */}
          <div className="form-control">
            <label className="label py-1">
              <span className="text-[11px] font-bold text-base-content/70 flex items-center gap-1">
                <Globe className="w-3 h-3 text-info" />
                Country / Region
              </span>
            </label>
            <select
              value={filters.country}
              onChange={(e) => onFilterChange({ country: e.target.value })}
              className="select select-bordered select-sm w-full font-medium"
            >
              <option value="">All Regions</option>
              <option value="USA">United States (USA)</option>
              <option value="UK">United Kingdom (UK)</option>
              <option value="BD">Bangladesh</option>
              <option value="CA">Canada</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="form-control">
            <label className="label py-1">
              <span className="text-[11px] font-bold text-base-content/70 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-base-content/50" />
                Sort By
              </span>
            </label>
            <select
              value={filters.sort}
              onChange={(e) => onFilterChange({ sort: e.target.value })}
              className="select select-bordered select-sm w-full font-medium"
            >
              <option value="">Default (Newest First)</option>
              <option value="name_asc">Store Name: A to Z</option>
              <option value="name_desc">Store Name: Z to A</option>
              <option value="oldest">Registration: Oldest First</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorsFilterBar;
