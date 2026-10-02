"use client";

import React, { useMemo } from "react";
import { FolderTree, Building2, UserPlus } from "lucide-react";
import {
  TCategorySalesPoint,
  TDepartmentSalesPoint,
  TDashboardChartPoint,
} from "@/src/types/dashboard";
import { BarChart, TBarChartTab } from "@/src/components/ui/charts/BarChart";

export interface AdminBarChartProps {
  departmentSalesData?: TDepartmentSalesPoint[];
  categorySalesData?: TCategorySalesPoint[];
  userGrowthData?: TDashboardChartPoint[];
  defaultView?: "departments" | "categories" | "growth";
  title?: string;
}

export const AdminBarChart: React.FC<AdminBarChartProps> = ({
  departmentSalesData = [],
  categorySalesData = [],
  userGrowthData = [],
  defaultView = "departments",
  title,
}) => {
  const tabs: TBarChartTab[] = useMemo(() => {
    return [
      {
        key: "departments",
        label: "Departments",
        icon: <Building2 className="w-3.5 h-3.5" />,
        layout: "horizontal",
        colorGradient: "from-cyan-500 via-blue-400 to-emerald-400",
        unitLabel: "units sold",
        emptyMessage: "No catalog department product sales recorded for this timeframe.",
        data: departmentSalesData.map((d, index) => ({
          id: d.department || index,
          label: d.department || "General Department",
          value: d.sales,
          secondaryLabel: "units sold",
          badgeNumber: index + 1,
        })),
      },
      {
        key: "categories",
        label: "Categories",
        icon: <FolderTree className="w-3.5 h-3.5" />,
        layout: "horizontal",
        colorGradient: "from-purple-500 via-indigo-400 to-amber-400",
        unitLabel: "units",
        emptyMessage: "No catalog category product sales have been logged yet.",
        data: categorySalesData.map((c, index) => ({
          id: c.category || index,
          label: c.category || "Uncategorized",
          value: c.sales,
          secondaryLabel: "units",
          badgeNumber: index + 1,
        })),
      },
      {
        key: "growth",
        label: "User Growth",
        icon: <UserPlus className="w-3.5 h-3.5" />,
        layout: "vertical",
        colorGradient: "from-amber-500/30 via-amber-400/80 to-amber-300",
        emptyMessage: "No monthly user growth metrics are available for the period.",
        data: userGrowthData.map((u, index) => ({
          id: u.label || index,
          label: u.label,
          value: u.value,
        })),
      },
    ];
  }, [departmentSalesData, categorySalesData, userGrowthData]);

  return (
    <BarChart
      tabs={tabs}
      defaultTab={defaultView}
      title={title || "Sales & Performance Rankings"}
      subtitle="Comparative bar distribution across catalog departments, product categories, and registrations."
    />
  );
};

export default AdminBarChart;
