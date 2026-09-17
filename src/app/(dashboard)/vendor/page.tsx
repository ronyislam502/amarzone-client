"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useNotification } from "@/src/context/NotificationContext";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentUser } from "@/src/redux/features/auth/authSlice";

const VendorDashboard: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const {
    notifications,
    unreadCount,
    status,
    isLoading,
    refetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotification();

  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications =
    filter === "unread"
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
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto p-4 sm:p-6 text-slate-100">
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
                    status === "connected"
                      ? "bg-emerald-400 animate-pulse"
                      : "bg-amber-400"
                  }`}
                />
                Database Sync Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {user?.name || "Merchant"}!
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Monitor customer orders, manage inventory stock, and review database sales alerts in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/vendor/orders"
              className="btn btn-outline border-white/20 hover:border-amber-400 text-slate-200 hover:text-white rounded-xl text-xs gap-2"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Incoming Orders</span>
            </Link>
            <Link
              href="/vendor/inventory"
              className="btn bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 gap-2 border-0"
            >
              <Boxes className="w-4 h-4" />
              <span>Manage Stock</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Quick Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#170d2f] border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Store Notifications
            </span>
            <div className="text-2xl font-black text-white">
              {notifications.length}
            </div>
            <span className="text-[11px] text-slate-400">
              {unreadCount} unread in database
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
            <Bell className="w-6 h-6" />
          </div>
        </div>

        <Link
          href="/vendor/orders"
          className="bg-[#170d2f] border border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 shadow-xl flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Customer Orders
            </span>
            <div className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
              Fulfillment Hub
            </div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              Process new orders <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </Link>

        <Link
          href="/vendor/inventory"
          className="bg-[#170d2f] border border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 shadow-xl flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Catalog & Inventory
            </span>
            <div className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">
              Inventory Status
            </div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              Manage stock levels <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400">
            <Boxes className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* 3. Database Notifications Feed for Vendor */}
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
                Directly stored and queried from the database for your merchant account.
              </p>
            </div>
          </div>

          {/* Controls: Filter & Actions */}
          <div className="flex items-center gap-2">
            <div className="join bg-white/5 p-0.5 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`join-item px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  filter === "all"
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={`join-item px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  filter === "unread"
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
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-400" : ""}`} />
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

        {/* List Content */}
        {isLoading && notifications.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading vendor notifications from database...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
              <Bell className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">
              {filter === "unread"
                ? "No unread alerts"
                : "No merchant notifications found"}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              New order notifications, inventory reminders, and payout settlements will be saved to your database and displayed here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-4 flex items-start justify-between gap-4 cursor-pointer transition-colors hover:bg-white/5 rounded-xl ${
                  !n.isRead
                    ? "bg-amber-400/[0.03] border-l-2 border-l-amber-400"
                    : "opacity-80"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-amber-400 shrink-0 mt-0.5">
                    <Store className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">
                        {n.title || n.type}
                      </span>
                      {!n.isRead && (
                        <span className="badge badge-warning badge-xs font-black text-slate-950">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono pt-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(n.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {!n.isRead ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(n.id);
                      }}
                      className="btn btn-ghost btn-xs text-amber-400 hover:text-amber-300 gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Mark read</span>
                    </button>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-semibold">
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Read</span>
                    </span>
                  )}
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