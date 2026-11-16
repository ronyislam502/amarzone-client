"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/shared/carousel";
import AZProductCard from "@/components/shared/AZProductCard";
import ProductGridSkeleton from "@/components/shared/skeleton/ProductGridSkeleton";
import { useAllVariantsProductsByCategoryQuery } from "@/redux/features/variant/variantApi";

interface CategoryProdProps {
    categoryId?: string;
    categoryName?: string;
    currentProductId?: string;
    excludedVariantIds?: string[];
}

const CategoryProd: React.FC<CategoryProdProps> = ({
    categoryId,
    categoryName,
    currentProductId,
    excludedVariantIds = [],
}) => {
    const [api, setApi] = useState<CarouselApi>();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    // Fetch products belonging to the same category
    const {
        data: categoryProductsData,
        isLoading,
        isError,
    } = useAllVariantsProductsByCategoryQuery(
        categoryId ? { id: categoryId, limit: 30 } : "",
        { skip: !categoryId }
    );

    // Filter out the current product and any of its variants displayed on this page
    const relatedProducts = useMemo(() => {
        const rawProducts: any[] = categoryProductsData?.data || [];
        if (!rawProducts.length) return [];

        const normalizedCurrentProductId = currentProductId ? String(currentProductId) : "";
        const excludedSet = new Set(
            (excludedVariantIds || []).map((id) => String(id))
        );

        // 1. Exclude products whose variants belong to the current product
        const filtered = rawProducts.filter((item: any) => {
            const itemProdId = item?.productId ? String(item.productId) : "";
            const itemVariantId = item?._id ? String(item._id) : "";
            const directVariantId = item?.variantId ? String(item.variantId) : "";

            // Exclude if it belongs to the current product
            if (
                normalizedCurrentProductId &&
                (itemProdId === normalizedCurrentProductId || itemVariantId === normalizedCurrentProductId)
            ) {
                return false;
            }

            // Exclude if this variant ID is one of the current product's variants
            if (
                excludedSet.has(itemVariantId) ||
                (directVariantId && excludedSet.has(directVariantId))
            ) {
                return false;
            }

            return true;
        });

        // 2. Deduplicate by productId so each distinct related product is represented
        const uniqueByProduct: any[] = [];
        const seen = new Set<string>();

        for (const item of filtered) {
            const key = item?.productId ? String(item.productId) : String(item?._id);
            if (!seen.has(key)) {
                seen.add(key);
                uniqueByProduct.push(item);
            }
        }

        // If deduplicated count is at least 4, use it; otherwise fallback to all filtered variants
        return uniqueByProduct.length >= 4 ? uniqueByProduct : filtered;
    }, [categoryProductsData, currentProductId, excludedVariantIds]);

    // Handle carousel scroll status updates
    const onSelect = useCallback((carouselApi: CarouselApi) => {
        if (!carouselApi) return;
        setCanScrollPrev(carouselApi.canScrollPrev());
        setCanScrollNext(carouselApi.canScrollNext());
    }, []);

    useEffect(() => {
        if (!api) return;
        onSelect(api);
        api.on("reInit", onSelect);
        api.on("select", onSelect);
        return () => {
            api.off("select", onSelect);
        };
    }, [api, onSelect]);

    if (!categoryId) return null;

    if (isLoading) {
        return (
            <section className="pt-8 border-t border-slate-200 select-none">
                <div className="mb-4">
                    <div className="h-6 w-64 bg-slate-200 rounded animate-pulse mb-1.5" />
                    <div className="h-4 w-44 bg-slate-100 rounded animate-pulse" />
                </div>
                <ProductGridSkeleton
                    count={5}
                    gridClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5"
                />
            </section>
        );
    }

    if (isError || relatedProducts.length === 0) {
        return null;
    }

    return (
        <section className="pt-8 border-t border-slate-200 select-none">
            {/* Header */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <Layers className="h-5 w-5 text-[#0071dc]" />
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#0f1111]">
                            Products related to this item
                        </h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                        More top picks from{" "}
                        <span className="font-semibold text-slate-700">
                            {categoryName || "this category"}
                        </span>
                    </p>
                </div>

                {/* Navigation arrows & link */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                        type="button"
                        onClick={() => api?.scrollPrev()}
                        disabled={!canScrollPrev}
                        aria-label="Previous products"
                        className="btn btn-sm btn-circle btn-outline border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    >
                        <ChevronLeft className="h-4 w-4 text-slate-700" />
                    </button>
                    <button
                        type="button"
                        onClick={() => api?.scrollNext()}
                        disabled={!canScrollNext}
                        aria-label="Next products"
                        className="btn btn-sm btn-circle btn-outline border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    >
                        <ChevronRight className="h-4 w-4 text-slate-700" />
                    </button>
                </div>
            </div>

            {/* Products Carousel */}
            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    loop: false,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-3.5">
                    {relatedProducts.map((prod: any) => (
                        <CarouselItem
                            key={prod._id || prod.variantId}
                            className="pl-3.5 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/5"
                        >
                            <AZProductCard product={prod} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
};

export default CategoryProd;