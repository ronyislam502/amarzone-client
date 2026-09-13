"use client";

import React from "react";
import { X, Package, ShieldCheck, Clock, CreditCard, User, MapPin } from "lucide-react";
import { TPendingOrderRecord } from "./PendingOrdersTable";

interface OrderDetailsModalProps {
  order: TPendingOrderRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="card relative w-full max-w-2xl bg-[#170d2f] border border-white/20 shadow-2xl rounded-3xl overflow-hidden animate-scaleIn">
        {/* Top glowing accent line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent pointer-events-none z-20" />

        {/* Ambient background glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-[#120826]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="badge badge-warning font-black text-xs text-slate-950 px-2.5 py-0.5">
                {order.status}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {order.orderDate.relative}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Order #{order.orderNo}</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="relative z-10 p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status Notice */}
          <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/30 text-cyan-200 text-xs flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">Awaiting Payment Clearance</div>
              <div className="text-slate-300 text-[11px] leading-relaxed">
                This order is in Pending status. The customer&apos;s bank or payment provider is authorizing the transaction. Do not ship products until status changes to Unshipped.
              </div>
            </div>
          </div>

          {/* Product Summary */}
          <div className="p-4 rounded-2xl bg-[#120826] border border-white/10 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>Purchased Item</span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-16 h-16 rounded-xl bg-slate-900 border border-white/15 overflow-hidden shrink-0">
                {order.product.thumbnail ? (
                  <img
                    src={order.product.thumbnail}
                    alt={order.product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <Package className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="space-y-1 flex-1">
                <div className="font-bold text-sm text-white line-clamp-2">
                  {order.product.title}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-400">
                  <span>ASIN: <strong className="text-slate-200">{order.product.asin}</strong></span>
                  <span>SKU: <strong className="text-slate-200">{order.product.sku}</strong></span>
                  <span>Qty: <strong className="text-white">{order.product.quantity}</strong></span>
                </div>
                <div className="text-xs font-black text-amber-400 pt-0.5">
                  Subtotal: ${order.product.subtotal.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Fulfillment & Channel Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-[#120826] border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fulfillment Method</span>
              <div className="text-sm font-bold text-white">{order.fulfillmentMethod}</div>
              <div className="text-[11px] text-slate-400">Merchant standard dispatch</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#120826] border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sales Channel</span>
              <div className="text-sm font-bold text-white">{order.salesChannel}</div>
              <div className="text-[11px] text-slate-400">Order placed on Amarzone marketplace</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="relative z-10 p-4 sm:p-5 border-t border-white/10 bg-[#120826] flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Order ID: {order.id}</span>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl px-5 text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
