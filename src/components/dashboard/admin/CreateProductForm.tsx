"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCreateProductMutation } from "@/redux/features/product/productApi";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import {
  useAllCategoriesQuery,
  useCategoriesByDepartmentQuery,
} from "@/redux/features/category/categoryApi";
import {
  ShoppingBag,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Tag,
  DollarSign,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  Sliders,
  X,
  FileText,
  Eye
} from "lucide-react";

interface VariantAttribute {
  type: string;
  value: string;
}

interface VariantItem {
  id: string;
  asin: string;
  sku: string;
  attributes: VariantAttribute[];
  thumbnail: string;
  images: string[];
}

export const CreateProductForm: React.FC = () => {
  const router = useRouter();

  // RTK Query & Mutation
  const [createProduct, { isLoading: isSubmitting }] = useCreateProductMutation();
  const { data: departmentRes, isLoading: isDeptLoading } = useAllDepartmentsQuery({});
  
  const departments: any[] = departmentRes?.data || [];

  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Categories query based on selected department
  const { data: catByDeptRes, isLoading: isCatLoading } = useCategoriesByDepartmentQuery(
    selectedDepartment,
    { skip: !selectedDepartment }
  );

  const { data: allCatRes } = useAllCategoriesQuery({}, { skip: !!selectedDepartment });

  const categories: any[] = selectedDepartment
    ? catByDeptRes?.data || []
    : allCatRes?.data || [];

  // Form State
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState<string>("49.99");

  // Media
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [thumbnailUrlInput, setThumbnailUrlInput] = useState<string>("");

  // Features & Tags
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState<string[]>([
    "High performance & durable build",
    "1-year manufacturer warranty",
  ]);

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["Trending", "Best Seller", "New Arrival"]);

  // Variants
  const [variants, setVariants] = useState<VariantItem[]>([
    {
      id: "v-1",
      asin: "AMZ-DFLT-001",
      sku: "SKU-DFLT-001",
      attributes: [
        { type: "Color", value: "Matte Black" },
        { type: "Size", value: "Standard" },
      ],
      thumbnail: "",
      images: [],
    },
  ]);

  const [newAttrType, setNewAttrType] = useState("Color");
  const [newAttrValue, setNewAttrValue] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "media" | "variants" | "seo">("general");

  // Handle Thumbnail File Selection
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Handle Gallery Files Selection
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setGalleryFiles((prev) => [...prev, ...selected]);
      const newPreviews = selected.map((file) => URL.createObjectURL(file));
      setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // Feature actions
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures((prev) => [...prev, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  // Tag actions
  const handleAddTag = () => {
    if (tagInput.trim()) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  // Variant actions
  const handleAddVariant = () => {
    const nextId = `v-${variants.length + 1}`;
    setVariants((prev) => [
      ...prev,
      {
        id: nextId,
        asin: `AMZ-VAR-${Math.floor(1000 + Math.random() * 9000)}`,
        sku: `SKU-VAR-${Math.floor(1000 + Math.random() * 9000)}`,
        attributes: [{ type: "Color", value: "Default" }],
        thumbnail: "",
        images: [],
      },
    ]);
  };

  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 1) {
      toast.warning("Product must have at least one variant");
      return;
    }
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleAddVariantAttribute = (variantId: string) => {
    if (!newAttrValue.trim()) return;
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId) {
          return {
            ...v,
            attributes: [
              ...v.attributes,
              { type: newAttrType, value: newAttrValue.trim() },
            ],
          };
        }
        return v;
      })
    );
    setNewAttrValue("");
  };

  const handleRemoveVariantAttribute = (variantId: string, attrIdx: number) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId) {
          return {
            ...v,
            attributes: v.attributes.filter((_, idx) => idx !== attrIdx),
          };
        }
        return v;
      })
    );
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a product title");
      return;
    }
    if (!selectedDepartment) {
      toast.error("Please select a department");
      return;
    }
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (!brand.trim()) {
      toast.error("Please specify a brand name");
      return;
    }
    if (!description.trim()) {
      toast.error("Please provide a product description");
      return;
    }

    try {
      const payloadVariants = variants.map((v) => ({
        asin: v.asin || undefined,
        sku: v.sku || undefined,
        attributes: v.attributes,
        thumbnail: thumbnailPreview && !thumbnailFile ? thumbnailPreview : undefined,
        images: galleryPreviews.length > 0 && galleryFiles.length === 0 ? galleryPreviews : undefined,
      }));

      const productPayload = {
        department: selectedDepartment,
        category: selectedCategory,
        title: title.trim(),
        brand: brand.trim(),
        description: description.trim(),
        features: features,
        tags: tags,
        variants: payloadVariants,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(productPayload));

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }
      galleryFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await createProduct(formData).unwrap();

      if (response?.success || response?.data) {
        toast.success("Product created successfully!");
        router.push("/admin/products");
      } else {
        toast.success("Product successfully created!");
        router.push("/admin/products");
      }
    } catch (err: any) {
      console.error("Create Product Error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to create product");
    }
  };

  // Selected names for live preview
  const deptObj = departments.find((d: any) => d._id === selectedDepartment);
  const catObj = categories.find((c: any) => c._id === selectedCategory);

  const displayThumbnail =
    thumbnailPreview ||
    thumbnailUrlInput ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="btn btn-ghost btn-xs gap-1 text-base-content/70 hover:text-primary mb-1 -ml-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Catalog
            </button>
            <div className="flex items-center gap-2">
              <span className="badge badge-primary gap-1 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Product Studio
              </span>
              <span className="badge badge-outline text-xs font-bold">Admin Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Create New <span className="text-primary">Product</span>
            </h1>
            <p className="text-xs text-base-content/70">
              Configure inventory attributes, category hierarchy, variants, and store media.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="btn btn-ghost btn-sm text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-sm gap-2 text-xs font-black shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  <span>Saving Product...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Product</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Step Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-base-200">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`btn btn-sm text-xs font-bold gap-2 rounded-xl transition-all ${
            activeTab === "general"
              ? "btn-primary shadow-md"
              : "btn-ghost text-base-content/70"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. General Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("media")}
          className={`btn btn-sm text-xs font-bold gap-2 rounded-xl transition-all ${
            activeTab === "media"
              ? "btn-primary shadow-md"
              : "btn-ghost text-base-content/70"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>2. Media & Uploads</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("variants")}
          className={`btn btn-sm text-xs font-bold gap-2 rounded-xl transition-all ${
            activeTab === "variants"
              ? "btn-primary shadow-md"
              : "btn-ghost text-base-content/70"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>3. Variants & Attributes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`btn btn-sm text-xs font-bold gap-2 rounded-xl transition-all ${
            activeTab === "seo"
              ? "btn-primary shadow-md"
              : "btn-ghost text-base-content/70"
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>4. Features & SEO Tags</span>
        </button>
      </div>

      {/* Main Grid: Form Left (7 Cols), Live Preview Right (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Sections */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: GENERAL DETAILS */}
          {activeTab === "general" && (
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body p-6 space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-base-200">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h2 className="card-title text-base font-black">Basic Information</h2>
                </div>

                {/* Title */}
                <div className="form-control w-full space-y-1">
                  <label className="label py-0">
                    <span className="label-text font-bold text-xs">Product Title *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wireless Noise-Canceling Headphones Pro"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input input-bordered input-sm w-full rounded-xl focus:input-primary font-medium"
                  />
                </div>

                {/* Brand & Price Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control w-full space-y-1">
                    <label className="label py-0">
                      <span className="label-text font-bold text-xs">Brand Name *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sony, Apple, Nike"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="input input-bordered input-sm w-full rounded-xl focus:input-primary font-medium"
                    />
                  </div>

                  <div className="form-control w-full space-y-1">
                    <label className="label py-0">
                      <span className="label-text font-bold text-xs">Base Display Price ($)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="49.99"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        className="input input-bordered input-sm w-full pl-8 rounded-xl focus:input-primary font-mono font-bold"
                      />
                      <DollarSign className="w-4 h-4 text-base-content/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Department & Category Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control w-full space-y-1">
                    <label className="label py-0">
                      <span className="label-text font-bold text-xs">Department *</span>
                    </label>
                    <select
                      required
                      value={selectedDepartment}
                      onChange={(e) => {
                        setSelectedDepartment(e.target.value);
                        setSelectedCategory("");
                      }}
                      className="select select-bordered select-sm w-full rounded-xl font-medium focus:select-primary"
                    >
                      <option value="">
                        {isDeptLoading ? "Loading Departments..." : "Select Department"}
                      </option>
                      {departments.map((dept: any) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control w-full space-y-1">
                    <label className="label py-0">
                      <span className="label-text font-bold text-xs">Category *</span>
                    </label>
                    <select
                      required
                      disabled={!selectedDepartment}
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="select select-bordered select-sm w-full rounded-xl font-medium focus:select-primary"
                    >
                      <option value="">
                        {!selectedDepartment
                          ? "Select Department First"
                          : isCatLoading
                          ? "Loading Categories..."
                          : "Select Category"}
                      </option>
                      {categories.map((cat: any) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description Textarea */}
                <div className="form-control w-full space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="label py-0">
                      <span className="label-text font-bold text-xs">Product Description *</span>
                    </label>
                    <span className="text-[10px] text-base-content/60">
                      {description.length} chars
                    </span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide detailed specifications, benefits, warranty details, and usage recommendations..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea textarea-bordered text-xs w-full rounded-xl focus:textarea-primary"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("media")}
                    className="btn btn-primary btn-sm gap-2 text-xs font-bold rounded-xl"
                  >
                    <span>Next: Media Uploads</span>
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEDIA UPLOADS */}
          {activeTab === "media" && (
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body p-6 space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-base-200">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  <h2 className="card-title text-base font-black">Product Media & Gallery</h2>
                </div>

                {/* Main Thumbnail Upload */}
                <div className="space-y-2">
                  <label className="label py-0">
                    <span className="label-text font-bold text-xs">Primary Cover Thumbnail *</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    {/* Thumbnail Dropzone */}
                    <div className="sm:col-span-2">
                      <label className="border-2 border-dashed border-base-300 hover:border-primary/60 transition-colors rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-base-200/40 hover:bg-base-200">
                        <Upload className="w-8 h-8 text-primary mb-2" />
                        <span className="text-xs font-bold">Click to Upload Thumbnail Image</span>
                        <span className="text-[10px] text-base-content/60 mt-1">
                          PNG, JPG, WEBP or GIF (Max 5MB)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Thumbnail Preview Box */}
                    <div className="avatar justify-center">
                      <div className="w-28 h-28 rounded-2xl border border-base-300 bg-base-200 overflow-hidden relative group">
                        {thumbnailPreview ? (
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail Preview"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-base-content/40 text-[10px] font-bold p-2 text-center">
                            <ImageIcon className="w-6 h-6 mb-1" />
                            No Thumbnail
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fallback URL Input */}
                  <div className="form-control w-full space-y-1 pt-1">
                    <label className="label py-0">
                      <span className="label-text text-[11px] text-base-content/70">
                        Or enter direct Image URL (Optional):
                      </span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={thumbnailUrlInput}
                      onChange={(e) => {
                        setThumbnailUrlInput(e.target.value);
                        if (!thumbnailFile) {
                          setThumbnailPreview(e.target.value);
                        }
                      }}
                      className="input input-bordered input-xs w-full rounded-lg font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Additional Gallery Images */}
                <div className="space-y-3 pt-3 border-t border-base-200">
                  <label className="label py-0 flex items-center justify-between">
                    <span className="label-text font-bold text-xs">Gallery Images (Up to 6)</span>
                    <span className="text-[10px] font-bold text-primary">
                      {galleryFiles.length} Selected
                    </span>
                  </label>

                  <label className="border-2 border-dashed border-base-300 hover:border-primary/60 transition-colors rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-base-200/40 hover:bg-base-200">
                    <Plus className="w-6 h-6 text-primary mb-1" />
                    <span className="text-xs font-bold">Add Additional Gallery Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryChange}
                      className="hidden"
                    />
                  </label>

                  {/* Gallery Previews Grid */}
                  {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
                      {galleryPreviews.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-xl border border-base-300 overflow-hidden group bg-base-200"
                        >
                          <img src={src} alt="Gallery" className="object-cover w-full h-full" />
                          <button
                            type="button"
                            onClick={() => {
                              setGalleryPreviews((prev) => prev.filter((_, i) => i !== idx));
                              setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="absolute top-1 right-1 btn btn-error btn-circle btn-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("general")}
                    className="btn btn-ghost btn-sm gap-2 text-xs font-bold rounded-xl"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("variants")}
                    className="btn btn-primary btn-sm gap-2 text-xs font-bold rounded-xl"
                  >
                    <span>Next: Variants</span>
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VARIANTS & ATTRIBUTES */}
          {activeTab === "variants" && (
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body p-6 space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-base-200">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-primary" />
                    <h2 className="card-title text-base font-black">Product Variants</h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="btn btn-primary btn-xs gap-1 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Variant
                  </button>
                </div>

                <div className="space-y-4">
                  {variants.map((variant, vIdx) => (
                    <div
                      key={variant.id}
                      className="p-4 rounded-2xl border border-base-300 bg-base-200/50 space-y-4 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="badge badge-neutral badge-sm font-bold">
                          Variant #{vIdx + 1}
                        </span>
                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(variant.id)}
                            className="btn btn-ghost btn-xs text-error gap-1 hover:bg-error/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>

                      {/* ASIN & SKU Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="form-control w-full space-y-1">
                          <label className="label py-0">
                            <span className="label-text text-[11px] font-bold">ASIN Code</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. B08N5WRWNW"
                            value={variant.asin}
                            onChange={(e) => {
                              const val = e.target.value;
                              setVariants((prev) =>
                                prev.map((v) => (v.id === variant.id ? { ...v, asin: val } : v))
                              );
                            }}
                            className="input input-bordered input-xs font-mono font-bold w-full rounded-lg"
                          />
                        </div>

                        <div className="form-control w-full space-y-1">
                          <label className="label py-0">
                            <span className="label-text text-[11px] font-bold">SKU Code</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. SKU-HEADPHONE-BLK"
                            value={variant.sku}
                            onChange={(e) => {
                              const val = e.target.value;
                              setVariants((prev) =>
                                prev.map((v) => (v.id === variant.id ? { ...v, sku: val } : v))
                              );
                            }}
                            className="input input-bordered input-xs font-mono font-bold w-full rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Attributes Badges */}
                      <div className="space-y-2">
                        <label className="label py-0">
                          <span className="label-text text-[11px] font-bold">Variant Attributes</span>
                        </label>

                        <div className="flex flex-wrap items-center gap-2">
                          {variant.attributes.map((attr, aIdx) => (
                            <span
                              key={aIdx}
                              className="badge badge-secondary badge-sm gap-1 py-2 font-semibold"
                            >
                              <span className="opacity-70">{attr.type}:</span>
                              <span>{attr.value}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveVariantAttribute(variant.id, aIdx)}
                                className="hover:text-error ml-1"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>

                        {/* Add Attribute Row */}
                        <div className="flex items-center gap-2 pt-1">
                          <select
                            value={newAttrType}
                            onChange={(e) => setNewAttrType(e.target.value)}
                            className="select select-bordered select-xs rounded-lg text-[11px]"
                          >
                            <option value="Color">Color</option>
                            <option value="Size">Size</option>
                            <option value="Material">Material</option>
                            <option value="Style">Style</option>
                            <option value="Capacity">Capacity</option>
                          </select>

                          <input
                            type="text"
                            placeholder="Value (e.g. XL, Silver, 128GB)"
                            value={newAttrValue}
                            onChange={(e) => setNewAttrValue(e.target.value)}
                            className="input input-bordered input-xs rounded-lg flex-1 text-[11px]"
                          />

                          <button
                            type="button"
                            onClick={() => handleAddVariantAttribute(variant.id)}
                            className="btn btn-secondary btn-xs font-bold"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("media")}
                    className="btn btn-ghost btn-sm gap-2 text-xs font-bold rounded-xl"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("seo")}
                    className="btn btn-primary btn-sm gap-2 text-xs font-bold rounded-xl"
                  >
                    <span>Next: Features & Tags</span>
                    <Tag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FEATURES & SEO TAGS */}
          {activeTab === "seo" && (
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body p-6 space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-base-200">
                  <Tag className="w-5 h-5 text-primary" />
                  <h2 className="card-title text-base font-black">Features & Search Tags</h2>
                </div>

                {/* Key Features List Manager */}
                <div className="space-y-3">
                  <label className="label py-0">
                    <span className="label-text font-bold text-xs">Product Key Highlights</span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Active Noise Cancellation with Transparency Mode"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      className="input input-bordered input-sm flex-1 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="btn btn-neutral btn-sm font-bold gap-1 rounded-xl"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>

                  <ul className="space-y-2">
                    {features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-base-200/60 rounded-xl text-xs font-medium border border-base-300"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                          <span>{feat}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* SEO Search Tags Manager */}
                <div className="space-y-3 pt-3 border-t border-base-200">
                  <label className="label py-0">
                    <span className="label-text font-bold text-xs">Search & Filtering Tags</span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Audio, Wireless, Headphones"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="input input-bordered input-sm flex-1 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="btn btn-neutral btn-sm font-bold gap-1 rounded-xl"
                    >
                      <Plus className="w-4 h-4" /> Tag
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="badge badge-accent badge-outline font-bold gap-1 py-3 px-3 text-xs"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(idx)}
                          className="hover:text-error ml-1"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-base-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab("variants")}
                    className="btn btn-ghost btn-sm gap-2 text-xs font-bold rounded-xl"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary btn-sm gap-2 text-xs font-black shadow-lg rounded-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-xs" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Product</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Mockup Interactive Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24">
            <div className="card bg-base-100 shadow-2xl border border-base-200 overflow-hidden">
              {/* Header Badge */}
              <div className="bg-base-200 px-5 py-3 border-b border-base-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    Live Marketplace Preview
                  </span>
                </div>
                <span className="badge badge-success badge-sm font-bold text-[10px]">
                  Real-Time Mockup
                </span>
              </div>

              {/* Preview Image */}
              <div className="relative aspect-video bg-base-300 overflow-hidden group">
                <img
                  src={displayThumbnail}
                  alt="Product Mockup"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {deptObj && (
                    <span className="badge badge-primary badge-sm font-bold shadow">
                      {deptObj.name}
                    </span>
                  )}
                  {catObj && (
                    <span className="badge badge-neutral badge-sm font-bold shadow">
                      {catObj.name}
                    </span>
                  )}
                </div>
                {brand && (
                  <div className="absolute bottom-3 right-3 bg-base-100/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow">
                    {brand}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="card-body p-5 space-y-4">
                <div>
                  <h3 className="font-extrabold text-base line-clamp-2 leading-snug">
                    {title || "Untitled Product Listing"}
                  </h3>
                  <p className="text-xs text-base-content/70 mt-1 line-clamp-2">
                    {description || "No description provided yet..."}
                  </p>
                </div>

                {/* Price & Rating Placeholder */}
                <div className="flex items-center justify-between pt-2 border-t border-base-200">
                  <div>
                    <span className="text-[10px] text-base-content/60 uppercase font-bold block">
                      Market Price
                    </span>
                    <span className="text-xl font-black text-success font-mono">
                      ${Number(basePrice || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-base-content/60 uppercase font-bold block">
                      Variants
                    </span>
                    <span className="badge badge-secondary badge-sm font-bold">
                      {variants.length} Options
                    </span>
                  </div>
                </div>

                {/* Key Highlights */}
                {features.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-base-200">
                    <span className="text-[10px] font-black uppercase text-base-content/60">
                      Highlights
                    </span>
                    <ul className="space-y-1">
                      {features.slice(0, 3).map((f, i) => (
                        <li key={i} className="text-[11px] flex items-center gap-1.5 text-base-content/80 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-base-200">
                    {tags.map((t, i) => (
                      <span key={i} className="text-[10px] font-bold text-primary">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateProductForm;
