"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import {
    ChevronLeft,
    ChevronRight,
    History,
    Trash2,
} from "lucide-react";
import {
    clearBrowsingHistory,
    getBrowsingHistorySnapshot,
    getBrowsingHistoryServerSnapshot,
    subscribeBrowsingHistory,
    type BrowsingHistoryCardProduct,
} from "@/lib/browsingHistory";
import AZProductCard from "@/components/shared/AZProductCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/shared/carousel";

/* ─────────────────────────────────────────────────
   Main BrowsingHistoryView
───────────────────────────────────────────────── */
const BrowsingHistoryView: React.FC = () => {
    const products = useSyncExternalStore(
        subscribeBrowsingHistory,
        getBrowsingHistorySnapshot,
        getBrowsingHistoryServerSnapshot
    );

    const [api, setApi] = useState<CarouselApi>();
    const [currentSnap, setCurrentSnap] = useState(0);
    const [snapCount, setSnapCount] = useState(1);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const onSelect = useCallback((carouselApi: CarouselApi) => {
        if (!carouselApi) return;
        setSnapCount(carouselApi.scrollSnapList().length || 1);
        setCurrentSnap(carouselApi.selectedScrollSnap());
        setCanScrollPrev(carouselApi.canScrollPrev());
        setCanScrollNext(carouselApi.canScrollNext());
    }, []);

    useEffect(() => {
        if (!api) return;
        const rafId = requestAnimationFrame(() => onSelect(api));
        api.on("reInit", onSelect);
        api.on("select", onSelect);
        return () => {
            cancelAnimationFrame(rafId);
            api.off("select", onSelect);
            api.off("reInit", onSelect);
        };
    }, [api, onSelect]);

    useEffect(() => {
        if (api && products.length > 0) {
            api.reInit();
        }
    }, [api, products]);

    const handleClearHistory = () => {
        clearBrowsingHistory();
        setShowClearConfirm(false);
    };

    if (products.length === 0) return null;

    const totalPages = snapCount || 1;
    const currentPage = currentSnap + 1;

    return (
        <section className="w-full bg-slate-200 p-10 rounded-lg my-6">
            {/* Header */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="">
                    <History className="w-5 h-5 text-[#0071dc] shrink-0" />
                    <h2 className="text-[15px] sm:text-[18px] md:text-[20px] font-bold text-gray-900 tracking-tight leading-tight">
                        Customers who viewed items in your browsing history also viewed
                    </h2>
                </div>

                {/* Page counter, Clear button & Navigation arrows */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <span className="text-xs text-gray-500 font-normal hidden sm:inline">
                        Page {currentPage} of {totalPages}
                    </span>

                    {!showClearConfirm ? (
                        <button
                            type="button"
                            onClick={() => setShowClearConfirm(true)}
                            title="Clear browsing history"
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Clear</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-600 font-medium">Clear?</span>
                            <button
                                type="button"
                                onClick={handleClearHistory}
                                className="text-red-600 font-bold hover:underline cursor-pointer"
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowClearConfirm(false)}
                                className="text-gray-400 hover:underline cursor-pointer"
                            >
                                No
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-1.5">
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
            </div>

            {/* Products Carousel */}
            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    slidesToScroll: "auto",
                    loop: false,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-3.5">
                    {products.map((prod: BrowsingHistoryCardProduct, index: number) => (
                        <CarouselItem
                            key={`${prod._id || prod.variantId}-${index}`}
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

export default BrowsingHistoryView;
