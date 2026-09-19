"use client";

import React from "react";
import { Search, ArrowUpDown, RotateCcw, RefreshCw } from "lucide-react";

export type OrderStatusFilter =
  | "ALL"
  | "PENDING"
  | "PROCESSING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatusFilter = "ALL" | "PAID" | "UNPAID" | "REFUNDED";

interface CustomerOrdersFilterBarProps {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  statusFilter: OrderStatusFilter;
  onStatusChange: (v: OrderStatusFilter) => void;
  paymentFilter: PaymentStatusFilter;
  onPaymentChange: (v: PaymentStatusFilter) => void;
  sortBy: string;
  onSortChange: (v: string) => void;
  onReset: () => void;
  onRefresh: () => void;
  isFetching?: boolean;
  totalCount?: number;
}

const STATUS_TABS: { label: string; value: OrderStatusFilter; dot: string }[] =
  [
    { label: "All", value: "ALL", dot: "bg-slate-400" },
    { label: "Pending", value: "PENDING", dot: "bg-amber-400" },
    { label: "Processing", value: "PROCESSING", dot: "bg-yellow-400" },
    { label: "Confirmed", value: "CONFIRMED", dot: "bg-sky-400" },
    { label: "Shipped", value: "SHIPPED", dot: "bg-cyan-400" },
    { label: "Delivered", value: "DELIVERED", dot: "bg-emerald-400" },
    { label: "Cancelled", value: "CANCELLED", dot: "bg-red-400" },
  ];

const CustomerOrdersFilterBar: React.FC<CustomerOrdersFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  paymentFilter,
  onPaymentChange,
  sortBy,
  onSortChange,
  onReset,
  onRefresh,
  isFetching,
  totalCount = 0,
}) => {
  const hasActiveFilters =
    Boolean(searchTerm) ||
    statusFilter !== "ALL" ||
    paymentFilter !== "ALL" ||
    sortBy !== "newest";

  return (
    <div className="flex flex-col gap-3 p-4 bg-white/[0.03] border-b border-white/10 select-none">
      {/* Row 1: search + controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Order #, product, vendor, transaction ID…"
            className="input input-sm w-full pl-9 pr-3 rounded-xl bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Payment Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
              Payment:
            </span>
            <select
              value={paymentFilter}
              onChange={(e) =>
                onPaymentChange(e.target.value as PaymentStatusFilter)
              }
              className="select select-sm rounded-xl bg-[#120824] border-white/15 text-slate-200 text-xs font-semibold focus:border-emerald-400 focus:outline-none"
            >
              <option value="ALL">All Payments</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="select select-sm rounded-xl bg-[#120824] border-white/15 text-slate-200 text-xs font-semibold focus:border-emerald-400 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest_amount">Highest Amount</option>
              <option value="lowest_amount">Lowest Amount</option>
            </select>
          </div>

          {/* Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            title="Refresh"
            className="btn btn-ghost btn-sm btn-square text-slate-400 hover:text-emerald-400 border border-white/10 rounded-xl"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin text-emerald-400" : ""}`}
            />
          </button>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-ghost btn-sm gap-1 text-xs font-bold text-emerald-400 hover:bg-emerald-400/10 border border-emerald-400/20 rounded-xl cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Row 2: status tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onStatusChange(tab.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              statusFilter === tab.value
                ? "bg-emerald-400/10 border-emerald-400/40 text-emerald-400"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${tab.dot}`} />
            {tab.label}
          </button>
        ))}
        <span className="ml-auto text-[11px] text-slate-500 font-mono self-center">
          {totalCount} order{totalCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};

export default CustomerOrdersFilterBar;
