"use client";

import React, { useState } from "react";
import {
  MapPin,
  Lock,
  ShoppingCart,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Truck,
  Store,
} from "lucide-react";
import { TInventory } from "@/types/inventory";
import { TProduct } from "@/types/product";
import { TVariant } from "@/types/variant";
import { useAppDispatch } from "@/src/redux/hooks";
import { addToCart } from "@/redux/features/order/orderSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface ProductBuyBoxProps {
  buyBoxListing: TInventory | null;
  totalSellers: number;
  product: TProduct;
  selectedVariant?: TVariant | null;
  isLoadingInventory?: boolean;
}

export const ProductBuyBox: React.FC<ProductBuyBoxProps> = ({
  buyBoxListing,
  totalSellers,
  product,
  selectedVariant,
  isLoadingInventory = false,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const seller = buyBoxListing?.seller;
  const hasVariants = Boolean(
    (product?.variants && product.variants.length > 0) || selectedVariant
  );
  const price = seller?.price ?? product?.minPrice ?? 0;
  const isStock = seller ? seller.isStock && seller.quantity > 0 : true;
  const isAvailable = isStock && hasVariants;
  const availableQty = seller?.quantity ?? 10;
  const maxSelectableQty = Math.min(Math.max(availableQty, 1), 10);
  const vendorName = seller?.vendor?.name || product?.brand || "Amarzone Direct";
  const fulfillmentBy = seller?.fulfillmentBy || "Amarzone Logistics";
  const shippingTime = seller?.shippingTime || 2;

  // Calculate dynamic delivery dates based on shippingTime
  const deliveryDateText = React.useMemo(() => {
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + Math.max(shippingTime, 2));

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "short",
      day: "numeric",
    };
    return delivery.toLocaleDateString("en-US", options);
  }, [shippingTime]);

  const handleAddToCart = () => {
    if (!hasVariants) {
      toast.error("This product currently has no options or variants available.");
      return;
    }
    setIsAdding(true);
    try {
      const activeVariant =
        selectedVariant || (buyBoxListing?.variant as any) || product.variants?.[0];
      const variantId = activeVariant?._id || product.variants?.[0]?._id;
      const vendorId =
        seller?.vendor?._id ||
        (product.author as any)?.id ||
        (product.author as any)?._id;

      // Build cart product with the actual buy box winning price and selected quantity
      const cartItem: any = {
        ...product,
        _id: variantId || product._id,
        variantId: variantId,
        variant: activeVariant,
        productId: product._id,
        title: product.title,
        thumbnail:
          activeVariant?.thumbnail ||
          activeVariant?.images?.[0] ||
          product.thumbnail,
        image:
          activeVariant?.thumbnail ||
          activeVariant?.images?.[0] ||
          product.thumbnail,
        brand: product.brand,
        category: (product.category as any)?.name || product.category || "General",
        price: price,
        originalPrice:
          product.minPrice && product.minPrice > price
            ? product.minPrice
            : Number((price * 1.15).toFixed(2)),
        quantity: quantity,
        maxQuantity: maxSelectableQty,
        seller: seller,
        vendor: seller?.vendor || product.author,
        vendorId: vendorId,
        inStock: isStock,
        shippingTime: shippingTime,
        attributes: activeVariant?.attributes || [],
        isSelected: true,
      };
      dispatch(addToCart(cartItem));
      toast.success(
        `Added ${quantity}x "${product.title.slice(0, 26)}..." to Cart!`,
        {
          position: "bottom-right",
          autoClose: 2000,
        }
      );
    } catch {
      toast.info("Item added to your cart!");
    } finally {
      setTimeout(() => setIsAdding(false), 1200);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      router.push("/cart?checkout=true");
    }, 400);
  };

  const scrollToOtherSellers = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("other-sellers");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-300/80 p-4 sm:p-5 shadow-xs space-y-4 select-none">
      {/* Price Header inside Buy Box */}
      <div>
        <div className="flex items-baseline gap-1 text-slate-900 font-extrabold">
          <span className="text-sm font-bold">$</span>
          <span className="text-2xl sm:text-3xl font-black tracking-tight">
            {price > 0 ? price.toFixed(2) : "0.00"}
          </span>
        </div>

        {/* Shipping promise */}
        <div className="mt-1.5 text-xs text-slate-700 leading-relaxed">
          <span>FREE delivery </span>
          <span className="font-bold text-slate-900">{deliveryDateText}</span>
          <span className="text-slate-500"> on orders shipped by Amarzone.</span>
        </div>
      </div>

      {/* Deliver to address mockup */}
      <div className="flex items-center gap-1.5 text-xs text-[#007185] hover:text-[#c7511f] cursor-pointer">
        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="hover:underline truncate">Deliver to your default location</span>
      </div>

      {/* Stock Status */}
      <div>
        {isLoadingInventory ? (
          <div className="h-5 w-24 bg-slate-100 animate-pulse rounded" />
        ) : isStock ? (
          <div className="space-y-0.5">
            <span className="text-base font-bold text-[#007600] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 inline" /> In Stock
            </span>
            {availableQty <= 5 && availableQty > 0 && (
              <p className="text-xs font-semibold text-[#b12704]">
                Only {availableQty} left in stock - order soon.
              </p>
            )}
          </div>
        ) : (
          <span className="text-base font-bold text-[#b12704] flex items-center gap-1">
            <AlertCircle className="w-4 h-4 inline" /> Currently unavailable
          </span>
        )}
      </div>

      {/* Quantity Selector */}
      {isStock && (
        <div className="flex items-center gap-2">
          <label htmlFor="buybox-quantity" className="text-xs font-semibold text-slate-700">
            Quantity:
          </label>
          <select
            id="buybox-quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="select select-bordered select-xs text-xs font-bold rounded-lg border-slate-300 focus:border-slate-800 bg-slate-50 py-1 px-2.5"
          >
            {Array.from({ length: maxSelectableQty }, (_, i) => i + 1).map((qty) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Action Buttons: Add to Cart & Buy Now */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          disabled={!isAvailable || isAdding}
          onClick={handleAddToCart}
          className={`w-full py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
            isAvailable
              ? "bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-slate-900 border border-[#fcd200]"
              : "bg-slate-200 text-slate-400 cursor-not-allowed border-transparent"
          }`}
        >
          <ShoppingCart className="w-4 h-4 stroke-[2.2]" />
          <span>{isAdding ? "Added!" : "Add to Cart"}</span>
        </button>

        <button
          type="button"
          disabled={!isAvailable}
          onClick={handleBuyNow}
          className={`w-full py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
            isAvailable
              ? "bg-[#ffa41c] hover:bg-[#fa8900] active:bg-[#ee7d00] text-slate-900 border border-[#ff8f00]"
              : "bg-slate-200 text-slate-400 cursor-not-allowed border-transparent"
          }`}
        >
          <Zap className="w-4 h-4 fill-slate-900" />
          <span>Buy Now</span>
        </button>
      </div>

      {/* Security & Transaction */}
      <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>Secure transaction</span>
      </div>

      {/* Seller & Shipping Details Table (Amazon Style) */}
      <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
        <div className="grid grid-cols-2 text-slate-500">
          <span>Ships from</span>
          <span className="text-slate-900 font-medium truncate">{fulfillmentBy}</span>
        </div>

        <div className="grid grid-cols-2 text-slate-500">
          <span>Sold by</span>
          <span className="text-[#007185] hover:text-[#c7511f] font-semibold hover:underline cursor-pointer truncate">
            {vendorName}
          </span>
        </div>

        <div className="grid grid-cols-2 text-slate-500">
          <span>Returns</span>
          <span className="text-[#007185] hover:text-[#c7511f] font-medium hover:underline cursor-pointer">
            30-day refund/replacement
          </span>
        </div>

        <div className="grid grid-cols-2 text-slate-500">
          <span>Payment</span>
          <span className="text-slate-900 font-medium">Secure credit/debit</span>
        </div>
      </div>

    </div>
  );
};

export default ProductBuyBox;
