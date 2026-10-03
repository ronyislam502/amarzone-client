"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ProductsPage } from "@/src/components/ui/products/ReusableProductsPage";

export default function DepartmentPage() {
  const params = useParams();
  const departmentSlug = (params?.department as string) || "";

  return (
    <ProductsPage
      mode="department"
      departmentSlug={departmentSlug}
    />
  );
}
