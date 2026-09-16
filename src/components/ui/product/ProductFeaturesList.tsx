"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductFeaturesListProps {
  features?: string[];
}

export const ProductFeaturesList: React.FC<ProductFeaturesListProps> = ({
  features = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!features || features.length === 0) return null;

  const displayLimit = 4;
  const hasMore = features.length > displayLimit;
  const visibleFeatures = isExpanded ? features : features.slice(0, displayLimit);

  return (
    <div className="py-3.5 border-b border-slate-200 select-none">
      <h3 className="text-sm font-bold text-slate-900 mb-2.5">
        About this item
      </h3>

      <ul className="space-y-2 text-xs text-slate-700 list-disc list-outside pl-4 leading-relaxed">
        {visibleFeatures.map((feature, idx) => {
          // Check if bullet has "Title: Description" format like Amazon
          const colonIndex = feature.indexOf(":");
          if (colonIndex > 0 && colonIndex < 40) {
            const titlePart = feature.slice(0, colonIndex + 1);
            const descPart = feature.slice(colonIndex + 1);
            return (
              <li key={idx}>
                <span className="font-bold text-slate-900">{titlePart}</span>
                <span>{descPart}</span>
              </li>
            );
          }

          return <li key={idx}>{feature}</li>;
        })}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-1 cursor-pointer"
        >
          {isExpanded ? (
            <>
              <span>Show less</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>See more details ({features.length - displayLimit} more)</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ProductFeaturesList;
