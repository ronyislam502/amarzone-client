"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Building2,
  Layers,
  Tag,
  Package,
  Boxes,
  Flame,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { TProduct } from "@/src/types/product";

interface ProductDetailsModalProps {
  product: TProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailsModal = ({
  product,
  isOpen,
  onClose,
}: ProductDetailsModalProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  // Aggregate images from thumbnail and variants
  const allImages: string[] = [];
  if (product.thumbnail) allImages.push(product.thumbnail);

  (product.variants || []).forEach((v) => {
    if (v.thumbnail && !allImages.includes(v.thumbnail)) allImages.push(v.thumbnail);
    if (v.images && Array.isArray(v.images)) {
      v.images.forEach((img) => {
        if (img && !allImages.includes(img)) allImages.push(img);
      });
    }
  });

  const activeImage = selectedImage || allImages[0] || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#170d2f] border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative text-slate-100">
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

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-white/10 relative z-10 flex flex-wrap items-center gap-2 pr-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product Master Details</span>
          </div>
          {product.isBestSeller && (
            <span className="badge badge-sm bg-orange-500/20 border border-orange-500/40 text-orange-400 font-bold gap-1 py-2 px-2.5">
              <Flame className="w-3 h-3 fill-orange-400 text-orange-400" />
              Best Seller
            </span>
          )}
        </div>

        {/* Product Info Grid */}
        <div className="p-6 overflow-y-auto flex-1 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Gallery Column (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="w-full h-64 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center overflow-hidden relative">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.title}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <Package className="w-12 h-12 mb-2 text-slate-600" />
                  <span className="text-xs font-semibold">No Image Available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-xl border p-1 shrink-0 overflow-hidden cursor-pointer transition-all bg-white/[0.03] ${
                      activeImage === img
                        ? "border-amber-400 shadow-sm shadow-amber-400/20"
                        : "border-white/10 hover:border-white/30 opacity-70"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Author & Catalog Governance Metadata Card */}
            <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Author / Creator
                </span>
                <span className="badge badge-sm bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold">
                  {product.author?.role || "SUPER_ADMIN"}
                </span>
              </div>
              <div className="text-sm font-black text-white pl-5">
                {product.author?.name || "Super Admin"}
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                <span className="font-bold text-slate-300">Catalog Status:</span>
                {product.isDeleted ? (
                  <span className="badge badge-xs badge-error font-bold">Archived</span>
                ) : (
                  <span className="badge badge-xs badge-success font-bold gap-1 text-slate-950">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Active
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details Column (7 cols) */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-amber-400 mb-1">
                {product.brand || "Brand Unassigned"}
              </div>
              <h2 className="text-xl font-black tracking-tight text-white leading-snug">
                {product.title}
              </h2>
            </div>

            {/* Department & Category Meta */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="badge badge-sm py-2 px-2.5 bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold gap-1 rounded-lg">
                <Building2 className="w-3 h-3" />
                <span>{product.department?.name || "General"}</span>
              </div>
              <div className="badge badge-sm py-2 px-2.5 bg-sky-400/10 border border-sky-400/30 text-sky-400 font-bold gap-1 rounded-lg">
                <Layers className="w-3 h-3" />
                <span>{product.category?.name || "Uncategorized"}</span>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Key Features
                </h4>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside bg-white/[0.02] p-3.5 rounded-2xl border border-white/10">
                  {product.features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variants Preview (TVariants data: SKU, ASIN, Attributes, Private Label) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Boxes className="w-3.5 h-3.5 text-amber-400" />
                  <span>SKU &amp; Variants ({product.variants.length})</span>
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-1.5">
                  {product.variants.map((v, i) => (
                    <div
                      key={v._id || i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {v.thumbnail && (
                          <img
                            src={v.thumbnail}
                            alt="thumb"
                            className="w-8 h-8 rounded-lg object-contain bg-white/10 p-0.5 border border-white/15"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">SKU: {v.sku || "N/A"}</span>
                            {v.isPrivateLevel && (
                              <span className="badge badge-xs bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-[9px]">
                                Private Label
                              </span>
                            )}
                          </div>
                          {v.asin && (
                            <span className="text-[10px] text-slate-400 block font-mono">
                              ASIN: {v.asin}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        {v.attributes?.map((attr, aIdx) => (
                          <span
                            key={aIdx}
                            className="badge badge-xs bg-white/10 border border-white/15 text-slate-200 font-semibold px-2 py-1 rounded text-[10px]"
                          >
                            {attr.type}: {attr.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-amber-400" /> Discovery Tags
                </h4>
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="badge badge-xs py-1 px-2 text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-white/10 flex justify-end relative z-10">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-outline font-bold border-white/15 text-slate-300 hover:bg-white/10 rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
