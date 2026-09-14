import React from "react";
import { Check } from "lucide-react";
import { ProductToastProps } from "./types";

export const ProductToast: React.FC<ProductToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="toast toast-top toast-center z-50">
      <div className="alert alert-success text-slate-900 font-bold shadow-lg flex gap-2 rounded-xl">
        <Check className="w-5 h-5 text-emerald-800" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default ProductToast;
