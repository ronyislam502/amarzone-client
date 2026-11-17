"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, Layers, Loader2 } from "lucide-react";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import {
    useAllCategoriesQuery,
    useAllCategoryByDepartmentQuery,
} from "@/redux/features/category/categoryApi";
import { TDepartment } from "@/types/department";
import { TCategory } from "@/types/category";

const Departments: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 1. Fetch all departments
    const { data: departmentsData, isLoading: isLoadingDepts } = useAllDepartmentsQuery({});
    const departments: TDepartment[] = departmentsData?.data || [];

    // 2. Track selected department (defaults to first department when loaded)
    const [selectedDept, setSelectedDept] = useState<TDepartment | null>(null);

    useEffect(() => {
        if (!selectedDept && departments.length > 0) {
            setSelectedDept(departments[0]);
        }
    }, [departments, selectedDept]);

    // 3. Fetch all categories (cached globally for instant switching)
    const { data: allCategoriesData } = useAllCategoriesQuery({ limit: 200 });

    // 4. Fetch department-specific categories for the currently active department
    const {
        data: deptCategoriesData,
        isFetching: isFetchingDeptCats,
    } = useAllCategoryByDepartmentQuery(selectedDept?._id, {
        skip: !selectedDept?._id,
    });

    // Resolve categories for the active department
    const activeCategories: TCategory[] = useMemo(() => {
        if (!selectedDept?._id) return [];

        // If department-specific API returned categories, prefer them
        if (
            deptCategoriesData?.data &&
            Array.isArray(deptCategoriesData.data) &&
            deptCategoriesData.data.length > 0
        ) {
            return deptCategoriesData.data;
        }

        // Otherwise filter from the all-categories list (zero latency)
        const allCats: any[] = allCategoriesData?.data || [];
        return allCats.filter((cat: any) => {
            const catDeptId =
                typeof cat?.department === "object"
                    ? cat?.department?._id
                    : cat?.department;
            const catDeptName =
                typeof cat?.department === "object" ? cat?.department?.name : "";

            return (
                String(catDeptId) === String(selectedDept._id) ||
                (catDeptName &&
                    catDeptName.toLowerCase() === selectedDept.name.toLowerCase())
            );
        });
    }, [selectedDept, deptCategoriesData, allCategoriesData]);

    // Close dropdown on outside click or Escape key
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Departments Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className="btn btn-sm sm:btn-md bg-[#0071dc] hover:bg-[#005bb5] text-white rounded-full px-3.5 sm:px-4 border-none shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer select-none"
            >
                <Layers className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white">Departments</span>
                <ChevronDown
                    className={`w-3.5 h-3.5 text-white/90 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Flyout 2-Column Mega Dropdown Panel */}
            {isOpen && (
                <div
                    role="region"
                    aria-label="Departments menu"
                    className="absolute left-0 top-full mt-2.5 w-[560px] max-w-[92vw] h-[480px] bg-white rounded-xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden flex select-none animate-in fade-in zoom-in-95 duration-150"
                >
                    {/* ────────────────────────────────────────────────────────
                        LEFT COLUMN: All Departments
                    ──────────────────────────────────────────────────────── */}
                    <div className="w-1/2 bg-white flex flex-col h-full border-r border-slate-300/80">
                        {/* Column Header */}
                        <div className="px-5 pt-4 pb-2.5 shrink-0">
                            <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">
                                All Departments
                            </h3>
                        </div>

                        {/* Scrollable Departments List */}
                        <div className="flex-1 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
                            {isLoadingDepts && (
                                <div className="p-5 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0071dc]" />
                                    <span>Loading departments...</span>
                                </div>
                            )}

                            {!isLoadingDepts && departments.length === 0 && (
                                <p className="px-5 py-3 text-xs text-slate-400">
                                    No departments found
                                </p>
                            )}

                            {departments.map((dept) => {
                                const isSelected = selectedDept?._id === dept._id;
                                return (
                                    <button
                                        key={dept._id}
                                        type="button"
                                        onClick={() => setSelectedDept(dept)}
                                        onMouseEnter={() => setSelectedDept(dept)}
                                        className={`w-full text-left px-5 py-2.5 text-[13.5px] transition-colors flex items-center justify-between cursor-pointer ${
                                            isSelected
                                                ? "bg-[#e8f0fe] font-semibold text-slate-900"
                                                : "text-slate-700 hover:bg-slate-50 font-normal"
                                        }`}
                                    >
                                        <span className="truncate">{dept.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ────────────────────────────────────────────────────────
                        RIGHT COLUMN: Selected Department Categories
                    ──────────────────────────────────────────────────────── */}
                    <div className="w-1/2 bg-[#edf4fe] flex flex-col h-full">
                        {/* Column Header */}
                        <div className="px-5 pt-4 pb-2.5 shrink-0">
                            <h3 className="text-[15px] font-bold text-slate-900 tracking-tight truncate">
                                {selectedDept?.name || "Categories"}
                            </h3>
                        </div>

                        {/* Scrollable Categories List */}
                        <div className="flex-1 overflow-y-auto py-1 px-5 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-300">
                            {/* "Shop All" Main Action Link */}
                            {selectedDept && (
                                <Link
                                    href={`/${selectedDept.name}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block py-2 text-[13.5px] font-medium text-slate-800 hover:text-[#0071dc] hover:underline transition-colors"
                                >
                                    Shop All
                                </Link>
                            )}

                            {/* Loading State */}
                            {isFetchingDeptCats && activeCategories.length === 0 && (
                                <div className="py-4 text-xs text-slate-400 flex items-center gap-1.5">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0071dc]" />
                                    <span>Loading categories...</span>
                                </div>
                            )}

                            {/* Empty State */}
                            {!isFetchingDeptCats &&
                                activeCategories.length === 0 &&
                                selectedDept && (
                                    <p className="py-3 text-xs text-slate-400">
                                        No categories in this department
                                    </p>
                                )}

                            {/* Category Items */}
                            {activeCategories.map((category) => (
                                <Link
                                    key={category._id}
                                    href={`/products?department=${selectedDept?._id}&category=${category._id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block py-2 text-[13.5px] text-slate-700 hover:text-[#0071dc] hover:underline transition-colors"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Departments;
