"use client";

import React from "react";
import AZProductCard from "./AZProductCard";
import AZProductFilter from "./AZProductFilter";
import AZPagination from "./AZPagination";
import ProductGridSkeleton from "./skeleton/ProductGridSkeleton";
import { TProduct } from "@/types/product";

interface AZProductsPageProps {
    products: any;
    isLoading?: boolean;
    isFetching?: boolean;
    isError?: boolean;
    refetch?: () => void;
    limit?: number;
    page?: number;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPage?: number;
        [key: string]: any;
    };
    setPage?: (newPage: number) => void;
}



const AZProductsPage: React.FC<AZProductsPageProps> = ({
    products,
    isLoading = false,
    isFetching = false,
    isError = false,
    refetch,
    limit = 15,
    page = 1,
    meta,
    setPage,
}) => {
    // Ensure every page shows exactly up to 15 products


    const handlePageChange = (newPage: number) => {
        if (setPage) {
            setPage(newPage);
        }
    };

    const handleLimitChange = (newLimit: number) => {
    };


    return (
        <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 py-6 items-start">
            {/* Left Sidebar: Filters - Fixed in its area */}
            <aside className="w-full lg:w-64 xl:w-72 shrink-0 lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
                <AZProductFilter />
            </aside>

            {/* Right Column: Main Content & Pagination */}
            <div className="flex-1 min-w-0 space-y-6 w-full">
                {isLoading || isFetching ? (
                    <ProductGridSkeleton limit={limit} />
                ) : isError ? (
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
                        <h3 className="text-base font-bold text-slate-900">
                            Failed to load products
                        </h3>
                        <p className="text-xs text-slate-500">
                            An error occurred while fetching the products list.
                        </p>
                        {refetch && (
                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="btn btn-warning btn-sm font-bold cursor-pointer"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                ) : products?.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
                        <h3 className="text-base font-bold text-slate-900">
                            No products found
                        </h3>
                        <p className="text-xs text-slate-500">
                            Try adjusting your search or filters to find what you are looking for.
                        </p>
                    </div>
                ) : (
                    <div>
                        {/* Top Products Count */}
                        <div className="mb-4">
                            <p className="text-xs text-slate-500">
                                Showing <span className="font-bold text-slate-800">{products?.length}</span> products
                            </p>
                        </div>

                        {/* Product Cards 5-Column Grid */}
                        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
                            {products?.map((product: TProduct) => (
                                <AZProductCard key={product?._id} product={product} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Pagination Section handled directly inside AZProductsPage */}
                {(meta?.total ?? 0) > 0 && (
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                        <AZPagination
                            page={page}
                            limit={limit}
                            total={meta?.total ?? 0}
                            theme="light"
                            limitOptions={[15, 30, 45]}
                            onPageChange={handlePageChange}
                            onLimitChange={handleLimitChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AZProductsPage;
