"use client";

import { useState, ChangeEvent } from "react";
import {
  Boxes,
  Plus,
  Trash2,
  X,
  Upload,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { useCreateVariantMutation } from "@/redux/features/product/productApi";
import { TProduct } from "@/src/types/product";
import { toast } from "react-toastify";
import { FieldValues } from "react-hook-form";
import AZForm from "../../../shared/form/AZFrom";

interface CreateVariantModalProps {
  product: TProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface TVariantAttr {
  type: string;
  value: string;
}

const CreateVariantModal = ({
  product,
  isOpen,
  onClose,
  onSuccess,
}: CreateVariantModalProps) => {
  const [createVariant, { isLoading: isCreating }] = useCreateVariantMutation();

  const [attributes, setAttributes] = useState<TVariantAttr[]>([
    { type: "Color", value: "" },
  ]);
  const [isPrivateLevel, setIsPrivateLevel] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  if (!isOpen || !product) return null;

  const handleAddAttribute = () => {
    setAttributes((prev) => [...prev, { type: "", value: "" }]);
  };

  const handleRemoveAttribute = (index: number) => {
    if (attributes.length === 1) return;
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (
    index: number,
    field: "type" | "value",
    val: string
  ) => {
    setAttributes((prev) => {
      const copy = [...prev];
      copy[index][field] = val;
      return copy;
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setAttributes([{ type: "Color", value: "" }]);
    setIsPrivateLevel(false);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Follow the exact onSubmit pattern from departmentcreate.tsx
  const onSubmit = async (_data: FieldValues) => {
    // Validate attributes
    const validAttributes = attributes.filter(
      (a) => a.type.trim() && a.value.trim()
    );

    if (validAttributes.length === 0) {
      toast.error("Please provide at least one attribute (e.g. Color: Blue)");
      return;
    }

    const variantData = {
      product: product._id,
      attributes: validAttributes,
      isPrivateLevel,
    };

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(variantData));
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const res = await createVariant(formData).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Product variant created successfully!", {
          autoClose: 1000,
        });
        resetForm();
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create variant");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-base-100 border border-base-200 w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        <div className="h-1.5 w-full bg-gradient-to-r from-secondary via-primary to-accent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200/80 bg-base-200/30">
          <div className="space-y-1">
            <div className="badge badge-secondary gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              SKU Variant Creation
            </div>
            <h2 className="text-xl font-black tracking-tight text-base-content flex items-center gap-2">
              <Boxes className="w-5 h-5 text-secondary" />
              Add Variant to Catalog
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost text-base-content/70 hover:bg-base-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1 text-xs">
          {/* Target Product Notice */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-base-200/50 border border-base-200 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase text-primary">Target Product</div>
              <div className="font-extrabold text-xs text-base-content truncate">{product.title}</div>
              <div className="text-[10px] text-base-content/60">Brand: {product.brand || "N/A"}</div>
            </div>
          </div>

          <AZForm onSubmit={onSubmit}>
            <div className="space-y-5">
              {/* Dynamic Attributes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base-content/90">Variant Attributes *</span>
                  <button
                    type="button"
                    onClick={handleAddAttribute}
                    className="btn btn-ghost btn-xs text-secondary gap-1 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Attribute
                  </button>
                </div>

                <div className="space-y-2">
                  {attributes.map((attr, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={attr.type}
                        onChange={(e) =>
                          handleAttributeChange(idx, "type", e.target.value)
                        }
                        placeholder="Type (e.g. Color, Size)"
                        className="input input-bordered input-sm w-1/2 font-medium"
                      />
                      <input
                        type="text"
                        value={attr.value}
                        onChange={(e) =>
                          handleAttributeChange(idx, "value", e.target.value)
                        }
                        placeholder="Value (e.g. Midnight Blue, XL)"
                        className="input input-bordered input-sm w-1/2 font-medium"
                      />
                      {attributes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAttribute(idx)}
                          className="btn btn-ghost btn-sm btn-circle text-error"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Variant Images Upload */}
              <div className="space-y-2">
                <span className="font-bold text-base-content/90">Variant Photos</span>
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-base-300 hover:border-secondary/60 rounded-2xl cursor-pointer bg-base-200/30 hover:bg-base-200/60 transition-all group">
                  <Upload className="w-5 h-5 text-base-content/40 group-hover:text-secondary transition-colors mb-1" />
                  <span className="font-bold text-xs text-base-content">
                    Upload Variant Image(s)
                  </span>
                  <span className="text-[10px] text-base-content/50">
                    Max 10 images (Cloudinary)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {imagePreviews.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto py-2">
                    {imagePreviews.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group w-14 h-14 rounded-xl overflow-hidden border border-base-300 shrink-0 bg-white"
                      >
                        <img
                          src={img}
                          alt="preview"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-error" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Private Level Toggle */}
              <div className="p-3 rounded-2xl bg-base-200/50 border border-base-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-base-content">Private Brand / Exclusive Variant</div>
                  <div className="text-[10px] text-base-content/60">Limit availability to authorized tier</div>
                </div>
                <input
                  type="checkbox"
                  checked={isPrivateLevel}
                  onChange={(e) => setIsPrivateLevel(e.target.checked)}
                  className="toggle toggle-secondary toggle-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-base-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-sm btn-ghost font-bold text-base-content/70"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  className="group flex items-center justify-center gap-2 bg-success hover:bg-success/90 text-black py-2.5 px-6 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-md disabled:opacity-50"
                  type="submit"
                  disabled={isCreating}
                >
                  {isCreating ? "Creating Variant..." : "Create Variant"}
                </button>
              </div>
            </div>
          </AZForm>
        </div>
      </div>
    </div>
  );
};

export default CreateVariantModal;
