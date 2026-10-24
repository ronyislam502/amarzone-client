"use client";

import { useState } from "react";
import { ArrowUpRight, Boxes, DollarSign, Hash, Loader2, Plus, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import AZModal from "@/components/shared/AZModal";
import { useListProductMutation } from "@/redux/features/inventory/inventoryApi";

export interface ListProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    refetch?: () => void;
}

const ListProductModal = ({
    isOpen,
    onClose,
    refetch,
}: ListProductModalProps) => {
    const [asin, setAsin] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [fulfillmentBy, setFulfillmentBy] = useState("Merchant Fulfilled");
    const [shippingTime, setShippingTime] = useState("3");

    const [listProduct, { isLoading }] = useListProductMutation();

    const handleReset = () => {
        setAsin("");
        setPrice("");
        setQuantity("");
        setFulfillmentBy("Merchant Fulfilled");
        setShippingTime("3");
    };

    const handleClose = () => {
        if (isLoading) return;
        handleReset();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const numPrice = parseFloat(price);
        const numQty = parseInt(quantity, 10);
        const numShipping = parseInt(shippingTime, 10) || 3;

        if (!asin.trim()) {
            toast.error("Please enter a valid product ASIN");
            return;
        }

        if (isNaN(numPrice) || numPrice <= 0) {
            toast.error("Please enter a valid price greater than $0.00");
            return;
        }

        if (isNaN(numQty) || numQty < 0) {
            toast.error("Please enter a valid quantity");
            return;
        }

        try {
            const payload = {
                asin: asin.trim().toUpperCase(),
                seller: {
                    price: numPrice,
                    quantity: numQty,
                    fulfillmentBy: fulfillmentBy.trim() || "Merchant Fulfilled",
                    shippingTime: numShipping,
                },
            };

            const res = await listProduct(payload).unwrap();
            toast.success(res?.message || "Product variant listed in inventory successfully!");
            if (refetch) refetch();
            handleClose();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to list product offering.");
        }
    };

    return (
        <AZModal
            isOpen={isOpen}
            onClose={handleClose}
            title="List New Offering by ASIN"
            description="Add an existing marketplace ASIN to your store inventory."
            icon={<Plus className="w-5 h-5 text-amber-400" />}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-3">
                {/* Note banner with link to full product creation */}
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-300">
                        Need to register a brand-new catalog product instead of listing against an existing ASIN?
                    </span>
                    <Link
                        href="/vendor/products/add"
                        onClick={onClose}
                        className="inline-flex items-center gap-1 font-bold text-primary hover:underline shrink-0"
                    >
                        <span>Create Product</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* ASIN Input */}
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Hash className="w-3.5 h-3.5 text-amber-400" />
                            <span>Catalog ASIN Identifier</span>
                        </label>
                        <input
                            type="text"
                            value={asin}
                            onChange={(e) => setAsin(e.target.value)}
                            placeholder="e.g. B08N5WRWNW"
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-400 transition-colors uppercase"
                        />
                    </div>

                    {/* Price Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                            <span>Listing Price ($)</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                                $
                            </span>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="29.99"
                                required
                                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 text-white font-bold text-sm focus:outline-none focus:border-amber-400 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Quantity Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Boxes className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Available Quantity</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="50"
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 text-white font-bold text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                        />
                    </div>

                    {/* Fulfillment Method */}
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Fulfillment By</span>
                        </label>
                        <input
                            type="text"
                            value={fulfillmentBy}
                            onChange={(e) => setFulfillmentBy(e.target.value)}
                            placeholder="e.g. Merchant Fulfilled"
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                    </div>

                    {/* Shipping Time */}
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Shipping Time (Days)</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="30"
                            value={shippingTime}
                            onChange={(e) => setShippingTime(e.target.value)}
                            placeholder="3"
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 text-white text-sm focus:outline-none focus:border-indigo-400 transition-colors"
                        />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="btn btn-sm btn-ghost text-slate-400 hover:text-white rounded-xl cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black border-none rounded-xl shadow-lg shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Listing Offer...</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>List Offering</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </AZModal>
    );
};

export default ListProductModal;
