"use client";

import { useState, Suspense } from "react";
import CustomersBread from "@/src/components/ui/analistics/admin/customers/CustomersBread";
import CustomersHeader from "@/src/components/ui/analistics/admin/customers/CustomersHeader";
import CustomersStats from "@/src/components/ui/analistics/admin/customers/CustomersStats";
import CustomersData from "@/src/components/ui/analistics/admin/customers/CustomersData";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";

function CustomersPageContent() {
  const [exportHandler, setExportHandler] = useState<(() => void) | null>(null);

  const {
    data: statsResponse,
    refetch: refetchStats,
    isFetching: isFetchingStats,
  } = useDashboardStatsQuery({ range: "30_days" });

  const totalCustomers = statsResponse?.data?.users?.totalCustomers ?? 0;
  const activeCustomers = statsResponse?.data?.users?.activeUsers ?? 0;

  const handleRefresh = () => {
    refetchStats();
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Breadcrumb Navigation */}
      <CustomersBread />

      {/* Hero Header & Primary Actions */}
      <CustomersHeader
        onExportCsv={exportHandler ? () => exportHandler() : undefined}
        onRefresh={handleRefresh}
        isRefreshing={isFetchingStats}
      />

      {/* KPI Stats Overview Cards */}
      <CustomersStats
        totalCustomers={totalCustomers}
        activeCustomers={activeCustomers}
        verifiedProfiles={Math.round(totalCustomers * 0.85)}
      />

      {/* Interactive Customers Data Table with Filters & Modals */}
      <CustomersData
        registerExportHandler={(handler) => setExportHandler(() => handler)}
      />
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading customers...</div>}>
      <CustomersPageContent />
    </Suspense>
  );
}
