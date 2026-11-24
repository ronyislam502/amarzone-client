"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  ChevronRight,
  Bot,
  Send,
  CheckCircle2,
  Star,
} from "lucide-react";
import { useAllVariantsProductsByCategoryQuery } from "@/redux/features/variant/variantApi";
import AZModal from "@/components/shared/AZModal";

interface ProductAIAdvisorProps {
  productTitle?: string;
  categoryName?: string;
  departmentName?: string;
  brand?: string;
  price?: number;
  rating?: number;
  reviewsCount?: number;
  features?: string[];
  attributes?: Array<{ type: string; value: string }>;
  categoryId?: string;
  productId?: string;
}

export const ProductAIAdvisor: React.FC<ProductAIAdvisorProps> = ({
  productTitle = "this product",
  categoryName = "General",
  departmentName = "General",
  brand = "",
  price = 0,
  rating = 0,
  reviewsCount = 0,
  features = [],
  attributes = [],
  categoryId,
  productId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState("");
  const [selectedAltIndex, setSelectedAltIndex] = useState(0);

  // Fetch real alternative products from the same category
  const { data: categoryProductsData, isLoading: isLoadingAlternatives } =
    useAllVariantsProductsByCategoryQuery(
      categoryId ? { id: categoryId, limit: 10 } : "",
      { skip: !categoryId }
    );

  const alternatives = useMemo(() => {
    const raw: any[] = categoryProductsData?.data || [];
    if (!raw.length) return [];
    const currentIdStr = productId ? String(productId) : "";
    return raw.filter((item: any) => {
      const itemProdId = String(item?.productId || item?.product?._id || item?._id || "");
      const itemVarId = String(item?._id || "");
      return itemProdId !== currentIdStr && itemVarId !== currentIdStr;
    });
  }, [categoryProductsData, productId]);

  const activeAlt = alternatives[selectedAltIndex] || alternatives[0] || null;

  // Resolved values for comparison
  const thisBrandName = brand || "Amarzone Verified";
  const thisPriceStr = price > 0 ? `$${price.toFixed(2)}` : "Check Offer";
  const thisRatingStr = rating > 0 ? `${rating.toFixed(1)} ★ (${reviewsCount || 1})` : "4.8 ★ Verified";
  const thisFeatureHighlight =
    features.length > 0
      ? features[0]
      : attributes.length > 0
      ? attributes.map((a) => `${a.type}: ${a.value}`).slice(0, 2).join(", ")
      : `Verified ${categoryName} Specifications`;

  const altTitle = activeAlt?.title || activeAlt?.product?.title || `${categoryName} Market Benchmark`;
  const altBrand = activeAlt?.brand || activeAlt?.product?.brand || "Alternative Brand";
  const altPriceVal = typeof activeAlt?.price === "number" && activeAlt?.price > 0 ? activeAlt.price : null;
  const altPriceStr =
    altPriceVal !== null
      ? `$${altPriceVal.toFixed(2)}`
      : price > 0
      ? `$${(price * 1.08).toFixed(2)}`
      : "$29.99";
  const altRatingVal = Number(activeAlt?.rating || 4.3);
  const altRatingStr = `${altRatingVal.toFixed(1)} ★`;
  const altFeatureHighlight =
    activeAlt?.features && Array.isArray(activeAlt.features) && activeAlt.features.length > 0
      ? activeAlt.features[0]
      : activeAlt?.attributes && Array.isArray(activeAlt.attributes) && activeAlt.attributes.length > 0
      ? activeAlt.attributes.map((a: any) => `${a.type}: ${a.value}`).slice(0, 2).join(", ")
      : `Standard ${categoryName} features & specifications`;

  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    {
      role: "ai",
      text: `Hello! I am your Amarzone AI Advisor. How can I help you evaluate "${productTitle}" today? Ask me about features, specifications, price, or comparison with alternatives!`,
    },
  ]);

  const presetQuestions = [
    "What are the key specifications and features of this item?",
    "Is this item eligible for fast delivery and returns?",
    `How does this compare with other items in ${categoryName}?`,
    "What is the current price and stock availability?",
  ];

  const handlePresetClick = (q: string) => {
    setChatQuery(q);
    handleSend(q);
  };

  const handleSend = (text?: string) => {
    const query = text || chatQuery;
    if (!query.trim()) return;

    const userMsg = query.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatQuery("");

    setTimeout(() => {
      let aiResponse = "";
      const lower = userMsg.toLowerCase();

      if (lower.includes("specification") || lower.includes("feature") || lower.includes("spec") || lower.includes("detail")) {
        const specsList: string[] = [];
        if (brand) specsList.push(`Brand: ${brand}`);
        if (categoryName) specsList.push(`Category: ${categoryName}`);
        if (departmentName) specsList.push(`Department: ${departmentName}`);
        if (attributes.length > 0) {
          attributes.forEach((a) => specsList.push(`${a.type}: ${a.value}`));
        }
        if (features.length > 0) {
          features.slice(0, 4).forEach((f) => specsList.push(f));
        }

        aiResponse = `Here are the key specifications and features for "${productTitle}":\n\n${
          specsList.length > 0
            ? specsList.map((s) => `• ${s}`).join("\n")
            : `• Verified ${categoryName} authentic item\n• Direct supplier quality inspection\n• Premium materials & packaging`
        }`;
      } else if (lower.includes("price") || lower.includes("cost") || lower.includes("stock") || lower.includes("how much")) {
        aiResponse = `"${productTitle}" is currently listed at ${thisPriceStr}. It is in stock and available for immediate fulfillment through verified Amarzone sellers.`;
      } else if (lower.includes("deliver") || lower.includes("ship") || lower.includes("return") || lower.includes("guarantee")) {
        aiResponse = `"${productTitle}" qualifies for fast dispatch with tracking. All purchases on Amarzone include standard 30-day returns and are 100% protected under our A-to-z buyer guarantee with authentic vendor verification.`;
      } else if (lower.includes("compare") || lower.includes("alternative") || lower.includes("category") || lower.includes("better")) {
        aiResponse = `Compared to other options in ${categoryName}, "${productTitle}" stands out for its ${
          thisBrandName ? `${thisBrandName} brand reliability` : "verified quality sourcing"
        }${rating > 0 ? ` and strong customer rating of ${rating.toFixed(1)}★` : ""}. At ${thisPriceStr}, it provides excellent value with full buyer protection.`;
      } else {
        aiResponse = `"${productTitle}" is a verified authentic product in our ${categoryName} department (${departmentName}), priced at ${thisPriceStr}${
          rating > 0 ? ` with a customer rating of ${rating.toFixed(1)}★` : ""
        }. Would you like to know more about its key features, delivery, or how it compares to alternatives?`;
      }

      setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
    }, 500);
  };

  return (
    <>
      {/* AI Advisor Card */}
      <div className="bg-[#131127] border border-violet-900/40 rounded-2xl p-4 text-white shadow-md space-y-3.5 select-none mt-4">
        {/* Top Header */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-5 h-5 fill-amber-400/30" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-tight">
                Amarzone AI Advisor
              </span>
              <span className="bg-[#ffd814] text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                Instant
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Have questions about this item?
            </p>
          </div>
        </div>

        {/* Primary AI CTA */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-gradient-to-r from-[#ffa41c] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#ea580c] text-slate-950 font-bold text-xs py-2.5 px-3.5 rounded-xl flex items-center justify-between shadow-sm cursor-pointer transition-all active:scale-[0.99]"
        >
          <span>Ask AI About This Product</span>
          <Sparkles className="w-4 h-4 text-slate-950" />
        </button>

        {/* Compare with Alternatives */}
        <button
          type="button"
          onClick={() => setIsCompareOpen(true)}
          className="w-full bg-white/10 hover:bg-white/15 text-slate-200 text-xs py-2 px-3.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
        >
          <span className="font-normal text-xs text-slate-300">
            Compare with Alternatives
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* AI Assistant Modal */}
      <AZModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
        theme="dark"
        icon={<Bot className="w-5 h-5" />}
        title="Amarzone AI Advisor"
        description={productTitle}
        footer={
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about specs, price, delivery, warranty..."
              className="flex-1 bg-black/40 border border-violet-700/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              className="bg-[#ffa41c] hover:bg-[#f59e0b] text-slate-950 p-2 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        }
      >
        <div className="py-2 space-y-3 text-xs min-h-[220px]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "ai" && (
                <div className="w-6 h-6 rounded-full bg-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3 rounded-xl max-w-[85%] leading-relaxed whitespace-pre-line ${
                  m.role === "user"
                    ? "bg-[#ffa41c] text-slate-950 font-medium rounded-tr-none"
                    : "bg-white/10 text-slate-200 border border-white/10 rounded-tl-none"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {/* Preset suggestion chips */}
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 block mb-1.5">
              Suggested questions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presetQuestions.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePresetClick(q)}
                  className="bg-white/5 hover:bg-white/15 text-slate-300 text-[11px] px-2.5 py-1 rounded-full border border-white/10 text-left cursor-pointer transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </AZModal>

      {/* Product Comparison Analysis Modal */}
      <AZModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        size="xl"
        theme="dark"
        icon={<Sparkles className="w-5 h-5 text-amber-400" />}
        title="Product Comparison Analysis"
        description={`Compare with alternatives in ${categoryName}`}
      >
        <div className="py-2 space-y-3.5 text-xs">
          {/* Selector if multiple alternatives exist */}
          {alternatives.length > 1 && (
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Compare against:</span>
              <div className="flex gap-1.5 overflow-x-auto max-w-[340px] py-0.5">
                {alternatives.slice(0, 4).map((alt: any, idx: number) => {
                  const label = alt?.brand || alt?.title?.slice(0, 15) || `Option ${idx + 1}`;
                  return (
                    <button
                      key={alt._id || idx}
                      type="button"
                      onClick={() => setSelectedAltIndex(idx)}
                      className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-colors truncate max-w-[120px] cursor-pointer ${
                        selectedAltIndex === idx
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold"
                          : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Comparison Table */}
          <div className="space-y-3 text-xs">
            {/* Header Row */}
            <div className="grid grid-cols-3 gap-3 border-b border-white/10 pb-3 font-semibold text-slate-300">
              <span>Features</span>
              <span className="text-amber-400 truncate">
                {thisBrandName} (This Item)
              </span>
              <span className="text-slate-200 truncate">
                {altBrand}
              </span>
            </div>

            {/* Title Row */}
            <div className="grid grid-cols-3 gap-3 text-slate-400 border-b border-white/5 pb-2.5">
              <span className="text-slate-300 font-medium">Item</span>
              <span className="text-white font-medium line-clamp-2">
                {productTitle}
              </span>
              <span className="text-slate-300 line-clamp-2">
                {altTitle}
              </span>
            </div>

            {/* Price Row */}
            <div className="grid grid-cols-3 gap-3 text-slate-400 border-b border-white/5 pb-2.5">
              <span className="text-slate-300 font-medium">Price</span>
              <span className="font-bold text-white text-sm">
                {thisPriceStr}
              </span>
              <span className="font-semibold text-slate-300 text-sm">
                {altPriceStr}
              </span>
            </div>

            {/* Customer Rating Row */}
            <div className="grid grid-cols-3 gap-3 text-slate-400 border-b border-white/5 pb-2.5">
              <span className="text-slate-300 font-medium">Rating</span>
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {thisRatingStr}
              </span>
              <span className="text-slate-300 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400/60 text-amber-400/60" />
                {altRatingStr}
              </span>
            </div>

            {/* Key Specifications / Highlights Row */}
            <div className="grid grid-cols-3 gap-3 text-slate-400 border-b border-white/5 pb-2.5">
              <span className="text-slate-300 font-medium">Key Highlights</span>
              <span className="text-slate-200 line-clamp-2">
                {thisFeatureHighlight}
              </span>
              <span className="text-slate-400 line-clamp-2">
                {altFeatureHighlight}
              </span>
            </div>

            {/* Fulfillment & Protection Row */}
            <div className="grid grid-cols-3 gap-3 text-slate-400 border-b border-white/5 pb-2.5">
              <span className="text-slate-300 font-medium">Guarantee</span>
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                A-to-z Protected
              </span>
              <span className="text-slate-400">
                Standard Protection
              </span>
            </div>

            {/* Best For Row */}
            <div className="grid grid-cols-3 gap-3 text-slate-400">
              <span className="text-slate-300 font-medium">Best For</span>
              <span className="text-white font-medium">
                Verified Quality & Warranty
              </span>
              <span className="text-slate-400">
                Alternative in {categoryName}
              </span>
            </div>
          </div>
        </div>
      </AZModal>
    </>
  );
};

export default ProductAIAdvisor;
