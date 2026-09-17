"use client";

import { useState } from "react";
import { ShoppingBag, Sparkles, X, Flame } from "lucide-react";
import { useUpdateProductMutation } from "@/redux/features/product/productApi";
import { toast } from "react-toastify";
import { FieldValues } from "react-hook-form";
import AZForm from "../../../shared/form/AZFrom";
import AZInput from "../../../shared/form/AZInput";
import { TProduct } from "@/src/types/product";

interface UpdateProductModalProps {
  product: TProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const UpdateProductModal = ({
  product,
  isOpen,
  onClose,
  onSuccess,
}: UpdateProductModalProps) => {
  const [isBestSeller, setIsBestSeller] = useState<boolean>(
    Boolean(product?.isBestSeller)
  );
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  if (!isOpen || !product) return null;

  const onSubmit = async (data: FieldValues) => {
    try {
      const payload = {
        title: data.title,
        brand: data.brand,
        isBestSeller: Boolean(isBestSeller),
      };

      const res = await updateProduct({
        id: product._id,
        data: payload,
      }).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Product updated successfully!", {
          autoClose: 1000,
        });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update product");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#170d2f] border border-white/10 w-full max-w-lg max-h-[90vh] rounded-3xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative text-slate-100">
        {/* Top glowing accent border ray */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

        {/* Ambient background glow orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white shadow cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 bg-amber-400/10 text-amber-400 border border-amber-400/30 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catalog Governance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span>Update Product Listing</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1.5">
            Modify title, branding, and best-seller status for catalog listing.
          </p>
        </div>

        {/* Form */}
        <div className="overflow-y-auto p-6 flex-1 text-xs relative z-10">
          <AZForm
            key={product._id}
            defaultValues={{
              title: product.title || "",
              brand: product.brand || "",
            }}
            onSubmit={onSubmit}
          >
            <div className="space-y-4">
              <AZInput
                label="Product Title"
                name="title"
                type="text"
                placeholder="Enter product title"
                inputClassName="bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 rounded-xl"
              />
              <AZInput
                label="Brand"
                name="brand"
                type="text"
                placeholder="e.g. Sony, Apple, Nike"
                inputClassName="bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 rounded-xl"
              />
              {/* Best Seller Toggle */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between mt-2">
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-400" />
                    Mark as Best Seller
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Feature this listing prominently across catalog recommendations.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="toggle toggle-warning toggle-sm"
                />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-sm btn-ghost font-bold text-slate-400 hover:text-white rounded-xl cursor-pointer"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="btn btn-sm gap-2 font-black shadow-lg shadow-amber-500/20 cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-0 transition-all rounded-xl"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </AZForm>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductModal;
