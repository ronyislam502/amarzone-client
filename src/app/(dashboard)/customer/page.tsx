"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Package,
  Bell,
  Heart,
  User,
  ShoppingBag,
  CheckCircle2,
  CheckCheck,
  Truck,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  XCircle,
  MessageSquare,
  MapPin,
  Eye,
  Hash,
  Store,
  BarChart3,
  Zap,
} from "lucide-react";
import { useNotification } from "@/src/context/NotificationContext";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useMyOrdersQuery } from "@/src/redux/features/order/orderApi";
import { TOrder } from "@/src/types/order";
import { OrderDetailsModal } from "@/src/components/ui/analistics/admin/orders/OrderDetailsModal";

/* ─────────────────────────────────────────────────────────── */
/*  Helpers                                                    */
/* ─────────────────────────────────────────────────────────── */

const fmt = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const fmtTimeAgo = (dateString?: string) => {
  if (!dateString) return "Just now";
  const diff = Date.now() - new Date(dateString).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "Just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const getStatusBadge = (status: string) => {
  const s = status?.toUpperCase();
  if (s === "DELIVERED")
    return (
      <span className="badge badge-success badge-sm text-slate-950 font-black gap-1">
        <CheckCircle2 className="w-3 h-3" /> Delivered
      </span>
    );
  if (s === "SHIPPED")
    return (
      <span className="badge badge-info badge-sm text-white font-bold gap-1">
        <Truck className="w-3 h-3" /> Shipped
      </span>
    );
  if (s === "CANCELLED")
    return (
      <span className="badge badge-error badge-sm text-white font-bold gap-1">
        <XCircle className="w-3 h-3" /> Cancelled
      </span>
    );
  if (s === "OUT_OF_DELIVERY")
    return (
      <span className="badge badge-info badge-sm text-white font-bold gap-1">
        <Truck className="w-3 h-3" /> Out for Delivery
      </span>
    );
  if (s === "REFUNDED")
    return (
      <span className="badge badge-warning badge-sm text-slate-950 font-bold gap-1">
        Refunded
      </span>
    );
  if (s === "PROCESSING" || s === "CONFIRMED")
    return (
      <span className="badge badge-warning badge-sm text-slate-950 font-bold">
        {s}
      </span>
    );
  return (
    <span className="badge badge-outline badge-sm border-amber-400/40 text-amber-400 font-bold">
      {status || "Pending"}
    </span>
  );
};

const getPayBadge = (status: string) => {
  const s = status?.toUpperCase();
  if (s === "PAID")
    return (
      <span className="badge badge-success badge-sm text-slate-950 font-black">
        Paid
      </span>
    );
  if (s === "REFUNDED")
    return (
      <span className="badge badge-warning badge-sm text-slate-950 font-bold">
        Refunded
      </span>
    );
  return (
    <span className="badge badge-error badge-sm text-white font-bold">
      Unpaid
    </span>
  );
};

const isActiveOrder = (o: TOrder) =>
  [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "UNSHIPPED",
    "SHIPPED",
    "OUT_OF_DELIVERY",
  ].includes(o.status?.toUpperCase());

const getNotifIcon = (type: string) => {
  const t = type?.toUpperCase();
  if (t.includes("ORDER") || t.includes("NEW_ORDER")) return Package;
  if (t.includes("SHIP")) return Truck;
  if (t.includes("DELIVER")) return CheckCircle2;
  if (t.includes("CANCEL")) return XCircle;
  if (t.includes("PAYMENT") || t.includes("PAY")) return DollarSign;
  return Bell;
};

/* ─────────────────────────────────────────────────────────── */
/*  Sub-sections                                               */
/* ─────────────────────────────────────────────────────────── */

