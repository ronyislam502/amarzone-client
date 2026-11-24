"use client";

import React from "react";
import { Trophy, Award, TrendingUp } from "lucide-react";
import { TVariantRanking } from "@/types/ranking";

interface ProductVariantRankProps {
  ranking?: TVariantRanking | null;
  isLoading?: boolean;
}

export const ProductVariantRank: React.FC<ProductVariantRankProps> = ({
  ranking,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="my-3 p-3 rounded-xl bg-amber-50/50 border border-amber-200/50 animate-pulse space-y-2 select-none">
        <div className="h-4 w-36 bg-amber-200/60 rounded" />
        <div className="h-3 w-52 bg-amber-100 rounded" />
      </div>
    );
  }

  if (!ranking) return null;

  const hasDeptRank = typeof ranking.departmentRank === "number" && ranking.departmentRank > 0;
  const hasCatRank = typeof ranking.categoryRank === "number" && ranking.categoryRank > 0;
  const hasGlobalRank = typeof ranking.globalRank === "number" && ranking.globalRank > 0;

  if (!hasDeptRank && !hasCatRank && !hasGlobalRank) {
    return null;
  }

  return (
    <div className="my-3 p-3 rounded-xl bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-transparent border border-amber-200/70 text-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Best Sellers Rank</span>
        </div>
        {ranking.isBestSeller && (
          <span className="bg-[#e77600] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
            <Award className="w-3 h-3" />
            #1 Best Seller
          </span>
        )}
      </div>

      {/* Ranks list */}
      <ul className="space-y-1.5 text-slate-700">
        {hasCatRank && (
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <span>
              <strong className="text-slate-900 font-bold">
                #{ranking.categoryRank}
              </strong>{" "}
              in{" "}
              <span className="text-[#007185] hover:text-[#c7511f] font-medium cursor-pointer">
                {ranking.categoryName}
              </span>
            </span>
          </li>
        )}

        {hasDeptRank && (
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            <span>
              <strong className="text-slate-900 font-bold">
                #{ranking.departmentRank}
              </strong>{" "}
              in{" "}
              <span className="text-[#007185] hover:text-[#c7511f] font-medium cursor-pointer">
                {ranking.departmentName}
              </span>
            </span>
          </li>
        )}

        {hasGlobalRank && (
          <li className="flex items-center gap-2 text-slate-500 text-[11px] pt-0.5">
            <TrendingUp className="w-3 h-3 text-slate-400 shrink-0" />
            <span>
              <strong className="text-slate-700 font-semibold">
                #{ranking.globalRank}
              </strong>{" "}
              in the entire marketplace
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ProductVariantRank;
