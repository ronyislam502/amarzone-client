"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Zap } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/shared/carousel";
import AZProductCard from "@/components/shared/AZProductCard";
import { useAllVariantProductsQuery } from "@/redux/features/product/productApi";

const Flashdeal = () => {
    const {
        data: productsData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useAllVariantProductsQuery({});

    const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 34, seconds: 22 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 12, minutes: 0, seconds: 0 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const plugin = useRef(
        Autoplay({
            delay: 3000,
            stopOnInteraction: false,
        })
    );

    return (
        <section className="w-full bg-slate-200 p-10 rounded-lg my-6">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                            Flash Deals
                        </h2>

                        <span className="inline-flex items-center gap-1 rounded-sm bg-[#cc0000] px-2 py-0.5 text-[11px] font-black text-white">
                            <Zap className="h-3 w-3 fill-white" />
                            <span>Limited Time</span>
                        </span>

                        {/* ঠিক করা অংশ: এখানে timeLeft চেক করে দেওয়া হয়েছে */}
                        {timeLeft && (
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                                <span className="text-[10px] font-semibold uppercase text-slate-400">
                                    Ends:
                                </span>
                                <span className="font-mono text-amber-300">
                                    {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                                    {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
                                    {String(timeLeft.seconds).padStart(2, "0")}s
                                </span>
                            </div>
                        )}
                    </div>

                    <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                        Grab today's best deals before they're gone.
                    </p>
                </div>

                {/* View All */}
                <Link
                    href="/products"
                    className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#0071dc] hover:underline sm:text-sm"
                >
                    <span>View all</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            {/* Carousel */}
            <Carousel
                plugins={[plugin.current]}
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent className="-ml-3">
                    {productsData?.data?.slice(0, 20).map((product) => (
                        <CarouselItem
                            key={product._id}
                            className="pl-3 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                        >
                            <AZProductCard product={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
};

export default Flashdeal;