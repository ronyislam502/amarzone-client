"use client";

import { useState, useEffect } from "react";
import {
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";
import AZSelect, { TAZSelectOption } from "@/components/shared/form/AZSelect";
import { useDebounce } from "@/components/shared/Debaounce";

import AZInput from "@/components/shared/form/AZInput";

export interface DisputeFilterState {
  search: string;
  status: string;
  sort: string;
}

export interface DisputeFilterProps {
  filters?: DisputeFilterState;
  onFilterChange?: (newFilters: Partial<DisputeFilterState>) => void;
  onReset?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

const statusOptions: TAZSelectOption[] = [
  { value: "", label: "All Statuses" },
  { value: "OPEN", label: "Open Disputes" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "RESOLVED", label: "Resolved / Refunded" },
  { value: "REJECTED", label: "Rejected / Closed" },
];

const sortOptions: TAZSelectOption[] = [
  { value: "", label: "Default (Newest First)" },
  { value: "oldest", label: "Creation: Oldest First" },
  { value: "status", label: "Status Order" },
];

const defaultFilters: DisputeFilterState = {
  search: "",
  status: "",
  sort: "",
};

const DisputeFilter = ({
  filters = defaultFilters,
  onFilterChange,
  onReset,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search disputes by reason, order, or claimant...",
}: DisputeFilterProps) => {
  const currentSearch =
    filters?.search !== undefined
      ? filters.search
      : searchValue ?? "";

  const [searchValueLocal, setSearchValueLocal] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchValueLocal, 500);

  useEffect(() => {
    setSearchValueLocal(currentSearch);
  }, [currentSearch]);

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
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-error/50 to-transparent pointer-events-none z-10" />

      {/* Subtle ambient glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-error/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Left: Section Label */}
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-error">
            <div className="p-1.5 rounded-lg bg-error/10 border border-error/20 text-error">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <span>Dispute Mediation Filters</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Dispute Input */}
          <div>
            <AZInput
              name="search"
              label="Search Disputes"
              placeholder={searchPlaceholder}
              value={searchValueLocal}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <AZSelect
            name="status"
            label="Dispute Status"
            placeholder="All Statuses"
            options={statusOptions}
            value={filters?.status || ""}
            onChange={(e) => onFilterChange?.({ status: e.target.value })}
          />

          {/* Sort Filter */}
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

export default DisputeFilter;
