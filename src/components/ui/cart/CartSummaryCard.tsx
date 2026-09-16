"use client";

import React, { useState } from "react";
import { CheckCircle2, Lock, ShieldCheck, Tag, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface CartSummaryCardProps {
  subtotal: number;
  selectedCount: number;
  discount: number;
  discountCode: string;
  onApplyDiscount: (code: string) => boolean;
  onRemoveDiscount: () => void;
  taxRate?: number;
  tax?: number;
  grandTotal?: number;
  onProceedToCheckout?: () => void;
  isCheckoutLoading?: boolean;
}

export const CartSummaryCard: React.FC<CartSummaryCardProps> = ({
  subtotal,
  selectedCount,
  discount,
  discountCode,
  onApplyDiscount,
  onRemoveDiscount,
  taxRate = 0.05,
  tax: propTax,
  grandTotal: propGrandTotal,
  onProceedToCheckout,
  isCheckoutLoading = false,
}) => {
  const router = useRouter();
  const [promoInput, setPromoInput] = useState("");
  const [isGift, setIsGift] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const freeShippingThreshold = 35.0;
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;
  const freeShippingProgress = Math.min(
    Math.round((subtotal / freeShippingThreshold) * 100),
    100
  );
  const amountNeededForFreeShipping = (freeShippingThreshold - subtotal).toFixed(2);

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const estimatedTax = propTax !== undefined ? propTax : discountedSubtotal * taxRate;
  const finalGrandTotal =
    propGrandTotal !== undefined
      ? propGrandTotal
      : discountedSubtotal + estimatedTax;

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const success = onApplyDiscount(promoInput.trim().toUpperCase());
    if (success) {
      toast.success(`Promo code "${promoInput.toUpperCase()}" applied!`, {
        position: "bottom-right",
      });
      setPromoInput("");
    } else {
      toast.error("Invalid promo code. Try AMARZONE10 for 10% off.", {
        position: "bottom-right",
      });
    }
  };

  const handleProceedToCheckout = () => {
    if (selectedCount === 0) {
      toast.info("Please select at least 1 item to checkout.");
      return;
    }
    if (onProceedToCheckout) {
      onProceedToCheckout();
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/checkout");
    }, 400);
  };

  return (
    <div className="space-y-4 select-none">
      {/* Main Checkout Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        {/* Free Shipping Milestone */}
        <div className="space-y-1.5 pb-2 border-b border-slate-100">
          {qualifiesForFreeShipping ? (
            <div className="flex items-start gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#007600]">
                  Your order qualifies for FREE Shipping.
                </span>{" "}
                <span className="text-slate-500">
                  Choose this option at checkout.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-xs">
              <p className="text-slate-700">
                Add{" "}
                <strong className="text-slate-900 font-bold">
                  ${amountNeededForFreeShipping}
                </strong>{" "}
                of eligible items to get{" "}
                <span className="font-bold text-[#007600]">FREE Shipping</span>.
              </p>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Subtotal */}
        <div>
          <div className="text-base sm:text-lg text-slate-800">
            <span>Subtotal ({selectedCount} {selectedCount === 1 ? "item" : "items"}): </span>
            <span className="font-extrabold text-slate-900 text-xl">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          {/* Gift Option */}
          <label className="flex items-center gap-2 mt-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={isGift}
              onChange={(e) => setIsGift(e.target.checked)}
              className="checkbox checkbox-xs checkbox-warning rounded-sm"
            />
            <span>This order contains a gift</span>
          </label>
        </div>

        {/* Primary Checkout CTA */}
        <button
          type="button"
          disabled={selectedCount === 0 || isSubmitting || isCheckoutLoading}
          onClick={handleProceedToCheckout}
          className={`w-full py-3 px-4 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
            selectedCount > 0 && !isCheckoutLoading
              ? "bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-slate-900 border border-[#fcd200]"
              : "bg-slate-200 text-slate-400 cursor-not-allowed border-transparent"
          }`}
        >
          {isCheckoutLoading ? (
            <span className="loading loading-spinner loading-xs text-slate-900" />
          ) : (
            <Lock className="w-4 h-4 stroke-[2.2]" />
          )}
          <span>
            {isCheckoutLoading
              ? "Preparing Checkout..."
              : isSubmitting
              ? "Proceeding..."
              : "Proceed to checkout"}
          </span>
        </button>

        {/* Promo Code Input Form */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          {discountCode ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <Tag className="w-3.5 h-3.5" />
                <span>Code {discountCode} Applied (-${discount.toFixed(2)})</span>
              </div>
              <button
                type="button"
                onClick={onRemoveDiscount}
                className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handlePromoSubmit} className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter promo code (e.g. AMARZONE10)"
                className="input input-sm flex-1 text-xs rounded-xl bg-slate-50 border-slate-300 focus:border-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                className="btn btn-sm btn-outline border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white rounded-xl text-xs font-bold"
              >
                Apply
              </button>
            </form>
          )}
        </div>

        {/* Breakdown Details */}
        <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Items Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Promo Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Estimated Shipping</span>
            <span className="text-[#007600] font-semibold">
              {qualifiesForFreeShipping ? "FREE" : "$4.99"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Estimated Tax</span>
            <span>${estimatedTax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-extrabold text-slate-900 text-sm pt-2 border-t border-slate-200">
            <span>Order Total</span>
            <span className="text-base text-slate-900">${finalGrandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Security Assurance Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Secure Checkout Guarantee</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Your payment information is processed securely with 256-bit SSL encryption. We don&apos;t share your details with third parties.
        </p>
      </div>
    </div>
  );
};

export default CartSummaryCard;
