"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DollarSign, Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import AZModal from "@/components/shared/AZModal";
import AZInput from "@/components/shared/form/AZInput";
import { useUpdatePriceMutation } from "@/redux/features/inventory/inventoryApi";
import { TInventory } from "@/types/inventory";
import { FieldValues } from "react-hook-form";
import AZForm from "@/components/shared/form/AZFrom";

export interface UpdatePriceModalProps {
    isOpen: boolean;
    onClose: () => void;
    item?: TInventory | null;
    refetch?: () => void;
}

const UpdatePriceModal = ({
    isOpen,
    onClose,
    item,
    refetch,
}: UpdatePriceModalProps) => {
    const [updatePrice, { isLoading }] = useUpdatePriceMutation();

    console.log("item", item)

    const handleSubmit = async (data: FieldValues) => {

    };

    return (
        <AZModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2">
                    <span>Update Price</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                        {item?.asin}
                    </span>
                </div>
            }
            description="Adjust the live listing price for this product offering."
            icon={<DollarSign className="w-5 h-5 text-amber-400" />}
            size="md"
        >
            <AZForm onSubmit={handleSubmit}>
                {/* Product Summary */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-12 h-12 rounded-lg bg-slate-900/80 border border-white/15 shrink-0 overflow-hidden relative">
                        <Image
                            src={""}
                            alt={""}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-white truncate">{item?.asin}</h4>
                        <div className="text-xs text-slate-400 mt-0.5">
                            Current Price: <span className="text-amber-400 font-bold">${""}</span>
                        </div>
                    </div>
                </div>

                {/* Simple Price Input using AZInput */}
                <AZInput
                    name="price"
                    label="New Price ($ USD)"
                    type="number"
                    icon={<DollarSign className="w-4 h-4 text-warning" />}
                    placeholder="0.00"
                />

                {/* Footer Actions */}
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
                        className="btn btn-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black border-none rounded-xl shadow-lg shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-3.5 h-3.5" />
                                <span>Save Price</span>
                            </>
                        )}
                    </button>
                </div>
            </AZForm>
        </AZModal>
    );
};

export default UpdatePriceModal;
