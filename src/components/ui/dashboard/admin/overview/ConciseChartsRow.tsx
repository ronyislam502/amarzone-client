"use client";

import React, { useMemo } from "react";
import AZBarChart, { TBarChartItem } from "@/components/shared/chart/AZBarChart";
import AZLineChart, { TLineChartPoint, TLineChartTab } from "@/components/shared/chart/AZLineChart";
import AZPieChart, { TPieChartSlice } from "@/components/shared/chart/AZPieChart";
import { TCategorySalesPoint, TStatusCountPoint } from "@/types/dashboard";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import { useAllCategoriesQuery } from "@/redux/features/category/categoryApi";

export interface ConciseChartsRowProps {
  ordersData?: TLineChartPoint[];
  revenueData?: TLineChartPoint[];
  orderStatusData?: TStatusCountPoint[];
  categorySalesData?: any[];
}

const CATEGORY_COLORS = [
  "#a855f7", // Purple
  "#06b6d4", // Cyan
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#ec4899", // Pink
  "#6366f1", // Indigo
];

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

  // Fallback to stats cache and database categories if categorySalesData prop is empty
  const { data: statsApiResponse } = useDashboardStatsQuery(
    { range: "30_days" },
    { skip: safeCategorySalesData.length > 0 }
  );

  const { data: categoriesApiResponse } = useAllCategoriesQuery(
    { limit: 6 },
    { skip: safeCategorySalesData.length > 0 }
  );

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

  // 3. Bar Chart Items (Top Categories with resilient fallback to DB data)
  const barItems: TBarChartItem[] = useMemo(() => {
    let sourceList: any[] = safeCategorySalesData;

    // If prop is empty, check stats API response (charts or topLists)
    if (!sourceList || sourceList.length === 0) {
      const stats = statsApiResponse?.data?.data || statsApiResponse?.data || statsApiResponse;
      if (stats?.charts?.categorySalesChart && stats.charts.categorySalesChart.length > 0) {
        sourceList = stats.charts.categorySalesChart;
      } else if (
        stats?.topLists?.topSellingCategories &&
        stats.topLists.topSellingCategories.length > 0
      ) {
        sourceList = stats.topLists.topSellingCategories;
      }
    }

    // If still empty, check live categories API response
    if (!sourceList || sourceList.length === 0) {
      const dbCategories = categoriesApiResponse?.data;
      if (Array.isArray(dbCategories) && dbCategories.length > 0) {
        sourceList = dbCategories.map((cat: any, idx: number) => ({
          category: cat.name || cat.title || `Category ${idx + 1}`,
          sales: cat.productsCount || cat.productCount || (idx + 1) * 10,
        }));
      }
    }

    if (!Array.isArray(sourceList) || sourceList.length === 0) {
      return [];
    }

    return sourceList
      .slice(0, 5)
      .map((c: any, idx: number) => {
        const categoryLabel =
          c?.category ||
          c?.categoryName ||
          c?.name ||
          c?.title ||
          c?.label ||
          (typeof c === "string" ? c : `Category ${idx + 1}`);

        const salesValue = Number(
          c?.sales ??
          c?.totalQuantity ??
          c?.quantity ??
          c?.count ??
          c?.totalSold ??
          c?.value ??
          0
        );

        return {
          id: c?._id || c?.id || categoryLabel || idx,
          label: String(categoryLabel),
          value: isNaN(salesValue) ? 0 : salesValue,
          color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
          secondaryLabel: "units sold",
          badgeNumber: idx + 1,
        };
      });
  }, [safeCategorySalesData, statsApiResponse, categoriesApiResponse]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Concise Line Chart (Daily Trend Sparkline) */}
      <AZLineChart
        tabs={lineTabs}
        defaultTab="orders"
        title="Daily Velocity"
        compact={true}
        showSummaryStats={false}
        svgHeight={160}
      />

      {/* 2. Concise Pie / Donut Chart (Status Proportions) */}
      <AZPieChart
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
      <AZBarChart
        data={barItems}
        title="Top Categories"
        unitLabel="Units Sold"
        compact={true}
        layout="horizontal"
        colorGradient="from-purple-500 to-amber-400"
      />
    </div>
  );
};

export default ConciseChartsRow;
