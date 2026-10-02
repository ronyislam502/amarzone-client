"use client";

import React, { useMemo } from "react";
import { DollarSign, ShoppingBag } from "lucide-react";
import { LineChart, TLineChartPoint } from "@/src/components/ui/charts/LineChart";

export type TDailyChartPoint = TLineChartPoint;

export interface AdminLineChartProps {
  ordersData?: TDailyChartPoint[];
  revenueData?: TDailyChartPoint[];
  forcedMetric?: "orders" | "revenue";
  title?: string;
  subtitle?: string;
}

export const AdminLineChart: React.FC<AdminLineChartProps> = ({
  ordersData = [],
  revenueData = [],
  forcedMetric,
  title,
  subtitle,
}) => {
  const tabs = useMemo(
    () => [
      {
        key: "orders",
        label: "Orders Volume",
        badgeText: "Orders Stream",
        icon: <ShoppingBag className="w-3.5 h-3.5" />,
        data: ordersData,
        strokeColor: "#34d399",
        valueFormatter: (v: number) => `${v.toLocaleString()} Orders`,
        yAxisFormatter: (v: number) => Math.round(v).toString(),
      },
      {
        key: "revenue",
        label: "Daily Revenue",
        badgeText: "Revenue Stream",
        icon: <DollarSign className="w-3.5 h-3.5" />,
        data: revenueData,
        strokeColor: "#fbbf24",
        valueFormatter: (v: number) =>
          `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        yAxisFormatter: (v: number) => `$${Math.round(v)}`,
      },
    ],
    [ordersData, revenueData]
  );

  return (
    <LineChart
      tabs={tabs}
      forcedTab={forcedMetric}
      defaultTab={forcedMetric || "orders"}
      title={title}
      subtitle={subtitle}
      emptyMessage="No orders or revenue transactions were recorded in the active filter timeframe."
    />
  );
};

export default AdminLineChart;
