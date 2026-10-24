"use client";

import AZStats, { TAZStat } from "@/components/shared/AZStats";
import { useMyInventoryQuery } from "@/redux/features/inventory/inventoryApi";
import { TInventory } from "@/types/inventory";
import { TMeta } from "@/types/global";
import { Boxes, CheckCircle2, AlertTriangle, Trophy, TrendingUp } from "lucide-react";

export interface InventoryStatsProps {
    totalItems?: number;
    inStockCount?: number;
    lowStockCount?: number;
    buyBoxWinnersCount?: number;
    inventories?: TInventory[];
    isLoading?: boolean;
    meta?: TMeta;
}

const InventoryStats = ({
    totalItems,
    inStockCount,
    lowStockCount,
    buyBoxWinnersCount,
    inventories: initialInventories,
    isLoading: propIsLoading,
    meta: propMeta,
}: InventoryStatsProps = {}) => {
    // Skip duplicate query if parent (InventoryData) already provides data
    const shouldSkip = Boolean(initialInventories !== undefined && propIsLoading !== undefined);
    const { data: inventoryData, isLoading: queryLoading } = useMyInventoryQuery({}, { skip: shouldSkip });

    const isLoading = propIsLoading !== undefined ? propIsLoading : queryLoading;
    const rawData = inventoryData?.data;
    const resolvedData: TInventory[] = Array.isArray(rawData)
        ? rawData
        : (rawData as any)?.data || [];

    const inventories = initialInventories || resolvedData || [];
    const meta = propMeta || inventoryData?.meta;

    const computedTotal = totalItems ?? meta?.total ?? inventories.length;

    const computedInStock =
        inStockCount ??
        inventories.filter((item) => (item?.seller?.quantity ?? 0) > 0 && item?.seller?.isStock !== false).length;

    const computedLowStock =
        lowStockCount ??
        inventories.filter((item) => (item?.seller?.quantity ?? 0) <= 5).length;

    const computedBuyBoxWinners =
        buyBoxWinnersCount ??
        inventories.filter((item) => item?.seller?.isBuyBoxWinner === true).length;

    const stockHealthPercent =
        computedTotal > 0 ? Math.round((computedInStock / computedTotal) * 100) : 100;

    const buyBoxRate =
        computedTotal > 0 ? Math.round((computedBuyBoxWinners / computedTotal) * 100) : 0;

    const stats: TAZStat[] = [
        {
            label: "Total Listed SKUs",
            value: isLoading ? "—" : computedTotal,
            description: "Active vendor catalog",
            descriptionIcon: <TrendingUp className="w-3.5 h-3.5 text-amber-400" />,
            icon: <Boxes className="w-6 h-6" />,
            lineColor: "via-amber-400/60",
            glowColor: "from-amber-500/20",
            valueColor: "text-amber-400",
            iconWrapperColor: "bg-amber-400/10",
            iconBorderColor: "border-amber-400/20",
            iconColor: "text-amber-400",
        },
        {
            label: "In-Stock Items",
            value: isLoading ? "—" : computedInStock,
            description: `${stockHealthPercent}% fulfillment readiness`,
            descriptionIcon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
            icon: <CheckCircle2 className="w-6 h-6" />,
            lineColor: "via-emerald-400/60",
            glowColor: "from-emerald-500/20",
            valueColor: "text-emerald-400",
            iconWrapperColor: "bg-emerald-500/10",
            iconBorderColor: "border-emerald-500/20",
            iconColor: "text-emerald-400",
        },
        {
            label: "Low / Out of Stock",
            value: isLoading ? "—" : computedLowStock,
            description: computedLowStock > 0 ? `${computedLowStock} require restock` : "All offerings healthy",
            descriptionIcon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
            icon: <AlertTriangle className="w-6 h-6" />,
            lineColor: "via-rose-400/60",
            glowColor: "from-rose-500/20",
            valueColor: computedLowStock > 0 ? "text-rose-400" : "text-slate-300",
            iconWrapperColor: "bg-rose-500/10",
            iconBorderColor: "border-rose-500/20",
            iconColor: "text-rose-400",
        },
        {
            label: "Buy Box Winners",
            value: isLoading ? "—" : computedBuyBoxWinners,
            description: `${buyBoxRate}% current win rate`,
            descriptionIcon: <Trophy className="w-3.5 h-3.5 text-cyan-400" />,
            icon: <Trophy className="w-6 h-6" />,
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

export default InventoryStats;
