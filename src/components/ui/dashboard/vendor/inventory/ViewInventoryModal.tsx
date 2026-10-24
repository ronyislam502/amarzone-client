"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Boxes,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    Copy,
    DollarSign,
    Layers,
    Package,
    ShieldCheck,
    Tag,
    Trophy,
    Truck,
} from "lucide-react";
import { toast } from "react-toastify";
import AZModal from "@/components/shared/AZModal";
import { TInventory } from "@/types/inventory";

export interface ViewInventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    item?: TInventory | null;
    onEditPrice?: (item: TInventory) => void;
    onEditQuantity?: (item: TInventory) => void;
}

const ViewInventoryModal = ({
    isOpen,
    onClose,
    item,
    onEditPrice,
    onEditQuantity,
}: ViewInventoryModalProps) => {
    const [copiedAsin, setCopiedAsin] = useState(false);

    if (!item) return null;

    const variant = typeof item.variant === "object" ? (item.variant as any) : null;
    const product = typeof variant?.product === "object" ? (variant?.product as any) : null;
    const title = product?.title || variant?.sku || "Inventory Offering";
    const brand = product?.brand || "Amarzone Marketplace";
    const thumbnail =
        variant?.images?.[0] ||
        product?.thumbnail ||
        "https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png";
    const currentPrice = item.seller?.price ?? 0;
    const currentQty = item.seller?.quantity ?? 0;
    const isWinner = item.seller?.isBuyBoxWinner === true;
    const isStock = currentQty > 0;
    const attributes = variant?.attributes || [];

    const handleCopyAsin = () => {
        navigator.clipboard.writeText(item.asin);
        setCopiedAsin(true);
        toast.info(`ASIN ${item.asin} copied to clipboard`);
        setTimeout(() => setCopiedAsin(false), 2000);
    };

    return (
        <AZModal
            isOpen={isOpen}
            onClose={onClose}
            title="Offering & Stock Details"
            description="Comprehensive listing specifications, stock metrics, and Buy Box standing."
            icon={<Package className="w-5 h-5 text-amber-400" />}
            size="lg"
        >
            <div className="space-y-4 pt-3">
                {/* Product Summary Header */}
                <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-900/80 border border-white/15 shrink-0 overflow-hidden relative shadow-md">
                        <Image
                            src={thumbnail}
                            alt={title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-400">
                                {brand}
                            </span>
                            {isWinner && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-400/15 border border-cyan-400/30 text-cyan-300">
                                    <Trophy className="w-3 h-3" />
                                    Buy Box Winner
                                </span>
                            )}
                        </div>
                        <h3 className="font-extrabold text-base text-white leading-snug">
                            {title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            {/* ASIN with copy */}
                            <button
                                type="button"
                                onClick={handleCopyAsin}
                                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/10 border border-primary/25 hover:border-primary/50 text-primary text-xs font-mono font-bold transition-all cursor-pointer"
                                title="Click to copy ASIN"
                            >
                                <span>ASIN: {item.asin}</span>
                                {copiedAsin ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                    <Copy className="w-3 h-3 opacity-70" />
                                )}
                            </button>

                            {variant?.sku && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-mono font-semibold">
                                    <Tag className="w-3 h-3 text-slate-400" />
                                    SKU: {variant.sku}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Price Card */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                        <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-amber-400" />
                            <span>Listing Price</span>
                        </div>
                        <div className="text-xl font-black text-amber-400 mt-1">
                            ${currentPrice.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Live Offer</div>
                    </div>

                    {/* Stock Card */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                        <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                            <Boxes className="w-3 h-3 text-emerald-400" />
                            <span>Stock Units</span>
                        </div>
                        <div className={`text-xl font-black mt-1 ${isStock ? "text-emerald-400" : "text-rose-400"}`}>
                            {currentQty}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                            {isStock ? "Available to ship" : "Stock depleted"}
                        </div>
                    </div>

                    {/* Buy Box Status Card */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                        <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-cyan-400" />
                            <span>Buy Box</span>
                        </div>
                        <div className={`text-sm font-black mt-1.5 flex items-center gap-1 ${isWinner ? "text-cyan-400" : "text-slate-300"}`}>
                            {isWinner ? "Winning 🏆" : "Competing"}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                            {variant?.isBuyBoxEligible ? "Eligible" : "Standard offer"}
                        </div>
                    </div>

                    {/* Shipping Card */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                        <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                            <Truck className="w-3 h-3 text-indigo-400" />
                            <span>Transit</span>
                        </div>
                        <div className="text-sm font-black text-white mt-1.5">
                            {item.seller?.shippingTime || 2} Days
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Estimated delivery</div>
                    </div>
                </div>

                {/* Variant Attributes & Specifications */}
                {attributes.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                        <div className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-primary" />
                            <span>Variant Specifications</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {attributes.map((attr: { type: string; value: string }, idx: number) => (
                                <div
                                    key={idx}
                                    className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/10 text-xs font-medium text-slate-200"
                                >
                                    <span className="text-slate-400 capitalize">{attr.type}:</span>{" "}
                                    <span className="font-bold text-white">{attr.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Additional Catalog Details */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
                    <div className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Fulfillment & Channel Details</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-slate-400">Fulfilled By:</span>
                            <span className="font-bold text-white">
                                {item.seller?.fulfillmentBy || "Merchant Fulfillment (FBM)"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="text-slate-400">Listing State:</span>
                            <span className="font-bold text-emerald-400">Active in Catalog</span>
                        </div>
                        {item.createdAt && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="text-slate-400">Listed On:</span>
                                <span className="font-medium text-white">
                                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        )}
                        {item.updatedAt && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="text-slate-400">Last Modified:</span>
                                <span className="font-medium text-white">
                                    {new Date(item.updatedAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Quick Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-white/10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-sm btn-ghost text-slate-400 hover:text-white rounded-xl cursor-pointer"
                    >
                        Close
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onEditPrice?.(item);
                            }}
                            className="btn btn-sm bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Adjust Price</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onEditQuantity?.(item);
                            }}
                            className="btn btn-sm bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                            <Boxes className="w-3.5 h-3.5" />
                            <span>Replenish Units</span>
                        </button>
                    </div>
                </div>
            </div>
        </AZModal>
    );
};

export default ViewInventoryModal;
