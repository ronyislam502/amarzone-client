"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Zap, Sparkles } from "lucide-react";
import { TProduct } from "@/src/types/product";
import ProductCard from "./ProductCard";

interface ProductCarouselSectionProps {
    id?: string;
    title: string;
    subtitle?: string;
    badgeText?: string;
    badgeIcon?: "zap" | "sparkles" | "deal";
    products: TProduct[];
    viewAllLink?: string;
    isRollback?: boolean;
    showCountdown?: boolean;
}

export const ProductCarouselSection: React.FC<ProductCarouselSectionProps> = ({
    id,
    title,
    subtitle,
    badgeText,
    badgeIcon = "zap",
    products,
    viewAllLink = "/#featured-catalog",
    isRollback = false,
    showCountdown = false,
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [timeLeft, setTimeLeft] = React.useState({ hours: 7, minutes: 34, seconds: 22 });

    React.useEffect(() => {
        if (!showCountdown) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 12, minutes: 0, seconds: 0 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [showCountdown]);

    const scroll = (direction: "left" | "right") => {
        if (!scrollContainerRef.current) return;
        const offset = direction === "left" ? -460 : 460;
        scrollContainerRef.current.scrollBy({
            left: offset,
            behavior: "smooth",
        });
    };

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section id={id} aria-label={title} className="w-full select-none">
            {/* Header with Title, Badge, View All, and Scroll Controls */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                {title}
                            </h2>
                            {badgeText && (
                                <span className="inline-flex items-center gap-1 bg-[#cc0000] text-white text-[11px] font-black px-2 py-0.5 rounded-sm">
                                    {badgeIcon === "zap" && <Zap className="w-3 h-3 fill-white" />}
                                    {badgeIcon === "sparkles" && <Sparkles className="w-3 h-3 fill-white" />}
                                    <span>{badgeText}</span>
                                </span>
                            )}
                            {showCountdown && (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold shadow-xs">
                                    <span className="text-slate-400 text-[10px] uppercase font-semibold">Ends:</span>
                                    <span className="font-mono text-amber-300">
                                        {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                                        {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
                                        {String(timeLeft.seconds).padStart(2, "0")}s
                                    </span>
                                </div>
                            )}
                        </div>
                        {subtitle && (
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    {viewAllLink && (
                        <Link
                            href={viewAllLink}
                            className="text-xs sm:text-sm font-bold text-[#0071dc] hover:underline flex items-center gap-1 mr-1 sm:mr-2"
                        >
                            <span>View all</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}

                    {/* Circular Nav Buttons */}
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => scroll("left")}
                            aria-label={`Scroll ${title} left`}
                            className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scroll("right")}
                            aria-label={`Scroll ${title} right`}
                            className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Horizontal Scroll Track */}
            <div
                ref={scrollContainerRef}
                className="flex items-stretch gap-3.5 overflow-x-auto scroll-smooth no-scrollbar pb-3 pt-1"
                style={{ scrollSnapType: "x mandatory" }}
            >
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="flex-shrink-0 w-[220px] sm:w-[250px] lg:w-[270px]"
                        style={{ scrollSnapAlign: "start" }}
                    >
                        <ProductCard
                            product={product}
                            isRollback={isRollback}
                            className="h-full"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProductCarouselSection;
