
"use client";

import React from "react";
import {
    AlertTriangle,
    Star,
    ShieldAlert,
    CheckCircle2,
} from "lucide-react";
import { TDashboardInventory, TDashboardMarketplaceHealth, TDashboardOverviewCards, TDashboardReviews } from "@/types/dashboard";
import AZStats, { TAZStat } from "@/components/shared/AZStats";

interface QuickStatsStripProps {
    inventory?: TDashboardInventory;
    reviews?: TDashboardReviews;
    marketplaceHealth?: TDashboardMarketplaceHealth;
    overviewCards?: TDashboardOverviewCards;
}

export const AdminQuickStats: React.FC<QuickStatsStripProps> = ({
    inventory,
    reviews,
    marketplaceHealth,
}) => {
    const lowStock = inventory?.lowStockProducts ?? 0;
    const outOfStock = inventory?.outOfStockInventory ?? 0;

    const avgRating = reviews?.averageRating ?? 5.0;
    const totalReviews = reviews?.totalReviews ?? 0;

    const openDisputes = marketplaceHealth?.openDisputes ?? 0;
    const slaViolations = marketplaceHealth?.activeSlaViolations ?? 0;
    const fraudAlerts = marketplaceHealth?.fraudAlerts ?? 0;

    const totalIssues = openDisputes + fraudAlerts;

    const stats: TAZStat[] = [
        {
            label: "Inventory Stock Alert",
            value: `${lowStock} Low Stock`,
            description: `${outOfStock} out of stock items`,
            icon: <AlertTriangle className="w-5 h-5" />,
            lineColor: "via-amber-400/60",
            glowColor: "from-amber-500/20",
            valueColor: "text-amber-400",
            iconWrapperColor: "bg-amber-400/10",
            iconBorderColor: "border-amber-400/20",
            iconColor: "text-amber-400",
        },
        {
            label: "Customer Satisfaction",
            value: (
                <span className="inline-flex items-center gap-1.5">
                    {avgRating.toFixed(1)}
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </span>
            ) as unknown as string,
            description: `Across ${totalReviews.toLocaleString()} verified reviews`,
            icon: <Star className="w-5 h-5 fill-amber-400" />,
            lineColor: "via-amber-400/60",
            glowColor: "from-amber-500/20",
            valueColor: "text-amber-300",
            iconWrapperColor: "bg-amber-400/10",
            iconBorderColor: "border-amber-400/20",
            iconColor: "text-amber-400",
        },
        {
            label: "Disputes & Fraud",
            value:
                totalIssues === 0
                    ? "Zero Issues"
                    : `${openDisputes} Disputes / ${fraudAlerts} Fraud`,
            description:
                openDisputes === 0
                    ? "No active dispute cases"
                    : "Immediate review needed",
            icon: <ShieldAlert className="w-5 h-5" />,
            lineColor:
                totalIssues > 0
                    ? "via-rose-400/60"
                    : "via-emerald-400/60",
            glowColor:
                totalIssues > 0
                    ? "from-rose-500/20"
                    : "from-emerald-500/20",
            valueColor:
                totalIssues > 0
                    ? "text-rose-400"
                    : "text-emerald-400",
            iconWrapperColor:
                totalIssues > 0
                    ? "bg-rose-500/10"
                    : "bg-emerald-500/10",
            iconBorderColor:
                totalIssues > 0
                    ? "border-rose-500/20"
                    : "border-emerald-500/20",
            iconColor:
                totalIssues > 0
                    ? "text-rose-400"
                    : "text-emerald-400",
        },
        {
            label: "SLA Delivery Health",
            value:
                slaViolations === 0
                    ? "100% Compliant"
                    : `${slaViolations} Violations`,
            description: "Merchant dispatch speed audit",
            icon: <CheckCircle2 className="w-5 h-5" />,
            lineColor: "via-cyan-400/60",
            glowColor: "from-cyan-500/20",
            valueColor: "text-cyan-400",
            iconWrapperColor: "bg-cyan-500/10",
            iconBorderColor: "border-cyan-500/20",
            iconColor: "text-cyan-400",
        },
    ];

    return <AZStats stats={stats} />;
};

export default AdminQuickStats;