"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
    Menu,
    ChevronLeft,
    ChevronRight,
    X,
    User,
    Flame,
} from "lucide-react";
import { useAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { useMyProfileQuery } from "@/redux/features/user/userApi";
import { TCategory } from "@/types/category";
import { TDepartment } from "@/types/department";
import AZDrawer from "@/components/shared/AZDrawer";

const AZSubNavbar: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isAllDrawerOpen, setIsAllDrawerOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<TDepartment | null>(null);

    // Queries
    const { data: categoriesData, isLoading: isLoadingCats } = useAllCategoriesQuery({
        limit: 200,
    });
    const { data: departmentsData, isLoading: isLoadingDepts } = useAllDepartmentsQuery({
        limit: 50,
    });
    const { data: userData } = useMyProfileQuery({});

    const categories: TCategory[] = categoriesData?.data || [];
    const departments: TDepartment[] = departmentsData?.data || [];
    const profile = userData?.data;

    // Check scroll availability
    const updateScrollButtons = () => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    };

    useEffect(() => {
        updateScrollButtons();
        const el = scrollContainerRef.current;
        if (!el) return;

        const handleResize = () => updateScrollButtons();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [departments]);

    // Horizontal scroll action
    const scroll = (direction: "left" | "right") => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const scrollAmount = 300;
        el.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
        setTimeout(updateScrollButtons, 350);
    };

    const handleCloseDrawer = () => {
        setIsAllDrawerOpen(false);
        setSelectedDepartment(null);
    };

    // Group categories by department for drawer and hover dropdowns
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

    return (
        <>
            {/* ═══════════════════════════════════════════════════════════
                 MAIN HORIZONTAL SUBNAVBAR (Amazon Clone)
            ═══════════════════════════════════════════════════════════ */}
            <div className="w-full bg-[#170d2f] text-white border-t border-white/10 select-none shadow-xs relative z-30">
                <div className="max-w-[1600px] mx-auto px-2 sm:px-6 flex items-center relative h-[38px] md:h-[39px]">
                    {/* 1. "All" Hamburger Menu Button */}
                    <button
                        type="button"
                        onClick={() => {
                            setIsAllDrawerOpen(true);
                            setSelectedDepartment(null);
                        }}
                        aria-label="Open all navigation menu"
                        className="flex items-center gap-1.5 px-2.5 py-1 text-[13px] md:text-[14px] font-bold text-white whitespace-nowrap border border-transparent hover:border-white rounded-[2px] transition-all cursor-pointer shrink-0 mr-1"
                    >
                        <Menu className="w-4 h-4 text-white" />
                        <span>All</span>
                    </button>

                    {/* 2. Featured Lead Item: Black Friday Deals */}
                    <Link
                        href="/products?deal=black-friday"
                        className="flex items-center gap-1 px-2.5 py-1 text-[13px] md:text-[14px] font-bold text-amber-300 hover:text-white whitespace-nowrap border border-transparent hover:border-white rounded-[2px] transition-all shrink-0 mr-1"
                    >
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>Black Friday</span>
                    </Link>

                    {/* 3. Left Scroll Indicator Arrow */}
                    {canScrollLeft && (
                        <div className="absolute left-[135px] sm:left-[160px] z-20 flex items-center h-full pl-0.5 pr-3 bg-gradient-to-r from-[#170d2f] via-[#170d2f]/95 to-transparent">
                            <button
                                type="button"
                                onClick={() => scroll("left")}
                                aria-label="Scroll left"
                                className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    {/* 4. Scrollable Container for All Departments */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={updateScrollButtons}
                        onWheel={(e) => {
                            if (scrollContainerRef.current) {
                                scrollContainerRef.current.scrollLeft += e.deltaY;
                            }
                        }}
                        className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto scroll-smooth scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-1 flex-1"
                    >
                        {/* Loading Skeletons */}
                        {isLoadingDepts && departments.length === 0 ? (
                            <div className="flex items-center gap-2">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-5 w-24 bg-white/10 rounded animate-pulse shrink-0"
                                    />
                                ))}
                            </div>
                        ) : (
                            /* All Departments from Database */
                            departments.map((dept) => (
                                <Link
                                    key={dept._id}
                                    href={`/products?department=${dept._id}`}
                                    className="flex items-center gap-1 px-2.5 py-1 text-[13px] md:text-[14px] font-medium text-white/95 hover:text-white whitespace-nowrap border border-transparent hover:border-white rounded-[2px] shrink-0 transition-all cursor-pointer"
                                    title={dept.name}
                                >
                                    <span>{dept.name}</span>
                                </Link>
                            ))
                        )}

                        {/* Standard Amazon Shortcuts */}
                        <Link
                            href="/bestsellers"
                            className="flex items-center gap-1 px-2.5 py-1 text-[13px] md:text-[14px] font-normal text-white/95 hover:text-white whitespace-nowrap border border-transparent hover:border-white rounded-[2px] shrink-0 transition-all cursor-pointer"
                        >
                            <span>Best Sellers</span>
                        </Link>
                        <Link
                            href="/products?sort=-createdAt"
                            className="flex items-center gap-1 px-2.5 py-1 text-[13px] md:text-[14px] font-normal text-white/95 hover:text-white whitespace-nowrap border border-transparent hover:border-white rounded-[2px] shrink-0 transition-all cursor-pointer"
                        >
                            <span>New Releases</span>
                        </Link>
                        <Link
                            href="/support"
                            className="flex items-center gap-1 px-2.5 py-1 text-[13px] md:text-[14px] font-normal text-white/95 hover:text-white whitespace-nowrap border border-transparent hover:border-white rounded-[2px] shrink-0 transition-all cursor-pointer"
                        >
                            <span>Customer Service</span>
                        </Link>
                        <Link
                            href="/sell-on-amarzone"
                            className="flex items-center gap-1 px-2.5 py-1 text-[13px] md:text-[14px] font-normal text-white/95 hover:text-white whitespace-nowrap border border-transparent hover:border-white rounded-[2px] shrink-0 transition-all cursor-pointer"
                        >
                            <span>Sell</span>
                        </Link>
                    </div>

                    {/* 5. Right Scroll Indicator Arrow */}
                    {canScrollRight && (
                        <div className="absolute right-2 sm:right-6 z-20 flex items-center h-full pr-0.5 pl-3 bg-gradient-to-l from-[#170d2f] via-[#170d2f]/95 to-transparent">
                            <button
                                type="button"
                                onClick={() => scroll("right")}
                                aria-label="Scroll right"
                                className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                 AMAZON-STYLE "ALL" SLIDE-OUT DRAWER (Reusable DaisyUI AZDrawer)
            ═══════════════════════════════════════════════════════════ */}
            <AZDrawer
                isOpen={isAllDrawerOpen}
                onClose={handleCloseDrawer}
                position="left"
                size="sm"
                className="!max-w-[365px] w-[85vw]"
                contentClassName="divide-y divide-gray-200 text-[14px]"
                header={
                    <div className="bg-[#170d2f] text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
                        <Link
                            href={profile ? `/${profile?.user?.role?.toLowerCase()}` : "/signin"}
                            onClick={handleCloseDrawer}
                            className="flex items-center gap-3 group cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-blue-200 block">
                                    {profile ? "Hello," : "Welcome"}
                                </span>
                                <span className="text-base font-bold text-white group-hover:underline">
                                    {profile?.name ? profile.name.split(" ")[0] : "Sign in"}
                                </span>
                            </div>
                        </Link>

                        <button
                            type="button"
                            onClick={handleCloseDrawer}
                            aria-label="Close drawer"
                            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                }
            >
                {selectedDepartment ? (
                    /* SUB-VIEW: Selected Department -> Shows its Categories */
                    <div>
                        <button
                            type="button"
                            onClick={() => setSelectedDepartment(null)}
                            className="w-full flex items-center gap-2 px-6 py-3.5 font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border-b border-gray-200 text-left transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>MAIN MENU</span>
                        </button>

                        <div className="px-6 py-3 font-bold text-gray-900 text-[15px] border-b border-gray-100">
                            {selectedDepartment.name}
                        </div>

                        <div className="py-2">
                            <Link
                                href={`/products?department=${selectedDepartment._id}`}
                                onClick={handleCloseDrawer}
                                className="block px-6 py-2.5 font-semibold text-[#0071dc] hover:bg-gray-100 transition-colors"
                            >
                                Shop All {selectedDepartment.name}
                            </Link>

                            {(categoriesByDept.get(String(selectedDepartment._id)) || []).map(
                                (cat) => (
                                    <Link
                                        key={cat._id}
                                        href={`/products?department=${selectedDepartment._id}&category=${cat._id}`}
                                        onClick={handleCloseDrawer}
                                        className="block px-6 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                                    >
                                        {cat.name}
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                ) : (
                    /* MAIN-VIEW: Trending + Shop by Department + Help & Settings */
                    <div>
                        {/* Section 1: Trending & Top Deals */}
                        <div className="py-3">
                            <h4 className="px-6 py-2 text-[16px] font-bold text-gray-900">
                                Trending
                            </h4>
                            <Link
                                href="/products?deal=black-friday"
                                onClick={handleCloseDrawer}
                                className="flex items-center justify-between px-6 py-2.5 text-gray-800 hover:bg-gray-100 transition-colors font-medium text-amber-700"
                            >
                                <span className="flex items-center gap-2 font-bold text-rose-600">
                                    <Flame className="w-4 h-4 text-rose-500" />
                                    Black Friday Deals
                                </span>
                            </Link>
                            <Link
                                href="/bestsellers"
                                onClick={handleCloseDrawer}
                                className="flex items-center justify-between px-6 py-2.5 text-gray-800 hover:bg-gray-100 transition-colors"
                            >
                                <span>Best Sellers</span>
                            </Link>
                            <Link
                                href="/products"
                                onClick={handleCloseDrawer}
                                className="flex items-center justify-between px-6 py-2.5 text-gray-800 hover:bg-gray-100 transition-colors"
                            >
                                <span>New Releases</span>
                            </Link>
                        </div>

                        {/* Section 2: Shop by Department */}
                        <div className="py-3">
                            <h4 className="px-6 py-2 text-[16px] font-bold text-gray-900">
                                Shop by Department
                            </h4>
                            {departments.map((dept) => {
                                const deptCats = categoriesByDept.get(String(dept._id)) || [];
                                const hasCats = deptCats.length > 0;

                                return hasCats ? (
                                    <button
                                        key={dept._id}
                                        type="button"
                                        onClick={() => setSelectedDepartment(dept)}
                                        className="w-full flex items-center justify-between px-6 py-2.5 text-gray-800 hover:bg-gray-100 hover:text-black transition-colors text-left cursor-pointer"
                                    >
                                        <span className="truncate">{dept.name}</span>
                                        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                                    </button>
                                ) : (
                                    <Link
                                        key={dept._id}
                                        href={`/products?department=${dept._id}`}
                                        onClick={handleCloseDrawer}
                                        className="flex items-center justify-between px-6 py-2.5 text-gray-800 hover:bg-gray-100 hover:text-black transition-colors"
                                    >
                                        <span className="truncate">{dept.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Section 3: All Categories Shortcut */}
                        <div className="py-3">
                            <h4 className="px-6 py-2 text-[16px] font-bold text-gray-900">
                                Popular Categories
                            </h4>
                            {categories.slice(0, 12).map((cat) => (
                                <Link
                                    key={cat._id}
                                    href={`/products?category=${cat._id}`}
                                    onClick={handleCloseDrawer}
                                    className="block px-6 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>

                        {/* Section 4: Help & Settings */}
                        <div className="py-3">
                            <h4 className="px-6 py-2 text-[16px] font-bold text-gray-900">
                                Help & Settings
                            </h4>
                            <Link
                                href={profile ? `/${profile?.user?.role?.toLowerCase()}` : "/signin"}
                                onClick={handleCloseDrawer}
                                className="block px-6 py-2.5 text-gray-800 hover:bg-gray-100 transition-colors"
                            >
                                Your Account
                            </Link>
                            <Link
                                href="/support"
                                onClick={handleCloseDrawer}
                                className="block px-6 py-2.5 text-gray-800 hover:bg-gray-100 transition-colors"
                            >
                                Customer Service
                            </Link>
                            <Link
                                href="/sell-on-amarzone"
                                onClick={handleCloseDrawer}
                                className="block px-6 py-2.5 text-gray-800 hover:bg-gray-100 transition-colors"
                            >
                                Sell on Amarzone
                            </Link>
                            {!profile && (
                                <Link
                                    href="/signin"
                                    onClick={handleCloseDrawer}
                                    className="block px-6 py-2.5 text-[#0071dc] font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Sign in
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </AZDrawer>
        </>
    );
};

export default AZSubNavbar;
