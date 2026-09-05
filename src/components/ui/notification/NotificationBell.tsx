"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  Sparkles,
  Package,
  Truck,
  CreditCard,
  AlertCircle,
  UserCheck,
  CheckCircle2,
  Radio,
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
    return <Package className="w-4 h-4 text-emerald-500" />;
  }
  if (t.includes("SHIPPED") || t.includes("DELIVER")) {
    return <Truck className="w-4 h-4 text-sky-500" />;
  }
  if (t.includes("PAYMENT") && !t.includes("FAILED")) {
    return <CreditCard className="w-4 h-4 text-indigo-500" />;
  }
  if (t.includes("FAIL") || t.includes("WARNING") || t.includes("FRAUD")) {
    return <AlertCircle className="w-4 h-4 text-rose-500" />;
  }
  if (t.includes("ACCOUNT") || t.includes("USER")) {
    return <UserCheck className="w-4 h-4 text-amber-500" />;
  }
  return <CheckCircle2 className="w-4 h-4 text-primary" />;
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
    markAsRead,
    markAllAsRead,
    clearAll,
    sendTestNotification,
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
            <span className="indicator-item badge badge-error badge-xs animate-pulse text-[10px] font-extrabold text-white px-1.5 py-2">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <Bell className="h-5 w-5" />
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-base-100 text-base-content shadow-2xl border border-base-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-base-200 bg-base-200/50">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="badge badge-primary badge-sm font-semibold">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {/* Socket Status Indicator */}
              <div
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border border-base-300 bg-base-100"
                title={`Socket status: ${status}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected
                      ? "bg-emerald-500 animate-pulse"
                      : status === "connecting"
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                />
                <span className="capitalize text-base-content/70">
                  {isConnected ? "Live" : status}
                </span>
              </div>
            </div>

            {/* Sub-toolbar: Tabs & Action Buttons */}
            <div className="mt-3 flex items-center justify-between text-xs pt-1">
              <div className="join bg-base-300/60 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`join-item px-2.5 py-1 rounded-md transition-all font-semibold ${
                    filter === "all"
                      ? "bg-base-100 shadow-sm text-primary"
                      : "text-base-content/60 hover:text-base-content"
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("unread")}
                  className={`join-item px-2.5 py-1 rounded-md transition-all font-semibold ${
                    filter === "unread"
                      ? "bg-base-100 shadow-sm text-primary"
                      : "text-base-content/60 hover:text-base-content"
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
                    className="btn btn-ghost btn-xs text-[11px] gap-1 hover:text-primary"
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
                    className="btn btn-ghost btn-xs text-[11px] text-base-content/50 hover:text-error"
                    title="Clear all notifications"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-base-200">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-3 text-base-content/40">
                  <Bell className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-base-content/70">
                  {filter === "unread"
                    ? "No unread notifications"
                    : "No notifications yet"}
                </p>
                <p className="text-[11px] text-base-content/40 mt-1">
                  Real-time updates will appear here automatically
                </p>
              </div>
            ) : (
              filteredNotifications.map((n: TNotification) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors hover:bg-base-200/60 ${
                    !n.isRead ? "bg-primary/5 font-medium" : "opacity-80"
                  }`}
                >
                  {/* Type Icon */}
                  <div className="p-2 rounded-xl bg-base-200/80 shrink-0 mt-0.5">
                    {getNotificationIcon(n.type)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-base-content truncate">
                        {n.title || n.type}
                      </span>
                      <span className="text-[10px] text-base-content/50 shrink-0">
                        {formatTimeAgo(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-base-content/80 line-clamp-2 leading-relaxed font-normal">
                      {n.message}
                    </p>
                  </div>

                  {/* Unread indicator bullet */}
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Test & Sim Trigger */}
          <div className="p-2.5 border-t border-base-200 bg-base-200/40 flex items-center justify-between text-xs">
            <span className="text-[11px] text-base-content/60 flex items-center gap-1">
              <Radio className="w-3 h-3 text-primary" />
              Socket.IO active
            </span>

            <button
              type="button"
              onClick={() => sendTestNotification()}
              className="btn btn-xs btn-outline btn-primary gap-1 text-[10px] font-semibold"
            >
              <Sparkles className="w-3 h-3" />
              Simulate Live Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
