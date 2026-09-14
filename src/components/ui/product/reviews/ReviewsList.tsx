import React from "react";
import { RefreshCw, MessageSquare } from "lucide-react";
import { ReviewsListProps } from "./types";
import { ReviewCard } from "./ReviewCard";

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  isLoading,
  onOpenModal,
}) => {
  return (
    <div className="md:col-span-2 space-y-6">
      {isLoading ? (
        <div className="py-12 text-center text-xs font-bold text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin inline mr-2 text-[#007185]" />
          Loading verified product reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-8 text-center bg-base-200 border border-base-300 rounded-xl space-y-2">
          <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="font-extrabold text-sm text-base-content">
            No product reviews found
          </h4>
          <p className="text-xs text-[#565959]">
            Be the first verified customer to write a product review!
          </p>
          <button
            type="button"
            onClick={onOpenModal}
            className="btn btn-warning btn-xs font-bold text-warning-content mt-2 cursor-pointer"
          >
            Write First Review
          </button>
        </div>
      ) : (
        reviews.map((rev: any, idx: number) => (
          <ReviewCard key={rev._id || idx} review={rev} index={idx} />
        ))
      )}
    </div>
  );
};

export default ReviewsList;
