"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerCard {
    id: number;
    title: string;
    subtitle?: string;
    badge?: string;
    image: string;
    href: string;
}

const BANNER_CARDS: BannerCard[] = [
    {
        id: 1,
        title: "Free delivery on millions of items",
        subtitle: "Get what you need fast",
        badge: "Join Prime Shipping",
        image: "/banner/banner-card-1.png",
        href: "/products",
    },
    {
        id: 2,
        title: "Give the gift of Owala",
        subtitle: "New & exclusive colors",
        image: "/banner/banner-card-2.png",
        href: "/products?search=Owala",
    },
    {
        id: 3,
        title: "$1 deals, for a limited time",
        subtitle: "Early Haul-iday drop",
        badge: "amarzone haul",
        image: "/banner/banner-card-3.png",
        href: "/products?maxPrice=1",
    },
    {
        id: 4,
        title: "Shop holiday gifts for all",
        image: "/banner/banner-card-4.png",
        href: "/products?category=gifts",
    },
    {
        id: 5,
        title: "Toy gifts for all ages",
        image: "/banner/banner-card-5.png",
        href: "/products?category=toys",
    },
    {
        id: 6,
        title: "Great prices on premium tech",
        image: "/banner/banner-card-6.png",
        href: "/products?category=electronics",
    },
    {
        id: 7,
        title: "Smart speaker for your 'ohana",
        subtitle: "Shop Echo Dot bundle",
        image: "/banner/banner-card-7.png",
        href: "/products?search=smart+speaker",
    },
    {
        id: 8,
        title: "Spend less on gifts for him",
        subtitle: "Celebrate with low prices",
        image: "/banner/banner-card-8.png",
        href: "/products?category=men",
    },
    {
        id: 9,
        title: "Popular finds under $25",
        image: "/banner/banner-card-9.png",
        href: "/products?maxPrice=25",
    },
    {
        id: 10,
        title: "Kindle Unlimited is now Kindle+",
        subtitle: "Read, listen, and discover",
        image: "/banner/banner-card-10.png",
        href: "/products?search=kindle",
    },
    {
        id: 11,
        title: "Playful, portable",
        subtitle: "Shop seriously fun tablets",
        badge: "amarzone alexa tablet 8",
        image: "/banner/banner-card-11.png",
        href: "/products?search=tablet",
    },
    {
        id: 12,
        title: "Shop winter outerwear under $100",
        image: "/banner/banner-card-12.png",
        href: "/products?search=winter+outerwear",
    },
];

const Banner: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [hasDragged, setHasDragged] = useState(false);

    const checkScrollState = useCallback(() => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }, []);

    useEffect(() => {
        checkScrollState();
        const container = scrollRef.current;
        if (!container) return;

        const handleResize = () => checkScrollState();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [checkScrollState]);

    const handleScroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const scrollAmount = Math.min(scrollRef.current.clientWidth * 0.8, 680);
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setHasDragged(false);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.3;
        if (Math.abs(walk) > 5) {
            setHasDragged(true);
        }
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <section className="relative w-full mb-6 select-none group/banner">
            {/* Left Chevron Button */}
            {canScrollLeft && (
                <button
                    type="button"
                    onClick={() => handleScroll("left")}
                    aria-label="Scroll left"
                    className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 h-16 w-8 rounded-md bg-white/95 border border-slate-300 shadow-xl flex items-center justify-center text-slate-800 hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer opacity-90 hover:opacity-100"
                >
                    <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
            )}

            {/* Right Chevron Button */}
            {canScrollRight && (
                <button
                    type="button"
                    onClick={() => handleScroll("right")}
                    aria-label="Scroll right"
                    className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 h-16 w-8 rounded-md bg-white/95 border border-slate-300 shadow-xl flex items-center justify-center text-slate-800 hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer opacity-90 hover:opacity-100"
                >
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
            )}

            {/* Scrollable Track */}
            <div
                ref={scrollRef}
                onScroll={checkScrollState}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="flex items-stretch gap-3.5 overflow-x-auto scroll-smooth no-scrollbar py-2 px-1 cursor-grab active:cursor-grabbing"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                {BANNER_CARDS.map((card, idx) => (
                    <div
                        key={card.id}
                        className="shrink-0 w-[210px] sm:w-[225px] md:w-[235px] lg:w-[245px] transition-transform duration-200 hover:-translate-y-1"
                    >
                        <Link
                            href={card.href}
                            onClick={(e) => {
                                if (hasDragged) e.preventDefault();
                            }}
                            className="block w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                            <div className="relative w-full aspect-[190/301] bg-slate-100">
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    width={380}
                                    height={600}
                                    priority={idx < 5}
                                    className="w-full h-full object-cover pointer-events-none"
                                />
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Banner;
