"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Copy,
  Check,
  User,
  Store,
  Calendar,
  Truck,
  CreditCard,
  FileText,
  Package,
  Clock,
  ExternalLink,
  ShieldCheck,
  Receipt,
  Mail,
  Hash,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Activity,
  Zap,
  MessageSquare,
} from "lucide-react";
import { TOrder } from "@/src/types/order";
import { toast } from "react-toastify";
import {
  useAnalyzeFraudRiskMutation,
  TFraudAnalysisOutput,
} from "@/redux/features/ai/aiApi";
import { useCreateConversationMutation } from "@/src/redux/features/chat/chatApi";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentUser } from "@/src/redux/features/auth/authSlice";

export interface OrderDetailsModalProps {
  order: TOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const currentUser = useAppSelector(selectCurrentUser);
  const [createConversationApi] = useCreateConversationMutation();
  const [isStartingChat, setIsStartingChat] = useState(false);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  // AI Fraud Analysis state
  const [fraudResult, setFraudResult] = useState<TFraudAnalysisOutput | null>(null);
  const [isFraudScanOpen, setIsFraudScanOpen] = useState(false);
  const [analyzeFraudRisk, { isLoading: isFraudLoading }] =
    useAnalyzeFraudRiskMutation();

  if (!isOpen || !order) return null;

  const isCustomerUser =
    (currentUser as any)?.role?.toUpperCase() === "CUSTOMER";

