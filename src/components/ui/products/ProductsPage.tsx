"use client";

import { useState } from "react";
import AZProductsPage from "@/components/shared/AZProductsPage";
import { useAllVariantProductsQuery } from "@/redux/features/product/productApi";

const ProductsPage = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 15

  const {
    data: productsData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAllVariantProductsQuery({
    page,
    limit,
  });

  const rawProducts = productsData?.data || [];
  const meta = productsData?.meta;

  return (
    <AZProductsPage
      products={rawProducts}
      isLoading={isLoading}
      isFetching={isFetching}
      isError={isError}
      refetch={refetch}
      page={page}
      setPage={setPage}
      limit={limit}
      meta={meta}
    />
  );
};

export default ProductsPage;
