import React from "react";
import { Lock } from "lucide-react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { BuyBoxInlinePaymentProps } from "./types";

export const BuyBoxInlinePayment: React.FC<BuyBoxInlinePaymentProps> = ({
  paymentEmail,
  setPaymentEmail,
  buyLoading,
  confirmLoading,
  onCancel,
  handlePayAndOrder,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayClick = () => {
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    if (!card) return;
    handlePayAndOrder(stripe, elements, card);
  };

  return (
    <div className="space-y-3 border border-amber-300 rounded-lg p-3 bg-amber-50/50">
      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
        <Lock className="w-3.5 h-3.5 text-slate-600 animate-pulse" />
        <span>Secure Checkout</span>
      </div>

      {/* Email field */}
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-700 block uppercase tracking-wider">
          Email Address
        </label>
        <input
          type="email"
          value={paymentEmail}
          onChange={(e) => setPaymentEmail(e.target.value)}
          placeholder="name@gmail.com"
          disabled={buyLoading || confirmLoading}
          className="w-full px-2.5 py-1.5 border border-base-300 rounded bg-base-100 text-xs font-medium focus:outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185] disabled:bg-base-200"
        />
      </div>

      {/* Card details field using secure Stripe CardElement */}
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-700 block uppercase tracking-wider">
          Card Details
        </label>
        <div className="px-2.5 py-2 border border-base-300 rounded bg-base-100 focus-within:border-[#007185] focus-within:ring-1 focus-within:ring-[#007185]">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "13px",
                  color: "#0f1111",
                  fontFamily: "Inter, system-ui, sans-serif",
                  "::placeholder": {
                    color: "#888",
                  },
                },
                invalid: {
                  color: "#dc2626",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={buyLoading || confirmLoading}
          className="flex-1 py-1.5 bg-[#f0f2f2] hover:bg-[#e3e6e6] text-[#0f1111] font-semibold text-[11px] rounded-full border border-slate-300 transition-all cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handlePayClick}
          disabled={buyLoading || confirmLoading || !stripe || !elements}
          className="flex-1 py-1.5 bg-[#ffa41c] hover:bg-[#fa8900] active:bg-[#e07b00] text-[#0f1111] font-bold text-[11px] rounded-full border border-[#ff8f00] shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {buyLoading || confirmLoading ? (
            <span className="loading loading-spinner loading-xs shrink-0"></span>
          ) : null}
          <span>Pay & Order</span>
        </button>
      </div>
    </div>
  );
};

export default BuyBoxInlinePayment;
