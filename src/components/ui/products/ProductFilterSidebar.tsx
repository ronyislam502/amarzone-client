"use client";

import React, { ChangeEvent, useState, useEffect } from "react";
import {
  RotateCcw,
  SlidersHorizontal,
  Star,
  Check,
} from "lucide-react";
import {
  ProductFilterSidebarProps,
  PRICE_PRESETS,
  RATING_OPTIONS,
} from "./types";
import AZInput from "@/src/components/ui/shared/form/AZInput";
import AZSelect from "@/src/components/ui/shared/form/AZSelect";

export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  mode,
  categories,
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onChangeMinPrice,
  onChangeMaxPrice,
  minRating,
  onSelectMinRating,
  inStockOnly,
  onToggleInStock,
  availableBrands,
  selectedBrand,
  onSelectBrand,
  activeFilterCount,
  onClearAll,
  className = "",
}) => {
  const [localMinPrice, setLocalMinPrice] = useState<number | "">(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState<number | "">(maxPrice);

  useEffect(() => {
    setLocalMinPrice(minPrice);
  }, [minPrice]);

  useEffect(() => {
    setLocalMaxPrice(maxPrice);
  }, [maxPrice]);

  const handleApplyPrice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onChangeMinPrice(localMinPrice);
    onChangeMaxPrice(localMaxPrice);
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }));

  const brandOptions = availableBrands.map((b) => ({
    value: b,
    label: b,
  }));

  return (
    <div className={`space-y-5 text-sm select-none ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
          <SlidersHorizontal className="w-4 h-4 text-violet-600" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all
          </button>
        )}
      </div>

      {/* Category Filter using AZSelect */}
      {mode !== "category" && categories.length > 0 && (
        <div className="space-y-1.5">
          <AZSelect
            name="sidebar-category"
            label="Category"
            placeholder="All Categories"
            options={categoryOptions}
            value={selectedCategory}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onSelectCategory(e.target.value)
            }
            size="sm"
            selectClassName="!bg-slate-50 !border-slate-200 rounded-xl text-xs text-slate-800 focus:!border-violet-500"
          />
        </div>
      )}

      {/* Brand Filter using AZSelect */}
      {availableBrands.length > 0 && (
        <div className="space-y-1.5">
          <AZSelect
            name="sidebar-brand"
            label="Brand"
            placeholder="All Brands"
            options={brandOptions}
            value={selectedBrand}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onSelectBrand(e.target.value)
            }
            size="sm"
            selectClassName="!bg-slate-50 !border-slate-200 rounded-xl text-xs text-slate-800 focus:!border-violet-500"
          />
        </div>
      )}

      {/* Price Filter using AZInput */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <span className="font-bold text-xs uppercase tracking-wider text-slate-700 block">
          Price Range ($)
        </span>

        {/* Quick price presets */}
        <div className="space-y-1">
          {PRICE_PRESETS.map((preset) => {
            const isMinMatch =
              preset.min !== undefined
                ? minPrice === preset.min
                : minPrice === "" || minPrice === undefined;
            const isMaxMatch =
              preset.max !== undefined
                ? maxPrice === preset.max
                : maxPrice === "" || maxPrice === undefined;
            const isActive =
              (preset.min !== undefined || preset.max !== undefined) &&
              isMinMatch &&
              isMaxMatch;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  if (isActive) {
                    onChangeMinPrice("");
                    onChangeMaxPrice("");
                  } else {
                    onChangeMinPrice(preset.min ?? "");
                    onChangeMaxPrice(preset.max ?? "");
                  }
                }}
                className={`w-full text-left text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "bg-amber-400 text-slate-900 font-bold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Custom Min / Max Inputs using AZInput + Go button */}
        <form onSubmit={handleApplyPrice} className="flex items-center gap-1.5 pt-1">
          <AZInput
            name="minPrice"
            type="number"
            placeholder="Min"
            value={localMinPrice}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setLocalMinPrice(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            size="sm"
            inputClassName="!bg-slate-50 !border-slate-200 rounded-xl text-xs text-slate-800 py-1.5 focus:!border-violet-500"
            containerClassName="w-full"
          />
          <span className="text-slate-400 text-xs font-bold">–</span>
          <AZInput
            name="maxPrice"
            type="number"
            placeholder="Max"
            value={localMaxPrice}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setLocalMaxPrice(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            size="sm"
            inputClassName="!bg-slate-50 !border-slate-200 rounded-xl text-xs text-slate-800 py-1.5 focus:!border-violet-500"
            containerClassName="w-full"
          />
          <button
            type="submit"
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-violet-600 hover:text-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer shrink-0"
          >
            Go
          </button>
        </form>
      </div>

      {/* Customer Rating Filter */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="font-bold text-xs uppercase tracking-wider text-slate-700 block">
          Customer Rating
        </span>
        <div className="space-y-1">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onSelectMinRating(minRating === r ? "" : r)}
              className={`w-full flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                minRating === r
                  ? "bg-amber-50 border border-amber-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3 h-3 ${
                      s <= r
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-100 text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-slate-700">{r}★ & Up</span>
              {minRating === r && (
                <Check className="w-3.5 h-3.5 text-amber-600 ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="pt-2 border-t border-slate-100">
        <span className="font-bold text-xs uppercase tracking-wider text-slate-700 block mb-1.5">
          Availability
        </span>
        <label className="flex items-center gap-2.5 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="checkbox checkbox-xs checkbox-primary rounded-md"
          />
          <span className="text-xs font-semibold text-slate-700">
            In Stock Only
          </span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilterSidebar;
