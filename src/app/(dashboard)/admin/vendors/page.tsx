"use client";

import { useState, Suspense } from "react";
import VendorsBread from "@/src/components/ui/analistics/admin/vendors/VendorsBread";
import VendorsHeader from "@/src/components/ui/analistics/admin/vendors/VendorsHeader";
import VendorsStats from "@/src/components/ui/analistics/admin/vendors/VendorsStats";
import VendorsData from "@/src/components/ui/analistics/admin/vendors/VendorsData";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";

function VendorsPageContent() {
  const [exportHandler, setExportHandler] = useState<(() => void) | null>(null);

  const {
    data: statsResponse,
    refetch: refetchStats,
    isFetching: isFetchingStats,
  } = useDashboardStatsQuery({ range: "30_days" });

  const totalVendors = statsResponse?.data?.users?.totalVendors ?? 0;
  const activeVendors = statsResponse?.data?.users?.activeVendors ?? totalVendors;
  const newVendorsCount = statsResponse?.data?.users?.newUsersThisMonth ?? 0;

  const handleRefresh = () => {
    refetchStats();
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Breadcrumb Navigation */}
      <VendorsBread />

      {/* Hero Header & Primary Actions */}
      <VendorsHeader
        onExportCsv={exportHandler ? () => exportHandler() : undefined}
        onRefresh={handleRefresh}
        isRefreshing={isFetchingStats}
      />

      {/* KPI Stats Overview Cards */}
      <VendorsStats
        totalVendors={totalVendors}
        activeVendors={activeVendors}
        newVendorsCount={newVendorsCount}
      />

      {/* Interactive Vendors Data Table with Filters & Modals */}
      <VendorsData
        registerExportHandler={(handler) => setExportHandler(() => handler)}
      />
    </div>
  );
}

export default function VendorsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading vendors...</div>}>
      <VendorsPageContent />
    </Suspense>
  );
}
