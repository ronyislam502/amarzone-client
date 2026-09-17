"use client";

import React from "react";
import {
  Users,
  Store,
  UserCheck,
  Package,
  ShoppingBag,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import {
  TDashboardUsers,
  TDashboardProducts,
  TDashboardOverviewCards,
} from "@/src/types/dashboard";

interface EntityCountersGridProps {
  users?: TDashboardUsers;
  products?: TDashboardProducts;
  overviewCards?: TDashboardOverviewCards;
}

export const EntityCountersGrid: React.FC<EntityCountersGridProps> = ({
  users,
  products,
  overviewCards,
}) => {
  const totalUsers = users?.totalUsers || 0;
  const totalVendors = users?.totalVendors || 0;
  const activeVendors = users?.activeVendors || 0;
  const totalCustomers = users?.totalCustomers || 0;
  const newUsersThisMonth = users?.newUsersThisMonth || 0;

  const totalProducts = products?.totalProducts || 0;
  const activeProducts = products?.activeProducts || 0;
  const categoriesCount = products?.categoriesCount || 0;

  const totalOrders = overviewCards?.totalOrders || 0;
  const todayOrders = overviewCards?.todayOrders || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Total Users */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5 group hover:border-indigo-400/40 transition-all">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent pointer-events-none z-20" />
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1 min-w-0">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Total Users
            </span>
            <div className="text-2xl sm:text-3xl font-black text-indigo-300 tracking-tight font-mono">
              {totalUsers.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <span className="text-emerald-400">+{newUsersThisMonth}</span>
              <span>new this month</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 shadow-sm shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Total Vendors */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5 group hover:border-amber-400/40 transition-all">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1 min-w-0">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Total Vendors
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight font-mono">
              {totalVendors.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <span className="text-emerald-400">●</span>
              <span>{activeVendors} active stores</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20 text-amber-400 shadow-sm shrink-0">
            <Store className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Total Customers */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5 group hover:border-cyan-400/40 transition-all">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none z-20" />
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1 min-w-0">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Total Customers
            </span>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight font-mono">
              {totalCustomers.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <span className="text-cyan-400">↗</span>
              <span>Verified buyers</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400 shadow-sm shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. Total Products */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5 group hover:border-purple-400/40 transition-all">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent pointer-events-none z-20" />
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1 min-w-0">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Total Products
            </span>
            <div className="text-2xl sm:text-3xl font-black text-purple-300 tracking-tight font-mono">
              {totalProducts.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <span className="text-purple-400 font-black">{activeProducts}</span>
              <span>active in {categoriesCount} cats</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 shadow-sm shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 5. Total Orders */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5 group hover:border-emerald-400/40 transition-all">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none z-20" />
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1 min-w-0">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Total Orders
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight font-mono">
              {totalOrders.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <span className="text-emerald-400">+{todayOrders}</span>
              <span>today</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 shadow-sm shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityCountersGrid;
