"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Package, Sparkles, TrendingUp } from "lucide-react";
import AZHeader from "@/components/shared/AZHeader";
import AiDashboardInsights from "@/components/ui/artificial/AiDashInsights";
import { TDashboardDateRange, TDashboardStatsData, TVendorDashboardData } from "@/types/dashboard";

export interface SummaryHeaderProps {
    selectedRange: TDashboardDateRange;
    onRangeChange: (range: TDashboardDateRange) => void;
    onRefresh: () => void;
    isFetching?: boolean;
    socketConnected?: boolean;
    stats?: TDashboardStatsData | TVendorDashboardData | any;
}

const RANGE_OPTIONS: {
    label: string;
    value: TDashboardDateRange;
}[] = [
    { label: "7 Days", value: "7_days" },
    { label: "30 Days", value: "30_days" },
    { label: "90 Days", value: "90_days" },
    { label: "12 Months", value: "12_months" },
];

export const VendorOverviewHeader: React.FC<SummaryHeaderProps> = ({
    selectedRange,
    onRangeChange,
    onRefresh,
    isFetching = false,
    socketConnected = false,
    stats,
}) => {
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    return (
        <div>
            <AZHeader
                badgeLabel="Vendor Portal"
                badgeIcon={<Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                statusLabel={socketConnected ? "System Live: Connected" : "System Live: Synced"}
                title="Store"
                highlightTitle="Overview"
                description="Real-time operational snapshot: sales velocity, incoming orders, stock replenishment alerts, and account compliance standing."
                onRefresh={onRefresh}
                isRefreshing={isFetching}
                actions={
                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Time Range Selector */}
                        <div className="flex items-center bg-[#120824] border border-white/15 rounded-2xl p-1 gap-1 shadow-inner">
                            <div className="px-2 text-slate-400 flex items-center gap-1 text-xs font-bold">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                <span className="hidden sm:inline">Range:</span>
                            </div>

                            {RANGE_OPTIONS.map((opt) => {
                                const isActive = selectedRange === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => onRangeChange(opt.value)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                            isActive
                                                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                                                : "text-slate-300 hover:text-white hover:bg-white/5"
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Incoming Orders Link */}
                        <Link
                            href="/vendor/orders"
                            className="btn btn-sm btn-outline border-white/20 hover:border-amber-400 text-slate-200 hover:text-white rounded-xl text-xs gap-1.5 font-bold"
                        >
                            <Package className="w-3.5 h-3.5 text-amber-400" />
                            <span>Orders</span>
                        </Link>

                        {/* AI Briefing Button */}
                        <button
                            type="button"
                            onClick={() => setIsAiModalOpen(true)}
                            className="btn btn-sm bg-gradient-to-r from-violet-600 via-purple-600 to-amber-500 hover:from-violet-500 hover:to-amber-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-600/20 gap-1.5 border-0 cursor-pointer"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>AI Briefing</span>
                        </button>

                        {/* Deep Analytics Link */}
                        <Link
                            href="/vendor/analytics"
                            className="btn btn-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 gap-1.5 border-0"
                        >
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Analytics</span>
                        </Link>
                    </div>
                }
            />
            <AiDashboardInsights
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                stats={{
                    dashboardRole: "VENDOR",
                    portalScope: "VENDOR_STORE",
                    storeFinancials: {
                        grossRevenue: stats?.overview?.totalRevenue,
                        withdrawableBalance: stats?.overview?.withdrawableBalance,
                        pendingEscrowBalance: stats?.overview?.pendingBalance,
                        totalOrders: stats?.overview?.totalOrders,
                    },
                    storeInventoryStatus: {
                        activeListingsCount: stats?.overview?.activeListings,
                        draftListingsCount: stats?.overview?.draftListings,
                        outOfStockCount: stats?.overview?.outOfStockProducts,
                        lowStockAlertsCount: stats?.products?.lowStockProducts?.length || 0,
                        buyBoxWinningProductsCount: stats?.products?.buyBoxWinners?.length || 0,
                    },
                    storeSalesVelocity: {
                        revenueToday: stats?.sales?.revenueToday,
                        ordersToday: stats?.sales?.ordersToday,
                        revenueThisMonth: stats?.sales?.revenueThisMonth,
                        ordersThisMonth: stats?.sales?.ordersThisMonth,
                    },
                    storeSlaAndAccountHealth: {
                        accountHealthScore: stats?.performance?.accountHealthScore,
                        healthStatus: stats?.performance?.healthStatus,
                        orderDefectRatePercentage: stats?.performance?.orderDefectRate,
                        lateShipmentRatePercentage: stats?.performance?.lateShipmentRate,
                        preFulfillmentCancellationRate: stats?.performance?.cancellationRate,
                        validTrackingRatePercentage: stats?.performance?.validTrackingRate,
                        activeSlaViolations: stats?.sla?.activeViolations || 0,
                        warningCount: stats?.sla?.warningCount || 0,
                    },
                    storeCustomerBase: {
                        totalCustomersServed: stats?.customers?.totalCustomers,
                        returningCustomers: stats?.customers?.returningCustomers,
                        firstTimeBuyers: stats?.customers?.newCustomers,
                    },
                    storeDisputesAndRefunds: {
                        openDisputes: stats?.disputes?.open || 0,
                        underReviewDisputes: stats?.disputes?.underReview || 0,
                        resolvedDisputes: stats?.disputes?.resolved || 0,
                        pendingRefunds: stats?.refund?.pendingRefunds || 0,
                        completedRefunds: stats?.refund?.completedRefunds || 0,
                    },
                    recentOrdersCount:
                        stats?.recent?.recentOrders?.length ||
                        stats?.recentActivities?.recentOrders?.length ||
                        0,
                    selectedDateRange: selectedRange,
                }}
                role="VENDOR"
                defaultTimeframe={
                    selectedRange === "7_days"
                        ? "weekly"
                        : selectedRange === "12_months"
                            ? "yearly"
                            : "monthly"
                }
            />
        </div>
    );
};

export default VendorOverviewHeader;