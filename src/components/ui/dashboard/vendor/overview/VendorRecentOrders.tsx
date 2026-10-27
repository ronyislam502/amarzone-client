"use client";

import React from "react";
import Link from "next/link";
import {
    ShoppingBag,
    ArrowUpRight,
    Package,
    Clock,
    User,
    CheckCircle2,
    Truck,
    AlertCircle,
    RotateCcw,
    XCircle,
} from "lucide-react";
import { TOrder } from "@/types/order";

export interface VendorRecentOrdersProps {
    orders?: (TOrder | any)[];
    isLoading?: boolean;
}

const ORDER_STATUS_CONFIG: Record<
    string,
    { label: string; badgeClass: string; icon: React.ReactNode }
> = {
    DELIVERED: {
        label: "Delivered",
        badgeClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
        icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
    },
    SHIPPED: {
        label: "Shipped",
        badgeClass: "bg-sky-500/15 border-sky-500/30 text-sky-300",
        icon: <Truck className="w-3 h-3 text-sky-400" />,
    },
    IN_TRANSIT: {
        label: "In Transit",
        badgeClass: "bg-sky-500/15 border-sky-500/30 text-sky-300",
        icon: <Truck className="w-3 h-3 text-sky-400" />,
    },
    OUT_OF_DELIVERY: {
        label: "Out For Delivery",
        badgeClass: "bg-blue-500/15 border-blue-500/30 text-blue-300",
        icon: <Truck className="w-3 h-3 text-blue-400" />,
    },
    UNSHIPPED: {
        label: "Unshipped",
        badgeClass: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
        icon: <Package className="w-3 h-3 text-cyan-400" />,
    },
    PROCESSING: {
        label: "Processing",
        badgeClass: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
        icon: <Package className="w-3 h-3 text-cyan-400" />,
    },
    PENDING: {
        label: "Pending",
        badgeClass: "bg-amber-500/15 border-amber-500/30 text-amber-300",
        icon: <Clock className="w-3 h-3 text-amber-400" />,
    },
    CANCELLED: {
        label: "Cancelled",
        badgeClass: "bg-rose-500/15 border-rose-500/30 text-rose-300",
        icon: <XCircle className="w-3 h-3 text-rose-400" />,
    },
    REFUNDED: {
        label: "Refunded",
        badgeClass: "bg-purple-500/15 border-purple-500/30 text-purple-300",
        icon: <RotateCcw className="w-3 h-3 text-purple-400" />,
    },
};

export const VendorRecentOrders: React.FC<VendorRecentOrdersProps> = ({
    orders = [],
    isLoading = false,
}) => {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
        }).format(val || 0);
    };

    const formatDate = (dateStr?: string | Date) => {
        if (!dateStr) return "Recent";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const displayOrders = orders.slice(0, 6);

    return (
        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
            {/* Glowing top line */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
            <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-base font-extrabold text-white">
                                Incoming & Recent Orders
                            </h3>
                            <p className="text-xs text-slate-400">
                                Latest confirmed purchase orders awaiting packaging, transit, or delivery.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/vendor/orders"
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group transition-colors"
                    >
                        <span>View All Orders</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Table or Empty State */}
                {isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mb-3" />
                        <span className="text-xs text-slate-400">Loading database orders...</span>
                    </div>
                ) : displayOrders.length === 0 ? (
                    <div className="py-10 px-4 rounded-2xl bg-white/[0.02] border border-white/10 text-center flex flex-col items-center justify-center space-y-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                            <Package className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-extrabold text-white">No Orders Found</h4>
                        <p className="text-xs text-slate-400 max-w-sm">
                            No customer transactions recorded in your store database yet. As soon as shoppers
                            place orders, they will appear here in real-time.
                        </p>
                        <Link
                            href="/vendor/inventory"
                            className="btn btn-xs btn-outline border-amber-400/40 text-amber-300 hover:bg-amber-400 hover:text-slate-950 rounded-lg mt-2 font-bold"
                        >
                            Manage Product Catalog
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
                        <table className="table table-sm w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-2.5 px-3">Order #</th>
                                    <th className="py-2.5 px-3">Customer</th>
                                    <th className="py-2.5 px-3">Date</th>
                                    <th className="py-2.5 px-3 text-right">Amount</th>
                                    <th className="py-2.5 px-3 text-center">Status</th>
                                    <th className="py-2.5 px-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs font-medium">
                                {displayOrders.map((order, idx) => {
                                    const statusKey = (order.status || "PENDING").toUpperCase();
                                    const statusConfig = ORDER_STATUS_CONFIG[statusKey] || {
                                        label: statusKey,
                                        badgeClass: "bg-slate-500/15 border-slate-500/30 text-slate-300",
                                        icon: <AlertCircle className="w-3 h-3 text-slate-400" />,
                                    };

                                    const customerName =
                                        order.customer?.name ||
                                        order.customer?.email?.split("@")[0] ||
                                        "Customer";

                                    const orderIdentifier =
                                        order.orderNo || (order._id ? `#${order._id.slice(-6)}` : `#${idx + 1}`);

                                    const orderPrice = Number(
                                        order.vendorAmount ?? order.totalPrice ?? 0
                                    );

                                    return (
                                        <tr
                                            key={order._id || idx}
                                            className="hover:bg-white/[0.03] transition-colors group"
                                        >
                                            {/* Order identifier */}
                                            <td className="py-3 px-3 font-mono font-black text-amber-400">
                                                {orderIdentifier}
                                            </td>

                                            {/* Customer name */}
                                            <td className="py-3 px-3 text-slate-200">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                        <User className="w-3 h-3 text-slate-400" />
                                                    </div>
                                                    <span className="truncate max-w-[130px] font-semibold">
                                                        {customerName}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                                                {formatDate(order.createdAt)}
                                            </td>

                                            {/* Amount */}
                                            <td className="py-3 px-3 text-right font-mono font-black text-white">
                                                {formatCurrency(orderPrice)}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-3 px-3 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.badgeClass}`}
                                                >
                                                    {statusConfig.icon}
                                                    <span>{statusConfig.label}</span>
                                                </span>
                                            </td>

                                            {/* Action Link */}
                                            <td className="py-3 px-3 text-right">
                                                <Link
                                                    href="/vendor/orders"
                                                    className="btn btn-xs btn-ghost text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-[11px] font-bold"
                                                >
                                                    Manage
                                                </Link>
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

export default VendorRecentOrders;
