"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Sparkles,
  Wand2,
  X,
  Copy,
  Check,
  CheckCircle2,
  ListCheck,
  Tag,
  Globe,
  FileText,
  Layers,
  Building2,
  RefreshCw,
  Zap,
  Sliders,
  UploadCloud,
  ImageIcon,
  Trash2,
  ShoppingBag,
  Flame,
  Plus,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  useGenerateProductContentMutation,
  TProductContentOutput,
} from "@/redux/features/ai/aiApi";
import { useCreateProductMutation } from "@/redux/features/product/productApi";
import { useAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { TCategory } from "@/src/types/category";
import { TDepartment } from "@/src/types/department";
import { toast } from "react-toastify";

export interface AiProductContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onApply?: (content: TProductContentOutput) => void;
  initialValues?: {
    title?: string;
    category?: string;
    brand?: string;
    features?: string[] | string;
    keywords?: string[];
    imageFile?: File | null;
    imageUrl?: string;
  };
}

const TONES = [
  { id: "professional", label: "Professional", icon: "💼" },
  { id: "exciting", label: "Exciting & Energetic", icon: "⚡" },
  { id: "luxury", label: "Luxury & Premium", icon: "✨" },
  { id: "casual", label: "Casual & Friendly", icon: "😊" },
  { id: "technical", label: "Technical & Spec-driven", icon: "🛠️" },
];

