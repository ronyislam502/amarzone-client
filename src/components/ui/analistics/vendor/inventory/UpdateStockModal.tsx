"use client";

import { useState, useEffect } from "react";
import { Boxes, X, Save, Plus, Minus, AlertCircle } from "lucide-react";
import { TInventory } from "@/src/types/inventory";
import { useUpdateInventoryQuantityMutation } from "@/src/redux/features/inventory/inventoryApi";
import { toast } from "react-toastify";

interface UpdateStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: TInventory | null;
}

const UpdateStockModal = ({
  isOpen,
  onClose,
  inventory,
}: UpdateStockModalProps) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [updateQuantity, { isLoading }] = useUpdateInventoryQuantityMutation();

  useEffect(() => {
    if (inventory) {
      setQuantity(Number(inventory.seller?.quantity || 0));
    }
  }, [inventory]);

  if (!isOpen || !inventory) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity < 0) {
      toast.error("Stock quantity cannot be negative");
      return;
    }

    try {
      await updateQuantity({
        id: inventory._id,
        data: { quantity },
      }).unwrap();
      toast.success(
        quantity > 0
          ? `Stock replenished to ${quantity} units!`
          : "Inventory marked as Out of Stock (0 units)"
      );
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update stock quantity");
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
            <div className="w-9 h-9 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-base-content">
                Update Stock Quantity
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
              <span className="text-base-content/60">Current Stock:</span>
              <span
                className={`font-bold ${
                  (inventory.seller?.quantity || 0) <= 5
                    ? "text-error"
                    : "text-success"
                }`}
              >
                {inventory.seller?.quantity || 0} units
              </span>
            </div>
          </div>

          <div>
            <label className="label py-1">
              <span className="text-xs font-bold text-base-content/80">
                Available Inventory Units
              </span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(0, prev - 1))}
                className="btn btn-sm btn-square btn-outline border-base-300 hover:bg-base-200"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                className="input input-bordered w-full text-center font-black text-lg rounded-xl focus:outline-none focus:border-success"
              />
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="btn btn-sm btn-square btn-outline border-base-300 hover:bg-base-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick add shortcuts */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] text-base-content/50 font-bold mr-1">
                Quick Add:
              </span>
              {[5, 10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setQuantity((prev) => prev + amount)}
                  className="btn btn-xs btn-ghost border border-base-300 hover:bg-base-200 rounded-lg text-[11px] font-bold"
                >
                  +{amount}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-base-content/50 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Stock is marked out-of-stock automatically when quantity hits 0.
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
              className="btn btn-sm btn-success text-white gap-1.5 font-bold shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isLoading ? "Saving..." : "Update Stock"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStockModal;
