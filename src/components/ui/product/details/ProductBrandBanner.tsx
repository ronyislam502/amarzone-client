import React from "react";
import { ProductBrandBannerProps } from "./types";

export const ProductBrandBanner: React.FC<ProductBrandBannerProps> = ({
  brand = "Amarzone",
  categoryName = "Premium Catalog",
}) => {
  return (
    <div className="bg-base-200 border-b border-base-300 py-2.5 px-4">
      <div className="max-w-[1480px] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs font-bold text-base-content">
          <span className="text-base text-[#c45500] font-black italic tracking-wide">
            Official {brand} Store
          </span>
          <span className="hidden md:inline-block text-slate-400">|</span>
          <span className="hidden md:inline-block text-slate-600 font-medium">
            Explore {categoryName} Solutions
          </span>
        </div>
        <a
          href="#store"
          className="text-xs text-[#007185] hover:text-[#c45500] hover:underline font-bold shrink-0"
        >
          Shop {brand} ›
        </a>
      </div>
    </div>
  );
};

export default ProductBrandBanner;
