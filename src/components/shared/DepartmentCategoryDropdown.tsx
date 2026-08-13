"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { useCategoriesByDepartmentQuery, useAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { TDepartment } from "@/types/department";
import { TCategory } from "@/types/category";

interface DepartmentCategoryDropdownProps {
  onSelectCategory?: (categoryName: string, departmentName: string) => void;
  onClose?: () => void;
  className?: string;
}

export default function DepartmentCategoryDropdown({
  onSelectCategory,
  onClose,
  className = "",
}: DepartmentCategoryDropdownProps) {
  // Fetch departments from database
  const {
    data: deptResponse,
    isLoading: isDeptsLoading,
    isError: isDeptsError,
  } = useAllDepartmentsQuery({});

  const departments: TDepartment[] = deptResponse?.data || [];

  // State for selected department (null by default so categories modal is hidden until clicked)
  const [selectedDept, setSelectedDept] = useState<TDepartment | null>(null);

  // Fetch categories for currently selected department from database
  const selectedDeptId = selectedDept?._id || "";
  const {
    data: catResponse,
    isLoading: isCatsLoading,
    isFetching: isCatsFetching,
  } = useCategoriesByDepartmentQuery(selectedDeptId, {
    skip: !selectedDeptId,
  });

  // Fallback: query all categories if department-specific query returns empty or is skipped
  const { data: allCatResponse } = useAllCategoriesQuery(
    {},
    { skip: !selectedDeptId }
  );

  const rawCategories: TCategory[] = catResponse?.data || [];

  // Filter fallback categories matching department ID or name if needed
  const fallbackCategories: TCategory[] = (allCatResponse?.data || []).filter(
    (c: TCategory) => {
      if (!selectedDept) return false;
      if (typeof c.department === "object" && c.department !== null) {
        return (
          c.department._id === selectedDept._id ||
          c.department.name === selectedDept.name
        );
      }
      return (
        c.department === selectedDept._id ||
        c.department === selectedDept.name
      );
    }
  );

  const categoriesToShow =
    rawCategories.length > 0 ? rawCategories : fallbackCategories;

  return (
    <div
      className={`bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col sm:flex-row font-sans z-50 text-slate-800 select-none transition-all duration-200 ${
        selectedDept
          ? "w-[92vw] max-w-[560px] sm:w-[560px]"
          : "w-[92vw] max-w-[280px] sm:w-[280px]"
      } max-h-[85vh] sm:max-h-[520px] ${className}`}
    >
      {/* LEFT COLUMN: All Departments */}
      <div className="w-full sm:w-[280px] bg-white border-b sm:border-b-0 sm:border-r border-slate-200/70 flex flex-col shrink-0">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white sticky top-0 z-10">
          <h3 className="font-extrabold text-xs sm:text-sm text-slate-800 tracking-tight">
            All Departments
          </h3>
          <span className="badge badge-sm badge-neutral text-[10px] font-bold">
            {departments.length}
          </span>
        </div>

        {/* Scrollable Department List */}
        <div className="overflow-y-auto flex-1 py-1 custom-dept-scrollbar max-h-[260px] sm:max-h-[460px]">
          {isDeptsLoading ? (
            <div className="flex flex-col items-center justify-center p-6 gap-2 text-slate-400">
              <span className="loading loading-spinner loading-sm text-primary"></span>
              <span className="text-xs font-semibold">Loading departments...</span>
            </div>
          ) : isDeptsError || departments.length === 0 ? (
            <div className="p-4 text-xs text-slate-500 text-center">
              No departments found in database.
            </div>
          ) : (
            <ul className="menu p-0 text-xs font-semibold text-slate-700 space-y-0.5">
              {/* All Departments Option */}
              <li>
                <Link
                  href="/?all=true"
                  onClick={() => {
                    setSelectedDept(null);
                    if (onClose) onClose();
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-none flex items-center justify-between transition-colors border-l-4 border-transparent text-[#0071dc] font-extrabold hover:bg-blue-50"
                >
                  <span className="truncate pr-2">All Departments</span>
                </Link>
              </li>

              {departments.map((dept) => {
                const isSelected = selectedDept?._id === dept._id;
                return (
                  <li key={dept._id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedDept(null);
                        } else {
                          setSelectedDept(dept);
                        }
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-none flex items-center justify-between transition-colors border-l-4 ${
                        isSelected
                          ? "bg-[#eef5ff] text-[#0071dc] border-[#0071dc] font-bold shadow-inner"
                          : "border-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className="truncate pr-2">{dept.name}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isSelected ? "text-[#0071dc] rotate-90 sm:rotate-0" : "text-slate-400"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Categories Modal / Panel (Only shown when a department is selected) */}
      {selectedDept && (
        <div className="flex-1 bg-[#edf4fc] flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-150 border-t sm:border-t-0 border-slate-200">
          {/* Header: Selected Department Name & Close button */}
          <div className="px-4 py-3 border-b border-blue-100/60 flex items-center justify-between shrink-0 bg-[#edf4fc] sticky top-0 z-10">
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate pr-2">
              {selectedDept.name} Categories
            </h3>
            <div className="flex items-center gap-1.5">
              {(isCatsLoading || isCatsFetching) && (
                <span className="loading loading-spinner loading-xs text-primary shrink-0"></span>
              )}
              <button
                type="button"
                onClick={() => setSelectedDept(null)}
                title="Close Categories Modal"
                className="w-5 h-5 rounded-full hover:bg-blue-200/60 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors text-xs"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Scrollable Categories List */}
          <div className="overflow-y-auto flex-1 py-2 px-1 custom-dept-scrollbar max-h-[260px] sm:max-h-[460px]">
            {isCatsLoading && categoriesToShow.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 gap-2 text-slate-400">
                <span className="loading loading-spinner loading-sm text-primary"></span>
                <span className="text-xs font-semibold">Loading categories...</span>
              </div>
            ) : (
              <ul className="space-y-0.5 text-xs text-slate-700 font-medium">
                {/* "All [Department]" Item (e.g. All Electronics) */}
                <li>
                  <Link
                    href={`/?department=${encodeURIComponent(selectedDept._id)}&deptName=${encodeURIComponent(selectedDept.name)}`}
                    onClick={() => {
                      if (onSelectCategory) {
                        onSelectCategory(`All ${selectedDept.name}`, selectedDept.name);
                      }
                      if (onClose) onClose();
                    }}
                    className="block px-4 py-2 hover:text-[#0071dc] hover:font-bold hover:bg-blue-100/50 rounded-lg transition-colors text-[#0071dc] font-extrabold"
                  >
                    All {selectedDept.name}
                  </Link>
                </li>

                {/* Dynamic Categories From Database */}
                {categoriesToShow.map((cat) => (
                  <li key={cat._id}>
                    <Link
                      href={`/?department=${encodeURIComponent(selectedDept._id)}&category=${encodeURIComponent(cat._id)}&categoryName=${encodeURIComponent(cat.name)}&deptName=${encodeURIComponent(selectedDept.name)}`}
                      onClick={() => {
                        if (onSelectCategory) {
                          onSelectCategory(cat.name, selectedDept.name);
                        }
                        if (onClose) onClose();
                      }}
                      className="block px-4 py-2 hover:text-[#0071dc] hover:font-bold hover:bg-blue-100/50 rounded-lg transition-colors text-slate-700 font-medium"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}

                {/* If no subcategories exist in DB for this department */}
                {categoriesToShow.length === 0 && !isCatsLoading && (
                  <div className="px-4 py-3 text-slate-500 italic text-xs">
                    No categories listed for this department yet.
                  </div>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
