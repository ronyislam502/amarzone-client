"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Star,
  CheckCircle2,
  AlertCircle,
  Building2,
  Layers,
  Tag,
  Package,
  Boxes,
  Flame,
  X,
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

  // Aggregate images from variants
  const allImages = (product.variants || []).reduce<string[]>((acc, v) => {
    if (v.thumbnail && !acc.includes(v.thumbnail)) acc.push(v.thumbnail);
    if (v.images && Array.isArray(v.images)) {
      v.images.forEach((img) => {
        if (img && !acc.includes(img)) acc.push(img);
      });
    }
    return acc;
  }, []);

  const activeImage = selectedImage || allImages[0] || "";

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box max-w-4xl max-h-[90vh] p-6 bg-base-100 border border-base-200 shadow-2xl relative overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-wrap items-center gap-2 mb-4 border-b border-base-200 pb-4 pr-10">
          <div className="badge badge-primary gap-1 font-bold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Product Overview</span>
          </div>
          {product.isBestSeller && (
            <span className="badge badge-warning gap-1 font-black">
              <Flame className="w-3 h-3 fill-warning text-warning" />
              Best Seller
            </span>
          )}
        </div>

        {/* Product Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Gallery Column (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="w-full h-64 rounded-2xl bg-base-200/60 border border-base-300 flex items-center justify-center overflow-hidden relative">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.title}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-base-content/40">
                  <Package className="w-12 h-12 mb-2" />
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
                    className={`w-14 h-14 rounded-lg border-2 p-1 shrink-0 overflow-hidden cursor-pointer transition-all ${
                      activeImage === img
                        ? "border-primary shadow-sm"
                        : "border-base-300 hover:border-primary/50 opacity-70"
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

            {/* Quick Pricing & Rating Card */}
            <div className="card bg-base-200/50 border border-base-300 p-4 rounded-xl space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-extrabold uppercase text-base-content/60">
                  Starting Price
                </span>
                <span className="text-2xl font-black text-success">
                  ${product.minPrice?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-base-300">
                <span className="font-bold text-base-content/70">Rating:</span>
                <div className="flex items-center gap-1 font-black text-warning">
                  <Star className="w-3.5 h-3.5 fill-warning" />
                  <span>{product.averageRating?.toFixed(1) || "5.0"}</span>
                  <span className="text-base-content/50 font-normal">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Column (7 cols) */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-primary mb-1">
                {product.brand || "Brand Unassigned"}
              </div>
              <h2 className="text-xl font-black tracking-tight text-base-content leading-snug">
                {product.title}
              </h2>
            </div>

            {/* Department & Category Meta */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="badge badge-outline gap-1 font-semibold text-xs">
                <Building2 className="w-3 h-3 text-warning" />
                <span>{product.department?.name || "General"}</span>
              </div>
              <div className="badge badge-outline gap-1 font-semibold text-xs">
                <Layers className="w-3 h-3 text-info" />
                <span>{product.category?.name || "Uncategorized"}</span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-base-content/70">
                  Description
                </h4>
                <p className="text-xs text-base-content/80 leading-relaxed bg-base-200/40 p-3 rounded-xl border border-base-200">
                  {product.description}
                </p>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-base-content/70">
                  Key Features
                </h4>
                <ul className="space-y-1 text-xs text-base-content/80 list-disc list-inside">
                  {product.features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variants Preview */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                  <Boxes className="w-3.5 h-3.5 text-primary" />
                  <span>SKU & Variants ({product.variants.length})</span>
                </h4>
                <div className="max-h-36 overflow-y-auto space-y-1.5">
                  {product.variants.map((v, i) => (
                    <div
                      key={v._id || i}
                      className="flex items-center justify-between p-2 rounded-lg bg-base-200/50 border border-base-200 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {v.thumbnail && (
                          <img
                            src={v.thumbnail}
                            alt="thumb"
                            className="w-7 h-7 rounded object-contain bg-white"
                          />
                        )}
                        <div>
                          <span className="font-bold">SKU: {v.sku || "N/A"}</span>
                          {v.asin && (
                            <span className="text-[10px] text-base-content/60 ml-2">
                              ASIN: {v.asin}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {v.attributes?.map((attr, aIdx) => (
                          <span
                            key={aIdx}
                            className="badge badge-neutral badge-xs font-semibold"
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
                <h4 className="text-xs font-black uppercase tracking-wider text-base-content/70 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Tags
                </h4>
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="badge badge-sm badge-ghost text-[10px] font-bold"
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
        <div className="modal-action border-t border-base-200 pt-4 mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-outline font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
