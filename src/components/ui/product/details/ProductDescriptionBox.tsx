import React from "react";
import { ProductDescriptionBoxProps } from "./types";

export const ProductDescriptionBox: React.FC<ProductDescriptionBoxProps> = ({
  description,
}) => {
  if (!description) return null;

  return (
    <div className="space-y-1.5 border-t border-slate-200 pt-3">
      <h3 className="text-xs font-bold text-[#0f1111]">Product Description</h3>
      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
        {description}
      </p>
    </div>
  );
};

export default ProductDescriptionBox;
