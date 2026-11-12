"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useAllProductsByDepartmentQuery } from "@/redux/features/product/productApi";
import { PRODUCT_PLACEHOLDER } from "@/lib/constants";

interface HeroSlide {
    id: number;
    image: string;
    alt: string;
    link: string;
    headline?: string;
    subtext?: string;
}

interface HeroCard {
    id: number;
    title: string;
    type: "dept-grid" | "single";
    linkText: string;
    href: string;
    /** For dept-grid: the department _id to fetch products from */
    departmentId?: string;
    /** Department name used for the "View all" link slug */
    departmentName?: string;
    singleImage?: {
        src: string;
        alt: string;
    };
    badge?: string;
}

const HERO_SLIDES: HeroSlide[] = [
    {
        id: 1,
        image: "https://m.media-amazon.com/images/I/71Ie3JXGfVL._SX3000_.jpg",
        alt: "Shop Kitchen & Dining must-haves",
        link: "/products",
        headline: "Kitchen & Dining Favorites",
        subtext: "Top brands for your home essentials",
    },
    {
        id: 2,
        image: "https://m.media-amazon.com/images/I/71U-Q+N7PXL._SX3000_.jpg",
        alt: "Gaming & PC Deals",
        link: "/products",
        headline: "Level Up Your Setup",
        subtext: "Save up to 40% on electronics & gaming accessories",
    },
    {
        id: 3,
        image: "https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg",
        alt: "Shop All Things Beauty",
        link: "/products",
        headline: "All Things Beauty",
        subtext: "Discover glowing skincare & fragrance essentials",
    },
    {
        id: 4,
        image: "https://m.media-amazon.com/images/I/81KkrQWEHIL._SX3000_.jpg",
        alt: "Holiday Season Deals & Gifts",
        link: "/products",
        headline: "Holiday Gifts For Everyone",
        subtext: "Explore popular finds and seasonal savings",
    },
    {
        id: 5,
        image: "https://m.media-amazon.com/images/I/71vdTR50hFL._SX3000_.jpg",
        alt: "Toys & Games for All Ages",
        link: "/products",
        headline: "Toys & Games for All Ages",
        subtext: "Spark joy with trending holiday favorites",
    },
    {
        id: 6,
        image: "https://m.media-amazon.com/images/I/61zAjw4bqPL._SX3000_.jpg",
        alt: "Books, Audio & Kindle",
        link: "/products",
        headline: "Explore Bestsellers",
        subtext: "Read, listen, and discover millions of titles",
    },
];

// Department IDs from the database
const DEPT_IDS = {
    fashion: "6aa1801ba44acc89eb408586",
    homeKitchen: "6aa18027a44acc89eb40858b",
    beauty: "6aa1802fa44acc89eb408590",
    grocery: "6aa18037a44acc89eb408595",
    automotive: "6aa18046a44acc89eb40859a",
    toys: "6aa1804da44acc89eb40859f",
    health: "6aa1805ca44acc89eb4085a4",
    jewelry: "6aa18062a44acc89eb4085a9",
    baby: "6aa18069a44acc89eb4085ae",
    petSupplies: "6aa18073a44acc89eb4085b3",
};

