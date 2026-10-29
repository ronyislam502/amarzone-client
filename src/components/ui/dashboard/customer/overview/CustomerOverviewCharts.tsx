"use client";

import React, { useMemo } from "react";
import { DollarSign, Package, PieChart as PieIcon, TrendingUp } from "lucide-react";
import AZLineChart, { TLineChartTab } from "@/components/shared/chart/AZLineChart";
import AZPieChart, { TPieChartSlice } from "@/components/shared/chart/AZPieChart";
import { TOrder } from "@/types/order";

export interface CustomerOverviewChartsProps {
    monthlySpending?: Array<{ label: string; value: number }>;
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

export const CustomerOverviewCharts: React.FC<CustomerOverviewChartsProps> = ({
    monthlySpending,
    monthlyOrders,
    orders = [],
    isLoading = false,
}) => {
    // 1. Fallback aggregation: If monthly data is not provided, aggregate from orders
    const derivedMonthly = useMemo(() => {
        if ((monthlySpending && monthlySpending.length > 0) || (monthlyOrders && monthlyOrders.length > 0)) {
            return {
                spending: monthlySpending || [],
                orders: monthlyOrders || [],
            };
        }

        const months: { label: string; key: string; spend: number; count: number }[] = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = d.toLocaleDateString("en-US", { month: "short" });
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            months.push({ label, key, spend: 0, count: 0 });
        }

        orders.forEach((o) => {
            if (!o.createdAt) return;
            const d = new Date(o.createdAt);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            const match = months.find((m) => m.key === key);
            if (match) {
                match.spend += Number(o.totalPrice || 0);
                match.count += 1;
            }
        });

        return {
            spending: months.map((m) => ({ label: m.label, value: Math.round(m.spend * 100) / 100 })),
            orders: months.map((m) => ({ label: m.label, value: m.count })),
        };
    }, [monthlySpending, monthlyOrders, orders]);

    // 2. Line Chart Tabs: Spending Trend & Orders Volume
    const lineTabs: TLineChartTab[] = useMemo(() => {
        return [
            {
                key: "spending",
                label: "Spending Trend ($)",
                icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
                data: derivedMonthly.spending.map((d) => ({
                    label: d.label,
                    value: Number(d.value) || 0,
                })),
                strokeColor: "#10b981",
                gradientFrom: "#10b981",
                gradientTo: "#059669",
                valueFormatter: (v: number) =>
                    `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                yAxisFormatter: (v: number) => `$${Math.round(v).toLocaleString()}`,
                badgeText: "Expenditure",
            },
            {
                key: "orders",
                label: "Purchases Volume",
                icon: <Package className="w-3.5 h-3.5 text-amber-400" />,
                data: derivedMonthly.orders.map((d) => ({
                    label: d.label,
                    value: Number(d.value) || 0,
                })),
                strokeColor: "#fbbf24",
                gradientFrom: "#fbbf24",
                gradientTo: "#d97706",
                valueFormatter: (v: number) => `${v.toLocaleString()} orders`,
                yAxisFormatter: (v: number) => Math.round(v).toString(),
                badgeText: "Order Count",
            },
        ];
    }, [derivedMonthly]);

    // 3. Pie Chart Slices: Status Breakdown
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
            {/* 1. Line Chart: Spending & Purchase Volume (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
                <AZLineChart
                    tabs={lineTabs}
                    defaultTab="spending"
                    title="Purchase Velocity"
                    subtitle="Monthly marketplace expenditure and order volume computed from your verified transactions."
                    icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
                    emptyMessage="No purchases recorded for the selected period."
                    svgHeight={270}
                    className="h-full"
                />
            </div>

            {/* 2. Donut Chart: Orders by Status (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
                <AZPieChart
                    data={pieSlices}
                    title="Fulfillment Distribution"
                    subtitle="Real-time distribution of your orders across delivery, courier transit, and pending stages."
                    icon={<PieIcon className="w-4 h-4 text-cyan-400" />}
                    size={220}
                    strokeWidth={24}
                    legendLayout="grid"
                    centerTitle="Orders"
                    emptyMessage="No purchases placed yet."
                    className="h-full"
                />
            </div>
        </div>
    );
};

export default CustomerOverviewCharts;

