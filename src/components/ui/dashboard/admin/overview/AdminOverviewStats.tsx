
"use client";

import React from "react";
import {
    DollarSign,
    TrendingUp,
    Percent,
    Wallet,
    Building2,
} from "lucide-react";
import { TDashboardOverviewCards } from "@/types/dashboard";
import AZStats, { TAZStat } from "@/components/shared/AZStats";



interface RevenueBreakdownCardProps {
    overviewCards?: TDashboardOverviewCards;
}

const AdminOverviewStats: React.FC<
    RevenueBreakdownCardProps
> = ({ overviewCards }) => {
    const grossRevenue = overviewCards?.totalRevenue ?? 0;

    const commission =
        overviewCards?.marketplaceCommission !== undefined
            ? overviewCards.marketplaceCommission
            : grossRevenue * 0.1;

    const netVendorEarnings =
        overviewCards?.vendorEarnings !== undefined
            ? overviewCards.vendorEarnings
            : Math.max(grossRevenue - commission, 0);

    const commissionPercent =
        grossRevenue > 0
            ? ((commission / grossRevenue) * 100).toFixed(1)
            : "0.0";

    const vendorPercent =
        grossRevenue > 0
            ? ((netVendorEarnings / grossRevenue) * 100).toFixed(1)
            : "0.0";

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
        }).format(amount);

    const stats: TAZStat[] = [
        {
            label: "Gross Platform Revenue",
            value: formatCurrency(grossRevenue),
            description: "100% of completed paid order transactions",
            descriptionIcon: (
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
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
            label: "Platform Commission",
            value: formatCurrency(commission),
            description: `${commissionPercent}% marketplace commission`,
            descriptionIcon: (
                <Percent className="w-3.5 h-3.5 text-cyan-400" />
            ),
            icon: <Building2 className="w-6 h-6" />,
            lineColor: "via-cyan-400/60",
            glowColor: "from-cyan-500/20",
            valueColor: "text-cyan-400",
            iconWrapperColor: "bg-cyan-400/10",
            iconBorderColor: "border-cyan-400/20",
            iconColor: "text-cyan-400",
        },
        {
            label: "Revenue (Excl. Commission)",
            value: formatCurrency(netVendorEarnings),
            description: `${vendorPercent}% net vendor payout share`,
            descriptionIcon: (
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            ),
            icon: <Wallet className="w-6 h-6" />,
            lineColor: "via-emerald-400/60",
            glowColor: "from-emerald-500/20",
            valueColor: "text-emerald-400",
            iconWrapperColor: "bg-emerald-500/10",
            iconBorderColor: "border-emerald-500/20",
            iconColor: "text-emerald-400",
        },
    ];

    return (
        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-7">
            {/* Top Glowing Accent Line */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent pointer-events-none z-20" />

            {/* Ambient Background Glow */}
            <div className="absolute -top-16 -left-16 w-60 h-60 bg-gradient-to-br from-amber-500/20 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="absolute -bottom-16 right-1/4 w-60 h-60 bg-gradient-to-tl from-emerald-600/20 via-cyan-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Dot Matrix Grid */}
            <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 space-y-5">
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 shadow-sm">
                            <DollarSign className="w-5 h-5" />
                        </span>

                        <div>
                            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex flex-wrap items-center gap-2">
                                <span>Revenue & Financial Architecture</span>

                                <span className="badge badge-warning badge-xs font-black text-slate-950 uppercase">
                                    Verified
                                </span>
                            </h2>

                            <p className="text-xs text-slate-400">
                                Complete breakdown: Total Gross Volume, Marketplace
                                Platform Commission, and Net Vendor Disbursals.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Settled Paid Volume</span>
                    </div>
                </div>

                {/* Reusable Financial Statistics */}
                <AZStats stats={stats} />

                {/* Dual Proportional Visual Meter */}
                <div className="space-y-2 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
                            <span>
                                Marketplace Retained Share ({commissionPercent}%)
                            </span>
                        </span>

                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                            <span>
                                Merchant Net Payout ({vendorPercent}%)
                            </span>
                        </span>
                    </div>

                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10 flex">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-l-full transition-all duration-500"
                            style={{
                                width: `${Math.min(
                                    Math.max(Number(commissionPercent), 0),
                                    100
                                )
                                    }% `,
                            }}
                            title={`Commission: ${formatCurrency(commission)} (${commissionPercent}%)`}
                        />

                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-r-full transition-all duration-500"
                            style={{
                                width: `${Math.min(
                                    Math.max(Number(vendorPercent), 0),
                                    100
                                )
                                    }% `,
                            }}
                            title={`Vendor Payouts: ${formatCurrency(netVendorEarnings)} (${vendorPercent}%)`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverviewStats;
