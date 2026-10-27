"use client";

import React from "react";
import Link from "next/link";
import {
    Boxes,
    ArrowUpRight,
    AlertTriangle,
    Award,
    CheckCircle2,
    PackagePlus,
    XCircle,
} from "lucide-react";
import { TInventory } from "@/types/inventory";

export interface VendorStockAlertsProps {
    inventories?: TInventory[];
    lowStockProducts?: any[];
    outOfStockProducts?: any[];
    buyBoxWinners?: any[];
    isLoading?: boolean;
}

export const VendorStockAlerts: React.FC<VendorStockAlertsProps> = ({
    inventories = [],
    lowStockProducts = [],
    outOfStockProducts = [],
    buyBoxWinners = [],
    isLoading = false,
}) => {
    // Determine low stock items from passed lists or computed from inventories database records
    const computedLowStock = React.useMemo(() => {
        if (lowStockProducts && lowStockProducts.length > 0) {
            return lowStockProducts;
        }
        return inventories.filter((item) => {
            const qty = item?.seller?.quantity ?? 0;
            return qty > 0 && qty <= 5;
        });
    }, [lowStockProducts, inventories]);

    const computedOutOfStock = React.useMemo(() => {
        if (outOfStockProducts && outOfStockProducts.length > 0) {
            return outOfStockProducts;
        }
        return inventories.filter((item) => {
            const qty = item?.seller?.quantity ?? 0;
            return qty <= 0;
        });
    }, [outOfStockProducts, inventories]);

    const buyBoxCount = React.useMemo(() => {
        if (buyBoxWinners && buyBoxWinners.length > 0) {
            return buyBoxWinners.length;
        }
        return inventories.filter((item) => item?.seller?.isBuyBoxWinner).length;
    }, [buyBoxWinners, inventories]);

    const hasStockIssues = computedLowStock.length > 0 || computedOutOfStock.length > 0;

    return (
        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
            {/* Glowing top line */}
            <div
                className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent ${
                    hasStockIssues ? "via-amber-400/60" : "via-cyan-400/60"
                } to-transparent pointer-events-none z-20`}
            />
            <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                            <Boxes className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-base font-extrabold text-white">
                                Inventory & Buy Box Watchlist
                            </h3>
                            <p className="text-xs text-slate-400">
                                Stock replenishment notices and Buy Box winning competitive status.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/vendor/inventory"
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group transition-colors"
                    >
                        <span>Inventory Hub</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Buy Box Win Badge Summary */}
                <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 gap-2">
                    <div className="flex items-center gap-2 text-xs">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span className="text-slate-300 font-bold">Featured Offer / Buy Box:</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="badge badge-sm bg-amber-400/15 border-amber-400/30 text-amber-300 font-mono font-black text-xs">
                            {isLoading ? "—" : `${buyBoxCount} Active Wins`}
                        </span>
                        <span className="text-[10px] text-slate-400">across catalog</span>
                    </div>
                </div>

                {/* Low Stock & Out of Stock Items */}
                {isLoading ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                        <div className="w-7 h-7 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-2" />
                        <span className="text-xs text-slate-400">Scanning inventory database...</span>
                    </div>
                ) : !hasStockIssues ? (
                    <div className="py-7 px-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center flex flex-col items-center justify-center space-y-2">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-extrabold text-white">All Stock Levels Optimal</h4>
                        <p className="text-xs text-slate-400 max-w-xs">
                            No critical replenishment warnings detected in your database. All active listings
                            maintain sufficient fulfillment reserves.
                        </p>
                        <Link
                            href="/vendor/inventory"
                            className="btn btn-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg mt-1 font-bold"
                        >
                            Review Catalog
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {/* Out of Stock Items if any */}
                        {computedOutOfStock.slice(0, 3).map((item, idx) => {
                            const title =
                                item?.product?.title ||
                                item?.seller?.sku ||
                                item?.title ||
                                `Listing #${idx + 1}`;
                            return (
                                <div
                                    key={item._id || idx}
                                    className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between gap-3 text-xs"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                                                {title}
                                            </p>
                                            <p className="text-[10px] text-rose-400 font-semibold">
                                                Out of Stock (0 units remaining)
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/vendor/inventory"
                                        className="btn btn-xs btn-outline border-rose-400/40 text-rose-300 hover:bg-rose-500 hover:text-white rounded-lg font-bold shrink-0"
                                    >
                                        Restock
                                    </Link>
                                </div>
                            );
                        })}

                        {/* Low Stock Items */}
                        {computedLowStock.slice(0, 3).map((item, idx) => {
                            const title =
                                item?.product?.title ||
                                item?.seller?.sku ||
                                item?.title ||
                                `Listing #${idx + 1}`;
                            const qty = item?.seller?.quantity ?? item?.quantity ?? 1;
                            return (
                                <div
                                    key={item._id || idx}
                                    className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between gap-3 text-xs"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                                                {title}
                                            </p>
                                            <p className="text-[10px] text-amber-400 font-semibold">
                                                Only {qty} unit{qty === 1 ? "" : "s"} left in stock
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/vendor/inventory"
                                        className="btn btn-xs btn-outline border-amber-400/40 text-amber-300 hover:bg-amber-400 hover:text-slate-950 rounded-lg font-bold shrink-0"
                                    >
                                        Restock
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorStockAlerts;
