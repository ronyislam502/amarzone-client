"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import { useAllOrdersQuery } from "@/redux/features/order/orderApi";
import { useAllProductsQuery } from "@/redux/features/product/productApi";
import { useAllCustomersQuery } from "@/redux/features/customer/customerApi";
import { useAllVendorsQuery } from "@/redux/features/vendor/vendorApi";
import { useAllAdminsQuery } from "@/redux/features/admin/adminApi";
import {
    TDashboardDateRange,
    TDashboardInventory,
    TDashboardMarketplaceHealth,
    TDashboardOverviewCards,
    TDashboardProducts,
    TDashboardReviews,
    TDashboardStatsData,
    TDashboardUsers,
    TRecentOrder,
} from "@/types/dashboard";
import { TOrder } from "@/types/order";
import { TCustomer } from "@/types/customer";
import { TVendor } from "@/types/vendor";
import { TAdmin } from "@/types/admin";
import AdminOverviewBread from "./AdminOverviewBread";
import AdminOverviewHeader from "./AdminOverviewHeader";
import EntityCountersGrid from "./EntityCountersGrid";
import PendingOrdersBanner from "./PendingOrdersBanner";
import AdminQuickStats from "./AdminQuickStats";
import ConciseChartsRow from "./ConciseChartsRow";
import RecentOrdersTable from "./RecentOrdersTable";
import AdminOverviewStats from "./AdminOverviewStats";
import DashboardOverviewSkeleton from "@/components/shared/skeleton/DashboardOverviewSkeleton";

