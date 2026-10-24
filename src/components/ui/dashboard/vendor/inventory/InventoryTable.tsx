"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    AlertTriangle,
    Boxes,
    Building2,
    CheckCircle2,
    DollarSign,
    Edit2,
    Eye,
    Layers,
    Package,
    PackagePlus,
    Plus,
    Tag,
    Trophy,
    Truck,
    XCircle,
} from "lucide-react";
import { TInventory } from "@/types/inventory";
import { TMeta } from "@/types/global";
import { TColumn } from "@/types/table";
import AZTable from "@/components/shared/AZTable";
import UpdatePriceModal from "./UpdatePriceModal";
import UpdateQuantityModal from "./UpdateQuantityModal";
import ViewInventoryModal from "./ViewInventoryModal";
import ListProductModal from "./ListProductModal";

export interface InventoryTableProps {
    inventories?: TInventory[];
    meta?: TMeta;
    isLoading?: boolean;
    isError?: boolean;
    error?: unknown;
    refetch?: () => void;
    isFetching?: boolean;
    page?: number;
    limit?: number;
    onPageChange?: (page: number) => void;
    onViewItem?: (item: TInventory) => void;
    onEditPrice?: (item: TInventory) => void;
    onEditQuantity?: (item: TInventory) => void;
}

const InventoryTable = ({
    inventories = [],
    meta,
    isLoading = false,
    isError = false,
    error,
    refetch,
    isFetching = false,
    page = 1,
    limit = 10,
    onPageChange,
    onViewItem,
    onEditPrice,
    onEditQuantity,
}: InventoryTableProps) => {
    const [itemPrice, setitemPrice] = useState<TInventory | null>(null);

    // const handleView = (item: TInventory) => {
    //     if (onViewItem) {
    //         onViewItem(item);
    //     } else {
    //         setViewingItem(item);
    //     }
    // };

    // const handleEditPrice = (item: TInventory) => {
    //     if (onEditPrice) {
    //         onEditPrice(item);
    //     } else {
    //         setPriceItem(item);
    //     }
    // };

    // const handleEditQuantity = (item: TInventory) => {
    //     if (onEditQuantity) {
    //         onEditQuantity(item);
    //     } else {
    //         setQuantityItem(item);
    //     }
    // };

    const columns: TColumn<TInventory>[] = [
        {
            header: "Product Offering",
            accessor: (item) => {
                const variant = typeof item.variant === "object" ? (item.variant as any) : null;
                const product = typeof variant?.product === "object" ? (variant?.product as any) : null;
                const title = product?.title || variant?.sku || "Inventory Offering";
                const thumbnail =
                    variant?.images?.[0] ||
                    product?.thumbnail ||
                    "https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png";
                const attributes = variant?.attributes || [];

                return (
                    <div className="flex items-center gap-3 max-w-sm">
                        <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                            <Image
                                src={thumbnail}
                                alt={title}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="space-y-1 min-w-0">
                            <div className="font-extrabold text-sm text-white truncate max-w-[220px]" title={title}>
                                {title}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-400/30 text-amber-400 text-[10px] font-mono font-black uppercase">
                                    ASIN: {item.asin}
                                </span>
                                {attributes.slice(0, 2).map((attr: { type: string; value: string }, idx: number) => (
                                    <span
                                        key={idx}
                                        className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 text-[9px] font-medium"
                                    >
                                        {attr.type}: {attr.value}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Catalog Identifiers",
            accessor: (item) => {
                const variant = typeof item.variant === "object" ? (item.variant as any) : null;
                const product = typeof variant?.product === "object" ? (variant?.product as any) : null;
                const sku = variant?.sku || "N/A";
                const brand = product?.brand || "Amarzone";

                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-200">
                            <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[130px]">{sku}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate max-w-[120px]">{brand}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Live Price",
            accessor: (item) => {
                const price = item.seller?.price ?? 0;
                return (
                    <div className="flex items-center gap-2">
                        <div>
                            <div className="text-sm font-black text-amber-400">
                                ${price.toFixed(2)}
                            </div>
                            <div className="text-[10px] text-slate-400">USD</div>
                        </div>
                        <button
                            type="button"
                            // onClick={() => handleEditPrice(item)}
                            title="Quick Edit Price"
                            className="p-1 rounded-md bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                        >
                            <Edit2 className="w-3 h-3" />
                        </button>
                    </div>
                );
            },
        },
        {
            header: "Stock Quantity",
            accessor: (item) => {
                const qty = item.seller?.quantity ?? 0;
                const isOutOfStock = qty <= 0;
                const isLowStock = qty > 0 && qty <= 5;

                return (
                    <div className="flex items-center gap-2">
                        <div className="space-y-1">
                            <div className="text-sm font-extrabold text-white">
                                {qty} <span className="text-[10px] text-slate-400 font-normal">units</span>
                            </div>
                            <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border shadow-sm ${isOutOfStock
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                    : isLowStock
                                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    }`}
                            >
                                {isOutOfStock ? (
                                    <>
                                        <XCircle className="w-2.5 h-2.5" />
                                        Out of Stock
                                    </>
                                ) : isLowStock ? (
                                    <>
                                        <AlertTriangle className="w-2.5 h-2.5" />
                                        Low Stock
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-2.5 h-2.5" />
                                        In Stock
                                    </>
                                )}
                            </span>
                        </div>
                        <button
                            type="button"
                            // onClick={() => handleEditQuantity(item)}
                            title="Replenish Units"
                            className="p-1 rounded-md bg-white/5 border border-white/10 hover:border-emerald-400/40 hover:bg-emerald-400/10 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                            <PackagePlus className="w-3 h-3" />
                        </button>
                    </div>
                );
            },
        },
        {
            header: "Buy Box Status",
            accessor: (item) => {
                const isWinner = item.seller?.isBuyBoxWinner === true;

                return (
                    <div>
                        <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm ${isWinner
                                ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30 shadow-cyan-500/10"
                                : "bg-white/5 text-slate-400 border-white/10"
                                }`}
                        >
                            {isWinner ? (
                                <>
                                    <Trophy className="w-3 h-3 text-cyan-400" />
                                    Winner
                                </>
                            ) : (
                                <>
                                    <Layers className="w-3 h-3 text-slate-500" />
                                    Competing
                                </>
                            )}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                            {isWinner ? "Primary offer" : "Secondary offer"}
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Fulfillment & Transit",
            accessor: (item) => {
                const fulfillment = item.seller?.fulfillmentBy || "Merchant (FBM)";
                const shipping = item.seller?.shippingTime || 3;

                return (
                    <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1 truncate max-w-[140px]">
                            <Package className="w-3 h-3 text-indigo-400 shrink-0" />
                            <span className="truncate">{fulfillment}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Truck className="w-3 h-3 text-slate-500 shrink-0" />
                            <span>{shipping} days delivery</span>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Actions",
            accessor: (item) => (
                <div className="flex items-center gap-1.5">
                    {/* View Details */}
                    <button
                        type="button"
                        // onClick={() => handleView(item)}
                        title="View Offering Details"
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200 cursor-pointer"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit Price */}
                    <button
                        type="button"
                        // onClick={() => handleEditPrice(item)}
                        title="Update Live Price"
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200 cursor-pointer"
                    >
                        <DollarSign className="w-3.5 h-3.5" />
                    </button>

                    {/* Restock Quantity */}
                    <button
                        type="button"
                        // onClick={() => handleEditQuantity(item)}
                        title="Replenish Stock"
                        className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-400/50 hover:bg-emerald-500/20 text-emerald-400 transition-all duration-200 cursor-pointer"
                    >
                        <Boxes className="w-3.5 h-3.5" />
                    </button>
                </div>
            ),
        },
    ];

    const totalCount = meta?.total ?? inventories.length;


    return (
        <div>
            <AZTable
                title="Marketplace Offerings"
                subtitle="Live catalog SKUs, merchant pricing, physical stock readiness, and Buy Box positions."
                badgeText={totalCount}
                icon={<Boxes className="w-5 h-5 text-amber-400" />}
                data={inventories}
                columns={columns}
                keyExtractor={(item: TInventory) => item._id || item.asin}
                isLoading={isLoading}
                isError={isError}
                errorMessage={(error as any)?.data?.message || "Failed to load inventory offerings."}
                onRetry={refetch}
                onRefresh={refetch}
                isRefreshing={isFetching}
                searchPlaceholder="Search inventory by title, ASIN, SKU..."
                emptyTitle="No Inventory Offerings Found"
                emptyMessage="No catalog offerings match your active filters or search criteria."
                emptyIcon={<Boxes className="w-6 h-6 text-amber-400" />}
                headerActions={

                    <button
                        type="button"
                        // onClick={() => setIsListOpen(true)}
                        className="btn btn-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black border-none shadow-md shadow-amber-400/20 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>List by ASIN</span>
                    </button>

                }
                pagination={
                    onPageChange && meta && meta.total > 0
                        ? {
                            page,
                            limit,
                            total: meta.total,
                            onPageChange,
                        }
                        : undefined
                }
            />

            {/* Price Edit Modal */}
            <UpdatePriceModal
                isOpen={Boolean(itemPrice)}
                item={itemPrice}
                onClose={() => setitemPrice(null)}
                refetch={refetch}
            />

            {/* Quantity Edit Modal */}
            {/* <UpdateQuantityModal
                isOpen={Boolean(quantityItem)}
                item={quantityItem}
                onClose={() => setQuantityItem(null)}
                refetch={refetch}
            />

            {/* View Full Details Modal */}
            {/* <ViewInventoryModal
                isOpen={Boolean(viewingItem)}
                item={viewingItem}
                onClose={() => setViewingItem(null)}
                onEditPrice={(item) => setPriceItem(item)}
                onEditQuantity={(item) => setQuantityItem(item)}
            /> */}

            {/* List Offering Modal */}
            {/* <ListProductModal
                isOpen={isListOpen}
                onClose={() => setIsListOpen(false)}
                refetch={refetch}
            /> */}
        </div>
    );
};

export default InventoryTable;
