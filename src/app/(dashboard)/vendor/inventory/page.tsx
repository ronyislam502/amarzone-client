"use client";

import { useState, Suspense } from "react";
import InventoryBread from "@/src/components/ui/analistics/vendor/inventory/InventoryBread";
import InventoryHeader from "@/src/components/ui/analistics/vendor/inventory/InventoryHeader";
import InventoryStats from "@/src/components/ui/analistics/vendor/inventory/InventoryStats";
import InventoryData from "@/src/components/ui/analistics/vendor/inventory/InventoryData";
import { useGetMyInventoryQuery } from "@/src/redux/features/inventory/inventoryApi";
import { TInventory } from "@/src/types/inventory";

function VendorInventoryPageContent() {
  const [exportHandler, setExportHandler] = useState<(() => void) | null>(null);

  const { data: inventoryResponse, refetch, isFetching } = useGetMyInventoryQuery(
    {},
    { refetchOnMountOrArgChange: false }
  );

  const items: TInventory[] = (inventoryResponse?.data as TInventory[]) || [];
  const totalItems = inventoryResponse?.meta?.total ?? items.length;
  const inStockCount = items.filter(
    (item) => item.seller?.isStock && (item.seller?.quantity || 0) > 0
  ).length;
  const lowStockCount = items.filter(
    (item) => (item.seller?.quantity || 0) <= 5
  ).length;
  const buyBoxWinnersCount = items.filter(
    (item) => item.seller?.isBuyBoxWinner
  ).length;

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Breadcrumb Navigation */}
      <InventoryBread />

      {/* Hero Header & Quick Actions */}
      <InventoryHeader
        onExportCsv={exportHandler ? () => exportHandler() : undefined}
        onRefresh={handleRefresh}
        isRefreshing={isFetching}
      />

      {/* KPI Overview Cards */}
      <InventoryStats
        totalItems={totalItems}
        inStockCount={inStockCount}
        lowStockCount={lowStockCount}
        buyBoxWinnersCount={buyBoxWinnersCount}
      />

      {/* Inventory Table with Search, Filter & Modals */}
      <InventoryData
        registerExportHandler={(fn: () => void) => setExportHandler(() => fn)}
        isRefreshing={isFetching}
      />
    </div>
  );
}

export default function VendorInventoryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading inventory...</div>}>
      <VendorInventoryPageContent />
    </Suspense>
  );
}
