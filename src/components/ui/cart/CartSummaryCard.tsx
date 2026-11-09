"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Lock, ShieldCheck, Tag } from "lucide-react";
import { toast } from "react-toastify";
import { FieldValues } from "react-hook-form";
import AZInput from "@/components/shared/form/AZInput";
import AZForm from "@/components/shared/form/AZFrom";
import { useCreateOrderMutation } from "@/redux/features/order/orderApi";
import { clearCart } from "@/redux/features/order/orderSlice";
import { useDispatch } from "react-redux";
import Payment from "@/components/ui/payment/Payment";

interface CartSummaryCardProps {
  subtotal: number;
  selectedCount: number;
  products: any
  // onProceedToCheckout?: () => void;
  isCheckoutLoading?: boolean;
}

export const CartSummaryCard: React.FC<CartSummaryCardProps> = ({
  subtotal,
  selectedCount,
  products,
  isCheckoutLoading = false,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [promoInput, setPromoInput] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [isGift, setIsGift] = useState(false);

  // Payment Modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    clientSecret: string;
    orderId?: string;
    orderNo?: string;
    totalAmount?: number;
  } | null>(null);

  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation()

  const freeShippingThreshold = 35.0;
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;
  const freeShippingProgress = Math.min(
    Math.round((subtotal / freeShippingThreshold) * 100),
    100
  );
  const amountNeededForFreeShipping = (freeShippingThreshold - subtotal).toFixed(2);

  const discount = Number(
    (subtotal * (discountCode ? 0.1 : 0)).toFixed(2)
  );
  const estimatedTax = selectedCount > 0 ? 0.88 : 0;
  const finalGrandTotal = Number(
    Math.max(0, subtotal - discount + estimatedTax).toFixed(2)
  );

  const handlePromoSubmit = (data: FieldValues) => {
    const promo = {
      code: data.promoCode,
    };

    if (promo.code === "AMARZONE10" || promo.code === "SAVE10") {
      setDiscountCode(promo.code);
      toast.success(`Promo code "${promo.code}" applied!`, {
        position: "bottom-right",
      });
      setPromoInput("");
    } else {
      toast.error("Invalid promo code. Try AMARZONE10 for 10% off.", {
        position: "bottom-right",
      });
    }
  };

  console.log("products", products)

  const handleProceedToCheckout = async () => {
    if (!products || products.length === 0) {
      toast.warning("Your cart is empty.");
      return;
    }

    const firstProduct = products[0];
    const vendor =
      typeof firstProduct.vendor === "object"
        ? firstProduct.vendor?._id
        : firstProduct.vendor;

    const orderData = {
      vendor,
      products: products?.map((prod: any) => ({
        variant: prod.variant || prod._id,
        quantity: prod.quantity,
        price: prod.price,
      })),
    };

    try {
      const orderRes = await createOrder(orderData).unwrap();
      if (orderRes?.success) {
        toast.success(orderRes?.message || "Order initialized successfully!");
        const clientSecret = orderRes?.data?.clientSecret;
        const order = orderRes?.data?.order;

        if (clientSecret) {
          setPaymentData({
            clientSecret,
            orderId: order?._id,
            orderNo: order?.orderNo,
            totalAmount: order?.totalPrice || finalGrandTotal,
          });
          setIsPaymentModalOpen(true);
        } else {
          dispatch(clearCart());
          router.push("/customer/orders");
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to proceed to checkout");
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setPromoInput("");
    toast.info("Promo code removed.");
  };

  return (
    <div className="space-y-4 select-none">
      {/* Main Checkout Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        {/* Free Shipping Milestone */}
        <div className="space-y-1.5">
          {qualifiesForFreeShipping ? (
            <div className="flex items-start gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-[#007600] shrink-0 mt-0.5" />
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
          <div className="text-base sm:text-lg text-slate-900">
            <span>Subtotal ({selectedCount} {selectedCount === 1 ? "item" : "items"}): </span>
            <span className="font-extrabold text-slate-900 text-xl">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          {/* Gift Option */}
          <label className="flex items-center gap-2 mt-2 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isGift}
              onChange={(e) => setIsGift(e.target.checked)}
              className="w-4 h-4 rounded-sm border-slate-300 accent-amber-500 cursor-pointer"
            />
            <span>This order contains a gift</span>
          </label>
        </div>

        {/* Primary Checkout CTA */}
        <button
          type="button"
          disabled={selectedCount === 0 || isCheckoutLoading}
          onClick={handleProceedToCheckout}
          className={`w-full py-2.5 sm:py-3 px-4 rounded-full text-xs sm:text-sm font-semibold shadow-xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${selectedCount > 0 && !isCheckoutLoading
            ? "bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-slate-900 border border-[#fcd200]"
            : "bg-slate-200 text-slate-400 cursor-not-allowed border-transparent"
            }`}
        >
          {isCreatingOrder ? (
            <span className="loading loading-spinner loading-xs text-slate-900" />
          ) : (
            <Lock className="w-4 h-4 stroke-[2.2]" />
          )}
          <span>
            {isCreatingOrder
              ? "Preparing Checkout..."
              : "Proceed to checkout"}
          </span>
        </button>

        {/* Promo Code Input Form */}
        <div className="pt-1 space-y-2">
          {discountCode ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <Tag className="w-3.5 h-3.5" />
                <span>Code {discountCode} Applied (-${discount.toFixed(2)})</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveDiscount}
                className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <AZForm onSubmit={handlePromoSubmit}>
              <div className="flex gap-2">
                <AZInput
                  name="promoCode"
                  placeholder="Enter promo code (e.g. AMARZONE10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  clearable={Boolean(promoInput)}
                  onClear={() => setPromoInput("")}
                />
                <button
                  type="submit"
                  className="btn btn-outline btn-warning"
                >
                  Apply
                </button>
              </div>
            </AZForm>
          )}
        </div>

        {/* Breakdown Details */}
        <div className="pt-2 space-y-2 text-xs text-slate-600">
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

          <div className="flex justify-between font-extrabold text-slate-900 text-sm pt-2.5 border-t border-slate-200">
            <span>Order Total</span>
            <span className="text-base text-slate-900">${finalGrandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Security Assurance Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-[#007600]" />
          <span>100% Secure Checkout Guarantee</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Your payment information is processed securely with 256-bit SSL encryption. We don&apos;t share your details with third parties.
        </p>
      </div>

      {/* Payment Modal */}
      {paymentData?.clientSecret && (
        <Payment
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          clientSecret={paymentData.clientSecret}
          orderId={paymentData.orderId}
          orderNo={paymentData.orderNo}
          totalAmount={paymentData.totalAmount}
        />
      )}
    </div>
  );
};

export default CartSummaryCard;
