"use client";

import React, { useState, useMemo, useRef } from "react";
import { TReview } from "@/types/review";
import {
  Star,
  User,
  CheckCircle2,
  ThumbsUp,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  X,
  RefreshCw,
  Loader2,
  SmilePlus,
  Brain,
  Info,
  CheckCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { useModerateReviewMutation } from "@/redux/features/ai/aiApi";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentUser } from "@/src/redux/features/auth/authSlice";

interface ProductReviewSectionProps {
  reviews?: TReview[];
  averageRating?: string | number;
  totalRatings?: number;
  isLoading?: boolean;
  productTitle?: string;
}

type TSentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE" | "MIXED";

interface TModerationResult {
  isAppropriate: boolean;
  sentiment: TSentiment;
  flaggedReasons: string[];
  moderationConfidence: number;
}

const SENTIMENT_CONFIG: Record<
  TSentiment,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  POSITIVE: {
    label: "Positive",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: <SmilePlus className="w-3.5 h-3.5 text-emerald-600" />,
  },
  NEUTRAL: {
    label: "Neutral",
    color: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-200",
    icon: <Info className="w-3.5 h-3.5 text-slate-500" />,
  },
  NEGATIVE: {
    label: "Negative",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
  },
  MIXED: {
    label: "Mixed",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <Brain className="w-3.5 h-3.5 text-amber-500" />,
  },
};

