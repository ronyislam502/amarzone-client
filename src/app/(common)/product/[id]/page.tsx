"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { useSingleProductQuery, useAllProductsQuery } from "@/redux/features/product/productApi";
import { useGetInventoryByAsinQuery } from "@/redux/features/inventory/inventoryApi";
import { ProductDetailsView, TParentProduct, TVariant, TInventoryResult } from "@/components/product/ProductDetailsView";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";

const ProductDetailsContent = () => {
  const params = useParams();
  const productId = params?.id as string;

  // 1. Redux RTK Query for Product Data
  const {
    data: productResponse,
    isLoading: productLoading,
    isError,
    error: productError,
  } = useSingleProductQuery(productId, { skip: !productId });

  const product: TParentProduct | null = productResponse?.data || null;

  const [selectedVariant, setSelectedVariant] = useState<TVariant | null>(null);

  // Sync default variant when product data loads
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      if (!selectedVariant) {
        setSelectedVariant(product.variants[0]);
      }
    }
  }, [product, selectedVariant]);

  // 2. Redux RTK Query for Inventory Data
  const activeAsin = selectedVariant?.asin || "";
  const {
    data: inventoryResponse,
    isLoading: inventoryLoading,
  } = useGetInventoryByAsinQuery(activeAsin, { skip: !activeAsin });

  const inventory: TInventoryResult | null = inventoryResponse?.data || null;

  // 3. Redux RTK Query for Category Alternative Products
  const categoryId = product?.category?._id || "";
  const { data: categoryProductsResponse } = useAllProductsQuery(
    { category: categoryId, limit: 8 },
    { skip: !categoryId }
  );

  const categoryProducts: TParentProduct[] = categoryProductsResponse?.data || [];

  if (productLoading) {
    return <ProductSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="alert alert-error max-w-lg mx-auto shadow-md rounded-2xl p-6">
          <div>
            <h3 className="font-extrabold text-lg">Product Not Found</h3>
            <p className="text-sm mt-1">
              {(productError as any)?.data?.message || "Unable to retrieve product details from database."}
            </p>
          </div>
        </div>
      </div>
    );
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

const ProductDetailsPage = () => {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetailsContent />
    </Suspense>
  );
};

export default ProductDetailsPage;
