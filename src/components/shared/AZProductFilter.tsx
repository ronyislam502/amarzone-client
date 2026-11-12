"use client";

import React, { useState, useEffect } from "react";
import {
    RotateCcw,
    SlidersHorizontal,
    Star,
    Check,
    ChevronDown,
    Search,
} from "lucide-react";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { useAllCategoriesQuery } from "@/redux/features/category/categoryApi";

interface FilterState {
    search: string;
    department: string;
    category: string;
    brand: string;
    minPrice: string;
    maxPrice: string;
    rating: number | null;
    sort: string;
}

interface AZProductFilterProps {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
}

const PRICE_RANGES = [
    { label: "All Prices", min: "", max: "" },
    { label: "Under $25", min: "", max: "25" },
    { label: "$25 – $50", min: "25", max: "50" },
    { label: "$50 – $100", min: "50", max: "100" },
    { label: "$100 – $200", min: "100", max: "200" },
    { label: "$200+", min: "200", max: "" },
];

const SORT_OPTIONS = [
    { label: "Relevance", value: "" },
    { label: "Price: Low to High", value: "price" },
    { label: "Price: High to Low", value: "-price" },
    { label: "Newest First", value: "-createdAt" },
    { label: "Top Rated", value: "-rating" },
];

const RATINGS = [4, 3, 2, 1];

