"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  Package,
  Truck,
  CreditCard,
  AlertCircle,
  UserCheck,
  CheckCircle2,
  RefreshCw,
  X,
} from "lucide-react";
import { useNotification } from "@/src/context/NotificationContext";
import { TNotification } from "@/src/types/notification";

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

const getNotificationIcon = (type: string) => {
  const t = type?.toUpperCase() || "";
  if (t.includes("ORDER") || t.includes("PURCHASE")) {
    return <Package className="w-4 h-4 text-emerald-400" />;
  }
  if (t.includes("SHIPPED") || t.includes("DELIVER")) {
    return <Truck className="w-4 h-4 text-cyan-400" />;
  }
  if (t.includes("PAYMENT") && !t.includes("FAIL")) {
    return <CreditCard className="w-4 h-4 text-indigo-400" />;
  }
  if (t.includes("FAIL") || t.includes("WARNING") || t.includes("FRAUD") || t.includes("CANCEL")) {
    return <AlertCircle className="w-4 h-4 text-rose-400" />;
  }
  if (t.includes("ACCOUNT") || t.includes("USER")) {
    return <UserCheck className="w-4 h-4 text-amber-400" />;
  }
  return <CheckCircle2 className="w-4 h-4 text-purple-400" />;
};

interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  className = "",
}) => {
  const {
    notifications,
    unreadCount,
    status,
    isLoading,
    refetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const isConnected = status === "connected";

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative btn btn-ghost btn-circle text-inherit hover:bg-white/10 transition-all"
        aria-label="View notifications"
      >
        <div className="indicator">
          {unreadCount > 0 && (
            <span className="indicator-item badge badge-error badge-xs animate-pulse text-[10px] font-extrabold text-white px-1.5 py-2 shadow-lg shadow-rose-900/50">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
          <Bell className="h-5 w-5" />
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#0e1322] text-slate-100 shadow-2xl border border-white/15 z-50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-white/[0.03]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white tracking-tight">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="badge badge-warning badge-sm font-extrabold text-slate-950">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {/* Status Indicator & Refetch */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => refetchNotifications()}
                  className="btn btn-ghost btn-xs btn-square text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Refresh notifications"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-amber-400" : ""}`} />
                </button>
                <div
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border border-white/10 bg-white/5"
                  title={`Live socket connection: ${status}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isConnected
                        ? "bg-emerald-400 animate-pulse"
                        : status === "connecting"
                        ? "bg-amber-400"
                        : "bg-rose-400"
                    }`}
                  />
                  <span className="capitalize text-slate-300">
                    {isConnected ? "Live" : status}
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-toolbar: Tabs & Action Buttons */}
            <div className="mt-3 flex items-center justify-between text-xs pt-1">
              <div className="join bg-white/5 p-0.5 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`join-item px-2.5 py-1 rounded-md transition-all font-semibold text-xs ${
                    filter === "all"
                      ? "bg-amber-400 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("unread")}
                  className={`join-item px-2.5 py-1 rounded-md transition-all font-semibold text-xs ${
                    filter === "unread"
                      ? "bg-amber-400 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="btn btn-ghost btn-xs text-[11px] gap-1 text-slate-300 hover:text-amber-400 hover:bg-white/10"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Read all</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="btn btn-ghost btn-xs text-[11px] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                    title="Clear all notifications"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {isLoading && notifications.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
                <p className="text-xs text-slate-400">Loading database notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 text-slate-500 border border-white/10">
                  <Bell className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-300">
                  {filter === "unread"
                    ? "No unread notifications"
                    : "No notifications in database"}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Updates stored in database will appear here in real-time
                </p>
              </div>
            ) : (
              filteredNotifications.map((n: TNotification) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors group hover:bg-white/5 ${
                    !n.isRead
                      ? "bg-amber-400/[0.04] border-l-2 border-l-amber-400"
                      : "opacity-75"
                  }`}
                >
                  {/* Type Icon */}
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                    {getNotificationIcon(n.type)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {n.title || n.type}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatTimeAgo(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {n.message}
                    </p>
                  </div>

                  {/* Right Actions: Unread dot & Delete */}
                  <div className="flex items-center gap-1 shrink-0 mt-1">
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(n.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all"
                      title="Delete notification"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Database Sync Indicator */}
          <div className="p-2.5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Database Synchronized
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              MongoDB
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
