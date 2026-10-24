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

const ProductBread: React.FC<ProductBreadcrumbsProps> = ({
  departmentName,
  departmentId,
  categoryName,
  categoryId,
  productTitle,
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-xs text-slate-500 py-1.5 overflow-x-auto whitespace-nowrap scrollbar-none select-none"
    >
      <Link
        href="/"
        className="hover:text-[#007185] hover:underline transition-colors shrink-0"
      >
        Home
      </Link>

      {departmentName && (
        <>
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 shrink-0" />
          <Link
            href={departmentId ? `/departments/${departmentId}` : "/products"}
            className="hover:text-[#007185] hover:underline transition-colors shrink-0"
          >
            {departmentName}
          </Link>
        </>
      )}

      {categoryName && (
        <>
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 shrink-0" />
          <Link
            href={categoryId ? `/categories/${categoryId}` : "/products"}
            className="hover:text-[#007185] hover:underline transition-colors shrink-0"
          >
            {categoryName}
          </Link>
        </>
      )}

      {productTitle && (
        <>
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 shrink-0" />
          <span
            className="text-slate-600 truncate max-w-[280px] sm:max-w-[440px] md:max-w-[580px]"
            title={productTitle}
          >
            {productTitle}
          </span>
        </>
      )}
    </nav>
  );
};

export default ProductBread;
