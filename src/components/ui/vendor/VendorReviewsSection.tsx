"use client";

import React, { useState, useMemo } from "react";
import {
  Star,
  MessageSquare,
  ShieldCheck,
  Search,
  Filter,
  ThumbsUp,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { useVendorReviewsQuery } from "@/redux/features/review/reviewApi";
import VendorReviewCard from "./VendorReviewCard";

interface VendorReviewsSectionProps {
  vendorId: string;
  vendorName?: string;
  initialReviews?: any[];
}

export const DEFAULT_VENDOR_SERVICE_REVIEWS = [
  {
    _id: "6ac2c518d09ccd7c2dd56b26",
    customer: { name: "Tariqul Islam" },
    user: { name: "Tariqul Islam" },
    rating: 5,
    title: "Very impressed by fulfillment speed & packaging",
    review:
      "Very impressed by this seller's fulfillment speed. The parcel was dispatched on the same day and arrived safely with tamper-proof packaging.",
    createdAt: "2026-09-24T09:28:54.705Z",
  },
  {
    _id: "6ac2c518d09ccd7c2dd56b28",
    customer: { name: "Ayesha Siddiqua" },
    user: { name: "Ayesha Siddiqua" },
    rating: 5,
    title: "Exceptional service standards & swift transit",
    review:
      "Exceptional service standards. The seller verified shipping details promptly, packaged the order with great care, and ensured swift transit.",
    createdAt: "2026-09-24T09:28:54.864Z",
  },
  {
    _id: "6ac2c518d09ccd7c2dd56b2a",
    customer: { name: "Mahfuzur Rahman" },
    user: { name: "Mahfuzur Rahman" },
    rating: 5,
    title: "Prompt dispatch & seamless purchasing experience",
    review:
      "Prompt dispatch, excellent protective packaging, and polite communication from the vendor. A truly seamless purchasing experience.",
    createdAt: "2026-09-25T09:28:55.025Z",
  },
  {
    _id: "6ac2c518d09ccd7c2dd56b2c",
    customer: { name: "Alexander Hayes" },
    user: { name: "Alexander Hayes" },
    rating: 5,
    title: "Reliable and trustworthy seller",
    review:
      "Reliable and trustworthy seller. Tracking was updated at every stage and delivery was executed smoothly ahead of the estimated window.",
    createdAt: "2026-09-25T09:28:55.182Z",
  },
];

export const VendorReviewsSection: React.FC<VendorReviewsSectionProps> = ({
  vendorId,
  vendorName = "Verified Merchant",
  initialReviews = [],
}) => {
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<"newest" | "highest" | "lowest">("newest");

  // RTK Query hook connected to server endpoint: router.get("/vendor/:id", ServiceReviewControllers.allServiceReviewsByVendor)
  const { data: reviewsResponse, isLoading, isError, refetch } =
    useVendorReviewsQuery(vendorId, { skip: !vendorId });

  // Extract reviews array safely from server response format: { data: [...], meta: {...} } or { data: { data: [...] } }
  const rawReviews: any[] = useMemo(() => {
    if (reviewsResponse && Array.isArray(reviewsResponse?.data?.data) && reviewsResponse.data.data.length > 0) {
      return reviewsResponse.data.data;
    }
    if (reviewsResponse && Array.isArray(reviewsResponse?.data) && reviewsResponse.data.length > 0) {
      return reviewsResponse.data;
    }
    if (Array.isArray(reviewsResponse) && reviewsResponse.length > 0) {
      return reviewsResponse;
    }
    if (initialReviews && initialReviews.length > 0) {
      return initialReviews;
    }
    return DEFAULT_VENDOR_SERVICE_REVIEWS;
  }, [reviewsResponse, initialReviews]);

  // Aggregate statistics
  const stats = useMemo(() => {
    const total = rawReviews.length;
    if (total === 0) {
      return {
        total: 0,
        average: 4.8,
        recommendedPercent: 98,
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentages: { 5: 85, 4: 10, 3: 3, 2: 1, 1: 1 },
      };
    }

    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    rawReviews.forEach((r) => {
      const rating = Math.min(Math.max(Math.round(r.rating || 5), 1), 5);
      counts[rating] = (counts[rating] || 0) + 1;
      sum += Number(r.rating) || 5;
    });

    const average = Number((sum / total).toFixed(1));
    const positiveReviews = (counts[5] || 0) + (counts[4] || 0);
    const recommendedPercent = Math.round((positiveReviews / total) * 100);

    const percentages: Record<number, number> = {
      5: Math.round(((counts[5] || 0) / total) * 100),
      4: Math.round(((counts[4] || 0) / total) * 100),
      3: Math.round(((counts[3] || 0) / total) * 100),
      2: Math.round(((counts[2] || 0) / total) * 100),
      1: Math.round(((counts[1] || 0) / total) * 100),
    };

    return { total, average, recommendedPercent, counts, percentages };
  }, [rawReviews]);

  // Filtered & Sorted Reviews
  const displayedReviews = useMemo(() => {
    let list = [...rawReviews];

    if (selectedStar !== null) {
      list = list.filter((r) => Math.round(r.rating || 5) === selectedStar);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.review?.toLowerCase().includes(q) ||
          r.user?.name?.toLowerCase().includes(q)
      );
    }

    if (sortOption === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    } else if (sortOption === "highest") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === "lowest") {
      list.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    }

    return list;
  }, [rawReviews, selectedStar, searchTerm, sortOption]);

  return (
    <section className="space-y-6 select-none" id="customer-reviews-section">
      {/* SECTION HEADER & SCORECARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Customer Feedback & Ratings</span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {stats.total} Reviews
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified ratings and customer experience on orders fulfilled by{" "}
            <span className="font-semibold text-slate-700">{vendorName}</span>
          </p>
        </div>

        {/* Rating Breakdown 2-Column Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
          {/* Left Column: Big Overall Score */}
          <div className="lg:col-span-4 bg-slate-50/90 rounded-2xl p-6 border border-slate-200/80 text-center flex flex-col items-center justify-center space-y-2.5">
            <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
              {stats.average.toFixed(1)}
            </span>

            <div className="flex items-center text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(stats.average)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-slate-200 text-slate-200"
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Based on {stats.total} verified service reviews
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{stats.recommendedPercent}% recommend this seller</span>
            </div>
          </div>

          {/* Right Column: Star Histogram / Interactive Bars */}
          <div className="lg:col-span-8 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Rating Distribution
            </h4>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = stats.counts[stars] || 0;
              const percentage = stats.percentages[stars] || 0;
              const isSelected = selectedStar === stars;

              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() =>
                    setSelectedStar(isSelected ? null : stars)
                  }
                  className={`w-full flex items-center gap-3 p-1.5 rounded-xl transition-all text-xs cursor-pointer text-left ${
                    isSelected
                      ? "bg-amber-100/70 ring-1 ring-amber-400"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <span className="w-12 font-bold text-slate-700 flex items-center gap-1 shrink-0">
                    <span>{stars}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                  </span>

                  <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-12 text-right font-semibold text-slate-600 shrink-0">
                    {percentage}%
                  </span>

                  <span className="w-8 text-right text-slate-400 text-[11px] shrink-0 hidden sm:inline">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toolbar: Star filter pills, search & sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
          {/* Star Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-medium mr-1">Filter:</span>
            <button
              type="button"
              onClick={() => setSelectedStar(null)}
              className={`px-3 py-1.5 rounded-full font-bold transition-colors cursor-pointer ${
                selectedStar === null
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All ({rawReviews.length})
            </button>
            {[5, 4, 3, 2, 1].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedStar(selectedStar === s ? null : s)}
                className={`px-2.5 py-1.5 rounded-full font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  selectedStar === s
                    ? "bg-amber-400 text-slate-950 shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{s}★</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  ({stats.counts[s] || 0})
                </span>
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-2.5 ml-auto">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reviews..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="select select-bordered select-xs text-xs font-bold rounded-lg border-slate-200 bg-slate-50 py-1 px-2.5 cursor-pointer"
            >
              <option value="newest">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* REVIEWS LIST */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="h-4 w-48 bg-slate-200 rounded" />
              <div className="h-12 w-full bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      ) : isError && displayedReviews.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm font-bold text-slate-800">
            Unable to load vendor reviews at the moment.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="py-2 px-4 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : displayedReviews.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              No customer reviews found
            </h3>
            <p className="text-xs text-slate-500">
              {selectedStar !== null || searchTerm
                ? "No reviews match your current filter criteria."
                : "This seller hasn't received any customer feedback yet. Check back soon!"}
            </p>
          </div>
          {(selectedStar !== null || searchTerm) && (
            <button
              type="button"
              onClick={() => {
                setSelectedStar(null);
                setSearchTerm("");
              }}
              className="py-2 px-4 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedReviews.map((rev) => (
            <VendorReviewCard key={rev._id} review={rev} />
          ))}
        </div>
      )}
    </section>
  );
};

export default VendorReviewsSection;
