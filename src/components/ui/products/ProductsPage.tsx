"use client";

import React, { useState } from "react";
import ProductFilterSidebar from "./productsFilter";
import AZProductsPage from "@/components/shared/AZProductsPage";
import AZPagination from "@/components/shared/AZPagination";
import { useAllVariantProductsQuery } from "@/redux/features/product/productApi";
import ProductGridSkeleton from "@/components/shared/skeleton/ProductGridSkeleton";

const ProductsPage = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);

  const {
    data: productsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAllVariantProductsQuery({
    page,
    limit,
  });

  const rawProducts = productsData?.data || [];
  // Ensure exactly up to 12 product cards are displayed per page
  const displayProducts = rawProducts.slice(0, limit);
  const total = productsData?.meta?.total ?? rawProducts.length;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 sm:px-6 py-6 max-w-[1600px] mx-auto items-start">
      {/* Left Sidebar: Filters */}
      <div className="lg:col-span-1 w-full">
        <ProductFilterSidebar />
      </div>

      {/* Right Column: Products Grid & Pagination */}
      <div className="lg:col-span-3 space-y-6 w-full">
        {isLoading || isFetching ? (
          <ProductGridSkeleton
            count={limit}
            gridClassName="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
          />
        ) : isError ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Failed to load products
            </h3>
            <p className="text-xs text-slate-500">
              An error occurred while fetching the products list.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="btn btn-warning btn-sm font-bold"
            >
              Try Again
            </button>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              No products found
            </h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search or filters to find what you are looking for.
            </p>
          </div>
        ) : (
          <AZProductsPage products={displayProducts} />
        )}

        {/* AZPagination Component */}
        {total > 0 && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
            <AZPagination
              page={page}
              limit={limit}
              total={total}
              theme="light"
              limitOptions={[6, 12, 24, 48]}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
