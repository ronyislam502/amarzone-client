"use client";

import React, { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import { useMyOrdersQuery } from "@/redux/features/order/orderApi";
import { useMyInventoryQuery } from "@/redux/features/inventory/inventoryApi";
import { useGetMyHealthQuery } from "@/redux/features/health/healthApi";
import { TDashboardDateRange, TVendorDashboardData } from "@/types/dashboard";
import { TOrder } from "@/types/order";
import { TInventory } from "@/types/inventory";
import VendorOverviewBread from "./VendorOverviewBread";
import VendorOverviewHeader from "./VendorOverviewHeader";
import VendorOverviewStats from "./VendorOverviewStats";
import VendorOverviewCharts from "./VendorOverviewCharts";
import VendorOverviewHealthSales from "./VendorOverviewHealthSales";
import VendorRecentOrders from "./VendorRecentOrders";
import VendorStockAlerts from "./VendorStockAlerts";

const VendorOverview: React.FC = () => {
    const [selectedRange, setSelectedRange] = useState<TDashboardDateRange>("30_days");

    // 1. Fetch dashboard aggregated metrics from database
    const {
        data: apiResponse,
        isLoading: statsLoading,
        isError: statsError,
        error,
        refetch: refetchStats,
        isFetching: statsFetching,
    } = useDashboardStatsQuery({ range: selectedRange });

    // 2. Fetch live store orders from database (for exact status breakdown & recent table)
    const {
        data: ordersResponse,
        isLoading: ordersLoading,
        refetch: refetchOrders,
        isFetching: ordersFetching,
    } = useMyOrdersQuery({ limit: 100 });

    // 3. Fetch live inventory from database (for exact product stock counts & watchlist)
    const {
        data: inventoryResponse,
        isLoading: inventoryLoading,
        refetch: refetchInventory,
        isFetching: inventoryFetching,
    } = useMyInventoryQuery({ limit: 100 });

    // 4. Fetch live account health from database
    const {
        data: healthResponse,
        isLoading: healthLoading,
        refetch: refetchHealth,
        isFetching: healthFetching,
    } = useGetMyHealthQuery();

    const vendorStats = (apiResponse?.data || {}) as TVendorDashboardData;
    const orders: TOrder[] = (ordersResponse?.data as TOrder[]) || [];
    const rawInventory = inventoryResponse?.data;
    const inventories: TInventory[] = (
        Array.isArray(rawInventory)
            ? rawInventory
            : (rawInventory as any)?.data || []
    ) as TInventory[];
    const healthData = healthResponse?.data;

    const isPageLoading = statsLoading && ordersLoading;
    const isPageFetching = statsFetching || ordersFetching || inventoryFetching || healthFetching;

    const handleRefreshAll = () => {
        refetchStats();
        refetchOrders();
        refetchInventory();
        refetchHealth();
    };

    // Calculate aggregated revenue from database orders if backend overview hasn't populated yet
    const computedRevenue =
        vendorStats?.overview?.totalRevenue ??
        orders.reduce((sum, o) => {
            const amount = Number(
                o.vendorAmount ?? (o.totalPrice ? o.totalPrice - (o.commission || 0) : 0)
            );
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

    const computedTotalOrders =
        vendorStats?.overview?.totalOrders ?? ordersResponse?.meta?.total ?? orders.length;

    const computedDeliveredOrders = orders.filter(
        (o) => (o.status || "").toUpperCase() === "DELIVERED"
    ).length;

    const computedUnshippedOrders = orders.filter((o) => {
        const s = (o.status || "").toUpperCase();
        return s === "PENDING" || s === "UNSHIPPED" || s === "PROCESSING";
    }).length;

    const computedPendingOrders = orders.filter(
        (o) => (o.status || "").toUpperCase() === "PENDING"
    ).length;

    const computedInventoryCount =
        vendorStats?.overview?.activeListings ??
        inventoryResponse?.meta?.total ??
        inventories.length;

    const computedLowStockCount = inventories.filter(
        (item) => (item?.seller?.quantity ?? 0) <= 5
    ).length;

    // Monthly charts data from DB
    const monthlyRevenue = vendorStats?.charts?.monthlyRevenue || [];
    const monthlyOrders = vendorStats?.charts?.monthlyOrders || [];

    // Recent orders from DB: either populated in vendorStats or latest from live orders
    const recentOrdersList =
        vendorStats?.recent?.recentOrders && vendorStats.recent.recentOrders.length > 0
            ? vendorStats.recent.recentOrders
            : orders;

    return (
        <div className="space-y-6 pb-14 w-full">
            {/* 1. Breadcrumbs */}
            <VendorOverviewBread />

            {/* 2. Header with Date Range Selector, AI Briefing, and Refresh */}
            <VendorOverviewHeader
                selectedRange={selectedRange}
                onRangeChange={(newRange) => setSelectedRange(newRange)}
                onRefresh={handleRefreshAll}
                isFetching={isPageFetching}
                stats={vendorStats}
            />

            {/* Error Retry Banner */}
            {statsError && !isPageLoading && (
                <div className="card bg-[#170d2f] border border-rose-500/30 shadow-2xl p-5 sm:p-6 rounded-2xl sm:rounded-3xl">
                    <div className="flex items-center gap-3 text-rose-400">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-extrabold text-white">
                                Dashboard Sync Notice
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">
                                {(error as { data?: { message?: string } })?.data?.message ||
                                    "Some aggregated metrics could not be loaded. Displaying verified store records."}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleRefreshAll}
                            className="btn btn-sm btn-outline border-rose-500/40 text-rose-300 hover:bg-rose-500 hover:text-white rounded-xl gap-2 font-bold cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Retry</span>
                        </button>
                    </div>
                </div>
            )}

            {/* 3. Primary KPI Cards & Action Compliance Strip */}
            <VendorOverviewStats
                totalRevenue={computedRevenue}
                withdrawableBalance={vendorStats?.overview?.withdrawableBalance}
                pendingBalance={vendorStats?.overview?.pendingBalance}
                totalOrders={computedTotalOrders}
                deliveredOrders={computedDeliveredOrders}
                unshippedOrders={computedUnshippedOrders}
                pendingOrders={computedPendingOrders}
                inventoryCount={computedInventoryCount}
                lowStockCount={computedLowStockCount}
                healthScore={vendorStats?.performance?.accountHealthScore ?? healthData?.score}
                healthStatus={vendorStats?.performance?.healthStatus ?? healthData?.status}
                openDisputes={vendorStats?.disputes?.open}
                orders={orders}
                inventories={inventories}
                healthData={healthData}
                isLoading={isPageLoading}
                showActionStrip={true}
            />

            {/* 4. Chart Row: Monthly Performance Velocity (AZLineChart) & Fulfillment Funnel (AZPieChart) */}
            <VendorOverviewCharts
                monthlyRevenue={monthlyRevenue}
                monthlyOrders={monthlyOrders}
                orders={orders}
                isLoading={isPageLoading}
            />

            {/* 5. Health & Sales Velocity Hub: Radial Gauge & Financial Balances */}
            <VendorOverviewHealthSales
                performance={vendorStats?.performance}
                sales={vendorStats?.sales}
                sla={vendorStats?.sla}
                customers={vendorStats?.customers}
                withdrawableBalance={vendorStats?.overview?.withdrawableBalance}
                pendingBalance={vendorStats?.overview?.pendingBalance}
                isLoading={isPageLoading}
            />

            {/* 6. Lower Operational Section: Recent Orders & Stock Watchlist */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left (7 cols): Recent Orders Table from DB */}
                <div className="lg:col-span-7 flex flex-col">
                    <VendorRecentOrders orders={recentOrdersList} isLoading={ordersLoading} />
                </div>

                {/* Right (5 cols): Low Stock & Buy Box Watchlist */}
                <div className="lg:col-span-5 flex flex-col">
                    <VendorStockAlerts
                        inventories={inventories}
                        lowStockProducts={vendorStats?.products?.lowStockProducts}
                        outOfStockProducts={vendorStats?.products?.outOfStockProducts}
                        buyBoxWinners={vendorStats?.products?.buyBoxWinners}
                        isLoading={inventoryLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default VendorOverview;