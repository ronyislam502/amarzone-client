"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Store, ShoppingCart, Check, Star, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";
import { TInventoryResult, TSeller, TVariant } from "./ProductDetailsView";

interface VendorsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: TInventoryResult | null;
  selectedVariant: TVariant | null;
  productTitle: string;
  onAddToCart: (vendorName?: string) => void;
}

export const VendorsDrawer: React.FC<VendorsDrawerProps> = ({
  isOpen,
  onClose,
  inventory,
  selectedVariant,
  productTitle,
  onAddToCart,
}) => {
  // Dynamically sort sellers list on client side: Buy Box Winner ALWAYS at top, followed by remaining sellers
  const sortedSellers = useMemo(() => {
    const list = [...(inventory?.sellers || [])];
    const buyBoxVendorId = inventory?.buyBoxWinner?.seller?.vendor?._id;

    // If buyBoxWinner seller exists but is not in list, add it at front
    if (
      inventory?.buyBoxWinner?.seller &&
      !list.some((s) => s.seller?.vendor?._id === buyBoxVendorId)
    ) {
      list.unshift({
        _id: "buybox-winner-item",
        seller: { ...inventory.buyBoxWinner.seller, isBuyBoxWinner: true },
      });
    }

    return list.sort((a, b) => {
      const aIsBuyBox =
        a.seller?.isBuyBoxWinner === true ||
        Boolean(buyBoxVendorId && a.seller?.vendor?._id === buyBoxVendorId);
      const bIsBuyBox =
        b.seller?.isBuyBoxWinner === true ||
        Boolean(buyBoxVendorId && b.seller?.vendor?._id === buyBoxVendorId);

      if (aIsBuyBox && !bIsBuyBox) return -1;
      if (!aIsBuyBox && bIsBuyBox) return 1;
      return (a.seller?.price || 0) - (b.seller?.price || 0);
    });
  }, [inventory]);

  if (!isOpen) return null;

  const variantLabel =
    selectedVariant?.attributes?.map((a) => a.value).join(" / ") ||
    selectedVariant?.sku ||
    "Selected Variant";

  const buyBoxVendorId = inventory?.buyBoxWinner?.seller?.vendor?._id;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-base-100 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 md:p-5 bg-[#232f3e] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#febd69] font-bold">
                Amarzone Merchant Marketplace
              </span>
              <h2 className="text-base font-bold text-white leading-tight">
                Other Sellers on Amazon
              </h2>
              <div className="text-xs text-slate-300 mt-0.5 truncate max-w-xs">
                {productTitle} ({variantLabel})
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader info */}
          <div className="px-5 py-3 bg-base-200 border-b border-base-300 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800">
              Total Sellers Available:{" "}
              <span className="text-[#007185] font-extrabold">{sortedSellers.length}</span>
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              ASIN: {selectedVariant?.asin || "N/A"}
            </span>
          </div>

          {/* Vendors Content List (Sorted: Buy Box Winner at top, followed by remaining sellers) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-base-300">
            {sortedSellers.length > 0 ? (
              sortedSellers.map((sItem, idx) => {
                const seller: TSeller = sItem.seller;
                const vendor = seller.vendor;
                const vName = vendor?.name || "Merchant Vendor";

                // Determine if this seller is the Buy Box winner
                const isBuyBox =
                  seller.isBuyBoxWinner === true ||
                  Boolean(buyBoxVendorId && vendor?._id === buyBoxVendorId) ||
                  idx === 0;

                const priceParts = (seller.price || 39.99).toFixed(2).split(".");

                return (
                  <div
                    key={sItem._id || idx}
                    className={`pt-4 first:pt-0 space-y-3 ${
                      isBuyBox
                        ? "bg-amber-50/40 p-3 rounded-xl border border-amber-200/80 shadow-xs mb-2"
                        : ""
                    }`}
                  >
                    {/* Top Row: Price & Buy Box Badge */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-baseline gap-0.5 text-[#0f1111]">
                          <span className="text-xs font-normal align-top">$</span>
                          <span className="text-2xl font-bold">{priceParts[0]}</span>
                          <span className="text-xs font-normal align-top">{priceParts[1]}</span>
                        </div>
                        <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                          FREE Delivery Included
                        </div>
                      </div>

                      {isBuyBox && (
                        <span className="badge bg-[#c45500] text-white border-none font-bold text-[10px] uppercase gap-1 shadow-xs px-2.5 py-1">
                          <Sparkles className="w-3 h-3 fill-current" /> Top Buy Box Winner
                        </span>
                      )}
                    </div>

                    {/* Vendor Info Box */}
                    <div className="p-3 bg-base-200 rounded-lg border border-base-300 space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        {vendor?.avatar ? (
                          <Image
                            src={vendor.avatar}
                            alt={vName}
                            width={28}
                            height={28}
                            className="w-7 h-7 rounded-full object-cover border border-slate-300"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs">
                            <Store className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-base-content flex items-center gap-1">
                            <span>{vName}</span>
                            <ShieldCheck className="w-3.5 h-3.5 text-[#007185]" />
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>4.9 (1,240 ratings) | 98% Positive</span>
                          </div>
                          {vendor?._id && (
                            <Link
                              href={`/store/${vendor._id}`}
                              className="text-[10px] text-[#007185] hover:text-[#c45500] hover:underline font-semibold flex items-center gap-0.5 mt-0.5"
                            >
                              Visit Store <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-base-300 text-base-content/70">
                        <div>
                          <span className="text-slate-400">Shipper:</span>{" "}
                          <span className="font-semibold text-slate-800">
                            {seller.fulfillmentBy || "Amarzone Express"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Delivery:</span>{" "}
                          <span className="font-semibold text-slate-800">
                            {seller.shippingTime || 2} Days
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Button per Vendor */}
                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart(vName);
                        onClose();
                      }}
                      className={`w-full py-2 font-medium text-xs rounded-full shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isBuyBox
                          ? "bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] border border-[#fcd200]"
                          : "bg-base-200 hover:bg-base-300 text-base-content border border-base-300"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart from {vName}</span>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <Store className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700">No Alternative Sellers Found</p>
                <p className="text-xs text-slate-400">
                  This variant currently has 1 primary seller in stock.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-base-200 border-t border-base-300 text-center shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-block font-normal text-xs bg-base-100 border-base-300 text-base-content hover:bg-base-200"
            >
              Close Vendors Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
