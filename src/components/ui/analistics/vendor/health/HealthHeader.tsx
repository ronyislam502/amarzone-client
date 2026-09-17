"use client";

import React from "react";
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Clock,
  Sparkles,
  ShieldAlert,
  Ban,
} from "lucide-react";
import { TAccountHealthStatus } from "@/src/types/health";

interface HealthHeaderProps {
  status?: TAccountHealthStatus;
  calculatedAt?: string;
  isFetching?: boolean;
  onRefresh?: () => void;
}

const HealthHeader: React.FC<HealthHeaderProps> = ({
  status = "HEALTHY",
  calculatedAt,
  isFetching = false,
  onRefresh,
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case "HEALTHY":
        return {
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          label: "Healthy Standing",
          badgeClass: "badge-success bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
          glowClass: "via-emerald-400/60",
        };
      case "AT_RISK":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          label: "At Risk (Review SLAs)",
          badgeClass: "badge-warning bg-amber-500/10 border-amber-500/30 text-amber-300",
          glowClass: "via-amber-400/60",
        };
      case "CRITICAL":
        return {
          icon: <ShieldAlert className="w-4 h-4 text-orange-400" />,
          label: "Critical Attention Required",
          badgeClass: "badge-error bg-orange-500/10 border-orange-500/30 text-orange-300",
          glowClass: "via-orange-400/60",
        };
      case "SUSPENDED":
        return {
          icon: <Ban className="w-4 h-4 text-rose-400" />,
          label: "Account Suspended",
          badgeClass: "badge-error bg-rose-500/20 border-rose-500/40 text-rose-300",
          glowClass: "via-rose-400/60",
        };
      default:
        return {
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          label: "Healthy",
          badgeClass: "badge-success bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
          glowClass: "via-emerald-400/60",
        };
    }
  };

  const currentBadge = getStatusBadge();

  const formattedDate = calculatedAt
    ? new Date(calculatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recently evaluated";

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl">
      {/* Top glowing accent border line */}
      <div
        className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent ${currentBadge.glowClass} to-transparent pointer-events-none z-20`}
      />

      {/* Ambient background glow orbs */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-emerald-500/15 via-teal-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* High-tech dot matrix overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

      <div className="card-body relative z-10 flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-7">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-warning gap-1 px-3 py-2 text-xs font-black shadow text-slate-900">
              <Sparkles className="w-3.5 h-3.5" />
              Vendor Performance
            </span>
            <span
              className={`badge badge-outline gap-1.5 font-bold text-xs px-3 py-2 ${currentBadge.badgeClass}`}
            >
              {currentBadge.icon}
              {currentBadge.label}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live SLA Engine
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Account <span className="text-emerald-400">Health</span> & Compliance
          </h1>
          <p className="text-slate-300/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Monitor your marketplace compliance metrics, fulfill customer orders within strict SLA thresholds, and keep your seller rating above 850 to unlock Amazon Buy Box privileges.
          </p>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Last evaluated:</span>
            <span className="font-semibold text-slate-300">{formattedDate}</span>
          </div>
        </div>

        {/* Action / Refresh Button */}
        <div className="flex flex-wrap items-center gap-3">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isFetching}
              className="btn btn-outline btn-sm gap-2 font-bold border-emerald-400/40 text-emerald-300 hover:bg-emerald-400 hover:text-slate-950 transition-all shadow-sm cursor-pointer rounded-xl disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              <span>{isFetching ? "Syncing..." : "Refresh Health"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthHeader;
