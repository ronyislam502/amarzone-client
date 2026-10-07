"use client";

import React, { useMemo, useState } from "react";
import {
  X,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";

/* =========================================================
   Stripe
========================================================= */

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

/* =========================================================
   Types
========================================================= */

interface StripeCheckoutFormProps {
  order: any;
  clientSecret: string;
  onPaymentSubmitted: () => void;
  onClose: () => void;
}

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret?: string;
  order: any;
  onPaymentSuccess: () => void;
}

/* =========================================================
   Stripe Checkout Form
========================================================= */

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({
  order,
  clientSecret,
  onPaymentSubmitted,
  onClose,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalAmount = Number(order?.totalPrice || 0);

  /* =========================================================
     Handle Stripe Payment
  ========================================================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage(
        "Stripe payment is not ready yet. Please try again."
      );

      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      /**
       * Stripe handles the sensitive payment information.
       *
       * We DO NOT send:
       * - card number
       * - CVC
       * - expiry date
       *
       * to our backend.
       */

      const { error, paymentIntent } =
        await stripe.confirmPayment({
          elements,

          confirmParams: {
            return_url: `${window.location.origin}/payment/success?orderId=${order?._id}`,
          },

          /**
           * if_required means:
           *
           * - Stripe redirects when required
           * - Otherwise it can return the PaymentIntent here
           */
          redirect: "if_required",
        });

      /* =====================================================
         Stripe returned an error
      ===================================================== */

      if (error) {
        const message =
          error.message ||
          "Payment failed. Please check your payment details.";

        setErrorMessage(message);
        toast.error(message);

        setIsProcessing(false);

        return;
      }

      /* =====================================================
         PaymentIntent returned
      ===================================================== */

      if (paymentIntent) {
        switch (paymentIntent.status) {
          /* -------------------------------------------------
             Payment succeeded
          ------------------------------------------------- */

          case "succeeded": {
            toast.success(
              "Payment submitted successfully. Your order is being confirmed."
            );

            /**
             * IMPORTANT:
             *
             * We DO NOT update paymentStatus here.
             *
             * Your server-side Stripe webhook:
             *
             * stripeWebhookPayment
             *
             * will receive:
             *
             * payment_intent.succeeded
             *
             * and update the order in the database.
             */

            onPaymentSubmitted();

            break;
          }

          /* -------------------------------------------------
             Payment processing
          ------------------------------------------------- */

          case "processing": {
            toast.info(
              "Your payment is being processed. Please wait for confirmation."
            );

            onPaymentSubmitted();

            break;
          }

          /* -------------------------------------------------
             Additional action required
          ------------------------------------------------- */

          case "requires_action": {
            setErrorMessage(
              "Additional payment authentication is required."
            );

            break;
          }

          /* -------------------------------------------------
             Payment method failed
          ------------------------------------------------- */

          case "requires_payment_method": {
            setErrorMessage(
              "Payment failed. Please check your payment method and try again."
            );

            break;
          }

          /* -------------------------------------------------
             Other status
          ------------------------------------------------- */

          default: {
            setErrorMessage(
              "Payment is still being processed. Please wait for confirmation."
            );
          }
        }
      }
    } catch (error: any) {
      const message =
        error?.message ||
        "Something went wrong while processing your payment.";

      setErrorMessage(message);

      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* =====================================================
          Order Mini Summary
      ===================================================== */}

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
        {/* Order Number */}

        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">
            Order Number:
          </span>

          <span className="font-mono font-bold text-slate-900">
            #{order?.orderNo || "NEW"}
          </span>
        </div>

        {/* Items */}

        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">
            Items Total:
          </span>

          <span className="font-semibold text-slate-700">
            {order?.totalQuantity || 1}{" "}
            {order?.totalQuantity === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Amount */}

        <div className="flex justify-between items-center pt-1 border-t border-slate-200 text-sm font-extrabold text-slate-900">
          <span>Amount to Pay:</span>

          <span className="text-emerald-700 text-base">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* =====================================================
          Stripe Payment Element
      ===================================================== */}

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5">
        {/* Header */}

        <div className="flex items-center gap-2 pb-1 border-b border-slate-100 text-xs font-bold text-slate-800">
          <CreditCard className="w-4 h-4 text-amber-500" />

          <span>Card Payment Details</span>
        </div>

        {/* Stripe PaymentElement */}

        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {/* =====================================================
          Error
      ===================================================== */}

      {errorMessage && (
        <div className="flex items-start gap-2 mt-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

          <span>{errorMessage}</span>
        </div>
      )}

      {/* =====================================================
          Security
      ===================================================== */}

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 my-3">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />

        <span>
          Secured with Stripe encrypted payment processing
        </span>
      </div>

      {/* =====================================================
          Buttons
      ===================================================== */}

      <div className="flex items-center gap-3 pt-1">
        {/* Cancel */}

        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="btn btn-sm btn-ghost text-slate-600 hover:bg-slate-100 rounded-xl text-xs flex-1"
        >
          Cancel
        </button>

        {/* Pay */}

        <button
          type="submit"
          disabled={
            !stripe ||
            !elements ||
            isProcessing
          }
          className="btn btn-sm bg-[#ffd814] hover:bg-[#f7ca00] disabled:bg-slate-300 disabled:border-slate-300 text-slate-900 font-bold border border-[#fcd200] rounded-xl text-xs flex-[2] shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />

              <span>
                Processing Payment...
              </span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 stroke-[2.2]" />

              <span>
                Pay ${totalAmount.toFixed(2)}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

