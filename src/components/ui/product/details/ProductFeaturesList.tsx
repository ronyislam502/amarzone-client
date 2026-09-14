"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";
import { ProductFeaturesListProps } from "./types";

export const ProductFeaturesList: React.FC<ProductFeaturesListProps> = ({
  features,
  description,
}) => {
  return (
    <div className="space-y-3 pt-4 border-t border-slate-200/80">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#ffc220] fill-[#ffc220]" />
        <h3 className="text-sm font-black text-slate-900">Key Highlights & Details</h3>
      </div>

      {features && features.length > 0 ? (
        <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
          {features.map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-full bg-blue-50 text-[#0071dc] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-slate-600 leading-relaxed">
          {description || "High-quality consumer product curated and fulfilled by verified Amarzone merchant partners."}
        </p>
      )}
    </div>
  );
};

export default ProductFeaturesList;
