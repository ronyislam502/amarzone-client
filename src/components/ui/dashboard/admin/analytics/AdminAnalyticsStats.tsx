
"use client";

import React from "react";
import {
    DollarSign,
    ShoppingBag,
    Users,
    Package,
    ArrowUpRight,
    TrendingUp,
} from "lucide-react";
import { TDashboardInventory, TDashboardOverviewCards, TDashboardProducts, TDashboardUsers } from "@/types/dashboard";
import AZStats, { TAZStat } from "@/components/shared/AZStats";


interface AdminOverviewStatsProps {
    overviewCards?: TDashboardOverviewCards;
    users?: TDashboardUsers;
    products?: TDashboardProducts;
    inventory?: TDashboardInventory;
}

export const AdminAnalyticsStats: React.FC<
    AdminOverviewStatsProps
> = ({
    overviewCards,
    users,
    products,
    inventory,
}) => {
        const totalRevenue = overviewCards?.totalRevenue ?? 0;
        const totalOrders = overviewCards?.totalOrders ?? 0;
        const todayOrders = overviewCards?.todayOrders ?? 0;

        const totalUsers = users?.totalUsers ?? 0;
        const totalVendors = users?.totalVendors ?? 0;
        const activeVendors = users?.activeVendors ?? 0;
        const totalCustomers = users?.totalCustomers ?? 0;

        const totalProducts = products?.totalProducts ?? 0;
        const activeProducts = products?.activeProducts ?? 0;
        const lowStock = inventory?.lowStockProducts ?? 0;

        const formatCurrency = (value: number) =>
            new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 2,
            }).format(value);

        const stats: TAZStat[] = [
            {
                label: "Gross Platform Revenue",
                value: formatCurrency(totalRevenue),
                description: "Settled marketplace volume",
                descriptionIcon: (
                    <span className="text-emerald-400">●</span>
                ),
                icon: <DollarSign className="w-6 h-6" />,
                lineColor: "via-amber-400/60",
                glowColor: "from-amber-500/20",
                valueColor: "text-amber-400",
                iconWrapperColor: "bg-amber-400/10",
                iconBorderColor: "border-amber-400/20",
                iconColor: "text-amber-400",
            },
            {
                label: "Total Orders Placed",
                value: totalOrders.toLocaleString(),
                description: `${todayOrders} new order${todayOrders === 1 ? "" : "s"} today`,
                descriptionIcon: (
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                ),
                icon: <ShoppingBag className="w-6 h-6" />,
                lineColor: "via-emerald-400/60",
                glowColor: "from-emerald-500/20",
                valueColor: "text-emerald-400",
                iconWrapperColor: "bg-emerald-500/10",
                iconBorderColor: "border-emerald-500/20",
                iconColor: "text-emerald-400",
            },
            {
                label: "Registered Community",
                value: totalUsers.toLocaleString(),
                description: `${activeVendors} active merchants • ${totalCustomers} customers`,
                icon: <Users className="w-6 h-6" />,
                lineColor: "via-indigo-400/60",
                glowColor: "from-indigo-500/20",
                valueColor: "text-indigo-300",
                iconWrapperColor: "bg-indigo-500/10",
                iconBorderColor: "border-indigo-500/20",
                iconColor: "text-indigo-400",
            },
            {
                label: "Product Catalog",
                value: totalProducts.toLocaleString(),
                description: `${lowStock} low stock • ${activeProducts} active`,
                icon: <Package className="w-6 h-6" />,
                lineColor: "via-purple-400/60",
                glowColor: "from-purple-500/20",
                valueColor: "text-purple-300",
                iconWrapperColor: "bg-purple-500/10",
                iconBorderColor: "border-purple-500/20",
                iconColor: "text-purple-400",
            },
        ];

        return (
            <div className="space-y-4">
                {/* Reusable Statistics */}
                <AZStats stats={stats} />

                {/* Fulfillment Pipeline */}
                <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-xl p-4">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-2 text-slate-300 font-extrabold uppercase tracking-wider text-[11px]">
                            <TrendingUp className="w-4 h-4 text-amber-400" />
                            <span>Fulfillment Pipeline</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                            {/* Pending */}
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                <span className="text-slate-400">Pending:</span>
                                <span className="font-mono font-black text-white">
                                    {overviewCards?.pendingOrders ?? 0}
                                </span>
                            </div>

                            {/* Processing */}
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                                <span className="text-slate-400">Processing:</span>
                                <span className="font-mono font-black text-white">
                                    {overviewCards?.processingOrders ?? 0}
                                </span>
                            </div>

                            {/* Shipped */}
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                                <span className="text-slate-400">Shipped:</span>
                                <span className="font-mono font-black text-white">
                                    {overviewCards?.shippedOrders ?? 0}
                                </span>
                            </div>

                            {/* Delivered */}
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                <span className="text-slate-400">Delivered:</span>
                                <span className="font-mono font-black text-white">
                                    {overviewCards?.deliveredOrders ?? 0}
                                </span>
                            </div>

                            {/* Cancelled */}
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                                <span className="text-slate-400">Cancelled:</span>
                                <span className="font-mono font-black text-white">
                                    {overviewCards?.cancelledOrders ?? 0}
                                </span>
                            </div>

                            {/* Refunded */}
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                                <span className="text-slate-400">Refunded:</span>
                                <span className="font-mono font-black text-white">
                                    {overviewCards?.refundedOrders ?? 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

export default AdminAnalyticsStats;