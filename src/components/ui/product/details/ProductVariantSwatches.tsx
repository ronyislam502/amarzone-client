"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { ProductVariantSwatchesProps } from "./types";

export const ProductVariantSwatches: React.FC<ProductVariantSwatchesProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
  selectedImage,
  currentPrice,
  activeColorAttr,
}) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-900">
          Options & Editions:{" "}
          <span className="font-normal text-slate-600">{activeColorAttr}</span>
        </span>
        <span className="text-[11px] font-semibold text-slate-400">
          {variants.length} available
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {variants.map((v, i) => {
          const isSelected = selectedVariant?.asin === v.asin || selectedVariant?._id === v._id;
          const label =
            v.attributes?.map((a) => a.value).join(" / ") ||
            v.sku ||
            `Option ${i + 1}`;
          const vThumb = v.thumbnail || v.images?.[0] || selectedImage;

          return (
            <button
              key={v.asin || v._id || i}
              type="button"
              onClick={() => onSelectVariant(v)}
              className={`p-2 rounded-2xl border-2 transition-all flex items-center gap-2.5 bg-white text-left cursor-pointer ${
                isSelected
                  ? "border-[#0071dc] bg-blue-50/30 shadow-xs ring-1 ring-blue-200"
                  : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              <div className="relative w-9 h-9 overflow-hidden flex items-center justify-center bg-slate-50 rounded-xl shrink-0 p-0.5">
                <Image
                  src={vThumb}
                  alt={label}
                  fill
                  sizes="36px"
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col pr-1.5">
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-bold ${isSelected ? "text-[#0071dc]" : "text-slate-800"}`}>
                    {label}
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-[#0071dc] stroke-[3]" />}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  ${(currentPrice + (i > 0 ? i * 4 : 0)).toFixed(2)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductVariantSwatches;
