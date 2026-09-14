import React from "react";
import { Flag } from "lucide-react";

export const ProductReportIssue: React.FC = () => {
  return (
    <div className="pt-2 border-t border-slate-200 text-xs">
      <button
        type="button"
        className="text-[#565959] hover:text-[#0f1111] flex items-center gap-1.5 cursor-pointer"
      >
        <Flag className="w-3.5 h-3.5 text-slate-400" />
        <span>Report an issue with this product or seller</span>
      </button>
    </div>
  );
};

export default ProductReportIssue;
