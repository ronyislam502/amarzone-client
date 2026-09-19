"use client";

import React from "react";
import {
  DollarSign,
  Package,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Percent,
} from "lucide-react";

interface AnalyticsKpiCardsProps {
  totalRevenue: number;
  totalOrders: number;
  totalUnits: number;
  aov: number;
  paidRate: number;
}

export const AnalyticsKpiCards: React.FC<AnalyticsKpiCardsProps> = ({
  totalRevenue = 0,
  totalOrders = 0,
  totalUnits = 0,
  aov = 0,
  paidRate = 100,
}) => {
  const cards = [
    {
      label: "Total Sales Revenue",
      value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: "Gross vendor earnings",
      icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
      glowBorder: "via-emerald-400/40",
      iconBg: "bg-emerald-400/10 border-emerald-400/20",
      badge: "+18.4%",
      badgeClass: "badge-success bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    },
    {
      label: "Total Order Volume",
      value: totalOrders.toString(),
      subtext: "Total placed customer orders",
      icon: <Package className="w-5 h-5 text-amber-400" />,
      glowBorder: "via-amber-400/40",
      iconBg: "bg-amber-400/10 border-amber-400/20",
      badge: "Orders",
      badgeClass: "badge-warning bg-amber-500/10 text-amber-300 border-amber-500/30",
    },
    {
      label: "Average Order Value",
      value: `$${aov.toFixed(2)}`,
      subtext: "Revenue per placed order",
      icon: <TrendingUp className="w-5 h-5 text-cyan-400" />,
      glowBorder: "via-cyan-400/40",
      iconBg: "bg-cyan-400/10 border-cyan-400/20",
      badge: "AOV",
      badgeClass: "badge-info bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    },
    {
      label: "Total Units Sold",
      value: totalUnits.toLocaleString(),
      subtext: `${totalOrders > 0 ? (totalUnits / totalOrders).toFixed(1) : 1} items / order avg`,
      icon: <ShoppingBag className="w-5 h-5 text-purple-400" />,
      glowBorder: "via-purple-400/40",
      iconBg: "bg-purple-400/10 border-purple-400/20",
      badge: "Units",
      badgeClass: "badge-secondary bg-purple-500/10 text-purple-300 border-purple-500/30",
    },
    {
      label: "Payment Success Rate",
      value: `${paidRate.toFixed(1)}%`,
      subtext: "Verified paid order volume",
      icon: <CreditCard className="w-5 h-5 text-sky-400" />,
      glowBorder: "via-sky-400/40",
      iconBg: "bg-sky-400/10 border-sky-400/20",
      badge: "Healthy",
      badgeClass: "badge-success bg-sky-500/10 text-sky-300 border-sky-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl p-5 hover:border-white/20 transition-all"
        >
          {/* Top glowing line */}
          <div
            className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent ${card.glowBorder} to-transparent pointer-events-none`}
          />

          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                {card.label}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {card.value}
              </div>
            </div>
            <div className={`p-2.5 rounded-xl border ${card.iconBg} shrink-0`}>
              {card.icon}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{card.subtext}</span>
            <span className={`badge badge-sm font-extrabold text-[10px] px-2 py-0.5 border ${card.badgeClass}`}>
              {card.badge}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsKpiCards;
