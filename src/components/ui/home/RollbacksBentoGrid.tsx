"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { TProduct } from "@/src/types/product";
import { TDepartment } from "@/types/department";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { slugify, matchesSlug } from "@/utils/slug";
import { extractProductPriceInfo, getProductThumbnail, useHomeProducts } from "./homeUtils";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/src/components/ui/carousel";

interface RollbacksBentoGridProps {
    products?: TProduct[];
}

const DEPARTMENT_SUBTITLES: Record<string, string> = {
    "electronics": "Laptops, audio & smart tech",
    "home-and-kitchen": "Cookware, dining & living",
    "home-kitchen": "Cookware, dining & living",
    "pet-supplies": "Nutrition, beds & healthcare",
    "fashion": "Apparel, footwear & skincare",
    "beauty": "Skincare, cosmetics & wellness",
    "grocery": "Pantry, snacks & essentials",
    "toys": "Games, puzzles & action figures",
    "sports": "Fitness, outdoor & recreation",
    "baby": "Strollers, nursery & essentials",
    "health": "Vitamins, first-aid & monitors",
    "automotive": "Parts, tools & car care",
    "jewelry": "Watches, rings & accessories",
};

const getDepartmentSubtitle = (name: string, slug: string): string => {
    return (
        DEPARTMENT_SUBTITLES[slug] ||
        DEPARTMENT_SUBTITLES[slug.replace(/-and-/g, "-")] ||
        `Curated rollbacks & essentials in ${name}`
    );
};