export const AiProductContentModal: React.FC<AiProductContentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onApply,
  initialValues,
}) => {
  // Mode selection: "vision" or "text"
  const [activeInputMode, setActiveInputMode] = useState<"vision" | "text">(
    initialValues?.imageFile || initialValues?.imageUrl ? "vision" : "vision"
  );

  // AI Seed state
  const [seedTitle, setSeedTitle] = useState(initialValues?.title || "");
  const [seedBrand, setSeedBrand] = useState(initialValues?.brand || "");
  const [seedCategory, setSeedCategory] = useState(initialValues?.category || "");
  const [seedFeaturesText, setSeedFeaturesText] = useState(
    Array.isArray(initialValues?.features)
      ? initialValues.features.join("\n")
      : initialValues?.features || ""
  );
  const [seedTone, setSeedTone] = useState("professional");
  const [seedTargetAudience, setSeedTargetAudience] = useState("");
  const [seedKeywordsText, setSeedKeywordsText] = useState(
    (initialValues?.keywords || []).join(", ")
  );

  // Vision File/URL state
  const [uploadedImages, setUploadedImages] = useState<File[]>(
    initialValues?.imageFile ? [initialValues.imageFile] : []
  );
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialValues?.imageUrl ? [initialValues.imageUrl] : []
  );
  const [imageUrlInput, setImageUrlInput] = useState<string>(
    initialValues?.imageUrl || ""
  );
  const [useImageUrlMode, setUseImageUrlMode] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Output state
  const [generatedResult, setGeneratedResult] =
    useState<TProductContentOutput | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Integrated Create Product Form State
  const [formTitle, setFormTitle] = useState("");
  const [formBrand, setFormBrand] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [formTags, setFormTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string>("");
  const [isBestSeller, setIsBestSeller] = useState<boolean>(false);

  // Active right side view: "review" | "form"
  const [activeTab, setActiveTab] = useState<"review" | "form">("review");

  // API hooks
  const [generateProductContent, { isLoading: isGenerating }] =
    useGenerateProductContentMutation();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const { data: departmentsData } = useAllDepartmentsQuery({ limit: 0 });
  const { data: categoriesData } = useAllCategoriesQuery({ limit: 0 });

  const departments: TDepartment[] = departmentsData?.data || [];
  const allCategories: TCategory[] = categoriesData?.data || [];

  // Filter categories by selected department
  const filteredCategories = useMemo(() => {
    if (!formDepartment) return allCategories;
    return allCategories.filter((cat: TCategory) => {
      const deptId =
        typeof cat.department === "object"
          ? (cat.department as any)?._id
          : cat.department;
      return deptId === formDepartment;
    });
  }, [allCategories, formDepartment]);

  // Sync initial values
  useEffect(() => {
    if (initialValues && isOpen) {
      if (initialValues.title) {
        setSeedTitle(initialValues.title);
        setFormTitle(initialValues.title);
      }
      if (initialValues.brand) {
        setSeedBrand(initialValues.brand);
        setFormBrand(initialValues.brand);
      }
      if (initialValues.imageFile) {
        setUploadedImages([initialValues.imageFile]);
        setFormImage(initialValues.imageFile);
        const url = URL.createObjectURL(initialValues.imageFile);
        setImagePreviews([url]);
        setFormImagePreview(url);
      }
    }
  }, [initialValues, isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!", { autoClose: 1200 });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).slice(0, 4);
      setUploadedImages(newFiles);
      const previews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);

      // Auto-set as product image for creation
      setFormImage(newFiles[0]);
      setFormImagePreview(previews[0]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = uploadedImages.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setUploadedImages(updatedFiles);
    setImagePreviews(updatedPreviews);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (updatedFiles.length > 0) {
      setFormImage(updatedFiles[0]);
      setFormImagePreview(updatedPreviews[0]);
    } else {
      setFormImage(null);
      setFormImagePreview("");
    }
  };

  // Generate Product Content (Vision or Text)
  const handleGenerateContent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const hasImages = uploadedImages.length > 0;
    const hasImageUrl = Boolean(imageUrlInput.trim());
    const isVision = hasImages || hasImageUrl;

    if (!isVision) {
      if (!seedTitle.trim()) {
        toast.error("Please enter a product title or upload a photo");
        return;
      }
      if (!seedBrand.trim()) {
        toast.error("Please provide a brand name");
        return;
      }
    }

    const splitFeatures = seedFeaturesText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const splitKeywords = seedKeywordsText
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      let response;

      if (hasImages) {
        // Multi-part form data with images
        const formData = new FormData();
        uploadedImages.forEach((file) => {
          formData.append("images", file);
        });

        const meta: Record<string, any> = { tone: seedTone };
        if (seedTitle.trim()) meta.title = seedTitle.trim();
        if (seedBrand.trim()) meta.brand = seedBrand.trim();
        if (seedCategory.trim()) meta.category = seedCategory.trim();
        if (splitFeatures.length > 0) meta.features = splitFeatures;
        if (seedTargetAudience.trim()) meta.targetAudience = seedTargetAudience.trim();
        if (splitKeywords.length > 0) meta.keywords = splitKeywords;

        formData.append("data", JSON.stringify(meta));
        response = await generateProductContent(formData).unwrap();
      } else {
        // JSON payload
        const payload: Record<string, any> = {
          tone: seedTone,
        };
        if (hasImageUrl) payload.imageUrl = imageUrlInput.trim();
        if (seedTitle.trim()) payload.title = seedTitle.trim();
        if (seedBrand.trim()) payload.brand = seedBrand.trim();
        if (seedCategory.trim()) payload.category = seedCategory.trim();
        if (splitFeatures.length > 0) payload.features = splitFeatures;
        else if (!isVision && seedTitle.trim()) payload.features = [seedTitle.trim()];
        if (seedTargetAudience.trim()) payload.targetAudience = seedTargetAudience.trim();
        if (splitKeywords.length > 0) payload.keywords = splitKeywords;

        response = await generateProductContent(payload).unwrap();
      }

      if (response?.data) {
        const data = response.data;
        setGeneratedResult(data);

        // Auto-populate the integrated Create Product Form with AI results!
        const generatedTitle = data.seoTitle || data.title || seedTitle;
        const generatedBrand = data.brand || seedBrand;
        setFormTitle(generatedTitle);
        setFormBrand(generatedBrand);

        // Match Department
        const targetDeptName = data.suggestedDepartment || data.department;
        let matchedDeptId = "";
        if (targetDeptName && departments.length > 0) {
          const match = departments.find(
            (d) =>
              d.name.toLowerCase() === targetDeptName.toLowerCase() ||
              targetDeptName.toLowerCase().includes(d.name.toLowerCase()) ||
              d.name.toLowerCase().includes(targetDeptName.toLowerCase())
          );
          if (match) {
            matchedDeptId = match._id;
            setFormDepartment(match._id);
          }
        }

        // Match Category
        const targetCatName = data.suggestedCategory || data.category;
        if (targetCatName && allCategories.length > 0) {
          const match = allCategories.find(
            (c) =>
              c.name.toLowerCase() === targetCatName.toLowerCase() ||
              targetCatName.toLowerCase().includes(c.name.toLowerCase()) ||
              c.name.toLowerCase().includes(targetCatName.toLowerCase())
          );
          if (match) {
            if (!matchedDeptId && typeof match.department === "string") {
              setFormDepartment(match.department);
            }
            setFormCategory(match._id);
          }
        }

        // Features & Tags
        const feats = data.bulletFeatures || data.features || [];
        setFormFeatures(feats);

        const tags = data.tags || data.keywords || [];
        setFormTags(tags);

        toast.success(
          isVision
            ? "Vision AI analyzed photo and generated product content!"
            : "AI synthesized product content successfully!"
        );
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to generate AI product content"
      );
    }
  };

  // Auto-Fill / Apply Action
  const handleApplyToForm = () => {
    if (!generatedResult) return;

    if (onApply) {
      onApply(generatedResult);
      toast.success("AI content applied!");
      onClose();
      return;
    }

    if (generatedResult.seoTitle || generatedResult.title) {
      setFormTitle(generatedResult.seoTitle || generatedResult.title || "");
    }
    if (generatedResult.brand) {
      setFormBrand(generatedResult.brand || "");
    }
    const feats = generatedResult.bulletFeatures || generatedResult.features;
    if (feats && feats.length > 0) {
      setFormFeatures(feats);
    }
    const tags = generatedResult.tags || generatedResult.keywords;
    if (tags && tags.length > 0) {
      setFormTags(tags);
    }

    setActiveTab("form");
    toast.success("AI content synced directly into Create Product form!");
  };

  // Add a feature bullet manually
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormFeatures((prev) => [...prev, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFormFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  // Add a tag manually
  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (trimmed && !formTags.includes(trimmed)) {
      setFormTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (idx: number) => {
    setFormTags((prev) => prev.filter((_, i) => i !== idx));
  };

  // Final Product Creation Submit
  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      toast.error("Product title is required");
      return;
    }
    if (!formBrand.trim()) {
      toast.error("Brand name is required");
      return;
    }
    if (!formDepartment) {
      toast.error("Please select a department");
      return;
    }
    if (!formCategory) {
      toast.error("Please select a category");
      return;
    }

    const finalFeatures =
      formFeatures.length > 0
        ? formFeatures
        : featureInput.trim()
        ? [featureInput.trim()]
        : [formTitle.trim()];

    const finalTags =
      formTags.length > 0
        ? formTags
        : tagInput.trim()
        ? [tagInput.trim().toLowerCase()]
        : ["general", formBrand.trim().toLowerCase()];

    const productPayload = {
      department: formDepartment,
      category: formCategory,
      title: formTitle.trim(),
      brand: formBrand.trim(),
      features: finalFeatures,
      tags: finalTags,
      isBestSeller: Boolean(isBestSeller),
    };

    const formData = new FormData();
    try {
      formData.append("data", JSON.stringify(productPayload));
      if (formImage) {
        formData.append("image", formImage);
      }

      const res = await createProduct(formData).unwrap();

      if (res?.success) {
        toast.success(res?.message || "Product created successfully in catalog!", {
          autoClose: 1500,
        });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create product listing");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#140b2b] border border-amber-400/20 w-full max-w-6xl max-h-[94vh] rounded-3xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col relative text-slate-100">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent pointer-events-none z-30" />

        {/* Ambient background glow orbs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-amber-500/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-tl from-indigo-600/25 to-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Studio Header */}
        <div className="p-4 sm:p-5 pb-3 border-b border-white/10 flex items-center justify-between relative z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  AI Content Studio and{" "}
                  <span className="text-amber-400">Create Product</span>
                </h2>
                <span className="badge badge-warning text-[10px] font-black uppercase tracking-wider py-0.5 px-2 text-slate-950 shadow">
                  Unified Studio
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Generate high-converting content with Vision AI or text specs, review &amp; copy details, and create the product directly in one place.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 shadow transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Studio Body: Split Columns */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
          {/* Left Column: AI Content Generator (5 Cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="p-4 rounded-2xl bg-[#190f36]/80 border border-white/10 shadow-inner space-y-3.5">
              {/* Generator Mode Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  1. AI Generation Inputs
                </span>

                {/* Mode Selector */}
                <div className="flex items-center gap-1 bg-[#100722] p-1 rounded-xl border border-white/10 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setActiveInputMode("vision")}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeInputMode === "vision"
                        ? "bg-amber-400 text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Photo Vision</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInputMode("text")}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeInputMode === "text"
                        ? "bg-amber-400 text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    <span>Text Specs</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleGenerateContent} className="space-y-3">
                {/* Vision Photo Mode */}
                {activeInputMode === "vision" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                        <span>Upload Product Photo</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setUseImageUrlMode(!useImageUrlMode)}
                        className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                      >
                        {useImageUrlMode ? "Upload File" : "Paste Image URL"}
                      </button>
                    </div>

                    {useImageUrlMode ? (
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => {
                          setImageUrlInput(e.target.value);
                          if (e.target.value) setImagePreviews([e.target.value]);
                          else setImagePreviews([]);
                        }}
                        placeholder="https://example.com/product-image.jpg"
                        className="input input-sm w-full bg-[#100722] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs"
                      />
                    ) : (
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          multiple
                          onChange={handleImageFilesChange}
                          className="hidden"
                          id="ai-studio-file-upload"
                        />
                        <label
                          htmlFor="ai-studio-file-upload"
                          className="group flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-white/20 hover:border-amber-400/60 bg-[#100722]/70 hover:bg-[#100722] transition-all cursor-pointer text-center"
                        >
                          <UploadCloud className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform mb-1" />
                          <span className="text-xs font-bold text-slate-200">
                            {uploadedImages.length > 0
                              ? `${uploadedImages.length} image(s) selected`
                              : "Click to upload product image (max 4)"}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            Vision AI automatically detects brand, category &amp; key specs
                          </span>
                        </label>
                      </div>
                    )}

                    {/* Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {imagePreviews.map((src, idx) => (
                          <div
                            key={idx}
                            className="relative w-14 h-14 rounded-xl overflow-hidden border border-amber-400/40 bg-black/40 group shadow-md"
                          >
                            <img
                              src={src}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1 right-1 p-0.5 rounded-md bg-black/70 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                        <div className="flex items-center text-[10px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
                          ⚡ Vision AI Active (Text inputs optional)
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Common / Seed Inputs */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>Product Working Title / Concept</span>
                    {activeInputMode === "text" && (
                      <span className="text-amber-400 text-[10px]">* Required</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={seedTitle}
                    onChange={(e) => setSeedTitle(e.target.value)}
                    placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                    required={activeInputMode === "text"}
                    className="input input-sm w-full bg-[#100722] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-amber-400" />
                      <span>Brand</span>
                      {activeInputMode === "text" && (
                        <span className="text-amber-400 text-[10px]">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={seedBrand}
                      onChange={(e) => setSeedBrand(e.target.value)}
                      placeholder="e.g. Sony"
                      required={activeInputMode === "text"}
                      className="input input-sm w-full bg-[#100722] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-sky-400" />
                      <span>Category Hint</span>
                    </label>
                    <input
                      type="text"
                      value={seedCategory}
                      onChange={(e) => setSeedCategory(e.target.value)}
                      placeholder="e.g. Electronics, Audio"
                      className="input input-sm w-full bg-[#100722] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Seed Specs (Text Mode or optional for Vision) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <ListCheck className="w-3 h-3 text-emerald-400" />
                      Key Features or Specs (1 per line)
                    </span>
                    <span className="text-[10px] text-slate-400">Optional</span>
                  </label>
                  <textarea
                    rows={2}
                    value={seedFeaturesText}
                    onChange={(e) => setSeedFeaturesText(e.target.value)}
                    placeholder="e.g.&#10;Industry-leading noise cancellation&#10;30-hour battery life with quick charge"
                    className="textarea textarea-sm w-full bg-[#100722] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs leading-relaxed"
                  />
                </div>

                {/* Tone of voice */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200">
                    Tone of Voice
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSeedTone(t.id)}
                        className={`text-[10px] font-semibold py-1 px-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                          seedTone === t.id
                            ? "bg-amber-400 text-slate-950 border-amber-400 font-bold"
                            : "bg-[#100722] text-slate-300 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Action Button */}
                <div className="pt-1.5">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] shadow-lg shadow-amber-500/20 disabled:opacity-60 cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                        <span>
                          {uploadedImages.length > 0 || imageUrlInput
                            ? "Vision AI Analyzing Image..."
                            : "AI Synthesizing Copy..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3.5 h-3.5 text-slate-950" />
                        <span>
                          {uploadedImages.length > 0 || imageUrlInput
                            ? "Generate Content from Photo"
                            : "Generate Product Content"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: AI Content Review & Integrated Create Product Form (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-3.5">
            {/* Right Pane Navigation Header */}
            <div className="p-3 rounded-2xl bg-[#190f36]/80 border border-white/10 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5 bg-[#100722] p-1 rounded-xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("review")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "review"
                      ? "bg-amber-400 text-slate-950 shadow-sm"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>2. Review &amp; Copy AI Content</span>
                  {generatedResult && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "form"
                      ? "bg-amber-400 text-slate-950 shadow-sm"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>3. Create Product Form</span>
                </button>
              </div>

              {generatedResult && (
                <button
                  type="button"
                  onClick={handleApplyToForm}
                  className="btn btn-xs sm:btn-sm gap-1.5 font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 border-0 rounded-xl shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Use in Create Form</span>
                </button>
              )}
            </div>

            {/* TAB 1: REVIEW & COPY AI GENERATED CONTENT */}
            {activeTab === "review" && (
              <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-[#190f36]/50 border border-white/10 min-h-[350px] text-center">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 animate-ping opacity-25" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-base font-black text-white">
                      {uploadedImages.length > 0 || imageUrlInput
                        ? "Visual Analysis & Copy Generation in Progress"
                        : "Synthesizing Conversion-Ready Product Copy"}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                      Crafting keyword-optimized SEO titles, benefit bullet points, categorization hints, and marketing narratives...
                    </p>
                  </div>
                ) : generatedResult ? (
                  <div className="space-y-3">
                    {/* Suggested Taxonomy Banner with 1-click apply */}
                    <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        {generatedResult.brand && (
                          <span className="font-bold text-white flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-amber-400" />
                            Brand:{" "}
                            <span className="text-amber-400">
                              {generatedResult.brand}
                            </span>
                          </span>
                        )}
                        {generatedResult.suggestedDepartment && (
                          <span className="badge badge-sm bg-sky-400/15 text-sky-300 border-sky-400/30 font-bold">
                            Dept: {generatedResult.suggestedDepartment}
                          </span>
                        )}
                        {generatedResult.suggestedCategory && (
                          <span className="badge badge-sm bg-emerald-400/15 text-emerald-300 border-emerald-400/30 font-bold">
                            Category: {generatedResult.suggestedCategory}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyToForm}
                        className="text-[11px] font-black text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Applied to form</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* SEO Title Card with Copy Button */}
                    <div className="p-3.5 rounded-2xl bg-[#190f36]/70 border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          Recommended SEO Title
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                generatedResult.seoTitle || generatedResult.title || "",
                                "seoTitle"
                              )
                            }
                            className="btn btn-ghost btn-xs text-slate-300 hover:text-white gap-1"
                          >
                            {copiedKey === "seoTitle" ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span className="text-[10px]">Copy</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                        {generatedResult.seoTitle || generatedResult.title}
                      </p>
                    </div>

                    {/* Bullet Features with Individual & All Copy */}
                    <div className="p-3.5 rounded-2xl bg-[#190f36]/70 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <ListCheck className="w-3 h-3" />
                          Feature Bullets ({(generatedResult.bulletFeatures || generatedResult.features || []).length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const allFeats = (
                              generatedResult.bulletFeatures ||
                              generatedResult.features ||
                              []
                            ).join("\n");
                            handleCopy(allFeats, "allFeatures");
                          }}
                          className="btn btn-ghost btn-xs text-slate-300 hover:text-white gap-1"
                        >
                          {copiedKey === "allFeatures" ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span className="text-[10px]">Copy All</span>
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        {(
                          generatedResult.bulletFeatures ||
                          generatedResult.features ||
                          []
                        ).map((feat, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-xl bg-[#100722]/70 border border-white/10 flex items-start justify-between gap-2 text-xs"
                          >
                            <span className="text-slate-200 leading-snug flex-1">
                              • {feat}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(feat, `feat-${idx}`)}
                              className="btn btn-ghost btn-xs text-slate-400 hover:text-white shrink-0"
                            >
                              {copiedKey === `feat-${idx}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Descriptions Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Short Description */}
                      <div className="p-3.5 rounded-2xl bg-[#190f36]/70 border border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Short Hook
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                generatedResult.shortDescription ||
                                  generatedResult.description ||
                                  "",
                                "shortDesc"
                              )
                            }
                            className="btn btn-ghost btn-xs text-slate-300 hover:text-white"
                          >
                            {copiedKey === "shortDesc" ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
                          {generatedResult.shortDescription ||
                            generatedResult.description}
                        </p>
                      </div>

                      {/* Long Marketing Description */}
                      <div className="p-3.5 rounded-2xl bg-[#190f36]/70 border border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Full Story
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                generatedResult.longDescription ||
                                  generatedResult.shortDescription ||
                                  "",
                                "longDesc"
                              )
                            }
                            className="btn btn-ghost btn-xs text-slate-300 hover:text-white"
                          >
                            {copiedKey === "longDesc" ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
                          {generatedResult.longDescription ||
                            generatedResult.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Discovery Tags & Keywords with Copy */}
                    <div className="p-3.5 rounded-2xl bg-[#190f36]/70 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                          <Tag className="w-3 h-3" />
                          Discovery Tags &amp; Keywords
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const allTags = [
                              ...(generatedResult.tags || []),
                              ...(generatedResult.keywords || []),
                            ].join(", ");
                            handleCopy(allTags, "allTags");
                          }}
                          className="btn btn-ghost btn-xs text-slate-300 hover:text-white gap-1"
                        >
                          {copiedKey === "allTags" ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span className="text-[10px]">Copy Tags</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(generatedResult.tags || []).map((t, idx) => (
                          <span
                            key={idx}
                            className="badge badge-sm bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[10px] font-bold"
                          >
                            #{t}
                          </span>
                        ))}
                        {(generatedResult.keywords || []).map((kw, idx) => (
                          <span
                            key={`kw-${idx}`}
                            className="badge badge-sm bg-sky-400/10 text-sky-400 border border-sky-400/30 text-[10px]"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Empty state encouraging generation */
                  <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-[#190f36]/40 border border-dashed border-white/15 min-h-[350px] text-center">
                    <div className="p-3 rounded-2xl bg-amber-400/10 text-amber-400 mb-3 border border-amber-400/20">
                      <Wand2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-sm font-black text-white">
                      AI Generated Content Will Appear Here
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                      Upload a photo or enter working concept specs on the left, then click{" "}
                      <strong className="text-amber-400">
                        &ldquo;Generate Content&rdquo;
                      </strong>
                      . You can review and copy/paste any part, or switch directly to the{" "}
                      <strong className="text-sky-400">&ldquo;Create Product Form&rdquo;</strong> tab.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("form")}
                      className="btn btn-sm btn-outline btn-warning gap-1.5 mt-4 text-xs font-bold rounded-xl"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Switch to Create Product Form</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: INTEGRATED CREATE PRODUCT FORM */}
            {activeTab === "form" && (
              <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                <div className="p-4 rounded-2xl bg-[#190f36]/80 border border-white/10 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Integrated Catalog Registration Form
                    </span>
                    {generatedResult && (
                      <span className="badge badge-success text-[10px] font-black py-0.5 px-2 text-slate-950">
                        ✓ Pre-filled with AI
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleCreateProductSubmit} className="space-y-3.5">
                    {/* Product Title */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-200">
                          Product Listing Title *
                        </label>
                        {generatedResult?.seoTitle && (
                          <button
                            type="button"
                            onClick={() =>
                              setFormTitle(
                                generatedResult.seoTitle || generatedResult.title || ""
                              )
                            }
                            className="text-[10px] font-bold text-amber-400 hover:underline cursor-pointer"
                          >
                            Paste AI Title
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Enter master product listing title"
                        required
                        className="input input-sm w-full bg-[#100722] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs font-medium"
                      />
                    </div>

                    {/* Brand */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-200">
                          Brand Name *
                        </label>
                        {generatedResult?.brand && (
                          <button
                            type="button"
                            onClick={() => setFormBrand(generatedResult.brand || "")}
                            className="text-[10px] font-bold text-amber-400 hover:underline cursor-pointer"
                          >
                            Paste AI Brand
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={formBrand}
                        onChange={(e) => setFormBrand(e.target.value)}
                        placeholder="e.g. Sony, Apple, Nike"
                        required
                        className="input input-sm w-full bg-[#100722] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs"
                      />
                    </div>

                    {/* Department & Category Selects */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-amber-400" />
                          Department *
                        </label>
                        <select
                          value={formDepartment}
                          onChange={(e) => {
                            setFormDepartment(e.target.value);
                            setFormCategory(""); // Reset category when department changes
                          }}
                          required
                          className="select select-sm w-full bg-[#100722] border border-white/15 text-slate-200 focus:border-amber-400 focus:outline-none rounded-xl text-xs"
                        >
                          <option value="">Select department</option>
                          {departments.map((dept) => (
                            <option key={dept._id} value={dept._id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-sky-400" />
                          Category *
                        </label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          required
                          disabled={!formDepartment}
                          className="select select-sm w-full bg-[#100722] border border-white/15 text-slate-200 focus:border-amber-400 focus:outline-none rounded-xl text-xs disabled:opacity-50"
                        >
                          <option value="">
                            {formDepartment
                              ? "Select category"
                              : "First select department"}
                          </option>
                          {filteredCategories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Feature Bullets Manager */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                        <span>Bullet Features</span>
                        <span className="text-[10px] text-slate-400">
                          {formFeatures.length} added
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddFeature();
                            }
                          }}
                          placeholder="Type feature bullet and press Add"
                          className="input input-sm flex-1 bg-[#100722] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs"
                        />
                        <button
                          type="button"
                          onClick={handleAddFeature}
                          className="btn btn-sm bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {formFeatures.length > 0 && (
                        <div className="space-y-1 max-h-32 overflow-y-auto pt-1">
                          {formFeatures.map((feat, idx) => (
                            <div
                              key={idx}
                              className="p-1.5 px-2.5 rounded-lg bg-[#100722]/80 border border-white/10 flex items-center justify-between gap-2 text-xs"
                            >
                              <span className="text-slate-300 truncate">
                                • {feat}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFeature(idx)}
                                className="text-slate-400 hover:text-rose-400 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tags Manager */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                        <span>Discovery Tags</span>
                        <span className="text-[10px] text-slate-400">
                          {formTags.length} tags
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          placeholder="Type tag and press Add"
                          className="input input-sm flex-1 bg-[#100722] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="btn btn-sm bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {formTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {formTags.map((t, idx) => (
                            <span
                              key={idx}
                              className="badge badge-sm bg-white/5 border border-white/15 text-slate-200 gap-1 text-[11px] py-1"
                            >
                              #{t}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(idx)}
                                className="hover:text-rose-400 cursor-pointer ml-0.5"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Product Image Attachment Preview */}
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {formImagePreview ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-400/40 bg-black/40 shrink-0">
                            <img
                              src={formImagePreview}
                              alt="Catalog thumbnail"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-slate-500 shrink-0">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-white">
                            {formImage ? "Attached Product Photo" : "No Photo Attached"}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {formImage
                              ? `${formImage.name} (${(formImage.size / 1024).toFixed(0)} KB)`
                              : "Photo uploaded in AI vision will attach automatically"}
                          </div>
                        </div>
                      </div>
                      <label className="btn btn-xs bg-white/10 hover:bg-white/20 text-white rounded-lg cursor-pointer">
                        <span>{formImage ? "Change" : "Browse"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormImage(file);
                              setFormImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Best Seller Toggle */}
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <div>
                          <div className="text-xs font-bold text-white">
                            Mark as Best Seller
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Feature this listing prominently across recommendations
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isBestSeller}
                        onChange={(e) => setIsBestSeller(e.target.checked)}
                        className="toggle toggle-warning toggle-sm"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isCreating}
                        className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
                      >
                        {isCreating ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                            <span>Creating Product Listing...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-slate-950" />
                            <span>Create Product in Catalog</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#120824] flex items-center justify-between relative z-20 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline text-[11px]">
              AI Content Studio directly connects to the catalog • Review AI content or copy/paste into the create form.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-ghost font-bold text-slate-400 hover:text-white rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiProductContentModal;
export { AiProductContentModal as CreateProductModal };
