"use client";

import React from "react";
import { TProduct } from "@/types/product";
import { CheckCircle2, Volume2, ShieldCheck, Cpu } from "lucide-react";

interface ProductDescriptionSectionProps {
  product?: TProduct;
}

export const ProductDescriptionSection: React.FC<ProductDescriptionSectionProps> = ({
  product,
}) => {
  if (!product) return null;

  const brand = product.brand;
  const description = (product as any)?.description;
  const features = product.features || [];

  return (
    <div className="pt-8 border-t border-slate-200 space-y-6 select-none">
      <div>
        <h2 className="text-lg font-bold text-[#0f1111] mb-2">
          Product Overview
        </h2>
        {description ? (
          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            {description}
          </p>
        ) : (
          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            Discover premium quality with {brand ? `${brand}'s ` : ""}official catalog on Amarzone. Verified authentic and backed by Amarzone customer satisfaction guarantees.
          </p>
        )}
      </div>

      {features.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.slice(0, 3).map((feat, i) => (
            <div
              key={i}
              className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-amber-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {feat}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDescriptionSection;
