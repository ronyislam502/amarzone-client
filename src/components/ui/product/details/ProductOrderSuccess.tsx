import React from "react";
import { Check } from "lucide-react";
import { ProductOrderSuccessProps } from "./types";

export const ProductOrderSuccess: React.FC<ProductOrderSuccessProps> = ({
  orderNo,
  totalPrice,
  onReset,
}) => {
  return (
    <div className="border border-emerald-300 rounded-lg p-5 bg-emerald-50 text-center space-y-4 shadow-sm">
      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
        <Check className="w-6 h-6 stroke-[3]" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-sm font-bold text-slate-850">Order Placed!</h3>
        <p className="text-[11px] text-slate-500">
          Your payment of{" "}
          <span className="font-bold text-slate-800">${totalPrice.toFixed(2)}</span> has been
          securely processed.
        </p>
        <div className="bg-white border border-emerald-200 rounded p-2 inline-block font-mono text-xs text-slate-705 font-bold">
          Order: #{orderNo}
        </div>
      </div>
      <div className="pt-2 flex flex-col gap-2">
        <a
          href="/customer"
          className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-semibold text-xs rounded-full shadow-xs border border-[#fcd200] transition-all text-center block"
        >
          View My Orders
        </a>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-[#007185] hover:underline cursor-pointer"
        >
          Buy Again / Reset
        </button>
      </div>
    </div>
  );
};

export default ProductOrderSuccess;
