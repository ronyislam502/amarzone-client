"use client";

import { useState, useEffect } from "react";
import { DollarSign, Tag, X, Save, AlertCircle } from "lucide-react";
import { TInventory } from "@/src/types/inventory";
import { useUpdateInventoryPriceMutation } from "@/src/redux/features/inventory/inventoryApi";
import { toast } from "react-toastify";

interface UpdatePriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: TInventory | null;
}

const UpdatePriceModal = ({
  isOpen,
  onClose,
  inventory,
}: UpdatePriceModalProps) => {
  const [newPrice, setNewPrice] = useState<string>("");
  const [updatePrice, { isLoading }] = useUpdateInventoryPriceMutation();

  useEffect(() => {
    if (inventory) {
      setNewPrice(String(inventory.seller?.price || ""));
    }
  }, [inventory]);

  if (!isOpen || !inventory) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price greater than 0");
      return;
    }

    try {
      await updatePrice({
        id: inventory._id,
        data: { price: priceNum },
      }).unwrap();
      toast.success("Listing price updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update price");
    }
  };

  const productTitle =
    inventory.variant?.product?.title || `ASIN: ${inventory.asin}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-base-100 rounded-2xl border border-base-300 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-base-200 bg-base-200/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-base-content">
                Update Listing Price
              </h3>
              <p className="text-xs text-base-content/60 font-mono">
                {inventory.asin}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-base-200/50 rounded-xl border border-base-200">
            <div className="text-xs font-semibold text-base-content/70 line-clamp-2">
              {productTitle}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-base-content/60">Current Price:</span>
              <span className="font-bold text-base-content">
                ${Number(inventory.seller?.price || 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <label className="label py-1">
              <span className="text-xs font-bold text-base-content/80">
                New Price (USD $)
              </span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent pointer-events-none" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="0.00"
                className="input input-bordered w-full pl-10 rounded-xl font-bold text-base focus:outline-none focus:border-accent"
              />
            </div>
            <p className="text-[11px] text-base-content/50 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Adjusting competitive price can help win or protect the Buy Box.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-base-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-sm btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-sm btn-accent gap-1.5 font-bold shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isLoading ? "Saving..." : "Update Price"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePriceModal;
