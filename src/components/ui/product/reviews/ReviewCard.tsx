import React from "react";
import { Star, CheckCircle2, User, ThumbsUp } from "lucide-react";
import { toast } from "react-toastify";
import { ReviewCardProps } from "./types";

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, index }) => {
  const custObj = typeof review.customer === "object" ? review.customer : {};
  const custName = custObj?.name || review.customerName || "Verified Database Customer";
  const titleText = review.title || "Verified Product Review";
  const dateStr = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recent";
  const ratingVal = review.rating || 5;
  const comment = review.review || review.comment || "Great quality product!";

  return (
    <div className="space-y-2 border-b border-base-300 pb-6 first:pt-0">
      {/* Reviewer Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="avatar placeholder">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
              <User className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <span className="text-xs font-bold text-base-content block">{custName}</span>
            <span className="text-[10px] text-slate-500 font-mono">
              ID: {custObj?._id || `CUST-${index + 1}`}
            </span>
          </div>
        </div>

        <span className="badge badge-success badge-outline font-extrabold text-[10px] gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Buyer
        </span>
      </div>

      {/* Rating Stars & Title */}
      <div className="flex items-center gap-2 pt-1">
        <div className="flex text-amber-500">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${
                star <= ratingVal
                  ? "fill-amber-500 text-amber-500"
                  : "text-slate-300"
              }`}
            />
          ))}
        </div>
        <h4 className="text-xs font-bold text-base-content">{titleText}</h4>
      </div>

      {/* Review Date & Verified Badge */}
      <div className="flex items-center gap-2 text-[11px] text-[#565959]">
        <span>Reviewed on {dateStr}</span>
        <span>|</span>
        <span className="text-[#c45500] font-extrabold flex items-center gap-0.5">
          <CheckCircle2 className="w-3 h-3 text-[#c45500]" /> Verified Purchase
        </span>
      </div>

      {/* Review Body Comment */}
      <p className="text-xs text-base-content leading-relaxed font-normal pt-1">
        {comment}
      </p>

      {/* Helpful Action */}
      <div className="pt-2 flex items-center gap-4 text-xs text-[#565959]">
        <button
          type="button"
          onClick={() => toast.info("Thank you for your feedback!")}
          className="px-3 py-1 bg-base-100 hover:bg-base-200 border border-base-300 rounded-md font-medium text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ThumbsUp className="w-3 h-3 text-slate-500" /> Helpful
        </button>
        <span className="text-[11px] text-slate-400 cursor-pointer hover:underline">
          Report
        </span>
      </div>
    </div>
  );
};

export default ReviewCard;
