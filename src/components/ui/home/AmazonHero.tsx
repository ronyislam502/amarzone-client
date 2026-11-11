"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface HeroSlide {
    id: number;
    image: string;
    alt: string;
    link: string;
    headline?: string;
    subtext?: string;
}

interface GridItem {
    label: string;
    image: string;
    href: string;
}

interface HeroCard {
    id: number;
    title: string;
    type: "grid" | "single";
    linkText: string;
    href: string;
    gridItems?: GridItem[];
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
        link: "/products?category=kitchen",
        headline: "Kitchen & Dining Favorites",
        subtext: "Top brands for your home essentials",
    },
    {
        id: 2,
        image: "https://m.media-amazon.com/images/I/71U-Q+N7PXL._SX3000_.jpg",
        alt: "Gaming & PC Deals",
        link: "/products?category=computers",
        headline: "Level Up Your Setup",
        subtext: "Save up to 40% on electronics & gaming accessories",
    },
    {
        id: 3,
        image: "https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg",
        alt: "Shop All Things Beauty",
        link: "/products?category=beauty",
        headline: "All Things Beauty",
        subtext: "Discover glowing skincare & fragrance essentials",
    },
    {
        id: 4,
        image: "https://m.media-amazon.com/images/I/81KkrQWEHIL._SX3000_.jpg",
        alt: "Holiday Season Deals & Gifts",
        link: "/products?category=gifts",
        headline: "Holiday Gifts For Everyone",
        subtext: "Explore popular finds and seasonal savings",
    },
    {
        id: 5,
        image: "https://m.media-amazon.com/images/I/71vdTR50hFL._SX3000_.jpg",
        alt: "Toys & Games for All Ages",
        link: "/products?category=toys",
        headline: "Toys & Games for All Ages",
        subtext: "Spark joy with trending holiday favorites",
    },
    {
        id: 6,
        image: "https://m.media-amazon.com/images/I/61zAjw4bqPL._SX3000_.jpg",
        alt: "Books, Audio & Kindle",
        link: "/products?search=kindle",
        headline: "Explore Kindle+ and Bestsellers",
        subtext: "Read, listen, and discover millions of titles",
    },
];

