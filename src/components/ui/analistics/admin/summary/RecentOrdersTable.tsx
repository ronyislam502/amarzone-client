"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowUpRight,
  User,
  Store,
  Calendar,
  CreditCard,
} from "lucide-react";
import { TRecentOrder } from "@/src/types/dashboard";

interface RecentOrdersTableProps {
  orders?: TRecentOrder[];
}

const ORDER_STATUS_CLASSES: Record<string, string> = {
  DELIVERED: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
  SHIPPED: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  UNSHIPPED: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
  PENDING: "bg-amber-500/15 border-amber-500/30 text-amber-400",
  CANCELLED: "bg-rose-500/15 border-rose-500/30 text-rose-400",
  REFUNDED: "bg-purple-500/15 border-purple-500/30 text-purple-400",
};

const PAYMENT_STATUS_CLASSES: Record<string, string> = {
  PAID: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  UNPAID: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  REFUNDED: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  orders = [],
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
      {/* Glowing top line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
      <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Recent Order Activity
              </h2>
              <p className="text-xs text-slate-400">
                Live transactional feed of latest customer checkouts.
              </p>
            </div>
          </div>

          <Link
            href="/admin/orders"
            className="btn btn-xs sm:btn-sm gap-1 text-amber-400 hover:bg-amber-400 hover:text-slate-950 font-bold border border-amber-400/30 rounded-xl transition-all"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Orders Table */}
        {orders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No recent orders recorded in the current range.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-xs sm:table-sm w-full">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th>Order Ref</th>
                  <th>Customer</th>
                  <th>Vendor</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200 text-xs">
                {orders.slice(0, 7).map((order) => {
                  const statusKey = order.status?.toUpperCase() || "PENDING";
                  const payKey = order.paymentStatus?.toUpperCase() || "UNPAID";
                  const statusBadgeClass =
                    ORDER_STATUS_CLASSES[statusKey] || ORDER_STATUS_CLASSES.PENDING;
                  const payBadgeClass =
                    PAYMENT_STATUS_CLASSES[payKey] || PAYMENT_STATUS_CLASSES.UNPAID;

                  return (
                    <tr key={order._id} className="hover:bg-white/[0.03] transition-colors">
                      {/* Order Ref & Date */}
                      <td className="font-mono">
                        <div className="font-black text-white">
                          #{order.orderNo || order._id.slice(-6).toUpperCase()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {formatDate(order.createdAt)}
                        </div>
                      </td>

                      {/* Customer */}
                      <td>
                        <div className="font-bold text-slate-200 truncate max-w-[130px]">
                          {order.customer?.name || "Customer"}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                          {order.customer?.email}
                        </div>
                      </td>

                      {/* Vendor */}
                      <td>
                        <div className="font-bold text-slate-300 truncate max-w-[120px]">
                          {order.vendor?.name || "Store"}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="font-mono font-black text-amber-400 text-xs">
                        {formatCurrency(order.totalPrice || 0)}
                      </td>

                      {/* Order Status */}
                      <td>
                        <span
                          className={`badge badge-xs uppercase font-extrabold px-2 py-1 border ${statusBadgeClass}`}
                        >
                          {order.status || "PENDING"}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td>
                        <span
                          className={`badge badge-xs uppercase font-bold px-2 py-1 border ${payBadgeClass}`}
                        >
                          {order.paymentStatus || "UNPAID"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrdersTable;
