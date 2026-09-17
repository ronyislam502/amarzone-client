"use client";

import React from "react";
import {
  AlertCircle,
  Clock,
  XCircle,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Flame,
} from "lucide-react";

interface HealthMetricsGridProps {
  orderDefectRate?: number;
  lateShipmentRate?: number;
  cancellationRate?: number;
  validTrackingRate?: number;
}

const HealthMetricsGrid: React.FC<HealthMetricsGridProps> = ({
  orderDefectRate = 0,
  lateShipmentRate = 0,
  cancellationRate = 0,
  validTrackingRate = 100,
}) => {
  // Metric 1: Order Defect Rate (ODR)
  // Target: < 1.0%, Suspension: >= 5.0%
  const odr = Number(orderDefectRate.toFixed(2));
  const odrStatus =
    odr < 1.0 ? "PASSING" : odr < 5.0 ? "WARNING" : "CRITICAL";

  // Metric 2: Late Shipment Rate (LSR)
  // Target: < 4.0%, Suspension: >= 10.0%
  const lsr = Number(lateShipmentRate.toFixed(2));
  const lsrStatus =
    lsr < 4.0 ? "PASSING" : lsr < 10.0 ? "WARNING" : "CRITICAL";

  // Metric 3: Cancellation Rate (CR)
  // Target: < 2.5%, Suspension: >= 7.0%
  const cr = Number(cancellationRate.toFixed(2));
  const crStatus =
    cr < 2.5 ? "PASSING" : cr < 7.0 ? "WARNING" : "CRITICAL";

  // Metric 4: Valid Tracking Rate (VTR)
  // Target: >= 95.0%, Suspension: < 80.0%
  const vtr = Number(validTrackingRate.toFixed(2));
  const vtrStatus =
    vtr >= 95.0 ? "PASSING" : vtr >= 80.0 ? "WARNING" : "CRITICAL";

  const getStatusBadge = (status: "PASSING" | "WARNING" | "CRITICAL") => {
    switch (status) {
      case "PASSING":
        return {
          text: "Passing SLA",
          badgeClass: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
        };
      case "WARNING":
        return {
          text: "Near Threshold",
          badgeClass: "bg-amber-500/10 text-amber-300 border-amber-500/30",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
        };
      case "CRITICAL":
        return {
          text: "Violation Breached",
          badgeClass: "bg-rose-500/10 text-rose-300 border-rose-500/30",
          icon: <Flame className="w-3.5 h-3.5 text-rose-400" />,
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span>Customer Service & Delivery Performance SLAs</span>
          </h2>
          <p className="text-xs text-slate-400">
            Marketplace compliance targets enforced across all seller order lifecycles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Order Defect Rate (ODR) */}
        <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl p-5 hover:border-emerald-400/30 transition-all">
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Order Defect Rate (ODR)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {odr}%
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">Target: &lt; 1.0%</span>
            {(() => {
              const badge = getStatusBadge(odrStatus);
              return (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${badge.badgeClass}`}
                >
                  {badge.icon}
                  {badge.text}
                </span>
              );
            })()}
          </div>

          {/* Target Progress Bar */}
          <div className="mt-2.5 w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                odrStatus === "PASSING"
                  ? "bg-emerald-400"
                  : odrStatus === "WARNING"
                  ? "bg-amber-400"
                  : "bg-rose-500"
              }`}
              style={{ width: `${Math.min(100, (odr / 5) * 100)}%` }}
            />
          </div>

          <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">
            Measures orders with refunds or low service reviews (≤ 2 stars). High ODR triggers immediate Buy Box revocation.
          </p>
        </div>

        {/* Metric 2: Late Shipment Rate (LSR) */}
        <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl p-5 hover:border-sky-400/30 transition-all">
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/40 to-transparent pointer-events-none" />
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Late Shipment Rate (LSR)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {lsr}%
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">Target: &lt; 4.0%</span>
            {(() => {
              const badge = getStatusBadge(lsrStatus);
              return (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${badge.badgeClass}`}
                >
                  {badge.icon}
                  {badge.text}
                </span>
              );
            })()}
          </div>

          {/* Target Progress Bar */}
          <div className="mt-2.5 w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                lsrStatus === "PASSING"
                  ? "bg-emerald-400"
                  : lsrStatus === "WARNING"
                  ? "bg-amber-400"
                  : "bg-rose-500"
              }`}
              style={{ width: `${Math.min(100, (lsr / 10) * 100)}%` }}
            />
          </div>

          <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">
            Orders shipped past the committed dispatch window. Always confirm tracking before the shipping deadline.
          </p>
        </div>

        {/* Metric 3: Cancellation Rate (CR) */}
        <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl p-5 hover:border-purple-400/30 transition-all">
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/40 to-transparent pointer-events-none" />
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Cancellation Rate (CR)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {cr}%
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-400/10 border border-purple-400/20 text-purple-400">
              <XCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">Target: &lt; 2.5%</span>
            {(() => {
              const badge = getStatusBadge(crStatus);
              return (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${badge.badgeClass}`}
                >
                  {badge.icon}
                  {badge.text}
                </span>
              );
            })()}
          </div>

          {/* Target Progress Bar */}
          <div className="mt-2.5 w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                crStatus === "PASSING"
                  ? "bg-emerald-400"
                  : crStatus === "WARNING"
                  ? "bg-amber-400"
                  : "bg-rose-500"
              }`}
              style={{ width: `${Math.min(100, (cr / 7) * 100)}%` }}
            />
          </div>

          <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">
            Seller-initiated cancellations prior to shipment. Keep inventory accurate to prevent out-of-stock cancellations.
          </p>
        </div>

        {/* Metric 4: Valid Tracking Rate (VTR) */}
        <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl p-5 hover:border-emerald-400/30 transition-all">
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent pointer-events-none" />
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Valid Tracking Rate (VTR)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {vtr}%
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">Target: ≥ 95.0%</span>
            {(() => {
              const badge = getStatusBadge(vtrStatus);
              return (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${badge.badgeClass}`}
                >
                  {badge.icon}
                  {badge.text}
                </span>
              );
            })()}
          </div>

          {/* Target Progress Bar (reversed: 100% is best) */}
          <div className="mt-2.5 w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                vtrStatus === "PASSING"
                  ? "bg-emerald-400"
                  : vtrStatus === "WARNING"
                  ? "bg-amber-400"
                  : "bg-rose-500"
              }`}
              style={{ width: `${Math.max(0, Math.min(100, vtr))}%` }}
            />
          </div>

          <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">
            Shipped orders carrying valid courier names and tracking numbers so customers can monitor live parcel transit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthMetricsGrid;
