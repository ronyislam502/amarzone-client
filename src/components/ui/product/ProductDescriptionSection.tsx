import React from "react";
import { TProduct } from "@/types/product";
import { Info, Sparkles } from "lucide-react";

interface ProductDescriptionSectionProps {
  product: TProduct;
}

export const ProductDescriptionSection: React.FC<ProductDescriptionSectionProps> = ({
  product,
}) => {
  const descriptionText =
    product.description ||
    `Experience top-tier quality and reliability with the ${product.title}. Carefully engineered to deliver premium performance, this product combines modern design with everyday practicality. Backed by ${product.brand || "Amarzone"}'s dedication to customer satisfaction, each unit is manufactured under stringent quality controls to ensure excellence.`;

  return (
    <div className="py-6 border-b border-slate-200 select-none">
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span>Product Description</span>
      </h2>

      <div className="bg-slate-50/50 rounded-2xl border border-slate-200/70 p-5 sm:p-6 text-slate-700 text-xs sm:text-sm leading-relaxed space-y-4">
        <p className="whitespace-pre-line">{descriptionText}</p>

        {product.tags && product.tags.length > 0 && (
          <div className="pt-2 flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500">Tags:</span>
            {product.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-block bg-white text-slate-600 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-slate-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescriptionSection;
