"use client";

import React from "react";
import Link from "next/link";
import { Clock, MessageSquare, Package, Sparkles, User } from "lucide-react";
import AZHeader from "@/components/shared/AZHeader";
import { TDashboardDateRange } from "@/types/dashboard";

export interface CustomerOverviewHeaderProps {
    selectedRange: TDashboardDateRange;
    onRangeChange: (range: TDashboardDateRange) => void;
    onRefresh: () => void;
    isFetching?: boolean;
    userName?: string;
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

export const CustomerOverviewHeader: React.FC<CustomerOverviewHeaderProps> = ({
    selectedRange,
    onRangeChange,
    onRefresh,
    isFetching = false,
    userName,
}) => {
    return (
        <div>
            <AZHeader
                badgeLabel="Customer Portal"
                badgeIcon={<Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                statusLabel="Account Live: Active"
                title={userName ? `Welcome, ${userName}` : "Customer"}
                highlightTitle="Overview"
                description="Real-time personal shopping snapshot: purchase velocity, ongoing courier tracking, order fulfillment milestones, and account standing."
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

                        {/* My Orders Link */}
                        <Link
                            href="/customer/orders"
                            className="btn btn-sm btn-outline border-white/20 hover:border-amber-400 text-slate-200 hover:text-white rounded-xl text-xs gap-1.5 font-bold"
                        >
                            <Package className="w-3.5 h-3.5 text-amber-400" />
                            <span>My Orders</span>
                        </Link>

                        {/* Support & Messages Link */}
                        <Link
                            href="/customer/chat"
                            className="btn btn-sm bg-gradient-to-r from-violet-600 via-purple-600 to-amber-500 hover:from-violet-500 hover:to-amber-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-600/20 gap-1.5 border-0"
                        >
                            <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                            <span>Messages</span>
                        </Link>

                        {/* Profile Settings */}
                        <Link
                            href="/customer/profile"
                            className="btn btn-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 gap-1.5 border-0"
                        >
                            <User className="w-3.5 h-3.5" />
                            <span>Profile</span>
                        </Link>
                    </div>
                }
            />
        </div>
    );
};

export default CustomerOverviewHeader;

