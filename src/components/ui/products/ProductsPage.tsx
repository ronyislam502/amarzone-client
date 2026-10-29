"use client"

import React, { Suspense, useState } from "react";
import ProductFilterSidebar from "./productsFilter";
import AZProductsPage from "@/components/shared/AZProductsPage";
import AZPagination from "@/components/shared/AZPagination";
import { useAllVariantProductsQuery } from "@/redux/features/product/productApi";
import ProductGridSkeleton from "@/components/shared/skeleton/ProductGridSkeleton";

const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllVariantProductsQuery({
    page,
    limit,
  });

  const total = productsData?.meta?.total ?? 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-6">
      <div className="col-span-1"><ProductFilterSidebar /></div>
      <div className="col-span-3">
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <AZProductsPage products={productsData?.data} />
          </Suspense>
        )}
        {total > 0 && (
          <div className="pt-4 bg-[#124fg4]">
            <AZPagination
              page={page}
              limit={limit}
              total={total}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage;
