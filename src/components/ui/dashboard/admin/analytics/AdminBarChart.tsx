"use client";

import React, { useMemo, useState } from "react";
import { FolderTree, Building2, UserPlus } from "lucide-react";
import AZBarChart, { TBarChartItem, TBarChartTab } from "@/components/shared/chart/AZBarChart";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { useAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useAllCustomersQuery } from "@/redux/features/customer/customerApi";
import { useAllVendorsQuery } from "@/redux/features/vendor/vendorApi";
import { useAllAdminsQuery } from "@/redux/features/admin/adminApi";

export interface AdminBarChartProps {
    departmentSalesData?: any[];
    categorySalesData?: any[];
    userGrowthData?: any[];
    defaultView?: "departments" | "categories" | "growth";
    activeView?: "departments" | "categories" | "growth";
    onViewChange?: (view: "departments" | "categories" | "growth") => void;
    title?: string;
    subtitle?: string;
    className?: string;
}

const DEPT_COLORS = [
    "#06b6d4", // Cyan
    "#3b82f6", // Blue
    "#0ea5e9", // Sky
    "#10b981", // Emerald
    "#14b8a6", // Teal
    "#6366f1", // Indigo
    "#8b5cf6", // Violet
    "#ec4899", // Pink
];

const CAT_COLORS = [
    "#8b5cf6", // Purple
    "#a855f7", // Violet
    "#ec4899", // Pink
    "#f59e0b", // Amber
    "#06b6d4", // Cyan
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#f43f5e", // Rose
];

const GROWTH_COLORS = [
    "#f59e0b", // Amber
    "#fbbf24", // Warm Yellow
    "#d97706", // Dark Amber
    "#b45309", // Deep Amber
    "#e11d48", // Rose
];

const formatGrowthPeriod = (label: string): string => {
    if (!label) return "";
    const match = String(label).match(/^(\d{4})-(\d{1,2})$/);
    if (match) {
        const year = match[1];
        const monthIndex = parseInt(match[2], 10) - 1;
        const MONTH_NAMES = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        if (monthIndex >= 0 && monthIndex < 12) {
            return `${MONTH_NAMES[monthIndex]} ${year}`;
        }
    }
    return String(label);
};

