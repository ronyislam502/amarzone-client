"use client";

import { Filter, RotateCcw, Building2, Layers } from "lucide-react";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { useAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { TDepartment } from "@/src/types/department";
import { TCategory } from "@/src/types/category";

export interface ProductsFilterState {
  department: string;
  category: string;
  sort: string;
}

interface ProductsFilterBarProps {
  filters: ProductsFilterState;
  onFilterChange: (newFilters: Partial<ProductsFilterState>) => void;
  onReset: () => void;
}

const ProductsFilterBar = ({
  filters,
  onFilterChange,
  onReset,
}: ProductsFilterBarProps) => {
  const { data: deptData, isLoading: isDeptLoading } = useAllDepartmentsQuery({});
  const { data: catData, isLoading: isCatLoading } = useAllCategoriesQuery({});

  const departments: TDepartment[] = deptData?.data || [];
  const categories: TCategory[] = catData?.data || [];

  const hasActiveFilters =
    Boolean(filters.department) ||
    Boolean(filters.category) ||
    Boolean(filters.sort);

  return (
    <div className="card bg-base-100 shadow-md border border-base-200">
      <div className="card-body p-4 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left: Section Label */}
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-base-content/80">
            <Filter className="w-4 h-4 text-primary" />
            <span>Master Catalog Filters</span>
          </div>

          {/* Right: Reset Action */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-ghost btn-xs text-error gap-1 font-bold hover:bg-error/10 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Filters Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Department Filter */}
          <div className="form-control">
            <label className="label py-1">
              <span className="text-[11px] font-bold text-base-content/70 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-warning" />
                Department
              </span>
            </label>
            <select
              value={filters.department}
              onChange={(e) => onFilterChange({ department: e.target.value })}
              disabled={isDeptLoading}
              className="select select-bordered select-sm w-full font-medium"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="form-control">
            <label className="label py-1">
              <span className="text-[11px] font-bold text-base-content/70 flex items-center gap-1">
                <Layers className="w-3 h-3 text-info" />
                Category
              </span>
            </label>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              disabled={isCatLoading}
              className="select select-bordered select-sm w-full font-medium"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="form-control">
            <label className="label py-1">
              <span className="text-[11px] font-bold text-base-content/70">
                Sort Order
              </span>
            </label>
            <select
              value={filters.sort}
              onChange={(e) => onFilterChange({ sort: e.target.value })}
              className="select select-bordered select-sm w-full font-medium"
            >
              <option value="">Default (Newest)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="title_asc">Title: A to Z</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsFilterBar;
