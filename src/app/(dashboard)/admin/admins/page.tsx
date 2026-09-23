"use client";

import { useState, Suspense } from "react";
import AdminsBread from "@/src/components/ui/analistics/admin/admins/AdminsBread";
import AdminsHeader from "@/src/components/ui/analistics/admin/admins/AdminsHeader";
import AdminsStats from "@/src/components/ui/analistics/admin/admins/AdminsStats";
import AdminsData from "@/src/components/ui/analistics/admin/admins/AdminsData";
import TableSkeleton from "@/src/components/ui/shared/skeleton/TableSkeleton";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";

export default function AdminsPage() {
  const [exportHandler, setExportHandler] = useState<(() => void) | null>(null);
  const [createHandler, setCreateHandler] = useState<(() => void) | null>(null);

  const {
    data: statsResponse,
    refetch: refetchStats,
    isFetching: isFetchingStats,
  } = useDashboardStatsQuery({ range: "30_days" });

  const totalAdmins = statsResponse?.data?.users?.totalAdmins ?? 0;
  const activeAdmins = totalAdmins;
  const superAdmins = Math.max(1, Math.round(totalAdmins * 0.3));

  const handleRefresh = () => {
    refetchStats();
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Breadcrumb Navigation */}
      <AdminsBread />

      {/* Hero Header & Primary Actions */}
      <AdminsHeader
        onExportCsv={exportHandler ? () => exportHandler() : undefined}
        onRefresh={handleRefresh}
        isRefreshing={isFetchingStats}
        onOpenCreateModal={createHandler ? () => createHandler() : undefined}
      />

      {/* KPI Stats Overview Cards */}
      <AdminsStats
        totalAdmins={totalAdmins}
        activeAdmins={activeAdmins}
        superAdmins={superAdmins}
        securityRate="99.8%"
      />

      {/* Interactive Admins Data Table with Filters & Modals */}
      <Suspense fallback={<TableSkeleton columns={6} rows={5} showAvatar={true} title="System Administrators" />}>
        <AdminsData
          registerExportHandler={(handler) => setExportHandler(() => handler)}
          registerCreateHandler={(handler) => setCreateHandler(() => handler)}
        />
      </Suspense>
    </div>
  );
}
