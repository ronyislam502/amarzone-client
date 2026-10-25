"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Boxes, Loader2, PackagePlus, Save } from "lucide-react";
import { toast } from "react-toastify";
import AZModal from "@/components/shared/AZModal";
import AZInput from "@/components/shared/form/AZInput";
import { useUpdateQuantityMutation } from "@/redux/features/inventory/inventoryApi";
import { TInventory } from "@/types/inventory";
import { FieldValues } from "react-hook-form";
import AZForm from "@/components/shared/form/AZFrom";

export interface UpdateQuantityModalProps {
    isOpen: boolean;
    onClose: () => void;
    item?: TInventory | null;
    refetch?: () => void;
    onSuccess?: () => void;
}

const UpdateQuantityModal = ({
    isOpen,
    onClose,
    item,
    refetch,
    onSuccess,
}: UpdateQuantityModalProps) => {
    const [quantity, setQuantity] = useState<number | string>("");
    const [updateQuantity, { isLoading }] = useUpdateQuantityMutation();

    useEffect(() => {
        if (item?.seller?.quantity !== undefined) {
            setQuantity(item.seller.quantity);
        }
    }, [item]);

    const handleClose = () => {
        if (isLoading) return;
        onClose();
    };

    const variant = typeof item?.variant === "object" ? (item?.variant as any) : null;
    const product = typeof variant?.product === "object" ? (variant?.product as any) : null;
    const title = product?.title || variant?.sku || (item?.asin ? `ASIN: ${item.asin}` : "Inventory Offering");
    const thumbnail =
        variant?.images?.[0] ||
        product?.thumbnail ||
        "https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png";
    const currentQty = item?.seller?.quantity ?? 0;

    const handleSubmit = async (data: FieldValues) => {
        if (!item?._id) {
            toast.error("Inventory item ID not found");
            return;
        }

        const numQty = quantity !== "" && quantity !== undefined ? Number(quantity) : Number(data.quantity);
        if (isNaN(numQty) || numQty < 0) {
            toast.error("Please enter a valid non-negative quantity.");
            return;
        }

        try {
            const res = await updateQuantity({
                id: item._id,
                data: { quantity: numQty },
            }).unwrap();

            if (res?.success) {
                toast.success(res?.message || `Quantity updated to ${numQty} units`);
                handleClose();
                refetch?.();
                onSuccess?.();
            }
        } catch (err: any) {
            toast.error(
                err?.data?.message || err?.message || "Failed to update inventory quantity"
            );
        }
    };

    return (
        <AZModal
            isOpen={isOpen && Boolean(item)}
            onClose={handleClose}
            title={
                <div className="flex items-center gap-2">
                    <span>Replenish / Adjust Stock</span>
                    {item?.asin && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                            {item.asin}
                        </span>
                    )}
                </div>
            }
            description="Update available physical units to prevent out-of-stock listings."
            icon={<Boxes className="w-5 h-5 text-emerald-400" />}
            size="md"
        >
            {isOpen && item && (
                <AZForm
                    key={item._id || item.asin}
                    defaultValues={{
                        quantity: item?.seller?.quantity !== undefined ? item.seller.quantity : 0,
                    }}
                    onSubmit={handleSubmit}
                >
                    {/* Product Summary */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-900/80 border border-white/15 shrink-0 overflow-hidden relative">
                            <Image
                                src={thumbnail}
                                alt={title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-sm text-white truncate">{title}</h4>
                            <div className="text-xs text-slate-400 mt-0.5">
                                Current Stock:{" "}
                                <span className={`font-bold ${currentQty > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                    {currentQty} units
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quantity Input using AZInput */}
                    <div className="mb-3">
                        <AZInput
                            name="quantity"
                            label="New Stock Quantity (Units)"
                            type="number"
                            icon={<Boxes className="w-4 h-4 text-warning" />}
                            placeholder="0"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>

                    {/* Quick Restock Additions */}
                    <div className="mb-4">
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
                                    onClick={() => setQuantity((prev) => Math.max(0, (Number(prev) || 0) + btn.count))}
                                    className="py-1.5 px-2 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-400/50 hover:bg-emerald-400/10 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
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
                            className="btn btn-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black border-none rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-3.5 h-3.5" />
                                    <span>Save Quantity</span>
                                </>
                            )}
                        </button>
                    </div>
                </AZForm>
            )}
        </AZModal>
    );
};

export default UpdateQuantityModal;
