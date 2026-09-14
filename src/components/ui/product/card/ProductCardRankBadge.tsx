import React from "react";
import { Award } from "lucide-react";
import { getRankStyle } from "./utils";

export interface ProductCardRankBadgeProps {
  rank: number;
  viewMode?: "grid" | "list";
}

export default function ProductCardRankBadge({
  rank,
  viewMode = "grid",
}: ProductCardRankBadgeProps) {
  if (rank === undefined) return null;

  if (viewMode === "list") {
    if (rank > 3) return null;
    return (
      <div className="shrink-0">
        <span className="bg-[#c45500] text-white text-[10px] font-black px-2 py-1 flex items-center gap-1 rounded-sm">
          <Award className="w-2.5 h-2.5" /> #{rank}
        </span>
      </div>
    );
  }

  const { bg, text } = getRankStyle(rank);

  return (
    <div
      className={`absolute top-0 left-0 z-10 ${bg} ${text} text-[10px] font-black px-2 py-1 flex items-center gap-1`}
    >
      {rank === 1 && <Award className="w-2.5 h-2.5" />}
      {rank === 1 ? "#1 Best Seller" : `#${rank}`}
    </div>
  );
}
