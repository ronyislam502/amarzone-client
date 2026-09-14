"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSingleProductQuery, useAllProductsQuery } from "@/src/redux/features/product/productApi";
import { useGetInventoryByAsinQuery } from "@/src/redux/features/inventory/inventoryApi";
import ProductDetailsView from "@/src/components/ui/product/ProductDetailsView";
import ProductSkeleton from "@/src/components/ui/product/ProductSkeleton";
import ProductNotFound from "@/src/components/ui/product/ProductNotFound";
import { TProduct as TParentProduct, TVariant } from "@/src/types/product";
import { TInventoryResult } from "@/src/types/inventory";

const SingleProductPage: React.FC = () => {
  const params = useParams();
  const rawId = params?.id;
  const productId = Array.isArray(rawId) ? rawId[0] : (rawId as string);

  // 1. Fetch single product data from backend API
  const {
    data: productResponse,
    isLoading: productLoading,
    isError,
    error: productError,
  } = useSingleProductQuery(productId, { skip: !productId });

  const product: TParentProduct | null = (productResponse as any)?.data || null;

  const [selectedVariant, setSelectedVariant] = useState<TVariant | null>(null);

  // Sync default variant when product data loads
  useEffect(() => {
    if (product && Array.isArray(product.variants) && product.variants.length > 0) {
      if (!selectedVariant) {
        setSelectedVariant(product.variants[0]);
      }
    }
  }, [product, selectedVariant]);

  // 2. Fetch inventory for selected variant ASIN
  const activeAsin = selectedVariant?.asin || "";
  const {
    data: inventoryResponse,
    isLoading: inventoryLoading,
  } = useGetInventoryByAsinQuery(activeAsin, { skip: !activeAsin });

  const inventory: TInventoryResult | null = (inventoryResponse as any)?.data || null;

  // 3. Fetch related category products for "Customers also considered"
  const categoryId = product?.category?._id || "";
  const { data: categoryProductsResponse } = useAllProductsQuery(
    { category: categoryId, limit: 12 },
    { skip: !categoryId }
  );

  const categoryProducts: TParentProduct[] = (categoryProductsResponse as any)?.data || [];

  if (productLoading) {
    return <ProductSkeleton />;
  }

  if (isError || !product) {
    const errorMsg =
      (productError as any)?.data?.message ||
      "The requested product could not be found or has been removed.";
    return <ProductNotFound errorMessage={errorMsg} />;
  }

  return (
    <ProductDetailsView
      product={product}
      inventory={inventory}
      inventoryLoading={inventoryLoading}
      selectedVariant={selectedVariant}
      onSelectVariant={(v) => setSelectedVariant(v)}
      categoryProducts={categoryProducts}
    />
  );
};

export default SingleProductPage;
