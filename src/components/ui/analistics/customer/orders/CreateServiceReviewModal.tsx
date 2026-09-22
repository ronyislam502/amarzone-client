"use client";

import React, { useState } from "react";
import {
  Star,
  Sparkles,
  Send,
  Loader2,
  Store,
} from "lucide-react";
import { toast } from "react-toastify";
import { useCreateServiceReviewMutation } from "@/src/redux/features/review/reviewApi";
import { TOrder } from "@/src/types/order";
import Modal from "@/src/components/ui/shared/Modal";

export interface CreateServiceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: TOrder | any | null;
  onSuccess?: () => void;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: "1 Star - Poor service / Disappointed",
  2: "2 Stars - Fair / Below expectations",
  3: "3 Stars - Good / Average experience",
  4: "4 Stars - Very Good / Satisfied",
  5: "5 Stars - Excellent / Highly recommended!",
};

export const CreateServiceReviewModal: React.FC<CreateServiceReviewModalProps> = ({
  isOpen,
  onClose,
  order,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [review, setReview] = useState<string>("");

  const [createServiceReview, { isLoading: isSubmitting }] =
    useCreateServiceReviewMutation();

  const vendorObj = typeof order?.vendor === "object" ? order?.vendor : null;
  const vendorName = vendorObj?.name || "Amarzone Direct";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order?._id && !order?.id) {
      toast.error("Order ID not found");
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
    const customerId = typeof order.customer === "object" ? order.customer._id : order.customer;
    const vendorId = typeof order.vendor === "object" ? order.vendor._id : order.vendor;

    if (!customerId || !vendorId) {
      toast.error("Missing customer or vendor information");
      return;
    }

    try {
      await createServiceReview({
        order: orderId,
        customer: customerId,
        vendor: vendorId,
        rating,
        title: title.trim() || undefined,
        review: review.trim(),
      }).unwrap();

      toast.success("Thank you! Your service review was submitted successfully.", {
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
        err?.data?.message || err?.message || "Failed to submit service review"
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
            <div className="badge badge-warning gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-500/20 border-indigo-500/30 text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Service Review</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Order #{order.orderNo || String(order._id || order.id).slice(-8)}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-indigo-400 fill-indigo-400 shrink-0" />
            <span>Rate & Review Service</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Share your experience with the seller to help fellow shoppers on Amarzone.
          </p>
        </div>

        {/* Vendor Card */}
        <div className="p-3.5 rounded-2xl bg-[#120824] border border-white/10 mb-5 flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-slate-900 border border-white/15 overflow-hidden shrink-0 flex items-center justify-center">
            <Store className="w-6 h-6 text-slate-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate" title={vendorName}>
              {vendorName}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Service Provider
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating Selector */}
          <div className="form-control w-full space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Overall Rating *</span>
              <span className="text-[11px] font-medium text-indigo-300">
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
                    className="p-1.5 text-indigo-400 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                    title={`${star} Star`}
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        isFilled
                          ? "fill-indigo-400 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                          : "text-slate-600 hover:text-indigo-300"
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
              placeholder="e.g., Fast shipping, great packaging!"
              maxLength={100}
              className="input input-bordered w-full bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-indigo-400 text-xs rounded-xl"
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
              placeholder="How was the seller's communication, shipping speed, and overall service?"
              className="textarea textarea-bordered w-full bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-indigo-400 text-xs rounded-xl"
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
              className="btn flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-black border-none rounded-xl cursor-pointer shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
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

export default CreateServiceReviewModal;
