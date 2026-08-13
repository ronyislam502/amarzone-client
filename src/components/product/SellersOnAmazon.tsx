"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronDown, Filter, ShoppingCart, Store, Check } from "lucide-react";
import { TParentProduct, TSeller, TInventoryResult } from "./ProductDetailsView";

interface SellersOnAmazonProps {
  product: TParentProduct;
  inventory: TInventoryResult | null;
  selectedImage: string;
  categoryProducts?: TParentProduct[];
  onAddToCart?: (vendorName?: string) => void;
}

export const SellersOnAmazon: React.FC<SellersOnAmazonProps> = ({
  product,
  inventory,
  selectedImage,
  categoryProducts = [],
  onAddToCart,
}) => {
  const [filterCondition, setFilterCondition] = useState<string>("all");
  const [showSummaryDetails, setShowSummaryDetails] = useState<boolean>(false);

  const sellers = inventory?.sellers || [];
  const primaryPrice = inventory?.buyBoxWinner?.seller?.price || 39.99;
  const pParts = primaryPrice.toFixed(2).split(".");

  // Filter sellers by condition if requested
  const filteredSellers = sellers.filter((s) => {
    if (filterCondition === "new") return !s.seller.price || s.seller.price >= primaryPrice;
    if (filterCondition === "used") return s.seller.price < primaryPrice;
    return true;
  });

  return (
    <div className="space-y-8 mt-10 text-[#0f1111] font-sans border-t border-slate-200 pt-8">
      {/* ================= 1. MINI SUMMARY PRODUCT HEADER ================= */}
      <div className="bg-white p-4 border border-slate-200 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 shrink-0 bg-white border border-slate-100 rounded p-1 flex items-center justify-center">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={product.title}
                width={60}
                height={60}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 rounded"></div>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-xs md:text-sm font-bold text-[#0f1111] line-clamp-1 max-w-xl">
              {product.title || product.name}
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
                <Star className="w-3.5 h-3.5 fill-current opacity-40" />
              </div>
              <span className="text-[#007185] font-medium">28,380 ratings</span>
              <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 font-bold rounded">New</span>
            </div>
            <div className="flex items-baseline gap-0.5 font-medium text-xs">
              <span>$</span>
              <span className="text-base font-bold">{pParts[0]}</span>
              <span className="text-[10px] align-top">{pParts[1]}</span>
              <span className="text-[#565959] ml-2 text-[11px]">
                FREE delivery <span className="font-bold text-[#0f1111]">Tomorrow, August 12.</span> Order within{" "}
                <span className="text-emerald-700 font-medium">3 hrs 15 mins.</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-between md:justify-end">
          <button
            type="button"
            onClick={() => onAddToCart && onAddToCart()}
            className="py-1.5 px-6 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-[#0f1111] font-normal text-xs rounded-full shadow-xs border border-[#fcd200] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSummaryDetails(!showSummaryDetails)}
            className="text-xs text-[#007185] hover:text-[#c45500] hover:underline flex items-center gap-0.5 font-medium"
          >
            <span>{showSummaryDetails ? "See less" : "See more"}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSummaryDetails ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* ================= 2. SELLERS ON AMAZON OFFER LIST ================= */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-6 shadow-xs">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-3">
          <div>
            <h2 className="text-base md:text-lg font-bold text-[#0f1111]">Sellers on Amazon</h2>
            <p className="text-xs text-[#565959]">sorted by price + delivery: low to high</p>
          </div>

          {/* Filter Dropdown */}
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-xs btn-outline rounded-full font-normal text-xs text-[#0f1111] bg-slate-50 border-slate-300 hover:bg-slate-100 gap-1"
            >
              <Filter className="w-3 h-3 text-slate-500" />
              <span>Filter: {filterCondition === "all" ? "All Offers" : filterCondition.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow-md bg-white rounded-lg w-40 text-xs z-20 border border-slate-200 space-y-1"
            >
              <li>
                <button type="button" onClick={() => setFilterCondition("all")} className="font-medium">
                  All Offers
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setFilterCondition("new")} className="font-medium">
                  New Only
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setFilterCondition("used")} className="font-medium">
                  Used Offers
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Merchant Listings */}
        {filteredSellers.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {filteredSellers.map((item, index) => {
              const seller = item.seller;
              const isUsed = index % 2 === 1 || (seller.price && seller.price < primaryPrice);
              const sPrice = (seller.price || primaryPrice).toFixed(2).split(".");
              const vendorName = seller.vendor?.name || "Spreetail";

              return (
                <div key={item._id || index} className="py-5 first:pt-0 last:pb-0 space-y-3">
                  {/* Condition & Price Row */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <span className="text-sm font-bold text-[#0f1111] block">
                        {isUsed ? "Used - Like New" : "New"}
                      </span>
                      <div className="flex items-baseline gap-0.5 text-[#0f1111] mt-0.5">
                        <span className="text-xs font-normal align-top">$</span>
                        <span className="text-xl font-bold">{sPrice[0]}</span>
                        <span className="text-xs font-normal align-top">{sPrice[1]}</span>
                      </div>
                    </div>

                    {/* Delivery & Add to Cart */}
                    <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-xs text-[#0f1111]">
                        <span className="font-bold text-[#0f1111]">
                          FREE delivery{" "}
                          <span className="font-extrabold">
                            {isUsed ? "Monday, August 17." : "Tomorrow, August 12."}
                          </span>
                        </span>
                        <div className="text-[#565959]">
                          Order within{" "}
                          <span className="text-emerald-700 font-medium">
                            {isUsed ? "4 hrs 15 mins." : "3 hrs 15 mins."}
                          </span>{" "}
                          <a href="#details" className="text-[#007185] hover:underline">
                            Details
                          </a>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onAddToCart && onAddToCart(vendorName)}
                        className="py-1.5 px-5 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-[#0f1111] font-normal text-xs rounded-full shadow-xs border border-[#fcd200] transition-all cursor-pointer shrink-0"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Merchant Key-Value Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-1.5 text-xs text-[#565959] pt-2 border-t border-slate-100 max-w-3xl">
                    <div className="font-medium text-[#565959]">Condition</div>
                    <div className="text-[#0f1111] font-semibold">{isUsed ? "used_like_new" : "new"}</div>

                    <div className="font-medium text-[#565959]">Ships from</div>
                    <div className="text-[#0f1111] font-semibold">{seller.fulfillmentBy || "Spreetail"}</div>

                    <div className="font-medium text-[#565959]">Sold by</div>
                    <div className="text-[#007185] font-bold hover:underline cursor-pointer flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{vendorName}</span>
                    </div>

                    <div className="font-medium text-[#565959]">Seller Reputation</div>
                    <div className="text-[#0f1111] space-y-0.5">
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4].map((s) => (
                          <Star key={s} className="w-3 h-3 fill-current" />
                        ))}
                        <Star className="w-3 h-3 fill-current opacity-40" />
                        <span className="text-[#007185] text-[11px] ml-1 font-normal">(440642 ratings)</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">78% positive over last 12 months</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500">No merchant offers match the selected filter.</div>
        )}
      </div>

      {/* ================= 3. DIDN'T FIND WHAT YOU WERE LOOKING FOR? CAROUSEL ================= */}
      <div className="space-y-3 pt-4">
        <div>
          <h2 className="text-base md:text-lg font-bold text-[#0f1111]">Didn&apos;t find what you were looking for?</h2>
          <p className="text-xs text-[#565959]">Consider these alternative items</p>
        </div>

        {/* Alternative Products Horizontal Scroll Grid */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {categoryProducts.length > 0
            ? categoryProducts.slice(0, 6).map((altProd) => {
                const altImg = altProd.variants?.[0]?.thumbnail || altProd.variants?.[0]?.images?.[0] || selectedImage;

                return (
                  <div
                    key={altProd._id}
                    className="w-56 shrink-0 bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <Link href={`/product/${altProd._id}`} className="block group space-y-2">
                      <div className="w-full h-40 bg-white rounded p-2 flex items-center justify-center border border-slate-100">
                        {altImg ? (
                          <Image
                            src={altImg}
                            alt={altProd.title}
                            width={140}
                            height={140}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 rounded"></div>
                        )}
                      </div>
                      <h3 className="text-xs font-medium text-[#007185] group-hover:text-[#c45500] group-hover:underline line-clamp-2 leading-snug">
                        {altProd.title || altProd.name}
                      </h3>
                    </Link>

                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      <div className="flex text-amber-400 text-[10px]">
                        {[1, 2, 3, 4].map((s) => (
                          <Star key={s} className="w-3 h-3 fill-current" />
                        ))}
                        <Star className="w-3 h-3 fill-current opacity-40" />
                        <span className="text-slate-500 ml-1 font-medium">(1,818)</span>
                      </div>
                      <div className="text-sm font-bold text-[#0f1111] font-mono">$39.30</div>
                    </div>
                  </div>
                );
              })
            : /* Fallback static cards matching user screenshot when category list is loading */
              [1, 2, 3, 4].map((itemNum) => (
                <div
                  key={itemNum}
                  className="w-56 shrink-0 bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="w-full h-40 bg-white rounded p-2 flex items-center justify-center border border-slate-100">
                    <Image
                      src={selectedImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"}
                      alt="Alternative product"
                      width={140}
                      height={140}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xs font-medium text-[#007185] hover:text-[#c45500] hover:underline line-clamp-2 leading-snug">
                    {itemNum === 1
                      ? "Glad 4 Pack 13 Gal Trash Can | Plastic Kitchen Waste Bin"
                      : itemNum === 2
                      ? "Glad 3 Pack 13 Gal Trash Can | Plastic Kitchen Waste Bin"
                      : itemNum === 3
                      ? "Glad 3 Pack Premium 13 Gal Trash Can, Hands Free"
                      : "Glad Commercial Grade 13 Gal Trash Can"}
                  </h3>
                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    <div className="flex text-amber-400 text-[10px]">
                      {[1, 2, 3, 4].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-current" />
                      ))}
                      <Star className="w-3 h-3 fill-current opacity-40" />
                      <span className="text-slate-500 ml-1 font-medium">(1,818)</span>
                    </div>
                    <div className="text-sm font-bold text-[#0f1111] font-mono">${(35.5 + itemNum * 2).toFixed(2)}</div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};
