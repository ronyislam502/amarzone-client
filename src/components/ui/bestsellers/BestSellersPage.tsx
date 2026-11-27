"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Flame,
    Award,
    TrendingUp,
    Gift,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    Check,
    Layers,
    Info,
} from "lucide-react";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { useAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import {
    useGetBestSellingProductsQuery,
    useGetBestSellingDepartmentProductsQuery,
    useGetBestSellingCategoryProductsQuery,
} from "@/redux/features/ranking/rankingApi";
import { TDepartment } from "@/types/department";
import { TCategory } from "@/types/category";
import BestSellerCard from "./BestSellerCard";
import DepartmentBestSellersRow from "./DepartmentBestSellersRow";

const SUB_TABS = [
    { id: "bestsellers", label: "Best Sellers", href: "/bestsellers" },
    { id: "new-releases", label: "New Releases", href: "/products?sort=-createdAt" },
    { id: "movers-shakers", label: "Movers & Shakers", href: "/products?sort=-sales" },
    { id: "most-wished", label: "Most Wished For", href: "/products?sort=-rating" },
    { id: "gift-ideas", label: "Gift Ideas", href: "/products?deal=gift" },
];

export const BestSellersPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const deptParam = searchParams.get("department");
    const catParam = searchParams.get("category");
    const pageParam = parseInt(searchParams.get("page") || "1", 10);

    const [page, setPage] = useState(pageParam || 1);
    const limit = 20;

    // 1. Fetch metadata
    const { data: departmentsData, isLoading: isDeptLoading } = useAllDepartmentsQuery({ limit: 50 });
    const { data: categoriesData, isLoading: isCatLoading } = useAllCategoriesQuery({ limit: 200 });

    const departments: TDepartment[] = departmentsData?.data || [];
    const categories: TCategory[] = categoriesData?.data || [];

    // Group categories by department ID
    const categoriesByDept = useMemo(() => {
        const map = new Map<string, TCategory[]>();
        categories.forEach((cat) => {
            const deptId =
                typeof cat?.department === "object" && cat?.department !== null
                    ? (cat?.department as any)?._id
                    : cat?.department;
            if (deptId) {
                const key = String(deptId);
                const existing = map.get(key) || [];
                existing.push(cat);
                map.set(key, existing);
            }
        });
        return map;
    }, [categories]);

    // Active department & category resolution
    const activeDepartment = useMemo(() => {
        if (!deptParam) return null;
        return (
            departments.find(
                (d) =>
                    d._id === deptParam ||
                    d.name.toLowerCase() === deptParam.toLowerCase() ||
                    (d as any)?.slug === deptParam
            ) || null
        );
    }, [deptParam, departments]);

    const activeCategory = useMemo(() => {
        if (!catParam) return null;
        return (
            categories.find(
                (c) =>
                    c._id === catParam ||
                    c.name.toLowerCase() === catParam.toLowerCase()
            ) || null
        );
    }, [catParam, categories]);

    // Determine query modes
    const isCategoryMode = Boolean(activeCategory);
    const isDepartmentMode = Boolean(activeDepartment) && !isCategoryMode;
    const isGlobalMode = !isCategoryMode && !isDepartmentMode;

    // 2. Ranking Queries
    // Global best sellers
    const {
        data: globalRankingData,
        isLoading: isGlobalLoading,
        isFetching: isGlobalFetching,
    } = useGetBestSellingProductsQuery({ page: 1, limit: 12 }, { skip: !isGlobalMode });

    // Department best sellers
    const {
        data: deptRankingData,
        isLoading: isDeptRankingLoading,
        isFetching: isDeptRankingFetching,
    } = useGetBestSellingDepartmentProductsQuery(
        { departmentId: activeDepartment?._id || "", page, limit },
        { skip: !isDepartmentMode || !activeDepartment?._id }
    );

    // Category best sellers
    const {
        data: catRankingData,
        isLoading: isCatRankingLoading,
        isFetching: isCatRankingFetching,
    } = useGetBestSellingCategoryProductsQuery(
        { categoryId: activeCategory?._id || "", page, limit },
        { skip: !isCategoryMode || !activeCategory?._id }
    );

    // Active product results and meta
    const currentProducts = isCategoryMode
        ? catRankingData?.data || []
        : isDepartmentMode
        ? deptRankingData?.data || []
        : globalRankingData?.data || [];

    const currentMeta = isCategoryMode
        ? catRankingData?.meta
        : isDepartmentMode
        ? deptRankingData?.meta
        : globalRankingData?.meta;

    const isLoadingActive = isCategoryMode
        ? isCatRankingLoading || isCatRankingFetching
        : isDepartmentMode
        ? isDeptRankingLoading || isDeptRankingFetching
        : isGlobalLoading || isGlobalFetching;

    // Navigation handlers
    const handleSelectDepartment = (dept: TDepartment | null) => {
        setPage(1);
        if (dept) {
            router.push(`/bestsellers?department=${dept._id}`);
        } else {
            router.push(`/bestsellers`);
        }
    };

    const handleSelectCategory = (cat: TCategory) => {
        setPage(1);
        const deptId =
            activeDepartment?._id ||
            (typeof cat.department === "object" ? (cat.department as any)?._id : cat.department);

        if (deptId) {
            router.push(`/bestsellers?department=${deptId}&category=${cat._id}`);
        } else {
            router.push(`/bestsellers?category=${cat._id}`);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPage));
        router.push(`/bestsellers?${params.toString()}`);
        window.scrollTo({ top: 120, behavior: "smooth" });
    };

    return (
        <div className="bg-[#f7f8f9] min-h-screen text-slate-800">
            {/* ═══════════════════════════════════════════════════════════
                 1. AMAZON SUB-NAVIGATION TAB STRIP
            ═══════════════════════════════════════════════════════════ */}
            <div className="w-full bg-white border-b border-slate-200 select-none shadow-2xs">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center overflow-x-auto scrollbar-none">
                    {SUB_TABS.map((tab) => {
                        const isActive = tab.id === "bestsellers";
                        return (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                className={`py-3 px-4 text-[13px] sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                                    isActive
                                        ? "border-[#007185] text-slate-900 font-bold"
                                        : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                                }`}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                 2. HERO HEADER BANNER
            ═══════════════════════════════════════════════════════════ */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-5 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-slate-200/80 pb-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <span>Amazon Best Sellers</span>
                        </h1>
                        <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5">
                            Our most popular products based on sales. Updated frequently.
                        </p>
                    </div>

                    {/* Active Scope Badge */}
                    <div className="text-xs text-slate-500 font-medium">
                        {isCategoryMode ? (
                            <span className="badge badge-warning bg-amber-100 text-amber-900 border-amber-300 gap-1 font-bold">
                                Category: {activeCategory?.name}
                            </span>
                        ) : isDepartmentMode ? (
                            <span className="badge badge-warning bg-amber-100 text-amber-900 border-amber-300 gap-1 font-bold">
                                Department: {activeDepartment?.name}
                            </span>
                        ) : (
                            <span className="badge badge-ghost border-slate-300 text-slate-600">
                                Global Marketplace
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                 3. TWO-COLUMN MAIN BODY (Sidebar + Content)
            ═══════════════════════════════════════════════════════════ */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pb-16 flex flex-col md:flex-row items-start gap-6">
                {/* ─────────────────────────────────────────────────────────────
                     LEFT SIDEBAR: "Any Department" Navigation Tree
                ───────────────────────────────────────────────────────────── */}
                <aside className="w-full md:w-56 lg:w-64 shrink-0 bg-white md:bg-transparent rounded-md md:rounded-none p-4 md:p-0 border md:border-none border-slate-200">
                    <div className="sticky top-4 space-y-4">
                        <div className="border-b border-slate-200 pb-2">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                                Any Department
                            </h3>
                            <button
                                type="button"
                                onClick={() => handleSelectDepartment(null)}
                                className={`text-xs block mt-1 hover:underline cursor-pointer ${
                                    isGlobalMode
                                        ? "font-bold text-[#c7511f]"
                                        : "text-[#007185] hover:text-[#c7511f]"
                                }`}
                            >
                                All Departments (Overview)
                            </button>
                        </div>

                        {/* List of Departments */}
                        <div className="space-y-0.5 max-h-[calc(100vh-14rem)] overflow-y-auto scrollbar-thin pr-1 text-xs sm:text-[13px]">
                            {isDeptLoading ? (
                                Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="h-5 bg-slate-200/60 rounded animate-pulse my-1" />
                                ))
                            ) : (
                                departments.map((dept) => {
                                    const isDeptActive = activeDepartment?._id === dept._id;
                                    const deptCategories = categoriesByDept.get(String(dept._id)) || [];

                                    return (
                                        <div key={dept._id} className="py-0.5">
                                            <button
                                                type="button"
                                                onClick={() => handleSelectDepartment(dept)}
                                                className={`w-full text-left py-1 px-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                                                    isDeptActive
                                                        ? "font-bold text-[#c7511f] bg-orange-50/60"
                                                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                                                }`}
                                            >
                                                <span className="truncate">{dept.name}</span>
                                                {isDeptActive && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#c7511f] shrink-0" />
                                                )}
                                            </button>

                                            {/* Nested Categories if Department is Active */}
                                            {isDeptActive && deptCategories.length > 0 && (
                                                <div className="ml-3 pl-2 border-l border-orange-200 space-y-0.5 my-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSelectDepartment(dept)}
                                                        className={`w-full text-left py-0.5 text-xs truncate cursor-pointer ${
                                                            !activeCategory
                                                                ? "font-bold text-[#c7511f]"
                                                                : "text-slate-600 hover:text-slate-900"
                                                        }`}
                                                    >
                                                        All in {dept.name}
                                                    </button>
                                                    {deptCategories.map((cat) => {
                                                        const isCatActive = activeCategory?._id === cat._id;
                                                        return (
                                                            <button
                                                                key={cat._id}
                                                                type="button"
                                                                onClick={() => handleSelectCategory(cat)}
                                                                className={`w-full text-left py-0.5 text-xs truncate cursor-pointer ${
                                                                    isCatActive
                                                                        ? "font-bold text-[#c7511f]"
                                                                        : "text-slate-600 hover:text-slate-900 hover:underline"
                                                                }`}
                                                            >
                                                                {cat.name}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </aside>

                {/* ─────────────────────────────────────────────────────────────
                     RIGHT MAIN CONTENT AREA
                ───────────────────────────────────────────────────────────── */}
                <main className="flex-1 min-w-0 w-full space-y-6">
                    {/* Breadcrumbs for Department / Category */}
                    {!isGlobalMode && (
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                            <button
                                type="button"
                                onClick={() => handleSelectDepartment(null)}
                                className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer"
                            >
                                Any Department
                            </button>
                            {activeDepartment && (
                                <>
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                    <button
                                        type="button"
                                        onClick={() => handleSelectDepartment(activeDepartment)}
                                        className={`hover:underline cursor-pointer ${
                                            !activeCategory
                                                ? "font-bold text-slate-900"
                                                : "text-[#007185] hover:text-[#c7511f]"
                                        }`}
                                    >
                                        {activeDepartment.name}
                                    </button>
                                </>
                            )}
                            {activeCategory && (
                                <>
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="font-bold text-slate-900">
                                        {activeCategory.name}
                                    </span>
                                </>
                            )}
                        </div>
                    )}

                    {/* ═══════════════════════════════════════════════════════════
                         VIEW MODE A: Category or Department Full Ranked Grid
                    ═══════════════════════════════════════════════════════════ */}
                    {!isGlobalMode ? (
                        <div className="space-y-6">
                            {/* Heading */}
                            <div className="bg-white border border-slate-200/80 rounded-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                        Best Sellers in {isCategoryMode ? activeCategory?.name : activeDepartment?.name}
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Updated hourly based on marketplace orders & sales rank calculations.
                                    </p>
                                </div>

                                {currentMeta?.total !== undefined && (
                                    <div className="text-xs text-slate-600 font-medium whitespace-nowrap">
                                        Showing {currentProducts.length} of {currentMeta.total} items
                                    </div>
                                )}
                            </div>

                            {/* Products Grid */}
                            {isLoadingActive ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-80 bg-white border border-slate-200 rounded-md p-4 animate-pulse flex flex-col justify-between"
                                        >
                                            <div className="w-full aspect-square bg-slate-100 rounded" />
                                            <div className="space-y-2 mt-3">
                                                <div className="h-4 bg-slate-200 rounded w-3/4" />
                                                <div className="h-3 bg-slate-100 rounded w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : currentProducts.length === 0 ? (
                                <div className="bg-white border border-slate-200 rounded-md p-10 text-center space-y-3">
                                    <h3 className="text-base font-bold text-slate-900">
                                        No ranked products available yet
                                    </h3>
                                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                                        Sales ranking data for this section is updated on the hourly cron cycle.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {currentProducts.map((item, index) => {
                                        const rankNumber = (page - 1) * limit + index + 1;
                                        return (
                                            <BestSellerCard
                                                key={item._id || item.variantId || index}
                                                item={item}
                                                rank={rankNumber}
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            {/* DaisyUI Pagination */}
                            {currentMeta && currentMeta.totalPage && currentMeta.totalPage > 1 && (
                                <div className="flex justify-center pt-6">
                                    <div className="join bg-white border border-slate-200 rounded-md shadow-2xs">
                                        <button
                                            type="button"
                                            disabled={page <= 1}
                                            onClick={() => handlePageChange(page - 1)}
                                            className="join-item btn btn-sm btn-ghost disabled:bg-slate-50"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span>Previous</span>
                                        </button>
                                        <button type="button" className="join-item btn btn-sm btn-ghost font-bold text-xs">
                                            Page {page} of {currentMeta.totalPage}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={page >= currentMeta.totalPage}
                                            onClick={() => handlePageChange(page + 1)}
                                            className="join-item btn btn-sm btn-ghost disabled:bg-slate-50"
                                        >
                                            <span>Next</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ═══════════════════════════════════════════════════════════
                             VIEW MODE B: Amazon Global Landing Page (Stacked Carousels)
                        ═══════════════════════════════════════════════════════════ */
                        <div className="space-y-8">
                            {/* 1. Overall Marketplace Top Best Sellers Section */}
                            <section className="bg-white border border-slate-200/80 rounded-md p-4 sm:p-5 shadow-xs">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                            <span>Top Best Sellers Across All Categories</span>
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            The #1 to #12 most popular items in Amarzone right now.
                                        </p>
                                    </div>
                                </div>

                                {isGlobalLoading ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className="h-80 bg-slate-100 rounded-md animate-pulse" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {currentProducts.slice(0, 8).map((item, index) => (
                                            <BestSellerCard
                                                key={item._id || item.variantId || index}
                                                item={item}
                                                rank={item.globalRank || index + 1}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* 2. Stacked Department Carousels */}
                            <div className="space-y-4">
                                {departments.slice(0, 8).map((dept) => (
                                    <DepartmentBestSellersRow
                                        key={dept._id}
                                        department={dept}
                                        onSelectDepartment={handleSelectDepartment}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══════════════════════════════════════════════════════════
                         4. ABOUT BEST SELLERS INFO BLOCK (Matches Amazon footer note)
                    ═══════════════════════════════════════════════════════════ */}
                    <div className="bg-white border border-slate-200/80 rounded-md p-5 text-xs text-slate-600 space-y-1.5 shadow-2xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                            <Info className="w-4 h-4 text-slate-500" />
                            <span>About Amarzone Best Sellers</span>
                        </div>
                        <p>
                            These lists, updated hourly based on actual order volume and BSR (Best Sellers Rank) calculations, contain the bestselling products on Amarzone. While the list updates continuously, products are placed based on past and recent sales figures.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default BestSellersPage;
