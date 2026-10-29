"use client";

import React, { useState, useMemo, Suspense } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import { useAllOrdersQuery } from "@/redux/features/order/orderApi";
import { useAllProductsQuery } from "@/redux/features/product/productApi";
import { useAllCustomersQuery } from "@/redux/features/customer/customerApi";
import { useAllVendorsQuery } from "@/redux/features/vendor/vendorApi";
import { useAllAdminsQuery } from "@/redux/features/admin/adminApi";
import {
    TDashboardInventory,
    TDashboardMarketplaceHealth,
    TDashboardOverviewCards,
    TDashboardPayments,
    TDashboardProducts,
    TDashboardReviews,
    TDashboardStatsData,
    TDashboardUsers,
} from "@/types/dashboard";
import { TOrder } from "@/types/order";
import { TCustomer } from "@/types/customer";
import { TVendor } from "@/types/vendor";
import { TAdmin } from "@/types/admin";
import AdminAnalyticsBread from "./AdminAnalyticsBread";
import AdminAnalyticsHeader, { TAnalyticsDateRange } from "./AdminAnalyticsHeader";
import AdminLineChart from "./AdminLineChart";
import AdminPieChart from "./AdminPieChart";
import AdminDeepAnalytics from "./AdminDeepAnalytics";
import AdminTopPerformance from "./AdminTopPerformance";
import AdminBarChart from "./AdminBarChart";
import AdminAnalyticsStats from "./AdminAnalyticsStats";
import DashboardAnalyticsSkeleton from "@/components/shared/skeleton/DashboardAnalyticsSkeleton";

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

    const apiRangeParam = selectedRange === "15_days" ? "30_days" : selectedRange;

    // 1. Backend aggregate statistics
    const {
        data: apiResponse,
        isLoading: statsLoading,
        isError: statsError,
        error: statsErrorObj,
        refetch: refetchStats,
        isFetching: statsFetching,
    } = useDashboardStatsQuery({
        range: apiRangeParam as any,
        startDate: selectedRange === "custom" && customStartDate ? customStartDate : undefined,
        endDate: selectedRange === "custom" && customEndDate ? customEndDate : undefined,
    });

    // 2. Live database orders
    const {
        data: ordersResponse,
        isLoading: ordersLoading,
        refetch: refetchOrders,
        isFetching: ordersFetching,
    } = useAllOrdersQuery({ limit: 100, sort: "-createdAt" });

    // 3. Live database products
    const {
        data: productsResponse,
        isLoading: productsLoading,
        refetch: refetchProducts,
        isFetching: productsFetching,
    } = useAllProductsQuery({ limit: 100 });

    // 4. Live database customers
    const {
        data: customersResponse,
        isLoading: customersLoading,
        refetch: refetchCustomers,
        isFetching: customersFetching,
    } = useAllCustomersQuery({ limit: 100 });

    // 5. Live database vendors
    const {
        data: vendorsResponse,
        isLoading: vendorsLoading,
        refetch: refetchVendors,
        isFetching: vendorsFetching,
    } = useAllVendorsQuery({ limit: 100 });

    // 6. Live database admins
    const {
        data: adminsResponse,
        isLoading: adminsLoading,
        refetch: refetchAdmins,
        isFetching: adminsFetching,
    } = useAllAdminsQuery({ limit: 100 });

    const handleRefreshAll = () => {
        refetchStats();
        refetchOrders();
        refetchProducts();
        refetchCustomers();
        refetchVendors();
        refetchAdmins();
    };

    const isPageLoading = statsLoading || ordersLoading;
    const isPageFetching =
        statsFetching ||
        ordersFetching ||
        productsFetching ||
        customersFetching ||
        vendorsFetching ||
        adminsFetching;

    // Safely parse statsData from API response
    const rawStats = apiResponse?.data?.data || apiResponse?.data || apiResponse;
    const statsData: TDashboardStatsData | undefined =
        rawStats && typeof rawStats === "object" && ("overviewCards" in rawStats || "users" in rawStats)
            ? (rawStats as TDashboardStatsData)
            : undefined;

    // Extract real database arrays
    const orders: TOrder[] = Array.isArray(ordersResponse?.data)
        ? ordersResponse.data
        : (ordersResponse?.data as any)?.data || [];

    const products: any[] = Array.isArray(productsResponse?.data)
        ? productsResponse.data
        : (productsResponse?.data as any)?.data || [];

    const customers: TCustomer[] = Array.isArray(customersResponse?.data)
        ? customersResponse.data
        : (customersResponse?.data as any)?.data || [];

    const vendors: TVendor[] = Array.isArray(vendorsResponse?.data)
        ? vendorsResponse.data
        : (vendorsResponse?.data as any)?.data || [];

    const admins: TAdmin[] = Array.isArray(adminsResponse?.data)
        ? adminsResponse.data
        : (adminsResponse?.data as any)?.data || [];

    // Financial calculations directly from real database records
    const paidOrders = orders.filter(
        (o) => (o.paymentStatus || "").toUpperCase() === "PAID"
    );

    const dbGrossRevenue = paidOrders.reduce((sum, o) => {
        const val = Number(o.totalPrice ?? 0);
        return sum + (isNaN(val) ? 0 : val);
    }, 0);

    const dbCommission = paidOrders.reduce((sum, o) => {
        const val = Number(o.commission ?? 0);
        return sum + (isNaN(val) ? 0 : val);
    }, 0);

    const finalGrossRevenue = statsData?.overviewCards?.totalRevenue ?? dbGrossRevenue;

    const finalMarketplaceCommission =
        statsData?.overviewCards?.marketplaceCommission !== undefined
            ? statsData.overviewCards.marketplaceCommission
            : dbCommission;

    const finalVendorEarnings =
        statsData?.overviewCards?.vendorEarnings !== undefined
            ? statsData.overviewCards.vendorEarnings
            : Math.max(finalGrossRevenue - finalMarketplaceCommission, 0);

    const finalTotalOrders =
        statsData?.overviewCards?.totalOrders ?? ordersResponse?.meta?.total ?? orders.length;

    // Order status counts from database
    const dbPendingOrders = orders.filter(
        (o) => (o.status || "").toUpperCase() === "PENDING"
    ).length;

    const dbProcessingOrders = orders.filter((o) => {
        const s = (o.status || "").toUpperCase();
        return s === "UNSHIPPED" || s === "PROCESSING";
    }).length;

    const dbShippedOrders = orders.filter(
        (o) => (o.status || "").toUpperCase() === "SHIPPED"
    ).length;

    const dbDeliveredOrders = orders.filter(
        (o) => (o.status || "").toUpperCase() === "DELIVERED"
    ).length;

    const dbCancelledOrders = orders.filter(
        (o) => (o.status || "").toUpperCase() === "CANCELLED"
    ).length;

    const dbRefundedOrders = orders.filter(
        (o) =>
            (o.status || "").toUpperCase() === "REFUNDED" ||
            (o.paymentStatus || "").toUpperCase() === "REFUNDED"
    ).length;

    const finalOverviewCards: TDashboardOverviewCards = {
        totalRevenue: finalGrossRevenue,
        marketplaceCommission: finalMarketplaceCommission,
        vendorEarnings: finalVendorEarnings,
        totalOrders: finalTotalOrders,
        todayOrders: statsData?.overviewCards?.todayOrders ?? 0,
        pendingOrders: statsData?.overviewCards?.pendingOrders ?? dbPendingOrders,
        processingOrders: statsData?.overviewCards?.processingOrders ?? dbProcessingOrders,
        shippedOrders: statsData?.overviewCards?.shippedOrders ?? dbShippedOrders,
        deliveredOrders: statsData?.overviewCards?.deliveredOrders ?? dbDeliveredOrders,
        cancelledOrders: statsData?.overviewCards?.cancelledOrders ?? dbCancelledOrders,
        refundedOrders: statsData?.overviewCards?.refundedOrders ?? dbRefundedOrders,
    };

    // User counts
    const totalCustomersCount =
        statsData?.users?.totalCustomers ?? customersResponse?.meta?.total ?? customers.length;
    const totalVendorsCount =
        statsData?.users?.totalVendors ?? vendorsResponse?.meta?.total ?? vendors.length;
    const totalAdminsCount = adminsResponse?.meta?.total ?? admins.length;
    const totalUsersCount =
        statsData?.users?.totalUsers ??
        totalCustomersCount + totalVendorsCount + totalAdminsCount;

    const activeVendorsCount =
        statsData?.users?.activeVendors ??
        vendors.filter(
            (v: any) =>
                v.status === "ACTIVE" || v.status === "APPROVED" || !v.isBlocked
        ).length;

    const suspendedVendorsCount =
        statsData?.users?.suspendedVendors ??
        vendors.filter(
            (v: any) =>
                v.status === "SUSPENDED" || v.status === "BANNED" || v.isBlocked
        ).length;

    const finalUsers: TDashboardUsers = {
        totalUsers: totalUsersCount,
        totalCustomers: totalCustomersCount,
        totalVendors: totalVendorsCount,
        activeVendors: activeVendorsCount,
        suspendedVendors: suspendedVendorsCount,
        blockedUsers: statsData?.users?.blockedUsers ?? 0,
        newUsersThisMonth: statsData?.users?.newUsersThisMonth ?? 0,
    };

    // Product counts
    const finalProducts: TDashboardProducts = {
        totalProducts:
            statsData?.products?.totalProducts ?? productsResponse?.meta?.total ?? products.length,
        activeProducts:
            statsData?.products?.activeProducts ??
            products.filter((p: any) => p.status === "ACTIVE" || !p.isDeleted).length,
        inactiveProducts: statsData?.products?.inactiveProducts ?? 0,
        outOfStockProducts: statsData?.products?.outOfStockProducts ?? 0,
        bestSellerProducts: statsData?.products?.bestSellerProducts ?? 0,
        categoriesCount: statsData?.products?.categoriesCount ?? 0,
        brandsCount: statsData?.products?.brandsCount ?? 0,
    };

    // Inventory, Payments, Reviews, Health
    const finalInventory: TDashboardInventory = statsData?.inventory ?? {
        totalInventory: 0,
        lowStockProducts: 0,
        outOfStockInventory: 0,
    };

    const finalPayments: TDashboardPayments = statsData?.payments ?? {
        totalSuccessfulPayments: paidOrders.length,
        pendingPayments: orders.filter((o) => (o.paymentStatus || "").toUpperCase() === "UNPAID").length,
        failedPayments: 0,
        refundedPayments: dbRefundedOrders,
    };

    const finalReviews: TDashboardReviews = statsData?.reviews ?? {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: {},
    };

    const finalHealth: TDashboardMarketplaceHealth = statsData?.marketplaceHealth ?? {
        activeSlaViolations: 0,
        suspendedVendors: suspendedVendorsCount,
        fraudAlerts: 0,
        openDisputes: 0,
        pendingRefunds: 0,
    };

    // 1. Raw baseline daily time series from database
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
        if (orders.length > 0) {
            const map = new Map<string, number>();
            orders.forEach((o) => {
                if (o.createdAt && (o.paymentStatus || "").toUpperCase() === "PAID") {
                    const day = new Date(o.createdAt).toISOString().split("T")[0];
                    map.set(day, (map.get(day) || 0) + Number(o.totalPrice || 0));
                }
            });
            return Array.from(map.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([label, value]) => ({
                    label,
                    value: Math.round(value * 100) / 100,
                }));
        }
        return [];
    }, [statsData?.charts?.revenueChart, statsData?.ordersAnalytics?.revenuePerDay, orders]);

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
        if (orders.length > 0) {
            const map = new Map<string, number>();
            orders.forEach((o) => {
                if (o.createdAt) {
                    const day = new Date(o.createdAt).toISOString().split("T")[0];
                    map.set(day, (map.get(day) || 0) + 1);
                }
            });
            return Array.from(map.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([label, value]) => ({ label, value }));
        }
        return [];
    }, [statsData?.charts?.ordersChart, statsData?.ordersAnalytics?.ordersPerDay, orders]);

    // 2. Filtered time series for Line Charts
    const filteredRevenueData = useMemo(() => {
        return filterDailySeries(rawRevenuePoints, selectedRange, customStartDate, customEndDate);
    }, [rawRevenuePoints, selectedRange, customStartDate, customEndDate]);

    const filteredOrdersData = useMemo(() => {
        return filterDailySeries(rawOrdersPoints, selectedRange, customStartDate, customEndDate);
    }, [rawOrdersPoints, selectedRange, customStartDate, customEndDate]);

    // 3. Filtered Pie Charts (Order status & payment status)
    const filteredOrderStatusPie = useMemo(() => {
        if (
            statsData?.charts?.orderStatusPieChart &&
            statsData.charts.orderStatusPieChart.length > 0
        ) {
            return statsData.charts.orderStatusPieChart;
        }
        const list = [
            { status: "DELIVERED", count: finalOverviewCards.deliveredOrders },
            { status: "PROCESSING", count: finalOverviewCards.processingOrders },
            { status: "SHIPPED", count: finalOverviewCards.shippedOrders },
            { status: "PENDING", count: finalOverviewCards.pendingOrders },
            { status: "CANCELLED", count: finalOverviewCards.cancelledOrders },
            { status: "REFUNDED", count: finalOverviewCards.refundedOrders },
        ];
        return list.filter((item) => item.count > 0);
    }, [statsData?.charts?.orderStatusPieChart, finalOverviewCards]);

    const filteredPaymentStatusPie = useMemo(() => {
        if (
            statsData?.charts?.paymentStatusPieChart &&
            statsData.charts.paymentStatusPieChart.length > 0
        ) {
            return statsData.charts.paymentStatusPieChart;
        }
        const list = [
            { status: "PAID", count: finalPayments.totalSuccessfulPayments },
            { status: "UNPAID", count: finalPayments.pendingPayments },
            { status: "REFUNDED", count: finalPayments.refundedPayments },
        ];
        return list.filter((item) => item.count > 0);
    }, [statsData?.charts?.paymentStatusPieChart, finalPayments]);

    // 4. Filtered Bar Chart Data (Department, Category, and User Growth)
    const filteredDepartmentSales = useMemo(() => {
        if (
            statsData?.charts?.departmentSalesChart &&
            statsData.charts.departmentSalesChart.length > 0
        ) {
            return statsData.charts.departmentSalesChart;
        }
        if (
            statsData?.topLists?.topSellingDepartments &&
            statsData.topLists.topSellingDepartments.length > 0
        ) {
            return statsData.topLists.topSellingDepartments.map((d: any) => ({
                department: d.departmentName || d.name || "General",
                sales: Number(d.totalQuantity ?? d.sales ?? 0),
            }));
        }
        return [];
    }, [statsData?.charts?.departmentSalesChart, statsData?.topLists?.topSellingDepartments]);

    const filteredCategorySales = useMemo(() => {
        if (
            statsData?.charts?.categorySalesChart &&
            statsData.charts.categorySalesChart.length > 0
        ) {
            return statsData.charts.categorySalesChart;
        }
        if (
            statsData?.topLists?.topSellingCategories &&
            statsData.topLists.topSellingCategories.length > 0
        ) {
            return statsData.topLists.topSellingCategories.map((c: any) => ({
                category: c.categoryName || c.name || "General",
                sales: Number(c.totalQuantity ?? c.sales ?? 0),
            }));
        }
        return [];
    }, [statsData?.charts?.categorySalesChart, statsData?.topLists?.topSellingCategories]);

    const filteredUserGrowth = useMemo(() => {
        if (
            statsData?.charts?.userGrowthChart &&
            statsData.charts.userGrowthChart.length > 0
        ) {
            return statsData.charts.userGrowthChart;
        }
        // Fallback to verified users by registration month from database
        const allUsers: any[] = [...customers, ...vendors, ...admins];
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
                return Array.from(monthMap.entries())
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([label, value]) => ({ label, value }));
            }
        }
        return [];
    }, [statsData?.charts?.userGrowthChart, customers, vendors, admins]);

    return (
        <div className="space-y-6 pb-14 w-full">
            {/* 1. Breadcrumbs */}
            <AdminAnalyticsBread />

            {/* 2. Header with Range Filtering & Refresh */}
            <AdminAnalyticsHeader
                selectedRange={selectedRange}
                onRangeChange={(newRange, start, end) => {
                    setSelectedRange(newRange);
                    if (start !== undefined && end !== undefined) {
                        setCustomStartDate(start);
                        setCustomEndDate(end);
                    }
                }}
                onRefresh={handleRefreshAll}
                isFetching={isPageFetching}
                customStartDate={customStartDate}
                customEndDate={customEndDate}
            />

            {/* Loading Skeleton */}
            {isPageLoading ? (
                <DashboardAnalyticsSkeleton />
            ) : (
                <Suspense fallback={<DashboardAnalyticsSkeleton />}>
                    <div>
                        {/* 1. Analytics KPI Summary Cards */}
                        <AdminAnalyticsStats
                            overviewCards={finalOverviewCards}
                            users={finalUsers}
                            products={finalProducts}
                            inventory={finalInventory}
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

                        {/* 4. Deep System Analytics (Vendor Performance, Customer Growth, Product Performance, Order/Payment Statistics) */}
                        <AdminDeepAnalytics
                            overviewCards={finalOverviewCards}
                            users={finalUsers}
                            products={finalProducts}
                            inventory={finalInventory}
                            payments={finalPayments}
                            topLists={statsData?.topLists}
                            reviews={finalReviews}
                            marketplaceHealth={finalHealth}
                        />

                        {/* 5. Top Performance Leaderboards & Trust Score */}
                        <AdminTopPerformance
                            topLists={statsData?.topLists}
                            reviews={finalReviews}
                            marketplaceHealth={finalHealth}
                        />
                    </div>
                </Suspense>
            )}
        </div>
    );
};

export default AdminAnalytics;
