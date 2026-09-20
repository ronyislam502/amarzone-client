"use client";

import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Star,
  ShieldAlert,
  Flame,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import {
  TDashboardInventory,
  TDashboardReviews,
  TDashboardMarketplaceHealth,
  TDashboardOverviewCards,
} from "@/src/types/dashboard";

interface QuickStatsStripProps {
  inventory?: TDashboardInventory;
  reviews?: TDashboardReviews;
  marketplaceHealth?: TDashboardMarketplaceHealth;
  overviewCards?: TDashboardOverviewCards;
}

export const QuickStatsStrip: React.FC<QuickStatsStripProps> = ({
  inventory,
  reviews,
  marketplaceHealth,
  overviewCards,
}) => {
  const lowStock = inventory?.lowStockProducts || 0;
  const outOfStock = inventory?.outOfStockInventory || 0;
  const avgRating = reviews?.averageRating ?? 5.0;
  const totalReviews = reviews?.totalReviews ?? 0;
  const openDisputes = marketplaceHealth?.openDisputes ?? 0;
  const slaViolations = marketplaceHealth?.activeSlaViolations ?? 0;
  const fraudAlerts = marketplaceHealth?.fraudAlerts ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat 1: Low Stock & Out of Stock Warning */}
      <div className="p-4 rounded-2xl bg-[#170d2f] border border-white/10 shadow-xl flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
            Inventory Stock Alert
          </span>
          <div className="text-xl font-black text-amber-400 font-mono">
            {lowStock} Low Stock
          </div>
          <p className="text-[10px] text-slate-400">
            {outOfStock} out of stock items
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      {/* Stat 2: Customer Satisfaction Rating */}
      <div className="p-4 rounded-2xl bg-[#170d2f] border border-white/10 shadow-xl flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
            Customer Satisfaction
          </span>
          <div className="text-xl font-black text-amber-300 font-mono flex items-center gap-1.5">
            <span>{avgRating.toFixed(1)}</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
          </div>
          <p className="text-[10px] text-slate-400">
            Across {totalReviews.toLocaleString()} verified reviews
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
          <Star className="w-5 h-5 fill-amber-400" />
        </div>
      </div>

      {/* Stat 3: Open Disputes & Fraud Alerts */}
      <Link
        href="/admin/disputes"
        className="p-4 rounded-2xl bg-[#170d2f] border border-white/10 hover:border-rose-400/50 transition-all shadow-xl flex items-center justify-between group cursor-pointer"
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              Disputes & Fraud
            </span>
            <span className="text-[9px] text-rose-400 opacity-0 group-hover:opacity-100 transition">
              View &rarr;
            </span>
          </div>
          <div
            className={`text-xl font-black font-mono ${
              openDisputes + fraudAlerts > 0 ? "text-rose-400" : "text-emerald-400"
            }`}
          >
            {openDisputes + fraudAlerts === 0
              ? "Zero Issues"
              : `${openDisputes} Disputes / ${fraudAlerts} Fraud`}
          </div>
          <p className="text-[10px] text-slate-400">
            {openDisputes === 0 ? "No active dispute cases" : "Immediate review needed"}
          </p>
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110 ${
            openDisputes + fraudAlerts > 0
              ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}
        >
          <ShieldAlert className="w-5 h-5" />
        </div>
      </Link>

      {/* Stat 4: SLA Compliance Integrity */}
      <div className="p-4 rounded-2xl bg-[#170d2f] border border-white/10 shadow-xl flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
            SLA Delivery Health
          </span>
          <div className="text-xl font-black text-cyan-400 font-mono">
            {slaViolations === 0 ? "100% Compliant" : `${slaViolations} Violations`}
          </div>
          <p className="text-[10px] text-slate-400">
            Merchant dispatch speed audit
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default QuickStatsStrip;
