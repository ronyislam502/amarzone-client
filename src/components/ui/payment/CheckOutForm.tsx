"use client";

import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import {
    CheckCircle2,
    Lock,
    CreditCard,
    AlertCircle,
    ArrowRight,
    Copy,
    ShoppingBag,
    Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { clearCart } from "@/redux/features/order/orderSlice";

export interface CheckOutFormProps {
    clientSecret?: string;
    orderId?: string;
    orderNo?: string;
    totalAmount?: number;
    onSuccess?: (transactionId: string) => void;
    onCancel?: () => void;
}

const CheckOutForm: React.FC<CheckOutFormProps> = ({
    clientSecret,
    orderId,
    orderNo,
    totalAmount,
    onSuccess,
    onCancel,
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);

    const [error, setError] = useState<string>("");
    const [transactionId, setTransactionId] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopyTransaction = () => {
        if (!transactionId) return;
        navigator.clipboard.writeText(transactionId);
        setCopied(true);
        toast.info("Transaction ID copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setError("Payment service is initializing. Please wait a moment.");
            return;
        }

        if (!clientSecret) {
            setError("Missing payment authorization secret. Please restart the checkout process.");
            return;
        }

        const card = elements.getElement(CardElement);
        if (card == null) {
            setError("Payment card input not found. Please refresh and try again.");
            return;
        }

        setIsProcessing(true);
        setError("");

        const nameToUse = (currentUser?.name || "Amarzone Customer").trim();
        const emailToUse = currentUser?.email?.trim();

        try {
            // Confirm the card payment with Stripe
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card,
                        billing_details: {
                            name: nameToUse,
                            email: emailToUse,
                        },
                    },
                }
            );

            if (confirmError) {
                console.error("[Stripe Payment Error]:", confirmError);
                const message = confirmError.message || "Payment authorization failed.";
                setError(message);
                toast.error(message);
                setIsProcessing(false);
                return;
            }

            if (paymentIntent && paymentIntent.status === "succeeded") {
                setTransactionId(paymentIntent.id);
                setIsSuccess(true);
                setIsProcessing(false);

                // Clear the shopping cart upon successful payment
                dispatch(clearCart());
                toast.success("Payment completed successfully! Your order is confirmed.");

                if (onSuccess) {
                    onSuccess(paymentIntent.id);
                }
            } else {
                setIsProcessing(false);
                const statusMsg = `Payment status: ${paymentIntent?.status || "unknown"}. Please check your orders.`;
                setError(statusMsg);
                toast.warning(statusMsg);
            }
        } catch (err: any) {
            console.error("[Payment Submit Exception]:", err);
            const errMsg = err?.message || "An unexpected error occurred during payment processing.";
            setError(errMsg);
            toast.error(errMsg);
            setIsProcessing(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // SUCCESS RECEIPT VIEW
    // ─────────────────────────────────────────────────────────────────────────
    if (isSuccess) {
        const displayOrder =
            orderNo || (orderId ? `#ORD-${orderId.slice(-6).toUpperCase()}` : "Confirmed");

        return (
            <div className="text-center space-y-5 py-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/30 shadow-inner">
                    <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                </div>

                <div className="space-y-1.5">
                    <span className="inline-block px-3 py-1 text-[11px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full">
                        Payment Successful
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                        Thank You For Your Order!
                    </h2>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto">
                        Your payment has been authorized and verified. We are now preparing your order for shipment.
                    </p>
                </div>

                {/* Receipt Details */}
                <div className="bg-[#120824] rounded-2xl border border-white/10 p-4 text-left space-y-2.5 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-slate-400 font-medium">Order Number:</span>
                        <span className="font-bold text-white font-mono">{displayOrder}</span>
                    </div>

                    {totalAmount !== undefined && (
                        <div className="flex justify-between items-center pb-2 border-b border-white/10">
                            <span className="text-slate-400 font-medium">Total Paid:</span>
                            <span className="font-black text-amber-400 text-sm">
                                ${Number(totalAmount).toFixed(2)} USD
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-slate-400 font-medium">Payment Gateway:</span>
                        <span className="font-semibold text-indigo-400 flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5" /> Stripe Secure Pay
                        </span>
                    </div>

                    <div className="space-y-1 pt-1">
                        <span className="text-[11px] text-slate-400 font-medium">Transaction ID:</span>
                        <div className="flex items-center justify-between gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                            <span className="font-mono text-[11px] text-slate-300 truncate select-all">
                                {transactionId}
                            </span>
                            <button
                                type="button"
                                onClick={handleCopyTransaction}
                                title="Copy Transaction ID"
                                className="text-slate-400 hover:text-white p-1 rounded transition-colors shrink-0 cursor-pointer"
                            >
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                    <button
                        type="button"
                        onClick={() => {
                            if (onCancel) onCancel();
                            router.push("/customer/orders");
                        }}
                        className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                        <span>View Orders</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (onCancel) onCancel();
                            router.push("/");
                        }}
                        className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Continue Shopping</span>
                    </button>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CHECKOUT PAYMENT FORM VIEW
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <form onSubmit={handleFormSubmit}>
            <div className="space-y-4 select-none pt-1">
                {/* Order Brief Strip */}
                {(orderNo || totalAmount !== undefined) && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                        <div>
                            <span className="text-white font-bold block text-sm">
                                {orderNo ? `Order #${orderNo}` : "Active Order"}
                            </span>
                            <span className="text-[11px] text-slate-400">Standard Card Payment</span>
                        </div>
                        {totalAmount !== undefined && (
                            <div className="text-right">
                                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                                    Amount Due
                                </span>
                                <span className="text-base sm:text-lg font-black text-amber-400">
                                    ${Number(totalAmount).toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Credit Card Element Input Box */}
                <div className="form-control w-full space-y-1">
                    <label className="label py-1">
                        <span className="text-[16px] font-bold text-warning flex items-center justify-between w-full">
                            <span className="flex items-center gap-1.5">
                                <CreditCard className="w-4 h-4 text-warning" />
                                <span>Card Information</span>
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                <span>VISA</span>
                                <span>•</span>
                                <span>MC</span>
                                <span>•</span>
                                <span>AMEX</span>
                            </span>
                        </span>
                    </label>

                    <div className="relative w-full rounded-xl py-3.5 px-3.5 bg-[#120824] border border-warning hover:border-primary focus-within:border-primary transition-all duration-200">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "14px",
                                        color: "#ffffff",
                                        fontFamily: "inherit",
                                        "::placeholder": {
                                            color: "#9ca3af",
                                        },
                                        iconColor: "#f59e0b",
                                    },
                                    invalid: {
                                        color: "#f87171",
                                        iconColor: "#f87171",
                                    },
                                },
                                hidePostalCode: true,
                            }}
                        />
                    </div>
                </div>

                {/* Error Message Alert */}
                {error && (
                    <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl p-3 text-xs animate-in fade-in duration-200">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Action Buttons matching AddDepartment.tsx */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-white/10">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isProcessing}
                            className="w-full sm:w-auto justify-center px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center"
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={!stripe || !clientSecret || isProcessing}
                        className="w-full sm:w-auto justify-center px-6 py-2.5 sm:py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 border border-amber-300/40 shadow-lg shadow-amber-400/20 flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Processing Payment...</span>
                            </>
                        ) : (
                            <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>
                                    {totalAmount !== undefined
                                        ? `Pay $${Number(totalAmount).toFixed(2)} Securely`
                                        : "Pay Now"}
                                </span>
                            </>
                        )}
                    </button>
                </div>

                {/* Footer Trust Note */}
                <p className="text-[10px] text-slate-400 text-center leading-relaxed pt-1">
                    🔒 256-bit SSL encrypted. Payment is processed securely via Stripe. Amarzone does not store card details.
                </p>
            </div>
        </form>
    );
};

export default CheckOutForm;
