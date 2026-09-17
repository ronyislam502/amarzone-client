"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Trophy,
  Store,
  Star,
  Users,
  ShieldCheck,
  Flame,
  ExternalLink,
  ShieldAlert,
  AlertOctagon,
  FileText,
} from "lucide-react";
import {
  TDashboardTopLists,
  TDashboardReviews,
  TDashboardMarketplaceHealth,
} from "@/src/types/dashboard";

interface AdminTopPerformanceProps {
  topLists?: TDashboardTopLists;
  reviews?: TDashboardReviews;
  marketplaceHealth?: TDashboardMarketplaceHealth;
}

export const AdminTopPerformance: React.FC<AdminTopPerformanceProps> = ({
  topLists,
  reviews,
  marketplaceHealth,
}) => {
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<"products" | "vendors" | "customers">("products");

  const topProducts = topLists?.topSellingProducts || [];
  const topVendors = topLists?.topVendors || [];
  const topCustomers = topLists?.topCustomers || [];

  const averageRating = reviews?.averageRating ?? 5.0;
  const totalReviews = reviews?.totalReviews ?? 0;
  const ratingDist = reviews?.ratingDistribution || {};

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Column 1 & 2: Top Leaderboard with Tabs */}
      <div className="lg:col-span-2 card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-amber-400">
                <Trophy className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Marketplace Leaderboard
                </h2>
                <p className="text-xs text-slate-400">
                  Top performing merchandise, merchant partners, and highest-volume buyers.
                </p>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex items-center bg-[#120824] border border-white/15 rounded-2xl p-1 gap-1 self-start sm:self-auto shadow-inner">
              <button
                type="button"
                onClick={() => setActiveLeaderboardTab("products")}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeLeaderboardTab === "products"
                    ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Top Products
              </button>
              <button
                type="button"
                onClick={() => setActiveLeaderboardTab("vendors")}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeLeaderboardTab === "vendors"
                    ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Top Vendors
              </button>
              <button
                type="button"
                onClick={() => setActiveLeaderboardTab("customers")}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeLeaderboardTab === "customers"
                    ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Top Customers
              </button>
            </div>
          </div>

          {/* Tab 1: Top Selling Products */}
          {activeLeaderboardTab === "products" && (
            <div className="space-y-2.5">
              {topProducts.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  No top selling product data available.
                </div>
              ) : (
                topProducts.map((prod, index) => (
                  <div
                    key={prod._id || index}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#120824]/60 border border-white/5 hover:border-white/15 transition-all gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 font-mono text-xs font-black flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      {prod.thumbnail && (
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 border border-white/10 relative shrink-0">
                          <Image
                            src={prod.thumbnail}
                            alt={prod.title || "Product"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs text-white truncate max-w-xs sm:max-w-md">
                          {prod.title || "Unnamed Product"}
                        </div>
                        {prod.asin && (
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            ASIN: {prod.asin}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono">
                      <div className="text-xs font-black text-amber-400">
                        {prod.totalSold.toLocaleString()} sold
                      </div>
                      <div className="text-[10px] text-slate-400">Units</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Top Vendors */}
          {activeLeaderboardTab === "vendors" && (
            <div className="space-y-2.5">
              {topVendors.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  No top vendor performance records available.
                </div>
              ) : (
                topVendors.map((vendor, index) => (
                  <div
                    key={vendor._id || index}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#120824]/60 border border-white/5 hover:border-white/15 transition-all gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 font-mono text-xs font-black flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs text-white truncate">
                          {vendor.name || "Vendor Partner"}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {vendor.email}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono">
                      <div className="text-xs font-black text-emerald-400">
                        {formatCurrency(vendor.totalRevenue || 0)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {vendor.totalOrders} order{vendor.totalOrders === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Top Customers */}
          {activeLeaderboardTab === "customers" && (
            <div className="space-y-2.5">
              {topCustomers.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  No customer order volume records available.
                </div>
              ) : (
                topCustomers.map((cust, index) => (
                  <div
                    key={cust._id || index}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#120824]/60 border border-white/5 hover:border-white/15 transition-all gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-indigo-400/10 border border-indigo-400/20 text-indigo-400 font-mono text-xs font-black flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs text-white truncate">
                          {cust.name || "Customer"}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {cust.email}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono">
                      <div className="text-xs font-black text-indigo-300">
                        {formatCurrency(cust.totalSpent || 0)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {cust.totalOrders} order{cust.totalOrders === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Column 3: Satisfaction Ratings & Health Guard */}
      <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none z-20" />
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-bl from-emerald-500/15 via-teal-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-emerald-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </span>
              <div>
                <h3 className="text-sm font-black text-white">Trust & Quality</h3>
                <p className="text-[11px] text-slate-400">Customer feedback and dispute alerts</p>
              </div>
            </div>
          </div>

          {/* Rating Score Badge */}
          <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Average Rating
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-amber-400 font-mono">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Based on {totalReviews.toLocaleString()} verified reviews
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex text-amber-400 gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= Math.round(averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-600"
                    }`}
                  />
                ))}
              </div>
              <span className="badge badge-success badge-outline text-[10px] font-bold mt-2">
                Healthy Score
              </span>
            </div>
          </div>

          {/* Star Rating Distribution Bars */}
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDist[star] || 0;
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400 w-4 text-right">{star}★</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 w-8 text-right font-bold">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Marketplace Health Indicators */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Health & Integrity Alerts
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-[#120824]/60 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Open Disputes</span>
                <span
                  className={`font-mono font-black ${
                    (marketplaceHealth?.openDisputes ?? 0) > 0 ? "text-rose-400" : "text-emerald-400"
                  }`}
                >
                  {marketplaceHealth?.openDisputes ?? 0}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#120824]/60 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">SLA Violations</span>
                <span
                  className={`font-mono font-black ${
                    (marketplaceHealth?.activeSlaViolations ?? 0) > 0 ? "text-amber-400" : "text-emerald-400"
                  }`}
                >
                  {marketplaceHealth?.activeSlaViolations ?? 0}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#120824]/60 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Fraud Alerts</span>
                <span
                  className={`font-mono font-black ${
                    (marketplaceHealth?.fraudAlerts ?? 0) > 0 ? "text-rose-400" : "text-emerald-400"
                  }`}
                >
                  {marketplaceHealth?.fraudAlerts ?? 0}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#120824]/60 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Suspended Vendors</span>
                <span className="font-mono font-black text-amber-400">
                  {marketplaceHealth?.suspendedVendors ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTopPerformance;
