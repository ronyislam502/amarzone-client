"use client";

import React from "react";
import { TProduct, TVariant } from "@/types/product";

interface ProductDetailsTableProps {
  product?: TProduct;
  selectedVariant?: TVariant | null;
}

export const ProductDetailsTable: React.FC<ProductDetailsTableProps> = ({
  product,
  selectedVariant,
}) => {
  const specs: { label: string; value: string }[] = [];

  if (product?.brand) {
    specs.push({ label: "Brand", value: product.brand });
  }

  if (selectedVariant?.asin) {
    specs.push({ label: "ASIN", value: selectedVariant.asin });
  }

  if (selectedVariant?.sku) {
    specs.push({ label: "Item Model / SKU", value: selectedVariant.sku });
  }

  const categoryName = (product?.category as any)?.name;
  if (categoryName) {
    specs.push({ label: "Product Category", value: categoryName });
  }

  const departmentName = (product?.department as any)?.name;
  if (departmentName) {
    specs.push({ label: "Department", value: departmentName });
  }

  if (Array.isArray(selectedVariant?.attributes)) {
    selectedVariant.attributes.forEach((attr: any) => {
      if (attr.type && attr.value) {
        specs.push({ label: attr.type, value: attr.value });
      }
    });
  }

  if (Array.isArray(product?.tags) && product.tags.length > 0) {
    specs.push({ label: "Tags", value: product.tags.join(", ") });
  }

  if (specs.length === 0) {
    return null;
  }

  return (
    <div className="pt-8 border-t border-slate-200 select-none">
      <h2 className="text-lg font-bold text-[#0f1111] mb-4">
        Technical Details & Specifications
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
        {specs.map((item, index) => (
          <div
            key={item.label}
            className={`flex items-center justify-between py-2 px-3 rounded ${
              index % 2 === 0 ? "bg-slate-50" : "bg-white"
            } border border-slate-100`}
          >
            <span className="font-semibold text-slate-600">{item.label}</span>
            <span className="text-slate-900 font-medium text-right truncate max-w-[220px]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailsTable;
