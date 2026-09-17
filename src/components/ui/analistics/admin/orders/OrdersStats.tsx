import React from "react";
import { ShoppingBag, DollarSign, Percent, Clock } from "lucide-react";

export interface OrdersStatsProps {
  totalOrders?: number;
  grossRevenue?: number;
  totalCommission?: number;
  pendingOrdersCount?: number;
}

export const OrdersStats: React.FC<OrdersStatsProps> = ({
  totalOrders = 0,
  grossRevenue = 0,
  totalCommission = 0,
  pendingOrdersCount = 0,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
      {/* Stat 1: Total Orders */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Total Orders
            </span>
            <div className="text-3xl font-black text-amber-400 tracking-tight">
              {totalOrders.toLocaleString()}
            </div>
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <span className="text-emerald-400">↗︎</span> Realtime marketplace volume
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20 text-amber-400 shadow-sm shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stat 2: Gross Merchandise Volume (GMV) */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none z-20" />
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Gross Volume (GMV)
            </span>
            <div className="text-3xl font-black text-emerald-400 tracking-tight">
              ${grossRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] font-bold text-emerald-400/90 flex items-center gap-1">
              <span>●</span> Cumulative order value
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 shadow-sm shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stat 3: Total Platform Commission */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent pointer-events-none z-20" />
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Platform Commission
            </span>
            <div className="text-3xl font-black text-purple-300 tracking-tight">
              ${totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] font-bold text-purple-300/90 flex items-center gap-1">
              <span>★</span> Amarzone revenue cut
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-300 shadow-sm shrink-0">
            <Percent className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stat 4: Pending / Unshipped Orders */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none z-20" />
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Pending / Unshipped
            </span>
            <div className="text-3xl font-black text-cyan-400 tracking-tight">
              {pendingOrdersCount.toLocaleString()}
            </div>
            <div className="text-[11px] font-bold text-cyan-400/90 flex items-center gap-1">
              <span>⏳</span> Awaiting fulfillment
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400 shadow-sm shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersStats;
