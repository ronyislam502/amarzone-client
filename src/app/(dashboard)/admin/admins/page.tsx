"use client";

import { useState, useRef, useCallback } from "react";
import AdminsBread from "@/src/components/ui/Dashboard/admin/admins/AdminsBread";
import AdminsHeader from "@/src/components/ui/Dashboard/admin/admins/AdminsHeader";
import AdminsStats from "@/src/components/ui/Dashboard/admin/admins/AdminsStats";
import AdminsData, { AdminsStatsData } from "@/src/components/ui/Dashboard/admin/admins/AdminsData";

const AdminsPage = () => {
  const [stats, setStats] = useState<AdminsStatsData>({
    totalAdmins: 0,
    activeAdmins: 0,
    superAdmins: 0,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const exportCsvRef = useRef<(() => void) | null>(null);
  const openCreateModalRef = useRef<(() => void) | null>(null);

  const handleExportCsv = () => {
    if (exportCsvRef.current) {
      exportCsvRef.current();
    }
  };

  const handleOpenCreateModal = () => {
    if (openCreateModalRef.current) {
      openCreateModalRef.current();
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleStatsChange = useCallback((newStats: AdminsStatsData) => {
    setStats((prev) => {
      if (
        prev.totalAdmins === newStats.totalAdmins &&
        prev.activeAdmins === newStats.activeAdmins &&
        prev.superAdmins === newStats.superAdmins
      ) {
        return prev;
      }
      return newStats;
    });
  }, []);

  const handleRegisterExport = useCallback((handler: () => void) => {
    exportCsvRef.current = handler;
  }, []);

  const handleRegisterCreate = useCallback((handler: () => void) => {
    openCreateModalRef.current = handler;
  }, []);

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Breadcrumb Navigation */}
      <AdminsBread />

      {/* Hero Header & Primary Actions */}
      <AdminsHeader
        onExportCsv={handleExportCsv}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* KPI Stats Overview Cards */}
      <AdminsStats
        totalAdmins={stats.totalAdmins}
        activeAdmins={stats.activeAdmins}
        superAdmins={stats.superAdmins}
        securityRate="99.8%"
      />

      {/* Interactive Admins Data Table with Filters & Modals */}
      <AdminsData
        onStatsChange={handleStatsChange}
        registerExportHandler={handleRegisterExport}
        registerCreateHandler={handleRegisterCreate}
      />
    </div>
  );
};

export default AdminsPage;
