"use client"

import { useState } from 'react';
import { LayoutGrid, List } from "lucide-react";
import AZProductCard from './AZProductCard';
import { TProduct } from '@/types/product';

const AZProductsPage = ({ products }: { products: any }) => {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    return (
        <div>
            <div className="mb-4 flex justify-end gap-2" role="group" aria-label="Product view">
                <button
                    type="button"
                    className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-ghost"}`}
                    aria-label="Grid view"
                    aria-pressed={viewMode === "grid"}
                    onClick={() => setViewMode("grid")}
                >
                    <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    className={`btn btn-sm ${viewMode === "list" ? "btn-primary" : "btn-ghost"}`}
                    aria-label="List view"
                    aria-pressed={viewMode === "list"}
                    onClick={() => setViewMode("list")}
                >
                    <List className="h-4 w-4" />
                </button>
            </div>
            <div
                className={viewMode === "grid"
                    ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                    : "flex flex-col gap-4 [&_.card]:flex-row [&_.card_figure]:w-1/3 [&_.card_figure]:max-w-48 [&_.card_figure]:shrink-0 [&_.card-body]:flex-1"}
            >
                {products?.map((product: TProduct) => (
                    <AZProductCard
                        key={product?._id}
                        product={product}
                    />
                ))}
            </div>
        </div>
    );
};

export default AZProductsPage;