export const AdminBarChart: React.FC<AdminBarChartProps> = ({
    departmentSalesData = [],
    categorySalesData = [],
    userGrowthData = [],
    defaultView = "departments",
    activeView,
    onViewChange,
    title,
    subtitle,
    className = "",
}) => {
    const [selectedTab, setSelectedTab] = useState<string>(defaultView);
    const activeTab = activeView || selectedTab;

    const handleTabChange = (key: string) => {
        setSelectedTab(key);
        onViewChange?.(key as any);
    };

    const safeDeptData = Array.isArray(departmentSalesData) ? departmentSalesData : [];
    const safeCatData = Array.isArray(categorySalesData) ? categorySalesData : [];
    const safeGrowthData = Array.isArray(userGrowthData) ? userGrowthData : [];

    const shouldQueryFallbacks =
        safeDeptData.length === 0 || safeCatData.length === 0 || safeGrowthData.length === 0;

    // Resilient fallbacks to database stats and entities
    const { data: statsApiResponse } = useDashboardStatsQuery(
        { range: "30_days" },
        { skip: !shouldQueryFallbacks }
    );

    const { data: deptsApiResponse } = useAllDepartmentsQuery(
        { limit: 8 },
        { skip: safeDeptData.length > 0 }
    );

    const { data: catsApiResponse } = useAllCategoriesQuery(
        { limit: 8 },
        { skip: safeCatData.length > 0 }
    );

    const { data: customersApiResponse } = useAllCustomersQuery(
        { limit: 100 },
        { skip: safeGrowthData.length > 0 }
    );

    const { data: vendorsApiResponse } = useAllVendorsQuery(
        { limit: 100 },
        { skip: safeGrowthData.length > 0 }
    );

    const { data: adminsApiResponse } = useAllAdminsQuery(
        { limit: 100 },
        { skip: safeGrowthData.length > 0 }
    );

    const stats = statsApiResponse?.data?.data || statsApiResponse?.data || statsApiResponse;

    const tabs: TBarChartTab[] = useMemo(() => {
        // 1. Departments source resolution (Strict authentic database records only)
        let deptsSource: any[] = safeDeptData;
        if (!deptsSource || deptsSource.length === 0) {
            if (stats?.charts?.departmentSalesChart?.length > 0) {
                deptsSource = stats.charts.departmentSalesChart;
            } else if (stats?.topLists?.topSellingDepartments?.length > 0) {
                deptsSource = stats.topLists.topSellingDepartments;
            } else if (Array.isArray(deptsApiResponse?.data) && deptsApiResponse.data.length > 0) {
                deptsSource = deptsApiResponse.data.map((d: any) => ({
                    department: d.name || d.title || "Department",
                    sales: Number(d.sales ?? d.totalQuantity ?? 0),
                }));
            }
        }

        const deptItems: TBarChartItem[] = (deptsSource || [])
            .map((d: any, index: number) => {
                const deptLabel =
                    d?.department ||
                    d?.departmentName ||
                    d?.name ||
                    d?.title ||
                    `Department ${index + 1}`;

                const deptSales = Number(
                    d?.sales ??
                    d?.totalQuantity ??
                    d?.quantity ??
                    d?.count ??
                    0
                );

                return {
                    id: d?._id || d?.id || deptLabel || index,
                    label: String(deptLabel),
                    value: isNaN(deptSales) ? 0 : Math.max(0, deptSales),
                    color: DEPT_COLORS[index % DEPT_COLORS.length],
                    secondaryLabel: "units sold",
                    badgeNumber: index + 1,
                };
            })
            .sort((a, b) => b.value - a.value)
            .map((item, index) => ({
                ...item,
                badgeNumber: index + 1,
                color: DEPT_COLORS[index % DEPT_COLORS.length],
            }));

        // 2. Categories source resolution (Strict authentic database records only)
        let catsSource: any[] = safeCatData;
        if (!catsSource || catsSource.length === 0) {
            if (stats?.charts?.categorySalesChart?.length > 0) {
                catsSource = stats.charts.categorySalesChart;
            } else if (stats?.topLists?.topSellingCategories?.length > 0) {
                catsSource = stats.topLists.topSellingCategories;
            } else if (Array.isArray(catsApiResponse?.data) && catsApiResponse.data.length > 0) {
                catsSource = catsApiResponse.data.map((c: any) => ({
                    category: c.name || c.title || "Category",
                    sales: Number(c.sales ?? c.totalQuantity ?? 0),
                }));
            }
        }

        const catItems: TBarChartItem[] = (catsSource || [])
            .map((c: any, index: number) => {
                const catLabel =
                    c?.category ||
                    c?.categoryName ||
                    c?.name ||
                    c?.title ||
                    `Category ${index + 1}`;

                const catSales = Number(
                    c?.sales ??
                    c?.totalQuantity ??
                    c?.quantity ??
                    c?.count ??
                    0
                );

                return {
                    id: c?._id || c?.id || catLabel || index,
                    label: String(catLabel),
                    value: isNaN(catSales) ? 0 : Math.max(0, catSales),
                    color: CAT_COLORS[index % CAT_COLORS.length],
                    secondaryLabel: "units sold",
                    badgeNumber: index + 1,
                };
            })
            .sort((a, b) => b.value - a.value)
            .map((item, index) => ({
                ...item,
                badgeNumber: index + 1,
                color: CAT_COLORS[index % CAT_COLORS.length],
            }));

        // 3. User Growth source resolution (Strict authentic database records only)
        let growthSource: any[] = safeGrowthData;
        if (!growthSource || growthSource.length === 0) {
            if (stats?.charts?.userGrowthChart?.length > 0) {
                growthSource = stats.charts.userGrowthChart;
            } else if (stats?.ordersAnalytics?.monthlyAnalytics?.length > 0) {
                growthSource = stats.ordersAnalytics.monthlyAnalytics.map((m: any) => ({
                    label: m._id?.year && m._id?.month ? `${m._id.year}-${m._id.month}` : "Monthly",
                    value: m.count || 0,
                }));
            } else {
                // Group verified users from live queries by creation month
                const allUsers: any[] = [
                    ...(Array.isArray(customersApiResponse?.data) ? customersApiResponse.data : []),
                    ...(Array.isArray(vendorsApiResponse?.data) ? vendorsApiResponse.data : []),
                    ...(Array.isArray(adminsApiResponse?.data) ? adminsApiResponse.data : []),
                ];
                if (allUsers.length > 0) {
                    const monthMap = new Map<string, number>();
                    allUsers.forEach((u: any) => {
                        if (u?.createdAt) {
                            const d = new Date(u.createdAt);
                            if (!isNaN(d.getTime())) {
                                const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
                                monthMap.set(key, (monthMap.get(key) || 0) + 1);
                            }
                        }
                    });
                    if (monthMap.size > 0) {
                        growthSource = Array.from(monthMap.entries())
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([label, value]) => ({ label, value }));
                    }
                }
            }
        }

        const growthItems: TBarChartItem[] = (growthSource || [])
            .map((u: any, index: number) => {
                const rawLabel = u?.label || u?.date || u?.month || `Period ${index + 1}`;
                const formattedLabel = formatGrowthPeriod(String(rawLabel));
                const growthValue = Number(u?.value ?? u?.count ?? 0);

                return {
                    id: u?._id || u?.id || rawLabel || index,
                    label: formattedLabel,
                    value: isNaN(growthValue) ? 0 : Math.max(0, growthValue),
                    color: GROWTH_COLORS[index % GROWTH_COLORS.length],
                    secondaryLabel: "registered users",
                    badgeNumber: index + 1,
                };
            })
            .map((item, index) => ({
                ...item,
                badgeNumber: index + 1,
                color: GROWTH_COLORS[index % GROWTH_COLORS.length],
            }));

        return [
            {
                key: "departments",
                label: "Departments",
                icon: <Building2 className="w-3.5 h-3.5" />,
                layout: "horizontal",
                colorGradient: "from-cyan-500 via-blue-400 to-emerald-400",
                unitLabel: "units sold",
                emptyMessage: "No catalog department product sales recorded for this timeframe.",
                data: deptItems,
            },
            {
                key: "categories",
                label: "Categories",
                icon: <FolderTree className="w-3.5 h-3.5" />,
                layout: "horizontal",
                colorGradient: "from-purple-500 via-indigo-400 to-amber-400",
                unitLabel: "units sold",
                emptyMessage: "No catalog category product sales have been logged yet.",
                data: catItems,
            },
            {
                key: "growth",
                label: "User Growth",
                icon: <UserPlus className="w-3.5 h-3.5" />,
                layout: "horizontal",
                colorGradient: "from-amber-500/30 via-amber-400/80 to-amber-300",
                unitLabel: "users",
                emptyMessage: "No monthly user growth metrics are available for the period.",
                data: growthItems,
            },
        ];
    }, [
        safeDeptData,
        safeCatData,
        safeGrowthData,
        stats,
        deptsApiResponse,
        catsApiResponse,
        customersApiResponse,
        vendorsApiResponse,
        adminsApiResponse,
    ]);

    return (
        <AZBarChart
            tabs={tabs}
            activeTab={activeTab}
            defaultTab={defaultView}
            onTabChange={handleTabChange}
            title={title || "Sales & Performance Rankings"}
            subtitle={
                subtitle ||
                "Comparative bar distribution across catalog departments, product categories, and registrations."
            }
            colorGradient="from-cyan-500 via-blue-400 to-emerald-400"
            className={className}
        />
    );
};

export default AdminBarChart;
