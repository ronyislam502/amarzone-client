"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, ShoppingBag, Star, Sparkles, LogIn, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
  addToCart,
} from "@/src/redux/features/order/orderSlice";
import { useCreateOrderMutation } from "@/src/redux/features/order/orderApi";
import { useAllProductsQuery } from "@/src/redux/features/product/productApi";
import { selectCurrentUser, useCurrentToken, setUser } from "@/src/redux/features/auth/authSlice";
import { CartEmptyState, CartItemList, CartSavedForLater, CartSummaryCard, StripePaymentModal, TCartProduct } from "@/src/components/ui/cart";

function CartPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  // Auth Redux State
  const currentUser = useAppSelector(selectCurrentUser);
  const currentToken = useAppSelector(useCurrentToken);

  // Redux Cart State
  const rawCartProducts = useAppSelector((state) => state.cart?.products || []);

  // RTK Mutations & Queries
  const [createOrderMutation, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const { data: recommendedData, isLoading: isLoadingRecommended } =
    useAllProductsQuery({ limit: 4 });

  // Local state for deselected item IDs, saved for later, discounts, and Stripe modal
  const [deselectedIds, setDeselectedIds] = useState<Set<string>>(new Set());
  const [savedItems, setSavedItems] = useState<TCartProduct[]>([]);
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discountRate, setDiscountRate] = useState<number>(0);

  // Stripe & Order Modal State
  const [isStripeModalOpen, setIsStripeModalOpen] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [stripeClientSecret, setStripeClientSecret] = useState<string>("");

  // Customer Login Prompt Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Convert raw cart items to TCartProduct
  const cartItems: TCartProduct[] = useMemo(() => {
    return rawCartProducts.map((p: any) => {
      const id = p._id || p.variantId || p.id || "";
      const isSelected = !deselectedIds.has(id);
      return {
        ...p,
        _id: id,
        id: id,
        isSelected,
      };
    });
  }, [rawCartProducts, deselectedIds]);

  // Compute selected items
  const selectedItems = useMemo(() => {
    return cartItems.filter((i) => i.isSelected);
  }, [cartItems]);

  const selectedCount = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [selectedItems]);

  // Subtotal of selected items
  const subtotal = useMemo(() => {
    return Number(
      selectedItems
        .reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0)
        .toFixed(2)
    );
  }, [selectedItems]);

  const isAllSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length;

  // Fixed tax per backend order rule ($0.88 when items > 0)
  const tax = selectedItems.length > 0 ? 0.88 : 0;

  // Discount calculation
  const discountAmount = useMemo(() => {
    return Number((subtotal * discountRate).toFixed(2));
  }, [subtotal, discountRate]);

  // Grand Total
  const grandTotal = useMemo(() => {
    return Number(Math.max(0, subtotal + tax - discountAmount).toFixed(2));
  }, [subtotal, tax, discountAmount]);

  // Cart Item Handlers
  const handleToggleSelect = (id: string) => {
    setDeselectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      // Deselect all
      const allIds = new Set(cartItems.map((i) => i._id || i.id || ""));
      setDeselectedIds(allIds);
    } else {
      // Select all
      setDeselectedIds(new Set());
    }
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    const item = cartItems.find((i) => (i._id || i.id) === id);
    if (!item) return;
    const currentQty = item.quantity || 1;
    const type = newQty > currentQty ? "increment" : "decrement";
    dispatch(updateQuantity({ _id: id, type }));
  };

  const handleDeleteItem = (id: string) => {
    const item = cartItems.find((i) => (i._id || i.id) === id);
    dispatch(removeFromCart({ _id: id }));
    toast.info(`Removed "${(item?.title || "Item").slice(0, 24)}..." from cart.`, {
      position: "bottom-right",
      autoClose: 1800,
    });
  };

  const handleSaveForLater = (id: string) => {
    const item = cartItems.find((i) => (i._id || i.id) === id);
    if (!item) return;

    dispatch(removeFromCart({ _id: id }));
    setSavedItems((prev) => [item, ...prev]);
    toast.info(`Saved "${item.title.slice(0, 24)}..." for later.`, {
      position: "bottom-right",
      autoClose: 1800,
    });
  };

  const handleMoveToCart = (id: string) => {
    const item = savedItems.find((i) => (i._id || i.id) === id);
    if (!item) return;

    setSavedItems((prev) => prev.filter((i) => (i._id || i.id) !== id));
    dispatch(addToCart(item));
    setDeselectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast.success(`Moved "${item.title.slice(0, 24)}..." to cart!`, {
      position: "bottom-right",
      autoClose: 1800,
    });
  };

  const handleDeleteSavedItem = (id: string) => {
    setSavedItems((prev) => prev.filter((i) => (i._id || i.id) !== id));
    toast.info("Deleted from saved list.", {
      position: "bottom-right",
      autoClose: 1400,
    });
  };

  const handleApplyDiscount = (code: string): boolean => {
    if (code === "AMARZONE10" || code === "SAVE10") {
      setDiscountCode(code);
      setDiscountRate(0.1); // 10% off
      return true;
    }
    return false;
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setDiscountRate(0);
    toast.info("Promo code removed.");
  };

  // One-click Customer Demo Sign In (e.g. for testing order creation)
  const handleQuickCustomerLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await fetch("http://localhost:9000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "akhi@gmail.com",
          password: "customer123",
        }),
      });
      const data = await res.json();
      if (data?.data?.accessToken) {
        dispatch(
          setUser({
            user: data.data.user,
            token: data.data.accessToken,
          })
        );
        toast.success("Signed in as Customer (Akhi Akter)!");
        setIsLoginModalOpen(false);
        // Continue to checkout immediately
        setTimeout(() => executeCheckout(), 200);
      } else {
        toast.error("Failed to sign in. Please try again.");
      }
    } catch {
      toast.error("Network error while signing in.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Main Checkout Flow Execution
  const executeCheckout = async () => {
    if (selectedItems.length === 0) {
      toast.info("Please select at least 1 item to proceed.");
      return;
    }

    try {
      // Find the primary vendor associated with the selected items
      const primaryItem = selectedItems[0];
      const vendorId =
        primaryItem.vendorId ||
        (typeof primaryItem.seller?.vendor === "object"
          ? primaryItem.seller?.vendor?._id
          : primaryItem.seller?.vendor) ||
        (typeof primaryItem.vendor === "object"
          ? primaryItem.vendor?._id
          : primaryItem.vendor) ||
        (typeof primaryItem.variant?.inventory?.[0]?.seller?.vendor === "object"
          ? primaryItem.variant?.inventory?.[0]?.seller?.vendor?._id
          : primaryItem.variant?.inventory?.[0]?.seller?.vendor) ||
        (typeof primaryItem.author === "object"
          ? primaryItem.author?._id || primaryItem.author?.id
          : primaryItem.author);

      // Ensure all items have a valid variant ID
      const invalidItem = selectedItems.find(
        (item) => !item.variantId && !item.variant?._id
      );
      if (invalidItem) {
        toast.error(
          `"${(invalidItem.title || "Item").slice(0, 24)}..." has no valid variant. Please remove it from your cart.`
        );
        return;
      }

      const orderProducts = selectedItems.map((item) => ({
        variant: item.variantId || item.variant?._id || item._id,
        quantity: item.quantity || 1,
      }));

      const payload = {
        vendor: vendorId,
        products: orderProducts,
      };

      const result = await createOrderMutation(payload).unwrap();

      if (result?.data?.clientSecret) {
        setCreatedOrder(result.data.order);
        setStripeClientSecret(result.data.clientSecret);
        setIsStripeModalOpen(true);
      } else {
        toast.error("Failed to initialize Stripe checkout. Please try again.");
      }
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || "Order creation failed.";
      toast.error(errorMsg);
    }
  };

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      toast.info("Please select at least 1 item to checkout.");
      return;
    }

    // Check customer authentication
    if (!currentUser || !currentToken) {
      setIsLoginModalOpen(true);
      return;
    }

    executeCheckout();
  };

  // Auto-trigger checkout if navigated with ?checkout=true
  useEffect(() => {
    if (
      searchParams.get("checkout") === "true" &&
      cartItems.length > 0 &&
      !isStripeModalOpen
    ) {
      handleProceedToCheckout();
    }
  }, [searchParams, cartItems.length]);

  const handlePaymentSuccess = () => {
    dispatch(clearCart());
  };

  // Add recommended product directly from empty cart view
  const handleAddRecommendedToCart = (prod: any) => {
    const firstVariant = prod.variants?.[0];
    const variantId = firstVariant?._id || prod._id;
    const inv = firstVariant?.inventory?.[0];
    const seller = inv?.seller;
    const vendor = seller?.vendor;
    const vendorId =
      vendor?._id ||
      vendor ||
      prod.author?.id ||
      prod.author?._id;
    const price = seller?.price || prod.minPrice || 49.99;

    const cartItem: any = {
      ...prod,
      _id: variantId,
      variantId: variantId,
      variant: firstVariant,
      productId: prod._id,
      title: prod.title,
      thumbnail:
        firstVariant?.thumbnail ||
        firstVariant?.images?.[0] ||
        prod.thumbnail,
      image:
        firstVariant?.thumbnail ||
        firstVariant?.images?.[0] ||
        prod.thumbnail,
      brand: prod.brand,
      category: prod.category?.name || prod.category || "General",
      price: price,
      originalPrice: Number((price * 1.15).toFixed(2)),
      quantity: 1,
      maxQuantity: seller?.quantity || 10,
      seller: seller,
      vendor: vendor,
      vendorId: vendorId,
      inStock: seller ? seller.isStock && seller.quantity > 0 : true,
      shippingTime: seller?.shippingTime || 2,
      attributes: firstVariant?.attributes || [],
      isSelected: true,
    };

    dispatch(addToCart(cartItem));
    toast.success(`Added "${prod.title.slice(0, 26)}..." to Cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const recommendedProducts = recommendedData?.data || [];

  return (
    <main className="bg-[#f0f2f2]/60 min-h-screen py-5 select-none">
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

            {/* Live Recommended Products from Amarzone Catalog */}
            {recommendedProducts.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Recommended Products on Amarzone
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendedProducts.map((prod: any) => {
                    const price = prod.minPrice || 49.99;
                    const thumb =
                      prod.thumbnail ||
                      prod.variants?.[0]?.thumbnail ||
                      prod.variants?.[0]?.images?.[0] ||
                      "https://m.media-amazon.com/images/I/81TsMF0Zr4L.jpg";

                    return (
                      <div
                        key={prod._id}
                        className="bg-slate-50/70 hover:bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md group"
                      >
                        <Link
                          href={`/products/${prod._id}`}
                          className="relative w-full h-40 bg-white rounded-xl overflow-hidden flex items-center justify-center p-2 mb-3 border border-slate-100"
                        >
                          <Image
                            src={thumb}
                            alt={prod.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 240px"
                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        <div className="space-y-1.5 mb-3">
                          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                            {prod.brand || "Amarzone Choice"}
                          </span>
                          <Link
                            href={`/products/${prod._id}`}
                            className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 hover:text-[#c7511f] transition-colors"
                          >
                            {prod.title}
                          </Link>

                          <div className="flex items-center gap-1 text-amber-500 text-xs">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="font-bold text-slate-800 text-xs">4.7</span>
                            <span className="text-slate-400 text-[11px]">(1,420)</span>
                          </div>

                          <div className="text-base font-black text-slate-900 pt-0.5">
                            ${Number(price).toFixed(2)}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddRecommendedToCart(prod)}
                          className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 border border-[#fcd200] shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {savedItems.length > 0 && (
              <CartSavedForLater
                savedItems={savedItems}
                onMoveToCart={handleMoveToCart}
                onDeleteSavedItem={handleDeleteSavedItem}
              />
            )}
          </div>
        ) : (
          /* 2-Column Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Cart Items List & Saved for Later */}
            <div className="lg:col-span-8 space-y-5">
              <CartItemList
                items={cartItems}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
                isAllSelected={isAllSelected}
                onUpdateQuantity={handleUpdateQuantity}
                onDeleteItem={handleDeleteItem}
                onSaveForLater={handleSaveForLater}
                subtotal={subtotal}
                selectedCount={selectedCount}
              />

              {/* Saved For Later Shelf */}
              {savedItems.length > 0 && (
                <CartSavedForLater
                  savedItems={savedItems}
                  onMoveToCart={handleMoveToCart}
                  onDeleteSavedItem={handleDeleteSavedItem}
                />
              )}
            </div>

            {/* Right Column: Checkout Summary Card */}
            <div className="lg:col-span-4 sticky top-20">
              <CartSummaryCard
                subtotal={subtotal}
                selectedCount={selectedCount}
                discount={discountAmount}
                discountCode={discountCode}
                onApplyDiscount={handleApplyDiscount}
                onRemoveDiscount={handleRemoveDiscount}
                tax={tax}
                grandTotal={grandTotal}
                onProceedToCheckout={handleProceedToCheckout}
                isCheckoutLoading={isCreatingOrder}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stripe Payment Modal */}
      {isStripeModalOpen && (
        <StripePaymentModal
          isOpen={isStripeModalOpen}
          onClose={() => setIsStripeModalOpen(false)}
          clientSecret={stripeClientSecret}
          order={createdOrder}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Customer Login Requirement Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">
                Customer Sign-In Required
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                To create and track your order securely, please sign in with your customer account.
              </p>
            </div>

            <div className="space-y-2.5">
              {/* 1-Click Customer Demo Sign In */}
              <button
                type="button"
                disabled={isLoggingIn}
                onClick={handleQuickCustomerLogin}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 border border-[#fcd200] shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {isLoggingIn ? (
                  <span className="loading loading-spinner loading-xs text-slate-900" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>1-Click Sign-In as Customer (Akhi Akter)</span>
              </button>

              <Link
                href="/login?redirect=/cart"
                onClick={() => setIsLoginModalOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold btn btn-outline border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white flex items-center justify-center gap-2"
              >
                <span>Sign In with Another Account</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 text-center cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f0f2f2]/60">
          <span className="loading loading-spinner loading-lg text-amber-500" />
        </div>
      }
    >
      <CartPageContent />
    </Suspense>
  );
}
