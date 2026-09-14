"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { TProduct } from "@/src/types/product";
import ProductCard from "@/src/components/ui/home/ProductCard";

interface RelatedProductsCarouselProps {
  products: TProduct[];
  categoryName?: string;
}

export const RelatedProductsCarousel: React.FC<RelatedProductsCarouselProps> = ({
  products,
  categoryName = "Category",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -460 : 460;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section aria-label="Customers also viewed" className="w-full pt-8 pb-4 select-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-blue-50 text-[#0071dc] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Customers also considered
            </h2>
            <p className="text-xs text-slate-500">
              Popular alternatives in {categoryName}
            </p>
          </div>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Track */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-3 pt-1"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {products.map((prod) => (
          <div
            key={prod._id}
            className="flex-shrink-0 w-[220px] sm:w-[250px] lg:w-[270px]"
            style={{ scrollSnapAlign: "start" }}
          >
            <ProductCard product={prod} className="h-full" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProductsCarousel;
