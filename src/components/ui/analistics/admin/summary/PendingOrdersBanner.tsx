"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  ArrowUpRight,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertCircle,
  PackageCheck,
} from "lucide-react";
import { TDashboardOverviewCards } from "@/src/types/dashboard";

interface PendingOrdersBannerProps {
  overviewCards?: TDashboardOverviewCards;
}

export const PendingOrdersBanner: React.FC<PendingOrdersBannerProps> = ({
  overviewCards,
}) => {
  const pending = overviewCards?.pendingOrders || 0;
  const processing = overviewCards?.processingOrders || 0;
  const shipped = overviewCards?.shippedOrders || 0;
  const delivered = overviewCards?.deliveredOrders || 0;
  const cancelled = overviewCards?.cancelledOrders || 0;
  const refunded = overviewCards?.refundedOrders || 0;

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6">
      {/* Top glowing accent line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Pending Spotlight Box */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-400/10">
            <Clock className="w-7 h-7 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="badge badge-warning font-black text-slate-950 text-xs px-2.5 py-1">
                Action Attention
              </span>
              <span className="text-xs text-slate-400 font-bold">Fulfillment Backlog</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {pending.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Pending Orders
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-md">
              Awaiting merchant fulfillment review and warehouse processing dispatch.
            </p>
          </div>
        </div>

        {/* Quick Progression Stage Chips & Action Link */}
        <div className="flex flex-wrap items-center gap-3 self-stretch lg:self-auto justify-between lg:justify-end">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {/* Processing */}
            <div className="p-2.5 rounded-xl bg-[#120824] border border-cyan-400/20 text-center min-w-[90px]">
              <div className="text-[10px] uppercase font-bold text-slate-400">Processing</div>
              <div className="font-mono font-black text-cyan-400 text-sm mt-0.5">
                {processing.toLocaleString()}
              </div>
            </div>

            {/* Shipped */}
            <div className="p-2.5 rounded-xl bg-[#120824] border border-blue-400/20 text-center min-w-[90px]">
              <div className="text-[10px] uppercase font-bold text-slate-400">Shipped</div>
              <div className="font-mono font-black text-blue-400 text-sm mt-0.5">
                {shipped.toLocaleString()}
              </div>
            </div>

            {/* Delivered */}
            <div className="p-2.5 rounded-xl bg-[#120824] border border-emerald-400/20 text-center min-w-[90px]">
              <div className="text-[10px] uppercase font-bold text-slate-400">Delivered</div>
              <div className="font-mono font-black text-emerald-400 text-sm mt-0.5">
                {delivered.toLocaleString()}
              </div>
            </div>

            {/* Cancelled/Refunded */}
            <div className="p-2.5 rounded-xl bg-[#120824] border border-rose-400/20 text-center min-w-[90px]">
              <div className="text-[10px] uppercase font-bold text-slate-400">Cancelled</div>
              <div className="font-mono font-black text-rose-400 text-sm mt-0.5">
                {(cancelled + refunded).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Action Link to Orders */}
          <Link
            href="/admin/orders"
            className="btn btn-sm gap-2 font-black bg-amber-400 hover:bg-amber-300 text-slate-950 border-0 rounded-xl shadow-md shadow-amber-400/20 transition-all cursor-pointer"
          >
            <span>Manage Orders</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PendingOrdersBanner;
