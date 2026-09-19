import React from "react";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { TOrder } from "@/src/types/order";

interface CustomerOrdersStatsProps {
  orders: TOrder[];
  isLoading?: boolean;
}

const STAT_CONFIGS = [
  {
    key: "total",
    label: "Total Orders",
    sub: "All time",
    icon: ShoppingBag,
    iconBg: "bg-amber-400/10",
    iconBorder: "border-amber-400/20",
    iconColor: "text-amber-400",
    valueLine: "from-transparent via-amber-400/60",
    glow: "from-amber-500/20",
    valueColor: "text-amber-400",
  },
  {
    key: "spent",
    label: "Total Spent",
    sub: "Cumulative spend",
    icon: DollarSign,
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    valueLine: "from-transparent via-emerald-400/60",
    glow: "from-emerald-500/20",
    valueColor: "text-emerald-400",
  },
  {
    key: "pending",
    label: "Pending",
    sub: "Awaiting dispatch",
    icon: Clock,
    iconBg: "bg-amber-400/10",
    iconBorder: "border-amber-400/20",
    iconColor: "text-amber-400",
    valueLine: "from-transparent via-amber-400/40",
    glow: "from-amber-500/15",
    valueColor: "text-amber-400",
  },
  {
    key: "shipped",
    label: "Shipped",
    sub: "On the way",
    icon: Truck,
    iconBg: "bg-cyan-500/10",
    iconBorder: "border-cyan-500/20",
    iconColor: "text-cyan-400",
    valueLine: "from-transparent via-cyan-400/60",
    glow: "from-cyan-500/20",
    valueColor: "text-cyan-400",
  },
  {
    key: "delivered",
    label: "Delivered",
    sub: "Successfully received",
    icon: CheckCircle2,
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    valueLine: "from-transparent via-emerald-400/60",
    glow: "from-emerald-500/20",
    valueColor: "text-emerald-400",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    sub: "Refunded / cancelled",
    icon: XCircle,
    iconBg: "bg-red-500/10",
    iconBorder: "border-red-500/20",
    iconColor: "text-red-400",
    valueLine: "from-transparent via-red-400/60",
    glow: "from-red-500/20",
    valueColor: "text-red-400",
  },
];

const CustomerOrdersStats: React.FC<CustomerOrdersStatsProps> = ({
  orders,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-[#170d2f] border border-white/10 p-5 h-[110px] animate-pulse"
          />
        ))}
      </div>
    );
  }

  const total = orders.length;
  const pending = orders.filter((o) =>
    ["PENDING", "PROCESSING", "CONFIRMED", "UNSHIPPED"].includes(
      o.status?.toUpperCase()
    )
  ).length;
  const shipped = orders.filter(
    (o) => o.status?.toUpperCase() === "SHIPPED"
  ).length;
  const delivered = orders.filter(
    (o) => o.status?.toUpperCase() === "DELIVERED"
  ).length;
  const cancelled = orders.filter(
    (o) => o.status?.toUpperCase() === "CANCELLED"
  ).length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const VALUES: Record<string, string | number> = {
    total,
    spent: `$${totalSpent.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    pending,
    shipped,
    delivered,
    cancelled,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {STAT_CONFIGS.map((cfg) => {
        const Icon = cfg.icon;
        return (
          <div
            key={cfg.key}
            className="relative overflow-hidden rounded-2xl bg-[#170d2f] border border-white/10 shadow-2xl p-5 select-none"
          >
            {/* Top accent line */}
            <div
              className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r ${cfg.valueLine} to-transparent pointer-events-none z-20`}
            />
            {/* Glow orb */}
            <div
              className={`absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br ${cfg.glow} to-transparent rounded-full blur-2xl pointer-events-none opacity-30`}
            />
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                  {cfg.label}
                </span>
                <div
                  className={`text-2xl font-black tracking-tight ${cfg.valueColor}`}
                >
                  {VALUES[cfg.key]}
                </div>
                <div className="text-[11px] font-bold text-slate-400">
                  {cfg.sub}
                </div>
              </div>
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-sm shrink-0 ${cfg.iconBg} ${cfg.iconBorder} ${cfg.iconColor}`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomerOrdersStats;
