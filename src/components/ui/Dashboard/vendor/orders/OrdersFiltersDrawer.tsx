"use client";

import React, { useState } from "react";
import { Search, RotateCcw, Filter, Calendar } from "lucide-react";

interface OrdersFiltersDrawerProps {
  isOpen: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onReset: () => void;
}

export const OrdersFiltersDrawer: React.FC<OrdersFiltersDrawerProps> = ({
  isOpen,
  searchTerm,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] border border-white/15 shadow-xl rounded-2xl p-4 sm:p-5 transition-all">
      {/* Top subtle glow */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 flex-1">
          {/* Filter 1: Order ID / ASIN Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Search Order ID or ASIN</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. 112-8492019 or B09X8K9L2M"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#090d16] text-slate-200 border border-white/15 rounded-xl px-3.5 py-2 text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter 2: Date Range */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Date Placed</span>
            </label>
            <select
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="w-full bg-[#090d16] text-slate-200 border border-white/15 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-400 transition-colors cursor-pointer shadow-inner"
            >
              <option value="last7">Last 7 days</option>
              <option value="last14">Last 14 days</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>

          {/* Filter 3: Sales Channel */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>Sales Channel</span>
            </label>
            <select
              defaultValue="amarzone.com"
              className="w-full bg-[#090d16] text-slate-200 border border-white/15 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-400 transition-colors cursor-pointer shadow-inner"
            >
              <option value="amarzone.com">Amarzone.com</option>
              <option value="fba">Amarzone Logistics (FBA)</option>
              <option value="all">All Channels</option>
            </select>
          </div>
        </div>

        {/* Filter Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
          <button
            type="button"
            onClick={onReset}
            className="btn btn-sm btn-ghost text-slate-300 hover:text-white border border-white/10 rounded-xl px-3 text-xs font-semibold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersFiltersDrawer;
