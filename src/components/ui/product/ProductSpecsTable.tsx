"use client";

import React, { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { TProduct as TParentProduct, TVariant } from "@/src/types/product";

interface ProductSpecsTableProps {
  product: TParentProduct;
  selectedVariant: TVariant | null;
}

export const ProductSpecsTable: React.FC<ProductSpecsTableProps> = ({
  product,
  selectedVariant,
}) => {
  const [showFullSpecs, setShowFullSpecs] = useState(false);

  const specsList = [
    { label: "Brand", value: product.brand || "Amarzone Verified" },
    { label: "Department", value: product.department?.name || "General Goods" },
    { label: "Category", value: product.category?.name || "Catalog" },
    { label: "SKU / Item ID", value: selectedVariant?.sku || product._id.slice(0, 10).toUpperCase() },
    { label: "ASIN / Serial", value: selectedVariant?.asin || "N/A" },
    ...(selectedVariant?.attributes?.map((attr) => ({
      label: attr.type,
      value: attr.value,
    })) || []),
  ];

  if (showFullSpecs) {
    specsList.push(
      { label: "Direct Vendor ID", value: (product.author as any)?.name || "Amarzone Logistics" },
      { label: "Product Database ID", value: product._id },
      { label: "Warranty & Support", value: "90-Day Amarzone Standard Limited Warranty" }
    );
  }

  return (
    <div className="space-y-3 pt-4 border-t border-slate-200/80">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-[#0071dc]" />
        <h3 className="text-sm font-black text-slate-900">Specifications</h3>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 text-xs">
        <table className="w-full text-left border-collapse">
          <tbody>
            {specsList.map((spec, idx) => (
              <tr
                key={spec.label}
                className={idx % 2 === 0 ? "bg-slate-50/60" : "bg-white"}
              >
                <td className="py-2.5 px-3.5 font-bold text-slate-600 w-1/3 border-b border-slate-100">
                  {spec.label}
                </td>
                <td className="py-2.5 px-3.5 text-slate-900 font-medium border-b border-slate-100">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => setShowFullSpecs(!showFullSpecs)}
        className="text-xs text-[#0071dc] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer pt-1"
      >
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${showFullSpecs ? "rotate-180" : ""}`}
        />
        <span>{showFullSpecs ? "Show less specifications" : "Show all specifications"}</span>
      </button>
    </div>
  );
};

export default ProductSpecsTable;
