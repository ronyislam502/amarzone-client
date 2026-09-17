"use client";

import React, { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useNotification } from "@/src/context/NotificationContext";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import { TDashboardDateRange, TDashboardStatsData } from "@/src/types/dashboard";
import { AdminSummaryHeader } from "@/src/components/ui/analistics/admin/summary/AdminSummaryHeader";
import { RevenueBreakdownCard } from "@/src/components/ui/analistics/admin/summary/RevenueBreakdownCard";
import { EntityCountersGrid } from "@/src/components/ui/analistics/admin/summary/EntityCountersGrid";
import { PendingOrdersBanner } from "@/src/components/ui/analistics/admin/summary/PendingOrdersBanner";
import { QuickStatsStrip } from "@/src/components/ui/analistics/admin/summary/QuickStatsStrip";
import { ConciseChartsRow } from "@/src/components/ui/analistics/admin/summary/ConciseChartsRow";
import { RecentOrdersTable } from "@/src/components/ui/analistics/admin/summary/RecentOrdersTable";
import { RecentNotificationsWidget } from "@/src/components/ui/analistics/admin/summary/RecentNotificationsWidget";

const AdminDashboard: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<TDashboardDateRange>("30_days");

  // Query real dashboard statistics from backend /dashboard/stats API
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useDashboardStatsQuery({ range: selectedRange });

  const statsData: TDashboardStatsData | undefined = apiResponse?.data;

  // Real-time socket status
  const { status } = useNotification();
  const isConnected = status === "connected";

  return (
    <div className="space-y-6 pb-14 w-full">
      {/* 1. Header with Range Filter, Refresh & Deep Analytics Link */}
      <AdminSummaryHeader
        selectedRange={selectedRange}
        onRangeChange={(newRange) => setSelectedRange(newRange)}
        onRefresh={() => refetch()}
        isFetching={isFetching}
        socketConnected={isConnected}
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-44 rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10"
              />
            ))}
          </div>
          <div className="h-28 rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10"
              />
            ))}
          </div>
        </div>
      )}

      {/* Error Retry Banner */}
      {isError && !isLoading && (
        <div className="card bg-[#170d2f] border border-rose-500/30 shadow-2xl p-6 rounded-2xl sm:rounded-3xl">
          <div className="flex items-center gap-3 text-rose-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-extrabold text-white">
                Unable to Load Dashboard Statistics
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {(error as { data?: { message?: string } })?.data?.message ||
                  "Failed to retrieve data from /dashboard/stats."}
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

      {/* Main Dashboard Summary Sections */}
      {statsData && !isLoading && (
        <>
          {/* 2. Total Revenue: Gross Revenue, Commission, and Revenue Excluding Commission */}
          <RevenueBreakdownCard overviewCards={statsData.overviewCards} />

          {/* 3. Entity Counters: Users, Vendors, Customers, Products, Orders */}
          <EntityCountersGrid
            users={statsData.users}
            products={statsData.products}
            overviewCards={statsData.overviewCards}
          />

          {/* 4. Pending Orders Spotlight & Fulfillment Pipeline */}
          <PendingOrdersBanner overviewCards={statsData.overviewCards} />

          {/* 5. Quick Statistics (Low Stock, Customer Rating, Disputes, SLA) */}
          <QuickStatsStrip
            inventory={statsData.inventory}
            reviews={statsData.reviews}
            marketplaceHealth={statsData.marketplaceHealth}
            overviewCards={statsData.overviewCards}
          />

          {/* 6. Small / Concise Charts (Line Sparkline, Donut Distribution, Category Bars) */}
          <ConciseChartsRow
            ordersData={
              statsData.charts?.ordersChart ||
              statsData.ordersAnalytics?.ordersPerDay?.map((d) => ({
                label: d.date,
                value: d.count,
              }))
            }
            revenueData={
              statsData.charts?.revenueChart ||
              statsData.ordersAnalytics?.revenuePerDay?.map((d) => ({
                label: d.date,
                value: d.revenue,
              }))
            }
            orderStatusData={statsData.charts?.orderStatusPieChart}
            categorySalesData={statsData.charts?.categorySalesChart}
          />

          {/* 7. Recent Orders & Recent Notifications Dual Hub */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentOrdersTable orders={statsData.recentActivities?.recentOrders} />
            <RecentNotificationsWidget />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;