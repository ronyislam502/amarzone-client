"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Clock,
  Truck,
  Navigation,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Package,
  Copy,
  Check,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Radio,
  Sparkles,
  MapPin,
  ArrowRight,
  Info,
} from "lucide-react";
import { TOrder } from "@/src/types/order";
import { toast } from "react-toastify";

export type TOrderStage = 1 | 2 | 3 | 4 | 5;

export interface IStageInfo {
  step: TOrderStage;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ElementType;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
}

export const ORDER_STAGES: Record<number, IStageInfo> = {
  1: {
    step: 1,
    label: "Order Placed",
    shortLabel: "Placed",
    description: "Order received & payment verified. Awaiting merchant processing.",
    icon: ShoppingBag,
    badgeBg: "bg-amber-400/10 border-amber-400/30 text-amber-300",
    badgeText: "Order Placed",
    accentColor: "amber",
  },
  2: {
    step: 2,
    label: "Confirmed & Packing",
    shortLabel: "Processing",
    description: "Merchant has accepted the order and is preparing items for carrier pickup.",
    icon: Clock,
    badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-300",
    badgeText: "Processing",
    accentColor: "purple",
  },
  3: {
    step: 3,
    label: "Dispatched / In Transit",
    shortLabel: "Shipped",
    description: "Package handed over to courier and is currently in transit to destination hub.",
    icon: Truck,
    badgeBg: "bg-sky-400/10 border-sky-400/30 text-sky-300",
    badgeText: "Shipped",
    accentColor: "sky",
  },
  4: {
    step: 4,
    label: "Out for Delivery",
    shortLabel: "Out for Delivery",
    description: "Courier dispatch rider is out for delivery to your shipping address today.",
    icon: Navigation,
    badgeBg: "bg-cyan-400/10 border-cyan-400/30 text-cyan-300",
    badgeText: "Out for Delivery",
    accentColor: "cyan",
  },
  5: {
    step: 5,
    label: "Delivered",
    shortLabel: "Delivered",
    description: "Package successfully handed over to recipient. Order completed.",
    icon: CheckCircle2,
    badgeBg: "bg-emerald-400/10 border-emerald-400/30 text-emerald-300",
    badgeText: "Delivered",
    accentColor: "emerald",
  },
};

/**
 * Compute the progression stage number (1 to 5) or terminal state from order.status
 */
export const getOrderStageNumber = (status?: string): { stage: TOrderStage; isTerminal: boolean; terminalType?: "CANCELLED" | "REFUNDED" } => {
  const s = status?.toUpperCase() || "PENDING";

  if (s === "CANCELLED") {
    return { stage: 1, isTerminal: true, terminalType: "CANCELLED" };
  }
  if (s === "REFUNDED") {
    return { stage: 1, isTerminal: true, terminalType: "REFUNDED" };
  }
  if (s === "DELIVERED") {
    return { stage: 5, isTerminal: false };
  }
  if (s === "OUT_OF_DELIVERY") {
    return { stage: 4, isTerminal: false };
  }
  if (s === "SHIPPED" || s === "IN_TRANSIT") {
    return { stage: 3, isTerminal: false };
  }
  if (s === "UNSHIPPED" || s === "CONFIRMED" || s === "PROCESSING") {
    return { stage: 2, isTerminal: false };
  }

  // PENDING or default
  return { stage: 1, isTerminal: false };
};

/* ─── Compact Table Cell Component ───────────────────────────── */

interface OrderStageCellProps {
  order: TOrder;
  onOpenTracking?: (order: TOrder) => void;
}

