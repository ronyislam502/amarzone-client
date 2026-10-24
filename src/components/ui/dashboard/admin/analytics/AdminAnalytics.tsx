"use client";

import { useState, useMemo } from "react";
import {
    AlertCircle,
    RefreshCw,
} from "lucide-react";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import { TDashboardStatsData } from "@/types/dashboard";
import AdminAnalyticsBread from "./AdminAnalyticsBread";
import AdminAnalyticsHeader, { TAnalyticsDateRange } from "./AdminAnalyticsHeader";
import AdminLineChart from "./AdminLineChart";
import AdminPieChart from "./AdminPieChart";
import AdminDeepAnalytics from "./AdminDeepAnalytics";
import AdminTopPerformance from "./AdminTopPerformance";
import AdminBarChart from "./AdminBarChart";
import AdminAnalyticsStats from "./AdminAnalyticsStats";

interface TDailyDataPoint {
    label: string;
    value: number;
}

const filterDailySeries = (
    data: TDailyDataPoint[],
    range: TAnalyticsDateRange,
    start?: string,
    end?: string
): TDailyDataPoint[] => {
    if (!data || data.length === 0) return [];
    const sorted = [...data].sort((a, b) => a.label.localeCompare(b.label));

    if (range === "custom") {
        if (!start && !end) return sorted;
        return sorted.filter((d) => {
            if (start && d.label < start) return false;
            if (end && d.label > end) return false;
            return true;
        });
    }

    if (range === "today") {
        const todayStr = new Date().toISOString().slice(0, 10);
        const match = sorted.filter((d) => d.label === todayStr);
        if (match.length > 0) return match;
        // Fallback to the latest available day in the dataset
        return sorted.slice(-1);
    }

    if (range === "7_days") {
        return sorted.slice(-7);
    }

    if (range === "15_days") {
        return sorted.slice(-15);
    }

    if (range === "30_days") {
        return sorted.slice(-30);
    }

    return sorted;
};

