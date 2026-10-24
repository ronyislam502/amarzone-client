'use client';

import AZStats, { TAZStat } from "@/components/shared/AZStats";
import { useAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { TCategory } from "@/types/category";
import { TMeta } from "@/types/global";
import {
    FolderTree,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
} from "lucide-react";

export interface CategoriesStatsProps {
    totalCategories?: number;
    activeCategories?: number;
    archivedCategories?: number;
    coverageRate?: string;
    categories?: TCategory[];
    isLoading?: boolean;
    meta?: TMeta;
}

const CategoriesStats = ({
    totalCategories,
    activeCategories,
    archivedCategories,
    coverageRate,
    categories: initialCategories,
    isLoading: propIsLoading,
    meta: propMeta,
}: CategoriesStatsProps = {}) => {
    // Skip duplicate query if parent (CategoriesData) already provides data
    const shouldSkip = Boolean(initialCategories !== undefined && propIsLoading !== undefined);
    const { data: categoriesData, isLoading: queryLoading } = useAllCategoriesQuery({}, { skip: shouldSkip });

    const isLoading = propIsLoading !== undefined ? propIsLoading : queryLoading;
    const rawData = categoriesData?.data;
    const resolvedData: TCategory[] = Array.isArray(rawData)
        ? rawData
        : (rawData as any)?.data || [];

    const categories = initialCategories || resolvedData || [];
    const meta = propMeta || categoriesData?.meta;

    const computedTotal = totalCategories ?? meta?.total ?? categories.length;

    const computedActive =
        activeCategories ??
        categories.filter((cat) => !cat.isDeleted).length;

    const computedArchived =
        archivedCategories ??
        categories.filter((cat) => cat.isDeleted).length;

    const computedCoverageRate =
        coverageRate ??
        (computedTotal > 0
            ? `${((computedActive / computedTotal) * 100).toFixed(1)}%`
            : "100%");

    const stats: TAZStat[] = [
        {
            label: "Total Categories",
            value: isLoading ? "—" : computedTotal,
            description: "Catalog taxonomies",
            descriptionIcon: (
                <span className="text-primary">↗︎</span>
            ),
            icon: <FolderTree className="w-6 h-6" />,
            lineColor: "via-primary/60",
            glowColor: "from-primary/20",
            valueColor: "text-primary",
            iconWrapperColor: "bg-primary/10",
            iconBorderColor: "border-primary/20",
            iconColor: "text-primary",
        },
        {
            label: "Active Categories",
            value: isLoading ? "—" : computedActive,
            description: "Published in catalog",
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
            label: "Archived Categories",
            value: isLoading ? "—" : computedArchived,
            description: "Hidden or deactivated",
            descriptionIcon: <span>●</span>,
            icon: <AlertTriangle className="w-6 h-6" />,
            lineColor: "via-rose-400/60",
            glowColor: "from-rose-500/20",
            valueColor: "text-rose-400",
            iconWrapperColor: "bg-rose-500/10",
            iconBorderColor: "border-rose-500/20",
            iconColor: "text-rose-400",
        },
        {
            label: "Taxonomy Health",
            value: isLoading ? "—" : computedCoverageRate,
            description: "Catalog active ratio",
            descriptionIcon: <span>★</span>,
            icon: <Sparkles className="w-6 h-6" />,
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

export default CategoriesStats;
