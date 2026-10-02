"use client";

import React, { useMemo } from "react";
import {
  TStatusCountPoint,
  TCategorySalesPoint,
} from "@/src/types/dashboard";
import { LineChart, TLineChartPoint, TLineChartTab } from "@/src/components/ui/charts/LineChart";
import { PieChart, TPieChartSlice } from "@/src/components/ui/charts/PieChart";
import { BarChart, TBarChartItem } from "@/src/components/ui/charts/BarChart";

export interface ConciseChartsRowProps {
  ordersData?: TLineChartPoint[];
  revenueData?: TLineChartPoint[];
  orderStatusData?: TStatusCountPoint[];
  categorySalesData?: TCategorySalesPoint[];
}

export const ConciseChartsRow: React.FC<ConciseChartsRowProps> = ({
  ordersData = [],
  revenueData = [],
  orderStatusData = [],
  categorySalesData = [],
}) => {
  const safeOrdersData = Array.isArray(ordersData) ? ordersData : [];
  const safeRevenueData = Array.isArray(revenueData) ? revenueData : [];
  const safeOrderStatusData = Array.isArray(orderStatusData) ? orderStatusData : [];
  const safeCategorySalesData = Array.isArray(categorySalesData) ? categorySalesData : [];

  // 1. Line Chart Tabs
  const lineTabs: TLineChartTab[] = useMemo(() => {
    return [
      {
        key: "orders",
        label: "Orders",
        data: safeOrdersData,
        strokeColor: "#34d399",
        valueFormatter: (v: number) => `${v} ord`,
      },
      {
        key: "revenue",
        label: "Revenue",
        data: safeRevenueData,
        strokeColor: "#fbbf24",
        valueFormatter: (v: number) => `$${v.toLocaleString()}`,
      },
    ];
  }, [safeOrdersData, safeRevenueData]);

  // 2. Pie Chart Slices
  const pieSlices: TPieChartSlice[] = useMemo(() => {
    return safeOrderStatusData.map((s) => ({
      id: s.status,
      label: s.status,
      value: s.count,
    }));
  }, [safeOrderStatusData]);

  // 3. Bar Chart Items (Top 4 categories)
  const barItems: TBarChartItem[] = useMemo(() => {
    return safeCategorySalesData.slice(0, 4).map((c, idx) => ({
      id: c.category || idx,
      label: c.category || "Unassigned",
      value: c.sales,
      gradient: "from-purple-500 to-amber-400",
    }));
  }, [safeCategorySalesData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Concise Line Chart (Daily Trend Sparkline) */}
      <LineChart
        tabs={lineTabs}
        defaultTab="orders"
        title="Daily Velocity"
        compact={true}
        showSummaryStats={false}
        svgHeight={160}
      />

      {/* 2. Concise Pie / Donut Chart (Status Proportions) */}
      <PieChart
        data={pieSlices}
        title="Status Breakdown"
        compact={true}
        size={140}
        strokeWidth={18}
        legendLayout="compact"
        centerTitle="Total"
        centerSubtitle="Orders"
      />

      {/* 3. Concise Bar Chart (Top Categories) */}
      <BarChart
        data={barItems}
        title="Top Categories"
        unitLabel="Units Sold"
        compact={true}
        layout="horizontal"
      />
    </div>
  );
};

export default ConciseChartsRow;
