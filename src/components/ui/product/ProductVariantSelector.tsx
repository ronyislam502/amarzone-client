"use client";

import React, { useState } from "react";
import { TVariant, TAttribute } from "@/types/product";
import { Copy, Check, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

interface ProductVariantSelectorProps {
  variants: TVariant[];
  selectedVariant: TVariant;
  onSelectVariant: (variant: TVariant) => void;
}

export const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
}) => {
  const [copiedAsin, setCopiedAsin] = useState(false);
  const [copiedSku, setCopiedSku] = useState(false);

  if (!variants || variants.length === 0) return null;

  const handleCopy = (text: string, type: "asin" | "sku") => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      if (type === "asin") {
        setCopiedAsin(true);
        setTimeout(() => setCopiedAsin(false), 1800);
      } else {
        setCopiedSku(true);
        setTimeout(() => setCopiedSku(false), 1800);
      }
      toast.success(`Copied ${type.toUpperCase()}: ${text}`, {
        position: "bottom-right",
        autoClose: 1600,
      });
    }
  };

  // Helper to extract attribute label from a variant
  const getVariantLabel = (variant: TVariant, index: number) => {
    if (Array.isArray(variant.attributes) && variant.attributes.length > 0) {
      return variant.attributes.map((attr) => `${attr.type}: ${attr.value}`).join(" | ");
    }
    return `Option ${index + 1}`;
  };

  // Group attributes by type across all variants (e.g. Size: [...], Flavor: [...])
  const attributeTypes = Array.from(
    new Set(
      variants.flatMap((v) =>
        Array.isArray(v.attributes) ? v.attributes.map((a) => a.type) : []
      )
    )
  );

  return (
    <div className="py-3 border-b border-slate-200 space-y-3.5 select-none">
      {/* If variants have structured attributes, show Amazon-style attribute selector */}
      {attributeTypes.length > 0 ? (
        attributeTypes.map((type) => {
          // Current selected value for this attribute type
          const currentAttr = Array.isArray(selectedVariant?.attributes)
            ? selectedVariant.attributes.find((a) => a.type === type)?.value
            : "";

          return (
            <div key={type} className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium">{type}:</span>
                <span className="text-slate-900 font-bold">{currentAttr || "Selected"}</span>
              </div>

              {/* Swatch options for this type */}
              <div className="flex flex-wrap gap-2">
                {variants.map((variant, idx) => {
                  const val = Array.isArray(variant.attributes)
                    ? variant.attributes.find((a) => a.type === type)?.value
                    : `Option ${idx + 1}`;
                  const isSelected = variant._id === selectedVariant._id;

                  return (
                    <button
                      key={variant._id || idx}
                      type="button"
                      onClick={() => onSelectVariant(variant)}
                      className={`relative px-3.5 py-2 rounded-lg text-xs transition-all duration-150 border cursor-pointer text-left ${
                        isSelected
                          ? "border-[#e77600] ring-2 ring-[#e77600]/30 bg-amber-50/30 text-slate-900 font-bold shadow-xs"
                          : "border-slate-200 hover:border-slate-400 bg-white text-slate-700 hover:bg-slate-50 font-normal"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#e77600] shrink-0" />
                        )}
                        <span>{val}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        /* Fallback if no structured attributes: generic variant list */
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-slate-700">
            Available Options ({variants.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant, idx) => {
              const isSelected = variant._id === selectedVariant._id;
              return (
                <button
                  key={variant._id || idx}
                  type="button"
                  onClick={() => onSelectVariant(variant)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all border cursor-pointer ${
                    isSelected
                      ? "border-[#e77600] ring-2 ring-[#e77600]/30 bg-amber-50 text-slate-900 font-bold"
                      : "border-slate-200 hover:border-slate-400 bg-white text-slate-700 font-medium"
                  }`}
                >
                  {getVariantLabel(variant, idx)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Identifiers: ASIN and SKU (Amazon Spec) */}
      <div className="flex items-center flex-wrap gap-3 pt-1 text-[11px] text-slate-500">
        {selectedVariant.asin && (
          <div className="flex items-center gap-1 bg-slate-100/80 px-2 py-1 rounded border border-slate-200">
            <span className="font-semibold text-slate-700">ASIN:</span>
            <span className="font-mono text-slate-900 font-medium">{selectedVariant.asin}</span>
            <button
              type="button"
              onClick={() => handleCopy(selectedVariant.asin, "asin")}
              title="Copy ASIN"
              aria-label="Copy ASIN"
              className="ml-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              {copiedAsin ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        )}

        {selectedVariant.sku && (
          <div className="flex items-center gap-1 bg-slate-100/80 px-2 py-1 rounded border border-slate-200">
            <span className="font-semibold text-slate-700">SKU:</span>
            <span className="font-mono text-slate-900 font-medium">{selectedVariant.sku}</span>
            <button
              type="button"
              onClick={() => handleCopy(selectedVariant.sku, "sku")}
              title="Copy SKU"
              aria-label="Copy SKU"
              className="ml-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              {copiedSku ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductVariantSelector;
