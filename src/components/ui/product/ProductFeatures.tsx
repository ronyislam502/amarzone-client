"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductFeaturesListProps {
  features?: string[];
}

export const ProductFeatures: React.FC<ProductFeaturesListProps> = ({
  features,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!features || features.length === 0) {
    return null;
  }

  const featureList = features;
  const displayLimit = 4;
  const hasMore = featureList.length > displayLimit;
  const visibleFeatures = isExpanded
    ? featureList
    : featureList.slice(0, displayLimit);

  return (
    <div className="py-3.5 space-y-2.5 select-none">
      <h3 className="text-sm font-bold text-[#0f1111]">
        About this item
      </h3>

      <ul className="space-y-2.5 text-xs text-slate-700 list-disc list-outside pl-4 leading-relaxed">
        {visibleFeatures.map((feature, idx) => {
          const colonIndex = feature.indexOf(":");
          if (colonIndex > 0 && colonIndex < 45) {
            const titlePart = feature.slice(0, colonIndex + 1);
            const descPart = feature.slice(colonIndex + 1);
            return (
              <li key={idx}>
                <span className="font-bold text-[#0f1111]">{titlePart}</span>
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
          className="mt-1 text-xs font-normal text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-1 cursor-pointer"
        >
          {isExpanded ? (
            <>
              <span>See less details</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>
                See more details ({featureList.length - displayLimit} more)
              </span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ProductFeatures;
