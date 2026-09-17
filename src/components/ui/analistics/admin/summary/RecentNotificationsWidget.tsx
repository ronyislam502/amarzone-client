"use client";

import React from "react";
import Link from "next/link";
import {
  Bell,
  Store,
  UserCheck,
  CheckCircle2,
  CheckCheck,
  Calendar,
  ArrowUpRight,
  Radio,
  RefreshCw,
} from "lucide-react";
import { useNotification } from "@/src/context/NotificationContext";
import { TNotification } from "@/src/types/notification";

export const RecentNotificationsWidget: React.FC = () => {
  const {
    notifications,
    unreadCount,
    status,
    isLoading,
    refetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotification();

  const isConnected = status === "connected";

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
    <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
      {/* Top glowing line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent pointer-events-none z-20" />
      <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-purple-400">
              <Bell className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Recent Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="badge badge-warning font-black text-slate-950 text-xs">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Live database notifications and orders feed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetchNotifications()}
              className="btn btn-xs btn-ghost text-slate-300 hover:text-white border border-white/10 rounded-lg"
              title="Refresh database notifications"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin text-amber-400" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="btn btn-xs btn-ghost text-slate-300 hover:text-white border border-white/10 rounded-lg"
                title="Mark all as read"
              >
                <CheckCheck className="w-3 h-3 text-emerald-400" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications Feed */}
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No real-time notifications received yet.
          </div>
        ) : (
          <div className="divide-y divide-white/5 max-h-[380px] overflow-y-auto space-y-1">
            {notifications.slice(0, 6).map((item: TNotification) => {
              const isVendor = item.message?.toLowerCase().includes("vendor");
              const isCustomer = item.message?.toLowerCase().includes("customer");

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl flex items-start gap-3 transition-all ${
                    !item.isRead ? "bg-amber-400/[0.05]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                      isVendor
                        ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                        : isCustomer
                        ? "bg-cyan-400/10 border-cyan-400/30 text-cyan-400"
                        : "bg-purple-400/10 border-purple-400/30 text-purple-400"
                    }`}
                  >
                    {isVendor ? (
                      <Store className="w-4 h-4" />
                    ) : isCustomer ? (
                      <UserCheck className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-black text-white truncate">
                        {item.title ||
                          (isVendor
                            ? "New Vendor Account"
                            : isCustomer
                            ? "New Customer"
                            : "System Alert")}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                      {item.message}
                    </p>

                    <div className="mt-1.5 flex items-center gap-2">
                      {!item.isRead ? (
                        <button
                          type="button"
                          onClick={() => markAsRead(item.id)}
                          className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Mark read</span>
                        </button>
                      ) : (
                        <span className="text-[9px] text-slate-500 font-bold flex items-center gap-1">
                          <CheckCheck className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Read</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentNotificationsWidget;
