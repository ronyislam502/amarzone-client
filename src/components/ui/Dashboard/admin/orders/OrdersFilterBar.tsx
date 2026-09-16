"use client";

import React from "react";
import { Search, Filter, RotateCcw, ArrowUpDown } from "lucide-react";

export interface OrdersFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedOrderStatus: string;
  onOrderStatusChange: (status: string) => void;
  selectedPaymentStatus: string;
  onPaymentStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onResetFilters: () => void;
}

export const OrdersFilterBar: React.FC<OrdersFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedOrderStatus,
  onOrderStatusChange,
  selectedPaymentStatus,
  onPaymentStatusChange,
  sortBy,
  onSortChange,
  onResetFilters,
}) => {
  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedOrderStatus !== "ALL" ||
    selectedPaymentStatus !== "ALL" ||
    sortBy !== "newest";

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 bg-white/[0.03] border-b border-white/10 select-none">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Order #, Customer, Vendor, Txn ID..."
          className="input input-sm w-full pl-9 pr-3 rounded-xl bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none text-xs"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Order Status Select */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
            Status:
          </span>
          <select
            value={selectedOrderStatus}
            onChange={(e) => onOrderStatusChange(e.target.value)}
            className="select select-sm rounded-xl bg-[#120824] border-white/15 text-slate-200 text-xs font-semibold focus:border-amber-400 focus:outline-none"
          >
            <option value="ALL">All Order Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="UNSHIPPED">Unshipped</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Payment Status Select */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
            Payment:
          </span>
          <select
            value={selectedPaymentStatus}
            onChange={(e) => onPaymentStatusChange(e.target.value)}
            className="select select-sm rounded-xl bg-[#120824] border-white/15 text-slate-200 text-xs font-semibold focus:border-amber-400 focus:outline-none"
          >
            <option value="ALL">All Payments</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="select select-sm rounded-xl bg-[#120824] border-white/15 text-slate-200 text-xs font-semibold focus:border-amber-400 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_amount">Highest Amount</option>
            <option value="lowest_amount">Lowest Amount</option>
          </select>
        </div>

        {/* Reset Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="btn btn-ghost btn-sm gap-1 text-xs font-bold text-amber-400 hover:bg-amber-400/10 border border-amber-400/20 rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default OrdersFilterBar;
