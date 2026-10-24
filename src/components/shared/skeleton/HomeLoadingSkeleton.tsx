"use client";

import React from "react";

export const HomeLoadingSkeleton: React.FC = () => {
    return (
        <div className="space-y-10 animate-pulse w-full">
            {/* Hero skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 h-96 bg-slate-200 rounded-3xl" />
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="h-44 bg-slate-200 rounded-3xl" />
                    <div className="h-44 bg-slate-200 rounded-3xl" />
                </div>
            </div>

            {/* Category bubbles skeleton */}
            <div className="flex items-center gap-4 overflow-hidden py-2">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                        <div className="w-16 h-16 rounded-full bg-slate-200" />
                        <div className="w-12 h-3 bg-slate-200 rounded-sm" />
                    </div>
                ))}
            </div>

            {/* Product card grid skeleton */}
            <div className="space-y-4">
                <div className="h-8 w-64 bg-slate-200 rounded-lg" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3"
                        >
                            <div className="w-full aspect-square bg-slate-100 rounded-xl" />
                            <div className="h-4 w-20 bg-slate-200 rounded-sm" />
                            <div className="h-4 w-full bg-slate-200 rounded-sm" />
                            <div className="h-8 w-full bg-slate-200 rounded-full mt-2" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeLoadingSkeleton;
