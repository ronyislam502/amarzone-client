"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Package,
  ShoppingBag,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { useSingleOrderQuery } from "@/src/redux/features/order/orderApi";
import { useAppDispatch } from "@/src/redux/hooks";
import { clearCart } from "@/src/redux/features/order/orderSlice";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const paymentIntentId = searchParams.get("payment_intent");
  const redirectStatus = searchParams.get("redirect_status");
  const orderId = searchParams.get("orderId");

  const isSuccess =
    redirectStatus === "succeeded" || (!redirectStatus && Boolean(paymentIntentId));

  const { data: orderRes } = useSingleOrderQuery(orderId, {
    skip: !orderId,
    pollingInterval: 2500,
  });

  const order = orderRes?.data;

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearCart());
    }
  }, [isSuccess, dispatch]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 select-none">
      <div className="bg-white max-w-lg w-full rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        {isSuccess ? (
          <>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Payment Confirmed!
              </h1>
              <p className="text-xs text-slate-500">
                Your payment was successfully confirmed through Stripe.js.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Order Number:</span>
                <span className="font-mono font-bold text-slate-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  #{order?.orderNo || "CONFIRMED"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Payment Status:</span>
                <span className="badge badge-success text-slate-950 font-bold badge-sm">
                  {order?.paymentStatus || "PAID"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Order Status:</span>
                <span className="font-bold text-slate-800">
                  {order?.status || "CONFIRMED"}
                </span>
              </div>

              {order?.totalPrice && (
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-600 font-semibold">Total Paid:</span>
                  <span className="font-black text-slate-900 text-sm">
                    ${Number(order.totalPrice).toFixed(2)}
                  </span>
                </div>
              )}

              {paymentIntentId && (
                <div className="flex justify-between items-center pt-1 border-t border-slate-200 text-[11px]">
                  <span className="text-slate-400">Payment Intent:</span>
                  <span className="font-mono text-slate-500 truncate max-w-[200px]">
                    {paymentIntentId}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified encrypted transaction via Stripe</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Link
                href="/customer/orders"
                className="btn btn-sm bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold border border-[#fcd200] rounded-xl flex-1 text-xs shadow-xs"
              >
                <Package className="w-3.5 h-3.5" />
                <span>View My Orders</span>
              </Link>
              <Link
                href="/"
                className="btn btn-sm btn-ghost border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl flex-1 text-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600 ring-8 ring-rose-50">
              <AlertCircle className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-xl font-bold text-slate-900">
                Payment Not Completed
              </h1>
              <p className="text-xs text-slate-500">
                The payment could not be confirmed by Stripe. Please return to your cart to retry.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <Link
                href="/cart"
                className="btn btn-sm bg-slate-900 text-white rounded-xl flex-1 text-xs"
              >
                Return to Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
