"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCurrentUser, useCurrentToken } from "@/redux/features/auth/authSlice";
import { useCreateOrderMutation } from "@/redux/features/order/orderApi";
import { removeFromCart } from "@/redux/features/order/orderSlice";
import { TCartProduct } from "@/types/order";
import CartItemList from "./CartItemList";
import CartSummaryCard from "./CartSummaryCard";
import CartEmptyState from "./CartEmptyState";
import { FieldValues } from "react-hook-form";

const CartData = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const currentToken = useAppSelector(useCurrentToken);
    const cartProducts = useAppSelector((state) => state.cart?.products || []);

    const [createOrderMutation, { isLoading: isCreatingOrder }] =
        useCreateOrderMutation();

    // Convert raw cart items to TCartProduct
    const cartItems: TCartProduct[] = useMemo(() => {
        return cartProducts?.map((product: any) => {
            const id = product._id || product.variantId || product.id || "";
            return {
                ...product,
                _id: id,
                id: id,
                isSelected: true,
            };
        });
    }, [cartProducts]);


    const [selectedItems, setSelectedItems] = useState<TCartProduct[]>(cartItems);
    const [selectedCount, setSelectedCount] = useState<number>(
        cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)
    );
    const [subtotal, setSubtotal] = useState<number>(
        Number(
            cartItems
                .reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0)
                .toFixed(2)
        )
    );

    const handleSelectionChange = useCallback(
        (items: TCartProduct[], nextSubtotal: number, nextCount: number) => {
            setSelectedItems(items);
            setSubtotal(nextSubtotal);
            setSelectedCount(nextCount);
        },
        []
    );

    return (
        <div className="bg-[#f0f2f2]/60 min-h-screen py-5 select-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
                {/* Breadcrumb Navigation */}
                <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-500">
                    <Link href="/" className="hover:text-blue-600 hover:underline">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3 mx-1 text-slate-400" />
                    <span className="text-slate-800 font-semibold">Shopping Cart</span>
                </nav>

                {/* If cart is empty */}
                {cartItems.length === 0 ? (
                    <div className="space-y-8">
                        <CartEmptyState />
                    </div>
                ) : (
                    /* 2-Column Cart Layout */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        {/* Left Column: Cart Items List & Saved for Later */}
                        <div className="lg:col-span-8 space-y-5">
                            <CartItemList
                                items={cartItems}
                                onSelectionChange={handleSelectionChange}
                            />
                        </div>

                        {/* Right Column: Checkout Summary Card */}
                        <div className="lg:col-span-4 sticky top-20">
                            <CartSummaryCard
                                subtotal={subtotal}
                                selectedCount={selectedCount}
                                products={selectedItems}
                                // onProceedToCheckout={handleProceedToCheckout}
                                isCheckoutLoading={isCreatingOrder}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartData;
