"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useNotification } from "@/src/context/NotificationContext";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentUser } from "@/src/redux/features/auth/authSlice";

const CustomerDashboard: React.FC = () => {
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
      <div className="relative overflow-hidden bg-gradient-to-r from-[#170d2f] via-[#1c123b] to-[#120a26] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge badge-success badge-sm font-bold text-slate-950 px-2.5 py-0.5">
                Customer Portal
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
              Welcome back, {user?.name || "Shopper"}!
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Track your orders, view account notifications from the database, and manage your Amarzone preferences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/customer/orders"
              className="btn btn-outline border-white/20 hover:border-emerald-400 text-slate-200 hover:text-white rounded-xl text-xs gap-2"
            >
              <Package className="w-4 h-4 text-emerald-400" />
              <span>My Orders</span>
            </Link>
            <Link
              href="/"
              className="btn bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 gap-2 border-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Store</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Quick Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#170d2f] border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Notifications
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
          href="/customer/orders"
          className="bg-[#170d2f] border border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 shadow-xl flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              My Orders
            </span>
            <div className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
              Manage Orders
            </div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              View live order tracking <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400">
            <Truck className="w-6 h-6" />
          </div>
        </Link>

        <div className="bg-[#170d2f] border border-white/10 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Account Security
            </span>
            <div className="text-2xl font-black text-white">
              Verified
            </div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Encrypted Session
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Database Notifications Feed for Customer */}
      <div className="bg-[#170d2f] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Your Account Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="badge badge-warning badge-sm font-bold text-slate-950">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Fetched directly from the database for your customer profile.
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
            <p className="text-xs text-slate-400">Loading your notifications from database...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
              <Bell className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">
              {filter === "unread"
                ? "No unread notifications"
                : "No customer notifications found"}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Order confirmations, delivery updates, and account alerts will be saved to your database and displayed here.
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
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400 shrink-0 mt-0.5">
                    <Package className="w-4 h-4" />
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

export default CustomerDashboard;