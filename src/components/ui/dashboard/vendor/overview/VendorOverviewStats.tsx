"use client";

import React from "react";
import Link from "next/link";
import {
    DollarSign,
    ShoppingBag,
    Boxes,
    Activity,
    ArrowUpRight,
    CheckCircle2,
    Clock,
} from "lucide-react";
import AZStats, { TAZStat } from "@/components/shared/AZStats";
import { useMyOrdersQuery } from "@/redux/features/order/orderApi";
import { useMyInventoryQuery } from "@/redux/features/inventory/inventoryApi";
import { useGetMyHealthQuery } from "@/redux/features/health/healthApi";
import { TOrder } from "@/types/order";
import { TInventory } from "@/types/inventory";
import { TAccountHealth } from "@/types/health";
import { TMeta } from "@/types/global";

export interface VendorOverviewStatsProps {
    totalRevenue?: number;
    withdrawableBalance?: number;
    pendingBalance?: number;
    totalOrders?: number;
    deliveredOrders?: number;
    unshippedOrders?: number;
    pendingOrders?: number;
    inventoryCount?: number;
    lowStockCount?: number;
    healthScore?: number;
    healthStatus?: string;
    openDisputes?: number;
    orders?: TOrder[];
    inventories?: TInventory[];
    healthData?: TAccountHealth;
    isLoading?: boolean;
    meta?: TMeta;
    showActionStrip?: boolean;
}

