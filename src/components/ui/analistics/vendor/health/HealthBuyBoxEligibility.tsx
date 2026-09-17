"use client";

import React from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Zap,
} from "lucide-react";
import { TAccountHealth } from "@/src/types/health";

interface HealthBuyBoxEligibilityProps {
  health?: TAccountHealth;
}

const HealthBuyBoxEligibility: React.FC<HealthBuyBoxEligibilityProps> = ({
  health,
}) => {
  const score = health?.score ?? 1000;
  const odr = health?.orderDefectRate ?? 0;
  const lsr = health?.lateShipmentRate ?? 0;
  const cr = health?.cancellationRate ?? 0;
  const vtr = health?.validTrackingRate ?? 100;

  const checks = [
    {
      id: "score",
      label: "Account Health Score",
      target: "≥ 850",
      current: `${score} / 1000`,
      isMet: score >= 850,
      description: "Minimum overall health score required for automated Buy Box assignment.",
    },
    {
      id: "odr",
      label: "Order Defect Rate (ODR)",
      target: "≤ 1.0%",
      current: `${odr.toFixed(2)}%`,
      isMet: odr <= 1.0,
      description: "Keeps return, defect, and negative seller review incidents below 1%.",
    },
    {
      id: "lsr",
      label: "Late Shipment Rate (LSR)",
      target: "≤ 4.0%",
      current: `${lsr.toFixed(2)}%`,
      isMet: lsr <= 4.0,
      description: "Ensures inventory orders are dispatched promptly within SLA delivery schedules.",
    },
    {
      id: "cr",
      label: "Pre-fulfillment Cancellation",
      target: "≤ 2.5%",
      current: `${cr.toFixed(2)}%`,
      isMet: cr <= 2.5,
      description: "Minimizes order cancellations caused by inaccurate stock inventories.",
    },
    {
      id: "vtr",
      label: "Valid Tracking Rate (VTR)",
      target: "≥ 95.0%",
      current: `${vtr.toFixed(2)}%`,
      isMet: vtr >= 95.0,
      description: "Requires carrier shipment tracking for at least 95% of customer orders.",
    },
  ];

  const totalMet = checks.filter((c) => c.isMet).length;
  const isAllMet = totalMet === checks.length;

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-7">
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none z-20" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="badge badge-warning text-slate-950 font-black text-xs px-2.5 py-1">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Offer Engine
              </span>
              <span className="text-xs text-slate-400">
                {totalMet} of {checks.length} Criteria Met
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Buy Box <span className="text-amber-400">Readiness Analyzer</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Winning the Buy Box places your product at the top of multi-vendor product listings, capturing up to 82% of customer purchases.
            </p>
          </div>

          <div
            className={`self-start sm:self-center px-4 py-2.5 rounded-2xl border flex items-center gap-2.5 text-xs font-black shadow-lg ${
              isAllMet
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                : "bg-amber-500/15 border-amber-500/30 text-amber-300"
            }`}
          >
            {isAllMet ? (
              <>
                <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>Buy Box Active & Qualified</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Optimization Needed ({checks.length - totalMet} pending)</span>
              </>
            )}
          </div>
        </div>

        {/* Criteria Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {checks.map((c) => (
            <div
              key={c.id}
              className={`p-4 rounded-2xl border transition-all ${
                c.isMet
                  ? "bg-black/25 border-emerald-500/20 hover:border-emerald-500/40"
                  : "bg-black/25 border-amber-500/20 hover:border-amber-500/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-white leading-tight">
                  {c.label}
                </span>
                {c.isMet ? (
                  <span className="badge badge-success badge-sm font-extrabold gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border-0">
                    <CheckCircle2 className="w-3 h-3" /> Met
                  </span>
                ) : (
                  <span className="badge badge-warning badge-sm font-extrabold gap-1 text-[10px] bg-amber-500/20 text-amber-300 border-0">
                    <XCircle className="w-3 h-3" /> Incomplete
                  </span>
                )}
              </div>

              <div className="mt-2.5 flex items-baseline justify-between text-xs">
                <span className="text-slate-400">Current: <span className="font-extrabold text-slate-100">{c.current}</span></span>
                <span className="text-slate-400">Target: <span className="font-extrabold text-amber-300">{c.target}</span></span>
              </div>

              <p className="mt-2 text-[11px] text-slate-400 leading-snug">
                {c.description}
              </p>
            </div>
          ))}

          {/* Sales Volume Condition */}
          <div className="p-4 rounded-2xl border bg-black/25 border-cyan-500/20 hover:border-cyan-500/40">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-bold text-white leading-tight">
                Minimum Sales Track Record
              </span>
              <span className="badge badge-info badge-sm font-extrabold gap-1 text-[10px] bg-cyan-500/20 text-cyan-300 border-0">
                Verified
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between text-xs">
              <span className="text-slate-400">Target: <span className="font-extrabold text-cyan-300">≥ 20 orders</span></span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 leading-snug">
              Vendors need at least 20 delivered/completed orders to establish a verified seller trust index.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthBuyBoxEligibility;
