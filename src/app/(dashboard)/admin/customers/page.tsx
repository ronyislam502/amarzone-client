"use client";

import { useState, useRef, useCallback } from "react";
import CustomersBread from "@/src/components/ui/Dashboard/admin/customers/CustomersBread";
import CustomersHeader from "@/src/components/ui/Dashboard/admin/customers/CustomersHeader";
import CustomersStats from "@/src/components/ui/Dashboard/admin/customers/CustomersStats";
import CustomersData, { CustomersStatsData } from "@/src/components/ui/Dashboard/admin/customers/CustomersData";

const CustomersPage = () => {
  const [stats, setStats] = useState<CustomersStatsData>({
    totalCustomers: 0,
    activeCustomers: 0,
    verifiedProfiles: 0,
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

  const handleStatsChange = useCallback((newStats: CustomersStatsData) => {
    setStats((prev) => {
      if (
        prev.totalCustomers === newStats.totalCustomers &&
        prev.activeCustomers === newStats.activeCustomers &&
        prev.verifiedProfiles === newStats.verifiedProfiles
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
      <CustomersBread />

      {/* Hero Header & Primary Actions */}
      <CustomersHeader
        onExportCsv={handleExportCsv}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* KPI Stats Overview Cards */}
      <CustomersStats
        totalCustomers={stats.totalCustomers}
        activeCustomers={stats.activeCustomers}
        verifiedProfiles={stats.verifiedProfiles}
      />

      {/* Interactive Customers Data Table with Filters & Modals */}
      <CustomersData
        onStatsChange={handleStatsChange}
        registerExportHandler={handleRegisterExport}
      />
    </div>
  );
};

export default CustomersPage;