const VendorOverviewStats: React.FC<VendorOverviewStatsProps> = ({
    totalRevenue,
    withdrawableBalance,
    pendingBalance,
    totalOrders: propTotalOrders,
    deliveredOrders: propDeliveredOrders,
    unshippedOrders: propUnshippedOrders,
    pendingOrders: propPendingOrders,
    inventoryCount: propInventoryCount,
    lowStockCount: propLowStockCount,
    healthScore: propHealthScore,
    healthStatus: propHealthStatus,
    openDisputes,
    orders: propOrders,
    inventories: propInventories,
    healthData: propHealthData,
    isLoading: propIsLoading,
    meta: propMeta,
    showActionStrip = true,
}) => {
    // 1. Fetch orders if not provided
    const shouldSkipOrders = Boolean(propOrders !== undefined && propIsLoading !== undefined);
    const { data: ordersResponse, isLoading: ordersLoading } = useMyOrdersQuery({}, { skip: shouldSkipOrders });
    const orders = propOrders || (ordersResponse?.data as TOrder[] | undefined) || [];

    // 2. Fetch inventory if not provided
    const shouldSkipInventory = Boolean(propInventories !== undefined && propIsLoading !== undefined);
    const { data: inventoryResponse, isLoading: inventoryLoading } = useMyInventoryQuery({}, { skip: shouldSkipInventory });
    const rawInventory = inventoryResponse?.data;
    const inventories: TInventory[] =
        propInventories ||
        (Array.isArray(rawInventory)
            ? rawInventory
            : (rawInventory as any)?.data || []);

    // 3. Fetch account health if not provided
    const shouldSkipHealth = Boolean(propHealthData !== undefined && propIsLoading !== undefined);
    const { data: healthResponse, isLoading: healthLoading } = useGetMyHealthQuery(undefined, { skip: shouldSkipHealth });
    const health = propHealthData || healthResponse?.data;

    // Overall Loading State
    const isLoading =
        propIsLoading !== undefined
            ? propIsLoading
            : ordersLoading || inventoryLoading || healthLoading;

    // Computed Revenue
    const computedRevenue =
        totalRevenue ??
        orders.reduce((sum, o) => {
            const amount = Number(
                o.vendorAmount ?? (o.totalPrice ? o.totalPrice - (o.commission || 0) : 0)
            );
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

    // Computed Orders Metrics
    const computedTotalOrders =
        propTotalOrders ?? propMeta?.total ?? ordersResponse?.meta?.total ?? orders.length;

    const computedDeliveredOrders =
        propDeliveredOrders ??
        orders.filter((o) => (o.status || "").toUpperCase() === "DELIVERED").length;

    const computedUnshippedOrders =
        propUnshippedOrders ??
        orders.filter((o) => {
            const status = (o.status || "").toUpperCase();
            return status === "PENDING" || status === "UNSHIPPED" || status === "PROCESSING";
        }).length;

    const computedPendingOrders =
        propPendingOrders ??
        orders.filter((o) => (o.status || "").toUpperCase() === "PENDING").length;

    // Computed Inventory Metrics
    const computedInventoryCount =
        propInventoryCount ?? inventoryResponse?.meta?.total ?? inventories.length;

    const computedLowStock =
        propLowStockCount ??
        inventories.filter((item) => (item?.seller?.quantity ?? 0) <= 5).length;

    // Computed Health Metrics
    const computedHealthScore = propHealthScore ?? health?.score ?? 1000;
    const computedHealthStatus = propHealthStatus ?? health?.status ?? "HEALTHY";
    const isHealthy = computedHealthScore >= 850;

    const formatCurrency = (val: number) =>
        `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const stats: TAZStat[] = [
        {
            label: "Total Revenue",
            value: isLoading ? "—" : formatCurrency(computedRevenue),
            description:
                withdrawableBalance !== undefined
                    ? `${formatCurrency(withdrawableBalance)} available payout`
                    : "Gross sales to date",
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
            label: "Inventory Status",
            value: isLoading ? "—" : `${computedInventoryCount} Products`,
            description:
                computedLowStock > 0
                    ? `${computedLowStock} low stock alert${computedLowStock === 1 ? "" : "s"}`
                    : "All stock levels optimal",
            descriptionIcon: <Boxes className="w-3.5 h-3.5 text-cyan-400" />,
            icon: <Boxes className="w-6 h-6" />,
            lineColor: "via-cyan-400/60",
            glowColor: "from-cyan-500/20",
            valueColor: "text-cyan-400",
            iconWrapperColor: "bg-cyan-500/10",
            iconBorderColor: "border-cyan-500/20",
            iconColor: "text-cyan-400",
        },
        {
            label: "Account Health",
            value: isLoading ? "—" : `${computedHealthScore} / 1000`,
            description: `${computedHealthStatus} performance standing`,
            descriptionIcon: <Activity className="w-3.5 h-3.5 text-emerald-400" />,
            icon: <Activity className="w-6 h-6" />,
            lineColor: isHealthy ? "via-emerald-400/60" : "via-amber-400/60",
            glowColor: isHealthy ? "from-emerald-500/20" : "from-amber-500/20",
            valueColor: isHealthy ? "text-emerald-400" : "text-amber-400",
            iconWrapperColor: isHealthy ? "bg-emerald-500/10" : "bg-amber-500/10",
            iconBorderColor: isHealthy ? "border-emerald-500/20" : "border-amber-500/20",
            iconColor: isHealthy ? "text-emerald-400" : "text-amber-400",
        },
    ];

    return (
        <div className="space-y-4">
            {/* Core Statistics Card Grid */}
            <AZStats stats={stats} />

            {/* Actionable Logistics & Compliance Strip */}
            {showActionStrip && (
                <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-xl p-4">
                    {/* Dot matrix overlay */}
                    <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-2 text-slate-300 font-extrabold uppercase tracking-wider text-[11px]">
                            <Clock className="w-4 h-4 text-amber-400" />
                            <span>Action & Compliance Status</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                            {/* Action Required: Orders */}
                            <Link
                                href="/vendor/orders"
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                                title="View orders needing dispatch"
                            >
                                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                                <span className="text-slate-400 group-hover:text-slate-200 transition-colors">Action Required:</span>
                                <span className="font-mono font-black text-sky-400 group-hover:underline">
                                    {isLoading ? "—" : `${computedUnshippedOrders} to ship`}
                                </span>
                                {computedPendingOrders > 0 && (
                                    <span className="text-[10px] text-slate-500">
                                        ({computedPendingOrders} awaiting payment)
                                    </span>
                                )}
                            </Link>

                            {/* Inventory Low Stock Alerts */}
                            <Link
                                href="/vendor/inventory"
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                                title="View inventory"
                            >
                                <span className={`w-2.5 h-2.5 rounded-full ${computedLowStock > 0 ? "bg-amber-400" : "bg-emerald-400"}`} />
                                <span className="text-slate-400 group-hover:text-slate-200 transition-colors">Restock Alerts:</span>
                                <span className={`font-mono font-black group-hover:underline ${computedLowStock > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                                    {isLoading ? "—" : computedLowStock > 0 ? `${computedLowStock} Low stock` : "Optimal"}
                                </span>
                            </Link>

                            {/* Account Health Compliance */}
                            <Link
                                href="/vendor/health"
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                                title="View account health & SLA violations"
                            >
                                <span className={`w-2.5 h-2.5 rounded-full ${isHealthy ? "bg-emerald-400" : "bg-amber-400"}`} />
                                <span className="text-slate-400 group-hover:text-slate-200 transition-colors">Compliance:</span>
                                <span
                                    className={`badge badge-sm font-extrabold text-[10px] px-2 py-0.5 border ${
                                        isHealthy
                                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                            : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                                    }`}
                                >
                                    {isLoading ? "—" : computedHealthStatus}
                                </span>
                            </Link>

                            {/* Open Disputes Alert */}
                            {openDisputes !== undefined && openDisputes > 0 && (
                                <Link
                                    href="/vendor/disputes"
                                    className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                                    title="View customer disputes"
                                >
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
                                    <span className="text-slate-400 group-hover:text-slate-200 transition-colors">Disputes:</span>
                                    <span className="font-mono font-black text-rose-400 group-hover:underline">
                                        {openDisputes} active
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorOverviewStats;