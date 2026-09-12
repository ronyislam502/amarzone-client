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
              onClick={onReset}
              className="btn btn-ghost btn-xs text-rose-400 gap-1.5 font-bold hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 rounded-xl cursor-pointer transition-all"
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
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Partner Status
              </span>
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="select select-sm w-full font-medium bg-[#120824] border border-white/15 text-slate-200 focus:border-amber-400 focus:outline-none rounded-xl transition-all"
            >
              <option value="" className="bg-[#170d2f] text-slate-200">All Statuses</option>
              <option value="active" className="bg-[#170d2f] text-slate-200">Active Storefronts</option>
              <option value="inactive" className="bg-[#170d2f] text-slate-200">Inactive / Suspended</option>
            </select>
          </div>

          {/* Country / Region Filter */}
          <div className="form-control">
            <label className="label py-1">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                Country / Region
              </span>
            </label>
            <select
              value={filters.country}
              onChange={(e) => onFilterChange({ country: e.target.value })}
              className="select select-sm w-full font-medium bg-[#120824] border border-white/15 text-slate-200 focus:border-amber-400 focus:outline-none rounded-xl transition-all"
            >
              <option value="" className="bg-[#170d2f] text-slate-200">All Regions</option>
              <option value="Bangladesh" className="bg-[#170d2f] text-slate-200">Bangladesh</option>
              <option value="USA" className="bg-[#170d2f] text-slate-200">United States (USA)</option>
              <option value="Canada" className="bg-[#170d2f] text-slate-200">Canada</option>
              <option value="European Union" className="bg-[#170d2f] text-slate-200">European Union (EU)</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="form-control">
            <label className="label py-1">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                Sort By
              </span>
            </label>
            <select
              value={filters.sort}
              onChange={(e) => onFilterChange({ sort: e.target.value })}
              className="select select-sm w-full font-medium bg-[#120824] border border-white/15 text-slate-200 focus:border-amber-400 focus:outline-none rounded-xl transition-all"
            >
              <option value="" className="bg-[#170d2f] text-slate-200">Default (Newest First)</option>
              <option value="name_asc" className="bg-[#170d2f] text-slate-200">Store Name: A to Z</option>
              <option value="name_desc" className="bg-[#170d2f] text-slate-200">Store Name: Z to A</option>
              <option value="oldest" className="bg-[#170d2f] text-slate-200">Registration: Oldest First</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorsFilterBar;
