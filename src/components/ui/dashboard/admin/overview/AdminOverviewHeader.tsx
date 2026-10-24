"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Sparkles,
    Clock,
    BarChart3,
    ArrowUpRight,
} from "lucide-react";
import { TDashboardDateRange, TDashboardStatsData } from "@/types/dashboard";
import AZHeader from "@/components/shared/AZHeader";
import AdminAiDashboardInsights from "@/components/ui/artificial/AdminAiDashInsights";

export interface AdminSummaryHeaderProps {
    selectedRange: TDashboardDateRange;
    onRangeChange: (range: TDashboardDateRange) => void;
    onRefresh: () => void;
    isFetching?: boolean;
    socketConnected?: boolean;
    stats?: TDashboardStatsData;
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

export const AdminOverviewHeader: React.FC<AdminSummaryHeaderProps> = ({
    selectedRange,
    onRangeChange,
    onRefresh,
    isFetching = false,
    socketConnected = false,
    stats,
}) => {
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    return (
        <div className="w-full">
            <AZHeader
                badgeLabel="Executive Dashboard"
                badgeIcon={<Sparkles className="w-3.5 h-3.5" />}
                statusLabel={socketConnected ? "System Live: Connected" : "System Live: Syncing"}
                title="Admin"
                highlightTitle="System Overview"
                description="Consolidated real-time intelligence: platform revenue, commission breakdown, active users, catalog statistics, recent orders, and live alerts."
                onRefresh={onRefresh}
                isRefreshing={isFetching}
                actions={
                    <div className="flex flex-wrap items-center gap-3">
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

                        {/* AI Executive Briefing */}
                        <button
                            type="button"
                            onClick={() => setIsAiModalOpen(true)}
                            className="btn btn-sm gap-1.5 font-black bg-gradient-to-r from-violet-600 via-purple-600 to-amber-500 hover:from-violet-500 hover:to-amber-400 text-white border-0 rounded-xl shadow-lg shadow-purple-600/20 cursor-pointer"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>AI Briefing</span>
                        </button>

                        {/* Deep Analytics Link */}
                        <Link
                            href="/admin/analytics"
                            className="btn btn-sm gap-1.5 font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-0 rounded-xl shadow-lg shadow-amber-500/20"
                        >
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span>Deep Analytics</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                }
            />

            {/* AI Executive Intelligence Modal */}
            <AdminAiDashboardInsights
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                stats={{
                    overviewCards: stats?.overviewCards,
                    users: stats?.users,
                    products: stats?.products,
                    inventory: stats?.inventory,
                    reviews: stats?.reviews,
                    marketplaceHealth: stats?.marketplaceHealth,
                    recentOrdersCount: stats?.recentActivities?.recentOrders?.length || 0,
                    selectedRange,
                }}
                role="ADMIN"
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

export default AdminOverviewHeader;
