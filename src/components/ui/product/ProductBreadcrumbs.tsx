import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductBreadcrumbsProps {
  departmentName?: string;
  departmentId?: string;
  categoryName?: string;
  categoryId?: string;
  productTitle?: string;
}

export const ProductBreadcrumbs: React.FC<ProductBreadcrumbsProps> = ({
  departmentName,
  departmentId,
  categoryName,
  categoryId,
  productTitle,
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-xs text-slate-500 py-2.5 overflow-x-auto whitespace-nowrap scrollbar-none"
    >
      <Link
        href="/"
        className="hover:text-blue-600 hover:underline transition-colors shrink-0 font-medium"
      >
        Home
      </Link>

      {departmentName && (
        <>
          <ChevronRight className="w-3 h-3 mx-1.5 text-slate-400 shrink-0" />
          <Link
            href={`/departments/${departmentId || ""}`}
            className="hover:text-blue-600 hover:underline transition-colors shrink-0"
          >
            {departmentName}
          </Link>
        </>
      )}

      {categoryName && (
        <>
          <ChevronRight className="w-3 h-3 mx-1.5 text-slate-400 shrink-0" />
          <Link
            href={`/categories/${categoryId || ""}`}
            className="hover:text-blue-600 hover:underline transition-colors shrink-0"
          >
            {categoryName}
          </Link>
        </>
      )}

      {productTitle && (
        <>
          <ChevronRight className="w-3 h-3 mx-1.5 text-slate-400 shrink-0" />
          <span
            className="text-slate-700 font-medium truncate max-w-[280px] sm:max-w-[420px]"
            title={productTitle}
          >
            {productTitle}
          </span>
        </>
      )}
    </nav>
  );
};

export default ProductBreadcrumbs;
