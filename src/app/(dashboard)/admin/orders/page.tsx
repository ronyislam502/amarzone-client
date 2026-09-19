"use client";

import React, { useState } from "react";
import {
  OrdersBread,
  OrdersHeader,
  OrdersStats,
  OrdersData,
} from "@/src/components/ui/analistics/admin/orders";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";

export default function AdminOrdersPage() {
  const [exportHandler, setExportHandler] = useState<(() => void) | null>(null);
  const [refreshHandler, setRefreshHandler] = useState<(() => void) | null>(null);

  // Use dedicated dashboard stats query for overview statistics
  const {
    data: statsResponse,
    refetch: refetchStats,
    isFetching: isFetchingStats,
  } = useDashboardStatsQuery({ range: "30_days" });

  const overview = statsResponse?.data?.overviewCards;
  const totalOrders = overview?.totalOrders ?? 0;
  const grossRevenue = overview?.totalRevenue ?? 0;
  const totalCommission = overview?.marketplaceCommission ?? 0;
  const pendingOrdersCount = overview?.pendingOrders ?? 0;

  const handleRefresh = () => {
    refetchStats();
    refreshHandler?.();
  };

  return (
    <div className="space-y-6 w-full pb-10">
      <OrdersBread />
      <OrdersHeader
        totalOrders={totalOrders}
        onExportCsv={exportHandler ? () => exportHandler() : undefined}
        onRefresh={handleRefresh}
        isRefreshing={isFetchingStats}
      />
      <OrdersStats
        totalOrders={totalOrders}
        grossRevenue={grossRevenue}
        totalCommission={totalCommission}
        pendingOrdersCount={pendingOrdersCount}
      />
      <OrdersData
        registerExportHandler={(handler) => setExportHandler(() => handler)}
        registerRefreshHandler={(handler) => setRefreshHandler(() => handler)}
      />
    </div>
  );
}
