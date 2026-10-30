"use client";

import React, { useMemo } from "react";
import { DollarSign, Package } from "lucide-react";
import AZLineChart, { TLineChartTab } from "@/components/shared/chart/AZLineChart";
import AZPieChart, { TPieChartSlice } from "@/components/shared/chart/AZPieChart";
import { useMyOrdersQuery } from "@/redux/features/order/orderApi";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import { TOrder } from "@/types/order";

export interface TChartPoint {
    label: string; // e.g. "Sep 12"
    value: number;
}

export interface TStatusPoint {
    status: string;
    count: number;
}

export interface VendorSalesChartsProps {
    revenueOverTime?: TChartPoint[];
    ordersOverTime?: TChartPoint[];
    ordersByStatus?: TStatusPoint[];
    orders?: (TOrder | any)[];
    monthlyRevenue?: Array<{ label: string; value: number }>;
    monthlyOrders?: Array<{ label: string; value: number }>;
    isLoading?: boolean;
}

const formatMonthLabel = (label: string): string => {
    if (!label) return "";
    const match = String(label).match(/^(\d{4})[-/](\d{1,2})$/);
    if (match) {
        const year = match[1];
        const monthIndex = parseInt(match[2], 10) - 1;
        const MONTH_NAMES = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        if (monthIndex >= 0 && monthIndex < 12) {
            return `${MONTH_NAMES[monthIndex]} ${year}`;
        }
    }
    return String(label);
};

