"use client";

import { useState, useEffect } from "react";
import {
  Filter,
  RotateCcw,
} from "lucide-react";
import AZSelect, { TAZSelectOption } from "@/components/shared/form/AZSelect";
import { useDebounce } from "@/components/shared/Debaounce";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { TDepartment } from "@/types/department";
import AZInput from "@/components/shared/form/AZInput";

export interface CategoriesFilterState {
  search: string;
  status: string;
  sort: string;
  department: string;
}

export interface CategoriesFilterProps {
  filters?: CategoriesFilterState;
  onFilterChange?: (newFilters: Partial<CategoriesFilterState>) => void;
  onReset?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

const statusOptions: TAZSelectOption[] = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active Categories" },
  { value: "inactive", label: "Archived / Inactive" },
];

const sortOptions: TAZSelectOption[] = [
  { value: "", label: "Default (Newest First)" },
  { value: "name_asc", label: "Category Name: A to Z" },
  { value: "name_desc", label: "Category Name: Z to A" },
  { value: "oldest", label: "Creation: Oldest First" },
];

const defaultFilters: CategoriesFilterState = {
  search: "",
  status: "",
  sort: "",
  department: "",
};

const CategoriesFilter = ({
  filters = defaultFilters,
  onFilterChange,
  onReset,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search categories by name...",
}: CategoriesFilterProps) => {
  const currentSearch =
    filters?.search !== undefined
      ? filters.search
      : searchValue ?? "";

  const [searchValueLocal, setSearchValueLocal] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchValueLocal, 500);

  // Fetch departments to populate department filter options
  const { data: departmentsData } = useAllDepartmentsQuery({ limit: "100" });
  const rawDepartments: TDepartment[] = Array.isArray(departmentsData?.data)
    ? departmentsData.data
    : (departmentsData?.data as any)?.data || [];

  const departmentOptions: TAZSelectOption[] = [
    { value: "", label: "All Departments" },
    ...rawDepartments.map((dept) => ({
      value: dept._id,
      label: dept.name,
    })),
  ];

  useEffect(() => {
    setSearchValueLocal(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      if (onSearchChange) {
        onSearchChange(debouncedSearch);
      }
      if (onFilterChange) {
        onFilterChange({
          search: debouncedSearch,
        });
      }
    }
  }, [debouncedSearch]);

  const hasActiveFilters =
    Boolean(filters?.status) ||
    Boolean(filters?.sort) ||
    Boolean(filters?.department) ||
    Boolean(searchValueLocal);

  const handleSearchChange = (val: string) => {
    setSearchValueLocal(val);
  };

  const handleReset = () => {
    setSearchValueLocal("");
    if (onSearchChange) {
      onSearchChange("");
    }
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#170d2f] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* Top glowing accent border ray */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none z-10" />

      {/* Subtle ambient glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Left: Section Label */}
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary">
            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <span>Category Catalog Filters</span>
          </div>

          {/* Right: Reset Action */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-ghost btn-xs text-rose-400 gap-1.5 font-bold hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 rounded-xl cursor-pointer transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Filters Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Category Input */}
          <div>
            <AZInput
              name="search"
              label="Search Category"
              placeholder={searchPlaceholder}
              value={searchValueLocal}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <AZSelect
            name="department"
            label="Filter Department"
            placeholder="All Departments"
            options={departmentOptions}
            value={filters?.department || ""}
            onChange={(e) => onFilterChange?.({ department: e.target.value })}
          />

          {/* Status Filter */}
          <AZSelect
            name="status"
            label="Category Status"
            placeholder="All Statuses"
            options={statusOptions}
            value={filters?.status || ""}
            onChange={(e) => onFilterChange?.({ status: e.target.value })}
          />

          {/* Sort Filter */}
          <AZSelect
            name="sort"
            label="Sort Order"
            placeholder="Default (Newest First)"
            options={sortOptions}
            value={filters?.sort || ""}
            onChange={(e) => onFilterChange?.({ sort: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoriesFilter;
