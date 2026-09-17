"use client";

import { ChangeEvent, useMemo } from "react";
import {
  Filter,
  RotateCcw,
  Building2,
  Layers,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { useAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { TDepartment } from "@/src/types/department";
import { TCategory } from "@/src/types/category";
import AZInput from "../../../shared/form/AZInput";
import AZSelect from "../../../shared/form/AZSelect";

export interface ProductsFilterState {
  department: string;
  category: string;
  sort: string;
  search?: string;
}

interface ProductsFilterBarProps {
  filters: ProductsFilterState;
  onFilterChange: (newFilters: Partial<ProductsFilterState>) => void;
  onReset: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

const sortOptions = [
  { value: "", label: "Default (Newest First)" },
  { value: "createdAt", label: "Oldest First" },
  { value: "title", label: "Title: A to Z" },
  { value: "-title", label: "Title: Z to A" },
  { value: "brand", label: "Brand: A to Z" },
];

const ProductsFilterBar = ({
  filters,
  onFilterChange,
  onReset,
  searchTerm,
  onSearchChange,
}: ProductsFilterBarProps) => {
  const { data: deptData, isLoading: isDeptLoading } = useAllDepartmentsQuery({
    limit: 0,
  });
  const { data: catData, isLoading: isCatLoading } = useAllCategoriesQuery({
    limit: 0,
  });

  const departments: TDepartment[] = deptData?.data || [];
  const categories: TCategory[] = catData?.data || [];

  const effectiveSearch =
    searchTerm !== undefined ? searchTerm : filters.search || "";

  const departmentOptions = useMemo(() => {
    return departments.map((dept: TDepartment) => ({
      key: dept._id,
      value: dept._id,
      label: dept.name,
    }));
  }, [departments]);

  const categoryOptions = useMemo(() => {
    const list = filters.department
      ? categories.filter((cat: TCategory) => {
          const dId =
            typeof cat.department === "object"
              ? cat.department?._id
              : cat.department;
          return dId === filters.department;
        })
      : categories;

    return list.map((cat: TCategory) => ({
      key: cat._id,
      value: cat._id,
      label: cat.name,
    }));
  }, [categories, filters.department]);

  const hasActiveFilters =
    Boolean(effectiveSearch) ||
    Boolean(filters.department) ||
    Boolean(filters.category) ||
    Boolean(filters.sort);

  const handleSearchChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      onFilterChange({ search: val });
    }
  };

  const handleClearSearch = () => {
    handleSearchChange("");
  };

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 text-slate-100 [&_.label_span]:!text-slate-300 [&_.label_span]:!text-xs">
      {/* Top glowing accent border line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top Header Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-200">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Master Catalog Filters &amp; Controls</span>
          </div>

          {/* Reset Action */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-ghost btn-xs text-rose-400 gap-1 font-bold hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 rounded-lg cursor-pointer transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Filter Controls using AZInput and AZSelect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Reusable AZInput for Search */}
          <AZInput
            name="search"
            label="Search Catalog"
            icon={<Search className="w-3.5 h-3.5 text-amber-400" />}
            placeholder="Search title, brand, tag..."
            value={effectiveSearch}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleSearchChange(e.target.value)
            }
            clearable
            onClear={handleClearSearch}
            size="sm"
            inputClassName="!bg-[#120824] !border-white/15 text-slate-200 focus:!border-amber-400 rounded-xl text-xs placeholder:text-slate-500"
          />

          {/* Reusable AZSelect for Department */}
          <AZSelect
            name="department"
            label="Department"
            icon={<Building2 className="w-3.5 h-3.5 text-amber-400" />}
            placeholder="All Departments"
            options={departmentOptions}
            value={filters.department}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onFilterChange({ department: e.target.value, category: "" })
            }
            disabled={isDeptLoading}
            size="sm"
            selectClassName="!bg-[#120824] !border-white/15 text-slate-200 focus:!border-amber-400 rounded-xl text-xs"
          />

          {/* Reusable AZSelect for Category */}
          <AZSelect
            name="category"
            label="Category"
            icon={<Layers className="w-3.5 h-3.5 text-sky-400" />}
            placeholder={
              !filters.department
                ? "All Categories"
                : categoryOptions.length === 0
                ? "No categories in dept"
                : "All Categories"
            }
            options={categoryOptions}
            value={filters.category}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onFilterChange({ category: e.target.value })
            }
            disabled={isCatLoading}
            size="sm"
            selectClassName="!bg-[#120824] !border-white/15 text-slate-200 focus:!border-amber-400 rounded-xl text-xs"
          />

          {/* Reusable AZSelect for Sort Order */}
          <AZSelect
            name="sort"
            label="Sort Order"
            icon={<ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />}
            placeholder="Default (Newest Listings)"
            options={sortOptions}
            value={filters.sort}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onFilterChange({ sort: e.target.value })
            }
            size="sm"
            selectClassName="!bg-[#120824] !border-white/15 text-slate-200 focus:!border-amber-400 rounded-xl text-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsFilterBar;
