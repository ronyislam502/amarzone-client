"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetBestSellingDepartmentProductsQuery } from "@/redux/features/ranking/rankingApi";
import { TDepartment } from "@/types/department";
import BestSellerCard from "./BestSellerCard";

interface DepartmentBestSellersRowProps {
    department: TDepartment;
    onSelectDepartment: (dept: TDepartment) => void;
}

export const DepartmentBestSellersRow: React.FC<DepartmentBestSellersRowProps> = ({
    department,
    onSelectDepartment,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { data: deptProductsData, isLoading } = useGetBestSellingDepartmentProductsQuery({
        departmentId: department._id,
        limit: 8,
    });

    const products = deptProductsData?.data || [];

    if (!isLoading && products.length === 0) {
        return null;
    }

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const scrollAmount = 500;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <section className="bg-white border border-slate-200/80 rounded-md p-4 sm:p-5 mb-6 shadow-xs">
            {/* Section Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-baseline gap-2.5">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        Best Sellers in {department.name}
                    </h2>
                    <button
                        type="button"
                        onClick={() => onSelectDepartment(department)}
                        className="text-xs sm:text-[13px] font-medium text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer"
                    >
                        See More
                    </button>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => scroll("left")}
                        aria-label={`Scroll ${department.name} left`}
                        className="btn btn-xs sm:btn-sm btn-circle btn-ghost border border-slate-200 hover:bg-slate-100"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => scroll("right")}
                        aria-label={`Scroll ${department.name} right`}
                        className="btn btn-xs sm:btn-sm btn-circle btn-ghost border border-slate-200 hover:bg-slate-100"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Horizontal Scroll / Carousel Container */}
            <div
                ref={scrollRef}
                className="flex items-stretch gap-3 overflow-x-auto scroll-smooth scrollbar-none pb-2"
                style={{ scrollbarWidth: "none" }}
            >
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="min-w-[220px] max-w-[240px] flex-shrink-0 h-80 bg-slate-100 rounded-md animate-pulse"
                        />
                    ))
                ) : (
                    products.map((item, index) => (
                        <div
                            key={item._id || item.variantId || index}
                            className="min-w-[220px] sm:min-w-[240px] max-w-[260px] flex-shrink-0"
                        >
                            <BestSellerCard item={item} rank={index + 1} />
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default DepartmentBestSellersRow;
