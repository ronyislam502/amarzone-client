"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Store,
  Bell,
  Package,
  Boxes,
  CheckCircle2,
  CheckCheck,
  RefreshCw,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ShoppingBag,
  DollarSign,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Truck,
  Layers,
  Sparkles,
} from "lucide-react";
import { useNotification } from "@/src/context/NotificationContext";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useMyOrdersQuery } from "@/src/redux/features/order/orderApi";
import { useGetMyInventoryQuery } from "@/src/redux/features/inventory/inventoryApi";
import { useGetMyHealthQuery } from "@/src/redux/features/health/healthApi";
import { AiDashboardInsightsWidget } from "@/src/components/ui/ai/AiDashboardInsightsWidget";

const VendorDashboard: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const {
    notifications,
    unreadCount,
    status: socketStatus,
    isLoading: isNotifLoading,
    refetchNotifications,
    markAllAsRead,
  } = useNotification();

  const [notifFilter, setNotifFilter] = useState<"all" | "unread">("all");

  // Fetch orders, inventory, and health for business snapshot
  const { data: ordersResponse, isLoading: isOrdersLoading } = useMyOrdersQuery(
    { limit: 50 },
    { refetchOnMountOrArgChange: false }
  );

  const { data: inventoryResponse } = useGetMyInventoryQuery(
    {},
    { refetchOnMountOrArgChange: false }
  );

  const { data: healthResponse } = useGetMyHealthQuery();

  const rawOrders: any[] = Array.isArray(ordersResponse?.data) ? ordersResponse.data : [];
  const inventoryItems: any[] = Array.isArray(inventoryResponse?.data) ? inventoryResponse.data : [];

  const healthData = healthResponse?.data;

  // Compute Quick Overview KPIs
  const {
    totalRevenue,
    totalOrders,
    pendingOrders,
    unshippedOrders,
    deliveredOrders,
    lowStockCount,
    inStockCount,
    recent7Days,
  } = useMemo(() => {
    let rev = 0;
    let pending = 0;
    let unshipped = 0;
    let delivered = 0;

    // Daily buckets for last 7 days mini chart
    const dailyMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = d.toLocaleDateString("en-US", { weekday: "short" });
      dailyMap[k] = 0;
    }

    rawOrders.forEach((ord) => {
      const price = Number(ord.totalPrice || ord.vendorAmount || 0);
      if (ord.paymentStatus === "PAID") rev += price;

      const s = (ord.status || "").toUpperCase();
      if (s === "PENDING") pending++;
      else if (s === "UNSHIPPED") unshipped++;
      else if (s === "DELIVERED" || s === "COMPLETE") delivered++;

      // Tally for 7-day sparkline
      const ordDate = new Date(ord.createdAt);
      const diffDays = Math.floor((Date.now() - ordDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        const k = ordDate.toLocaleDateString("en-US", { weekday: "short" });
        if (dailyMap[k] !== undefined) {
          dailyMap[k] += 1;
        }
      }
    });

    let lowStock = 0;
    let inStock = 0;
    inventoryItems.forEach((inv) => {
      const qty = inv?.seller?.quantity ?? 0;
      if (qty > 0 && qty <= 10) lowStock++;
      if (qty > 0) inStock++;
    });

    const sparkline = Object.keys(dailyMap).map((day) => ({
      day,
      count: dailyMap[day],
    }));

    return {
      totalRevenue: rev,
      totalOrders: rawOrders.length,
      pendingOrders: pending,
      unshippedOrders: unshipped,
      deliveredOrders: delivered,
      lowStockCount: lowStock,
      inStockCount: inStock,
      recent7Days: sparkline,
    };
  }, [rawOrders, inventoryItems]);

  const maxDailyCount = Math.max(...recent7Days.map((d) => d.count), 1);

  const filteredNotifications =
    notifFilter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return "Just now";
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6 w-full pb-10 text-slate-100">
      {/* 1. Welcome Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#170d2f] via-[#1b1038] to-[#120a26] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge badge-warning badge-sm font-bold text-slate-950 px-2.5 py-0.5">
                Vendor Portal
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    socketStatus === "connected"
                      ? "bg-emerald-400 animate-pulse"
                      : "bg-amber-400"
                  }`}
                />
                Live Business Feed
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {user?.name || "Store Partner"}!
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Here is your instant store snapshot. Monitor incoming orders, stock replenishment needs, and account compliance at a glance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/vendor/orders"
              className="btn btn-outline border-white/20 hover:border-amber-400 text-slate-200 hover:text-white rounded-xl text-xs gap-2"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Incoming Orders</span>
            </Link>
            <a
              href="#ai-insights"
              className="btn bg-gradient-to-r from-violet-600 via-purple-600 to-amber-500 hover:from-violet-500 hover:to-amber-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-600/20 gap-1.5 border-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Store Insights</span>
            </a>
            <Link
              href="/vendor/analytics"
              className="btn bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 gap-2 border-0"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Deep Analytics</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Quick Overall Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Total Sales */}
        <div className="bg-[#170d2f] border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="text-2xl font-black text-emerald-400">
              ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-400">Gross sales to date</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Orders Total & Delivered */}
        <Link
          href="/vendor/orders"
          className="bg-[#170d2f] border border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 shadow-xl flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
              {totalOrders}
            </div>
            <span className="text-[11px] text-emerald-400 font-bold">
              {deliveredOrders} delivered
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </Link>

        {/* Metric 3: Actionable Fulfillments */}
        <Link
          href="/vendor/orders"
          className="bg-[#170d2f] border border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 shadow-xl flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Action Required
            </span>
            <div className="text-2xl font-black text-sky-400">
              {unshippedOrders}
            </div>
            <span className="text-[11px] text-slate-400">
              {pendingOrders} awaiting payment
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-sky-400/10 border border-sky-400/20 text-sky-400">
            <Truck className="w-6 h-6" />
          </div>
        </Link>

        {/* Metric 4: Inventory & Low Stock */}
        <Link
          href="/vendor/inventory"
          className="bg-[#170d2f] border border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 shadow-xl flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Inventory Status
            </span>
            <div className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">
              {inventoryItems.length} Products
            </div>
            <span className={`text-[11px] font-bold ${lowStockCount > 0 ? "text-amber-400" : "text-slate-400"}`}>
              {lowStockCount} Low stock alert
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400">
            <Boxes className="w-6 h-6" />
          </div>
        </Link>

        {/* Metric 5: Account Health Score */}
        <Link
          href="/vendor/health"
          className="bg-[#170d2f] border border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 shadow-xl flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Account Health
            </span>
            <div className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
              {healthData?.score ?? 1000} / 1000
            </div>
            <span
              className={`badge badge-sm font-extrabold text-[10px] px-2 py-0.5 border ${
                (healthData?.score ?? 1000) >= 850
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-300 border-amber-500/30"
              }`}
            >
              {healthData?.status ?? "HEALTHY"}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* AI Store Intelligence Widget */}
      <div id="ai-insights" className="scroll-mt-6">
        <AiDashboardInsightsWidget
          stats={{
            merchantName: user?.name,
            totalRevenue,
            totalOrders,
            pendingOrders,
            unshippedOrders,
            deliveredOrders,
            lowStockCount,
            inStockCount,
            accountHealth: healthData,
            recent7DaysVelocity: recent7Days,
            totalInventorySkus: inventoryItems.length,
          }}
          role="VENDOR"
          title="Store AI Growth & Inventory Intelligence"
          subtitle="Real-time AI diagnostic evaluating fulfillment speed, buy-box eligibility, stockout risks, and revenue acceleration plays."
        />
      </div>

      {/* 3. Operational Row: Concise 7-Day Mini Chart + Inventory Stock Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Concise 7-Day Mini Activity Chart (7 cols) */}
        <div className="lg:col-span-7 card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  7-Day Velocity
                </span>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Recent Daily Order Pulse</span>
                </h3>
              </div>
              <Link
                href="/vendor/analytics"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                <span>View Full Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Compact Mini Bar Chart */}
            <div className="pt-6 pb-2 grid grid-cols-7 gap-2 items-end h-40">
              {recent7Days.map((item, idx) => {
                const heightPct = Math.max(8, (item.count / maxDailyCount) * 100);
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-black text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </span>
                    <div className="w-full max-w-[28px] bg-black/40 rounded-lg p-0.5 border border-white/5 flex items-end h-24">
                      <div
                        className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-md transition-all duration-500 group-hover:from-emerald-400 group-hover:to-teal-300"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Aggregated from live merchant order stream</span>
            <span className="font-bold text-slate-300">{recent7Days.reduce((a, b) => a + b.count, 0)} orders this week</span>
          </div>
        </div>

        {/* Right: Quick Stock & Compliance Summary (5 cols) */}
        <div className="lg:col-span-5 card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Stock Health
                </span>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-cyan-400" />
                  <span>Warehouse Inventory Levels</span>
                </h3>
              </div>
              <Link
                href="/vendor/inventory"
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <span>Stock Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/25 border border-white/5 text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  In Stock Products
                </span>
                <span className="font-black text-white text-sm">{inStockCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/25 border border-amber-500/20 text-xs">
                <span className="text-amber-300 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Low Stock Alert (&le; 10 units)
                </span>
                <span className="font-black text-amber-300 text-sm">{lowStockCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/25 border border-white/5 text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Buy Box Eligible Status
                </span>
                <span className="font-bold text-emerald-400">
                  {(healthData?.score ?? 1000) >= 850 ? "Active" : "Review Needed"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 text-[11px] text-slate-400">
            Keep inventory counts synced to protect Order Defect & Cancellation rates.
          </div>
        </div>
      </div>

      {/* 4. Recent Orders Quick Table */}
      <div className="bg-[#170d2f] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Live Fulfillment Queue
            </span>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              <span>Recent Customer Orders</span>
            </h3>
          </div>
          <Link
            href="/vendor/orders"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <span>All Orders ({rawOrders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {rawOrders.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No recent customer orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm w-full text-slate-200">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase tracking-wider font-extrabold">
                  <th>Order No</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {rawOrders.slice(0, 5).map((ord) => (
                  <tr key={ord._id} className="hover:bg-white/5 transition-colors">
                    <td className="font-mono font-bold text-amber-400">
                      {ord.orderNo || ord._id.slice(-8)}
                    </td>
                    <td className="text-slate-400">
                      {new Date(ord.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="font-semibold text-slate-200">
                      {ord.customer?.name || "Customer"}
                    </td>
                    <td className="font-black text-white">
                      ${Number(ord.totalPrice || ord.vendorAmount || 0).toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm font-extrabold text-[10px] ${
                          ord.paymentStatus === "PAID"
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm font-extrabold text-[10px] ${
                          ord.status === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                            : ord.status === "SHIPPED"
                            ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                            : ord.status === "UNSHIPPED"
                            ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Database Notifications Feed for Vendor */}
      <div className="bg-[#170d2f] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Vendor Store Alerts & Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="badge badge-warning badge-sm font-bold text-slate-950">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Direct store notifications and customer purchase alerts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="join bg-white/5 p-0.5 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => setNotifFilter("all")}
                className={`join-item px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  notifFilter === "all"
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setNotifFilter("unread")}
                className={`join-item px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  notifFilter === "unread"
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            <button
              type="button"
              onClick={() => refetchNotifications()}
              className="btn btn-ghost btn-sm btn-square text-slate-400 hover:text-white border border-white/10"
              title="Refresh notifications"
            >
              <RefreshCw className={`w-4 h-4 ${isNotifLoading ? "animate-spin text-amber-400" : ""}`} />
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="btn btn-sm btn-outline border-white/15 text-slate-200 hover:text-white gap-1 text-xs"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark all read</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No notifications to display.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {filteredNotifications.slice(0, 10).map((n) => (
              <div
                key={n._id}
                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  !n.isRead
                    ? "bg-amber-500/5 border-amber-500/20"
                    : "bg-black/20 border-white/5"
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-warning badge-xs text-[9px] font-black">
                      {n.type}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatTimeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;