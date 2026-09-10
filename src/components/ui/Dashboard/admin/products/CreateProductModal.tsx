"use client";

import { useState, useMemo, ChangeEvent, KeyboardEvent } from "react";
import {
  ShoppingBag,
  Sparkles,
  X,
  Upload,
  Plus,
  Building2,
  Layers,
  Tag,
  ListCheck,
  Flame,
  FileText,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProductMutation } from "@/redux/features/product/productApi";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { useAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { TDepartment } from "@/src/types/department";
import { TCategory } from "@/src/types/category";
import { toast } from "react-toastify";
import { FieldValues } from "react-hook-form";
import AZForm from "../../../shared/form/AZFrom";
import AZInput from "../../../shared/form/AZInput";
import { productSchema } from "@/src/schema/Product";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateProductModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateProductModalProps) => {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const { data: deptData, isLoading: isDeptLoading } = useAllDepartmentsQuery({
    limit: 0,
  });
  const { data: catData, isLoading: isCatLoading } = useAllCategoriesQuery({
    limit: 0,
  });

  const departments: TDepartment[] = deptData?.data || [];
  const allCategories: TCategory[] = catData?.data || [];

  // Local state for dynamic controls (department selection, categories, tags, features, image)
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Filter categories by chosen department
  const filteredCategories = useMemo(() => {
    if (!selectedDepartment) return [];
    return allCategories.filter((cat) => {
      const deptId =
        typeof cat.department === "object" ? cat.department?._id : cat.department;
      return deptId === selectedDepartment;
    });
  }, [allCategories, selectedDepartment]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures((prev) => [...prev, trimmed]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Follow the exact onSubmit pattern used in departmentcreate.tsx
  const onSubmit = async (data: FieldValues) => {
    const deptId = data.department || selectedDepartment;
    const catId = data.category || selectedCategory;

    if (!deptId) {
      toast.error("Please select a department");
      return;
    }
    if (!catId) {
      toast.error("Please select a category");
      return;
    }

    const finalFeatures =
      features.length > 0
        ? features
        : featureInput.trim()
        ? [featureInput.trim()]
        : [data.title || "Standard Feature"];

    const finalTags =
      tags.length > 0
        ? tags
        : tagInput.trim()
        ? [tagInput.trim().toLowerCase()]
        : ["general"];

    // Catalog specification only (NO inventory info)
    const productData = {
      department: deptId,
      category: catId,
      title: data.title,
      brand: data.brand,
      features: finalFeatures,
      tags: finalTags,
      isBestSeller: Boolean(isBestSeller),
      minPrice: Number(data.minPrice) > 0 ? Number(data.minPrice) : 0,
      description: data.description || "",
    };

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(productData));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await createProduct(formData).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Product created successfully!", {
          autoClose: 1000,
        });
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create product");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-base-100 border border-base-200 w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-accent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200/80 bg-base-200/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="badge badge-primary gap-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Product Governance
              </span>
              <span className="badge badge-ghost text-[10px] font-bold text-base-content/60">
                Admin Master Catalog
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-base-content flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Create Product Listing
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-base-content/70 hover:bg-base-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body using AZForm */}
        <div className="overflow-y-auto p-6 flex-1 text-xs">
          <AZForm
            resolver={zodResolver(productSchema)}
            onSubmit={onSubmit}
            defaultValues={{
              title: "",
              brand: "",
              department: "",
              category: "",
              minPrice: "",
              description: "",
            }}
          >
            <div className="space-y-6">
              {/* SECTION 1: Core Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-base-200 text-xs font-black uppercase tracking-wider text-base-content/70">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>Core Information</span>
                </div>

                <div className="space-y-3">
                  <AZInput
                    label="Product Title"
                    name="title"
                    type="text"
                    placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AZInput
                      label="Brand Name"
                      name="brand"
                      type="text"
                      placeholder="e.g. Sony, Apple, Nike"
                    />
                    <AZInput
                      label="Starting / Base Price ($)"
                      name="minPrice"
                      type="number"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Taxonomy & Classification */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-base-200 text-xs font-black uppercase tracking-wider text-base-content/70">
                  <Building2 className="w-3.5 h-3.5 text-warning" />
                  <span>Taxonomy Classification</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Department Select */}
                  <div className="form-control w-full">
                    <label className="label mb-1">
                      <span className="text-xs font-black text-warning uppercase tracking-widest italic">
                        Department
                      </span>
                    </label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => {
                        setSelectedDepartment(e.target.value);
                        setSelectedCategory("");
                      }}
                      disabled={isDeptLoading}
                      className="w-full bg-warning/5 border border-warning/50 rounded-2xl px-4 py-3 text-black font-bold outline-none cursor-pointer focus:border-primary"
                    >
                      <option value="">
                        {isDeptLoading ? "Loading departments..." : "Select Department"}
                      </option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Select */}
                  <div className="form-control w-full">
                    <label className="label mb-1">
                      <span className="text-xs font-black text-warning uppercase tracking-widest italic flex items-center gap-1">
                        <Layers className="w-3 h-3 text-info inline" />
                        Category
                      </span>
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      disabled={isCatLoading || !selectedDepartment}
                      className="w-full bg-warning/5 border border-warning/50 rounded-2xl px-4 py-3 text-black font-bold outline-none cursor-pointer focus:border-primary disabled:opacity-50"
                    >
                      <option value="">
                        {!selectedDepartment
                          ? "← Select Department First"
                          : filteredCategories.length === 0
                          ? "No categories in this department"
                          : "Select Category"}
                      </option>
                      {filteredCategories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Image Upload */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-base-200 text-xs font-black uppercase tracking-wider text-base-content/70">
                  <ImageIcon className="w-3.5 h-3.5 text-primary" />
                  <span>Product Image Thumbnail</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-8">
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-base-300 hover:border-primary/60 rounded-2xl cursor-pointer bg-base-200/30 hover:bg-base-200/60 transition-all group">
                      <Upload className="w-6 h-6 text-base-content/40 group-hover:text-primary transition-colors mb-1" />
                      <span className="font-bold text-xs text-base-content">
                        Click to select image file
                      </span>
                      <span className="text-[10px] text-base-content/50">
                        PNG, JPG, WEBP (Max 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        name="image"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="sm:col-span-4 flex items-center justify-center">
                    {imagePreview ? (
                      <div className="relative group w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/40 bg-white p-1 shadow-md">
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-xs gap-1"
                        >
                          <Trash2 className="w-4 h-4 text-error" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-2xl border border-dashed border-base-300 bg-base-200/30 flex flex-col items-center justify-center text-base-content/30 text-[10px] text-center p-2">
                        <ImageIcon className="w-6 h-6 mb-1" />
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 4: Features, Tags & Best Seller */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-base-200 text-xs font-black uppercase tracking-wider text-base-content/70">
                  <ListCheck className="w-3.5 h-3.5 text-secondary" />
                  <span>Features & Discovery Tags</span>
                </div>

                {/* Features input */}
                <div className="space-y-1.5">
                  <label className="label py-0">
                    <span className="font-bold text-base-content/90 flex items-center gap-1">
                      <ListCheck className="w-3.5 h-3.5 text-primary" />
                      Key Product Features
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      placeholder="e.g. 30-hour battery life with quick charging"
                      className="input input-bordered input-sm flex-1 font-medium focus:input-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="btn btn-sm btn-outline gap-1 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>

                  {features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 max-h-24 overflow-y-auto">
                      {features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="badge badge-neutral gap-1.5 py-3 px-2.5 text-xs font-semibold"
                        >
                          <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
                          <span className="max-w-[200px] truncate">{feat}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(idx)}
                            className="hover:text-error transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags input */}
                <div className="space-y-1.5">
                  <label className="label py-0">
                    <span className="font-bold text-base-content/90 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-accent" />
                      Search & Discovery Tags
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Type tag (e.g. audio, wireless) and press Enter"
                      className="input input-bordered input-sm flex-1 font-medium focus:input-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="btn btn-sm btn-outline gap-1 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Tag
                    </button>
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="badge badge-primary badge-outline gap-1 py-2 px-2 text-[11px] font-bold"
                        >
                          #{t}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(idx)}
                            className="hover:text-error transition-colors ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <AZInput
                  label="Description"
                  name="description"
                  type="text"
                  placeholder="Detailed product specification..."
                />

                {/* Best Seller toggle */}
                <div className="p-3 rounded-2xl bg-base-200/50 border border-base-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-base-content flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-warning" />
                      Mark as Best Seller
                    </div>
                    <p className="text-[10px] text-base-content/60">
                      Promote this product in catalog recommendations.
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

              {/* Submit Buttons */}
              <div className="mt-6 pt-4 border-t border-base-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
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
                  {isCreating ? "Creating Product..." : "Create Product"}
                </button>
              </div>
            </div>
          </AZForm>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
