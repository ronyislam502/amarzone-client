"use client";

import AZHeader from "@/components/shared/AZHeader";
import { Layers, PlusCircle } from "lucide-react";
import Link from "next/link";

export interface InventoryHeaderProps {
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

const InventoryHeader = ({
    onRefresh,
    isRefreshing = false,
}: InventoryHeaderProps) => {
    return (
        <AZHeader
            badgeLabel="Vendor Inventory Central"
            badgeIcon={<Layers className="w-3.5 h-3.5" />}
            statusLabel="Live Marketplace Stock"
            title="Inventory &"
            highlightTitle="Stock Management"
            description="Monitor your catalog offerings, adjust live pricing, replenish quantities, and optimize your Buy Box position."
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            actions={
                <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                        href="/vendor/products/add"
                        className="btn btn-sm gap-2 font-black shadow-lg shadow-amber-500/20 cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-0 transition-all rounded-xl"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>List New Item</span>
                    </Link>
                </div>
            }
        />
    );
};

export default InventoryHeader;