export const VendorPieChart: React.FC<VendorSalesChartsProps> = ({
    revenueOverTime = [],
    ordersOverTime = [],
    ordersByStatus = [],
    orders,
    monthlyRevenue,
    monthlyOrders,
    isLoading = false,
}) => {
    const hasPropsRevenue = Array.isArray(revenueOverTime) && revenueOverTime.length > 0;
    const hasPropsOrders = Array.isArray(ordersOverTime) && ordersOverTime.length > 0;
    const hasPropsStatus = Array.isArray(ordersByStatus) && ordersByStatus.some((s) => s.count > 0);

    const shouldQueryFallbacks = !hasPropsRevenue || !hasPropsOrders || !hasPropsStatus;

    // Resilient fallbacks to database
    const { data: fallbackOrdersData } = useMyOrdersQuery(
        { limit: 100 },
        { skip: !shouldQueryFallbacks || (Array.isArray(orders) && orders.length > 0) }
    );

    const { data: fallbackStatsData } = useDashboardStatsQuery(
        { range: "30_days" },
        { skip: !shouldQueryFallbacks }
    );

    // Resolve verified orders from props or fallback query
    const effectiveOrders = useMemo(() => {
        if (Array.isArray(orders) && orders.length > 0) return orders;
        const raw = fallbackOrdersData?.data;
        if (Array.isArray(raw)) return raw;
        if (Array.isArray((raw as any)?.data)) return (raw as any).data;
        return [];
    }, [orders, fallbackOrdersData]);

    // Resolve time-series data for Performance Trend
    const { finalRevenueOverTime, finalOrdersOverTime } = useMemo(() => {
        if (hasPropsRevenue && hasPropsOrders) {
            return {
                finalRevenueOverTime: revenueOverTime,
                finalOrdersOverTime: ordersOverTime,
            };
        }

        // 1. Group real confirmed orders chronologically by date
        if (effectiveOrders.length > 0) {
            const dayMap = new Map<string, { revenue: number; count: number; timestamp: number }>();

            const sorted = [...effectiveOrders].sort((a: any, b: any) =>
                new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            );

            sorted.forEach((o: any) => {
                if (!o.createdAt) return;
                const d = new Date(o.createdAt);
                if (isNaN(d.getTime())) return;
                const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                const curr = dayMap.get(label) || { revenue: 0, count: 0, timestamp: d.getTime() };
                const st = (o.status || "").toUpperCase();
                const rev =
                    st !== "CANCELLED" && st !== "REFUNDED"
                        ? Number(o.vendorAmount ?? (o.totalPrice ? o.totalPrice - (o.commission || 0) : 0))
                        : 0;

                dayMap.set(label, {
                    revenue: curr.revenue + (isNaN(rev) ? 0 : rev),
                    count: curr.count + 1,
                    timestamp: d.getTime(),
                });
            });

            if (dayMap.size > 0) {
                const revPoints: TChartPoint[] = [];
                const ordPoints: TChartPoint[] = [];

                dayMap.forEach((val, label) => {
                    revPoints.push({ label, value: Math.round(val.revenue * 100) / 100 });
                    ordPoints.push({ label, value: val.count });
                });

                return {
                    finalRevenueOverTime: revPoints,
                    finalOrdersOverTime: ordPoints,
                };
            }
        }

        // 2. Check monthly analytics from backend stats
        const stats = fallbackStatsData?.data?.data || fallbackStatsData?.data || fallbackStatsData;
        const bRev = monthlyRevenue || stats?.charts?.monthlyRevenue;
        const bOrd = monthlyOrders || stats?.charts?.monthlyOrders;

        if (Array.isArray(bRev) && bRev.length > 0) {
            const revPoints = bRev.map((item: any) => ({
                label: formatMonthLabel(item.label),
                value: Number(item.value) || 0,
            }));
            const ordPoints = Array.isArray(bOrd)
                ? bOrd.map((item: any) => ({
                    label: formatMonthLabel(item.label),
                    value: Number(item.value) || 0,
                }))
                : [];

            return {
                finalRevenueOverTime: revPoints,
                finalOrdersOverTime: ordPoints,
            };
        }

        return {
            finalRevenueOverTime: revenueOverTime,
            finalOrdersOverTime: ordersOverTime,
        };
    }, [
        hasPropsRevenue,
        hasPropsOrders,
        revenueOverTime,
        ordersOverTime,
        effectiveOrders,
        fallbackStatsData,
        monthlyRevenue,
        monthlyOrders,
    ]);

    // Resolve order lifecycle stages for Fulfillment Funnel Donut Chart
    const pieSlices: TPieChartSlice[] = useMemo(() => {
        if (hasPropsStatus) {
            return ordersByStatus
                .filter((item) => item.count > 0)
                .map((item) => ({
                    id: item.status,
                    label: item.status,
                    value: item.count,
                }));
        }

        if (effectiveOrders.length > 0) {
            const counts: Record<string, number> = {
                Delivered: 0,
                Shipped: 0,
                Processing: 0,
                Pending: 0,
                Cancelled: 0,
            };

            effectiveOrders.forEach((o: any) => {
                const st = (o.status || "").toUpperCase();
                if (st === "DELIVERED") counts.Delivered++;
                else if (st === "SHIPPED" || st === "IN_TRANSIT" || st === "OUT_OF_DELIVERY") counts.Shipped++;
                else if (st === "PROCESSING" || st === "UNSHIPPED") counts.Processing++;
                else if (st === "CANCELLED" || st === "REFUNDED") counts.Cancelled++;
                else counts.Pending++;
            });

            return Object.entries(counts)
                .filter(([, count]) => count > 0)
                .map(([status, count]) => ({
                    id: status,
                    label: status,
                    value: count,
                }));
        }

        return ordersByStatus.map((item) => ({
            id: item.status,
            label: item.status,
            value: item.count,
        }));
    }, [hasPropsStatus, ordersByStatus, effectiveOrders]);

    const lineTabs: TLineChartTab[] = useMemo(() => {
        return [
            {
                key: "revenue",
                label: "Revenue ($)",
                icon: <DollarSign className="w-3.5 h-3.5" />,
                data: finalRevenueOverTime,
                strokeColor: "#34d399",
                valueFormatter: (v: number) =>
                    `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                yAxisFormatter: (v: number) => `$${Math.round(v)}`,
            },
            {
                key: "orders",
                label: "Orders (Qty)",
                icon: <Package className="w-3.5 h-3.5" />,
                data: finalOrdersOverTime,
                strokeColor: "#fbbf24",
                valueFormatter: (v: number) => `${v} orders`,
                yAxisFormatter: (v: number) => Math.round(v).toString(),
            },
        ];
    }, [finalRevenueOverTime, finalOrdersOverTime]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 1. Line Chart: Revenue & Orders Over Time (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
                <AZLineChart
                    tabs={lineTabs}
                    defaultTab="revenue"
                    title="Performance Trend"
                    subtitle="Continuous sales revenue and order volume velocity calculated from confirmed orders."
                    svgWidth={650}
                    svgHeight={260}
                    className="h-full"
                />
            </div>

            {/* 2. Donut Chart: Orders by Status (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
                <AZPieChart
                    data={pieSlices}
                    title="Fulfillment Funnel"
                    subtitle="Orders by active stage and lifecycle status."
                    size={220}
                    strokeWidth={24}
                    legendLayout="grid"
                    centerTitle="Total"
                    className="h-full"
                />
            </div>
        </div>
    );
};

export default VendorPieChart;