/* =========================================================
   Stripe Payment Modal
========================================================= */

export const StripePaymentModal: React.FC<
  StripePaymentModalProps
> = ({
  isOpen,
  onClose,
  clientSecret,
  order,
  onPaymentSuccess,
}) => {
    const [isSuccessState, setIsSuccessState] =
      useState(false);

    /* =========================================================
       Stripe Elements Options
    ========================================================= */

    const options = useMemo(() => {
      if (!clientSecret) {
        return undefined;
      }

      return {
        clientSecret,

        appearance: {
          theme: "stripe" as const,

          variables: {
            colorPrimary: "#f59e0b",
            colorBackground: "#ffffff",
            colorText: "#0f172a",
            colorDanger: "#e11d48",

            fontFamily:
              "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",

            borderRadius: "10px",
          },

          rules: {
            ".Input": {
              border: "1px solid #e2e8f0",
              boxShadow: "none",
            },

            ".Input:focus": {
              border: "1px solid #f59e0b",
              boxShadow:
                "0 0 0 1px #f59e0b",
            },

            ".Label": {
              fontWeight: "600",
              color: "#334155",
            },
          },
        },
      };
    }, [clientSecret]);

    /* =========================================================
       Modal Closed
    ========================================================= */

    if (!isOpen) {
      return null;
    }

    /* =========================================================
       Payment Submitted
    ========================================================= */

    const handlePaymentSubmitted = () => {
      /**
       * IMPORTANT:
       *
       * This only means Stripe accepted/submitted the payment.
       *
       * It does NOT directly update our database.
       *
       * Server-side webhook:
       *
       * stripeWebhookPayment
       *
       * is responsible for final payment confirmation.
       */

      setIsSuccessState(true);

      onPaymentSuccess();
    };

    /* =========================================================
       JSX
    ========================================================= */

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
        <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* ===================================================
            Header
        =================================================== */}

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
              disabled={isSuccessState}
              aria-label="Close checkout modal"
              className="w-8 h-8 rounded-full hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ===================================================
            Modal Body
        =================================================== */}

          <div className="p-5 sm:p-6">
            {/* =================================================
              Payment Submitted / Confirmation Screen
          ================================================= */}

            {isSuccessState ? (
              <div className="text-center py-4 space-y-4">
                {/* Icon */}

                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 text-emerald-600 animate-in zoom-in-75 duration-300">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>

                {/* Title */}

                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Payment Submitted!
                  </h3>

                  <p className="text-xs text-slate-500">
                    Your payment has been submitted to Stripe.
                    We are confirming your order now.
                  </p>
                </div>

                {/* =================================================
                  Order Receipt
              ================================================= */}

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2.5">
                  {/* Order Number */}

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">
                      Order Number:
                    </span>

                    <span className="font-mono font-black text-slate-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      #{order?.orderNo}
                    </span>
                  </div>

                  {/* Payment Status */}

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">
                      Payment:
                    </span>

                    <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Loader2 className="w-3 h-3 animate-spin" />

                      Confirming
                    </span>
                  </div>

                  {/* Amount */}

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">
                      Amount:
                    </span>

                    <span className="font-black text-slate-900 text-sm">
                      $
                      {Number(
                        order?.totalPrice || 0
                      ).toFixed(2)}
                    </span>
                  </div>

                  {/* Order Status */}

                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-medium">
                      Order Status:
                    </span>

                    <span className="font-bold text-slate-800">
                      Waiting for Stripe confirmation
                    </span>
                  </div>
                </div>

                {/* =================================================
                  Information
              ================================================= */}

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-left">
                  <p className="text-[11px] leading-relaxed text-blue-700">
                    Your payment is being verified by Stripe.
                    The order will be marked as paid automatically
                    after our server receives the Stripe webhook
                    confirmation.
                  </p>
                </div>

                {/* =================================================
                  Buttons
              ================================================= */}

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  {/* Continue Shopping */}

                  <Link
                    href="/"
                    onClick={onClose}
                    className="btn btn-sm bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold border border-[#fcd200] rounded-xl text-xs flex-1 shadow-xs cursor-pointer"
                  >
                    Continue Shopping
                  </Link>

                  {/* Done */}

                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-sm btn-outline border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white rounded-xl text-xs flex-1 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : !clientSecret ? (
              /* =================================================
                 Missing Client Secret
              ================================================= */

              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-7 h-7 text-rose-600" />
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  Payment Could Not Start
                </h3>

                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We could not initialize Stripe payment
                  for this order. Please close this window
                  and try again.
                </p>

                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-sm bg-slate-900 text-white rounded-xl px-6"
                >
                  Close
                </button>
              </div>
            ) : (
              /* =================================================
                 Real Stripe Payment
              ================================================= */

              <Elements
                stripe={stripePromise}
                options={options}
              >
                <StripeCheckoutForm
                  order={order}
                  clientSecret={clientSecret}
                  onPaymentSubmitted={
                    handlePaymentSubmitted
                  }
                  onClose={onClose}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    );
  };

export default StripePaymentModal;