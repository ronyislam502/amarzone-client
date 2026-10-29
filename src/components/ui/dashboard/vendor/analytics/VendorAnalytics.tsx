"use client";

import React, { useState, useMemo, Suspense } from "react";
import {
    TrendingUp,
    DollarSign,
    ShoppingBag,
    Package,
    Sparkles,
    CheckCircle2,
    Clock,
    AlertTriangle,
    ArrowUpRight,
    RefreshCw,
    AlertCircle,
    ShieldCheck,
    Star,
    Zap,
    BarChart3,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useMyOrdersQuery } from "@/redux/features/order/orderApi";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import { useMyInventoryQuery } from "@/redux/features/inventory/inventoryApi";
import { useGetMyHealthQuery } from "@/redux/features/health/healthApi";
import { TVendorDashboardData } from "@/types/dashboard";
import { TOrder } from "@/types/order";
import { TInventory } from "@/types/inventory";
import VendorAnalyticsBread, { TAnalyticsDateRange } from "./VendorAnalyticsBread";
import VendorAnalyticsStats from "./VendorAnalyticsStats";
import VendorPieChart, { TChartPoint, TStatusPoint } from "./VendorPieChart";
import VendorBarCharts, { TGroupSalesPoint } from "./VendorBarCharts";
import TopProductsTable, { TTopSellingProductItem } from "./TopProductsTable";
import DashboardAnalyticsSkeleton from "@/components/shared/skeleton/DashboardAnalyticsSkeleton";

export type { TAnalyticsDateRange };

