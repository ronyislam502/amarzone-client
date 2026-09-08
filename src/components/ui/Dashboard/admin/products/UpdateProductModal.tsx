"use client";

import { ShoppingBag, Sparkles, X } from "lucide-react";
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
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  if (!isOpen || !product) return null;

  const onSubmit = async (data: FieldValues) => {
    try {
      const payload = {
        title: data.title,
        brand: data.brand,
        minPrice: Number(data.minPrice),
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
    <div className="modal modal-open z-50">
      <div className="modal-box max-w-lg p-6 bg-base-100 border border-base-200 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="badge badge-warning gap-1.5 px-3 py-2 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catalog Governance</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-base-content flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            Update Product Listing
          </h2>
          <p className="text-base-content/70 text-xs mt-1">
            Modify title, branding, and catalog pricing for SKU tracking
          </p>
        </div>

        {/* Form */}
        <AZForm
          key={product._id}
          defaultValues={{
            title: product.title || "",
            brand: product.brand || "",
            minPrice: product.minPrice || 0,
          }}
          onSubmit={onSubmit}
        >
          <div className="space-y-4">
            <AZInput
              label="Product Title"
              name="title"
              type="text"
              placeholder="Enter product title"
            />
            <AZInput
              label="Brand"
              name="brand"
              type="text"
              placeholder="e.g. Sony, Apple, Nike"
            />
            <AZInput
              label="Starting / Min Price ($)"
              name="minPrice"
              type="number"
              placeholder="0.00"
            />
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 border-t border-base-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-ghost font-bold"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="btn btn-sm btn-primary font-bold shadow-md px-5"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </AZForm>
      </div>
    </div>
  );
};

export default UpdateProductModal;
