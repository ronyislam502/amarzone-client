"use client";

import React from "react";
import { SlidersHorizontal, RefreshCw, ChevronDown, Settings } from "lucide-react";

interface OrdersToolbarProps {
  totalCount: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const OrdersToolbar: React.FC<OrdersToolbarProps> = ({
  totalCount = 1,
  showFilters,
  onToggleFilters,
  sortBy,
  onSortChange,
  limit,
  onLimitChange,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-1">
      {/* Left: Show Filters & Count */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleFilters}
          className={`btn btn-sm rounded-full font-bold text-xs px-4 border transition-all cursor-pointer flex items-center gap-2 ${
            showFilters
              ? "bg-amber-400 text-slate-950 border-amber-400 hover:bg-amber-300"
              : "bg-[#1f293d]/90 text-white border-white/15 hover:bg-[#2b3954] hover:border-white/25 shadow-sm"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
        </button>

        <div className="text-sm sm:text-base font-extrabold text-white tracking-tight">
          <span>{totalCount}</span> <span className="font-semibold text-slate-300">orders</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-[#170d2f] text-slate-200 border border-white/15 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold focus:outline-none focus:border-amber-400 cursor-pointer shadow-sm"
          >
            <option value="shipDateAsc" className="bg-[#170d2f] text-white">Ship-by date (ascending)</option>
            <option value="shipDateDesc" className="bg-[#170d2f] text-white">Ship-by date (descending)</option>
            <option value="orderDateDesc" className="bg-[#170d2f] text-white">Order date (newest first)</option>
            <option value="orderDateAsc" className="bg-[#170d2f] text-white">Order date (oldest first)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Results per page Dropdown */}
        <div className="relative">
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="appearance-none bg-[#170d2f] text-slate-200 border border-white/15 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold focus:outline-none focus:border-amber-400 cursor-pointer shadow-sm"
          >
            <option value={10} className="bg-[#170d2f] text-white">Results per page: 10</option>
            <option value={25} className="bg-[#170d2f] text-white">Results per page: 25</option>
            <option value={50} className="bg-[#170d2f] text-white">Results per page: 50</option>
            <option value={100} className="bg-[#170d2f] text-white">Results per page: 100</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Set Table Preferences Button */}
        <button
          type="button"
          onClick={() => alert("Table preferences saved for this session.")}
          className="btn btn-sm btn-ghost bg-[#170d2f] text-slate-200 border border-white/15 rounded-xl hover:bg-white/10 hover:border-white/25 px-3 py-1.5 text-xs font-medium cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span>Set Table Preferences</span>
        </button>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="btn btn-sm btn-ghost bg-[#170d2f] text-slate-200 border border-white/15 rounded-xl hover:bg-white/10 hover:border-white/25 px-3 py-1.5 text-xs font-medium cursor-pointer"
          title="Refresh orders list"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-300 ${isRefreshing ? "animate-spin text-amber-400" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default OrdersToolbar;
