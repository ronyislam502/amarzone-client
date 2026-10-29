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
    // 1. Line Chart Tabs: Revenue & Orders Velocity from actual DB monthly metrics or live database orders fallback
    const derivedMonthly = useMemo(() => {
        const hasBackendRev = Array.isArray(monthlyRevenue) && monthlyRevenue.length > 0;
        const hasBackendOrd = Array.isArray(monthlyOrders) && monthlyOrders.length > 0;

        // Generate standard 6-month continuous timeline
        const months: {
            label: string;
            key: string;
            altKey: string;
            revenue: number;
            ordersCount: number;
        }[] = [];

        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = d.toLocaleDateString("en-US", { month: "short" });
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            const altKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
            months.push({ label, key, altKey, revenue: 0, ordersCount: 0 });
        }

        if (hasBackendRev) {
            monthlyRevenue.forEach((item) => {
                const match = months.find(
                    (m) => m.key === item.label || m.altKey === item.label || m.label === item.label
                );
                if (match) {
                    match.revenue = Number(item.value) || 0;
                }
            });
        }

        if (hasBackendOrd) {
            monthlyOrders.forEach((item) => {
                const match = months.find(
                    (m) => m.key === item.label || m.altKey === item.label || m.label === item.label
                );
                if (match) {
                    match.ordersCount = Number(item.value) || 0;
                }
            });
        }

        const totalRev = months.reduce((acc, m) => acc + m.revenue, 0);
        const totalOrd = months.reduce((acc, m) => acc + m.ordersCount, 0);

        // If backend returned no data or zero, populate directly from live database orders
        if (totalRev === 0 && totalOrd === 0 && orders && orders.length > 0) {
            orders.forEach((o) => {
                if (!o.createdAt) return;
                const d = new Date(o.createdAt);
                const orderKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                const orderAltKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
                const match = months.find((m) => m.key === orderKey || m.altKey === orderAltKey);
                if (match) {
                    const st = (o.status || "").toUpperCase();
                    if (st !== "CANCELLED" && st !== "REFUNDED") {
                        const amount = Number(
                            o.vendorAmount ?? (o.totalPrice ? o.totalPrice - (o.commission || 0) : 0)
                        );
                        match.revenue += isNaN(amount) ? 0 : amount;
                    }
                    match.ordersCount += 1;
                }
            });
        }

        return {
            revenue: months.map((m) => ({
                label: m.label,
                value: Math.round(m.revenue * 100) / 100,
            })),
            orders: months.map((m) => ({
                label: m.label,
                value: m.ordersCount,
            })),
        };
    }, [monthlyRevenue, monthlyOrders, orders]);

    const lineTabs: TLineChartTab[] = useMemo(() => {
        return [
            {
                key: "revenue",
                label: "Revenue Trend ($)",
                icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
                data: derivedMonthly.revenue,
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
                data: derivedMonthly.orders,
                strokeColor: "#fbbf24",
                gradientFrom: "#fbbf24",
                gradientTo: "#d97706",
                valueFormatter: (v: number) => `${v.toLocaleString()} orders`,
                yAxisFormatter: (v: number) => Math.round(v).toString(),
                badgeText: "Order Volume",
            },
        ];
    }, [derivedMonthly]);

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