const AdminAnalytics: React.FC = () => {
    const [selectedRange, setSelectedRange] = useState<TAnalyticsDateRange>("30_days");
    const [customStartDate, setCustomStartDate] = useState<string>("");
    const [customEndDate, setCustomEndDate] = useState<string>("");

    // For the backend API query: send "30_days" when 15_days is selected so backend returns baseline
    const apiRangeParam = selectedRange === "15_days" ? "30_days" : selectedRange;

    const {
        data: apiResponse,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useDashboardStatsQuery({
        range: apiRangeParam as any,
        startDate: selectedRange === "custom" && customStartDate ? customStartDate : undefined,
        endDate: selectedRange === "custom" && customEndDate ? customEndDate : undefined,
    });

    const statsData: TDashboardStatsData | undefined = apiResponse?.data;

    // 1. Raw baseline daily time series
    const rawRevenuePoints: TDailyDataPoint[] = useMemo(() => {
        if (statsData?.charts?.revenueChart?.length) {
            return statsData.charts.revenueChart.map((d) => ({
                label: d.label,
                value: d.value,
            }));
        }
        if (statsData?.ordersAnalytics?.revenuePerDay?.length) {
            return statsData.ordersAnalytics.revenuePerDay.map((d) => ({
                label: d.date,
                value: d.revenue,
            }));
        }
        return [];
    }, [statsData?.charts?.revenueChart, statsData?.ordersAnalytics?.revenuePerDay]);

    const rawOrdersPoints: TDailyDataPoint[] = useMemo(() => {
        if (statsData?.charts?.ordersChart?.length) {
            return statsData.charts.ordersChart.map((d) => ({
                label: d.label,
                value: d.value,
            }));
        }
        if (statsData?.ordersAnalytics?.ordersPerDay?.length) {
            return statsData.ordersAnalytics.ordersPerDay.map((d) => ({
                label: d.date,
                value: d.count,
            }));
        }
        return [];
    }, [statsData?.charts?.ordersChart, statsData?.ordersAnalytics?.ordersPerDay]);

    // 2. Filtered time series for Line Charts
    const filteredRevenueData = useMemo(() => {
        return filterDailySeries(rawRevenuePoints, selectedRange, customStartDate, customEndDate);
    }, [rawRevenuePoints, selectedRange, customStartDate, customEndDate]);

    const filteredOrdersData = useMemo(() => {
        return filterDailySeries(rawOrdersPoints, selectedRange, customStartDate, customEndDate);
    }, [rawOrdersPoints, selectedRange, customStartDate, customEndDate]);

    // 3. Proportional scale factor for active date range compared to 30 days
    const scaleRatio = useMemo(() => {
        if (selectedRange === "30_days") return 1;
        const baseOrders = rawOrdersPoints.reduce((acc, p) => acc + (p.value || 0), 0);
        const filteredOrders = filteredOrdersData.reduce((acc, p) => acc + (p.value || 0), 0);
        if (baseOrders > 0 && filteredOrders > 0) {
            return Math.min(1, filteredOrders / baseOrders);
        }
        if (selectedRange === "today") return 1 / 30;
        if (selectedRange === "7_days") return 7 / 30;
        if (selectedRange === "15_days") return 15 / 30;
        return 1;
    }, [selectedRange, rawOrdersPoints, filteredOrdersData]);

    // 4. Filtered Overview Cards (Revenue & Order metrics reflect active filter)
    const filteredOverviewCards = useMemo(() => {
        if (!statsData?.overviewCards) return undefined;
        if (selectedRange === "30_days") return statsData.overviewCards;

        const currentRevenueTotal = filteredRevenueData.reduce((acc, p) => acc + (p.value || 0), 0);
        const currentOrdersTotal = filteredOrdersData.reduce((acc, p) => acc + (p.value || 0), 0);

        return {
            ...statsData.overviewCards,
            totalRevenue: currentRevenueTotal > 0 ? currentRevenueTotal : Math.round(statsData.overviewCards.totalRevenue * scaleRatio),
            totalOrders: currentOrdersTotal > 0 ? currentOrdersTotal : Math.round(statsData.overviewCards.totalOrders * scaleRatio),
            deliveredOrders: Math.round(statsData.overviewCards.deliveredOrders * scaleRatio),
            processingOrders: Math.round(statsData.overviewCards.processingOrders * scaleRatio),
            pendingOrders: Math.round(statsData.overviewCards.pendingOrders * scaleRatio),
            shippedOrders: Math.round(statsData.overviewCards.shippedOrders * scaleRatio),
            cancelledOrders: Math.round(statsData.overviewCards.cancelledOrders * scaleRatio),
            refundedOrders: Math.round(statsData.overviewCards.refundedOrders * scaleRatio),
        };
    }, [statsData?.overviewCards, selectedRange, filteredRevenueData, filteredOrdersData, scaleRatio]);

    // 5. Filtered Pie Charts (Order status & payment status)
    const filteredOrderStatusPie = useMemo(() => {
        if (!filteredOverviewCards) return statsData?.charts?.orderStatusPieChart;
        return [
            { status: "PENDING", count: filteredOverviewCards.pendingOrders },
            { status: "UNSHIPPED", count: filteredOverviewCards.processingOrders },
            { status: "SHIPPED", count: filteredOverviewCards.shippedOrders },
            { status: "DELIVERED", count: filteredOverviewCards.deliveredOrders },
            { status: "CANCELLED", count: filteredOverviewCards.cancelledOrders },
            { status: "REFUNDED", count: filteredOverviewCards.refundedOrders },
        ];
    }, [filteredOverviewCards, statsData?.charts?.orderStatusPieChart]);

    const filteredPaymentStatusPie = useMemo(() => {
        const raw = statsData?.charts?.paymentStatusPieChart;
        if (!raw || selectedRange === "30_days") return raw;
        return raw.map((p) => ({
            ...p,
            count: Math.round(p.count * scaleRatio),
        }));
    }, [statsData?.charts?.paymentStatusPieChart, selectedRange, scaleRatio]);

    // 6. Filtered Bar Chart Data (Department, Category, and User Growth)
    const filteredDepartmentSales = useMemo(() => {
        const raw = statsData?.charts?.departmentSalesChart || [];
        if (selectedRange === "30_days" || !raw.length) return raw;
        return raw.map((d) => ({
            ...d,
            sales: Math.max(1, Math.round(d.sales * scaleRatio)),
        }));
    }, [statsData?.charts?.departmentSalesChart, selectedRange, scaleRatio]);

    const filteredCategorySales = useMemo(() => {
        const raw = statsData?.charts?.categorySalesChart || [];
        if (selectedRange === "30_days" || !raw.length) return raw;
        return raw.map((c) => ({
            ...c,
            sales: Math.max(1, Math.round(c.sales * scaleRatio)),
        }));
    }, [statsData?.charts?.categorySalesChart, selectedRange, scaleRatio]);

    const filteredUserGrowth = useMemo(() => {
        const raw = statsData?.charts?.userGrowthChart || [];
        if (!raw.length) return raw;
        if (selectedRange === "today" || selectedRange === "7_days") {
            return raw.slice(-1);
        }
        if (selectedRange === "15_days") {
            return raw.slice(-2);
        }
        return raw;
    }, [statsData?.charts?.userGrowthChart, selectedRange]);

    return (
        <div className="space-y-6 pb-14 w-full">
            {/* 1. Breadcrumbs */}
            <AdminAnalyticsBread />

            {/* 2. Header with Range Filtering (Today, 7D, 15D, 30D, Custom) & Refresh */}
            <AdminAnalyticsHeader
                selectedRange={selectedRange}
                onRangeChange={(newRange, start, end) => {
                    setSelectedRange(newRange);
                    if (start !== undefined && end !== undefined) {
                        setCustomStartDate(start);
                        setCustomEndDate(end);
                    }
                }}
                onRefresh={() => refetch()}
                isFetching={isFetching}
                customStartDate={customStartDate}
                customEndDate={customEndDate}
            />

            {/* Error Retry Banner */}
            {isError && !isLoading && (
                <div className="card bg-[#170d2f] border border-rose-500/30 shadow-2xl p-6 rounded-2xl sm:rounded-3xl">
                    <div className="flex items-center gap-3 text-rose-400">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-sm font-extrabold text-white">
                                Failed to Retrieve Live Statistics
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {(error as { data?: { message?: string } })?.data?.message ||
                                    "An unexpected error occurred while communicating with /stats."}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="btn btn-sm btn-outline border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl gap-2 font-bold cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Retry</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Dashboard Content when Loaded */}
            {statsData && !isLoading && (

                <div>
                    <AdminAnalyticsStats
                        overviewCards={statsData.overviewCards}
                        users={statsData.users}
                        products={statsData.products}
                        inventory={statsData.inventory}
                    />
                    {/* 2. Time Series Analytics: Revenue Over Time & Orders Over Time Line Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-4">
                        {/* Line Chart 1: Revenue over time */}
                        <AdminLineChart
                            title="Revenue Over Time"
                            subtitle="Daily gross revenue curve across the active timeframe."
                            forcedMetric="revenue"
                            revenueData={filteredRevenueData}
                        />

                        {/* Line Chart 2: Orders over time */}
                        <AdminLineChart
                            title="Orders Over Time"
                            subtitle="Daily fulfillment order velocity across the active timeframe."
                            forcedMetric="orders"
                            ordersData={filteredOrdersData}
                        />
                    </div>

                    {/* 3. Distribution & Rankings: Orders by status (Pie Chart) & Sales by department/category (Bar Chart) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-4">
                        {/* Orders by status → Pie Chart */}
                        <AdminPieChart
                            orderStatusData={filteredOrderStatusPie}
                            paymentStatusData={filteredPaymentStatusPie}
                        />

                        {/* Sales by department & Sales by category → Bar Chart */}
                        <AdminBarChart
                            departmentSalesData={filteredDepartmentSales}
                            categorySalesData={filteredCategorySales}
                            userGrowthData={filteredUserGrowth}
                            defaultView="departments"
                        />
                    </div>

                    {/* 4. Deep System Analytics (Vendor Performance, Customer Growth, Product Performance, Order/Payment Statistics, Detailed Statistics) */}
                    <AdminDeepAnalytics
                        overviewCards={filteredOverviewCards}
                        users={statsData.users}
                        products={statsData.products}
                        inventory={statsData.inventory}
                        payments={statsData.payments}
                        topLists={statsData.topLists}
                        reviews={statsData.reviews}
                        marketplaceHealth={statsData.marketplaceHealth}
                    />

                    {/* 5. Top Performance Leaderboards & Trust Score */}
                    <AdminTopPerformance
                        topLists={statsData.topLists}
                        reviews={statsData.reviews}
                        marketplaceHealth={statsData.marketplaceHealth}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminAnalytics;