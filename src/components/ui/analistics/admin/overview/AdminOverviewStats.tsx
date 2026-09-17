"use client";

import React from "react";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import {
  TDashboardOverviewCards,
  TDashboardUsers,
  TDashboardProducts,
  TDashboardInventory,
} from "@/src/types/dashboard";

interface AdminOverviewStatsProps {
  overviewCards?: TDashboardOverviewCards;
  users?: TDashboardUsers;
  products?: TDashboardProducts;
  inventory?: TDashboardInventory;
}

export const AdminOverviewStats: React.FC<AdminOverviewStatsProps> = ({
  overviewCards,
  users,
  products,
  inventory,
}) => {
  const totalRevenue = overviewCards?.totalRevenue || 0;
  const totalOrders = overviewCards?.totalOrders || 0;
  const todayOrders = overviewCards?.todayOrders || 0;
  const totalUsers = users?.totalUsers || 0;
  const totalVendors = users?.totalVendors || 0;
  const activeVendors = users?.activeVendors || 0;
  const totalCustomers = users?.totalCustomers || 0;
  const totalProducts = products?.totalProducts || 0;
  const activeProducts = products?.activeProducts || 0;
  const lowStock = inventory?.lowStockProducts || 0;
  const outOfStock = products?.outOfStockProducts ?? inventory?.outOfStockInventory ?? 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="space-y-4">
      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gross Platform Revenue */}
        <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                Gross Platform Revenue
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                {formatCurrency(totalRevenue)}
              </div>
              <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <span className="text-emerald-400">●</span>
                <span>Settled marketplace volume</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20 text-amber-400 shadow-sm shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none z-20" />
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                Total Orders Placed
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                {totalOrders.toLocaleString()}
              </div>
              <div className="text-[11px] font-bold text-emerald-400/90 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{todayOrders} new order{todayOrders === 1 ? "" : "s"} today</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 shadow-sm shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 3: Platform Community */}
        <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent pointer-events-none z-20" />
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                Registered Community
              </span>
              <div className="text-2xl sm:text-3xl font-black text-indigo-300 tracking-tight">
                {totalUsers.toLocaleString()}
              </div>
              <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <span>{activeVendors} active merchants</span>
                <span>•</span>
                <span>{totalCustomers} customers</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 shadow-sm shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 4: Catalog & Stock Health */}
        <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent pointer-events-none z-20" />
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                Product Catalog
              </span>
              <div className="text-2xl sm:text-3xl font-black text-purple-300 tracking-tight">
                {totalProducts.toLocaleString()}
              </div>
              <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <span className="text-amber-400">{lowStock} low stock</span>
                <span>•</span>
                <span>{activeProducts} active</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 shadow-sm shrink-0">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Quick-Metrics Pipeline Strip */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-xl p-4">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-extrabold uppercase tracking-wider text-[11px]">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Fulfillment Pipeline</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            {/* Pending */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-slate-400">Pending:</span>
              <span className="font-mono font-black text-white">
                {overviewCards?.pendingOrders ?? 0}
              </span>
            </div>

            {/* Processing / Unshipped */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-slate-400">Processing:</span>
              <span className="font-mono font-black text-white">
                {overviewCards?.processingOrders ?? 0}
              </span>
            </div>

            {/* Shipped */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span className="text-slate-400">Shipped:</span>
              <span className="font-mono font-black text-white">
                {overviewCards?.shippedOrders ?? 0}
              </span>
            </div>

            {/* Delivered */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Delivered:</span>
              <span className="font-mono font-black text-white">
                {overviewCards?.deliveredOrders ?? 0}
              </span>
            </div>

            {/* Cancelled */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="text-slate-400">Cancelled:</span>
              <span className="font-mono font-black text-white">
                {overviewCards?.cancelledOrders ?? 0}
              </span>
            </div>

            {/* Refunded */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <span className="text-slate-400">Refunded:</span>
              <span className="font-mono font-black text-white">
                {overviewCards?.refundedOrders ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewStats;
