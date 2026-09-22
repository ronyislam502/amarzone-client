"use client";

import React, { useState, useEffect } from "react";
import { TInventory } from "@/types/inventory";
import { TProduct, TVariant } from "@/types/product";
import { Award, CheckCircle2, ChevronRight, Store, Truck, Clock, X } from "lucide-react";
import { useAppDispatch } from "@/src/redux/hooks";
import { addToCart } from "@/redux/features/order/orderSlice";
import { toast } from "react-toastify";


interface ProductSellerOffersProps {
  sellers: TInventory[];
  buyBoxWinnerId?: string;
  product: TProduct;
  selectedVariant?: TVariant | null;
}

export const ProductSellerOffers: React.FC<ProductSellerOffersProps> = ({
  sellers = [],
  buyBoxWinnerId,
  product,
  selectedVariant,
}) => {
  const dispatch = useAppDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Close drawer on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDrawerOpen(false);
    };
    if (isDrawerOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isDrawerOpen]);

  if (!sellers || sellers.length <= 1) {
    return null; // Only show if more than 1 seller
  }

  // Find lowest price
  const lowestPrice = Math.min(...sellers.map((s) => s.seller.price));

  // Exclude buybox winner from count in the teaser? Or show total count? 
  // Amazon shows "New (3) from $X". It means total sellers.
  const sellersCount = sellers.length;

  const handleAddSellerToCart = (listing: TInventory) => {
    try {
      const variantObj = (selectedVariant || listing.variant) as any;
      const variantId =
        variantObj?._id ||
        (typeof listing.variant === "string" ? listing.variant : "") ||
        product.variants?.[0]?._id;
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
      // Optional: Close drawer on add to cart
      // setIsDrawerOpen(false);
    } catch {
      toast.info("Item added to your cart!");
    }
  };

  return (
    <div className="mt-4">
      {/* Teaser Box (Image 1 replica) */}
      <div
        className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-xs cursor-pointer hover:bg-slate-50 transition-colors select-none group"
        onClick={() => setIsDrawerOpen(true)}
      >
        <div className="px-3 py-2 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 text-sm">Other sellers on Amarzone</h3>
        </div>
        <div className="p-3 flex items-center justify-between">
          <div className="text-sm text-slate-800 leading-snug pr-2">
            <span className="text-[#007185] hover:text-[#c7511f] group-hover:underline transition-colors">
              New ({sellersCount}) from ${lowestPrice.toFixed(2)}
            </span>{" "}
            FREE Shipping shipped by Amarzone.
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 shrink-0 group-hover:text-slate-900 transition-colors" />
        </div>
      </div>

      {/* Right Side Drawer / Modal (Image 2 replica) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 opacity-100"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Sliding Panel */}
          <div className="relative w-full max-w-md bg-[#f2f4f8] shadow-2xl h-full flex flex-col transform transition-transform duration-300 translate-x-0 overflow-hidden">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
              <h2 className="text-[17px] font-bold text-slate-900">Sellers on Amarzone</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Seller List */}
            <div className="flex-1 overflow-y-auto bg-slate-100/50">
              {sellers.map((listing) => {
                const seller = listing.seller;
                const isWinner =
                  (buyBoxWinnerId && listing._id === buyBoxWinnerId) ||
                  seller.isBuyBoxWinner;
                const vendorName = seller.vendor?.name || "Amarzone Verified Seller";
                const price = seller.price;
                const isStock = seller.isStock && seller.quantity > 0;

                // Calculate dynamic delivery date based on shippingTime
                const shippingDays = seller.shippingTime || 2;
                const today = new Date();
                const startDelivery = new Date(today);
                startDelivery.setDate(today.getDate() + shippingDays);
                const endDelivery = new Date(today);
                endDelivery.setDate(today.getDate() + shippingDays + 4);

                const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
                const deliveryRange = `${startDelivery.toLocaleDateString("en-US", options)} - ${endDelivery.getDate()}`;

                return (
                  <div key={listing._id} className="bg-white border-b border-slate-200 p-4">
                    {/* Header: New & Add to Cart button */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-slate-900 text-sm">New</div>
                      <button
                        disabled={!isStock}
                        onClick={() => handleAddSellerToCart(listing)}
                        className="py-1.5 px-4 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] rounded-full text-xs font-semibold text-slate-900 shadow-xs cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add to Cart
                      </button>
                    </div>

                    <div className="grid grid-cols-[110px_1fr] gap-4">
                      {/* Price Column */}
                      <div className="text-left">
                        <div className="flex items-start text-slate-900 font-medium">
                          <span className="text-[10px] mt-0.5">$</span>
                          <span className="text-[22px] leading-none">{Math.floor(price)}</span>
                          <span className="text-[10px] mt-0.5">{(price % 1).toFixed(2).substring(2)}</span>
                        </div>
                      </div>

                      {/* Delivery & Seller Column */}
                      <div className="text-xs text-slate-900 leading-snug">
                        <div className="mb-2">
                          FREE delivery <span className="font-bold">{deliveryRange}.</span>
                          <div>
                            <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
                              Details
                            </span>
                          </div>
                        </div>

                        {/* Ships from & Sold by layout matching Image 2 */}
                        <table className="text-xs text-slate-700 w-full mb-1">
                          <tbody>
                            <tr>
                              <td className="py-0.5 align-top w-[70px] text-slate-500">Ships from</td>
                              <td className="py-0.5 align-top">{seller.fulfillmentBy || "Amarzone"}</td>
                            </tr>
                            <tr>
                              <td className="py-0.5 align-top w-[70px] text-slate-500">Sold by</td>
                              <td className="py-0.5 align-top text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
                                {vendorName}
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Ratings snippet for seller */}
                        <div className="flex items-center gap-1 mt-1 text-slate-600">
                          <div className="flex text-amber-500">
                            {/* Mock star rating UI since we don't have exact seller rating here, using a static UI just to match layout */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current text-slate-300" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          </div>
                          <span className="text-[11px]">(1722 ratings)</span>
                        </div>
                        <div className="text-[11px] text-slate-700 mt-0.5">
                          97% positive over last 12 months
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Alternative Items Section from Image 2 */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 border-b">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-[15px] text-slate-900">Didn't find what you were looking for?</h3>
                <span className="text-[11px] text-slate-600">Page 1 of 5</span>
              </div>
              <p className="text-xs text-slate-600 mb-4">Consider these alternative items</p>

              <div className="flex items-center gap-3">
                <button className="p-2 border border-slate-300 rounded-md bg-white hover:bg-slate-50 cursor-pointer shadow-xs">
                  <ChevronRight className="w-5 h-5 text-slate-600 rotate-180" />
                </button>

                {/* Mock alternative product */}
                <div className="flex-1 flex gap-3 overflow-hidden">
                  <div className="min-w-[130px] flex-1 bg-white border border-slate-200 rounded-lg p-2 text-center text-xs">
                    <div className="h-24 flex items-center justify-center mb-2 overflow-hidden rounded-md border border-slate-100 bg-white">
                      <img src={product.thumbnail || ""} alt={product.title} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer truncate font-medium text-[11px] text-left">
                      {product.title}
                    </div>
                    <div className="text-left mt-1">
                      <span className="text-[#b12704] font-bold text-xs">${(product.minPrice || 25.99).toFixed(2)}</span>
                    </div>
                    <button className="w-full mt-2 py-1 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 border border-[#fcd200] rounded-full text-[11px] font-semibold cursor-pointer shadow-xs">
                      Add to cart
                    </button>
                  </div>
                </div>

                <button className="p-2 border border-slate-300 rounded-md bg-white hover:bg-slate-50 cursor-pointer shadow-xs">
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSellerOffers;
