"use client";

import { useState, useRef, useCallback } from "react";
import InventoryBread from "@/src/components/ui/Dashboard/vendor/inventory/InventoryBread";
import InventoryHeader from "@/src/components/ui/Dashboard/vendor/inventory/InventoryHeader";
import InventoryStats, {
  InventoryStatsProps,
} from "@/src/components/ui/Dashboard/vendor/inventory/InventoryStats";
import InventoryData, {
  InventoryStatsData,
} from "@/src/components/ui/Dashboard/vendor/inventory/InventoryData";

const VendorInventoryPage = () => {
  const [stats, setStats] = useState<InventoryStatsProps>({
    totalItems: 0,
    inStockCount: 0,
    lowStockCount: 0,
    buyBoxWinnersCount: 0,
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

  const handleStatsChange = useCallback((newStats: InventoryStatsData) => {
    setStats((prev) => {
      if (
        prev.totalItems === newStats.totalItems &&
        prev.inStockCount === newStats.inStockCount &&
        prev.lowStockCount === newStats.lowStockCount &&
        prev.buyBoxWinnersCount === newStats.buyBoxWinnersCount
      ) {
        return prev;
      }
      return newStats;
    });
  }, []);

  const handleRegisterExport = useCallback((fn: () => void) => {
    exportCsvRef.current = fn;
  }, []);

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Breadcrumb Navigation */}
      <InventoryBread />

      {/* Hero Header & Quick Actions */}
      <InventoryHeader
        onExportCsv={handleExportCsv}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* KPI Overview Cards */}
      <InventoryStats
        totalItems={stats.totalItems}
        inStockCount={stats.inStockCount}
        lowStockCount={stats.lowStockCount}
        buyBoxWinnersCount={stats.buyBoxWinnersCount}
      />

      {/* Inventory Table with Search, Filter & Modals */}
      <InventoryData
        onStatsChange={handleStatsChange}
        registerExportHandler={handleRegisterExport}
        isRefreshing={isRefreshing}
      />
    </div>
  );
};

export default VendorInventoryPage;
