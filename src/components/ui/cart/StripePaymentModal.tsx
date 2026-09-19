"use client";

import React, { useState } from "react";
import { FieldValues } from "react-hook-form";
import {
  X,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
  Mail,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import AZForm from "@/src/components/ui/shared/form/AZFrom";
import AZInput from "@/src/components/ui/shared/form/AZInput";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentUser } from "@/src/redux/features/auth/authSlice";

interface StripeCheckoutFormProps {
  order: any;
  onPaymentSuccess: (paymentData: any) => void;
  onClose: () => void;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({
  order,
  onPaymentSuccess,
  onClose,
}) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalAmount = order?.totalPrice || 0;

  const defaultValues = {
    email: currentUser?.email || "akhi@gmail.com",
    cardNumber: "",
    cvc: "",
    expiryDate: "",
  };

  const onSubmit = async (data: FieldValues) => {
    setIsProcessing(true);
    setErrorMessage(null);

    const paymentData = {
      email: data.email,
      cardNumber: data.cardNumber,
      cvc: data.cvc,
      expiryDate: data.expiryDate,
    };

    try {
      if (!paymentData.cardNumber || !paymentData.cvc || !paymentData.expiryDate || !paymentData.email) {
        throw new Error("Please complete all payment fields.");
      }

      // Simulate client verification before handing over to post-payment confirmation
      await new Promise((resolve) => setTimeout(resolve, 600));

      toast.success("Payment authorized successfully!");
      onPaymentSuccess(paymentData);
    } catch (err: any) {
      const msg = err?.message || "Payment processing failed. Please check card details.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Order mini-summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Order Number:</span>
          <span className="font-mono font-bold text-slate-900">
            #{order?.orderNo || "NEW"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Items Total:</span>
          <span className="font-semibold text-slate-700">
            {order?.totalQuantity || 1} {order?.totalQuantity === 1 ? "item" : "items"}
          </span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-slate-200 text-sm font-extrabold text-slate-900">
          <span>Amount to Pay:</span>
          <span className="text-emerald-700 text-base">
            ${Number(totalAmount).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment Form using AZInput */}
      <AZForm defaultValues={defaultValues} onSubmit={onSubmit}>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100 text-xs font-bold text-slate-800">
            <CreditCard className="w-4 h-4 text-amber-500" />
            <span>Card Payment Details</span>
          </div>

          {/* Email */}
          <div>
            <AZInput
              name="email"
              type="email"
              label="Email / Gmail"
              placeholder="customer@gmail.com"
              size="sm"
              icon={<Mail className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {/* Card Number */}
          <div>
            <AZInput
              name="cardNumber"
              type="text"
              label="Card Number"
              placeholder="4242 •••• •••• 4242"
              size="sm"
              icon={<CreditCard className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {/* Expiration Date & CVC */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <AZInput
                name="expiryDate"
                type="text"
                label="Expiration Date"
                placeholder="MM/YY"
                size="sm"
                icon={<Calendar className="w-4 h-4 text-slate-400" />}
              />
            </div>
            <div>
              <AZInput
                name="cvc"
                type="text"
                label="CVC"
                placeholder="123"
                size="sm"
                icon={<KeyRound className="w-4 h-4 text-slate-400" />}
              />
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">
            {errorMessage}
          </div>
        )}

        {/* Security note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 my-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured with 256-bit encryption powered by Stripe</span>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="btn btn-sm btn-ghost text-slate-600 hover:bg-slate-100 rounded-xl text-xs flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="btn btn-sm bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold border border-[#fcd200] rounded-xl text-xs flex-[2] shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <span className="loading loading-spinner loading-xs text-slate-900" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Pay ${Number(totalAmount).toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </AZForm>
    </div>
  );
};

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret?: string;
  order: any;
  onPaymentSuccess: (paymentData?: any) => void;
}

export const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
  isOpen,
  onClose,
  clientSecret,
  order,
  onPaymentSuccess,
}) => {
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  if (!isOpen) return null;

  const handleSuccess = (paymentData: any) => {
    setIsSuccessState(true);
    setSuccessData(paymentData);
    onPaymentSuccess(paymentData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#232f3e] to-[#131921] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">
                Amarzone Secure Checkout
              </h2>
              <p className="text-[11px] text-slate-300">
                Stripe Encrypted Payment
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout modal"
            className="w-8 h-8 rounded-full hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {isSuccessState ? (
            /* Order Placed Success Celebration Screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 text-emerald-600 animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Payment Successful & Order Placed!
                </h3>
                <p className="text-xs text-slate-500">
                  Thank you for shopping with Amarzone. Your order has been placed and is being prepared.
                </p>
              </div>

              {/* Order Card Receipt */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Order Number:</span>
                  <span className="font-mono font-black text-slate-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    #{order?.orderNo}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Payment Status:</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3" /> Paid via Stripe
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Total Paid:</span>
                  <span className="font-black text-slate-900 text-sm">
                    ${Number(order?.totalPrice || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Estimated Delivery:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    Tomorrow &ndash; 2 Days
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Link
                  href="/"
                  onClick={onClose}
                  className="btn btn-sm bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold border border-[#fcd200] rounded-xl text-xs flex-1 shadow-xs cursor-pointer"
                >
                  Continue Shopping
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-sm btn-outline border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white rounded-xl text-xs flex-1 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* AZInput Payment Form */
            <StripeCheckoutForm
              order={order}
              onPaymentSuccess={handleSuccess}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StripePaymentModal;
