"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { ProductBreadcrumbsProps } from "./types";

export const ProductBreadcrumbs: React.FC<ProductBreadcrumbsProps> = ({
  departmentName = "All Departments",
  categoryName = "Category",
  productTitle,
}) => {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-4 flex items-center gap-1.5 flex-wrap">
      <Link
        href="/"
        className="flex items-center gap-1 text-slate-600 hover:text-[#0071dc] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="font-semibold">Home</span>
      </Link>

      <ChevronRight className="w-3 h-3 text-slate-400" />

      <Link
        href="/#department-spotlight"
        className="text-slate-600 hover:text-[#0071dc] transition-colors"
      >
        {departmentName}
      </Link>

      <ChevronRight className="w-3 h-3 text-slate-400" />

      <Link
        href="/#featured-catalog"
        className="text-slate-600 hover:text-[#0071dc] transition-colors"
      >
        {categoryName}
      </Link>

      <ChevronRight className="w-3 h-3 text-slate-400" />

      <span className="text-slate-900 font-bold truncate max-w-sm">
        {productTitle}
      </span>
    </nav>
  );
};

export default ProductBreadcrumbs;
