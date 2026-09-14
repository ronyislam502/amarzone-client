"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight } from "lucide-react";
import { TProduct } from "@/src/types/product";
import { extractProductPriceInfo, getProductThumbnail } from "./homeUtils";

interface HomeHeroCarouselProps {
    products: TProduct[];
}

export const HomeHeroCarousel: React.FC<HomeHeroCarouselProps> = ({ products }) => {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);

    const slides = [
        {
            id: "slide-1",
            categoryBadge: "New in Electronics & Gadgets",
            title: "MacBook Pro, Smart Devices & Ultra-HD Audio",
            description: "Explore the latest in high-performance laptops, mobile tech, and connected living.",
            ctaText: "Shop now",
            ctaLink: "/#flash-deals",
            bgColor: "bg-[#e9eef6]",
            accentColor: "text-[#004f9a]",
            previewProducts: products.slice(0, 3),
        },
        {
            id: "slide-2",
            categoryBadge: "Rollbacks & Daily Essentials",
            title: "Save up to 45% on Pet Healthcare & Wellness",
            description: "Keep pets happy with vet-recommended flea defense, nutritious food, and orthopedic beds.",
            ctaText: "Explore Rollbacks",
            ctaLink: "/#rollbacks-bento",
            bgColor: "bg-[#fbeee6]",
            accentColor: "text-amber-800",
            previewProducts: products.slice(3, 6),
        },
        {
            id: "slide-3",
            categoryBadge: "Home Living & Kitchen Refresh",
            title: "Elevate Your Home with Contemporary Styles",
            description: "From cookware essentials to ambient lighting, find inspiring pieces from verified vendors.",
            ctaText: "Discover Home",
            ctaLink: "/#featured-catalog",
            bgColor: "bg-[#edf5f0]",
            accentColor: "text-emerald-800",
            previewProducts: products.slice(6, 9),
        },
    ];

    // Auto-advance timer
    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5500);
        return () => clearInterval(interval);
    }, [isPlaying, slides.length]);

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const activeSlide = slides[currentSlide];

    return (
        <section aria-label="Walmart-inspired Featured Carousel Banner" className="w-full relative select-none">
            <div
                className={`relative overflow-hidden rounded-3xl transition-colors duration-500 p-6 sm:p-8 lg:p-10 ${activeSlide.bgColor}`}
            >
                {/* Top Right Controls: Prev, Pause/Play, Next */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-1.5 bg-white/70 backdrop-blur-xs p-1 rounded-full border border-slate-200/80 shadow-xs">
                    <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Previous Slide"
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-slate-700 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        aria-label={isPlaying ? "Pause Carousel" : "Play Carousel"}
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-slate-700 transition-colors"
                    >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next Slide"
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-slate-700 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-h-[340px] sm:min-h-[380px]">
                    {/* Left Column: Headline & CTA */}
                    <div className="lg:col-span-6 space-y-4 pr-0 lg:pr-4">
                        <span className={`text-xs sm:text-sm font-extrabold uppercase tracking-wider ${activeSlide.accentColor}`}>
                            {activeSlide.categoryBadge}
                        </span>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
                            {activeSlide.title}
                        </h1>

                        <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
                            {activeSlide.description}
                        </p>

                        <div className="pt-2">
                            <Link
                                href={activeSlide.ctaLink}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-900 text-slate-900 hover:text-white border border-slate-300 font-bold text-sm shadow-xs transition-all duration-200 cursor-pointer"
                            >
                                <span>{activeSlide.ctaText}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: 3 Product Preview Cards (Walmart Style) */}
                    <div className="lg:col-span-6">
                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                            {activeSlide.previewProducts.map((product) => {
                                const priceInfo = extractProductPriceInfo(product);
                                const thumbnail = getProductThumbnail(product);
                                return (
                                    <Link
                                        key={product._id}
                                        href={`/products/${product._id}`}
                                        className="group flex flex-col justify-between bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 text-center"
                                    >
                                        <div className="relative w-full aspect-square mb-2 flex items-center justify-center overflow-hidden rounded-xl bg-slate-50/60 p-1">
                                            <Image
                                                src={thumbnail}
                                                alt={product.title}
                                                fill
                                                sizes="(max-width: 640px) 30vw, 15vw"
                                                className="object-contain group-hover:scale-105 transition-transform duration-200"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div>
                                            <h2 className="text-[11px] sm:text-xs font-semibold text-slate-800 line-clamp-2 leading-tight group-hover:text-[#0071dc]">
                                                {product.title}
                                            </h2>
                                            <p className="text-xs sm:text-sm font-black text-slate-900 mt-1">
                                                ${priceInfo.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Slide Dots */}
                <div className="flex items-center justify-center gap-2 mt-4 pt-2">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentSlide(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                currentSlide === idx ? "w-8 bg-slate-900" : "w-2 bg-slate-300 hover:bg-slate-400"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeHeroCarousel;
