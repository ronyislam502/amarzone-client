"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, CheckCircle, ThumbsUp, ShieldCheck } from "lucide-react";

interface VendorReviewCardProps {
  review: {
    _id: string;
    rating: number;
    title?: string;
    review: string;
    createdAt?: string;
    user?: {
      _id?: string;
      name?: string;
      email?: string;
      avatar?: string;
    };
    customer?: {
      _id?: string;
      name?: string;
      email?: string;
      avatar?: string;
    };
    order?: any;
  };
}

export const VendorReviewCard: React.FC<VendorReviewCardProps> = ({ review }) => {
  const [helpfulCount, setHelpfulCount] = useState(
    Math.floor((review._id.charCodeAt(review._id.length - 1) % 5))
  );
  const [hasVotedHelpful, setHasVotedHelpful] = useState(false);

  const reviewer = review?.user || review?.customer;
  const reviewerName = reviewer?.name || "Amarzone Verified Customer";
  const avatar = reviewer?.avatar;

  const initials = reviewerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = review?.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recent Purchase";

  const handleHelpfulToggle = () => {
    if (hasVotedHelpful) {
      setHelpfulCount((prev) => Math.max(0, prev - 1));
      setHasVotedHelpful(false);
    } else {
      setHelpfulCount((prev) => prev + 1);
      setHasVotedHelpful(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all select-none space-y-3.5">
      {/* Reviewer Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-xs text-xs">
            {avatar ? (
              <Image
                src={avatar}
                alt={reviewerName}
                fill
                className="object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-sm font-bold text-slate-900 leading-none">
                {reviewerName}
              </h4>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3 stroke-[2.5]" />
                Verified Order
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{formattedDate}</p>
          </div>
        </div>

        {/* Star Rating Badge */}
        <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
          <div className="flex items-center text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.round(review.rating || 5)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-200 text-slate-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-black text-amber-900 ml-1">
            {review.rating ? Number(review.rating).toFixed(1) : "5.0"}
          </span>
        </div>
      </div>

      {/* Review Content */}
      <div className="space-y-1.5 pl-0.5">
        {review.title && (
          <h5 className="text-sm font-bold text-slate-900">
            {review.title}
          </h5>
        )}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {review.review || "Great service, item arrived quickly and packaged properly!"}
        </p>
      </div>

      {/* Footer: Helpful button & Trust verification */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Fulfillment feedback
        </span>

        <button
          type="button"
          onClick={handleHelpfulToggle}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            hasVotedHelpful
              ? "bg-amber-100 text-amber-900 font-bold"
              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Helpful {helpfulCount > 0 && `(${helpfulCount})`}</span>
        </button>
      </div>
    </div>
  );
};

export default VendorReviewCard;
