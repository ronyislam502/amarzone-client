"use client";

import React from "react";
import {
  DollarSign,
  TrendingUp,
  Percent,
  Wallet,
  Building2,
  Sparkles,
} from "lucide-react";
import { TDashboardOverviewCards } from "@/src/types/dashboard";

interface RevenueBreakdownCardProps {
  overviewCards?: TDashboardOverviewCards;
}

export const RevenueBreakdownCard: React.FC<RevenueBreakdownCardProps> = ({
  overviewCards,
}) => {
  const grossRevenue = overviewCards?.totalRevenue || 0;
  const commission =
    overviewCards?.marketplaceCommission !== undefined
      ? overviewCards.marketplaceCommission
      : grossRevenue * 0.1; // fallback if commission was not split
  const netVendorEarnings =
    overviewCards?.vendorEarnings !== undefined
      ? overviewCards.vendorEarnings
      : Math.max(grossRevenue - commission, 0);

  const commissionPercent =
    grossRevenue > 0 ? ((commission / grossRevenue) * 100).toFixed(1) : "0.0";
  const vendorPercent =
    grossRevenue > 0 ? ((netVendorEarnings / grossRevenue) * 100).toFixed(1) : "0.0";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-7">
      {/* Top glowing accent line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent pointer-events-none z-20" />

      {/* Ambient background glow orbs */}
      <div className="absolute -top-16 -left-16 w-60 h-60 bg-gradient-to-br from-amber-500/20 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-1/4 w-60 h-60 bg-gradient-to-tl from-emerald-600/20 via-cyan-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Dot matrix grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 shadow-sm">
              <DollarSign className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>Revenue & Financial Architecture</span>
                <span className="badge badge-warning badge-xs font-black text-slate-950 uppercase">
                  Verified
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Complete breakdown: Total Gross Volume, Marketplace Platform Commission, and Net Vendor Disbursals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Settled Paid Volume</span>
          </div>
        </div>

        {/* 3 Pillar Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pillar 1: Gross Revenue */}
          <div className="p-5 rounded-2xl bg-[#120824]/80 border border-amber-400/30 shadow-lg relative overflow-hidden group hover:border-amber-400/50 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                  Gross Platform Revenue
                </span>
                <span className="p-1 rounded-lg bg-amber-400/10 text-amber-400">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight font-mono">
                {formatCurrency(grossRevenue)}
              </div>
              <p className="text-[11px] font-medium text-slate-400">
                100% of all completed paid order transactions
              </p>
            </div>
          </div>

          {/* Pillar 2: Marketplace Commission */}
          <div className="p-5 rounded-2xl bg-[#120824]/80 border border-cyan-400/30 shadow-lg relative overflow-hidden group hover:border-cyan-400/50 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/10 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                  Platform Commission
                </span>
                <span className="badge badge-info badge-outline text-[10px] font-mono font-bold">
                  {commissionPercent}%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight font-mono">
                {formatCurrency(commission)}
              </div>
              <p className="text-[11px] font-medium text-slate-400">
                Retained Amarzone marketplace platform fee
              </p>
            </div>
          </div>

          {/* Pillar 3: Revenue Excluding Commission (Vendor Net Payouts) */}
          <div className="p-5 rounded-2xl bg-[#120824]/80 border border-emerald-400/30 shadow-lg relative overflow-hidden group hover:border-emerald-400/50 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                  Revenue (Excl. Commission)
                </span>
                <span className="badge badge-success badge-outline text-[10px] font-mono font-bold">
                  {vendorPercent}%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight font-mono">
                {formatCurrency(netVendorEarnings)}
              </div>
              <p className="text-[11px] font-medium text-slate-400">
                Net merchant payout balance (Gross minus Commission)
              </p>
            </div>
          </div>
        </div>

        {/* Dual Proportional Visual Meter */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Marketplace Retained Share ({commissionPercent}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Merchant Net Payout ({vendorPercent}%)</span>
            </span>
          </div>

          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10 flex">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-l-full transition-all duration-500"
              style={{ width: `${commissionPercent}%` }}
              title={`Commission: ${formatCurrency(commission)} (${commissionPercent}%)`}
            />
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-r-full transition-all duration-500"
              style={{ width: `${vendorPercent}%` }}
              title={`Vendor Payouts: ${formatCurrency(netVendorEarnings)} (${vendorPercent}%)`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueBreakdownCard;
