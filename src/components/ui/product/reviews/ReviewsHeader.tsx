import React from "react";
import { ShoppingBag, Plus } from "lucide-react";
import { ReviewsHeaderProps } from "./types";

export const ReviewsHeader: React.FC<ReviewsHeaderProps> = ({
  productTitle,
  onOpenModal,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#0f1111] tracking-tight flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-[#007185]" />
          Customer Product Reviews
        </h2>
        <p className="text-xs text-[#565959] mt-0.5">
          Verified ratings & reviews from real customers for {productTitle}
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenModal}
        className="btn btn-warning btn-sm font-bold gap-1.5 shadow-xs text-warning-content self-start sm:self-auto"
      >
        <Plus className="w-4 h-4" />
        <span>Write a product review</span>
      </button>
    </div>
  );
};

export default ReviewsHeader;
