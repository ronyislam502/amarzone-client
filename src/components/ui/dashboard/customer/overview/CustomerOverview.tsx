"use client";

import React, { Suspense, useState } from "react";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import { useMyOrdersQuery } from "@/redux/features/order/orderApi";
import { useMyProfileQuery } from "@/redux/features/user/userApi";
import { TDashboardDateRange } from "@/types/dashboard";
import { TOrder } from "@/types/order";
import CustomerOverviewBread from "./CustomerOverviewBread";
import CustomerOverviewHeader from "./CustomerOverviewHeader";
import CustomerOverviewStats from "./CustomerOverviewStats";
import CustomerOverviewCharts from "./CustomerOverviewCharts";
import CustomerOverviewActivity from "./CustomerOverviewActivity";
import CustomerRecentOrders from "./CustomerRecentOrders";
import CustomerDeliveryAlerts from "./CustomerDeliveryAlerts";
import DashboardOverviewSkeleton from "@/components/shared/skeleton/DashboardOverviewSkeleton";

export const CustomerOverview: React.FC = () => {
    const [selectedRange, setSelectedRange] = useState<TDashboardDateRange>("30_days");

    // 1. Fetch live customer orders from database
    const {
        data: ordersResponse,
        isLoading: ordersLoading,
        refetch: refetchOrders,
        isFetching: ordersFetching,
    } = useMyOrdersQuery({ limit: 100 });

    // 2. Fetch authenticated customer profile
    const {
        data: profileResponse,
        isLoading: profileLoading,
        refetch: refetchProfile,
        isFetching: profileFetching,
    } = useMyProfileQuery({});

    // 3. Optional aggregated stats (fallback gracefully if not customer role)
    const {
        data: statsResponse,
        isLoading: statsLoading,
        isError: statsError,
        error: statsErrorObj,
        refetch: refetchStats,
        isFetching: statsFetching,
    } = useDashboardStatsQuery({ range: selectedRange });

    const orders: TOrder[] = (ordersResponse?.data as TOrder[]) || [];
    const userProfile = profileResponse?.data;
    const userName = userProfile?.name || userProfile?.email?.split("@")[0];

    const isPageLoading = ordersLoading || profileLoading;
    const isPageFetching = ordersFetching || profileFetching || statsFetching;

    const handleRefreshAll = () => {
        refetchOrders();
        refetchProfile();
        refetchStats();
    };

    // Calculate aggregated expenditure from verified orders
    const computedSpent = orders.reduce((sum, o) => {
        const amount = Number(o.totalPrice ?? 0);
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const computedTotalOrders = ordersResponse?.meta?.total ?? orders.length;

    const computedDeliveredOrders = orders.filter(
        (o) => (o.status || "").toUpperCase() === "DELIVERED"
    ).length;

    const computedInTransitOrders = orders.filter((o) => {
        const s = (o.status || "").toUpperCase();
        return (
            s === "SHIPPED" ||
            s === "IN_TRANSIT" ||
            s === "OUT_OF_DELIVERY" ||
            s === "PROCESSING"
        );
    }).length;

    const computedPendingOrders = orders.filter(
        (o) => (o.status || "").toUpperCase() === "PENDING"
    ).length;

    return (
        <div className="space-y-6 pb-14 w-full">
            {/* 1. Breadcrumbs */}
            <CustomerOverviewBread />

            {/* 2. Header with Date Range Selector, Action Links, and Refresh */}
            <CustomerOverviewHeader
                selectedRange={selectedRange}
                onRangeChange={(newRange) => setSelectedRange(newRange)}
                onRefresh={handleRefreshAll}
                isFetching={isPageFetching}
                userName={userName}
            />

            {/* Loading Skeleton */}
            {isPageLoading && <DashboardOverviewSkeleton />}

            {/* Main Sections wrapped in Suspense */}
            {!isPageLoading && (
                <Suspense fallback={<DashboardOverviewSkeleton />}>
                    {/* 3. Primary KPI Cards & Action Logistics Strip */}
                    <CustomerOverviewStats
                        totalSpent={computedSpent}
                        totalOrders={computedTotalOrders}
                        deliveredOrders={computedDeliveredOrders}
                        inTransitOrders={computedInTransitOrders}
                        pendingOrders={computedPendingOrders}
                        orders={orders}
                        isLoading={isPageLoading}
                        showActionStrip={true}
                    />

                    {/* 4. Chart Row: Purchase Velocity (AZLineChart) & Fulfillment Distribution (AZPieChart) */}
                    <CustomerOverviewCharts
                        orders={orders}
                        isLoading={isPageLoading}
                    />

                    {/* 5. Account Standing & Buyer Trust Index + Expenditure Hub */}
                    <CustomerOverviewActivity
                        orders={orders}
                        totalSpent={computedSpent}
                        isLoading={isPageLoading}
                    />

                    {/* 6. Lower Operational Section: Recent Purchases & Active Deliveries Tracker */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        {/* Left (7 cols): Recent Purchases Table */}
                        <div className="lg:col-span-7 flex flex-col">
                            <CustomerRecentOrders orders={orders} isLoading={ordersLoading} />
                        </div>

                        {/* Right (5 cols): Active Courier Shipments Watchlist */}
                        <div className="lg:col-span-5 flex flex-col">
                            <CustomerDeliveryAlerts orders={orders} isLoading={ordersLoading} />
                        </div>
                    </div>
                </Suspense>
            )}
        </div>
    );
};

export default CustomerOverview;
