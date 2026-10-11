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
  Package,
  ShoppingBag,
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
import { useSingleOrderQuery } from "@/src/redux/features/order/orderApi";

/* =========================================================
   Stripe Initialization
   - Uses Stripe Publishable Key only (never secret key on client)
========================================================= */

const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51RSEX1FKhIbRM6LAdScyCtaUroSASkmQk6pIocbHanrqPA1jabmwrAf9R0tbXi3dbRRGFYtSYD6Zv51TH2JNJQYf00q0XDIsz1";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

/* =========================================================
   Types
========================================================= */

interface StripeCheckoutFormProps {
  order: any;
  clientSecret: string;
  onPaymentSubmitted: (paymentIntent?: any) => void;
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
     Handle Stripe Payment Confirmation
     - Uses the exact clientSecret from the order creation response
     - Confirms via Stripe.js Elements
  ========================================================= */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Stripe payment is not ready yet. Please try again.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      /**
       * Confirm payment using Stripe.js and the exact clientSecret
       * of this specific order configured in Elements.
       */
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?orderId=${order?._id}`,
        },
        redirect: "if_required",
      });

      /* -----------------------------------------------------
         Stripe returned an error (card decline, validation, etc.)
      ----------------------------------------------------- */
      if (error) {
        const message =
          error.message ||
          "Payment failed. Please verify your card details and try again.";
        setErrorMessage(message);
        toast.error(message);
        setIsProcessing(false);
        return;
      }

      /* -----------------------------------------------------
         PaymentIntent returned
      ----------------------------------------------------- */
      if (paymentIntent) {
        switch (paymentIntent.status) {
          case "succeeded": {
            toast.success(
              "Payment confirmed successfully! Your order is being finalized."
            );
            onPaymentSubmitted(paymentIntent);
            break;
          }

          case "processing": {
            toast.info(
              "Your payment is being processed. Please wait for confirmation."
            );
            onPaymentSubmitted(paymentIntent);
            break;
          }

          case "requires_action": {
            // Additional 3D Secure authentication required
            toast.info("Additional card authentication is required...");
            const nextActionResult = await stripe.handleNextAction({
              clientSecret,
            });

            if (nextActionResult.error) {
              const msg =
                nextActionResult.error.message ||
                "Additional authentication failed.";
              setErrorMessage(msg);
              toast.error(msg);
            } else if (
              nextActionResult.paymentIntent?.status === "succeeded"
            ) {
              toast.success("Authentication successful! Payment confirmed.");
              onPaymentSubmitted(nextActionResult.paymentIntent);
            } else {
              setErrorMessage("Authentication incomplete. Please try again.");
            }
            break;
          }

          case "requires_payment_method": {
            setErrorMessage(
              "Payment failed. Please check your payment method and try again."
            );
            toast.error("Payment method was declined. Please try another card.");
            break;
          }

          default: {
            setErrorMessage(
              `Payment status: ${paymentIntent.status}. Waiting for confirmation.`
            );
            onPaymentSubmitted(paymentIntent);
          }
        }
      }
    } catch (error: any) {
      const message =
        error?.message || "Something went wrong while processing your payment.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  /* =========================================================
     Form JSX
  ========================================================= */

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Order Mini Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Order Number:</span>
          <span className="font-mono font-bold text-slate-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
            #{order?.orderNo || "NEW"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Items Total:</span>
          <span className="font-semibold text-slate-700">
            {order?.totalQuantity || 1}{" "}
            {order?.totalQuantity === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="flex justify-between items-center pt-1.5 border-t border-slate-200 text-sm font-extrabold text-slate-900">
          <span>Amount to Pay:</span>
          <span className="text-emerald-700 text-base font-black">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100 text-xs font-bold text-slate-800">
          <CreditCard className="w-4 h-4 text-amber-500" />
          <span>Card Payment Details</span>
        </div>

        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Security badge */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 my-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Secured with Stripe 256-bit encrypted payment processing</span>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="btn btn-sm btn-ghost text-slate-600 hover:bg-slate-100 rounded-xl text-xs flex-1 cursor-pointer disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="btn btn-sm bg-[#ffd814] hover:bg-[#f7ca00] disabled:bg-slate-300 disabled:border-slate-300 text-slate-900 font-bold border border-[#fcd200] rounded-xl text-xs flex-[2] shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Pay ${totalAmount.toFixed(2)}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

/* =========================================================
   Stripe Payment Modal Component
========================================================= */

export const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
  isOpen,
  onClose,
  clientSecret,
  order,
  onPaymentSuccess,
}) => {
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [confirmedPaymentIntent, setConfirmedPaymentIntent] = useState<any>(null);

  // Poll the single order to update status when Stripe Webhook completes
  const { data: orderRes } = useSingleOrderQuery(order?._id, {
    skip: !order?._id || !isSuccessState,
    pollingInterval: 2000,
  });

  const liveOrder = orderRes?.data || order;
  const isPaidInBackend =
    liveOrder?.paymentStatus === "PAID" ||
    confirmedPaymentIntent?.status === "succeeded";

  /* =========================================================
     Stripe Elements Options configured with clientSecret
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
            boxShadow: "0 0 0 1px #f59e0b",
          },
          ".Label": {
            fontWeight: "600",
            color: "#334155",
          },
        },
      },
    };
  }, [clientSecret]);

  if (!isOpen) {
    return null;
  }

  /* =========================================================
     Payment Submitted Handler
  ========================================================= */

  const handlePaymentSubmitted = (paymentIntent?: any) => {
    if (paymentIntent) {
      setConfirmedPaymentIntent(paymentIntent);
    }
    setIsSuccessState(true);
    onPaymentSuccess();
  };

  const handleClose = () => {
    setIsSuccessState(false);
    setConfirmedPaymentIntent(null);
    onClose();
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
                Stripe Encrypted Payment Confirmation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close checkout modal"
            className="w-8 h-8 rounded-full hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {isSuccessState ? (
            /* Payment Submitted & Confirmed Screen */
            <div className="text-center py-3 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 text-emerald-600 animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {isPaidInBackend ? "Payment Confirmed!" : "Payment Submitted!"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isPaidInBackend
                    ? "Your order has been paid and confirmed successfully."
                    : "Your payment was submitted to Stripe. Confirming order..."}
                </p>
              </div>

              {/* Order Receipt */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Order Number:</span>
                  <span className="font-mono font-black text-slate-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    #{liveOrder?.orderNo || order?.orderNo}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Payment Status:</span>
                  {liveOrder?.paymentStatus === "PAID" ? (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      PAID
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Confirming Webhook
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Amount:</span>
                  <span className="font-black text-slate-900 text-sm">
                    ${Number(liveOrder?.totalPrice || order?.totalPrice || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Order Status:</span>
                  <span className="font-bold text-slate-800">
                    {liveOrder?.status || "CONFIRMED"}
                  </span>
                </div>

                {confirmedPaymentIntent?.id && (
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-400">Transaction ID:</span>
                    <span className="font-mono text-slate-600 truncate max-w-[200px]">
                      {confirmedPaymentIntent.id}
                    </span>
                  </div>
                )}
              </div>

              {/* Information message */}
              <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-3 text-left">
                <p className="text-[11px] leading-relaxed text-emerald-800">
                  Stripe Payment confirmed via client secret for Order #{liveOrder?.orderNo || order?.orderNo}.
                  You can track shipment progress and download invoices anytime from your customer account.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Link
                  href="/customer/orders"
                  onClick={handleClose}
                  className="btn btn-sm bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold border border-[#fcd200] rounded-xl text-xs flex-1 shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>View My Orders</span>
                </Link>

                <Link
                  href="/"
                  onClick={handleClose}
                  className="btn btn-sm btn-outline border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white rounded-xl text-xs flex-1 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          ) : !clientSecret ? (
            /* Missing Client Secret Error Screen */
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
                <AlertCircle className="w-7 h-7" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Payment Could Not Start
              </h3>

              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No valid client secret was returned for this order. Please try
                creating the order again.
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="btn btn-sm bg-slate-900 text-white rounded-xl px-6 cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            /* Real Stripe Elements Checkout - Keyed by clientSecret to prevent reuse */
            <Elements
              key={clientSecret}
              stripe={stripePromise}
              options={options}
            >
              <StripeCheckoutForm
                order={order}
                clientSecret={clientSecret}
                onPaymentSubmitted={handlePaymentSubmitted}
                onClose={handleClose}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default StripePaymentModal;