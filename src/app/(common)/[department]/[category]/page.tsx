"use client";

import { useParams } from "next/navigation";
import { ProductsPage } from "@/src/components/ui/products/ReusableProductsPage";

export default function CategoryProductsPage() {
  const params = useParams();
  const departmentSlug = (params?.department as string) || "";
  const categorySlug = (params?.category as string) || "";

  return (
    <ProductsPage
      mode="category"
      departmentSlug={departmentSlug}
      categorySlug={categorySlug}
    />
  );
}
