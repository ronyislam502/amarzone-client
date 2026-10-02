"use client";

import React, { useMemo } from "react";
import { Layers, FolderTree } from "lucide-react";
import { BarChart, TBarChartTab } from "@/src/components/ui/charts/BarChart";

export interface TGroupSalesPoint {
  id: string;
  name: string;
  revenue: number;
  ordersCount: number;
}

export interface VendorBarChartsProps {
  departmentSales: TGroupSalesPoint[];
  categorySales: TGroupSalesPoint[];
}

export const VendorBarCharts: React.FC<VendorBarChartsProps> = ({
  departmentSales = [],
  categorySales = [],
}) => {
  const tabs: TBarChartTab[] = useMemo(() => {
    const formatRev = (v: number) =>
      `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return [
      {
        key: "departments",
        label: `Departments (${departmentSales.length})`,
        icon: <Layers className="w-3.5 h-3.5" />,
        layout: "horizontal",
        colorGradient: "from-purple-600 via-pink-500 to-amber-400",
        valueFormatter: formatRev,
        emptyMessage: "No sales recorded across departments for the selected period.",
        data: departmentSales.map((item, idx) => ({
          id: item.id || idx,
          label: item.name,
          value: item.revenue,
          meta: `${item.ordersCount} ${item.ordersCount === 1 ? "order" : "orders"}`,
          badgeNumber: idx + 1,
        })),
      },
      {
        key: "categories",
        label: `Categories (${categorySales.length})`,
        icon: <FolderTree className="w-3.5 h-3.5" />,
        layout: "horizontal",
        colorGradient: "from-purple-600 via-pink-500 to-amber-400",
        valueFormatter: formatRev,
        emptyMessage: "No sales recorded across categories for the selected period.",
        data: categorySales.map((item, idx) => ({
          id: item.id || idx,
          label: item.name,
          value: item.revenue,
          meta: `${item.ordersCount} ${item.ordersCount === 1 ? "order" : "orders"}`,
          badgeNumber: idx + 1,
        })),
      },
    ];
  }, [departmentSales, categorySales]);

  return (
    <BarChart
      tabs={tabs}
      defaultTab="departments"
      title="Taxonomy Breakdown"
      subtitle="Sales distribution and order velocity by marketplace department and product category."
    />
  );
};

export default VendorBarCharts;
