import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { TParentProduct } from "./ProductDetailsView";

interface SimilarItemCardProps {
  categoryProducts: TParentProduct[];
  selectedImage: string;
}

export const SimilarItemCard: React.FC<SimilarItemCardProps> = ({
  categoryProducts,
  selectedImage,
}) => {
  if (categoryProducts.length === 0) return null;

  const similar = categoryProducts[0];
  const thumb = similar?.variants?.[0]?.thumbnail || similar?.variants?.[0]?.images?.[0] || selectedImage;

  return (
    <div className="space-y-2 border-t border-base-300 pt-4">
      <h3 className="text-sm font-bold text-base-content">Consider a similar item</h3>
      <div className="p-3 border border-base-300 rounded-lg bg-base-200 flex gap-3 items-center">
        <div className="w-16 h-16 shrink-0 bg-base-100 border border-base-300 rounded p-1 flex items-center justify-center">
          {thumb ? (
            <Image
              src={thumb}
              alt={similar.title || "Similar item"}
              width={56}
              height={56}
              className="object-contain max-h-full max-w-full"
            />
          ) : (
            <div className="w-12 h-12 bg-slate-100 flex items-center justify-center text-slate-300" />
          )}
        </div>
        <div className="space-y-1 text-xs">
          <span className="bg-[#232f3e] text-[#febd69] px-1.5 py-0.5 rounded-xs font-bold text-[9px]">
            Amazon&apos;s Choice
          </span>
          <a href={`/product/${similar._id}`} className="text-[#007185] hover:text-[#c45500] font-medium line-clamp-2 leading-snug">
            {similar.title}
          </a>
          <div className="flex items-center gap-1 text-[11px]">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="text-slate-500 font-medium">(1,842)</span>
          </div>
          <div className="font-bold text-base-content">$59.99</div>
        </div>
      </div>
    </div>
  );
};
