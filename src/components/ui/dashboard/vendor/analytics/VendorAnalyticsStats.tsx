"use client";

import React from "react";
import {
    DollarSign,
    ShoppingBag,
    Package,
    ArrowUpRight,
    TrendingUp,
    Sparkles,
    CheckCircle2,
    Clock,
} from "lucide-react";
import AZStats, { TAZStat } from "@/components/shared/AZStats";
import type { TAnalyticsDateRange } from "./VendorAnalytics";

export interface VendorAnalyticsStatsProps {
    storeRevenue: number;
    storeOrders: number;
    avgOrderValue: number;
    todayOrdersCount?: number;
    activeListings?: number | string;
    pendingOrders?: number;
    processingOrders?: number;
    shippedOrders?: number;
    deliveredOrders?: number;
    cancelledOrders?: number;
    dateRange?: TAnalyticsDateRange;
}

export const VendorAnalyticsStats: React.FC<VendorAnalyticsStatsProps> = ({
    storeRevenue = 0,
    storeOrders = 0,
    avgOrderValue = 0,
    todayOrdersCount = 0,
    activeListings = 128,
    pendingOrders = 0,
    processingOrders = 0,
    shippedOrders = 0,
    deliveredOrders = 0,
    cancelledOrders = 0,
}) => {
    const formatCurrency = (val: number) =>
        `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const stats: TAZStat[] = [
        {
            label: "Store Net Revenue",
            value: formatCurrency(storeRevenue),
            description: "+18.4% growth trajectory",
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
            label: "Orders Dispatched",
            value: storeOrders.toLocaleString(),
            description: `${todayOrdersCount} new placed today`,
            descriptionIcon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
            icon: <ShoppingBag className="w-6 h-6" />,
            lineColor: "via-amber-400/60",
            glowColor: "from-amber-500/20",
            valueColor: "text-amber-400",
            iconWrapperColor: "bg-amber-400/10",
            iconBorderColor: "border-amber-400/20",
            iconColor: "text-amber-400",
        },
        {
            label: "Average Order Value",
            value: formatCurrency(avgOrderValue),
            description: "Per completed order transaction",
            descriptionIcon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" />,
            icon: <TrendingUp className="w-6 h-6" />,
            lineColor: "via-indigo-400/60",
            glowColor: "from-indigo-500/20",
            valueColor: "text-indigo-300",
            iconWrapperColor: "bg-indigo-500/10",
            iconBorderColor: "border-indigo-500/20",
            iconColor: "text-indigo-400",
        },
        {
            label: "Catalog Listings",
            value: activeListings.toString(),
            description: "Live merchant stock items",
            descriptionIcon: <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />,
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
            {/* Core Reusable Vendor Statistics */}
            <AZStats stats={stats} />

            {/* Vendor Fulfillment Status Pipeline */}
            <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-xl p-4">
                {/* Background dot overlay */}
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
                                {pendingOrders}
                            </span>
                        </div>

                        {/* Processing */}
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                            <span className="text-slate-400">Processing:</span>
                            <span className="font-mono font-black text-white">
                                {processingOrders}
                            </span>
                        </div>

                        {/* Shipped */}
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                            <span className="text-slate-400">Shipped:</span>
                            <span className="font-mono font-black text-white">
                                {shippedOrders}
                            </span>
                        </div>

                        {/* Delivered */}
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                            <span className="text-slate-400">Delivered:</span>
                            <span className="font-mono font-black text-white">
                                {deliveredOrders}
                            </span>
                        </div>

                        {/* Cancelled */}
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                            <span className="text-slate-400">Cancelled:</span>
                            <span className="font-mono font-black text-white">
                                {cancelledOrders}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorAnalyticsStats;
