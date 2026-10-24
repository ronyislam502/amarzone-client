"use client";

import React, { useMemo } from "react";
import { TVariant } from "@/types/product";
import { Copy, Check, Star } from "lucide-react";
import { toast } from "react-toastify";

interface ProductVariantSelectorProps {
  variants?: TVariant[];
  selectedVariant?: TVariant | null;
  onSelectVariant?: (variant: TVariant) => void;
  averageRating?: string | number;
  totalRatings?: number;
}

export const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  variants = [],
  selectedVariant,
  onSelectVariant,
  averageRating = 0,
  totalRatings = 0,
}) => {
  const [copiedAsin, setCopiedAsin] = React.useState(false);
  const [copiedSku, setCopiedSku] = React.useState(false);

  // Discover all attribute types dynamically across provided variants
  const attributeTypes = useMemo(() => {
    const types: string[] = [];
    if (Array.isArray(variants)) {
      variants.forEach((v) => {
        if (Array.isArray(v.attributes)) {
          v.attributes.forEach((attr) => {
            if (attr.type && !types.some((t) => t.toLowerCase() === attr.type.toLowerCase())) {
              types.push(attr.type);
            }
          });
        }
      });
    }
    return types;
  }, [variants]);

  // Discover all values for each attribute type from real variants
  const attributeOptions = useMemo(() => {
    const map: Record<string, string[]> = {};
    attributeTypes.forEach((type) => {
      const values: string[] = [];
      if (Array.isArray(variants)) {
        variants.forEach((v) => {
          if (Array.isArray(v.attributes)) {
            v.attributes.forEach((attr) => {
              if (
                attr.type?.toLowerCase() === type.toLowerCase() &&
                attr.value &&
                !values.some((val) => val.toLowerCase() === attr.value.toLowerCase())
              ) {
                values.push(attr.value);
              }
            });
          }
        });
      }
      map[type] = values;
    });
    return map;
  }, [variants, attributeTypes]);

  // Determine current active value for each attribute type
  const activeAttributes = useMemo(() => {
    const current: Record<string, string> = {};
    attributeTypes.forEach((type) => {
      const found = selectedVariant?.attributes?.find(
        (a) => a.type.toLowerCase() === type.toLowerCase()
      )?.value;
      current[type] = found || attributeOptions[type]?.[0] || "";
    });
    return current;
  }, [selectedVariant, attributeTypes, attributeOptions]);

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

  // Handle clicking on an attribute option
  const handleSelectAttribute = (type: string, value: string) => {
    const nextAttributes = {
      ...activeAttributes,
      [type]: value,
    };

    // Try to find exact variant matching all attributes
    let matchedVariant = variants.find((v) => {
      if (!Array.isArray(v.attributes) || v.attributes.length === 0) return false;
      return Object.entries(nextAttributes).every(([attrType, attrVal]) => {
        return v.attributes.some(
          (a) =>
            a.type.toLowerCase() === attrType.toLowerCase() &&
            a.value.toLowerCase() === attrVal.toLowerCase()
        );
      });
    });

    // Fallback: find variant that has this attribute value
    if (!matchedVariant) {
      matchedVariant = variants.find((v) =>
        v.attributes?.some(
          (a) =>
            a.type.toLowerCase() === type.toLowerCase() &&
            a.value.toLowerCase() === value.toLowerCase()
        )
      );
    }

    if (matchedVariant) {
      onSelectVariant?.(matchedVariant);
    }
  };

  const currentAsin = selectedVariant?.asin || "";
  const currentSku = selectedVariant?.sku || "";

  if (variants.length === 0 && !currentAsin && !currentSku) {
    return null;
  }

  const numericRating =
    typeof averageRating === "string"
      ? isNaN(parseFloat(averageRating))
        ? 0
        : parseFloat(averageRating)
      : averageRating || 0;

  return (
    <div className="py-3.5 border-b border-slate-200/80 space-y-4 select-none">
      {/* Dynamic Attribute Selectors */}
      {attributeTypes.map((type) => {
        const options = attributeOptions[type] || [];
        const currentValue = activeAttributes[type];

        if (options.length <= 1) return null;

        return (
          <div key={type} className="space-y-1.5">
            <div className="text-xs text-slate-700">
              <span>{type}: </span>
              <span className="font-bold text-[#0f1111]">{currentValue}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                const isSelected =
                  currentValue?.toLowerCase() === option?.toLowerCase();

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelectAttribute(type, option)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "border-2 border-[#e77600] bg-white text-[#0f1111] font-bold shadow-2xs"
                        : "border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-normal"
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#e77600] stroke-[2.5]" />
                    )}
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Identifiers: ASIN and SKU Pills & Rating Pill */}
      {(currentAsin || currentSku || totalRatings > 0) && (
        <div className="flex items-center flex-wrap gap-2.5 pt-1 text-xs text-slate-600">
          {/* ASIN Pill */}
          {currentAsin && (
            <div className="flex items-center gap-1 bg-slate-100/90 hover:bg-slate-200/70 transition-colors px-2.5 py-1 rounded-md border border-slate-200 text-[11px]">
              <span className="font-semibold text-slate-700">ASIN:</span>
              <span className="font-mono text-slate-900 font-medium">
                {currentAsin}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(currentAsin, "asin")}
                title="Copy ASIN"
                aria-label="Copy ASIN"
                className="ml-1 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                {copiedAsin ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          )}

          {/* SKU Pill */}
          {currentSku && (
            <div className="flex items-center gap-1 bg-slate-100/90 hover:bg-slate-200/70 transition-colors px-2.5 py-1 rounded-md border border-slate-200 text-[11px]">
              <span className="font-semibold text-slate-700">SKU:</span>
              <span className="font-mono text-slate-900 font-medium">
                {currentSku}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(currentSku, "sku")}
                title="Copy SKU"
                aria-label="Copy SKU"
                className="ml-1 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                {copiedSku ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          )}

          {/* Rating Pill */}
          <a
            href="#customer-reviews"
            className="flex items-center gap-1.5 bg-amber-50/70 hover:bg-amber-100/80 transition-colors px-2.5 py-1 rounded-md border border-amber-200/80 text-[11px] text-slate-800 cursor-pointer"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span className="font-bold text-[#0f1111]">
              {numericRating > 0 ? numericRating.toFixed(1) : "0.0"}
            </span>
            <span className="text-[#007185] hover:underline font-normal">
              ({totalRatings} reviews)
            </span>
          </a>
        </div>
      )}
    </div>
  );
};

export default ProductVariantSelector;