const AdminOverview: React.FC = () => {
    const [selectedRange, setSelectedRange] = useState<TDashboardDateRange>("30_days");

    // 1. Query dashboard aggregate statistics from backend /dashboard/stats API
    const {
        data: apiResponse,
        isLoading: statsLoading,
        refetch: refetchStats,
        isFetching: statsFetching,
    } = useDashboardStatsQuery({ range: selectedRange });

    // 2. Fetch live database orders (for exact real commission, status breakdown, and recent orders)
    const {
        data: ordersResponse,
        isLoading: ordersLoading,
        refetch: refetchOrders,
        isFetching: ordersFetching,
    } = useAllOrdersQuery({ limit: 100, sort: "-createdAt" });

    // 3. Fetch live products from database
    const {
        data: productsResponse,
        isLoading: productsLoading,
        refetch: refetchProducts,
        isFetching: productsFetching,
    } = useAllProductsQuery({ limit: 100 });

    // 4. Fetch live customers from database
    const {
        data: customersResponse,
        isLoading: customersLoading,
        refetch: refetchCustomers,
        isFetching: customersFetching,
    } = useAllCustomersQuery({ limit: 100 });

    // 5. Fetch live vendors from database
    const {
        data: vendorsResponse,
        isLoading: vendorsLoading,
        refetch: refetchVendors,
        isFetching: vendorsFetching,
    } = useAllVendorsQuery({ limit: 100 });

    // 6. Fetch live admins from database
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

    // Extract database items
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

    // Calculate real database financial metrics
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

    // Marketplace commission: use backend if present, otherwise compute exact real database commission
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

    // Real database order status counts
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
    const totalProductsCount =
        statsData?.products?.totalProducts ?? productsResponse?.meta?.total ?? products.length;
    const activeProductsCount =
        statsData?.products?.activeProducts ??
        products.filter((p: any) => p.status === "ACTIVE" || !p.isDeleted).length;

    const finalProducts: TDashboardProducts = {
        totalProducts: totalProductsCount,
        activeProducts: activeProductsCount,
        inactiveProducts: statsData?.products?.inactiveProducts ?? 0,
        outOfStockProducts: statsData?.products?.outOfStockProducts ?? 0,
        bestSellerProducts: statsData?.products?.bestSellerProducts ?? 0,
        categoriesCount: statsData?.products?.categoriesCount ?? 0,
        brandsCount: statsData?.products?.brandsCount ?? 0,
    };

    // Inventory, reviews, and health
    const finalInventory: TDashboardInventory = statsData?.inventory ?? {
        totalInventory: 0,
        lowStockProducts: 0,
        outOfStockInventory: 0,
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

    // Recent orders from database
    const recentOrdersList: TRecentOrder[] = useMemo(() => {
        if (
            statsData?.recentActivities?.recentOrders &&
            statsData.recentActivities.recentOrders.length > 0
        ) {
            return statsData.recentActivities.recentOrders;
        }
        return orders.slice(0, 10).map((o) => ({
            _id: o._id,
            orderNo: o.orderNo,
            totalPrice: o.totalPrice,
            status: o.status,
            paymentStatus: o.paymentStatus,
            createdAt: o.createdAt ? String(o.createdAt) : undefined,
            customer: {
                _id: typeof o.customer === "object" ? o.customer?._id : undefined,
                name: typeof o.customer === "object" ? (o.customer as any)?.name : undefined,
                email: typeof o.customer === "object" ? (o.customer as any)?.email : undefined,
            },
            vendor: {
                _id: typeof o.vendor === "object" ? o.vendor?._id : undefined,
                name: typeof o.vendor === "object" ? (o.vendor as any)?.name : undefined,
                email: typeof o.vendor === "object" ? (o.vendor as any)?.email : undefined,
            },
        }));
    }, [statsData?.recentActivities?.recentOrders, orders]);

    // Daily orders chart points
    const chartOrders = useMemo(() => {
        if (statsData?.charts?.ordersChart && statsData.charts.ordersChart.length > 0) {
            return statsData.charts.ordersChart;
        }
        if (
            statsData?.ordersAnalytics?.ordersPerDay &&
            statsData.ordersAnalytics.ordersPerDay.length > 0
        ) {
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

    // Daily revenue chart points
    const chartRevenue = useMemo(() => {
        if (statsData?.charts?.revenueChart && statsData.charts.revenueChart.length > 0) {
            return statsData.charts.revenueChart;
        }
        if (
            statsData?.ordersAnalytics?.revenuePerDay &&
            statsData.ordersAnalytics.revenuePerDay.length > 0
        ) {
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

    // Order status distribution pie
    const chartOrderStatus = useMemo(() => {
        if (
            statsData?.charts?.orderStatusPieChart &&
            statsData.charts.orderStatusPieChart.length > 0
        ) {
            return statsData.charts.orderStatusPieChart;
        }
        const statuses = [
            { status: "DELIVERED", count: finalOverviewCards.deliveredOrders },
            { status: "PROCESSING", count: finalOverviewCards.processingOrders },
            { status: "SHIPPED", count: finalOverviewCards.shippedOrders },
            { status: "PENDING", count: finalOverviewCards.pendingOrders },
            { status: "CANCELLED", count: finalOverviewCards.cancelledOrders },
            { status: "REFUNDED", count: finalOverviewCards.refundedOrders },
        ];
        return statuses.filter((s) => s.count > 0);
    }, [statsData?.charts?.orderStatusPieChart, finalOverviewCards]);

    // Category sales bar chart
    const chartCategorySales = useMemo(() => {
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
                category: c.categoryName || c.name || c.category || "Unassigned",
                sales: Number(c.totalQuantity ?? c.sales ?? c.count ?? 0),
            }));
        }
        return [];
    }, [statsData?.charts?.categorySalesChart, statsData?.topLists?.topSellingCategories]);

    return (
        <div className="space-y-6 pb-14 w-full">
            {/* 1. Breadcrumbs */}
            <AdminOverviewBread />

            {/* 2. Header with Range Filter, Refresh & Deep Analytics Link */}
            <AdminOverviewHeader
                selectedRange={selectedRange}
                onRangeChange={(newRange) => setSelectedRange(newRange)}
                onRefresh={handleRefreshAll}
                isFetching={isPageFetching}
                socketConnected={false}
                stats={statsData}
            />

            {/* Loading Skeleton */}
            {isPageLoading ? (
                <DashboardOverviewSkeleton />
            ) : (
                <Suspense fallback={<DashboardOverviewSkeleton />}>
                    {/* 3. Total Revenue: Gross Revenue, Commission, and Net Vendor Disbursals */}
                    <AdminOverviewStats overviewCards={finalOverviewCards} />

                    {/* 4. Entity Counters: Users, Vendors, Customers, Products, Orders */}
                    <EntityCountersGrid
                        users={finalUsers}
                        products={finalProducts}
                        overviewCards={finalOverviewCards}
                    />

                    {/* 5. Pending Orders Spotlight & Fulfillment Pipeline */}
                    <PendingOrdersBanner overviewCards={finalOverviewCards} />

                    {/* 6. Quick Statistics (Low Stock, Customer Rating, Disputes, SLA) */}
                    <AdminQuickStats
                        inventory={finalInventory}
                        reviews={finalReviews}
                        marketplaceHealth={finalHealth}
                        overviewCards={finalOverviewCards}
                    />

                    {/* 7. Concise Charts (Daily Trend Line, Donut Distribution, Category Bars) */}
                    <ConciseChartsRow
                        ordersData={chartOrders}
                        revenueData={chartRevenue}
                        orderStatusData={chartOrderStatus}
                        categorySalesData={chartCategorySales}
                    />

                    {/* 8. Recent Orders Activity Table */}
                    <div className="w-full">
                        <RecentOrdersTable orders={recentOrdersList} isLoading={ordersLoading} />
                    </div>
                </Suspense>
            )}
        </div>
    );
};

export default AdminOverview;
