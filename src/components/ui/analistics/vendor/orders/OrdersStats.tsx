"use client";

import React, { useMemo } from "react";
import { Clock, Package, Truck, CheckCircle2, XCircle } from "lucide-react";
import { useMyOrdersQuery } from "@/src/redux/features/order/orderApi";

export interface OrdersStatsProps {
  totalPending?: number;
  totalUnshipped?: number;
  totalShipped?: number;
  totalCanceled?: number;
  totalDelivered?: number;
  activeStatus?: string;
  onStatusSelect?: (status: string) => void;
}

const OrdersStats = ({
  totalPending = 0,
  totalUnshipped = 0,
  totalShipped = 0,
  totalDelivered = 0,
  totalCanceled = 0,
  activeStatus,
  onStatusSelect,
}: OrdersStatsProps) => {
  const { data: apiResponse } = useMyOrdersQuery(
    { limit: 100 },
    { refetchOnMountOrArgChange: false }
  );

  const counts = useMemo(() => {
    const rawOrders = apiResponse?.data;
    if (Array.isArray(rawOrders)) {
      let pending = 0;
      let unshipped = 0;
      let shipped = 0;
      let delivered = 0;
      let canceled = 0;

      rawOrders.forEach((ord: any) => {
        const s = ord.status?.toUpperCase();
        if (s === "PENDING") pending++;
        else if (s === "UNSHIPPED") unshipped++;
        else if (s === "SHIPPED") shipped++;
        else if (s === "DELIVERED") delivered++;
        else if (s === "CANCELLED" || s === "CANCELED") canceled++;
      });

      return {
        pending,
        unshipped,
        shipped,
        delivered,
        canceled,
      };
    }
    return {
      pending: totalPending ?? 0,
      unshipped: totalUnshipped ?? 0,
      shipped: totalShipped ?? 0,
      delivered: totalDelivered ?? 0,
      canceled: totalCanceled ?? 0,
    };
  }, [apiResponse, totalPending, totalUnshipped, totalShipped, totalDelivered, totalCanceled]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Stat 1: Total Pending Orders */}
      <div
        onClick={() => onStatusSelect?.("PENDING")}
        className={`card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border shadow-2xl p-5 transition-all cursor-pointer hover:border-amber-400/50 ${activeStatus === "PENDING" ? "border-amber-400 ring-2 ring-amber-400/30" : "border-white/10"
          }`}
      >
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Pending
            </span>
            <div className="text-3xl font-black text-amber-400 tracking-tight">{counts.pending}</div>
            <div className="text-[11px] font-bold text-amber-300/80 flex items-center gap-1">
              <span>⏱</span> Awaiting payment
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20 text-amber-400 shadow-sm shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stat 2: Total Unshipped Orders */}
      <div
        onClick={() => onStatusSelect?.("UNSHIPPED")}
        className={`card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border shadow-2xl p-5 transition-all cursor-pointer hover:border-sky-400/50 ${activeStatus === "UNSHIPPED" ? "border-sky-400 ring-2 ring-sky-400/30" : "border-white/10"
          }`}
      >
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-sky-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Unshipped
            </span>
            <div className="text-3xl font-black text-sky-400 tracking-tight">{counts.unshipped}</div>
            <div className="text-[11px] font-bold text-sky-300/80 flex items-center gap-1">
              <span>📦</span> Ready to dispatch
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 text-sky-400 shadow-sm shrink-0">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stat 3: Total Shipped Orders */}
      <div
        onClick={() => onStatusSelect?.("SHIPPED")}
        className={`card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border shadow-2xl p-5 transition-all cursor-pointer hover:border-indigo-400/50 ${activeStatus === "SHIPPED" ? "border-indigo-400 ring-2 ring-indigo-400/30" : "border-white/10"
          }`}
      >
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Shipped
            </span>
            <div className="text-3xl font-black text-indigo-400 tracking-tight">{counts.shipped}</div>
            <div className="text-[11px] font-bold text-indigo-300/80 flex items-center gap-1">
              <span>🚚</span> In carrier transit
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 shadow-sm shrink-0">
            <Truck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stat 4: Total Delivered Orders */}
      <div
        onClick={() => onStatusSelect?.("DELIVERED")}
        className={`card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border shadow-2xl p-5 transition-all cursor-pointer hover:border-emerald-400/50 ${activeStatus === "DELIVERED" ? "border-emerald-400 ring-2 ring-emerald-400/30" : "border-white/10"
          }`}
      >
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Delivered
            </span>
            <div className="text-3xl font-black text-emerald-400 tracking-tight">{counts.delivered}</div>
            <div className="text-[11px] font-bold text-emerald-400/90 flex items-center gap-1">
              <span>✓</span> Completed fulfillment
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 shadow-sm shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stat 5: Total Canceled Orders */}
      <div
        onClick={() => onStatusSelect?.("CANCELED")}
        className={`card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border shadow-2xl p-5 transition-all cursor-pointer hover:border-rose-400/50 ${activeStatus === "CANCELED" ? "border-rose-400 ring-2 ring-rose-400/30" : "border-white/10"
          }`}
      >
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-rose-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-rose-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Canceled
            </span>
            <div className="text-3xl font-black text-rose-400 tracking-tight">{counts.canceled}</div>
            <div className="text-[11px] font-bold text-rose-300/80 flex items-center gap-1">
              <span>✕</span> Voided or expired
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-400 shadow-sm shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersStats;
