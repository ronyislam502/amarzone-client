"use client";

import { useState, useRef } from "react";
import ProductsBread from "@/src/components/ui/Dashboard/admin/products/ProductsBread";
import ProductsHeader from "@/src/components/ui/Dashboard/admin/products/ProductsHeader";


const ProductsPage = () => {
  // const [stats, setStats] = useState<ProductsStatsData>({
  //   totalProducts: 0,
  //   totalVariants: 0,
  //   bestSellerCount: 0,
  //   avgRating: 4.8,
  // });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const exportCsvRef = useRef<(() => void) | null>(null);

  const handleExportCsv = () => {
    if (exportCsvRef.current) {
      exportCsvRef.current();
    }
  };

  return (
    <div className="space-y-6 max-w-8xl mx-auto pb-10">
      {/* Breadcrumb Navigation */}
      <ProductsBread />

      {/* Hero Header & Primary Actions */}
      <ProductsHeader
        onExportCsv={handleExportCsv}
        onAddProduct={() => setIsCreateModalOpen(true)}
      />

      {/* KPI Stats Overview Cards (Products, Variants, Best Sellers, Ratings) */}
      {/* <ProductsStats
        totalProducts={stats.totalProducts}
        totalVariants={stats.totalVariants}
        bestSellerCount={stats.bestSellerCount}
        avgRating={stats.avgRating}
      /> */}

      {/* Interactive Products Data Table with Filters & Modals */}
    </div>
  );
};

export default ProductsPage;