const HERO_CARDS: HeroCard[] = [
    // Row 1
    {
        id: 1,
        title: "Plug in with our electronics",
        type: "grid",
        linkText: "See more",
        href: "/products?category=electronics",
        gridItems: [
            {
                label: "Headphones",
                image: "https://m.media-amazon.com/images/I/417NhPd56zL._SR210,210_.jpg",
                href: "/products?search=headphones",
            },
            {
                label: "Tablets",
                image: "https://m.media-amazon.com/images/I/41dMYqsSuGL._SR210,210_.jpg",
                href: "/products?search=tablet",
            },
            {
                label: "Gaming",
                image: "https://m.media-amazon.com/images/I/41gk0-eoy4L._SR210,210_.jpg",
                href: "/products?search=gaming",
            },
            {
                label: "Speakers",
                image: "https://m.media-amazon.com/images/I/41uuEMle6TL._SR210,210_.jpg",
                href: "/products?search=speaker",
            },
        ],
    },
    {
        id: 2,
        title: "Shop kitchen must-haves",
        type: "single",
        linkText: "Explore in kitchen",
        href: "/products?category=kitchen",
        singleImage: {
            src: "https://m.media-amazon.com/images/I/51l7ZOsRo7L._AC_AIweblab1431263,T1_SF1282.5,2052_QL80_.jpg?aicid=homepage-single-creative-card",
            alt: "Kitchen appliances and cookware",
        },
    },
    {
        id: 3,
        title: "Fantastic Finds for Home",
        type: "grid",
        linkText: "Shop the latest",
        href: "/products?category=home",
        gridItems: [
            {
                label: "Kitchen",
                image: "https://m.media-amazon.com/images/I/41opB3I6bHL._SR210,210_.jpg",
                href: "/products?category=kitchen",
            },
            {
                label: "Home Decor",
                image: "https://m.media-amazon.com/images/I/31zR9dINh6L._SR210,210_.jpg",
                href: "/products?category=decor",
            },
            {
                label: "Dining",
                image: "https://m.media-amazon.com/images/I/41bvMGlDk4L._SR210,210_.jpg",
                href: "/products?category=dining",
            },
            {
                label: "Smart Home",
                image: "https://m.media-amazon.com/images/I/314AasupNAL._SR210,210_.jpg",
                href: "/products?category=smarthome",
            },
        ],
    },
    {
        id: 4,
        title: "Save up to 40% on electronics",
        type: "single",
        linkText: "Shop early deals now",
        href: "/products?deal=electronics",
        badge: "Limited time deal",
        singleImage: {
            src: "https://m.media-amazon.com/images/I/61g8iIoxtsL._AC_AIweblab1431263,T1_SF1282.5,2052_QL80_.jpg?aicid=homepage-single-creative-card",
            alt: "Top electronic deals and gadgets",
        },
    },

    // Row 2
    {
        id: 5,
        title: "Score the top PCs & Accessories",
        type: "grid",
        linkText: "See more PCs",
        href: "/products?category=computers",
        gridItems: [
            {
                label: "Desktops",
                image: "https://m.media-amazon.com/images/I/31aw+nYkUmL._SR210,210_.jpg",
                href: "/products?search=desktop",
            },
            {
                label: "Laptops",
                image: "https://m.media-amazon.com/images/I/31hqkoNqvTL._SR210,210_.jpg",
                href: "/products?search=laptop",
            },
            {
                label: "Hard Drives",
                image: "https://m.media-amazon.com/images/I/217Arq+nObL._SR210,210_.jpg",
                href: "/products?search=storage",
            },
            {
                label: "PC Accessories",
                image: "https://m.media-amazon.com/images/I/312z6VjcSmL._SR210,210_.jpg",
                href: "/products?search=accessories",
            },
        ],
    },
    {
        id: 6,
        title: "Shop all things beauty",
        type: "single",
        linkText: "Discover beauty picks",
        href: "/products?category=beauty",
        singleImage: {
            src: "https://m.media-amazon.com/images/I/61Ld77LHXQL._AC_AIweblab1431263,T1_SF1282.5,1981.5_QL80_.jpg?aicid=homepage-single-creative-card",
            alt: "Skincare, perfume, and beauty care",
        },
    },
    {
        id: 7,
        title: "Apparel under $25",
        type: "grid",
        linkText: "Shop the collection",
        href: "/products?maxPrice=25",
        gridItems: [
            {
                label: "Women",
                image: "https://m.media-amazon.com/images/I/41DNYos4L1L._SR210,210_.jpg",
                href: "/products?category=women",
            },
            {
                label: "Men",
                image: "https://m.media-amazon.com/images/I/31-zpA1B2zL._SR210,210_.jpg",
                href: "/products?category=men",
            },
            {
                label: "Girls",
                image: "https://m.media-amazon.com/images/I/41J+KoaCycL._SR210,210_.jpg",
                href: "/products?category=girls",
            },
            {
                label: "Boys",
                image: "https://m.media-amazon.com/images/I/31YRD7rRprL._SR210,210_.jpg",
                href: "/products?category=boys",
            },
        ],
    },
    {
        id: 8,
        title: "Gear up to get fit",
        type: "grid",
        linkText: "Discover fitness deals",
        href: "/products?category=fitness",
        gridItems: [
            {
                label: "Clothing",
                image: "https://m.media-amazon.com/images/I/41CutKsrzNL._SR210,210_.jpg",
                href: "/products?search=athletic+wear",
            },
            {
                label: "Trackers",
                image: "https://m.media-amazon.com/images/I/41RKKF01YxL._SR210,210_.jpg",
                href: "/products?search=fitness+tracker",
            },
            {
                label: "Equipment",
                image: "https://m.media-amazon.com/images/I/41MjMjLh9BL._SR210,210_.jpg",
                href: "/products?search=exercise+equipment",
            },
            {
                label: "Deals",
                image: "https://m.media-amazon.com/images/I/41idnUIEIZL._SR210,210_.jpg",
                href: "/products?deal=fitness",
            },
        ],
    },
];

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
                1. FULL-BLEED HERO BANNER ROTATOR (AMAZON TALLHERO CAROUSEL)
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
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
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

                    {/* Iconic Amazon Bottom Gradient Fade */}
                    <div
                        className="absolute inset-x-0 bottom-0 h-44 sm:h-56 md:h-72 lg:h-80 z-10 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(to bottom, rgba(227,230,230,0) 0%, rgba(227,230,230,0.65) 55%, rgba(227,230,230,1) 100%)",
                        }}
                    />
                </div>

                {/* Left Navigation Chevron Button */}
                <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="absolute left-2 sm:left-4 top-20 sm:top-28 md:top-36 z-20 h-24 sm:h-32 w-10 sm:w-12 rounded-sm bg-transparent hover:bg-white/20 active:bg-white/30 text-slate-800 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#007185] cursor-pointer"
                >
                    <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 text-slate-900 drop-shadow-sm stroke-[2]" />
                </button>

                {/* Right Navigation Chevron Button */}
                <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="absolute right-2 sm:right-4 top-20 sm:top-28 md:top-36 z-20 h-24 sm:h-32 w-10 sm:w-12 rounded-sm bg-transparent hover:bg-white/20 active:bg-white/30 text-slate-800 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#007185] cursor-pointer"
                >
                    <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 text-slate-900 drop-shadow-sm stroke-[2]" />
                </button>

                {/* Autoplay Pause / Play Toggle (Amazon style top-right) */}
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
                2. OVERLAPPING BENTO GRID CARDS (AMAZON 4-COLUMN CARDS)
               ───────────────────────────────────────────────────────────── */}
            <div className="relative z-20 max-w-[1480px] mx-auto px-4 sm:px-6 -mt-24 sm:-mt-44 md:-mt-60 lg:-mt-72 space-y-5">
                {/* Row 1 (4 Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {HERO_CARDS.slice(0, 4).map((card) => (
                        <div
                            key={card.id}
                            className="bg-white rounded-none border border-slate-200/80 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow duration-200"
                        >
                            {/* Card Heading */}
                            <div>
                                <h2 className="text-lg sm:text-[21px] font-bold text-slate-900 leading-snug tracking-tight mb-3">
                                    {card.title}
                                </h2>

                                {/* Card Body: 2x2 Grid Type */}
                                {card.type === "grid" && card.gridItems && (
                                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                                        {card.gridItems.map((item, i) => (
                                            <Link
                                                key={i}
                                                href={item.href}
                                                className="group/item flex flex-col items-start block"
                                            >
                                                <div className="relative w-full aspect-square bg-[#f7f7f7] overflow-hidden flex items-center justify-center p-1.5 rounded-xs">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.label}
                                                        fill
                                                        unoptimized
                                                        className="object-contain p-1 group-hover/item:scale-105 transition-transform duration-200"
                                                        sizes="(max-width: 640px) 45vw, 150px"
                                                    />
                                                </div>
                                                <span className="text-[12px] text-slate-800 font-normal leading-tight mt-1.5 group-hover/item:text-[#c7511f] transition-colors truncate w-full">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Card Body: Single Large Hero Feature Type */}
                                {card.type === "single" && card.singleImage && (
                                    <Link href={card.href} className="group/single block">
                                        <div className="relative w-full h-[230px] sm:h-[260px] md:h-[275px] bg-[#f7f7f7] overflow-hidden rounded-xs">
                                            <Image
                                                src={card.singleImage.src}
                                                alt={card.singleImage.alt}
                                                fill
                                                unoptimized
                                                className="object-cover group-hover/single:scale-102 transition-transform duration-300"
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
                    ))}
                </div>

                {/* Row 2 (4 Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {HERO_CARDS.slice(4, 8).map((card) => (
                        <div
                            key={card.id}
                            className="bg-white rounded-none border border-slate-200/80 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow duration-200"
                        >
                            {/* Card Heading */}
                            <div>
                                <h2 className="text-lg sm:text-[21px] font-bold text-slate-900 leading-snug tracking-tight mb-3">
                                    {card.title}
                                </h2>

                                {/* Card Body: 2x2 Grid Type */}
                                {card.type === "grid" && card.gridItems && (
                                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                                        {card.gridItems.map((item, i) => (
                                            <Link
                                                key={i}
                                                href={item.href}
                                                className="group/item flex flex-col items-start block"
                                            >
                                                <div className="relative w-full aspect-square bg-[#f7f7f7] overflow-hidden flex items-center justify-center p-1.5 rounded-xs">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.label}
                                                        fill
                                                        unoptimized
                                                        className="object-contain p-1 group-hover/item:scale-105 transition-transform duration-200"
                                                        sizes="(max-width: 640px) 45vw, 150px"
                                                    />
                                                </div>
                                                <span className="text-[12px] text-slate-800 font-normal leading-tight mt-1.5 group-hover/item:text-[#c7511f] transition-colors truncate w-full">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Card Body: Single Large Hero Feature Type */}
                                {card.type === "single" && card.singleImage && (
                                    <Link href={card.href} className="group/single block">
                                        <div className="relative w-full h-[230px] sm:h-[260px] md:h-[275px] bg-[#f7f7f7] overflow-hidden rounded-xs">
                                            <Image
                                                src={card.singleImage.src}
                                                alt={card.singleImage.alt}
                                                fill
                                                unoptimized
                                                className="object-cover group-hover/single:scale-102 transition-transform duration-300"
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
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AmazonHero;