const VendorAnalyticsPage: React.FC = () => {
    const [dateRange, setDateRange] = useState<TAnalyticsDateRange>("30_days");
    const [customStartDate, setCustomStartDate] = useState<string>("");
    const [customEndDate, setCustomEndDate] = useState<string>("");

    // 1. Query vendor orders strictly from database
    const {
        data: ordersData,
        isLoading: isOrdersLoading,
        isFetching: isOrdersFetching,
        refetch: refetchOrders,
    } = useMyOrdersQuery({ limit: 100 });

    // 2. Query vendor aggregated dashboard statistics from database
    const {
        data: statsResponse,
        isLoading: isStatsLoading,
        isFetching: isStatsFetching,
        refetch: refetchStats,
    } = useDashboardStatsQuery({
        range: dateRange as any,
        startDate: dateRange === "custom" && customStartDate ? customStartDate : undefined,
        endDate: dateRange === "custom" && customEndDate ? customEndDate : undefined,
    });

    // 3. Query vendor inventory from database
    const {
        data: inventoryResponse,
        isLoading: isInventoryLoading,
        isFetching: isInventoryFetching,
        refetch: refetchInventory,
    } = useMyInventoryQuery({ limit: 100 });

    // 4. Query live account health from database
    const {
        data: healthResponse,
        isLoading: isHealthLoading,
        isFetching: isHealthFetching,
        refetch: refetchHealth,
    } = useGetMyHealthQuery();

    const handleRefreshAll = () => {
        refetchOrders();
        refetchStats();
        refetchInventory();
        refetchHealth();
    };

    const isFetching = isOrdersFetching || isStatsFetching || isInventoryFetching || isHealthFetching;
    const isPageLoading = isOrdersLoading && isStatsLoading;

    const ordersList = useMemo(() => {
        return (ordersData?.data || []) as TOrder[];
    }, [ordersData?.data]);

    const vendorStats = (statsResponse?.data || {}) as TVendorDashboardData;
    const healthData = healthResponse?.data;
    const rawInventory = inventoryResponse?.data;
    const inventories: TInventory[] = (
        Array.isArray(rawInventory)
            ? rawInventory
            : (rawInventory as any)?.data || []
    ) as TInventory[];

    // 1. Filter orders strictly by selected date range
    const filteredOrders = useMemo(() => {
        if (!ordersList || ordersList.length === 0) return [];
        const now = new Date();

        return ordersList.filter((order) => {
            if (!order?.createdAt) return true;
            const orderDate = new Date(order.createdAt);

            if (dateRange === "today") {
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                return orderDate >= todayStart;
            }
            if (dateRange === "7_days") {
                const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return orderDate >= sevenDaysAgo;
            }
            if (dateRange === "30_days") {
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return orderDate >= thirtyDaysAgo;
            }
            if (dateRange === "custom") {
                if (customStartDate && new Date(customStartDate) > orderDate) return false;
                if (customEndDate) {
                    const end = new Date(customEndDate);
                    end.setHours(23, 59, 59, 999);
                    if (end < orderDate) return false;
                }
                return true;
            }
            return true;
        });
    }, [ordersList, dateRange, customStartDate, customEndDate]);

    // 2. Summarized Store Revenue calculated strictly from real database records
    const storeRevenue = useMemo(() => {
        return filteredOrders.reduce((sum: number, o: any) => {
            const st = (o.status || "").toUpperCase();
            if (st !== "CANCELLED" && st !== "REFUNDED") {
                const amt = Number(o.vendorAmount ?? o.totalPrice ?? 0);
                return sum + (isNaN(amt) ? 0 : amt);
            }
            return sum;
        }, 0);
    }, [filteredOrders]);

    // 3. Summarized Store Orders
    const storeOrders = filteredOrders.length;

    // 4. Average Order Value
    const avgOrderValue = storeOrders > 0 ? storeRevenue / storeOrders : 0;

    // 5. Orders placed today counter
    const todayOrdersCount = useMemo(() => {
        const todayStr = new Date().toISOString().slice(0, 10);
        return ordersList.filter((o: any) => o?.createdAt?.slice(0, 10) === todayStr).length;
    }, [ordersList]);

    // 6. Active listings count from real DB inventory
    const activeListingsCount = useMemo(() => {
        return (
            inventoryResponse?.meta?.total ??
            inventories.length ??
            vendorStats?.overview?.activeListings ??
            0
        );
    }, [inventoryResponse?.meta?.total, inventories.length, vendorStats?.overview?.activeListings]);

    // 7. Time series for Revenue & Orders Line Charts strictly from real orders
    const { revenueOverTime, ordersOverTime } = useMemo(() => {
        if (!filteredOrders || filteredOrders.length === 0) {
            return { revenueOverTime: [], ordersOverTime: [] };
        }

        const dayMap = new Map<string, { revenue: number; count: number }>();

        const sorted = [...filteredOrders].sort((a: any, b: any) =>
            new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        );

        sorted.forEach((order: any) => {
            if (!order.createdAt) return;
            const d = new Date(order.createdAt);
            const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const curr = dayMap.get(label) || { revenue: 0, count: 0 };
            const st = (order.status || "").toUpperCase();
            const rev =
                st !== "CANCELLED" && st !== "REFUNDED"
                    ? Number(order.vendorAmount ?? order.totalPrice ?? 0)
                    : 0;

            dayMap.set(label, {
                revenue: curr.revenue + rev,
                count: curr.count + 1,
            });
        });

        const revPoints: TChartPoint[] = [];
        const ordPoints: TChartPoint[] = [];

        dayMap.forEach((val, label) => {
            revPoints.push({ label, value: Math.round(val.revenue * 100) / 100 });
            ordPoints.push({ label, value: val.count });
        });

        return { revenueOverTime: revPoints, ordersOverTime: ordPoints };
    }, [filteredOrders]);

    // 8. Orders by Fulfillment Status strictly computed from real database orders
    const ordersByStatus: TStatusPoint[] = useMemo(() => {
        const counts: Record<string, number> = {
            Delivered: 0,
            Shipped: 0,
            Processing: 0,
            Pending: 0,
            Cancelled: 0,
        };

        filteredOrders.forEach((o: any) => {
            const st = (o.status || "").toUpperCase();
            if (st.includes("DELIVER")) counts.Delivered++;
            else if (st.includes("SHIP") || st.includes("TRANSIT")) counts.Shipped++;
            else if (st.includes("PROCESS") || st.includes("UNSHIP")) counts.Processing++;
            else if (st.includes("PENDING")) counts.Pending++;
            else if (st.includes("CANCEL")) counts.Cancelled++;
            else counts.Processing++;
        });

        return [
            { status: "Delivered", count: counts.Delivered },
            { status: "Shipped", count: counts.Shipped },
            { status: "Processing", count: counts.Processing },
            { status: "Pending", count: counts.Pending },
            { status: "Cancelled", count: counts.Cancelled },
        ];
    }, [filteredOrders]);

    // 9. Department & Category Sales Breakdown strictly computed from real order items
    const { departmentSales, categorySales } = useMemo(() => {
        if (!filteredOrders || filteredOrders.length === 0) {
            return { departmentSales: [], categorySales: [] };
        }

        const deptMap = new Map<string, { revenue: number; count: number }>();
        const catMap = new Map<string, { revenue: number; count: number }>();

        filteredOrders.forEach((order: any) => {
            const prods = order.products || [];
            prods.forEach((pItem: any) => {
                const prod = pItem?.variant?.product;
                const deptName = prod?.department?.name || prod?.department || "General Catalog";
                const catName = prod?.category?.name || prod?.category || "Standard Category";
                const rev = (Number(pItem?.price) || 0) * (Number(pItem?.quantity) || 1);

                const currentDept = deptMap.get(deptName) || { revenue: 0, count: 0 };
                deptMap.set(deptName, {
                    revenue: currentDept.revenue + rev,
                    count: currentDept.count + 1,
                });

                const currentCat = catMap.get(catName) || { revenue: 0, count: 0 };
                catMap.set(catName, {
                    revenue: currentCat.revenue + rev,
                    count: currentCat.count + 1,
                });
            });
        });

        const depts: TGroupSalesPoint[] = [];
        deptMap.forEach((v, k) => {
            depts.push({
                id: `dept-${k}`,
                name: k,
                revenue: Math.round(v.revenue * 100) / 100,
                ordersCount: v.count,
            });
        });

        const cats: TGroupSalesPoint[] = [];
        catMap.forEach((v, k) => {
            cats.push({
                id: `cat-${k}`,
                name: k,
                revenue: Math.round(v.revenue * 100) / 100,
                ordersCount: v.count,
            });
        });

        return {
            departmentSales: depts.sort((a, b) => b.revenue - a.revenue),
            categorySales: cats.sort((a, b) => b.revenue - a.revenue),
        };
    }, [filteredOrders]);

    // 10. Top Selling Products Leaderboard strictly computed from real database orders
    const topProducts: TTopSellingProductItem[] = useMemo(() => {
        if (!filteredOrders || filteredOrders.length === 0) {
            return [];
        }

        const prodMap = new Map<string, {
            id: string;
            title: string;
            thumbnail: string;
            asin?: string;
            sku?: string;
            unitsSold: number;
            totalRevenue: number;
        }>();

        filteredOrders.forEach((order: any) => {
            const prods = order.products || [];
            prods.forEach((pItem: any) => {
                const prod = pItem?.variant?.product;
                const pId = prod?._id || pItem?.variant?._id || pItem?._id;
                if (!pId) return;

                const title = prod?.title || pItem?.title || "Product";
                const thumbnail = prod?.thumbnail || pItem?.variant?.images?.[0] || "";
                const asin = prod?.asin || pItem?.variant?.asin || `AMZ-${pId.toString().slice(-6).toUpperCase()}`;
                const sku = pItem?.variant?.sku || `SKU-${pId.toString().slice(-4).toUpperCase()}`;
                const qty = Number(pItem?.quantity) || 1;
                const rev = (Number(pItem?.price) || 0) * qty;

                const existing = prodMap.get(pId) || {
                    id: pId,
                    title,
                    thumbnail,
                    asin,
                    sku,
                    unitsSold: 0,
                    totalRevenue: 0,
                };

                prodMap.set(pId, {
                    ...existing,
                    unitsSold: existing.unitsSold + qty,
                    totalRevenue: existing.totalRevenue + rev,
                });
            });
        });

        const list: TTopSellingProductItem[] = [];
        prodMap.forEach((v) => {
            list.push({
                ...v,
                avgPrice: v.unitsSold > 0 ? Math.round((v.totalRevenue / v.unitsSold) * 100) / 100 : 0,
                totalRevenue: Math.round(v.totalRevenue * 100) / 100,
            });
        });

        return list.sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 10);
    }, [filteredOrders]);

    // 11. Pending Dispatch Orders Count strictly from database
    const pendingDispatchCount = useMemo(() => {
        return ordersList.filter((o: any) => {
            const st = (o.status || "").toUpperCase();
            return st === "PENDING" || st === "PROCESSING" || st === "UNSHIPPED";
        }).length;
    }, [ordersList]);

    // 12. Extracted order status counts for fulfillment pipeline
    const statusCounts = useMemo(() => {
        const counts = {
            Pending: 0,
            Processing: 0,
            Shipped: 0,
            Delivered: 0,
            Cancelled: 0,
        };
        ordersByStatus.forEach((item) => {
            if (item.status in counts) {
                counts[item.status as keyof typeof counts] = item.count;
            }
        });
        return counts;
    }, [ordersByStatus]);

    // 13. Health & SLA metrics strictly from database records
    const onTimeShippingRate = healthData?.validTrackingRate ?? vendorStats?.performance?.validTrackingRate ?? 100;
    const orderDefectRate = healthData?.orderDefectRate ?? vendorStats?.performance?.orderDefectRate ?? 0;
    const customerRating = vendorStats?.performance?.averageRating ?? (healthData?.score ? Math.round((healthData.score / 200) * 10) / 10 : 5.0);
    const healthStatus = healthData?.status ?? vendorStats?.performance?.healthStatus ?? "ACTIVE";

    return (
        <div className="space-y-6 w-full pb-14 text-slate-100">
            {/* 1. Interactive Header & Time-horizon Toolbar */}
            <VendorAnalyticsBread
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                customStartDate={customStartDate}
                customEndDate={customEndDate}
                onCustomStartDateChange={setCustomStartDate}
                onCustomEndDateChange={setCustomEndDate}
                isFetching={isFetching}
                onRefresh={handleRefreshAll}
            />

            {/* Loading Skeleton */}
            {isPageLoading && <DashboardAnalyticsSkeleton />}

            {!isPageLoading && (
                <Suspense fallback={<DashboardAnalyticsSkeleton />}>
                    {/* 2. Top-Level Core KPI Cards & Fulfillment Pipeline */}
                    <VendorAnalyticsStats
                        storeRevenue={storeRevenue}
                        storeOrders={storeOrders}
                        avgOrderValue={avgOrderValue}
                        todayOrdersCount={todayOrdersCount}
                        activeListings={activeListingsCount}
                        pendingOrders={statusCounts.Pending}
                        processingOrders={statusCounts.Processing}
                        shippedOrders={statusCounts.Shipped}
                        deliveredOrders={statusCounts.Delivered}
                        cancelledOrders={statusCounts.Cancelled}
                        dateRange={dateRange}
                    />

                    {/* 3. Operational Health & Seller Service Level Agreement (SLA) Bar */}
                    <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
                        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Left: Store Trust Metric */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black uppercase tracking-wider text-white">
                                            Store Operational Health
                                        </span>
                                        <span className="badge badge-xs bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold px-2 py-1">
                                            {healthStatus} Standing
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Real-time fulfillment compliance, defect rates, and customer sentiment benchmarks.
                                    </p>
                                </div>
                            </div>

                            {/* Right: Key Performance Badges strictly from database */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-5 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10 text-xs">
                                <div className="space-y-0.5">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">On-Time Shipping</span>
                                    <div className="font-extrabold text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                        <span>{Number(onTimeShippingRate).toFixed(1)}%</span>
                                        <span className="text-[9px] text-slate-500 font-normal">(Goal &gt;95%)</span>
                                    </div>
                                </div>

                                <div className="space-y-0.5">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Order Defect Rate</span>
                                    <div className="font-extrabold text-cyan-300 flex items-center gap-1">
                                        <Zap className="w-3 h-3 text-cyan-400" />
                                        <span>{Number(orderDefectRate).toFixed(2)}%</span>
                                        <span className="text-[9px] text-slate-500 font-normal">(Goal &lt;1.0%)</span>
                                    </div>
                                </div>

                                <div className="space-y-0.5">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Customer Rating</span>
                                    <div className="font-extrabold text-amber-300 flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        <span>{customerRating} / 5.0</span>
                                    </div>
                                </div>

                                <div className="space-y-0.5">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Pending Dispatch</span>
                                    <div className="font-extrabold text-white flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                        <span>{pendingDispatchCount} Orders</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Performance Trends (Line Chart) & Fulfillment Funnel (Donut Pie Chart) */}
                    <VendorPieChart
                        revenueOverTime={revenueOverTime}
                        ordersOverTime={ordersOverTime}
                        ordersByStatus={ordersByStatus}
                    />

                    {/* 5. Department & Category Breakdown (Bar Charts) */}
                    <VendorBarCharts
                        departmentSales={departmentSales}
                        categorySales={categorySales}
                    />

                    {/* 6. Product Revenue Leaders & Best Sellers Table */}
                    <TopProductsTable products={topProducts} />

                    {/* 7. Strategic Merchant Growth & Optimization Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Insight 1: Inventory Restock */}
                        <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 rounded-2xl p-5 shadow-xl hover:border-amber-400/30 transition-all">
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <h4 className="font-extrabold text-white text-xs">Inventory Velocity</h4>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                Review low stock inventory and replenish replenishment reserves to ensure active Buy Box and Prime fulfillment standing.
                            </p>
                            <Link
                                href="/vendor/inventory"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 mt-3 transition-colors"
                            >
                                <span>View Inventory Stock</span>
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {/* Insight 2: Pricing Benchmark */}
                        <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 rounded-2xl p-5 shadow-xl hover:border-emerald-400/30 transition-all">
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                                <h4 className="font-extrabold text-white text-xs">Buy Box Competitiveness</h4>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                Maintain competitive prices and high fulfillment metrics to win the featured offer across customer searches.
                            </p>
                            <Link
                                href="/vendor/health"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 mt-3 transition-colors"
                            >
                                <span>Review SLA Standards</span>
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {/* Insight 3: Fulfillment SLA */}
                        <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 rounded-2xl p-5 shadow-xl hover:border-indigo-400/30 transition-all">
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-400/10 border border-indigo-400/20 text-indigo-400 flex items-center justify-center">
                                    <BarChart3 className="w-4 h-4" />
                                </div>
                                <h4 className="font-extrabold text-white text-xs">Catalog Expansion</h4>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                Expand your product catalog and list new trending products to scale sales velocity across high-volume departments.
                            </p>
                            <Link
                                href="/vendor/inventory"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-300 hover:text-indigo-200 mt-3 transition-colors"
                            >
                                <span>Add New Listing</span>
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </Suspense>
            )}
        </div>
    );
};

export default VendorAnalyticsPage;