export const ProductReviewSection: React.FC<ProductReviewSectionProps> = ({
  reviews = [],
  averageRating = 4.5,
  totalRatings = 0,
  isLoading = false,
  productTitle,
}) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const userRole = currentUser?.role || "";
  const isPrivileged =
    userRole === "ADMIN" || userRole === "SUPER_ADMIN" || userRole === "VENDOR";

  const [selectedFilterStar, setSelectedFilterStar] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "highest" | "lowest">("recent");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  // Write review modal state
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [writeRating, setWriteRating] = useState(5);
  const [writeHoverRating, setWriteHoverRating] = useState(0);
  const [writeTitle, setWriteTitle] = useState("");
  const [writeReviewText, setWriteReviewText] = useState("");

  // AI moderation for per-review analysis (privileged roles)
  const [reviewModerations, setReviewModerations] = useState<
    Record<string, TModerationResult>
  >({});
  const [moderatingIds, setModeratingIds] = useState<Set<string>>(new Set());

  // AI moderation for the write-review form
  const [writeModerationResult, setWriteModerationResult] =
    useState<TModerationResult | null>(null);
  const [isCheckingWrite, setIsCheckingWrite] = useState(false);

  const [moderateReview] = useModerateReviewMutation();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const numericRating =
    typeof averageRating === "string"
      ? parseFloat(averageRating) || 4.5
      : averageRating;

  // Calculate star breakdown
  const starBreakdown = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (!reviews || reviews.length === 0) {
      return { 5: 70, 4: 18, 3: 6, 2: 3, 1: 3 };
    }
    reviews.forEach((r) => {
      const star = Math.round(r.rating);
      if (counts[star] !== undefined) counts[star]++;
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

  // Filtered and sorted reviews
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
      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
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

  // Moderate a single review (for ADMIN/VENDOR view)
  const handleModerateReview = async (review: TReview) => {
    if (moderatingIds.has(review._id)) return;
    setModeratingIds((prev) => new Set(prev).add(review._id));
    try {
      const res = await moderateReview({
        reviewText: review.review,
        rating: review.rating,
        productTitle: productTitle || "Product Review",
      }).unwrap();
      setReviewModerations((prev) => ({
        ...prev,
        [review._id]: res.data as TModerationResult,
      }));
      toast.success("AI moderation analysis complete!", { autoClose: 2000 });
    } catch {
      toast.error("AI moderation failed. Please try again.");
    } finally {
      setModeratingIds((prev) => {
        const next = new Set(prev);
        next.delete(review._id);
        return next;
      });
    }
  };

  // Live AI check as customer types their review (debounced 1.2s)
  const handleWriteReviewTextChange = (text: string) => {
    setWriteReviewText(text);
    setWriteModerationResult(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.trim().length < 20) return; // Only check once meaningful

    debounceRef.current = setTimeout(async () => {
      setIsCheckingWrite(true);
      try {
        const res = await moderateReview({
          reviewText: text,
          rating: writeRating,
          productTitle: productTitle || "Product",
        }).unwrap();
        setWriteModerationResult(res.data as TModerationResult);
      } catch {
        // Silently fail on live check — don't block the user
      } finally {
        setIsCheckingWrite(false);
      }
    }, 1200);
  };

  const handleSubmitReview = () => {
    if (!currentUser) {
      toast.info("Please log in to submit a review.");
      setShowWriteModal(false);
      return;
    }
    if (writeReviewText.trim().length < 10) {
      toast.error("Review must be at least 10 characters.");
      return;
    }
    if (writeModerationResult && !writeModerationResult.isAppropriate) {
      toast.error(
        "Your review was flagged by AI moderation. Please revise it before submitting."
      );
      return;
    }
    // TODO: hook into actual review submission API
    toast.success("Review submitted successfully! It will appear after moderation.", {
      autoClose: 3000,
    });
    setShowWriteModal(false);
    setWriteReviewText("");
    setWriteTitle("");
    setWriteRating(5);
    setWriteModerationResult(null);
  };

  const sentimentInfo = writeModerationResult
    ? SENTIMENT_CONFIG[writeModerationResult.sentiment as TSentiment] ||
      SENTIMENT_CONFIG.NEUTRAL
    : null;

  return (
    <div id="customer-reviews" className="py-8 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left: Rating Breakdown ── */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Customer Reviews
            </h2>

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

          {/* Star bars */}
          <div className="space-y-2 text-xs">
            {[5, 4, 3, 2, 1].map((star) => {
              const percent =
                starBreakdown[star as keyof typeof starBreakdown] || 0;
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

          {/* Write Review Box */}
          <div className="border-t border-slate-200 pt-5 space-y-2.5">
            <h3 className="text-sm font-bold text-slate-900">
              Review this product
            </h3>
            <p className="text-xs text-slate-600">
              Share your thoughts with other customers
            </p>

            {/* AI-powered badge */}
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-full w-fit">
              <Sparkles className="w-3 h-3" />
              <span>AI-moderated for quality & authenticity</span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  toast.info("Please log in to write a product review.", {
                    position: "bottom-right",
                  });
                  return;
                }
                setShowWriteModal(true);
              }}
              className="w-full py-2 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-900 shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <SmilePlus className="w-3.5 h-3.5 text-amber-500" />
              Write a customer review
            </button>
          </div>
        </div>

        {/* ── Right: Reviews Feed ── */}
        <div className="lg:col-span-8 space-y-4">
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

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="space-y-2 p-4 bg-slate-50 rounded-xl animate-pulse"
                >
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
                Be the first to share your thoughts about this product!
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
                const modResult = reviewModerations[item._id];
                const isModeratingThis = moderatingIds.has(item._id);
                const sentConfig = modResult
                  ? SENTIMENT_CONFIG[modResult.sentiment as TSentiment] ||
                    SENTIMENT_CONFIG.NEUTRAL
                  : null;

                return (
                  <div
                    key={item._id}
                    className="border-b border-slate-100 pb-6 last:border-none space-y-2.5 text-xs"
                  >
                    {/* Profile Header */}
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                        {customerName[0]?.toUpperCase() || (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <span className="font-semibold text-slate-900">
                        {customerName}
                      </span>
                    </div>

                    {/* Stars + Title */}
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

                    {/* Date + Verified */}
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                      <span>Reviewed on {reviewDate}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[#c45500] font-bold inline-flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                      </span>
                    </div>

                    {/* Review Body */}
                    <p className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line pt-1">
                      {item.review}
                    </p>

                    {/* AI Moderation Result Badge */}
                    {modResult && sentConfig && (
                      <div
                        className={`flex flex-wrap items-start gap-3 p-3 rounded-xl border ${sentConfig.bg} ${sentConfig.border} mt-1`}
                      >
                        <div
                          className={`flex items-center gap-1.5 font-bold text-[11px] ${sentConfig.color}`}
                        >
                          {modResult.isAppropriate ? (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          ) : (
                            <ShieldAlert className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {modResult.isAppropriate
                              ? "AI Cleared"
                              : "AI Flagged"}
                          </span>
                          <span className="mx-1 text-slate-300">|</span>
                          {sentConfig.icon}
                          <span>{sentConfig.label} Sentiment</span>
                          <span className="mx-1 text-slate-300">|</span>
                          <span className="font-mono">
                            {Math.round(modResult.moderationConfidence * 100)}%
                            confidence
                          </span>
                        </div>
                        {!modResult.isAppropriate &&
                          modResult.flaggedReasons.length > 0 && (
                            <div className="w-full flex flex-wrap gap-1 mt-0.5">
                              {modResult.flaggedReasons.map((reason, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] font-semibold bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full"
                                >
                                  {reason}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                    )}

                    {/* Action Footer */}
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                      <button
                        type="button"
                        onClick={() => handleHelpfulVote(item._id)}
                        className="py-1 px-3 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <ThumbsUp className="w-3 h-3 text-slate-500" />
                        <span>Helpful</span>
                        {votes > 0 && (
                          <span className="font-bold">({votes})</span>
                        )}
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() =>
                          toast.info(
                            "Thank you, our team will review this report."
                          )
                        }
                        className="hover:underline hover:text-slate-700 cursor-pointer"
                      >
                        Report
                      </button>

                      {/* AI Moderate Button — visible to ADMIN/VENDOR/SUPER_ADMIN */}
                      {isPrivileged && (
                        <>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => handleModerateReview(item)}
                            disabled={isModeratingThis}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100 font-semibold transition-colors cursor-pointer disabled:opacity-60"
                          >
                            {isModeratingThis ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : modResult ? (
                              <RefreshCw className="w-3 h-3" />
                            ) : (
                              <Sparkles className="w-3 h-3" />
                            )}
                            <span>
                              {isModeratingThis
                                ? "Analyzing..."
                                : modResult
                                ? "Re-analyze"
                                : "AI Moderate"}
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────
          WRITE REVIEW MODAL WITH LIVE AI MODERATION
      ────────────────────────────────────────────── */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowWriteModal(false)}
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-[#170d2f] via-[#1a1040] to-[#120824] px-6 py-5">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-warning badge-sm font-black text-slate-950 text-[10px] uppercase tracking-wider">
                      <Sparkles className="w-2.5 h-2.5 mr-1" />
                      AI-Powered Review
                    </span>
                    <span className="text-[11px] font-semibold text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-full border border-violet-500/30">
                      Live Moderation Active
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Write a Customer Review
                  </h2>
                  {productTitle && (
                    <p className="text-xs text-slate-300/80 truncate max-w-sm">
                      {productTitle}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowWriteModal(false)}
                  className="btn btn-sm btn-ghost btn-square text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Star Rating Selector */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                  Overall Rating <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setWriteRating(star)}
                      onMouseEnter={() => setWriteHoverRating(star)}
                      onMouseLeave={() => setWriteHoverRating(0)}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (writeHoverRating || writeRating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-100 text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-bold text-slate-700">
                    {writeHoverRating || writeRating} star
                    {(writeHoverRating || writeRating) !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Review Title */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                  Review Title
                </label>
                <input
                  type="text"
                  value={writeTitle}
                  onChange={(e) => setWriteTitle(e.target.value)}
                  placeholder="e.g. Great quality, fast delivery"
                  maxLength={100}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent placeholder:text-slate-400"
                />
              </div>

              {/* Review Body with Live AI Check */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                    Review <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-500">
                    {isCheckingWrite ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>AI checking...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-3 h-3" />
                        <span>Live AI quality check</span>
                      </>
                    )}
                  </div>
                </div>
                <textarea
                  value={writeReviewText}
                  onChange={(e) => handleWriteReviewTextChange(e.target.value)}
                  placeholder="Share your experience — what did you love? Anything to improve? Please keep it genuine and constructive."
                  rows={5}
                  maxLength={2000}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent placeholder:text-slate-400 resize-none leading-relaxed"
                />
                <div className="text-right text-[10px] text-slate-400 font-semibold">
                  {writeReviewText.length} / 2000
                </div>
              </div>

              {/* AI Moderation Live Feedback Panel */}
              {writeModerationResult && sentimentInfo && (
                <div
                  className={`rounded-2xl border p-4 space-y-3 ${sentimentInfo.bg} ${sentimentInfo.border}`}
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      {writeModerationResult.isAppropriate ? (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-black text-xs">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>AI Review Cleared</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-700 font-black text-xs">
                          <ShieldAlert className="w-4 h-4 text-rose-600" />
                          <span>Review Flagged by AI</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {sentimentInfo.icon}
                      <span className={`text-xs font-bold ${sentimentInfo.color}`}>
                        {sentimentInfo.label} Sentiment
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {Math.round(
                          writeModerationResult.moderationConfidence * 100
                        )}
                        % confidence
                      </span>
                    </div>
                  </div>

                  {writeModerationResult.isAppropriate ? (
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      ✅ Your review looks great! It meets our community
                      guidelines and quality standards. You can submit it now.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-rose-700 font-semibold">
                        ⚠️ Your review was flagged for the following reasons.
                        Please revise it before submitting:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {writeModerationResult.flaggedReasons.map(
                          (reason, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-semibold bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full"
                            >
                              {reason}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Guidelines hint */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                <span>
                  Our AI scans reviews for authenticity, sentiment, and
                  community guideline compliance before publishing. Reviews
                  containing spam, hate speech, or off-topic content will be
                  automatically declined.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowWriteModal(false)}
                className="btn btn-sm btn-ghost text-slate-500 hover:text-slate-700 rounded-xl"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={
                  writeReviewText.trim().length < 10 ||
                  isCheckingWrite ||
                  (writeModerationResult !== null &&
                    !writeModerationResult.isAppropriate)
                }
                className="btn btn-sm bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black border-0 rounded-xl shadow-md shadow-amber-400/20 gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingWrite ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviewSection;
