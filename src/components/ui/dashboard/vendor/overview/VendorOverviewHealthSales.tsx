"use client";

import React from "react";
import Link from "next/link";
import {
    Activity,
    AlertTriangle,
    ArrowUpRight,
    CheckCircle2,
    DollarSign,
    ShieldAlert,
    ShieldCheck,
    TrendingUp,
    Users,
    Wallet,
} from "lucide-react";
import AZRadialGaugeChart from "@/components/shared/chart/AZRadialGaugeChart";
import {
    TVendorCustomerStats,
    TVendorPerformanceStats,
    TVendorSalesStats,
    TVendorSlaStats,
} from "@/types/dashboard";

export interface VendorOverviewHealthSalesProps {
    performance?: TVendorPerformanceStats;
    sales?: TVendorSalesStats;
    sla?: TVendorSlaStats;
    customers?: TVendorCustomerStats;
    withdrawableBalance?: number;
    pendingBalance?: number;
    isLoading?: boolean;
}

export const VendorOverviewHealthSales: React.FC<VendorOverviewHealthSalesProps> = ({
    performance,
    sales,
    sla,
    customers,
    withdrawableBalance = 0,
    pendingBalance = 0,
    isLoading = false,
}) => {
    // Health score from database performance metrics (Default 1000 max)
    const healthScore = performance?.accountHealthScore ?? 1000;
    const healthStatus = performance?.healthStatus ?? "HEALTHY";
    const isHealthy = healthScore >= 850;
    const isWarning = healthScore >= 700 && healthScore < 850;

    const gaugeGradientFrom = isHealthy ? "#10b981" : isWarning ? "#f59e0b" : "#f43f5e";
    const gaugeGradientTo = isHealthy ? "#34d399" : isWarning ? "#fbbf24" : "#fb7185";

    const formatCurrency = (val?: number) =>
        `$${(val ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // SLA metrics from actual database health document
    const slaMetrics = [
        {
            name: "Order Defect Rate (ODR)",
            value: `${performance?.orderDefectRate ?? 0}%`,
            target: "< 1.00%",
            isMet: (performance?.orderDefectRate ?? 0) <= 1,
            description: "Negative feedback, A-to-Z disputes, and chargebacks.",
        },
        {
            name: "Late Shipment Rate (LSR)",
            value: `${performance?.lateShipmentRate ?? 0}%`,
            target: "< 4.00%",
            isMet: (performance?.lateShipmentRate ?? 0) <= 4,
            description: "Orders confirmed after expected ship date.",
        },
        {
            name: "Pre-fulfillment Cancel",
            value: `${performance?.cancellationRate ?? 0}%`,
            target: "< 2.50%",
            isMet: (performance?.cancellationRate ?? 0) <= 2.5,
            description: "Seller-initiated cancellations prior to dispatch.",
        },
        {
            name: "Valid Tracking Rate (VTR)",
            value: `${performance?.validTrackingRate ?? 100}%`,
            target: "> 95.00%",
            isMet: (performance?.validTrackingRate ?? 100) >= 95,
            description: "Shipments with verified tracking identifiers.",
        },
    ];

    const activeViolations = sla?.activeViolations ?? 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 1. Account Health & SLA Compliance Hub (7 cols) */}
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
                            <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                                    isHealthy
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                }`}
                            >
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                                    <span>Account Health & SLA Standing</span>
                                    <span
                                        className={`badge badge-xs font-black px-2 py-0.5 rounded-md border ${
                                            isHealthy
                                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                                : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                                        }`}
                                    >
                                        {isLoading ? "—" : healthStatus}
                                    </span>
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Live marketplace compliance evaluated against Amarzone seller standards.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/vendor/health"
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group transition-colors"
                        >
                            <span>Full Report</span>
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>

                    {/* Gauge + Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                        {/* Radial Gauge */}
                        <div className="sm:col-span-5 flex flex-col items-center justify-center">
                            <AZRadialGaugeChart
                                value={isLoading ? 0 : healthScore}
                                maxValue={1000}
                                size={190}
                                strokeWidth={15}
                                arcDegree={270}
                                title="Health Score"
                                subtitle="1000 Max"
                                gradientFrom={gaugeGradientFrom}
                                gradientTo={gaugeGradientTo}
                                containerCard={false}
                                valueFormatter={(v) => `${v}`}
                                badge={
                                    <div className="flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300">
                                        {isHealthy ? (
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                        ) : (
                                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                                        )}
                                        <span>
                                            {activeViolations === 0
                                                ? "0 Active Violations"
                                                : `${activeViolations} Active Violation${activeViolations > 1 ? "s" : ""}`}
                                        </span>
                                    </div>
                                }
                            />
                        </div>

                        {/* 4 Core SLA Standard Targets */}
                        <div className="sm:col-span-7 grid grid-cols-2 gap-3">
                            {slaMetrics.map((m) => (
                                <div
                                    key={m.name}
                                    className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                                    title={m.description}
                                >
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                        <span className="text-[11px] font-bold text-slate-300 truncate">
                                            {m.name}
                                        </span>
                                        {m.isMet ? (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        ) : (
                                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                        )}
                                    </div>
                                    <div className="flex items-baseline justify-between gap-2">
                                        <span className="text-base sm:text-lg font-black font-mono text-white">
                                            {isLoading ? "—" : m.value}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-mono">
                                            Goal: {m.target}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Sales Velocity & Financial Breakdown Hub (5 cols) */}
            <div className="lg:col-span-5 card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
                {/* Glowing top line */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none z-20" />
                <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

                <div className="relative z-10 space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-base font-extrabold text-white">
                                Sales Velocity & Balances
                            </h3>
                            <p className="text-xs text-slate-400">
                                Real-time revenue pace and store balances.
                            </p>
                        </div>
                    </div>

                    {/* Payout & Escrow Balances */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col justify-between">
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold">
                                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Withdrawable Funds</span>
                            </div>
                            <div className="mt-2 text-base sm:text-xl font-black font-mono text-emerald-400">
                                {isLoading ? "—" : formatCurrency(withdrawableBalance)}
                            </div>
                            <span className="text-[10px] text-slate-500 mt-1">Delivered orders</span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col justify-between">
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold">
                                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                                <span>Pending Clearance</span>
                            </div>
                            <div className="mt-2 text-base sm:text-xl font-black font-mono text-amber-400">
                                {isLoading ? "—" : formatCurrency(pendingBalance)}
                            </div>
                            <span className="text-[10px] text-slate-500 mt-1">In transit / processing</span>
                        </div>
                    </div>

                    {/* Periodic Sales Velocity: Today vs Month */}
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                <span className="text-slate-300 font-bold">Today&apos;s Gross Sales</span>
                            </div>
                            <div className="text-right">
                                <span className="font-mono font-black text-white">
                                    {isLoading ? "—" : formatCurrency(sales?.revenueToday)}
                                </span>
                                <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                                    ({sales?.ordersToday ?? 0} orders)
                                </span>
                            </div>
                        </div>

                        <div className="h-px bg-white/10" />

                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-400" />
                                <span className="text-slate-300 font-bold">This Month&apos;s Sales</span>
                            </div>
                            <div className="text-right">
                                <span className="font-mono font-black text-white">
                                    {isLoading ? "—" : formatCurrency(sales?.revenueThisMonth)}
                                </span>
                                <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                                    ({sales?.ordersThisMonth ?? 0} orders)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Footprint */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs">
                        <div className="flex items-center gap-2 text-slate-300 font-bold">
                            <Users className="w-4 h-4 text-amber-400" />
                            <span>Customer Retention</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-xs">
                            <span className="text-slate-400">
                                New: <strong className="text-white">{customers?.newCustomers ?? 0}</strong>
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400">
                                Returning:{" "}
                                <strong className="text-emerald-400">
                                    {customers?.returningCustomers ?? 0}
                                </strong>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorOverviewHealthSales;