const HERO_CARDS: HeroCard[] = [
    // Row 1
    {
        id: 1,
        title: "Plug in with our electronics",
        type: "dept-grid",
        linkText: "Shop Health & More",
        href: "/products",
        departmentId: DEPT_IDS.health,
        departmentName: "Health",
    },
    {
        id: 2,
        title: "Shop kitchen must-haves",
        type: "single",
        linkText: "Explore in kitchen",
        href: "/products",
        singleImage: {
            src: "https://m.media-amazon.com/images/I/51l7ZOsRo7L._AC_AIweblab1431263,T1_SF1282.5,2052_QL80_.jpg?aicid=homepage-single-creative-card",
            alt: "Kitchen appliances and cookware",
        },
    },
    {
        id: 3,
        title: "Fantastic Finds for Home",
        type: "dept-grid",
        linkText: "Shop Home & Kitchen",
        href: "/products",
        departmentId: DEPT_IDS.homeKitchen,
        departmentName: "Home & Kitchen",
    },
    {
        id: 4,
        title: "Save up to 40% on beauty",
        type: "single",
        linkText: "Shop early deals now",
        href: "/products",
        badge: "Limited time deal",
        singleImage: {
            src: "https://m.media-amazon.com/images/I/61g8iIoxtsL._AC_AIweblab1431263,T1_SF1282.5,2052_QL80_.jpg?aicid=homepage-single-creative-card",
            alt: "Top deals and gadgets",
        },
    },

    // Row 2
    {
        id: 5,
        title: "Score top Toys & Games",
        type: "dept-grid",
        linkText: "See more Toys",
        href: "/products",
        departmentId: DEPT_IDS.toys,
        departmentName: "Toys",
    },
    {
        id: 6,
        title: "Shop all things beauty",
        type: "single",
        linkText: "Discover beauty picks",
        href: "/products",
        singleImage: {
            src: "https://m.media-amazon.com/images/I/61Ld77LHXQL._AC_AIweblab1431263,T1_SF1282.5,1981.5_QL80_.jpg?aicid=homepage-single-creative-card",
            alt: "Skincare, perfume, and beauty care",
        },
    },
    {
        id: 7,
        title: "Fashion & Style Finds",
        type: "dept-grid",
        linkText: "Shop the collection",
        href: "/products",
        departmentId: DEPT_IDS.fashion,
        departmentName: "Fashion",
    },
    {
        id: 8,
        title: "Gear up for Pets",
        type: "dept-grid",
        linkText: "Discover pet supplies",
        href: "/products",
        departmentId: DEPT_IDS.petSupplies,
        departmentName: "Pet Supplies",
    },
];

// ─── Department Product Grid (fetches 4 real products) ───────────────────────
const DeptProductGrid: React.FC<{ departmentId: string; departmentName?: string }> = ({
    departmentId,
    departmentName,
}) => {
    const { data, isLoading } = useAllProductsByDepartmentQuery(departmentId);
    const products = (data?.data || []).slice(0, 4);

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-square w-full rounded-xs bg-slate-100" />
                        <div className="mt-1.5 h-2.5 w-3/4 rounded bg-slate-100" />
                    </div>
                ))}
            </div>
        );
    }

    if (!products.length) {
        return (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-start">
                        <div className="aspect-square w-full rounded-xs bg-slate-100 flex items-center justify-center">
                            <span className="text-[9px] text-slate-400">No image</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {products.map((product: any, i: number) => (
                <Link
                    key={product._id || i}
                    href={`/products/${product._id}`}
                    className="group/item flex flex-col items-start"
                >
                    <div className="w-full aspect-square bg-[#f7f7f7] overflow-hidden flex items-center justify-center p-1.5 rounded-xs">
                        <Image
                            src={product.thumbnail || PRODUCT_PLACEHOLDER}
                            alt={product.title || "Product"}
                            width={150}
                            height={150}
                            unoptimized
                            className="h-full w-full object-contain group-hover/item:scale-105 transition-transform duration-200"
                            onError={(e: any) => { e.currentTarget.src = PRODUCT_PLACEHOLDER; }}
                        />
                    </div>
                    <span className="text-[11px] text-slate-700 font-normal leading-tight mt-1.5 group-hover/item:text-[#c7511f] transition-colors truncate w-full">
                        {product.title
                            ? product.title.split(" ").slice(0, 4).join(" ")
                            : "Product"}
                    </span>
                </Link>
            ))}
        </div>
    );
};

