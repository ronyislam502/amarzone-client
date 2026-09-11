"use client";

import { useState, useRef, useCallback } from "react";
import ProductsBread from "@/src/components/ui/Dashboard/admin/products/ProductsBread";
import ProductsHeader from "@/src/components/ui/Dashboard/admin/products/ProductsHeader";
import ProductsStats from "@/src/components/ui/Dashboard/admin/products/ProductsStats";
import ProductsData, { ProductsStatsData } from "@/src/components/ui/Dashboard/admin/products/ProductsData";

const ProductsPage = () => {
  const [stats, setStats] = useState<ProductsStatsData>({
    totalProducts: 0,
    totalVariants: 0,
    bestSellerCount: 0,
    avgRating: 4.8,
  });

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

  const handleStatsChange = useCallback((newStats: ProductsStatsData) => {
    setStats((prev: ProductsStatsData) => {
      if (
        prev.totalProducts === newStats.totalProducts &&
        prev.totalVariants === newStats.totalVariants &&
        prev.bestSellerCount === newStats.bestSellerCount &&
        prev.avgRating === newStats.avgRating
      ) {
        return prev;
      }
      return newStats;
    });
  }, []);

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Breadcrumb Navigation */}
      <ProductsBread />

      {/* Hero Header & Primary Actions */}
      <ProductsHeader
        onExportCsv={handleExportCsv}
        onAddProduct={handleOpenCreateModal}
      />

      {/* KPI Stats Overview Cards */}
      <ProductsStats
        totalProducts={stats.totalProducts}
        totalVariants={stats.totalVariants}
        bestSellerCount={stats.bestSellerCount}
        avgRating={stats.avgRating}
      />

      {/* Interactive Products Directory Table with Filters & Modals */}
      <ProductsData
        onStatsChange={handleStatsChange}
        registerExportHandler={(fn: () => void) => {
          exportCsvRef.current = fn;
        }}
        registerCreateHandler={(fn: () => void) => {
          openCreateModalRef.current = fn;
        }}
      />
    </div>
  );
};

export default ProductsPage;
