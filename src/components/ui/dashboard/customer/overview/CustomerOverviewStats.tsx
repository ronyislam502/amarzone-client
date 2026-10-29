"use client";

import React from "react";
import Link from "next/link";
import {
    DollarSign,
    ShoppingBag,
    Truck,
    ShieldCheck,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    MessageSquare,
} from "lucide-react";
import AZStats, { TAZStat } from "@/components/shared/AZStats";
import { useMyOrdersQuery } from "@/redux/features/order/orderApi";
import { TOrder } from "@/types/order";
import { TMeta } from "@/types/global";

export interface CustomerOverviewStatsProps {
    totalSpent?: number;
    totalOrders?: number;
    deliveredOrders?: number;
    inTransitOrders?: number;
    pendingOrders?: number;
    orders?: TOrder[];
    isLoading?: boolean;
    meta?: TMeta;
    showActionStrip?: boolean;
}

export const CustomerOverviewStats: React.FC<CustomerOverviewStatsProps> = ({
    totalSpent: propTotalSpent,
    totalOrders: propTotalOrders,
    deliveredOrders: propDeliveredOrders,
    inTransitOrders: propInTransitOrders,
    pendingOrders: propPendingOrders,
    orders: propOrders,
    isLoading: propIsLoading,
    meta: propMeta,
    showActionStrip = true,
}) => {
    // 1. Fetch orders if not provided by parent
    const shouldSkipOrders = Boolean(propOrders !== undefined && propIsLoading !== undefined);
    const { data: ordersResponse, isLoading: ordersLoading } = useMyOrdersQuery(
        { limit: 100 },
        { skip: shouldSkipOrders }
    );
    const orders = propOrders || (ordersResponse?.data as TOrder[] | undefined) || [];

    const isLoading = propIsLoading !== undefined ? propIsLoading : ordersLoading;

    // Computed Spend
    const computedSpent =
        propTotalSpent ??
        orders.reduce((sum, o) => {
            const amount = Number(o.totalPrice ?? 0);
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

    // Computed Total Orders
    const computedTotalOrders =
        propTotalOrders ?? propMeta?.total ?? ordersResponse?.meta?.total ?? orders.length;

    // Computed Delivered Orders
    const computedDeliveredOrders =
        propDeliveredOrders ??
        orders.filter((o) => (o.status || "").toUpperCase() === "DELIVERED").length;

    // Computed In Transit / Active Orders
    const computedInTransitOrders =
        propInTransitOrders ??
        orders.filter((o) => {
            const status = (o.status || "").toUpperCase();
            return (
                status === "SHIPPED" ||
                status === "IN_TRANSIT" ||
                status === "OUT_OF_DELIVERY" ||
                status === "PROCESSING"
            );
        }).length;

    // Computed Pending Orders
    const computedPendingOrders =
        propPendingOrders ??
        orders.filter((o) => (o.status || "").toUpperCase() === "PENDING").length;

    const formatCurrency = (val: number) =>
        `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const stats: TAZStat[] = [
        {
            label: "Total Expenditure",
            value: isLoading ? "—" : formatCurrency(computedSpent),
            description: `${computedTotalOrders} lifetime purchase${computedTotalOrders === 1 ? "" : "s"}`,
            descriptionIcon: <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />,
            icon: <DollarSign className="w-6 h-6" />,
            lineColor: "via-emerald-400/60",
            glowColor: "from-emerald-500/20",
            valueColor: "text-emerald-400",
            iconWrapperColor: "bg-emerald-500/10",
            iconBorderColor: "border-emerald-500/20",
            iconColor: "text-emerald-400",
        },
        {
            label: "Total Orders",
            value: isLoading ? "—" : computedTotalOrders.toLocaleString(),
            description: `${computedDeliveredOrders} delivered to date`,
            descriptionIcon: <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />,
            icon: <ShoppingBag className="w-6 h-6" />,
            lineColor: "via-amber-400/60",
            glowColor: "from-amber-500/20",
            valueColor: "text-amber-400",
            iconWrapperColor: "bg-amber-400/10",
            iconBorderColor: "border-amber-400/20",
            iconColor: "text-amber-400",
        },
        {
            label: "Active Deliveries",
            value: isLoading ? "—" : `${computedInTransitOrders} Package${computedInTransitOrders === 1 ? "" : "s"}`,
            description:
                computedInTransitOrders > 0
                    ? `${computedInTransitOrders} on the way with courier`
                    : "No active shipments right now",
            descriptionIcon: <Truck className="w-3.5 h-3.5 text-cyan-400" />,
            icon: <Truck className="w-6 h-6" />,
            lineColor: "via-cyan-400/60",
            glowColor: "from-cyan-500/20",
            valueColor: "text-cyan-400",
            iconWrapperColor: "bg-cyan-500/10",
            iconBorderColor: "border-cyan-500/20",
            iconColor: "text-cyan-400",
        },
        {
            label: "Buyer Standing",
            value: isLoading ? "—" : "Verified",
            description: "100% Reliable account standing",
            descriptionIcon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />,
            icon: <ShieldCheck className="w-6 h-6" />,
            lineColor: "via-indigo-400/60",
            glowColor: "from-indigo-500/20",
            valueColor: "text-indigo-300",
            iconWrapperColor: "bg-indigo-500/10",
            iconBorderColor: "border-indigo-500/20",
            iconColor: "text-indigo-400",
        },
    ];

    return (
        <div className="space-y-4">
            {/* Core Statistics Card Grid */}
            <AZStats stats={stats} />

            {/* Actionable Logistics & Order Status Strip */}
            {showActionStrip && (
                <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-xl p-4">
                    {/* Dot matrix overlay */}
                    <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-2 text-slate-300 font-extrabold uppercase tracking-wider text-[11px]">
                            <Clock className="w-4 h-4 text-amber-400" />
                            <span>Courier & Order Status</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                            {/* In-Transit Active Packages */}
                            <Link
                                href="/customer/orders"
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                                title="View active orders"
                            >
                                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                                <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
                                    Active Shipments:
                                </span>
                                <span className="font-mono font-black text-sky-400 group-hover:underline">
                                    {isLoading ? "—" : `${computedInTransitOrders} in transit`}
                                </span>
                                {computedPendingOrders > 0 && (
                                    <span className="text-[10px] text-slate-500">
                                        ({computedPendingOrders} pending confirmation)
                                    </span>
                                )}
                            </Link>

                            {/* Completed Deliveries */}
                            <Link
                                href="/customer/orders"
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                                title="View delivered orders"
                            >
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
                                    Delivered:
                                </span>
                                <span className="font-mono font-black text-emerald-400 group-hover:underline">
                                    {isLoading ? "—" : `${computedDeliveredOrders} orders`}
                                </span>
                            </Link>

                            {/* Verified Buyer Badge */}
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                                <span className="text-slate-400">Account:</span>
                                <span className="badge badge-sm font-extrabold text-[10px] px-2 py-0.5 border bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                                    Active & Verified
                                </span>
                            </div>

                            {/* Quick Help & Chat */}
                            <Link
                                href="/customer/chat"
                                className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors group"
                                title="Customer Chat & Vendor Messaging"
                            >
                                <MessageSquare className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                                <span className="font-bold">Support Chat</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerOverviewStats;