/** 1 — Welcome / Profile Banner */
const WelcomeBanner = ({
  userName,
  socketStatus,
}: {
  userName: string;
  socketStatus: string;
}) => (
  <div className="relative overflow-hidden bg-gradient-to-r from-[#170d2f] via-[#1c123b] to-[#120a26] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none" />
    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute -left-10 -top-10 w-40 h-40 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0 border border-emerald-400/30">
          <User className="w-7 h-7 text-slate-950" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="badge badge-success badge-sm font-bold text-slate-950 px-2.5">
              Customer Portal
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  socketStatus === "connected"
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-amber-400"
                }`}
              />
              Live sync
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {userName}!
          </h1>
          <p className="text-sm text-slate-300">
            Here&apos;s your shopping and account summary.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/customer/orders"
          className="btn btn-outline border-white/20 hover:border-emerald-400/50 text-slate-200 hover:text-white rounded-xl text-xs gap-2"
        >
          <Package className="w-4 h-4 text-emerald-400" />
          My Orders
        </Link>
        <Link
          href="/"
          className="btn bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 gap-2 border-0"
        >
          <ShoppingBag className="w-4 h-4" />
          Shop
        </Link>
      </div>
    </div>
  </div>
);

/** 2 — Quick Stats */
const QuickStats = ({
  orders,
  isLoading,
}: {
  orders: TOrder[];
  isLoading: boolean;
}) => {
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) =>
      ["PENDING", "PROCESSING", "CONFIRMED", "UNSHIPPED"].includes(
        o.status?.toUpperCase()
      )
    ).length;
    const delivered = orders.filter(
      (o) => o.status?.toUpperCase() === "DELIVERED"
    ).length;
    const cancelled = orders.filter(
      (o) => o.status?.toUpperCase() === "CANCELLED"
    ).length;
    const spent = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);

    return [
      {
        label: "Total Orders",
        value: total,
        icon: ShoppingBag,
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        border: "border-amber-400/20",
        line: "via-amber-400/60",
      },
      {
        label: "Pending",
        value: pending,
        icon: Clock,
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/20",
        line: "via-yellow-400/50",
      },
      {
        label: "Delivered",
        value: delivered,
        icon: CheckCircle2,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/20",
        line: "via-emerald-400/60",
      },
      {
        label: "Cancelled",
        value: cancelled,
        icon: XCircle,
        color: "text-red-400",
        bg: "bg-red-400/10",
        border: "border-red-400/20",
        line: "via-red-400/50",
      },
      {
        label: "Total Spent",
        value: `$${spent.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        icon: DollarSign,
        color: "text-teal-400",
        bg: "bg-teal-400/10",
        border: "border-teal-400/20",
        line: "via-teal-400/60",
      },
    ];
  }, [orders]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-[100px] rounded-2xl bg-[#170d2f] border border-white/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-2xl bg-[#170d2f] border border-white/10 p-4 shadow-xl select-none"
          >
            <div
              className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent ${s.line} to-transparent pointer-events-none`}
            />
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 truncate">
                  {s.label}
                </p>
                <p className={`text-xl font-black tracking-tight ${s.color}`}>
                  {s.value}
                </p>
              </div>
              <div
                className={`p-2 rounded-xl shrink-0 border ${s.bg} ${s.border} ${s.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** 3 — Active Orders */
const ActiveOrders = ({
  orders,
  isLoading,
  onViewDetails,
}: {
  orders: TOrder[];
  isLoading: boolean;
  onViewDetails: (o: TOrder) => void;
}) => {
  const active = useMemo(
    () => orders.filter(isActiveOrder).slice(0, 5),
    [orders]
  );

  return (
    <div className="relative overflow-hidden bg-[#170d2f] border border-white/10 rounded-2xl shadow-2xl">
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />
      <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">Active Orders</h2>
            <p className="text-[11px] text-slate-400">
              Orders currently in progress
            </p>
          </div>
        </div>
        {active.length > 0 && (
          <span className="badge badge-info badge-sm font-bold">
            {active.length} active
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : active.length === 0 ? (
        <div className="py-12 text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-600">
            <Truck className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-300">No active orders</p>
          <p className="text-xs text-slate-500">
            All caught up! Start shopping below.
          </p>
          <Link
            href="/"
            className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl border-0 mt-2 gap-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {active.map((order) => {
            const products: any[] = order.products || [];
            const first = products[0]?.variant;
            const thumb =
              first?.product?.thumbnail || first?.thumbnail || first?.images?.[0];
            const title =
              first?.product?.title ||
              (first?.sku ? `Variant ${first.sku}` : null);
            const estDelivery = order.deliveryDate
              ? `${new Date(order.deliveryDate.from).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" }
                )} – ${new Date(order.deliveryDate.to).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                )}`
              : null;

            return (
              <div
                key={order._id}
                className="group p-4 flex items-center gap-3 hover:bg-white/[0.03] transition-colors"
              >
                {/* thumb */}
                {thumb ? (
                  <img
                    src={thumb}
                    alt={title || "Product"}
                    className="w-11 h-11 rounded-lg object-contain bg-white/10 p-0.5 border border-white/10 shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                )}

                {/* info */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-0.5">
                      <Hash className="w-3 h-3" />
                      {order.orderNo}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  {title && (
                    <p className="text-xs font-bold text-slate-200 truncate">
                      {title}
                      {products.length > 1 &&
                        ` +${products.length - 1} more`}
                    </p>
                  )}
                  {estDelivery && (
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Truck className="w-3 h-3 shrink-0" />
                      Est. {estDelivery}
                    </p>
                  )}
                </div>

                {/* right */}
                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  <span className="text-sm font-black text-emerald-400">
                    ${order.totalPrice?.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onViewDetails(order)}
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {active.length > 0 && (
        <div className="p-3 border-t border-white/10">
          <Link
            href="/customer/orders"
            className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View all orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};

/** 4 — Recent Orders */
const RecentOrders = ({
  orders,
  isLoading,
  onViewDetails,
}: {
  orders: TOrder[];
  isLoading: boolean;
  onViewDetails: (o: TOrder) => void;
}) => {
  const recent = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 8),
    [orders]
  );

  return (
    <div className="relative overflow-hidden bg-[#170d2f] border border-white/10 rounded-2xl shadow-2xl">
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />

      <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">Recent Orders</h2>
            <p className="text-[11px] text-slate-400">Your latest purchases</p>
          </div>
        </div>
        <Link
          href="/customer/orders"
          className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : recent.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-400">No orders yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="text-left px-4 py-2.5 font-semibold">Order</th>
                <th className="text-left px-4 py-2.5 font-semibold hidden sm:table-cell">
                  Date
                </th>
                <th className="text-left px-4 py-2.5 font-semibold hidden md:table-cell">
                  Product
                </th>
                <th className="text-right px-4 py-2.5 font-semibold">Amount</th>
                <th className="text-center px-4 py-2.5 font-semibold hidden sm:table-cell">
                  Payment
                </th>
                <th className="text-center px-4 py-2.5 font-semibold">
                  Status
                </th>
                <th className="text-right px-4 py-2.5 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {recent.map((order) => {
                const products: any[] = order.products || [];
                const first = products[0]?.variant;
                const title =
                  first?.product?.title ||
                  (products.length > 1
                    ? `${products.length} items`
                    : "Order item");

                return (
                  <tr
                    key={order._id}
                    className="border-b border-white/5 last:border-none hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-emerald-400 font-bold">
                        #{order.orderNo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 hidden sm:table-cell whitespace-nowrap">
                      {fmt(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell max-w-[160px]">
                      <span className="truncate block text-slate-200 font-medium">
                        {title}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-black text-emerald-400 whitespace-nowrap">
                      ${order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      {getPayBadge(order.paymentStatus)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onViewDetails(order)}
                        className="btn btn-ghost btn-xs text-slate-400 hover:text-emerald-400 gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span className="hidden sm:inline">Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/** 5 — Order Status Summary */
const OrderStatusSummary = ({
  orders,
  isLoading,
}: {
  orders: TOrder[];
  isLoading: boolean;
}) => {
  const rows = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      const s = (o.status || "PENDING").toUpperCase();
      counts[s] = (counts[s] || 0) + 1;
    });

    const order = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "UNSHIPPED",
      "SHIPPED",
      "OUT_OF_DELIVERY",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ];
    return order
      .map((k) => ({ label: k, count: counts[k] || 0 }))
      .filter((r) => orders.length === 0 || r.count > 0);
  }, [orders]);

  const total = orders.length;

  const cfg: Record<
    string,
    { color: string; bar: string; dot: string }
  > = {
    PENDING: {
      color: "text-amber-400",
      bar: "bg-amber-400",
      dot: "bg-amber-400",
    },
    CONFIRMED: {
      color: "text-sky-400",
      bar: "bg-sky-400",
      dot: "bg-sky-400",
    },
    PROCESSING: {
      color: "text-yellow-400",
      bar: "bg-yellow-400",
      dot: "bg-yellow-400",
    },
    SHIPPED: {
      color: "text-cyan-400",
      bar: "bg-cyan-400",
      dot: "bg-cyan-400",
    },
    DELIVERED: {
      color: "text-emerald-400",
      bar: "bg-emerald-400",
      dot: "bg-emerald-400",
    },
    CANCELLED: {
      color: "text-red-400",
      bar: "bg-red-400",
      dot: "bg-red-400",
    },
    UNSHIPPED: {
      color: "text-orange-400",
      bar: "bg-orange-400",
      dot: "bg-orange-400",
    },
    OUT_OF_DELIVERY: {
      color: "text-indigo-400",
      bar: "bg-indigo-400",
      dot: "bg-indigo-400",
    },
    REFUNDED: {
      color: "text-pink-400",
      bar: "bg-pink-400",
      dot: "bg-pink-400",
    },
  };

  return (
    <div className="relative overflow-hidden bg-[#170d2f] border border-white/10 rounded-2xl shadow-2xl">
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent pointer-events-none" />

      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-purple-400/10 border border-purple-400/20 text-purple-400">
          <BarChart3 className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-black text-white">Order Summary</h2>
          <p className="text-[11px] text-slate-400">Distribution by status</p>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 rounded-lg bg-white/5 animate-pulse" />
          ))
        ) : total === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            No orders yet.
          </p>
        ) : (
          rows.map((r) => {
            const c = cfg[r.label] || {
              color: "text-slate-400",
              bar: "bg-slate-400",
              dot: "bg-slate-400",
            };
            const pct = total > 0 ? (r.count / total) * 100 : 0;
            return (
              <div key={r.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                    <span className="font-semibold text-slate-300 capitalize">
                      {r.label.charAt(0) + r.label.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-black ${c.color}`}>{r.count}</span>
                    <span className="text-slate-500 text-[10px]">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.bar} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

/** 6 — Recent Notifications (compact) */
const RecentNotifications = ({
  notifications,
  unreadCount,
  isLoading,
  markAsRead,
  markAllAsRead,
  refetch,
}: {
  notifications: any[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refetch: () => void;
}) => {
  const shown = notifications.slice(0, 6);

  return (
    <div className="relative overflow-hidden bg-[#170d2f] border border-white/10 rounded-2xl shadow-2xl">
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent pointer-events-none" />

      <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white">Notifications</h2>
              {unreadCount > 0 && (
                <span className="badge badge-warning badge-sm font-bold text-slate-950">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">Recent account updates</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refetch}
            title="Refresh"
            className="btn btn-ghost btn-sm btn-square text-slate-400 hover:text-white border border-white/10"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-400" : ""}`}
            />
          </button>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="btn btn-ghost btn-xs text-[11px] font-bold text-emerald-400 hover:bg-emerald-400/10 border border-emerald-400/20 gap-1 rounded-lg"
            >
              <CheckCheck className="w-3 h-3" />
              All read
            </button>
          )}
        </div>
      </div>

      {isLoading && notifications.length === 0 ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <Bell className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400">No notifications yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-white/5 max-h-[360px] overflow-y-auto">
          {shown.map((n) => {
            const Icon = getNotifIcon(n.type);
            return (
              <div
                key={n.id}
                onClick={() => !n.isRead && markAsRead(n.id)}
                className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-white/[0.03] transition-colors ${
                  !n.isRead
                    ? "border-l-2 border-l-amber-400 bg-amber-400/[0.02]"
                    : "opacity-75"
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    n.isRead
                      ? "bg-white/5 border border-white/10 text-slate-500"
                      : "bg-emerald-400/10 border border-emerald-400/20 text-emerald-400"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-200 truncate">
                      {n.title || n.type}
                    </span>
                    {!n.isRead && (
                      <span className="badge badge-warning badge-xs font-black text-slate-950">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {fmtTimeAgo(n.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/** 7 — Quick Actions */
const QuickActions = () => {
  const actions = [
    {
      label: "Browse Products",
      href: "/",
      icon: ShoppingBag,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
    },
    {
      label: "View All Orders",
      href: "/customer/orders",
      icon: Package,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
    },
    {
      label: "Wishlist",
      href: "/customer/wishlist",
      icon: Heart,
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
    },
    {
      label: "Saved Addresses",
      href: "/customer/addresses",
      icon: MapPin,
      color: "text-sky-400",
      bg: "bg-sky-400/10",
      border: "border-sky-400/20",
    },
    {
      label: "Edit Profile",
      href: "/customer/profile",
      icon: User,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20",
    },
    {
      label: "Contact Support",
      href: "/customer/support",
      icon: MessageSquare,
      color: "text-teal-400",
      bg: "bg-teal-400/10",
      border: "border-teal-400/20",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#170d2f] border border-white/10 rounded-2xl shadow-2xl">
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent pointer-events-none" />

      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-teal-400/10 border border-teal-400/20 text-teal-400">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-black text-white">Quick Actions</h2>
          <p className="text-[11px] text-slate-400">Shortcuts to key pages</p>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.label}
              href={a.href}
              className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${a.bg} ${a.border} hover:border-opacity-60`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${a.color}`} />
              <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                {a.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────── */
/*  Main Page                                                  */
/* ─────────────────────────────────────────────────────────── */

const CustomerDashboard: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const {
    notifications,
    unreadCount,
    status: socketStatus,
    isLoading: notifLoading,
    refetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotification();

  const { data: ordersRes, isLoading: ordersLoading } = useMyOrdersQuery(
    { limit: "all" },
    { refetchOnMountOrArgChange: true }
  );
  const orders: TOrder[] = ordersRes?.data || [];

  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDetails = (order: TOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-14 w-full text-slate-100">
      {/* 1. Welcome */}
      <WelcomeBanner
        userName={user?.name || "Shopper"}
        socketStatus={socketStatus}
      />

      {/* 2. Quick Stats */}
      <QuickStats orders={orders} isLoading={ordersLoading} />

      {/* 3 + 4. Active Orders & Recent Orders — side by side on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveOrders
          orders={orders}
          isLoading={ordersLoading}
          onViewDetails={openDetails}
        />
        <RecentOrders
          orders={orders}
          isLoading={ordersLoading}
          onViewDetails={openDetails}
        />
      </div>

      {/* 5 + 6 + 7. Status Summary, Notifications, Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OrderStatusSummary orders={orders} isLoading={ordersLoading} />
        <RecentNotifications
          notifications={notifications}
          unreadCount={unreadCount}
          isLoading={notifLoading}
          markAsRead={markAsRead}
          markAllAsRead={markAllAsRead}
          refetch={refetchNotifications}
        />
        <QuickActions />
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default CustomerDashboard;