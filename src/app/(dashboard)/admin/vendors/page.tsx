"use client";

import { useState, useRef, useCallback } from "react";
import VendorsBread from "@/src/components/ui/Dashboard/admin/vendors/VendorsBread";
import VendorsHeader from "@/src/components/ui/Dashboard/admin/vendors/VendorsHeader";
import VendorsStats from "@/src/components/ui/Dashboard/admin/vendors/VendorsStats";
import VendorsData, { VendorsStatsData } from "@/src/components/ui/Dashboard/admin/vendors/VendorsData";

const VendorsPage = () => {
  const [stats, setStats] = useState<VendorsStatsData>({
    totalVendors: 0,
    activeVendors: 0,
    newVendorsCount: 0,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const exportCsvRef = useRef<(() => void) | null>(null);

  const handleExportCsv = () => {
    if (exportCsvRef.current) {
      exportCsvRef.current();
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleStatsChange = useCallback((newStats: VendorsStatsData) => {
    setStats((prev) => {
      if (
        prev.totalVendors === newStats.totalVendors &&
        prev.activeVendors === newStats.activeVendors &&
        prev.newVendorsCount === newStats.newVendorsCount
      ) {
        return prev;
      }
      return newStats;
    });
  }, []);

  const handleRegisterExport = useCallback((handler: () => void) => {
    exportCsvRef.current = handler;
  }, []);

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Breadcrumb Navigation */}
      <VendorsBread />

      {/* Hero Header & Primary Actions */}
      <VendorsHeader
        onExportCsv={handleExportCsv}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* KPI Stats Overview Cards */}
      <VendorsStats
        totalVendors={stats.totalVendors}
        activeVendors={stats.activeVendors}
        newVendorsCount={stats.newVendorsCount}
      />

      {/* Interactive Vendors Data Table with Filters & Modals */}
      <VendorsData
        onStatsChange={handleStatsChange}
        registerExportHandler={handleRegisterExport}
      />
    </div>
  );
};

export default VendorsPage;
