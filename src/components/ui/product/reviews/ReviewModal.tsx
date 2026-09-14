import React from "react";
import { Star, Sparkles, RefreshCw, X } from "lucide-react";
import { ReviewModalProps } from "./types";

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  productTitle,
  ratingInput,
  setRatingInput,
  titleInput,
  setTitleInput,
  reviewInput,
  setReviewInput,
  handleSubmit,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open bg-black/60 backdrop-blur-xs z-50">
      <div className="modal-box max-w-lg border border-slate-300 shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 font-bold cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="font-extrabold text-base text-[#0f1111]">
              Create Customer Product Review
            </h3>
            <p className="text-xs text-[#565959]">{productTitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0f1111] block">Overall Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingInput(star)}
                  className="p-1 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= ratingInput
                        ? "fill-amber-500 text-amber-500"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-[#0f1111] ml-2">
                {ratingInput} of 5 stars
              </span>
            </div>
          </div>

          {/* Headline Title Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0f1111] block">Add a headline</label>
            <input
              type="text"
              placeholder="What's most important to know?"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="input input-sm input-bordered w-full text-xs font-medium"
            />
          </div>

          {/* Review Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#0f1111] block">
              Add a written review
            </label>
            <textarea
              rows={4}
              required
              placeholder="What did you like or dislike? What did you use this product for?"
              value={reviewInput}
              onChange={(e) => setReviewInput(e.target.value)}
              className="textarea textarea-bordered w-full text-xs font-medium"
            />
          </div>

          <div className="modal-action mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-warning btn-sm font-black text-warning-content gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Publishing...
                </>
              ) : (
                "Submit Product Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
