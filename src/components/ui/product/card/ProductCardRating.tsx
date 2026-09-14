import React from "react";
import { Star } from "lucide-react";

export interface ProductCardRatingProps {
  rating: number;
  count?: number;
}

export default function ProductCardRating({
  rating,
  count,
}: ProductCardRatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3 h-3 ${
              s <= Math.floor(rating)
                ? "fill-[#FFA41C] text-[#FFA41C]"
                : s - 0.5 <= rating
                ? "fill-[#FFA41C] text-[#FFA41C] opacity-60"
                : "text-slate-300"
            }`}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-[11px] text-[#007185] hover:underline cursor-pointer">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
