"use client";

import React, { useState, useEffect } from "react";
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
  Send,
  Zap,
  ArrowRight,
  Info,
  Sliders,
} from "lucide-react";
import {
  useGenerateProductContentMutation,
  TProductContentOutput,
} from "@/redux/features/ai/aiApi";
import { useAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { TCategory } from "@/src/types/category";
import { toast } from "react-toastify";

export interface AiProductContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: {
    title?: string;
    category?: string;
    brand?: string;
    features?: string[] | string;
    keywords?: string[];
  };
  onApply?: (content: TProductContentOutput) => void;
  onCreateWithContent?: (
    content: TProductContentOutput,
    seed: { category?: string; brand?: string }
  ) => void;
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
  initialValues,
  onApply,
  onCreateWithContent,
}) => {
  // Input fields state
  const [title, setTitle] = useState(initialValues?.title || "");
  const [category, setCategory] = useState(initialValues?.category || "");
  const [brand, setBrand] = useState(initialValues?.brand || "");
  const [featuresText, setFeaturesText] = useState(
    Array.isArray(initialValues?.features)
      ? initialValues.features.join("\n")
      : initialValues?.features || ""
  );
  const [tone, setTone] = useState("professional");
  const [targetAudience, setTargetAudience] = useState("");
  const [keywordsText, setKeywordsText] = useState(
    (initialValues?.keywords || []).join(", ")
  );

  // Result state
  const [generatedResult, setGeneratedResult] =
    useState<TProductContentOutput | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "descriptions" | "features" | "seo">("overview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // RTK Query hooks
  const [generateProductContent, { isLoading: isGenerating }] =
    useGenerateProductContentMutation();
  const { data: categoriesData } = useAllCategoriesQuery({ limit: 0 });
  const categories: TCategory[] = categoriesData?.data || [];

  // Synchronize when initial values change
  useEffect(() => {
    if (initialValues) {
      if (initialValues.title !== undefined) setTitle(initialValues.title);
      if (initialValues.category !== undefined) setCategory(initialValues.category);
      if (initialValues.brand !== undefined) setBrand(initialValues.brand);
      if (initialValues.features !== undefined) {
        setFeaturesText(
          Array.isArray(initialValues.features)
            ? initialValues.features.join("\n")
            : initialValues.features
        );
      }
      if (initialValues.keywords !== undefined) {
        setKeywordsText(initialValues.keywords.join(", "));
      }
    }
  }, [initialValues, isOpen]);

  // When generatedResult is updated, initialize selected features & tags
  useEffect(() => {
    if (generatedResult) {
      setSelectedFeatures(generatedResult.bulletFeatures || []);
      setSelectedTags(generatedResult.tags || []);
    }
  }, [generatedResult]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!", { autoClose: 1200 });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleFeature = (feat: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  const handleToggleTag = (t: string) => {
    setSelectedTags((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a product title or working concept name");
      return;
    }
    if (!brand.trim()) {
      toast.error("Please provide a brand name");
      return;
    }

    const resolvedCategory =
      category.trim() ||
      (categories.length > 0 ? categories[0].name : "General");

    const splitFeatures = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const splitKeywords = keywordsText
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      category: resolvedCategory,
      brand: brand.trim(),
      features: splitFeatures.length > 0 ? splitFeatures : [title.trim()],
      targetAudience: targetAudience.trim() || undefined,
      tone,
      keywords: splitKeywords.length > 0 ? splitKeywords : undefined,
    };

    try {
      const response = await generateProductContent(payload).unwrap();
      if (response?.data) {
        setGeneratedResult(response.data);
        toast.success("AI product content synthesized successfully!");
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to generate AI content"
      );
    }
  };

  const handleApplyAll = () => {
    if (!generatedResult) return;
    const finalContent: TProductContentOutput = {
      ...generatedResult,
      bulletFeatures: selectedFeatures,
      tags: selectedTags,
    };

    if (onApply) {
      onApply(finalContent);
      toast.success("AI content applied directly to form!");
      onClose();
    } else if (onCreateWithContent) {
      onCreateWithContent(finalContent, {
        category,
        brand,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#140b2b] border border-amber-400/20 w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col relative text-slate-100">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent pointer-events-none z-30" />

        {/* Ambient background glow orbs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-amber-500/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-tl from-indigo-600/25 to-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between relative z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  AI Product <span className="text-amber-400">Content Studio</span>
                </h2>
                <span className="badge badge-warning text-[10px] font-black uppercase tracking-wider py-1 px-2 text-slate-950 shadow">
                  GPT-4o Engine
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Generate conversion-ready SEO titles, bullet features, marketing copy, and discovery tags.
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

        {/* Modal Main Body: 2 Columns */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          {/* Left Column: Input Parameter Generator (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-[#190f36]/80 border border-white/10 shadow-inner space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  Listing Parameters
                </span>
                <span className="text-[11px] text-slate-400">
                  Seed information
                </span>
              </div>

              <form onSubmit={handleGenerate} className="space-y-3.5">
                {/* Product Title / Concept */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>Product Working Title / Concept *</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                    required
                    className="input input-sm w-full bg-[#100722] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs"
                  />
                </div>

                {/* Brand & Category in 2 cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-amber-400" />
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. Sony"
                      required
                      className="input input-sm w-full bg-[#100722] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-sky-400" />
                      Category
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Electronics, Audio"
                      list="categories-datalist"
                      className="input input-sm w-full bg-[#100722] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs"
                    />
                    <datalist id="categories-datalist">
                      {categories.map((c) => (
                        <option key={c._id} value={c.name} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Seed Features / Specifications */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <ListCheck className="w-3 h-3 text-emerald-400" />
                      Raw Specs or Seed Features (1 per line)
                    </span>
                    <span className="text-[10px] text-slate-400">Optional</span>
                  </label>
                  <textarea
                    rows={3}
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    placeholder="e.g.&#10;Industry-leading noise cancellation&#10;30-hour battery life with quick charge&#10;Multipoint Bluetooth connection"
                    className="textarea textarea-sm w-full bg-[#100722] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs leading-relaxed"
                  />
                </div>

                {/* Tone of Voice */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200">
                    Tone of Voice
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTone(t.id)}
                        className={`text-[11px] font-semibold py-1 px-2.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                          tone === t.id
                            ? "bg-amber-400 text-slate-950 border-amber-400 shadow-sm"
                            : "bg-[#100722] text-slate-300 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Audience & Keywords */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. Remote workers, commuters, music enthusiasts"
                    className="input input-sm w-full bg-[#100722] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-sky-400" />
                      Seed Keywords (comma-separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={keywordsText}
                    onChange={(e) => setKeywordsText(e.target.value)}
                    placeholder="e.g. noise cancelling, bluetooth, hi-res audio"
                    className="input input-sm w-full bg-[#100722] border border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none rounded-xl text-xs"
                  />
                </div>

                {/* Generate Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-[0.98] shadow-lg shadow-amber-500/20 disabled:opacity-60 cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Synthesizing Copy...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 text-slate-950" />
                        <span>Generate Product Content</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Interactive AI Output & Review (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 rounded-2xl bg-[#190f36]/50 border border-white/10 min-h-[360px] text-center">
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 animate-ping opacity-25" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-base font-black text-white">
                  Synthesizing High-Conversion Copy
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                  Analyzing e-commerce keywords, crafting punchy feature bullets, and optimizing search metadata...
                </p>
                <div className="flex items-center gap-2 mt-4 text-[11px] text-amber-400 font-bold bg-amber-400/10 py-1.5 px-3 rounded-full border border-amber-400/20">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Generating SEO title, tags &amp; descriptions</span>
                </div>
              </div>
            ) : generatedResult ? (
              <div className="flex-1 flex flex-col space-y-4">
                {/* Result Tabs & Quick Actions */}
                <div className="p-3.5 rounded-2xl bg-[#190f36]/80 border border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 bg-[#100722] p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setActiveTab("overview")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "overview"
                          ? "bg-amber-400 text-slate-950 shadow-sm"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("features")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "features"
                          ? "bg-amber-400 text-slate-950 shadow-sm"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      Features ({selectedFeatures.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("descriptions")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "descriptions"
                          ? "bg-amber-400 text-slate-950 shadow-sm"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("seo")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === "seo"
                          ? "bg-amber-400 text-slate-950 shadow-sm"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      SERP Preview
                    </button>
                  </div>

                  {/* Apply All Action Button */}
                  <button
                    type="button"
                    onClick={handleApplyAll}
                    className="btn btn-sm gap-2 font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 border-0 rounded-xl shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Apply to Listing</span>
                  </button>
                </div>

                {/* Tab 1: Overview */}
                {activeTab === "overview" && (
                  <div className="space-y-4 overflow-y-auto pr-1">
                    {/* SEO Title Card */}
                    <div className="p-4 rounded-2xl bg-[#190f36]/70 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          Recommended SEO Title
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">
                            {generatedResult.seoTitle.length} chars
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(generatedResult.seoTitle, "seoTitle")
                            }
                            className="btn btn-ghost btn-xs text-slate-300 hover:text-white"
                          >
                            {copiedKey === "seoTitle" ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-white leading-snug">
                        {generatedResult.seoTitle}
                      </p>
                    </div>

                    {/* Short Description */}
                    <div className="p-4 rounded-2xl bg-[#190f36]/70 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          Short Hook / Summary
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              generatedResult.shortDescription,
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
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {generatedResult.shortDescription}
                      </p>
                    </div>

                    {/* Bullet Features Snapshot */}
                    <div className="p-4 rounded-2xl bg-[#190f36]/70 border border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <ListCheck className="w-3.5 h-3.5" />
                          Core Value Propositions ({selectedFeatures.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveTab("features")}
                          className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <span>Manage items</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      <ul className="space-y-1.5">
                        {selectedFeatures.slice(0, 4).map((feat, i) => (
                          <li
                            key={i}
                            className="text-xs text-slate-200 flex items-start gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tags & Keywords Preview */}
                    <div className="p-4 rounded-2xl bg-[#190f36]/70 border border-white/10 space-y-2">
                      <span className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        Discovery Tags &amp; Keywords
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedTags.map((t, idx) => (
                          <span
                            key={idx}
                            className="badge badge-sm bg-amber-400/10 text-amber-400 border border-amber-400/30 font-bold text-[11px] py-2 px-2"
                          >
                            #{t}
                          </span>
                        ))}
                        {(generatedResult.keywords || []).map((kw, idx) => (
                          <span
                            key={`kw-${idx}`}
                            className="badge badge-sm bg-sky-400/10 text-sky-400 border border-sky-400/30 font-medium text-[11px] py-2 px-2"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Features Manager */}
                {activeTab === "features" && (
                  <div className="space-y-3 overflow-y-auto pr-1">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs text-slate-400">
                        Check or uncheck items to include in the product listing:
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedFeatures(
                            selectedFeatures.length ===
                              generatedResult.bulletFeatures.length
                              ? []
                              : generatedResult.bulletFeatures
                          )
                        }
                        className="text-[11px] font-bold text-amber-400 hover:underline"
                      >
                        {selectedFeatures.length ===
                        generatedResult.bulletFeatures.length
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    </div>

                    <div className="space-y-2">
                      {generatedResult.bulletFeatures.map((feat, idx) => {
                        const isChecked = selectedFeatures.includes(feat);
                        return (
                          <div
                            key={idx}
                            onClick={() => handleToggleFeature(feat)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                              isChecked
                                ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                                : "bg-[#100722]/60 border-white/10 text-slate-400 hover:border-white/20"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleFeature(feat)}
                              className="checkbox checkbox-xs checkbox-warning mt-0.5 shrink-0"
                            />
                            <span className="text-xs leading-relaxed flex-1">
                              {feat}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(feat, `feat-${idx}`);
                              }}
                              className="btn btn-ghost btn-xs text-slate-400 hover:text-white"
                            >
                              {copiedKey === `feat-${idx}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 3: Detailed Descriptions */}
                {activeTab === "descriptions" && (
                  <div className="space-y-4 overflow-y-auto pr-1">
                    {/* Short Description */}
                    <div className="p-4 rounded-2xl bg-[#190f36]/70 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-sky-400">
                          Short Hook / Summary (Teaser)
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              generatedResult.shortDescription,
                              "shortDescTab"
                            )
                          }
                          className="btn btn-ghost btn-xs text-slate-300 hover:text-white gap-1"
                        >
                          {copiedKey === "shortDescTab" ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span className="text-[10px]">Copy</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {generatedResult.shortDescription}
                      </p>
                    </div>

                    {/* Long Description */}
                    <div className="p-4 rounded-2xl bg-[#190f36]/70 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                          Full Product Marketing Story (Long Description)
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              generatedResult.longDescription,
                              "longDescTab"
                            )
                          }
                          className="btn btn-ghost btn-xs text-slate-300 hover:text-white gap-1"
                        >
                          {copiedKey === "longDescTab" ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span className="text-[10px]">Copy</span>
                        </button>
                      </div>
                      <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-[#100722] p-3 rounded-xl border border-white/10">
                        {generatedResult.longDescription}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 4: SERP Search Engine Snippet Preview */}
                {activeTab === "seo" && (
                  <div className="space-y-4 overflow-y-auto pr-1">
                    <div className="p-4 rounded-2xl bg-[#190f36]/70 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5" />
                          Google SERP Result Preview
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                          SEO Optimized
                        </span>
                      </div>

                      {/* Google Search Card Simulation */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 font-sans">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-black text-slate-950">
                            A
                          </div>
                          <span className="text-slate-300 font-medium">Amarzone</span>
                          <span>›</span>
                          <span className="text-slate-400 truncate">
                            products › {title.toLowerCase().replace(/\s+/g, "-")}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer leading-snug">
                          {generatedResult.seoTitle}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                          {generatedResult.seoDescription}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-300">
                            Meta Description:
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                generatedResult.seoDescription,
                                "metaDesc"
                              )
                            }
                            className="btn btn-ghost btn-xs text-slate-300 hover:text-white"
                          >
                            {copiedKey === "metaDesc" ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 bg-[#100722] p-2.5 rounded-xl border border-white/10 leading-relaxed">
                          {generatedResult.seoDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty / Welcome State */
              <div className="flex-1 flex flex-col items-center justify-center p-8 rounded-2xl bg-[#190f36]/40 border border-dashed border-white/15 min-h-[360px] text-center">
                <div className="p-4 rounded-2xl bg-amber-400/10 text-amber-400 mb-4 border border-amber-400/20">
                  <Wand2 className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="text-base font-black text-white">
                  Intelligent Catalog Copywriter
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                  Enter a working title or rough specifications on the left, then click <strong className="text-amber-400">&ldquo;Generate Product Content&rdquo;</strong> to produce optimized titles, features, and discovery tags.
                </p>
                <div className="grid grid-cols-2 gap-2 mt-5 text-[11px] text-slate-300 max-w-sm w-full">
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Instant SEO Titles</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Rich Feature Bullets</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Search Discovery Tags</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>1-Click Form Auto-Fill</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#120824] flex items-center justify-between relative z-20 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">
              All generated copy is customizable and strictly governed before database insertion.
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-ghost font-bold text-slate-400 hover:text-white rounded-xl cursor-pointer"
            >
              Close
            </button>
            {generatedResult && (
              <button
                type="button"
                onClick={handleApplyAll}
                className="btn btn-sm gap-1.5 font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-0 rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply to Product</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiProductContentModal;