const AZProductFilter: React.FC<AZProductFilterProps> = ({ filters, onChange }) => {
    const [localMin, setLocalMin] = useState(filters.minPrice);
    const [localMax, setLocalMax] = useState(filters.maxPrice);
    const [activePriceRange, setActivePriceRange] = useState<string | null>(null);

    // Fetch departments and categories from API
    const { data: departmentsData } = useAllDepartmentsQuery({ limit: 100 });
    const { data: categoriesData } = useAllCategoriesQuery({
        limit: 200,
        department: filters.department || undefined,
    });

    const departments = departmentsData?.data || [];
    const categories = categoriesData?.data || [];

    // Sync local price inputs when filters reset externally
    useEffect(() => {
        setLocalMin(filters.minPrice);
        setLocalMax(filters.maxPrice);
    }, [filters.minPrice, filters.maxPrice]);

    const update = (patch: Partial<FilterState>) => {
        onChange({ ...filters, ...patch });
    };

    const handleDepartmentChange = (deptId: string) => {
        // Reset category when department changes
        update({ department: deptId, category: "" });
    };

    const applyPriceRange = (min: string, max: string, label: string) => {
        setLocalMin(min);
        setLocalMax(max);
        setActivePriceRange(label === "All Prices" ? null : label);
        update({ minPrice: min, maxPrice: max });
    };

    const applyCustomPrice = () => {
        setActivePriceRange(null);
        update({ minPrice: localMin, maxPrice: localMax });
    };

    const handleRating = (r: number) => {
        update({ rating: filters.rating === r ? null : r });
    };

    const handleReset = () => {
        setLocalMin("");
        setLocalMax("");
        setActivePriceRange(null);
        onChange({
            search: "",
            department: "",
            category: "",
            brand: "",
            minPrice: "",
            maxPrice: "",
            rating: null,
            sort: "",
        });
    };

    const hasActiveFilters =
        filters.department ||
        filters.category ||
        filters.brand ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.rating !== null ||
        filters.sort ||
        filters.search;

    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-bold text-slate-900">Filters</span>
                </div>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-700 transition-colors"
                    >
                        <RotateCcw className="h-3 w-3" />
                        Reset
                    </button>
                )}
            </div>

            {/* Search */}
            <section className="mb-5">
                <h4 className="mb-2 text-xs font-bold text-slate-800">Search</h4>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => update({ search: e.target.value })}
                        placeholder="Search products..."
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400"
                    />
                </div>
            </section>

            {/* Sort */}
            <section className="mb-5">
                <h4 className="mb-2 text-xs font-bold text-slate-800">Sort By</h4>
                <div className="relative">
                    <select
                        value={filters.sort}
                        onChange={(e) => update({ sort: e.target.value })}
                        className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-xs text-slate-700 outline-none transition focus:border-violet-400"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
            </section>

            {/* Department */}
            <section className="mb-5 border-t border-slate-100 pt-5">
                <h4 className="mb-2 text-xs font-bold text-slate-800">Department</h4>
                <div className="relative">
                    <select
                        value={filters.department}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                        className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-xs text-slate-600 outline-none transition focus:border-violet-400"
                    >
                        <option value="">All Departments</option>
                        {departments.map((dept: any) => (
                            <option key={dept._id} value={dept._id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
            </section>

            {/* Category — shown only when a dept is selected */}
            {filters.department && categories.length > 0 && (
                <section className="mb-5">
                    <h4 className="mb-2 text-xs font-bold text-slate-800">Category</h4>
                    <div className="relative">
                        <select
                            value={filters.category}
                            onChange={(e) => update({ category: e.target.value })}
                            className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-xs text-slate-600 outline-none transition focus:border-violet-400"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat: any) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                </section>
            )}

            {/* Brand */}
            <section className="mb-5 border-t border-slate-100 pt-5">
                <h4 className="mb-2 text-xs font-bold text-slate-800">Brand</h4>
                <input
                    type="text"
                    value={filters.brand}
                    onChange={(e) => update({ brand: e.target.value })}
                    placeholder="e.g. Apple, Samsung..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400"
                />
            </section>

            {/* Price Range */}
            <section className="mb-5 border-t border-slate-100 pt-5">
                <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">Price Range</h4>
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                        USD ($)
                    </span>
                </div>

                {/* Quick price buckets */}
                <div className="space-y-1 mb-4">
                    {PRICE_RANGES.map((range) => {
                        const isActive = activePriceRange === range.label ||
                            (range.label === "All Prices" && !activePriceRange && !filters.minPrice && !filters.maxPrice);
                        return (
                            <button
                                key={range.label}
                                type="button"
                                onClick={() => applyPriceRange(range.min, range.max, range.label)}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-colors ${
                                    isActive
                                        ? "bg-violet-50 font-bold text-violet-700"
                                        : "font-medium text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                <span>{range.label}</span>
                                {isActive && <Check className="h-3.5 w-3.5 text-violet-600" />}
                            </button>
                        );
                    })}
                </div>

                {/* Custom price inputs */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <input
                        type="number"
                        min={0}
                        value={localMin}
                        onChange={(e) => setLocalMin(e.target.value)}
                        placeholder="Min"
                        className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400"
                    />
                    <span className="text-xs text-slate-400">—</span>
                    <input
                        type="number"
                        min={0}
                        value={localMax}
                        onChange={(e) => setLocalMax(e.target.value)}
                        placeholder="Max"
                        className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400"
                    />
                </div>

                <button
                    type="button"
                    onClick={applyCustomPrice}
                    className="mt-2.5 h-9 w-full rounded-xl bg-slate-900 text-xs font-bold text-white transition-colors hover:bg-violet-600"
                >
                    Apply Price
                </button>
            </section>

            {/* Customer Rating */}
            <section className="mb-2 border-t border-slate-100 pt-5">
                <h4 className="mb-3 text-xs font-bold text-slate-800">Customer Rating</h4>

                <div className="space-y-1">
                    {RATINGS.map((rating) => {
                        const isActive = filters.rating === rating;
                        return (
                            <button
                                key={rating}
                                type="button"
                                onClick={() => handleRating(rating)}
                                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors ${
                                    isActive
                                        ? "border border-amber-100 bg-amber-50/70"
                                        : "hover:bg-slate-50"
                                }`}
                            >
                                <div className="flex shrink-0 items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-3.5 w-3.5 ${
                                                star <= rating
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "fill-slate-100 text-slate-200"
                                            }`}
                                        />
                                    ))}
                                </div>

                                <span
                                    className={`text-xs ${
                                        isActive
                                            ? "font-bold text-slate-800"
                                            : "font-medium text-slate-600"
                                    }`}
                                >
                                    {rating} & Up
                                </span>

                                {isActive && (
                                    <Check className="ml-auto h-3.5 w-3.5 text-amber-600" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default AZProductFilter;
