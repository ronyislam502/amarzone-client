"use client";

import { useState, Suspense } from "react";
import ProductsBread from "@/src/components/ui/analistics/admin/products/ProductsBread";
import ProductsHeader from "@/src/components/ui/analistics/admin/products/ProductsHeader";
import ProductsStats from "@/src/components/ui/analistics/admin/products/ProductsStats";
import ProductsData from "@/src/components/ui/analistics/admin/products/ProductsData";
import AiProductContentModal from "@/src/components/ui/analistics/admin/products/AiProductContentModal";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";

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
        onOpenAiStudio={() => setIsAiStudioOpen(true)}
        onExportCsv={exportHandler ? () => exportHandler() : undefined}
        onAddProduct={createHandler ? () => createHandler() : undefined}
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
        registerExportHandler={(fn: () => void) => setExportHandler(() => fn)}
        registerCreateHandler={(fn: (initData?: any) => void) =>
          setCreateHandler(() => fn)
        }
      />

      {/* Standalone AI Product Content Studio Modal */}
      <AiProductContentModal
        isOpen={isAiStudioOpen}
        onClose={() => setIsAiStudioOpen(false)}
        onCreateWithContent={(content, seed) => {
          setIsAiStudioOpen(false);
          if (createHandler) {
            createHandler({
              ...content,
              brand: seed.brand,
            });
          }
        }}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading products catalog...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