// ─── Main Hero Component ──────────────────────────────────────────────────────
const AmazonHero: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    }, []);

    // Autoplay ticker
    useEffect(() => {
        if (!isAutoPlaying) return;
        timerRef.current = setInterval(nextSlide, 5500);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isAutoPlaying, nextSlide]);

    return (
        <section className="relative w-full bg-[#e3e6e6] pb-6 overflow-hidden select-none">
            {/* ─────────────────────────────────────────────────────────────
                1. FULL-BLEED HERO BANNER ROTATOR
               ───────────────────────────────────────────────────────────── */}
            <div
                className="relative w-full max-w-7xl mx-auto overflow-hidden group/hero"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
            >
                {/* Slides Container */}
                <div className="relative w-full h-[260px] sm:h-[380px] md:h-[460px] lg:h-[580px]">
                    {HERO_SLIDES.map((slide, idx) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                            }`}
                        >
                            <Link href={slide.link} className="block w-full h-full relative">
                                <Image
                                    src={slide.image}
                                    alt={slide.alt}
                                    fill
                                    priority={idx === 0}
                                    unoptimized
                                    className="object-cover object-top"
                                    sizes="100vw"
                                />
                            </Link>
                        </div>
                    ))}

                    {/* Amazon Bottom Gradient Fade */}
                    <div
                        className="absolute inset-x-0 bottom-0 h-44 sm:h-56 md:h-72 lg:h-80 z-10 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(to bottom, rgba(227,230,230,0) 0%, rgba(227,230,230,0.65) 55%, rgba(227,230,230,1) 100%)",
                        }}
                    />
                </div>

                {/* Left Navigation Chevron */}
                <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="absolute left-2 sm:left-4 top-20 sm:top-28 md:top-36 z-20 h-24 sm:h-32 w-10 sm:w-12 rounded-sm bg-transparent hover:bg-white/20 active:bg-white/30 text-slate-800 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#007185] cursor-pointer"
                >
                    <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 text-slate-900 drop-shadow-sm stroke-[2]" />
                </button>

                {/* Right Navigation Chevron */}
                <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="absolute right-2 sm:right-4 top-20 sm:top-28 md:top-36 z-20 h-24 sm:h-32 w-10 sm:w-12 rounded-sm bg-transparent hover:bg-white/20 active:bg-white/30 text-slate-800 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#007185] cursor-pointer"
                >
                    <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 text-slate-900 drop-shadow-sm stroke-[2]" />
                </button>

                {/* Autoplay Pause / Play Toggle */}
                <div className="absolute right-4 top-3 z-20 hidden sm:flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-white text-[11px] font-medium px-2 py-1 rounded-full backdrop-blur-xs transition-colors">
                    <button
                        type="button"
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                        className="flex items-center gap-1 cursor-pointer focus:outline-none"
                    >
                        {isAutoPlaying ? (
                            <>
                                <Pause className="w-3 h-3 fill-white" />
                                <span>Pause</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-3 h-3 fill-white" />
                                <span>Play</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                2. OVERLAPPING BENTO GRID CARDS (4-COLUMN)
               ───────────────────────────────────────────────────────────── */}
            <div className="relative z-20 max-w-[1480px] mx-auto px-4 sm:px-6 -mt-24 sm:-mt-44 md:-mt-60 lg:-mt-72 space-y-5">
                {/* Row 1 (4 Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {HERO_CARDS.slice(0, 4).map((card) => (
                        <HeroCard key={card.id} card={card} />
                    ))}
                </div>

                {/* Row 2 (4 Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {HERO_CARDS.slice(4, 8).map((card) => (
                        <HeroCard key={card.id} card={card} />
                    ))}
                </div>
            </div>
        </section>
    );
};

// ─── Shared Card Wrapper ──────────────────────────────────────────────────────
const HeroCard: React.FC<{ card: HeroCard }> = ({ card }) => (
    <div className="bg-white rounded-none border border-slate-200/80 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow duration-200">
        {/* Card Heading */}
        <div>
            <h2 className="text-lg sm:text-[21px] font-bold text-slate-900 leading-snug tracking-tight mb-3">
                {card.title}
            </h2>

            {/* Dynamic DB product grid */}
            {card.type === "dept-grid" && card.departmentId && (
                <DeptProductGrid
                    departmentId={card.departmentId}
                    departmentName={card.departmentName}
                />
            )}

            {/* Single large feature image */}
            {card.type === "single" && card.singleImage && (
                <Link href={card.href} className="group/single block">
                    <div className="relative w-full h-[230px] sm:h-[260px] md:h-[275px] bg-[#f7f7f7] overflow-hidden rounded-xs">
                        <Image
                            src={card.singleImage.src}
                            alt={card.singleImage.alt}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-300 group-hover/single:scale-105"
                            sizes="(max-width: 640px) 95vw, 320px"
                        />
                    </div>
                </Link>
            )}
        </div>

        {/* Card Footer Link */}
        <div className="pt-3.5 mt-auto">
            <Link
                href={card.href}
                className="text-[13px] font-medium text-[#007185] hover:text-[#c7511f] hover:underline transition-colors inline-block"
            >
                {card.linkText}
            </Link>
        </div>
    </div>
);

export default AmazonHero;
