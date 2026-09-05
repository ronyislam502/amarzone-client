"use client";

import React from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Package,
  Truck,
  CreditCard,
  UserCheck,
  X,
} from "lucide-react";
import { useNotification } from "@/src/context/NotificationContext";
import { TNotification } from "@/src/types/notification";

const getNotificationIcon = (type: string) => {
  const t = type?.toUpperCase() || "";
  if (t.includes("ORDER") || t.includes("PURCHASE")) {
    return <Package className="w-5 h-5 text-emerald-500" />;
  }
  if (t.includes("SHIPPED") || t.includes("DELIVER")) {
    return <Truck className="w-5 h-5 text-sky-500" />;
  }
  if (t.includes("PAYMENT") && !t.includes("FAILED")) {
    return <CreditCard className="w-5 h-5 text-indigo-500" />;
  }
  if (t.includes("FAIL") || t.includes("WARNING") || t.includes("FRAUD")) {
    return <AlertCircle className="w-5 h-5 text-rose-500" />;
  }
  if (t.includes("ACCOUNT") || t.includes("USER")) {
    return <UserCheck className="w-5 h-5 text-amber-500" />;
  }
  return <CheckCircle2 className="w-5 h-5 text-primary" />;
};

export const NotificationToaster: React.FC = () => {
  const { activeToasts, dismissToast, markAsRead } = useNotification();

  if (activeToasts.length === 0) return null;

  return (
    <aside aria-label="Real-time notifications" className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
      {activeToasts.map((toast: TNotification) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl bg-base-100/95 backdrop-blur-md border border-base-content/10 transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-top-2 hover:shadow-primary/10"
        >
          <div className="p-2 rounded-xl bg-base-200/80 shrink-0 mt-0.5">
            {getNotificationIcon(toast.type)}
          </div>

          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => {
              markAsRead(toast.id);
              dismissToast(toast.id);
            }}
          >
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-xs font-bold text-base-content tracking-wide uppercase">
                {toast.title || "Live Update"}
              </span>
              <span className="text-[10px] text-base-content/50 font-medium">
                Just now
              </span>
            </div>
            <p className="text-xs text-base-content/80 line-clamp-2 leading-relaxed font-normal">
              {toast.message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="text-base-content/40 hover:text-base-content hover:bg-base-200 rounded-lg p-1 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </aside>
  );
};
