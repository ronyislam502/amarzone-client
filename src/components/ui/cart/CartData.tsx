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

    console.log("cart", cartItems)

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

    const handleProceedToCheckout = async () => {
        if (selectedItems.length === 0) {
            toast.info("Please select at least 1 item to proceed to checkout.");
            return;
        }

        if (!currentUser || !currentToken) {
            toast.warning("Please sign in to proceed with checkout.");
            router.push("/login?redirect=/cart");
            return;
        }

        try {
            // Group selected items by vendor to support multiple products per order
            const vendorMap = new Map<string, TCartProduct[]>();

            for (const item of selectedItems) {
                const vendorId =
                    item.vendorId ||
                    item.seller?.vendor?._id ||
                    item.seller?.vendor ||
                    item.vendor?._id ||
                    item.vendor ||
                    item.author?._id ||
                    item.author?.id ||
                    item.author ||
                    "default";

                const vKey = typeof vendorId === "object" ? vendorId._id || vendorId.id : String(vendorId);

                if (!vendorMap.has(vKey)) {
                    vendorMap.set(vKey, []);
                }
                vendorMap.get(vKey)!.push(item);
            }

            // Create orders for each vendor group
            for (const [vendorId, groupProducts] of vendorMap.entries()) {
                const orderPayload = {
                    vendor: vendorId,
                    products: groupProducts.map((p) => ({
                        variant: String(p.variantId || p._id || p.id || ""),
                        quantity: p.quantity || 1,
                    })),
                };

                const res = await createOrderMutation(orderPayload).unwrap();

                // Remove successfully ordered items from Redux cart
                groupProducts.forEach((p) => {
                    const targetId = String(p._id || p.variantId || p.id || "");
                    if (targetId) {
                        dispatch(removeFromCart({ _id: targetId }));
                    }
                });

                // If Stripe checkout redirect URL is returned, navigate to checkout session
                const checkoutUrl = res?.data?.url || res?.url;
                if (checkoutUrl) {
                    window.location.href = checkoutUrl;
                    return;
                }
            }

            toast.success("Order created successfully!");
            router.push("/customer/orders");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create order. Please try again.");
        }
    };

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
                                onProceedToCheckout={handleProceedToCheckout}
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
