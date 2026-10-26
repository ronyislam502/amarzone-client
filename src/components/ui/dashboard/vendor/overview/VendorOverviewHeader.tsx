"use client";

import React from "react";
import Link from "next/link";
import { Package, Sparkles, TrendingUp } from "lucide-react";
import AZHeader from "@/components/shared/AZHeader";

export interface VendorOverviewHeaderProps {
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

export const VendorOverviewHeader: React.FC<VendorOverviewHeaderProps> = ({
    onRefresh,
    isRefreshing = false,
}) => {
    return (
        <AZHeader
            badgeLabel="Vendor Portal"
            badgeIcon={<Sparkles className="w-3.5 h-3.5" />}
            statusLabel="Live Business Feed"
            title="Welcome back!"
            description="Here is your instant store snapshot. Monitor incoming orders, stock replenishment needs, and account compliance at a glance."
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            actions={
                <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                        href="/vendor/orders"
                        className="btn btn-outline border-white/20 hover:border-amber-400 text-slate-200 hover:text-white rounded-xl text-xs gap-2"
                    >
                        <Package className="w-4 h-4 text-amber-400" />
                        <span>Incoming Orders</span>
                    </Link>
                    <a
                        href="#ai-insights"
                        className="btn bg-gradient-to-r from-violet-600 via-purple-600 to-amber-500 hover:from-violet-500 hover:to-amber-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-600/20 gap-1.5 border-0 cursor-pointer"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>AI Store Insights</span>
                    </a>
                    <Link
                        href="/vendor/analytics"
                        className="btn bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 gap-2 border-0"
                    >
                        <TrendingUp className="w-4 h-4" />
                        <span>Deep Analytics</span>
                    </Link>
                </div>
            }
        />
    );
};

export default VendorOverviewHeader;