  const handleStartVendorChat = async () => {
    const vendorId =
      typeof order.vendor === "object" ? order.vendor?._id : order.vendor;

    if (!vendorId) {
      toast.error("Vendor details unavailable for this order.");
      return;
    }

    try {
      setIsStartingChat(true);
      const res = await createConversationApi({
        participants: [String(vendorId)],
        conversationType: "ORDER",
        order: order._id,
      }).unwrap();

      onClose();
      if (res?.data?._id) {
        toast.success(`Connected to vendor for Order #${order.orderNo}`);
        router.push(`/customer/chat?conversationId=${res.data._id}`);
      } else {
        router.push(`/customer/chat`);
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to start conversation with vendor"
      );
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 1800);
      toast.success(`Copied ${label}: ${text}`, {
        position: "bottom-right",
        autoClose: 1600,
      });
    }
  };

  const handleFraudScan = async () => {
    if (!order) return;
    try {
      const payload = {
        userId: order.customer?._id || "unknown",
        orderAmount: order.totalPrice || 0,
        paymentMethod: order.transactionId ? "ONLINE_PAYMENT" : "CASH_ON_DELIVERY",
        shippingAddress: {
          name: order.customer?.name || "",
          email: order.customer?.email || "",
          orderId: order._id,
          orderNo: order.orderNo,
        },
        billingAddress: {
          name: order.customer?.name || "",
          email: order.customer?.email || "",
          transactionId: order.transactionId || "",
        },
        recentAttemptsCount: 1,
      };
      const res = await analyzeFraudRisk(payload).unwrap();
      setFraudResult(res.data);
      setIsFraudScanOpen(true);
      const level = res.data.riskLevel;
      if (level === "CRITICAL" || level === "HIGH") {
        toast.error(`⚠️ ${level} risk detected for Order #${order.orderNo}!`, { autoClose: 4000 });
      } else {
        toast.success("🛡️ AI Fraud Scan complete.", { autoClose: 2500 });
      }
    } catch {
      toast.error("AI Fraud scan failed. Please retry.");
    }
  };

  const formattedCreatedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const shippedDateStr = order.shippedDate
    ? `${new Date(order.shippedDate.from).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(order.shippedDate.to).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : "N/A";

  const deliveryDateStr = order.deliveryDate
    ? `${new Date(order.deliveryDate.from).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(order.deliveryDate.to).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : "N/A";

  const getOrderStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "badge-success text-slate-950 font-black";
      case "SHIPPED":
        return "badge-info text-white font-bold";
      case "PROCESSING":
      case "CONFIRMED":
        return "badge-warning text-slate-950 font-bold";
      case "CANCELLED":
        return "badge-error text-white font-bold";
      default:
        return "badge-outline border-amber-400/40 text-amber-400 font-bold";
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return "badge-success text-slate-950 font-black";
      case "REFUNDED":
        return "badge-warning text-slate-950 font-bold";
      default:
        return "badge-error text-white font-bold";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-[#170d2f] border border-white/10 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative text-slate-100">
        {/* Top glowing accent border ray */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

        {/* Ambient background glow orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between p-5 sm:p-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-base sm:text-lg font-black text-amber-400">
                #{order.orderNo}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(order.orderNo, "Order #")}
                className="text-slate-400 hover:text-white cursor-pointer"
                title="Copy Order #"
              >
                {copiedField === "Order #" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <span className={`badge ${getOrderStatusBadge(order.status)} badge-sm`}>
                {order.status}
              </span>

              <span className={`badge ${getPaymentStatusBadge(order.paymentStatus)} badge-sm`}>
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Placed on {formattedCreatedDate}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="relative z-10 overflow-y-auto p-5 sm:p-6 space-y-6 flex-1 text-xs">
          {/* Customer & Vendor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <User className="w-4 h-4" />
                <span>Customer Details</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="font-semibold text-white text-sm">
                  {order.customer?.name || "Customer Account"}
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{order.customer?.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Hash className="w-3 h-3" />
                  <span>ID: {order.customer?._id || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Vendor Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Store className="w-4 h-4" />
                  <span>Vendor Details</span>
                </div>
                {isCustomerUser && (
                  <button
                    type="button"
                    onClick={handleStartVendorChat}
                    disabled={isStartingChat}
                    className="btn btn-xs gap-1 font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 rounded-lg cursor-pointer"
                  >
                    {isStartingChat ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <MessageSquare className="w-3 h-3" />
                    )}
                    <span>Chat with Vendor</span>
                  </button>
                )}
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="font-semibold text-white text-sm">
                  {order.vendor?.name || "Marketplace Vendor"}
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{order.vendor?.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Hash className="w-3 h-3" />
                  <span>ID: {order.vendor?._id || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              <Package className="w-4 h-4 text-amber-400" />
              <span>Purchased Items ({order.products?.length || 0})</span>
            </h4>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
              <table className="table w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-2.5 px-3">Item / Product</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products && order.products.length > 0 ? (
                    order.products.map((item, idx) => {
                      const variantObj = typeof item.variant === "object" ? item.variant : null;
                      const productObj = variantObj?.product;
                      const title =
                        productObj?.title ||
                        (variantObj?.sku ? `Variant ${variantObj.sku}` : `Product Variant #${idx + 1}`);
                      const thumbnail = productObj?.thumbnail || variantObj?.thumbnail;
                      const itemPrice = item.price || 0;
                      const lineTotal = itemPrice * (item.quantity || 1);

                      return (
                        <tr key={idx} className="border-b border-white/5 last:border-none">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-3">
                              {thumbnail ? (
                                <img
                                  src={thumbnail}
                                  alt={title}
                                  className="w-10 h-10 object-contain rounded-lg bg-white/10 p-0.5 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                                  <Package className="w-4 h-4" />
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-white max-w-sm truncate" title={title}>
                                  {title}
                                </div>
                                {variantObj?.sku && (
                                  <div className="text-[10px] text-slate-400 font-mono">
                                    SKU: {variantObj.sku}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-white">
                            {item.quantity}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                            ${itemPrice.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400">
                            ${lineTotal.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-slate-400">
                        No product lines recorded for this order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financials & Payout Breakdown */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>Financial Settlement Breakdown</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  Total Items Qty
                </span>
                <div className="text-base font-black text-white mt-0.5">
                  {order.totalQuantity}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  Order Total (Gross)
                </span>
                <div className="text-base font-black text-emerald-400 mt-0.5">
                  ${order.totalPrice?.toFixed(2) || "0.00"}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  Platform Commission
                </span>
                <div className="text-base font-black text-amber-400 mt-0.5">
                  ${order.commission?.toFixed(2) || "0.00"}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  Vendor Payout
                </span>
                <div className="text-base font-black text-purple-300 mt-0.5">
                  ${order.vendorAmount?.toFixed(2) || "0.00"}
                </div>
              </div>
            </div>
          </div>

          {/* ── AI FRAUD RISK ANALYSIS SECTION ── */}
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            {/* Section Header / Trigger */}
            <div
              className="flex items-center justify-between p-4 bg-white/[0.03] cursor-pointer hover:bg-white/[0.06] transition-colors"
              onClick={() => setIsFraudScanOpen((v) => !v)}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-rose-500/30 to-amber-500/30 flex items-center justify-center border border-rose-500/20">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <span className="text-sm font-black text-white">AI Fraud Risk Scanner</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-semibold text-rose-400/80 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                      ADMIN ONLY
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {fraudResult
                        ? `Last scan: ${fraudResult.riskLevel} risk · Score ${fraudResult.riskScore}/100`
                        : "No scan performed yet"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleFraudScan(); }}
                disabled={isFraudLoading}
                className="btn btn-xs gap-1.5 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white border-0 rounded-xl font-bold shadow-md shadow-rose-900/40 cursor-pointer disabled:opacity-60"
              >
                {isFraudLoading ? (
                  <><Loader2 className="w-3 h-3 animate-spin" /><span>Scanning...</span></>
                ) : fraudResult ? (
                  <><RefreshCw className="w-3 h-3" /><span>Re-scan</span></>
                ) : (
                  <><Sparkles className="w-3 h-3" /><span>Run AI Scan</span></>
                )}
              </button>
            </div>

            {/* Results Panel */}
            {isFraudScanOpen && fraudResult && (
              <div className="p-5 space-y-5 border-t border-white/10 bg-white/[0.01]">
                {/* Risk Score Meter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider">Risk Score</span>
                    <span className={`font-black text-lg font-mono ${
                      fraudResult.riskScore >= 80 ? "text-rose-400" :
                      fraudResult.riskScore >= 60 ? "text-orange-400" :
                      fraudResult.riskScore >= 40 ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {fraudResult.riskScore}<span className="text-slate-500 text-xs font-normal">/100</span>
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        fraudResult.riskScore >= 80 ? "bg-gradient-to-r from-rose-600 to-red-500" :
                        fraudResult.riskScore >= 60 ? "bg-gradient-to-r from-orange-500 to-amber-500" :
                        fraudResult.riskScore >= 40 ? "bg-gradient-to-r from-amber-400 to-yellow-400" :
                        "bg-gradient-to-r from-emerald-500 to-teal-500"
                      }`}
                      style={{ width: `${fraudResult.riskScore}%` }}
                    />
                  </div>
                  {/* Tick labels */}
                  <div className="flex justify-between text-[10px] text-slate-600 font-semibold">
                    <span>0</span><span className="text-emerald-600">Safe</span><span className="text-amber-500">Caution</span><span className="text-rose-500">Critical</span><span>100</span>
                  </div>
                </div>

                {/* Risk Level + Action Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Risk Level */}
                  <div className={`p-3.5 rounded-2xl border ${
                    fraudResult.riskLevel === "CRITICAL" ? "bg-rose-500/10 border-rose-500/30" :
                    fraudResult.riskLevel === "HIGH" ? "bg-orange-500/10 border-orange-500/30" :
                    fraudResult.riskLevel === "MEDIUM" ? "bg-amber-500/10 border-amber-500/30" :
                    "bg-emerald-500/10 border-emerald-500/30"
                  } space-y-1`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Risk Level</span>
                    <div className={`flex items-center gap-1.5 font-black text-base ${
                      fraudResult.riskLevel === "CRITICAL" ? "text-rose-400" :
                      fraudResult.riskLevel === "HIGH" ? "text-orange-400" :
                      fraudResult.riskLevel === "MEDIUM" ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {fraudResult.riskLevel === "LOW" ? <ShieldCheck className="w-4 h-4" /> :
                       fraudResult.riskLevel === "MEDIUM" ? <Activity className="w-4 h-4" /> :
                       <ShieldAlert className="w-4 h-4" />}
                      {fraudResult.riskLevel}
                    </div>
                  </div>

                  {/* Recommended Action */}
                  <div className={`p-3.5 rounded-2xl border ${
                    fraudResult.recommendedAction === "BLOCK" ? "bg-rose-500/10 border-rose-500/30" :
                    fraudResult.recommendedAction === "REVIEW" ? "bg-amber-500/10 border-amber-500/30" :
                    "bg-emerald-500/10 border-emerald-500/30"
                  } space-y-1`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recommended Action</span>
                    <div className={`flex items-center gap-1.5 font-black text-base ${
                      fraudResult.recommendedAction === "BLOCK" ? "text-rose-400" :
                      fraudResult.recommendedAction === "REVIEW" ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {fraudResult.recommendedAction === "ALLOW" ? <CheckCircle2 className="w-4 h-4" /> :
                       fraudResult.recommendedAction === "REVIEW" ? <Zap className="w-4 h-4" /> :
                       <XCircle className="w-4 h-4" />}
                      {fraudResult.recommendedAction}
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                {fraudResult.riskFactors.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      Detected Risk Factors ({fraudResult.riskFactors.length})
                    </span>
                    <div className="space-y-1.5">
                      {fraudResult.riskFactors.map((factor, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-xs text-slate-300">
                          <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {fraudResult.riskFactors.length === 0 && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    No risk factors detected — this order appears legitimate.
                  </div>
                )}
              </div>
            )}

            {/* Pre-scan placeholder */}
            {!fraudResult && !isFraudLoading && (
              <div className="p-6 text-center space-y-2 border-t border-white/10">
                <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500">
                  Click <strong className="text-rose-400">Run AI Scan</strong> to analyse this order for fraud signals using AI risk modeling.
                </p>
              </div>
            )}

            {/* Loading skeleton */}
            {isFraudLoading && (
              <div className="p-6 space-y-3 border-t border-white/10 animate-pulse">
                <div className="h-4 bg-white/10 rounded-lg w-3/4" />
                <div className="h-3 bg-white/10 rounded-lg w-1/2" />
                <div className="h-16 bg-white/10 rounded-xl w-full" />
                <div className="h-3 bg-white/10 rounded-lg w-2/3" />
              </div>
            )}
          </div>

          {/* Shipping & Delivery Schedules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Estimated Shipping Window</span>
              </div>
              <div className="text-white font-medium pl-5">{shippedDateStr}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Estimated Delivery Window</span>
              </div>
              <div className="text-white font-medium pl-5">{deliveryDateStr}</div>
            </div>
          </div>

          {/* Tracking Details (if present) */}
          {order.tracking && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                  <Truck className="w-4 h-4" />
                  <span>Courier & Tracking Information</span>
                </div>
                <span className="badge badge-sm badge-info">{order.tracking.courierName}</span>
              </div>

              <div className="flex items-center gap-2 pt-1 font-mono text-white text-xs">
                <span>Tracking Number:</span>
                <span className="font-bold text-amber-300">{order.tracking.trackingNumber}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(order.tracking!.trackingNumber || "", "Tracking Number")}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {order.tracking.notes && (
                <div className="text-slate-400 text-[11px] pt-1 italic">
                  Notes: {order.tracking.notes}
                </div>
              )}
            </div>
          )}

          {/* Payment & Invoice Row */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Transaction Reference</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-slate-200">
                <span className="truncate max-w-xs">{order.transactionId || "No transaction reference"}</span>
                {order.transactionId && (
                  <button
                    type="button"
                    onClick={() => handleCopy(order.transactionId, "Transaction ID")}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {order.invoiceUrl ? (
              <a
                href={order.invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm gap-2 font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl border-none shadow-sm shrink-0"
              >
                <FileText className="w-4 h-4" />
                <span>Download Invoice PDF</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>
            ) : (
              <span className="text-[11px] text-slate-500 italic">Invoice PDF pending generation</span>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="relative z-10 flex items-center justify-between p-4 border-t border-white/10 bg-white/[0.02]">
          <div>
            {isCustomerUser && (
              <button
                type="button"
                onClick={handleStartVendorChat}
                disabled={isStartingChat}
                className="btn btn-sm gap-2 font-bold bg-primary hover:bg-primary/90 text-slate-950 rounded-xl border-none shadow-sm cursor-pointer"
              >
                {isStartingChat ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MessageSquare className="w-4 h-4" />
                )}
                <span>Message Store Vendor</span>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost text-slate-300 hover:text-white font-bold rounded-xl border border-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
