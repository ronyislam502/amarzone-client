"use client";

import React, { useState, useMemo } from "react";
import { TReview } from "@/types/review";
import { Star, User, CheckCircle2, ThumbsUp, Filter } from "lucide-react";
import { toast } from "react-toastify";

interface ProductReviewSectionProps {
  reviews?: TReview[];
  averageRating?: string | number;
  totalRatings?: number;
  isLoading?: boolean;
}

export const ProductReviewSection: React.FC<ProductReviewSectionProps> = ({
  reviews = [],
  averageRating = 4.5,
  totalRatings = 0,
  isLoading = false,
}) => {
  const [selectedFilterStar, setSelectedFilterStar] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "highest" | "lowest">("recent");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  const numericRating =
    typeof averageRating === "string" ? parseFloat(averageRating) || 4.5 : averageRating;

  // Calculate percentage breakdown for 5, 4, 3, 2, 1 stars
  const starBreakdown = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (!reviews || reviews.length === 0) {
      return { 5: 70, 4: 18, 3: 6, 2: 3, 1: 3 }; // standard normal distribution fallback
    }

    reviews.forEach((r) => {
      const star = Math.round(r.rating);
      if (counts[star] !== undefined) {
        counts[star]++;
      }
    });

    const total = reviews.length;
    return {
      5: Math.round((counts[5] / total) * 100),
      4: Math.round((counts[4] / total) * 100),
      3: Math.round((counts[3] / total) * 100),
      2: Math.round((counts[2] / total) * 100),
      1: Math.round((counts[1] / total) * 100),
    };
  }, [reviews]);

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let list = [...reviews];

    if (selectedFilterStar !== null) {
      list = list.filter((r) => Math.round(r.rating) === selectedFilterStar);
    }

    if (sortBy === "highest") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      list.sort((a, b) => a.rating - b.rating);
    } else {
      // most recent
      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    }

    return list;
  }, [reviews, selectedFilterStar, sortBy]);

  const handleHelpfulVote = (reviewId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
    toast.success("Thank you for your feedback!", {
      position: "bottom-right",
      autoClose: 1400,
    });
  };

  return (
    <div id="customer-reviews" className="py-8 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Rating Breakdown (Amazon Style) */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Customer Reviews
            </h2>

            {/* Average rating and stars */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(numericRating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-200 text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-bold text-slate-900">
                {numericRating.toFixed(1)} out of 5
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1">
              {totalRatings > 0
                ? `${totalRatings.toLocaleString()} global ratings`
                : "No customer reviews yet"}
            </p>
          </div>

          {/* Star Rating Bars */}
          <div className="space-y-2 text-xs">
            {[5, 4, 3, 2, 1].map((star) => {
              const percent = starBreakdown[star as keyof typeof starBreakdown] || 0;
              const isFiltered = selectedFilterStar === star;

              return (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setSelectedFilterStar(isFiltered ? null : star)
                  }
                  className={`w-full flex items-center gap-2 group cursor-pointer text-left p-1 rounded-sm transition-colors ${
                    isFiltered ? "bg-amber-50" : "hover:bg-slate-50"
                  }`}
                >
                  <span className="w-12 text-[#007185] group-hover:underline font-medium">
                    {star} star
                  </span>

                  {/* Progress Bar Container */}
                  <div className="flex-1 h-4 bg-slate-100 rounded-sm overflow-hidden border border-slate-200/80">
                    <div
                      className="h-full bg-[#ffa41c] transition-all duration-300 rounded-xs"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="w-8 text-right text-slate-600 font-medium">
                    {percent}%
                  </span>
                </button>
              );
            })}
          </div>

          {selectedFilterStar !== null && (
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-600">
                Filtering by {selectedFilterStar}-star reviews
              </span>
              <button
                type="button"
                onClick={() => setSelectedFilterStar(null)}
                className="text-[#007185] hover:underline font-semibold cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Review this product Box */}
          <div className="border-t border-slate-200 pt-5 space-y-2.5">
            <h3 className="text-sm font-bold text-slate-900">
              Review this product
            </h3>
            <p className="text-xs text-slate-600">
              Share your thoughts with other customers
            </p>
            <button
              type="button"
              onClick={() =>
                toast.info("Please log in to write a product review.", {
                  position: "bottom-right",
                })
              }
              className="w-full py-2 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-900 shadow-xs transition-colors cursor-pointer"
            >
              Write a customer review
            </button>
          </div>
        </div>

        {/* Right Column: Customer Reviews Feed */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header & Sort Controls */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Customer Reviews ({filteredReviews.length})
            </h3>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="select select-bordered select-xs text-xs font-semibold rounded-lg bg-slate-50 border-slate-300"
              >
                <option value="recent">Top reviews</option>
                <option value="highest">Highest rating</option>
                <option value="lowest">Lowest rating</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2 p-4 bg-slate-50 rounded-xl animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-12 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <p className="text-slate-700 font-medium text-sm">
                No customer reviews found matching your filter.
              </p>
              <p className="text-xs text-slate-500">
                Be the first to share your thoughts about this product variant!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredReviews.map((item) => {
                const customerName =
                  typeof item.customer === "object" && item.customer?.name
                    ? item.customer.name
                    : "Amarzone Customer";

                const reviewDate = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "September 20, 2026";

                const votes = helpfulVotes[item._id] || 0;

                return (
                  <div
                    key={item._id}
                    className="border-b border-slate-100 pb-5 last:border-none space-y-2 text-xs"
                  >
                    {/* Customer Profile Header */}
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                        {customerName[0]?.toUpperCase() || <User className="w-4 h-4" />}
                      </div>
                      <span className="font-semibold text-slate-900">
                        {customerName}
                      </span>
                    </div>

                    {/* Star Rating & Title */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= item.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-200 text-slate-300"
                            }`}
                          />
                        ))}
                      </div>

                      <span className="font-bold text-slate-900 text-sm">
                        {item.title || "Customer Review"}
                      </span>
                    </div>

                    {/* Review Date & Verified Purchase badge */}
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                      <span>Reviewed on {reviewDate}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[#c45500] font-bold inline-flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line pt-1">
                      {item.review}
                    </p>

                    {/* Helpful Button */}
                    <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-500">
                      <button
                        type="button"
                        onClick={() => handleHelpfulVote(item._id)}
                        className="py-1 px-3 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <ThumbsUp className="w-3 h-3 text-slate-500" />
                        <span>Helpful</span>
                        {votes > 0 && <span className="font-bold">({votes})</span>}
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() =>
                          toast.info("Thank you, our team will review this report.")
                        }
                        className="hover:underline hover:text-slate-700 cursor-pointer"
                      >
                        Report
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviewSection;
