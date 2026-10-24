"use client";

import React, { useMemo } from "react";
import { DollarSign, Package } from "lucide-react";
import AZLineChart, { TLineChartTab } from "@/components/shared/chart/AZLineChart";
import AZPieChart, { TPieChartSlice } from "@/components/shared/chart/AZPieChart";

export interface TChartPoint {
    label: string; // e.g. "Sep 12"
    value: number;
}

export interface TStatusPoint {
    status: string;
    count: number;
}

export interface VendorSalesChartsProps {
    revenueOverTime: TChartPoint[];
    ordersOverTime: TChartPoint[];
    ordersByStatus: TStatusPoint[];
}

export const VendorPieChart: React.FC<VendorSalesChartsProps> = ({
    revenueOverTime = [],
    ordersOverTime = [],
    ordersByStatus = [],
}) => {
    const lineTabs: TLineChartTab[] = useMemo(() => {
        return [
            {
                key: "revenue",
                label: "Revenue ($)",
                icon: <DollarSign className="w-3.5 h-3.5" />,
                data: revenueOverTime,
                strokeColor: "#34d399",
                valueFormatter: (v: number) =>
                    `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                yAxisFormatter: (v: number) => `$${Math.round(v)}`,
            },
            {
                key: "orders",
                label: "Orders (Qty)",
                icon: <Package className="w-3.5 h-3.5" />,
                data: ordersOverTime,
                strokeColor: "#fbbf24",
                valueFormatter: (v: number) => `${v} orders`,
                yAxisFormatter: (v: number) => Math.round(v).toString(),
            },
        ];
    }, [revenueOverTime, ordersOverTime]);

    const pieSlices: TPieChartSlice[] = useMemo(() => {
        return ordersByStatus.map((item) => ({
            id: item.status,
            label: item.status,
            value: item.count,
        }));
    }, [ordersByStatus]);

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