export const OrderStageCell: React.FC<OrderStageCellProps> = ({ order, onOpenTracking }) => {
  const { stage, isTerminal, terminalType } = getOrderStageNumber(order.status);
  const currentStageInfo = ORDER_STAGES[stage];

  if (isTerminal) {
    if (terminalType === "CANCELLED") {
      return (
        <div className="space-y-1.5 min-w-[150px]">
          <div className="flex items-center gap-1.5">
            <span className="badge badge-error badge-sm text-white font-black gap-1">
              <XCircle className="w-3 h-3" /> Cancelled
            </span>
          </div>
          <div className="text-[10px] text-rose-300/80">
            Order voided / cancelled
          </div>
        </div>
      );
    }
    if (terminalType === "REFUNDED") {
      return (
        <div className="space-y-1.5 min-w-[150px]">
          <div className="flex items-center gap-1.5">
            <span className="badge badge-warning badge-sm text-slate-950 font-black gap-1">
              <RotateCcw className="w-3 h-3" /> Refunded
            </span>
          </div>
          <div className="text-[10px] text-amber-300/80">
            Payment returned to buyer
          </div>
        </div>
      );
    }
  }

  const trackingNumber = order.tracking?.trackingNumber;
  const courierName = order.tracking?.courierName;

  return (
    <div
      onClick={() => onOpenTracking?.(order)}
      className="space-y-1.5 min-w-[160px] group cursor-pointer"
      title="Click to view live delivery timeline"
    >
      {/* Stage Badge & Status Name */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className={`badge border text-[11px] font-black px-2.5 py-1 gap-1 transition-transform group-hover:scale-105 ${currentStageInfo.badgeBg}`}
        >
          {stage === 3 || stage === 4 ? (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping mr-0.5" />
          ) : stage === 5 ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          ) : (
            <currentStageInfo.icon className="w-3 h-3" />
          )}
          {currentStageInfo.badgeText}
        </span>
      </div>

      {/* 5-Step Mini Progress Indicator */}
      <div className="flex items-center gap-1 w-28">
        {[1, 2, 3, 4, 5].map((stepIdx) => {
          const isCompleted = stepIdx < stage;
          const isCurrent = stepIdx === stage;

          return (
            <div
              key={stepIdx}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                isCompleted
                  ? "bg-emerald-400"
                  : isCurrent
                  ? "bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"
                  : "bg-white/10"
              }`}
            />
          );
        })}
      </div>

      {/* Stage Context / Courier Snippet */}
      <div className="text-[10px] text-slate-400 flex items-center gap-1 group-hover:text-slate-200 transition-colors">
        <span className="font-semibold text-slate-300">
          Stage {stage}/5
        </span>
        <span>•</span>
        {courierName && trackingNumber ? (
          <span className="truncate max-w-[110px] text-cyan-300 font-mono" title={`${courierName} #${trackingNumber}`}>
            {courierName}
          </span>
        ) : (
          <span className="truncate max-w-[110px]">{currentStageInfo.shortLabel}</span>
        )}
      </div>
    </div>
  );
};

/* ─── Interactive Live Tracking Modal ────────────────────────── */

interface OrderLiveTrackingModalProps {
  order: TOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderLiveTrackingModal: React.FC<OrderLiveTrackingModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const [copiedTracking, setCopiedTracking] = useState(false);

  if (!isOpen || !order) return null;

  const { stage, isTerminal, terminalType } = getOrderStageNumber(order.status);
  const currentStageInfo = ORDER_STAGES[stage];

  const handleCopy = (text: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
      toast.success(`Copied tracking number: ${text}`, {
        position: "bottom-right",
        autoClose: 1800,
      });
    }
  };

  const tracking = order.tracking;
  const createdAtFormatted = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

  const shippedAtFormatted = tracking?.shippedAt
    ? new Date(tracking.shippedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : stage >= 3
    ? "Dispatched"
    : "Pending Dispatch";

  const deliveredAtFormatted = tracking?.deliveredAt
    ? new Date(tracking.deliveredAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : stage === 5
    ? "Delivered"
    : "Pending Delivery";

  const estimatedDelivery = tracking?.estimatedDelivery || order.deliveryDate?.to;
  const estimatedFormatted = estimatedDelivery
    ? new Date(estimatedDelivery).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Within standard carrier schedule";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#170d2f] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top glowing ambient accent */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500 via-cyan-400 to-purple-500 z-20 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge badge-sm font-mono font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                #{order.orderNo || order._id.slice(-8)}
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Live Real-Time Tracking</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Order Stage Progression
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-slate-400 hover:text-white hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 relative z-10 text-xs text-slate-200">
          {/* Current Status Highlight Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1c1139] via-[#160d2e] to-[#120824] border border-white/10 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Current Fulfillment State
              </div>
              <div className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <currentStageInfo.icon className="w-5 h-5 text-emerald-400" />
                <span>{isTerminal ? terminalType : currentStageInfo.label}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed max-w-md">
                {isTerminal
                  ? terminalType === "CANCELLED"
                    ? "This order was cancelled and inventory was returned to stock."
                    : "Payment for this order was refunded."
                  : currentStageInfo.description}
              </p>
            </div>

            <div className="shrink-0 p-3 rounded-xl bg-white/5 border border-white/10 text-right">
              <div className="text-[10px] font-bold uppercase text-slate-400">Est. Arrival</div>
              <div className="text-xs sm:text-sm font-black text-cyan-300 font-mono">
                {estimatedFormatted}
              </div>
            </div>
          </div>

          {/* Stepper Timeline Progression */}
          {!isTerminal ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Package Milestones (5 Stages)
                </span>
                <span className="badge badge-ghost text-[10px] font-bold text-slate-400 border-white/10">
                  Stage {stage} of 5 Completed
                </span>
              </div>

              {/* Vertical / Horizontal Stepper List */}
              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
                {[1, 2, 3, 4, 5].map((stepNumber) => {
                  const stepInfo = ORDER_STAGES[stepNumber];
                  const Icon = stepInfo.icon;
                  const isCompleted = stepNumber < stage;
                  const isCurrent = stepNumber === stage;
                  const isUpcoming = stepNumber > stage;

                  // Dynamic timestamp for milestone
                  let timeLabel = "";
                  if (stepNumber === 1) timeLabel = createdAtFormatted;
                  else if (stepNumber === 3) timeLabel = shippedAtFormatted;
                  else if (stepNumber === 5) timeLabel = deliveredAtFormatted;
                  else if (stepNumber === 4 && isCurrent) timeLabel = "In Progress Today";

                  return (
                    <div key={stepNumber} className="relative group">
                      {/* Node Indicator */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all ${
                          isCompleted
                            ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20"
                            : isCurrent
                            ? "bg-cyan-500 border-cyan-300 text-slate-950 shadow-[0_0_12px_rgba(34,211,238,0.7)] animate-pulse"
                            : "bg-[#120824] border-white/20 text-slate-500"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                        ) : (
                          <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </div>

                      {/* Content Card */}
                      <div
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                          isCurrent
                            ? "bg-white/[0.06] border-cyan-400/40 shadow-lg shadow-cyan-500/5"
                            : isCompleted
                            ? "bg-white/[0.03] border-white/10"
                            : "bg-white/[0.01] border-white/5 opacity-60"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-black text-sm ${
                                isCurrent
                                  ? "text-cyan-300"
                                  : isCompleted
                                  ? "text-white"
                                  : "text-slate-400"
                              }`}
                            >
                              {stepNumber}. {stepInfo.label}
                            </span>
                            {isCurrent && (
                              <span className="badge badge-xs bg-cyan-400 text-slate-950 font-black px-1.5 py-0.5">
                                CURRENT STAGE
                              </span>
                            )}
                          </div>
                          {timeLabel && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {timeLabel}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                          {stepInfo.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-2">
              <XCircle className="w-8 h-8 text-rose-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Order {terminalType}</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                This order is no longer following the delivery pipeline because it was marked as {terminalType?.toLowerCase()}.
              </p>
            </div>
          )}

          {/* Carrier & Tracking Logistics Card */}
          {tracking?.trackingNumber ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  <span>Courier & Waybill Logistics</span>
                </div>
                <span className="badge badge-outline border-cyan-400/40 text-cyan-300 text-[10px]">
                  Verified Dispatch
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Carrier Service</div>
                  <div className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{tracking.courierName || "Standard Express Carrier"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Tracking Code / Waybill</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                      {tracking.trackingNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(tracking.trackingNumber || "")}
                      className="btn btn-xs bg-white/10 hover:bg-white/20 text-white border-0 rounded-lg gap-1"
                      title="Copy Tracking Number"
                    >
                      {copiedTracking ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedTracking ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {tracking.notes && (
                <div className="pt-2 border-t border-white/5 text-[11px] text-slate-300 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Carrier Dispatch Notes:</strong> {tracking.notes}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-slate-400">
              <Info className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                Courier tracking details will be populated here as soon as the merchant books shipment dispatch.
              </span>
            </div>
          )}

          {/* Real-time sync guarantee banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3 text-[11px] text-emerald-300">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
              <span>
                Connected to Amarzone Real-Time Gateway. Status changes are pushed automatically without refreshing.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-end gap-3 relative z-10 bg-[#140b2a]">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm bg-white/10 hover:bg-white/20 text-white border-0 rounded-xl px-5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderStageCell;