export const RollbacksBentoGrid: React.FC<RollbacksBentoGridProps> = ({ products: propProducts }) => {
    const { products: allProducts } = useHomeProducts(propProducts);
    const products = (propProducts && propProducts.length > 0) ? propProducts : allProducts;

    const [api, setApi] = useState<CarouselApi>();
    const plugin = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: false })
    );

    // Fetch live department data from the database
    const { data: deptResponse, isLoading: isLoadingDepts } = useAllDepartmentsQuery({
        limit: 100,
    });

    const departments: TDepartment[] = (deptResponse as any)?.data || [];

    // Display all active departments in the carousel
    const displayDepartments = departments.length > 0 ? departments : [];

    const scroll = (direction: "left" | "right") => {
        if (!api) return;
        if (direction === "left") {
            api.scrollPrev();
        } else {
            api.scrollNext();
        }
    };

    // Partition / filter products belonging to each department (4 items per tile = 2x2 grid)
    const getDepartmentProducts = (dept: TDepartment, index: number): TProduct[] => {
        if (!products || products.length === 0) return [];

        // 1. Prioritize products matching this department by id or name
        const deptProducts = products.filter((p) => {
            const pDept = p.department;
            if (!pDept) return false;
            if (typeof pDept === "object" && pDept !== null) {
                return (
                    pDept._id === dept._id ||
                    matchesSlug(pDept.name, dept.name) ||
                    matchesSlug(pDept.name, slugify(dept.name))
                );
            }
            return pDept === dept._id;
        });

        if (deptProducts.length >= 4) {
            return deptProducts.slice(0, 4);
        }

        // 2. Fill remaining slots from products array to ensure complete 2x2 presentation
        const remaining = 4 - deptProducts.length;
        const startIndex = (index * 4) % products.length;
        const fillers: TProduct[] = [];

        for (let i = 0; i < products.length && fillers.length < remaining; i++) {
            const candidate = products[(startIndex + i) % products.length];
            if (
                !deptProducts.some((p) => p._id === candidate._id) &&
                !fillers.some((p) => p._id === candidate._id)
            ) {
                fillers.push(candidate);
            }
        }

        return [...deptProducts, ...fillers];
    };

    return (
        <section id="rollbacks-bento" aria-label="Walmart Rollbacks and More" className="w-full select-none">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#cc0000] text-white">
                        <Tag className="w-4 h-4 fill-white" />
                    </span>
                    <div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <span>Rollbacks & more</span>
                            <span className="text-xs font-bold text-[#cc0000] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                Up to 50% off
                            </span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                            Hundreds of price drops across verified vendors
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0071dc] hover:underline"
                    >
                        <span>View all deals</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    {/* Circular Nav Buttons */}
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => scroll("left")}
                            aria-label="Scroll rollbacks left"
                            className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scroll("right")}
                            aria-label="Scroll rollbacks right"
                            className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Embla Carousel Track */}
            {isLoadingDepts && displayDepartments.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between animate-pulse"
                        >
                            <div className="space-y-2">
                                <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                                <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                            </div>
                            <div className="grid grid-cols-2 gap-2.5 my-3.5">
                                {Array.from({ length: 4 }).map((_, pIdx) => (
                                    <div key={pIdx} className="bg-slate-100 rounded-xl aspect-square" />
                                ))}
                            </div>
                            <div className="pt-2 border-t border-slate-100">
                                <div className="h-3 bg-slate-200 rounded-md w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Carousel
                    setApi={setApi}
                    plugins={[plugin.current]}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent className="-ml-4 pb-2 pt-1">
                        {displayDepartments.map((dept, colIdx) => {
                            const deptSlug = slugify(dept.name);
                            const subtitle = getDepartmentSubtitle(dept.name, deptSlug);
                            const deptHref = `/${deptSlug}`;
                            const colProducts = getDepartmentProducts(dept, colIdx);

                            return (
                                <CarouselItem
                                    key={dept._id || dept.name}
                                    className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                                >
                                    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-full">
                                        {/* Card Header */}
                                        <div>
                                            <Link href={deptHref} className="group/header block">
                                                <h3 className="text-sm font-black text-slate-900 leading-tight group-hover/header:text-[#0071dc] transition-colors">
                                                    {dept.name}
                                                </h3>
                                                <p className="text-[11px] text-slate-500 mt-0.5">
                                                    {subtitle}
                                                </p>
                                            </Link>
                                        </div>

                                        {/* 2x2 Mini Product Grid */}
                                        <div className="grid grid-cols-2 gap-2.5 my-3.5">
                                            {colProducts.map((prod) => {
                                                const priceInfo = extractProductPriceInfo(prod);
                                                const thumbnail = getProductThumbnail(prod);

                                                return (
                                                    <Link
                                                        key={prod._id}
                                                        href={`/products/${prod._id}`}
                                                        className="group flex flex-col items-start bg-slate-50/60 hover:bg-slate-100/70 rounded-xl p-2 transition-colors"
                                                    >
                                                        <div className="relative w-full aspect-square mb-1.5 rounded-lg bg-white p-1 overflow-hidden flex items-center justify-center">
                                                            <Image
                                                                src={thumbnail}
                                                                alt={prod.title}
                                                                fill
                                                                sizes="(max-width: 640px) 40vw, (max-width: 1024px) 20vw, 10vw"
                                                                className="object-contain group-hover:scale-105 transition-transform duration-200"
                                                                loading="lazy"
                                                            />
                                                        </div>

                                                        {/* Price */}
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-xs font-black text-slate-900">
                                                                ${priceInfo.price.toFixed(2)}
                                                            </span>
                                                            {priceInfo.originalPrice > priceInfo.price && (
                                                                <span className="text-[10px] text-slate-400 line-through">
                                                                    ${priceInfo.originalPrice.toFixed(0)}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Title Snippet */}
                                                        <span className="text-[10px] text-slate-600 truncate w-full group-hover:text-[#0071dc]">
                                                            {prod.title}
                                                        </span>
                                                    </Link>
                                                );
                                            })}
                                        </div>

                                        {/* Footer Link */}
                                        <div className="pt-1 border-t border-slate-100">
                                            <Link
                                                href={deptHref}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-[#0071dc] hover:underline"
                                            >
                                                <span>Shop all</span>
                                                <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                </Carousel>
            )}
        </section>
    );
};

export default RollbacksBentoGrid;
