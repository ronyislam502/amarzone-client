"use client";

import React, { useMemo } from "react";
import { DollarSign, Package, PieChart as PieIcon, TrendingUp } from "lucide-react";
import AZLineChart, { TLineChartTab } from "@/components/shared/chart/AZLineChart";
import AZPieChart, { TPieChartSlice } from "@/components/shared/chart/AZPieChart";
import { TOrder } from "@/types/order";

export interface VendorOverviewChartsProps {
    monthlyRevenue?: Array<{ label: string; value: number }>;
    monthlyOrders?: Array<{ label: string; value: number }>;
    orders?: TOrder[];
    isLoading?: boolean;
}

const STATUS_COLOR_MAP: Record<string, string> = {
    DELIVERED: "#10b981", // Emerald
    SHIPPED: "#38bdf8", // Sky blue
    IN_TRANSIT: "#0ea5e9", // Sky
    OUT_OF_DELIVERY: "#0284c7", // Blue
    UNSHIPPED: "#06b6d4", // Cyan
    PROCESSING: "#06b6d4", // Cyan
    PENDING: "#f59e0b", // Amber
    CANCELLED: "#f43f5e", // Rose
    REFUNDED: "#a855f7", // Purple
};

export const VendorOverviewCharts: React.FC<VendorOverviewChartsProps> = ({
    monthlyRevenue = [],
    monthlyOrders = [],
    orders = [],
    isLoading = false,
}) => {
    // 1. Line Chart Tabs: Revenue & Orders Velocity from actual DB monthly metrics
    const lineTabs: TLineChartTab[] = useMemo(() => {
        return [
            {
                key: "revenue",
                label: "Revenue Trend ($)",
                icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
                data: monthlyRevenue.map((d) => ({
                    label: d.label,
                    value: Number(d.value) || 0,
                })),
                strokeColor: "#10b981",
                gradientFrom: "#10b981",
                gradientTo: "#059669",
                valueFormatter: (v: number) =>
                    `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                yAxisFormatter: (v: number) => `$${Math.round(v).toLocaleString()}`,
                badgeText: "Gross Sales",
            },
            {
                key: "orders",
                label: "Orders Volume (Qty)",
                icon: <Package className="w-3.5 h-3.5 text-amber-400" />,
                data: monthlyOrders.map((d) => ({
                    label: d.label,
                    value: Number(d.value) || 0,
                })),
                strokeColor: "#fbbf24",
                gradientFrom: "#fbbf24",
                gradientTo: "#d97706",
                valueFormatter: (v: number) => `${v.toLocaleString()} orders`,
                yAxisFormatter: (v: number) => Math.round(v).toString(),
                badgeText: "Order Volume",
            },
        ];
    }, [monthlyRevenue, monthlyOrders]);

    // 2. Pie Chart Slices: Computed dynamically from the vendor's actual DB orders
    const pieSlices: TPieChartSlice[] = useMemo(() => {
        if (!orders || orders.length === 0) return [];

        const statusCounts: Record<string, number> = {};
        orders.forEach((o) => {
            const statusKey = (o.status || "PENDING").toUpperCase();
            statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;
        });

        const statusLabels: Record<string, string> = {
            DELIVERED: "Delivered",
            SHIPPED: "Shipped",
            IN_TRANSIT: "In Transit",
            OUT_OF_DELIVERY: "Out For Delivery",
            UNSHIPPED: "Unshipped",
            PROCESSING: "Processing",
            PENDING: "Pending",
            CANCELLED: "Cancelled",
            REFUNDED: "Refunded",
        };

        return Object.entries(statusCounts)
            .filter(([, count]) => count > 0)
            .map(([statusKey, count]) => ({
                id: statusKey,
                label: statusLabels[statusKey] || statusKey,
                value: count,
                color: STATUS_COLOR_MAP[statusKey] || "#64748b",
            }));
    }, [orders]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 1. Line Chart: Monthly Revenue & Order Volume Trends (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
                <AZLineChart
                    tabs={lineTabs}
                    defaultTab="revenue"
                    title="Performance Velocity"
                    subtitle="Monthly gross revenue and fulfilled order velocity calculated directly from store records."
                    icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
                    emptyMessage="No sales transaction history recorded in the database for the selected period."
                    svgHeight={270}
                    className="h-full"
                />
            </div>

            {/* 2. Donut Chart: Orders by Active Lifecycle Status (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
                <AZPieChart
                    data={pieSlices}
                    title="Fulfillment Funnel"
                    subtitle="Real-time distribution of store orders across processing, transit, delivery, and refund stages."
                    icon={<PieIcon className="w-4 h-4 text-cyan-400" />}
                    size={220}
                    strokeWidth={24}
                    legendLayout="grid"
                    centerTitle="Orders"
                    emptyMessage="No customer orders recorded in your database yet."
                    className="h-full"
                />
            </div>
        </div>
    );
};

export default VendorOverviewCharts;
