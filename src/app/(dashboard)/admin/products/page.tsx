"use client";

import { useState, Suspense } from "react";
import ProductsBread from "@/src/components/ui/analistics/admin/products/ProductsBread";
import ProductsHeader from "@/src/components/ui/analistics/admin/products/ProductsHeader";
import ProductsStats from "@/src/components/ui/analistics/admin/products/ProductsStats";
import ProductsData from "@/src/components/ui/analistics/admin/products/ProductsData";
import AiProductContentModal from "@/src/components/ui/analistics/admin/products/AiProductContentModal";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import { TableSkeleton } from "@/src/components/ui/skeleton";

function ProductsPageContent() {
  const [exportHandler, setExportHandler] = useState<(() => void) | null>(null);
  const [createHandler, setCreateHandler] = useState<((initData?: any) => void) | null>(null);
  const [isAiStudioOpen, setIsAiStudioOpen] = useState<boolean>(false);

  const {
    data: statsResponse,
    refetch: refetchStats,
    isFetching: isFetchingStats,
  } = useDashboardStatsQuery({ range: "30_days" });

  const totalProducts = statsResponse?.data?.products?.totalProducts ?? 0;
  const bestSellerCount = statsResponse?.data?.products?.bestSellerProducts ?? 0;
  const totalVariants = statsResponse?.data?.products?.totalInventory ?? 0;

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Breadcrumb Navigation */}
      <ProductsBread />

      {/* Hero Header & Primary Actions */}
      <ProductsHeader
        onOpenAiStudio={() => {
          if (createHandler) createHandler();
          else setIsAiStudioOpen(true);
        }}
        onExportCsv={exportHandler ? () => exportHandler() : undefined}
      />

      {/* KPI Stats Overview Cards */}
      <ProductsStats
        totalProducts={totalProducts}
        totalVariants={totalVariants}
        bestSellerCount={bestSellerCount}
        avgRating={4.8}
      />

      {/* Interactive Products Directory Table with Filters & Modals */}
      <ProductsData
        onProductCreated={refetchStats}
        registerExportHandler={(fn: () => void) => setExportHandler(() => fn)}
        registerCreateHandler={(fn: (initData?: any) => void) =>
          setCreateHandler(() => fn)
        }
      />

      {/* Unified AI Product Content Studio & Catalog Creator Modal */}
      <AiProductContentModal
        isOpen={isAiStudioOpen}
        onClose={() => setIsAiStudioOpen(false)}
        onSuccess={() => {
          setIsAiStudioOpen(false);
          refetchStats();
        }}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <TableSkeleton
          columns={6}
          rows={5}
          showAvatar={true}
          title="Products Catalog"
        />
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
