"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Package,
  Sparkles,
  Send,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-toastify";
import { useCreateProductReviewMutation } from "@/src/redux/features/review/reviewApi";
import { TOrder } from "@/src/types/order";
import Modal from "@/src/components/ui/shared/Modal";

export interface CreateProductReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: TOrder | any | null;
  initialProductId?: string; // Optional variant ID to pre-select
  onSuccess?: () => void;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: "1 Star - Poor quality / Disappointed",
  2: "2 Stars - Fair / Below expectations",
  3: "3 Stars - Good / Average experience",
  4: "4 Stars - Very Good / Satisfied",
  5: "5 Stars - Excellent / Highly recommended!",
};

export const CreateProductReviewModal: React.FC<CreateProductReviewModalProps> = ({
  isOpen,
  onClose,
  order,
  initialProductId,
  onSuccess,
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [review, setReview] = useState<string>("");

  const [createProductReview, { isLoading: isSubmitting }] =
    useCreateProductReviewMutation();

  const productsList = order?.products || [];

  // Initialize selected product variant
  useEffect(() => {
    if (initialProductId) {
      setSelectedVariantId(initialProductId);
    } else if (productsList.length > 0) {
      const firstVariant = productsList[0]?.variant;
      const id = typeof firstVariant === "object" ? firstVariant?._id : firstVariant;
      setSelectedVariantId(id ? String(id) : "");
    }
  }, [order, initialProductId]);

  // Find currently selected product item
  const currentItem = productsList.find((item: any) => {
    const vId = typeof item.variant === "object" ? item.variant?._id : item.variant;
    return String(vId) === selectedVariantId;
  }) || productsList[0];

  const variantObj = typeof currentItem?.variant === "object" ? currentItem?.variant : null;
  const productObj = variantObj?.product || currentItem?.product;
  const prodTitle =
    productObj?.title ||
    (variantObj?.sku ? `Variant ${variantObj.sku}` : currentItem?.title || "Purchased Product");
  const prodThumb = productObj?.thumbnail || variantObj?.thumbnail || null;
  const prodPrice = currentItem?.price || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order?._id && !order?.id) {
      toast.error("Order ID not found");
      return;
    }

    if (!selectedVariantId) {
      toast.error("Please select a product to review");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a star rating between 1 and 5");
      return;
    }

    if (review.trim().length < 10) {
      toast.error("Please write at least 10 characters in your review");
      return;
    }

    const orderId = order._id || order.id;

    try {
      await createProductReview({
        order: orderId,
        product: selectedVariantId,
        rating,
        title: title.trim() || undefined,
        review: review.trim(),
      }).unwrap();

      toast.success("Thank you! Your product review was submitted successfully.", {
        position: "top-right",
        autoClose: 3500,
      });

      // Reset form
      setTitle("");
      setReview("");
      setRating(5);

      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to submit product review"
      );
    }
  };

  if (!isOpen || !order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      className="!bg-[#170d2f] !border-white/10 text-slate-100 shadow-2xl relative overflow-hidden rounded-3xl"
    >
      <div className="w-full max-w-lg mx-auto text-slate-100 p-1">
        {/* Header */}
        <div className="mb-5 text-left">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="badge badge-warning gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-400/20 border-amber-400/30 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Purchase Review</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Order #{order.orderNo || String(order._id || order.id).slice(-8)}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400 shrink-0" />
            <span>Rate & Review Product</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Share your experience with this product to help fellow shoppers on Amarzone.
          </p>
        </div>

        {/* Multi-product selector (if order has > 1 product) */}
        {productsList.length > 1 && (
          <div className="mb-4">
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Select item to review:
            </label>
            <div className="flex flex-wrap gap-2">
              {productsList.map((item: any, idx: number) => {
                const v = typeof item.variant === "object" ? item.variant : null;
                const p = v?.product || item.product;
                const vId = String(v?._id || item.variant || idx);
                const name = p?.title || v?.sku || `Item #${idx + 1}`;
                const isSelected = vId === selectedVariantId;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedVariantId(vId)}
                    className={`text-xs px-2.5 py-1 rounded-xl border transition-all cursor-pointer truncate max-w-[200px] ${
                      isSelected
                        ? "bg-amber-400/20 border-amber-400 text-amber-300 font-bold"
                        : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Product Card */}
        <div className="p-3.5 rounded-2xl bg-[#120824] border border-white/10 mb-5 flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-slate-900 border border-white/15 overflow-hidden shrink-0 flex items-center justify-center">
            {prodThumb ? (
              <img src={prodThumb} alt={prodTitle} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-6 h-6 text-slate-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate" title={prodTitle}>
              {prodTitle}
            </div>
            {variantObj?.sku && (
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                SKU: {variantObj.sku}
              </div>
            )}
            <div className="text-[11px] text-emerald-400 font-mono font-bold mt-1">
              ${Number(prodPrice).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating Selector */}
          <div className="form-control w-full space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Overall Rating *</span>
              <span className="text-[11px] font-medium text-amber-300">
                {RATING_DESCRIPTIONS[hoverRating || rating]}
              </span>
            </label>

            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#120824] border border-white/10 justify-center">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1.5 text-amber-400 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                    title={`${star} Star`}
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        isFilled
                          ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                          : "text-slate-600 hover:text-amber-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Title */}
          <div className="form-control w-full space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Review Headline / Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Exceeded expectations, great build quality!"
              maxLength={100}
              className="input input-bordered w-full bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 text-xs rounded-xl"
            />
          </div>

          {/* Review Description */}
          <div className="form-control w-full space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                Your Review / Experience *
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {review.length} chars (min. 10)
              </span>
            </div>

            <textarea
              required
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What did you like or dislike about this product? How was the performance and quality?"
              className="textarea textarea-bordered w-full bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 text-xs rounded-xl"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost flex-1 text-slate-300 hover:text-white border border-white/10 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || review.trim().length < 10}
              className="btn flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black border-none rounded-xl cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateProductReviewModal;
