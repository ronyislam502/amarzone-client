"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ChevronLeft, Layers } from "lucide-react";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { useAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { TDepartment } from "@/types/department";

const Departments = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<TDepartment | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 1. Fetch all departments
    const { data: departmentsData, isLoading: isLoadingDepts } = useAllDepartmentsQuery({});
    const departments: TDepartment[] = departmentsData?.data || [];

    // 2. Fetch all categories
    const { data: categoriesData, isLoading: isLoadingCats } = useAllCategoriesQuery({
        limit: 300,
    });
    const allCategories: any[] = categoriesData?.data || [];

    // Helper: Map categories by department ID or name
    const categoriesByDept = useMemo(() => {
        const map = new Map<string, any[]>();
        allCategories.forEach((cat) => {
            const catDeptId =
                typeof cat?.department === "object"
                    ? cat?.department?._id
                    : cat?.department;
            const catDeptName =
                typeof cat?.department === "object" ? cat?.department?.name : "";

            if (catDeptId) {
                const existing = map.get(String(catDeptId)) || [];
                existing.push(cat);
                map.set(String(catDeptId), existing);
            }
            if (catDeptName) {
                const key = catDeptName.toLowerCase();
                const existing = map.get(key) || [];
                existing.push(cat);
                map.set(key, existing);
            }
        });
        return map;
    }, [allCategories]);

    // Categories for the currently selected department
    const selectedDeptCategories = useMemo(() => {
        if (!selectedDepartment) return [];
        const byId = categoriesByDept.get(String(selectedDepartment._id)) || [];
        if (byId.length > 0) return byId;
        const byName = categoriesByDept.get(selectedDepartment.name.toLowerCase()) || [];
        return byName;
    }, [selectedDepartment, categoriesByDept]);

    // Handle outside click & ESC to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSelectedDepartment(null);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
                setSelectedDepartment(null);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            window.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
        setSelectedDepartment(null);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Navbar Trigger Button */}
            <button
                type="button"
                onClick={() => {
                    setIsOpen((prev) => !prev);
                    setSelectedDepartment(null);
                }}
                aria-label="Toggle Departments dropdown"
                aria-expanded={isOpen}
                className="btn btn-sm sm:btn-md bg-[#0071dc] hover:bg-[#005bb5] text-white rounded-full px-3.5 sm:px-4 border-none shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer select-none"
            >
                <Layers className="w-4 h-4 text-white shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white">Departments</span>
                <ChevronDown
                    className={`w-3.5 h-3.5 text-white/90 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Target-Style Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[999] animate-fadeIn text-gray-900 select-none">
                    {selectedDepartment ? (
                        /* ─────────────────────────────────────────────────────────────
                            VIEW 2: Clicked Single Department -> Shows All Categories
                        ───────────────────────────────────────────────────────────── */
                        <div className="flex flex-col">
                            {/* Back to All Categories Header Button */}
                            <button
                                type="button"
                                onClick={() => setSelectedDepartment(null)}
                                className="w-full flex items-center gap-2 px-5 py-3.5 text-left text-[14px] font-semibold text-gray-700 hover:bg-gray-100/80 hover:text-black transition-colors border-b border-gray-200 cursor-pointer bg-gray-50/70"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-600 shrink-0" />
                                <span>All Departments</span>
                            </button>

                            {/* Department Heading */}
                            <div className="px-5 pt-3.5 pb-2.5 border-b border-gray-200 bg-white">
                                <h3 className="font-bold text-gray-900 text-lg tracking-tight truncate">
                                    {selectedDepartment.name}
                                </h3>
                            </div>

                            {/* Categories Scrollable List */}
                            <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-200 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                                {/* Shop All Link */}
                                <Link
                                    href={`/${selectedDepartment.name}`}
                                    onClick={handleClose}
                                    className="block px-5 py-3.5 text-[15px] font-medium text-gray-800 hover:text-[#0071dc] hover:bg-gray-50/80 transition-colors cursor-pointer"
                                >
                                    all {selectedDepartment.name}
                                </Link>

                                {isLoadingCats ? (
                                    <div className="p-4 space-y-3">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="h-4 bg-gray-100 rounded animate-pulse"
                                            />
                                        ))}
                                    </div>
                                ) : selectedDeptCategories.length === 0 ? (
                                    <p className="text-xs text-gray-400 px-5 py-4 italic">
                                        No subcategories available
                                    </p>
                                ) : (
                                    selectedDeptCategories.map((category) => (
                                        <Link
                                            key={category._id}
                                            href={`/products?department=${selectedDepartment._id}&category=${category._id}`}
                                            onClick={handleClose}
                                            className="block px-5 py-3.5 text-[15px] text-gray-800 hover:text-[#0071dc] hover:bg-gray-50/80 transition-colors cursor-pointer truncate"
                                        >
                                            {category.name}
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        /* ─────────────────────────────────────────────────────────────
                            VIEW 1: Main Dropdown - All Categories (Target Clone Design)
                        ───────────────────────────────────────────────────────────── */
                        <div className="flex flex-col">
                            {/* Header: All Categories */}
                            <div className="px-5 pt-4 pb-3 border-b border-gray-200 bg-white">
                                <h3 className="font-bold text-gray-900 text-lg tracking-tight">
                                    All Departments
                                </h3>
                            </div>

                            {/* List of Departments */}
                            <div className="max-h-[460px] overflow-y-auto divide-y divide-gray-200 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                                {isLoadingDepts ? (
                                    <div className="p-4 space-y-3">
                                        {Array.from({ length: 8 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="h-5 bg-gray-100 rounded animate-pulse"
                                            />
                                        ))}
                                    </div>
                                ) : departments.length === 0 ? (
                                    <p className="text-xs text-gray-400 px-5 py-4">
                                        No departments found
                                    </p>
                                ) : (
                                    departments.map((dept) => {
                                        const deptCats =
                                            categoriesByDept.get(String(dept._id)) ||
                                            categoriesByDept.get(dept.name.toLowerCase()) ||
                                            [];
                                        const hasSubcategories = deptCats.length > 0;

                                        return hasSubcategories ? (
                                            <button
                                                key={dept._id}
                                                type="button"
                                                onClick={() => setSelectedDepartment(dept)}
                                                className="w-full flex items-center justify-between px-5 py-3.5 text-left text-[15px] text-gray-800 hover:bg-gray-50/80 hover:text-black transition-colors cursor-pointer group"
                                            >
                                                <span className="truncate">{dept.name}</span>
                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 shrink-0 transition-colors" />
                                            </button>
                                        ) : (
                                            <Link
                                                key={dept._id}
                                                href={`/${dept.name}`}
                                                onClick={handleClose}
                                                className="w-full flex items-center justify-between px-5 py-3.5 text-left text-[15px] text-gray-800 hover:bg-gray-50/80 hover:text-black transition-colors cursor-pointer"
                                            >
                                                <span className="truncate">{dept.name}</span>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Departments;
