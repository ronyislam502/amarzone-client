"use client";

import { useState, useEffect } from "react";
import {
  Filter,
  RotateCcw,
} from "lucide-react";
import AZSelect, { TAZSelectOption } from "@/components/shared/form/AZSelect";
import { useDebounce } from "@/components/shared/Debaounce";
import AZInput from "@/components/shared/form/AZInput";

export interface VendorsFilterState {
  search: string;
  status: string;
  sort: string;
}

export interface VendorsFilterProps {
  filters?: VendorsFilterState;
  onFilterChange?: (newFilters: Partial<VendorsFilterState>) => void;
  onReset?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

const statusOptions: TAZSelectOption[] = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Authorized Stores" },
  { value: "inactive", label: "Suspended Stores" },
];

const sortOptions: TAZSelectOption[] = [
  { value: "", label: "Default (Newest First)" },
  { value: "name_asc", label: "Store Name: A to Z" },
  { value: "name_desc", label: "Store Name: Z to A" },
  { value: "oldest", label: "Onboarding: Oldest First" },
];

const defaultFilters: VendorsFilterState = {
  search: "",
  status: "",
  sort: "",
};

const VendorsFilter = ({
  filters = defaultFilters,
  onFilterChange,
  onReset,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search by store name, email, phone, location...",
}: VendorsFilterProps) => {
  const currentSearch =
    filters?.search !== undefined
      ? filters.search
      : searchValue ?? "";

  const [searchValueLocal, setSearchValueLocal] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchValueLocal, 500);

  // Keep local search input in sync when external filter resets/changes
  useEffect(() => {
    setSearchValueLocal(currentSearch);
  }, [currentSearch]);

  // When debounced search value updates, notify parent filter change
  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      if (onSearchChange) {
        onSearchChange(debouncedSearch);
      }
      if (onFilterChange) {
        onFilterChange({
          search: debouncedSearch,
        });
      }
    }
  }, [debouncedSearch]);

  const hasActiveFilters =
    Boolean(filters?.status) ||
    Boolean(filters?.sort) ||
    Boolean(searchValueLocal);

  const handleSearchChange = (val: string) => {
    setSearchValueLocal(val);
  };

  const handleClear = () => {
    setSearchValueLocal("");
    if (onSearchChange) {
      onSearchChange("");
    }
    if (onFilterChange) {
      onFilterChange({
        search: "",
      });
    }
  };

  const handleReset = () => {
    setSearchValueLocal("");
    if (onSearchChange) {
      onSearchChange("");
    }
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#170d2f] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* Top glowing accent border ray */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none z-10" />

      {/* Subtle ambient glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Left: Section Label */}
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
            <div className="p-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <span>Merchant Directory Filters</span>
          </div>

          {/* Right: Reset Action */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-ghost btn-xs text-rose-400 gap-1.5 font-bold hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 rounded-xl cursor-pointer transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Filters Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Vendor Input using AZInput (Spans 2 columns on lg) */}
          <div className="lg:col-span-2">
            <AZInput
              name="search"
              label="Search Storefronts"
              placeholder={searchPlaceholder}
              value={searchValueLocal}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Status Filter using AZSelect */}
          <AZSelect
            name="status"
            label="Merchant Status"
            placeholder="All Statuses"
            options={statusOptions}
            value={filters?.status || ""}
            onChange={(e) => onFilterChange?.({ status: e.target.value })}
          />

          {/* Sort Filter using AZSelect */}
          <AZSelect
            name="sort"
            label="Sort Order"
            placeholder="Default (Newest First)"
            options={sortOptions}
            value={filters?.sort || ""}
            onChange={(e) => onFilterChange?.({ sort: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default VendorsFilter;
