"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { TOrder } from "@/src/types/order";
import { toast } from "react-toastify";

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
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !order) return null;

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
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Store className="w-4 h-4" />
                <span>Vendor Details</span>
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
        <div className="relative z-10 flex items-center justify-end p-4 border-t border-white/10 bg-white/[0.02]">
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
