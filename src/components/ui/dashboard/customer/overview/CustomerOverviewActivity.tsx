"use client";

import React from "react";
import Link from "next/link";
import {
    Activity,
    ArrowUpRight,
    CheckCircle2,
    DollarSign,
    ShieldCheck,
    ShoppingBag,
    Truck,
    Wallet,
} from "lucide-react";
import AZRadialGaugeChart from "@/components/shared/chart/AZRadialGaugeChart";
import { TOrder } from "@/types/order";

export interface CustomerOverviewActivityProps {
    orders?: TOrder[];
    totalSpent?: number;
    isLoading?: boolean;
}

export const CustomerOverviewActivity: React.FC<CustomerOverviewActivityProps> = ({
    orders = [],
    totalSpent = 0,
    isLoading = false,
}) => {
    // Calculate customer trust metrics
    const totalOrdersCount = orders.length;
    const deliveredCount = orders.filter((o) => (o.status || "").toUpperCase() === "DELIVERED").length;
    const cancelledCount = orders.filter((o) => (o.status || "").toUpperCase() === "CANCELLED").length;

    // Buyer Trust Score (max 1000)
    const completionRate = totalOrdersCount > 0 ? Math.round((deliveredCount / totalOrdersCount) * 100) : 100;
    const computedScore = totalOrdersCount === 0 ? 1000 : Math.max(700, 1000 - cancelledCount * 50);
    const isHealthy = computedScore >= 850;

    const averageOrderValue =
        totalOrdersCount > 0 ? totalSpent / totalOrdersCount : 0;

    const formatCurrency = (val: number) =>
        `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const buyerMetrics = [
        {
            name: "Fulfillment Success",
            value: `${completionRate}%`,
            target: "> 90%",
            isMet: completionRate >= 90,
            description: "Completed and delivered orders ratio.",
        },
        {
            name: "Order Integrity",
            value: `${totalOrdersCount - cancelledCount}/${totalOrdersCount}`,
            target: "100%",
            isMet: cancelledCount === 0,
            description: "Orders fulfilled without cancellations.",
        },
        {
            name: "Payment Reliability",
            value: "100%",
            target: "100%",
            isMet: true,
            description: "Instant payments processed successfully.",
        },
        {
            name: "Buyer Protection",
            value: "Active",
            target: "Guaranteed",
            isMet: true,
            description: "Covered by AmarZone 100% Buyer Shield.",
        },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 1. Account Standing & Buyer Trust Index Hub (7 cols) */}
            <div className="lg:col-span-7 card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
                {/* Glowing top line */}
                <div
                    className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent ${
                        isHealthy ? "via-emerald-400/60" : "via-amber-400/60"
                    } to-transparent pointer-events-none z-20`}
                />
                <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

                <div className="relative z-10 space-y-5">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm sm:text-base font-extrabold text-white">
                                    Buyer Standing & Trust Index
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Account verification, transaction integrity, and Buyer Shield protection status.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>100% Protected</span>
                        </div>
                    </div>

                    {/* Radial Score + Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                        {/* Radial Gauge */}
                        <div className="md:col-span-5 flex justify-center py-2">
                            <AZRadialGaugeChart
                                value={isLoading ? 0 : computedScore}
                                maxValue={1000}
                                size={190}
                                strokeWidth={15}
                                arcDegree={270}
                                title="Standing"
                                subtitle="Account Health"
                                gradientFrom="#10b981"
                                gradientTo="#34d399"
                                containerCard={false}
                                badge={
                                    <span className="badge badge-xs bg-emerald-500/20 text-emerald-300 border-0 font-bold uppercase text-[9px]">
                                        Tier 1 Buyer
                                    </span>
                                }
                                valueFormatter={(v) => `${v}`}
                            />
                        </div>

                        {/* 4 Metric items */}
                        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {buyerMetrics.map((m, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                                >
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-slate-400 font-semibold text-[11px] truncate">
                                            {m.name}
                                        </span>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-base font-mono font-black text-white">
                                            {isLoading ? "—" : m.value}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-mono">
                                            Target: {m.target}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                                        {m.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Personal Shopping & Expenditure Summary Hub (5 cols) */}
            <div className="lg:col-span-5 card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
                {/* Glowing top line */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none z-20" />
                <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

                <div className="relative z-10 space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-base font-extrabold text-white">
                                Spending & Value Metrics
                            </h3>
                            <p className="text-xs text-slate-400">
                                Purchase totals, average ticket size, and delivery efficiency.
                            </p>
                        </div>
                    </div>

                    {/* Financial Snapshot Boxes */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Total Spent</span>
                            </div>
                            <span className="text-lg sm:text-xl font-mono font-black text-white">
                                {isLoading ? "—" : formatCurrency(totalSpent)}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5">Lifetime orders</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mb-1">
                                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                                <span>Avg Order Value</span>
                            </div>
                            <span className="text-lg sm:text-xl font-mono font-black text-amber-400">
                                {isLoading ? "—" : formatCurrency(averageOrderValue)}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5">Per order basket</p>
                        </div>
                    </div>

                    {/* Quick links banner */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                            <Truck className="w-4 h-4 text-sky-400 shrink-0" />
                            <div>
                                <p className="font-bold text-white text-xs">Fast Shipping Guarantee</p>
                                <p className="text-[10px] text-slate-400">
                                    All vendor orders include tracked courier delivery.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/customer/orders"
                            className="btn btn-xs bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 rounded-lg font-bold shrink-0"
                        >
                            <span>Track</span>
                            <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerOverviewActivity;

