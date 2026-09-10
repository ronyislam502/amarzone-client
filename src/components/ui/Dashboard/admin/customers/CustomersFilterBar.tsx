"use client";

import { ChangeEvent } from "react";
import {
  Filter,
  RotateCcw,
  ShieldCheck,
  Globe,
  ArrowUpDown,
  Search,
} from "lucide-react";
import AZInput from "../../../shared/form/AZInput";
import AZSelect from "../../../shared/form/AZSelect";

export interface CustomersFilterState {
  search?: string;
  status: string;
  country: string;
  sort: string;
}

interface CustomersFilterBarProps {
  filters: CustomersFilterState;
  onFilterChange: (newFilters: Partial<CustomersFilterState>) => void;
  onReset: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

const statusOptions = [
  { value: "active", label: "Active Consumers" },
  { value: "inactive", label: "Inactive / Suspended" },
];

const countryOptions = [
  { value: "USA", label: "United States (USA)" },
  { value: "UK", label: "United Kingdom (UK)" },
  { value: "BD", label: "Bangladesh" },
  { value: "CA", label: "Canada" },
];

const sortOptions = [
  { value: "name_asc", label: "Customer Name: A to Z" },
  { value: "name_desc", label: "Customer Name: Z to A" },
  { value: "oldest", label: "Registration: Oldest First" },
];

const CustomersFilterBar = ({
  filters,
  onFilterChange,
  onReset,
  searchTerm,
  onSearchChange,
}: CustomersFilterBarProps) => {
  const effectiveSearch =
    searchTerm !== undefined ? searchTerm : filters.search || "";

  const hasActiveFilters =
    Boolean(effectiveSearch) ||
    Boolean(filters.status) ||
    Boolean(filters.country) ||
    Boolean(filters.sort);

  const handleSearchChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      onFilterChange({ search: val });
    }
  };

  const handleClearSearch = () => {
    handleSearchChange("");
  };

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl [&_.input]:bg-[#120824] [&_.input]:border-white/15 [&_.input]:text-slate-200 [&_.input]:placeholder:text-slate-500 [&_.input:focus]:border-amber-400 [&_.label-text]:text-slate-300 [&_.label-text]:font-bold [&_.label-text]:text-[11px]">
      {/* Top glowing accent border line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* High-tech dot matrix overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

      <div className="card-body relative z-10 p-5 space-y-4">
        {/* Top Header Toolbar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-200">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Customer Directory Filters</span>
          </div>

          {/* Reset Action */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-ghost btn-xs text-rose-400 gap-1 font-bold hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 rounded-lg cursor-pointer transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Reusable Form Inputs & Select Controls Grid using AZInput and AZSelect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Reusable AZInput for Search */}
          <AZInput
            name="search"
            label="Search Directory"
            icon={<Search className="w-3.5 h-3.5 text-amber-400" />}
            placeholder="Search name, email, phone..."
            value={effectiveSearch}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
            clearable
            onClear={handleClearSearch}
            size="sm"
          />

          {/* Reusable AZSelect for Status */}
          <AZSelect
            name="status"
            label="Account Status"
            icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
            placeholder="All Statuses"
            options={statusOptions}
            value={filters.status}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onFilterChange({ status: e.target.value })
            }
            selectClassName="!bg-[#120824] !border-white/15 text-slate-200 focus:!border-amber-400 rounded-xl"
            size="sm"
          />

          {/* Reusable AZSelect for Country */}
          <AZSelect
            name="country"
            label="Shipping Country"
            icon={<Globe className="w-3.5 h-3.5 text-sky-400" />}
            placeholder="All Regions"
            options={countryOptions}
            value={filters.country}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onFilterChange({ country: e.target.value })
            }
            selectClassName="!bg-[#120824] !border-white/15 text-slate-200 focus:!border-amber-400 rounded-xl"
            size="sm"
          />

          {/* Reusable AZSelect for Sort */}
          <AZSelect
            name="sort"
            label="Sort Order"
            icon={<ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />}
            placeholder="Default (Newest First)"
            options={sortOptions}
            value={filters.sort}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onFilterChange({ sort: e.target.value })
            }
            selectClassName="!bg-[#120824] !border-white/15 text-slate-200 focus:!border-amber-400 rounded-xl"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomersFilterBar;
