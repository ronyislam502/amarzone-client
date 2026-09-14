"use client";

import React from "react";
import Link from "next/link";
import { Star, ShieldCheck, Flame, Award } from "lucide-react";
import { ProductInfoTitleProps } from "./types";

export const ProductInfoTitle: React.FC<ProductInfoTitleProps> = ({
  title,
  brand = "Amarzone Verified",
  categoryName = "Catalog",
}) => {
  return (
    <div className="space-y-2.5 pb-2">
      {/* Brand & Store Badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <Link
          href="/#featured-catalog"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#0071dc] hover:underline"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#0071dc]" />
          <span>{brand}</span>
        </Link>
        <span className="text-slate-300">•</span>
        <span className="text-xs text-slate-500 font-medium">{categoryName}</span>
      </div>

      {/* Main Product Title */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-snug tracking-tight">
        {title}
      </h1>

      {/* Rating & Review Counter */}
      <div className="flex items-center gap-3 text-xs flex-wrap pt-0.5">
        <div className="flex items-center gap-1">
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${
                  s === 5 ? "fill-amber-400/50 text-amber-400" : "fill-amber-400 text-amber-400"
                }`}
              />
            ))}
          </div>
          <span className="font-extrabold text-slate-900 text-xs ml-1">4.8</span>
          <a
            href="#reviews"
            className="text-[#0071dc] hover:underline font-semibold ml-0.5"
          >
            (1,248 reviews)
          </a>
        </div>

        <span className="text-slate-300">|</span>

        {/* Popular / Best Seller Badge */}
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 bg-[#cc0000] text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tight">
            <Flame className="w-3 h-3 fill-white" />
            Popular Pick
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            in {categoryName}
          </span>
        </div>
      </div>

      {/* Social Proof Strip */}
      <div className="text-xs font-bold text-slate-800 bg-amber-50/70 border border-amber-200/60 rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5">
        <Award className="w-3.5 h-3.5 text-amber-600" />
        <span>100+ bought in past 48 hours</span>
      </div>
    </div>
  );
};

export default ProductInfoTitle;
