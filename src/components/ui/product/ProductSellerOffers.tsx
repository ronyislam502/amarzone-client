"use client";

import React from "react";
import { TInventory } from "@/types/inventory";
import { TProduct } from "@/types/product";
import { Award, CheckCircle2, ShoppingCart, Store, Truck, Clock } from "lucide-react";
import { useAppDispatch } from "@/src/redux/hooks";
import { addToCart } from "@/redux/features/order/orderSlice";
import { toast } from "react-toastify";

interface ProductSellerOffersProps {
  sellers: TInventory[];
  buyBoxWinnerId?: string;
  product: TProduct;
}

export const ProductSellerOffers: React.FC<ProductSellerOffersProps> = ({
  sellers = [],
  buyBoxWinnerId,
  product,
}) => {
  const dispatch = useAppDispatch();

  if (!sellers || sellers.length === 0) {
    return null;
  }

  const handleAddSellerToCart = (listing: TInventory) => {
    try {
      const variantObj = listing.variant as any;
      const variantId = variantObj?._id || variantObj || product.variants?.[0]?._id;
      const vendorId = listing.seller.vendor?._id;

      const cartItem: any = {
        ...product,
        _id: variantId || product._id,
        variantId: variantId,
        variant: variantObj,
        productId: product._id,
        title: product.title,
        thumbnail:
          variantObj?.thumbnail ||
          variantObj?.images?.[0] ||
          product.thumbnail,
        image:
          variantObj?.thumbnail ||
          variantObj?.images?.[0] ||
          product.thumbnail,
        brand: product.brand,
        category: (product.category as any)?.name || product.category || "General",
        price: listing.seller.price,
        originalPrice:
          product.minPrice && product.minPrice > listing.seller.price
            ? product.minPrice
            : Number((listing.seller.price * 1.15).toFixed(2)),
        quantity: 1,
        maxQuantity: listing.seller.quantity || 10,
        seller: listing.seller,
        vendor: listing.seller.vendor,
        vendorId: vendorId,
        inStock: listing.seller.isStock,
        shippingTime: listing.seller.shippingTime || 2,
        attributes: variantObj?.attributes || [],
        isSelected: true,
      };
      dispatch(addToCart(cartItem));
      toast.success(
        `Added 1x from "${listing.seller.vendor?.name || "Seller"}" to Cart!`,
        {
          position: "bottom-right",
          autoClose: 2000,
        }
      );
    } catch {
      toast.info("Item added to your cart!");
    }
  };

  return (
    <div id="other-sellers" className="py-6 border-b border-slate-200 select-none">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Other Sellers on Amarzone
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare prices and shipping options from {sellers.length} verified sellers
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sellers.map((listing) => {
          const seller = listing.seller;
          const isWinner =
            (buyBoxWinnerId && listing._id === buyBoxWinnerId) ||
            seller.isBuyBoxWinner;
          const vendorName = seller.vendor?.name || "Verified Marketplace Seller";
          const price = seller.price;
          const isStock = seller.isStock && seller.quantity > 0;
          const shippingDays = seller.shippingTime || 2;

          return (
            <div
              key={listing._id}
              className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isWinner
                  ? "border-amber-400/80 bg-amber-50/20 shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {/* Left Column: Vendor info & Winner Badge */}
              <div className="space-y-1 md:w-1/3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                    <Store className="w-4 h-4 text-slate-600" />
                    <span>{vendorName}</span>
                  </div>

                  {isWinner && (
                    <span className="inline-flex items-center gap-1 bg-[#ffd814] text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-sm shadow-2xs">
                      <Award className="w-3 h-3 text-amber-800" />
                      <span>Buy Box Winner</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Fulfillment: {seller.fulfillmentBy || "Seller Direct"}</span>
                  </span>
                </div>
              </div>

              {/* Middle Column: Stock & Shipping Speed */}
              <div className="space-y-1 text-xs md:w-1/3">
                <div className="flex items-center gap-1 text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Estimated delivery:{" "}
                    <strong className="text-slate-900 font-semibold">
                      {shippingDays} {shippingDays === 1 ? "day" : "days"}
                    </strong>
                  </span>
                </div>

                <div>
                  {isStock ? (
                    <span className="text-[#007600] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({seller.quantity} available)
                    </span>
                  ) : (
                    <span className="text-rose-600 font-semibold">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Right Column: Price & Add to Cart */}
              <div className="flex items-center justify-between md:justify-end gap-4 md:w-1/3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-right">
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                    ${price.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    + FREE Shipping
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!isStock}
                  onClick={() => handleAddSellerToCart(listing)}
                  className={`py-2 px-3.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    isWinner
                      ? "bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 border border-[#fcd200]"
                      : "bg-white hover:bg-slate-100 text-slate-900 border border-slate-300"
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductSellerOffers;
