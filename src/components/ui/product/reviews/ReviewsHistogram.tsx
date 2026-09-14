import React from "react";
import { Star, ShieldCheck } from "lucide-react";
import { ReviewsHistogramProps } from "./types";

export const ReviewsHistogram: React.FC<ReviewsHistogramProps> = ({
  avgRating,
  totalReviews,
  starCounts,
  onOpenModal,
}) => {
  return (
    <div className="space-y-4 bg-[#f7fafa] p-5 rounded-xl border border-slate-200 h-fit">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase font-extrabold tracking-wider text-[#c45500]">
          Product Quality Rating
        </span>
        <ShieldCheck className="w-4 h-4 text-[#007185]" />
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black text-[#0f1111]">{avgRating}</span>
        <div className="flex items-center text-amber-500">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= Math.round(Number(avgRating))
                  ? "fill-amber-500 text-amber-500"
                  : "text-slate-300"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-[#565959] font-medium">out of 5</span>
      </div>

      <p className="text-xs text-[#565959] font-semibold">
        {totalReviews} global customer ratings
      </p>

      {/* Star Breakdown Bars */}
      <div className="space-y-2 pt-2">
        {starCounts.map((item) => (
          <div key={item.stars} className="flex items-center gap-2 text-xs">
            <span className="w-12 text-[#007185] hover:underline cursor-pointer font-medium">
              {item.stars} star
            </span>
            <div className="flex-1 bg-slate-200 h-4 rounded-sm overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-sm transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className="w-10 text-right text-[#565959] font-medium">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-4 space-y-2">
        <h4 className="text-xs font-bold text-[#0f1111]">Review this product</h4>
        <p className="text-[11px] text-[#565959]">
          Share your verified purchase experience with other shoppers
        </p>
        <button
          type="button"
          onClick={onOpenModal}
          className="w-full py-1.5 px-3 bg-base-100 hover:bg-base-200 border border-base-300 rounded-md text-xs font-semibold text-base-content transition-all cursor-pointer"
        >
          Write a customer review
        </button>
      </div>
    </div>
  );
};

export default ReviewsHistogram;
