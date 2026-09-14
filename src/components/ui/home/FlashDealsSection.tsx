"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { TProduct } from "@/src/types/product";
import ProductCard from "./ProductCard";

interface FlashDealsSectionProps {
    products: TProduct[];
}

export const FlashDealsSection: React.FC<FlashDealsSectionProps> = ({ products }) => {
    // Dynamic countdown timer for Flash Deals urgency
    const [timeLeft, setTimeLeft] = useState({
        hours: 8,
        minutes: 42,
        seconds: 19,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: 59, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return { hours: 12, minutes: 0, seconds: 0 };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Pick top 8 products for Flash Deals
    const dealProducts = products.slice(0, 8);

    if (dealProducts.length === 0) return null;

    return (
        <section id="flash-deals" aria-label="Flash Deals and Rollbacks" className="w-full">
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-200/70 rounded-3xl p-5 sm:p-7 shadow-xs">
                {/* Section Header: Title + Urgency Countdown */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#ffc220] flex items-center justify-center text-slate-950 font-black shadow-xs shrink-0">
                            <Zap className="w-5 h-5 fill-slate-950" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                    Flash Deals <span className="text-[#0071dc]">| Up to 45% Off</span>
                                </h2>
                            </div>
                            <p className="text-xs text-slate-500">
                                Fresh rollbacks updated daily. Limited quantity while inventory lasts.
                            </p>
                        </div>
                    </div>

                    {/* Urgent Countdown Timer */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xs">
                            <Clock className="w-3.5 h-3.5 text-[#ffc220]" />
                            <span className="text-slate-300 text-[11px] font-normal">Ends in:</span>
                            <span className="font-mono text-amber-300">
                                {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                                {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
                                {String(timeLeft.seconds).padStart(2, "0")}s
                            </span>
                        </div>
                        <Link
                            href="#featured-catalog"
                            className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-[#0071dc] hover:underline"
                        >
                            <span>View all</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mt-6">
                    {dealProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            isRollback
                            badgeLabel="Rollback"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FlashDealsSection;
