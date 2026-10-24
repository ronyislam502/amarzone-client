"use client";

import { useRef } from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Tag } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/shared/carousel";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import DepartmentProducts from "./DepProducts";

const Rollback = () => {
    const { data: departmentsData } = useAllDepartmentsQuery({});

    const plugin = useRef(
        Autoplay({
            delay: 4000,
            stopOnInteraction: false,
        })
    );

    return (
        <div className="w-full select-none bg-slate-200 p-6 rounded-lg my-6">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#cc0000] text-white">
                        <Tag className="h-4 w-4 fill-white" />
                    </span>

                    <div>
                        <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                            <span>Rollbacks & more</span>
                            <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-bold text-[#cc0000]">
                                Up to 50% off
                            </span>
                        </h2>
                        <p className="hidden text-xs text-slate-500 sm:block sm:text-sm">
                            Hundreds of price drops across verified vendors
                        </p>
                    </div>
                </div>

                <Link
                    href="/products"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0071dc] hover:underline sm:text-sm"
                >
                    <span>View all deals</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            {/* Bento Carousel */}
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
                <CarouselContent className="-ml-4">
                    {departmentsData?.data?.map((department: any) => (
                        <CarouselItem
                            key={department?._id || department?.id}
                            className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                        >
                            <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-shadow duration-200 hover:shadow-md">
                                {/* Card Header */}
                                <div>
                                    <Link
                                        href={`/${department.name}`}
                                        className="group/header block"
                                    >
                                        <h3 className="text-sm font-black leading-tight text-slate-900 transition-colors group-hover/header:text-[#0071dc]">
                                            {department.name}
                                        </h3>
                                        <p className="mt-0.5 text-[11px] text-slate-500">
                                            {department.subtitle}
                                        </p>
                                    </Link>
                                </div>

                                {/* Department Onujayi Product Grid Fetching */}
                                <DepartmentProducts
                                    department={department}
                                    departmentSlug={department.name}
                                />

                                {/* Footer */}
                                <div className="border-t border-slate-100 pt-1">
                                    <Link
                                        href={`/${department?.name}`}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0071dc] hover:underline"
                                    >
                                        <span>Shop all</span>
                                        <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
};

export default Rollback;

