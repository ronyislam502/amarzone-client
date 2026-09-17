"use client";

import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ExternalLink,
  Info,
} from "lucide-react";
import { TSlaViolation } from "@/src/types/health";

interface HealthViolationsListProps {
  violations?: TSlaViolation[];
  isLoading?: boolean;
}

const HealthViolationsList: React.FC<HealthViolationsListProps> = ({
  violations = [],
  isLoading = false,
}) => {
  const formatMetricName = (metric?: string) => {
    switch (metric) {
      case "ORDER_DEFECT_RATE":
        return "Order Defect Rate (ODR)";
      case "LATE_SHIPMENT_RATE":
        return "Late Shipment Rate (LSR)";
      case "CANCELLATION_RATE":
        return "Pre-fulfillment Cancellation Rate (CR)";
      case "VALID_TRACKING_RATE":
        return "Valid Tracking Rate (VTR)";
      default:
        return metric || "Performance Metric";
    }
  };

  const getSeverityBadge = (severity?: string) => {
    if (severity === "SUSPENSION") {
      return (
        <span className="badge badge-error gap-1 text-[11px] font-black bg-rose-500/20 text-rose-300 border-rose-500/40">
          <Flame className="w-3 h-3 text-rose-400" />
          Suspension Escalation
        </span>
      );
    }
    return (
      <span className="badge badge-warning gap-1 text-[11px] font-black bg-amber-500/20 text-amber-300 border-amber-500/40">
        <AlertTriangle className="w-3 h-3 text-amber-400" />
        Official Warning
      </span>
    );
  };

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-7">
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-rose-400/40 to-transparent pointer-events-none z-20" />

      <div className="relative z-10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="badge badge-outline border-white/20 text-slate-300 text-xs px-2.5 py-1">
                Compliance Log
              </span>
              <span className="text-xs text-slate-400">
                {violations.length} {violations.length === 1 ? "Notice" : "Notices"}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Policy Violations & <span className="text-rose-400">SLA Notices</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Review any official marketplace SLA violations, warning triggers, or account restriction notices.
            </p>
          </div>
        </div>

        {/* Content State */}
        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
            <span className="loading loading-spinner loading-md text-amber-400" />
            <span className="text-xs">Checking violation history...</span>
          </div>
        ) : violations.length === 0 ? (
          <div className="py-8 px-4 rounded-2xl bg-black/20 border border-emerald-500/20 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black text-emerald-300">
                Zero Policy Violations Recorded
              </h4>
              <p className="text-xs text-slate-300/80 max-w-xl leading-relaxed">
                Your store currently has no active SLA strikes or policy restrictions. Continue shipping orders on time and resolving buyer inquiries to keep this flawless record.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {violations.map((v, idx) => (
              <div
                key={v._id || idx}
                className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {getSeverityBadge(v.severity)}
                    <span className="text-xs font-black text-white">
                      {formatMetricName(v.metric)}
                    </span>
                    {v.isResolved ? (
                      <span className="badge badge-success badge-sm text-[10px] font-bold">
                        Resolved
                      </span>
                    ) : (
                      <span className="badge badge-outline border-amber-400/40 text-amber-300 badge-sm text-[10px] font-bold">
                        Active Action Required
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-300 flex flex-wrap items-center gap-3">
                    <span>
                      Recorded Value:{" "}
                      <strong className="text-rose-400 font-extrabold">
                        {v.actualValue}%
                      </strong>
                    </span>
                    <span className="text-slate-500">•</span>
                    <span>
                      Logged on:{" "}
                      <span className="text-slate-400">
                        {v.createdAt
                          ? new Date(v.createdAt).toLocaleDateString()
                          : "Recent"}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 max-w-xs text-right hidden lg:block">
                    {v.severity === "SUSPENSION"
                      ? "Contact Partner Support to submit a Plan of Action."
                      : "Improve metric before next review cycle to prevent escalation."}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthViolationsList;
