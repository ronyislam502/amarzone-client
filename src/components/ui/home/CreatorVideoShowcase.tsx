"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Sparkles, ShoppingBag, Eye } from "lucide-react";
import { TProduct } from "@/src/types/product";
import { extractProductPriceInfo, getProductThumbnail } from "./homeUtils";

interface CreatorVideoShowcaseProps {
    products: TProduct[];
}

interface VideoCreatorItem {
    creatorHandle: string;
    creatorAvatar: string;
    caption: string;
    viewCount: string;
    bgGradient: string;
}

const CREATORS: VideoCreatorItem[] = [
    {
        creatorHandle: "@techtrends",
        creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        caption: "Is this the best workstation setup under $500?",
        viewCount: "142K views",
        bgGradient: "from-slate-900 via-indigo-950 to-slate-900",
    },
    {
        creatorHandle: "@homewithsarah",
        creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        caption: "Organizing my kitchen pantry with budget gems",
        viewCount: "89K views",
        bgGradient: "from-stone-900 via-amber-950 to-neutral-900",
    },
    {
        creatorHandle: "@urbanstyle",
        creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        caption: "5 everyday sneakers that feel like walking on clouds",
        viewCount: "210K views",
        bgGradient: "from-zinc-900 via-sky-950 to-slate-900",
    },
    {
        creatorHandle: "@fitlifedaily",
        creatorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
        caption: "My morning wellness routine + high-protein shakes",
        viewCount: "64K views",
        bgGradient: "from-emerald-950 via-teal-950 to-slate-900",
    },
];

export const CreatorVideoShowcase: React.FC<CreatorVideoShowcaseProps> = ({ products }) => {
    return (
        <section aria-label="Featured Creator Videos and Social Trends" className="w-full select-none">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700">
                        <Sparkles className="w-4 h-4 fill-indigo-600" />
                    </span>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <span>Featured in videos</span>
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                                Social trending
                            </span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                            Watch real creator reviews and shop the featured products directly
                        </p>
                    </div>
                </div>

                <Link
                    href="/#featured-catalog"
                    className="text-xs sm:text-sm font-bold text-[#0071dc] hover:underline"
                >
                    Explore all videos
                </Link>
            </div>

            {/* Video Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {CREATORS.map((item, idx) => {
                    const linkedProduct = products[idx % products.length];
                    const priceInfo = linkedProduct ? extractProductPriceInfo(linkedProduct) : null;
                    const thumbnail = linkedProduct ? getProductThumbnail(linkedProduct) : "";

                    return (
                        <div
                            key={item.creatorHandle}
                            className={`group relative aspect-[9/14] sm:aspect-[9/15] rounded-3xl overflow-hidden bg-gradient-to-b ${item.bgGradient} p-4 sm:p-5 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-700/30`}
                        >
                            {/* Top Row: Creator Badge & Views */}
                            <div className="flex items-center justify-between z-10">
                                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                                    <div className="relative w-5 h-5 rounded-full overflow-hidden">
                                        <Image
                                            src={item.creatorAvatar}
                                            alt={item.creatorHandle}
                                            fill
                                            sizes="20px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-white tracking-tight">
                                        {item.creatorHandle}
                                    </span>
                                </div>

                                <span className="text-[11px] font-medium text-white/80 flex items-center gap-1 bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded-full">
                                    <Eye className="w-3 h-3" />
                                    {item.viewCount}
                                </span>
                            </div>

                            {/* Center Play Button Overlay */}
                            <div className="my-auto flex items-center justify-center z-10">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 group-hover:scale-110 group-hover:bg-white group-hover:text-slate-900 transition-all duration-300 shadow-md">
                                    <Play className="w-5 h-5 fill-current ml-0.5" />
                                </div>
                            </div>

                            {/* Bottom: Caption + Linked Product Card Pill */}
                            <div className="z-10 space-y-2.5">
                                <p className="text-xs sm:text-sm font-semibold text-white leading-snug drop-shadow-xs line-clamp-2">
                                    {item.caption}
                                </p>

                                {linkedProduct && (
                                    <Link
                                        href={`/products/${linkedProduct._id}`}
                                        className="flex items-center gap-2 bg-white/95 hover:bg-white text-slate-900 p-2 rounded-2xl shadow-md transition-all hover:scale-[1.02]"
                                    >
                                        <div className="relative w-10 h-10 rounded-xl bg-slate-50 flex-shrink-0 overflow-hidden p-0.5">
                                            <Image
                                                src={thumbnail}
                                                alt={linkedProduct.title}
                                                fill
                                                sizes="40px"
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[11px] font-bold truncate text-slate-900">
                                                {linkedProduct.title}
                                            </p>
                                            <p className="text-xs font-black text-emerald-800">
                                                ${priceInfo?.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                                            <ShoppingBag className="w-3 h-3" />
                                        </div>
                                    </Link>
                                )}
                            </div>

                            {/* Background ambient lighting */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default CreatorVideoShowcase;
