'use client';

import {
    Package,
    CheckCircle2,
    Sparkles,
    Layers,
} from "lucide-react";
import { TProduct } from "./ProductsTable";
import { TMeta } from "@/types/global";
import { useAllProductsQuery } from "@/redux/features/product/productApi";
import AZStats, { TAZStat } from "@/components/shared/AZStats";

export interface ProductsStatsProps {
    totalProducts?: number;
    activeProducts?: number;
    bestSellers?: number;
    brandsCount?: number;
    products?: TProduct[];
    isLoading?: boolean;
    meta?: TMeta;
}

const ProductsStats = ({
    totalProducts,
    activeProducts,
    bestSellers,
    brandsCount,
    products: initialProducts,
    isLoading: propIsLoading,
    meta: propMeta,
}: ProductsStatsProps = {}) => {
    // Skip redundant network query if data is already provided by parent (ProductsData)
    const shouldSkip = Boolean(initialProducts !== undefined && propIsLoading !== undefined);
    const { data: productsData, isLoading: queryLoading } = useAllProductsQuery({}, { skip: shouldSkip });

    const isLoading = propIsLoading !== undefined ? propIsLoading : queryLoading;
    const products: TProduct[] = initialProducts || (productsData?.data as TProduct[] | undefined) || [];
    const meta = propMeta || productsData?.meta;

    const computedTotal = totalProducts ?? meta?.total ?? products.length;

    const computedActive =
        activeProducts ??
        products.filter((product) => !product.isDeleted).length;

    const computedBestSellers =
        bestSellers ??
        products.filter((product) => Boolean(product.isBestSeller)).length;

    const computedBrands =
        brandsCount ??
        new Set(products.map((product) => product.brand).filter(Boolean)).size;

    const stats: TAZStat[] = [
        {
            label: "Master Catalog",
            value: isLoading ? "—" : computedTotal,
            description: "Registered product listings",
            descriptionIcon: (
                <span className="text-amber-400">↗︎</span>
            ),
            icon: <Package className="w-6 h-6" />,
            lineColor: "via-amber-400/60",
            glowColor: "from-amber-500/20",
            valueColor: "text-amber-400",
            iconWrapperColor: "bg-amber-400/10",
            iconBorderColor: "border-amber-400/20",
            iconColor: "text-amber-400",
        },
        {
            label: "Active Listings",
            value: isLoading ? "—" : computedActive,
            description: "Live & discoverable in store",
            descriptionIcon: <span>●</span>,
            icon: <CheckCircle2 className="w-6 h-6" />,
            lineColor: "via-emerald-400/60",
            glowColor: "from-emerald-500/20",
            valueColor: "text-emerald-400",
            iconWrapperColor: "bg-emerald-500/10",
            iconBorderColor: "border-emerald-500/20",
            iconColor: "text-emerald-400",
        },
        {
            label: "Best Sellers",
            value: isLoading ? "—" : computedBestSellers,
            description: "Curated top-performing items",
            descriptionIcon: <span>★</span>,
            icon: <Sparkles className="w-6 h-6" />,
            lineColor: "via-purple-400/60",
            glowColor: "from-purple-500/20",
            valueColor: "text-purple-300",
            iconWrapperColor: "bg-purple-500/10",
            iconBorderColor: "border-purple-500/20",
            iconColor: "text-purple-300",
        },
        {
            label: "Brand Portfolio",
            value: isLoading ? "—" : computedBrands,
            description: "Unique catalog manufacturers",
            descriptionIcon: (
                <span className="text-cyan-400">✓</span>
            ),
            icon: <Layers className="w-6 h-6" />,
            lineColor: "via-cyan-400/60",
            glowColor: "from-cyan-500/20",
            valueColor: "text-cyan-400",
            iconWrapperColor: "bg-cyan-500/10",
            iconBorderColor: "border-cyan-500/20",
            iconColor: "text-cyan-400",
        },
    ];

    return <AZStats stats={stats} />;
};

export default ProductsStats;
