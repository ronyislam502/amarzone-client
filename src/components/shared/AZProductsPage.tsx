"use client";

import React from "react";
import AZProductCard from "./AZProductCard";
import AZProductFilter from "./AZProductFilter";
import AZPagination from "./AZPagination";
import ProductGridSkeleton from "./skeleton/ProductGridSkeleton";
import { TProduct } from "@/types/product";

interface FilterState {
    search: string;
    department: string;
    category: string;
    brand: string;
    minPrice: string;
    maxPrice: string;
    rating: number | null;
    sort: string;
}

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
    filters?: FilterState;
    setPage?: (newPage: number) => void;
    setLimit?: (newLimit: number) => void;
    onFiltersChange?: (filters: FilterState) => void;
}

const AZProductsPage: React.FC<AZProductsPageProps> = ({
    products,
    isLoading = false,
    isFetching = false,
    isError = false,
    refetch,
    limit,
    page,
    meta,
    filters = {
        search: "",
        department: "",
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        rating: null,
        sort: "",
    },
    setPage,
    setLimit,
    onFiltersChange,
}) => {
    const handlePageChange = (newPage: number) => {
        if (setPage) setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleLimitChange = (newLimit: number) => {
        if (setLimit) setLimit(newLimit);
        if (setPage) setPage(1);
    };

    const handleFiltersChange = (newFilters: FilterState) => {
        if (onFiltersChange) onFiltersChange(newFilters);
        // Reset to page 1 when filters change
        if (setPage) setPage(1);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 py-6 items-start">
            {/* Left Sidebar: Filters */}
            <aside className="w-full lg:w-64 xl:w-72 shrink-0 lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
                <AZProductFilter filters={filters} onChange={handleFiltersChange} />
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
                        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                            <p className="text-xs text-slate-500">
                                Showing{" "}
                                <span className="font-bold text-slate-800">{products?.length}</span>{" "}
                                of{" "}
                                <span className="font-bold text-slate-800">{meta?.total ?? 0}</span>{" "}
                                products
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

                {/* Pagination */}
                {(meta?.total ?? 0) > 0 && (
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                        <AZPagination
                            page={page ?? 1}
                            limit={limit ?? 15}
                            total={meta?.total ?? 0}
                            theme="light"
                            limitOptions={[10, 15, 20, 30, 50]}
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
