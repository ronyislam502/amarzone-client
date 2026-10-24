"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Boxes, Loader2, PackagePlus, Save } from "lucide-react";
import { toast } from "react-toastify";
import AZModal from "@/components/shared/AZModal";
import AZInput from "@/components/shared/form/AZInput";
import { useUpdateQuantityMutation } from "@/redux/features/inventory/inventoryApi";
import { TInventory } from "@/types/inventory";

export interface UpdateQuantityModalProps {
    isOpen: boolean;
    onClose: () => void;
    item?: TInventory | null;
    refetch?: () => void;
}

const UpdateQuantityModal = ({
    isOpen,
    onClose,
    item,
    refetch,
}: UpdateQuantityModalProps) => {
    const [quantity, setQuantity] = useState<string>("");
    const [updateQuantity, { isLoading }] = useUpdateQuantityMutation();

    useEffect(() => {
        if (item) {
            setQuantity(String(item.seller?.quantity ?? "0"));
        }
    }, [item]);

    if (!item) return null;

    const variant = typeof item.variant === "object" ? (item.variant as any) : null;
    const product = typeof variant?.product === "object" ? (variant?.product as any) : null;
    const title = product?.title || variant?.sku || "Inventory Offering";
    const thumbnail =
        variant?.images?.[0] ||
        product?.thumbnail ||
        "https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png";
    const currentQty = item.seller?.quantity ?? 0;

    const handleAddUnits = (units: number) => {
        const base = parseInt(quantity, 10) || currentQty;
        setQuantity(String(Math.max(0, base + units)));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numQty = parseInt(quantity, 10);

        if (isNaN(numQty) || numQty < 0) {
            toast.error("Please enter a valid non-negative quantity.");
            return;
        }

        try {
            const res = await updateQuantity({
                id: item._id,
                data: { quantity: numQty },
            }).unwrap();

            toast.success(res?.message || `Quantity updated to ${numQty} units`);
            if (refetch) refetch();
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update inventory quantity");
        }
    };

    return (
        <AZModal
            isOpen={isOpen}
            onClose={onClose}
            title="Replenish / Adjust Stock"
            description="Update available physical units to prevent out-of-stock listings."
            icon={<Boxes className="w-5 h-5 text-emerald-400" />}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-3">
                {/* Offering Preview Card */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-14 h-14 rounded-lg bg-slate-900/80 border border-white/15 shrink-0 overflow-hidden relative">
                        <Image
                            src={thumbnail}
                            alt={title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-white truncate">{title}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="px-1.5 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary text-[10px] font-mono font-bold">
                                ASIN: {item.asin}
                            </span>
                            <span className="text-[11px] text-slate-400">
                                Current Stock:{" "}
                                <span className={`font-bold ${currentQty > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                    {currentQty} units
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quantity Input using AZInput */}
                <AZInput
                    name="quantity"
                    label="New Stock Quantity (Units)"
                    type="number"
                    icon={<Boxes className="w-4 h-4 text-warning" />}
                    placeholder="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    clearable
                    onClear={() => setQuantity("")}
                />

                {/* Quick Add helper chips */}
                <div>
                    <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                        <PackagePlus className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Quick Restock Additions:</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {[
                            { label: "+5", count: 5 },
                            { label: "+10", count: 10 },
                            { label: "+25", count: 25 },
                            { label: "+50", count: 50 },
                            { label: "+100", count: 100 },
                        ].map((btn) => (
                            <button
                                key={btn.label}
                                type="button"
                                onClick={() => handleAddUnits(btn.count)}
                                className="py-1.5 px-2 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-400/50 hover:bg-emerald-400/10 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="btn btn-sm btn-ghost text-slate-400 hover:text-white rounded-xl cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black border-none rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Updating...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-3.5 h-3.5" />
                                <span>Save Quantity</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </AZModal>
    );
};

export default UpdateQuantityModal;
