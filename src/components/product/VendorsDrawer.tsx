"use client";

import React from "react";
import Image from "next/image";
import { X, Store, ShoppingCart, Check, Star, ShieldCheck, Truck } from "lucide-react";
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
  if (!isOpen) return null;

  const sellers = inventory?.sellers || [];
  const variantLabel =
    selectedVariant?.attributes?.map((a) => a.value).join(" / ") ||
    selectedVariant?.sku ||
    "Selected Variant";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
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
          <div className="px-5 py-3 bg-[#f7f8f8] border-b border-slate-200 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800">
              Total Sellers Available: <span className="text-[#007185] font-extrabold">{sellers.length}</span>
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              ASIN: {selectedVariant?.asin || "N/A"}
            </span>
          </div>

          {/* Vendors Content List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-200">
            {sellers.length > 0 ? (
              sellers.map((sItem, idx) => {
                const seller: TSeller = sItem.seller;
                const vendor = seller.vendor;
                const vName = vendor?.name || "Merchant Vendor";
                const isBuyBox = seller.isBuyBoxWinner || idx === 0;
                const priceParts = (seller.price || 39.99).toFixed(2).split(".");

                return (
                  <div key={sItem._id || idx} className="pt-4 first:pt-0 space-y-3">
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
                          <Check className="w-3 h-3" /> Featured Buy Box Winner
                        </span>
                      )}
                    </div>

                    {/* Vendor Info Box */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
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
                          <div className="font-bold text-slate-900 flex items-center gap-1">
                            <span>{vName}</span>
                            <ShieldCheck className="w-3.5 h-3.5 text-[#007185]" />
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>4.8 (1,240 ratings) | 98% Positive</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200 text-slate-600">
                        <div>
                          <span className="text-slate-400">Shipper:</span>{" "}
                          <span className="font-semibold text-slate-800">{seller.fulfillmentBy || "Amarzone"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Delivery:</span>{" "}
                          <span className="font-semibold text-slate-800">{seller.shippingTime || 3} Days</span>
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
                      className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-[#0f1111] font-medium text-xs rounded-full shadow-xs border border-[#fcd200] transition-all cursor-pointer flex items-center justify-center gap-2"
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
          <div className="p-4 bg-slate-100 border-t border-slate-200 text-center shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-block font-normal text-xs bg-white border-slate-300 text-slate-800 hover:bg-slate-50"
            >
              Close Vendors Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
