"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  ChevronDown,
  MapPin,
  Lock,
  Check,
  Search,
  ShoppingCart,
  Zap,
  Store,
  ChevronRight,
  Flag,
  Share2,
  Users,
  ShieldCheck,
} from "lucide-react";
import { SellersOnAmazon } from "./SellersOnAmazon";
import { VendorsDrawer } from "./VendorsDrawer";

export interface TVariantAttribute {
  type: string;
  value: string;
}

export interface TVariant {
  asin: string;
  sku: string;
  attributes: TVariantAttribute[];
  thumbnail: string;
  images: string[];
  isPrivateLevel?: boolean;
}

export interface TParentProduct {
  _id: string;
  title: string;
  name?: string;
  description: string;
  brand: string;
  features: string[];
  department?: { name: string };
  category?: { name: string; _id?: string };
  tags?: string[];
  variants: TVariant[];
}

export interface TSeller {
  vendor?: { _id?: string; name: string; avatar?: string; email?: string };
  price: number;
  quantity: number;
  isStock: boolean;
  fulfillmentBy: string;
  shippingTime: number;
  isBuyBoxWinner?: boolean;
}

export interface TInventoryResult {
  asin: string;
  buyBoxWinner: { seller: TSeller } | null;
  totalSellers: number;
  sellers: { _id: string; seller: TSeller }[];
}

interface ProductDetailsViewProps {
  product: TParentProduct;
  inventory: TInventoryResult | null;
  inventoryLoading: boolean;
  selectedVariant: TVariant | null;
  onSelectVariant: (variant: TVariant) => void;
  categoryProducts?: TParentProduct[];
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({
  product,
  inventory,
  inventoryLoading,
  selectedVariant,
  onSelectVariant,
  categoryProducts = [],
}) => {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [showReturnsInfo, setShowReturnsInfo] = useState<boolean>(false);
  const [showFullSpecs, setShowFullSpecs] = useState<boolean>(false);
  const [isVendorsDrawerOpen, setIsVendorsDrawerOpen] = useState<boolean>(false);
  const [addedToCartToast, setAddedToCartToast] = useState<string | null>(null);

  // Sync main image when selected variant changes
  useEffect(() => {
    if (selectedVariant) {
      const mainImg = selectedVariant.thumbnail || selectedVariant.images?.[0] || "";
      setSelectedImage(mainImg);
    }
  }, [selectedVariant]);

  const allImages = [
    selectedVariant?.thumbnail,
    ...(selectedVariant?.images || []),
  ].filter(Boolean) as string[];

  const buyBox = inventory?.buyBoxWinner?.seller;
  const currentPrice = buyBox?.price || inventory?.sellers?.[0]?.seller?.price || 39.99;
  const priceParts = currentPrice.toFixed(2).split(".");
  const dollars = priceParts[0];
  const cents = priceParts[1];

  // Dynamic attribute values for active variant
  const activeColorAttr =
    selectedVariant?.attributes?.find(
      (a) => a.type.toLowerCase().includes("color") || a.type.toLowerCase().includes("shade")
    )?.value ||
    selectedVariant?.attributes?.[0]?.value ||
    "Standard Edition";

  const handleAddToCart = (vendorName?: string) => {
    const seller = vendorName || buyBox?.vendor?.name || "Seller";
    setAddedToCartToast(`Added ${quantity} unit(s) from ${seller} to Cart!`);
    setTimeout(() => setAddedToCartToast(null), 3500);
  };

  return (
    <div className="bg-white min-h-screen text-[#0f1111] font-sans">
      {/* Toast Notification */}
      {addedToCartToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success text-slate-900 font-bold shadow-lg flex gap-2 rounded-xl">
            <Check className="w-5 h-5 text-emerald-800" />
            <span>{addedToCartToast}</span>
          </div>
        </div>
      )}

      {/* Top Sponsored Brand Banner dynamically generated from database brand */}
      <div className="bg-[#f7f8f8] border-b border-slate-200 py-2.5 px-4">
        <div className="max-w-[1480px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-bold text-slate-800">
            <span className="text-base text-[#c45500] font-black italic tracking-wide">
              Official {product.brand || "Amarzone"} Store
            </span>
            <span className="hidden md:inline-block text-slate-400">|</span>
            <span className="hidden md:inline-block text-slate-600 font-medium">
              Explore {product.category?.name || "Premium Catalog"} Solutions
            </span>
          </div>
          <a href="#store" className="text-xs text-[#007185] hover:text-[#c45500] hover:underline font-bold shrink-0">
            Shop {product.brand || "Brand"} ›
          </a>
        </div>
      </div>

      <div className="max-w-[1480px] mx-auto px-4 md:px-6 py-3">
        {/* Breadcrumb Bar - Dynamic Database Path */}
        <div className="text-xs text-[#565959] mb-3 flex items-center gap-1 flex-wrap">
          <span className="hover:text-[#c45500] hover:underline cursor-pointer">Amarzone Catalog</span>
          <span>&gt;</span>
          <span className="hover:text-[#c45500] hover:underline cursor-pointer">
            {product.department?.name || "Department"}
          </span>
          <span>&gt;</span>
          <span className="hover:text-[#c45500] hover:underline cursor-pointer">
            {product.category?.name || "Category"}
          </span>
          <span>&gt;</span>
          <span className="text-[#0f1111] font-medium truncate max-w-xs">
            {product.title || product.name}
          </span>
        </div>

        {/* 3-Column Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ================= COLUMN 1: GALLERY & MEDIA (5 Cols) ================= */}
          <div className="lg:col-span-5 flex flex-col md:flex-row gap-3 items-start sticky top-4">
            {/* Vertical Thumbnails Column */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[500px] shrink-0 scrollbar-thin">
              {allImages.length > 0 ? (
                allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseEnter={() => setSelectedImage(imgUrl)}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-[46px] h-[46px] rounded p-1 border transition-all shrink-0 bg-white flex items-center justify-center ${
                      selectedImage === imgUrl
                        ? "border-[#007185] ring-2 ring-[#007185]/30 shadow-xs"
                        : "border-slate-300 hover:border-slate-500 opacity-80"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      width={40}
                      height={40}
                      className="max-h-full max-w-full object-contain"
                    />
                  </button>
                ))
              ) : (
                <div className="w-[46px] h-[46px] rounded border border-slate-200 bg-slate-50 p-1 flex items-center justify-center">
                  <span className="text-[10px] text-slate-400">Default</span>
                </div>
              )}

              {/* Extra Videos/Media Thumbnail */}
              <div className="w-[46px] h-[46px] rounded border border-slate-300 bg-slate-100 flex flex-col items-center justify-center text-[9px] font-bold text-slate-700 hover:border-slate-500 cursor-pointer">
                <span className="text-[11px]">▶</span>
                <span>VIDEOS</span>
              </div>
            </div>

            {/* Main Stage Image Display */}
            <div className="flex-1 w-full flex flex-col items-center relative">
              <button type="button" className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-all">
                <Share2 className="w-4 h-4" />
              </button>

              <div className="w-full h-[400px] md:h-[480px] bg-white p-4 flex items-center justify-center border border-slate-100 rounded-lg relative group cursor-zoom-in">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt={product.title}
                    width={450}
                    height={450}
                    priority
                    className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <div className="text-slate-400 font-medium text-sm">No Image Available</div>
                )}

                {selectedVariant?.isPrivateLevel && (
                  <span className="badge badge-warning font-bold text-[10px] absolute top-3 left-3 gap-1 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" /> Private Label
                  </span>
                )}
              </div>

              {/* Zoom & Full View Link */}
              <button
                type="button"
                className="mt-2 text-xs text-[#565959] hover:text-[#c45500] flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Click to see full view</span>
              </button>
            </div>
          </div>

          {/* ================= COLUMN 2: DYNAMIC DATABASE PRODUCT DETAILS (4 Cols) ================= */}
          <div className="lg:col-span-4 space-y-3.5">
            {/* Dynamic Database Title */}
            <h1 className="text-lg md:text-xl font-normal text-[#0f1111] leading-snug tracking-tight">
              {product.title || product.name}
            </h1>

            {/* Store / Brand Link directly from DB */}
            <div className="text-xs">
              <a href="#store" className="text-[#007185] hover:text-[#c45500] hover:underline font-medium">
                Visit the {product.brand || "Official"} Store
              </a>
            </div>

            {/* Rating & Review Counter */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <div className="flex items-center text-amber-500 gap-0.5 font-bold">
                <span>4.5</span>
                <div className="flex text-amber-400 ml-1">
                  {[1, 2, 3, 4].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <Star className="w-3.5 h-3.5 fill-current opacity-40" />
                </div>
                <ChevronDown className="w-3 h-3 text-[#565959] ml-0.5 cursor-pointer" />
              </div>
              <span className="text-[#565959]">|</span>
              <a href="#reviews" className="text-[#007185] hover:text-[#c45500] hover:underline">
                1,842 ratings
              </a>
            </div>

            {/* Bestseller Badge with Database Category */}
            <div className="flex items-center gap-2 text-xs pt-0.5">
              <span className="bg-[#c45500] text-white px-2 py-0.5 rounded-xs font-bold text-[11px] uppercase tracking-wide">
                #1 Best Seller
              </span>
              <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer font-medium">
                in {product.category?.name || "Catalog"}
              </span>
            </div>

            {/* Past Month Sales Badge */}
            <div className="text-xs font-bold text-[#0f1111] border-b border-slate-200 pb-3">
              5K+ bought <span className="font-normal text-[#565959]">in past month</span>
            </div>

            {/* Dynamic Database Price Section */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-1 text-[#0f1111]">
                <span className="text-xs font-normal align-top leading-none mt-1">$</span>
                <span className="text-3xl font-medium leading-none">{dollars}</span>
                <span className="text-xs font-normal align-top leading-none mt-1">{cents}</span>
              </div>

              {/* Amazon Visa Credit Card Banner */}
              <div className="text-xs text-[#565959] pt-1">
                <span className="font-medium text-[#007185] hover:underline cursor-pointer">
                  Get $50 off instantly:
                </span>{" "}
                Pay <span className="font-bold text-[#0f1111]">$0.00</span>{" "}
                <span className="line-through">${currentPrice.toFixed(2)}</span> upon approval for
                Amazon Visa. No annual fee.
              </div>

              {/* FREE Returns Collapsible Toggle */}
              <div className="text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setShowReturnsInfo(!showReturnsInfo)}
                  className="text-[#007185] hover:text-[#c45500] hover:underline font-medium inline-flex items-center gap-1"
                >
                  FREE Returns <ChevronDown className={`w-3 h-3 transition-transform ${showReturnsInfo ? "rotate-180" : ""}`} />
                </button>
                {showReturnsInfo && (
                  <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-md text-[11px] text-slate-700 space-y-1">
                    <p className="font-bold">Return this item for free</p>
                    <p>Free returns are available for the shipping address you chose. You can return the item for any reason in new and unused condition: no shipping charges.</p>
                  </div>
                )}
              </div>

              {/* Other Sellers Price Note */}
              <p className="text-xs text-[#565959] pt-1">
                Available at a lower price from{" "}
                <button
                  type="button"
                  onClick={() => setIsVendorsDrawerOpen(true)}
                  className="text-[#007185] hover:underline font-bold"
                >
                  other sellers ({inventory?.totalSellers || 0})
                </button>{" "}
                that may not offer free Prime shipping.
              </p>
            </div>

            {/* Dynamic Database Variant Swatches */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 border-t border-slate-200 pt-3">
                <div className="text-xs text-[#565959]">
                  Available Variants: <span className="font-bold text-[#0f1111]">{activeColorAttr}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => {
                    const isSelected = selectedVariant?.asin === v.asin;
                    const vName =
                      v.attributes?.map((a) => `${a.type}: ${a.value}`).join(" | ") ||
                      v.sku ||
                      `Variant ${i + 1}`;
                    const vThumb = v.thumbnail || v.images?.[0] || selectedImage;

                    return (
                      <button
                        key={v.asin}
                        type="button"
                        onClick={() => onSelectVariant(v)}
                        className={`p-2 rounded border transition-all flex flex-col items-center gap-1 bg-white text-left min-w-[80px] cursor-pointer ${
                          isSelected
                            ? "border-[#007185] ring-2 ring-[#007185] shadow-xs"
                            : "border-slate-300 hover:border-slate-500 opacity-90"
                        }`}
                      >
                        <div className="w-10 h-10 overflow-hidden flex items-center justify-center bg-slate-50 rounded">
                          <Image
                            src={vThumb}
                            alt={vName}
                            width={36}
                            height={36}
                            className="object-contain max-h-full max-w-full"
                          />
                        </div>
                        <span className="text-[10px] text-[#0f1111] font-bold truncate max-w-[85px]">
                          {v.attributes?.[0]?.value || `Var ${i + 1}`}
                        </span>
                        <span className="text-[10px] text-[#565959]">
                          ${(currentPrice + (i > 0 ? i * 2 : 0)).toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dynamic Product Specifications Table from MongoDB */}
            <div className="space-y-2 border-t border-slate-200 pt-3">
              <div className="text-xs font-bold text-[#0f1111]">Product Specifications</div>
              <div className="grid grid-cols-2 gap-y-1.5 text-xs text-[#0f1111]">
                <div className="font-bold text-[#565959]">Brand</div>
                <div>{product.brand}</div>

                <div className="font-bold text-[#565959]">Department</div>
                <div>{product.department?.name || "General"}</div>

                <div className="font-bold text-[#565959]">Category</div>
                <div>{product.category?.name || "General"}</div>

                <div className="font-bold text-[#565959]">ASIN</div>
                <div className="font-mono text-[11px] font-bold">{selectedVariant?.asin || "N/A"}</div>

                <div className="font-bold text-[#565959]">SKU</div>
                <div className="font-mono text-[11px]">{selectedVariant?.sku || "N/A"}</div>

                {selectedVariant?.attributes?.map((attr) => (
                  <React.Fragment key={attr.type}>
                    <div className="font-bold text-[#565959] capitalize">{attr.type}</div>
                    <div>{attr.value}</div>
                  </React.Fragment>
                ))}

                {showFullSpecs && (
                  <>
                    <div className="font-bold text-[#565959]">Database Product ID</div>
                    <div className="font-mono text-[10px] truncate">{product._id}</div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowFullSpecs(!showFullSpecs)}
                className="text-xs text-[#007185] hover:text-[#c45500] hover:underline font-medium inline-flex items-center gap-1 pt-1"
              >
                <ChevronDown className={`w-3 h-3 transition-transform ${showFullSpecs ? "rotate-180" : ""}`} />
                <span>{showFullSpecs ? "See less" : "See more"}</span>
              </button>
            </div>

            {/* About this item - Direct Features Array from Database */}
            <div className="space-y-2 border-t border-slate-200 pt-3">
              <h2 className="text-sm font-bold text-[#0f1111]">About this item</h2>
              {product.features && product.features.length > 0 ? (
                <ul className="space-y-2 text-xs text-[#0f1111] list-disc pl-4 leading-relaxed">
                  {product.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>
              )}
              <a href="#details" className="text-xs text-[#007185] hover:text-[#c45500] hover:underline font-medium inline-block pt-1">
                › See more product details
              </a>
            </div>

            {/* Product Description Box */}
            {product.description && (
              <div className="space-y-1.5 border-t border-slate-200 pt-3">
                <h3 className="text-xs font-bold text-[#0f1111]">Product Description</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Report Issue */}
            <div className="pt-2 border-t border-slate-200 text-xs">
              <button type="button" className="text-[#565959] hover:text-[#0f1111] flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-slate-400" />
                <span>Report an issue with this product or seller</span>
              </button>
            </div>

            {/* Consider a Similar Item - Dynamic Amazon Choice Box */}
            {categoryProducts.length > 0 && (
              <div className="space-y-2 border-t border-slate-200 pt-4">
                <h3 className="text-sm font-bold text-[#0f1111]">Consider a similar item</h3>
                <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 flex gap-3 items-center">
                  <div className="w-16 h-16 shrink-0 bg-white border border-slate-200 rounded p-1 flex items-center justify-center">
                    <Image
                      src={categoryProducts[0]?.variants?.[0]?.thumbnail || categoryProducts[0]?.variants?.[0]?.images?.[0] || selectedImage}
                      alt={categoryProducts[0]?.title || "Similar item"}
                      width={56}
                      height={56}
                      className="object-contain max-h-full max-w-full"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="bg-[#232f3e] text-[#febd69] px-1.5 py-0.5 rounded-xs font-bold text-[9px]">
                      Amazon&apos;s Choice
                    </span>
                    <a href={`/product/${categoryProducts[0]._id}`} className="text-[#007185] hover:text-[#c45500] font-medium line-clamp-2 leading-snug">
                      {categoryProducts[0].title}
                    </a>
                    <div className="flex items-center gap-1 text-[11px]">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-slate-500 font-medium">(1,842)</span>
                    </div>
                    <div className="font-bold text-[#0f1111]">$59.99</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= COLUMN 3: BUY BOX CARD & VENDORS (3 Cols) ================= */}
          <div className="lg:col-span-3 space-y-4 sticky top-4">
            {/* Main Amazon Buy Box Card */}
            <div className="border border-slate-300 rounded-lg p-4 bg-white space-y-3.5 shadow-xs">
              {/* Buy Box Price */}
              <div>
                <div className="flex items-baseline gap-0.5 text-[#0f1111]">
                  <span className="text-xs font-normal align-top leading-none mt-1">$</span>
                  <span className="text-2xl font-medium leading-none">{dollars}</span>
                  <span className="text-xs font-normal align-top leading-none mt-1">{cents}</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="text-xs text-[#0f1111] space-y-1">
                <div>
                  <span className="text-[#007185] font-bold">FREE delivery</span>{" "}
                  <span className="font-bold">Tomorrow, August 12.</span>
                </div>
                <div className="text-[#565959]">
                  Order within <span className="text-emerald-700 font-medium">3 hrs 15 mins.</span>{" "}
                  <a href="#details" className="text-[#007185] hover:underline">Details</a>
                </div>
              </div>

              {/* Delivery Location Selector */}
              <div className="text-xs text-[#007185] flex items-center gap-1.5 cursor-pointer hover:text-[#c45500]">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                <span>Deliver to New York 10001</span>
              </div>

              {/* Stock Status */}
              <div>
                {inventoryLoading ? (
                  <div className="skeleton h-4 w-24 bg-slate-200"></div>
                ) : buyBox?.isStock !== false ? (
                  <span className="text-lg font-medium text-[#007600] block">In Stock</span>
                ) : (
                  <span className="text-lg font-medium text-red-600 block">Currently Unavailable</span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="space-y-1">
                <label className="text-xs text-[#565959] block font-medium">Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="select select-xs select-bordered w-full rounded-md bg-[#f0f2f2] text-xs font-medium border-slate-300 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 10].map((num) => (
                    <option key={num} value={num}>
                      Quantity: {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2 pt-1">
                {/* Amazon Signature Yellow Add to Cart Button */}
                <button
                  type="button"
                  onClick={() => handleAddToCart()}
                  disabled={buyBox?.isStock === false}
                  className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-[#0f1111] font-normal text-xs rounded-full shadow-xs border border-[#fcd200] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to cart</span>
                </button>

                {/* Amazon Signature Orange Buy Now Button */}
                <button
                  type="button"
                  onClick={() => handleAddToCart()}
                  disabled={buyBox?.isStock === false}
                  className="w-full py-2 bg-[#ffa41c] hover:bg-[#fa8900] active:bg-[#e07b00] text-[#0f1111] font-normal text-xs rounded-full shadow-xs border border-[#ff8f00] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Seller / Fulfillment Details from Database */}
              <div className="text-xs text-[#565959] space-y-1.5 border-t border-slate-200 pt-3">
                <div className="grid grid-cols-2 gap-1">
                  <span>Shipper / Seller</span>
                  <span className="text-[#007185] font-medium truncate">
                    {buyBox?.fulfillmentBy || buyBox?.vendor?.name || "Merchant Store"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span>Returns</span>
                  <span className="text-[#007185] font-medium">FREE 30-day refund/replacement</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span>Payment</span>
                  <span className="text-[#007185] font-medium flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-500" /> Secure transaction
                  </span>
                </div>
              </div>

              {/* Add to List */}
              <div className="border-t border-slate-200 pt-3">
                <button
                  type="button"
                  className="btn btn-sm btn-outline w-full rounded-md font-normal bg-[#f7fafa] hover:bg-[#e7e9ec] border-slate-300 text-xs text-[#0f1111] h-8 min-h-0"
                >
                  Add to List
                </button>
              </div>
            </div>

            {/* Other Sellers on Amazon Card & Vendors Drawer Button */}
            <div className="border border-slate-300 rounded-lg p-4 bg-white space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0f1111]">Other sellers on Amazon</h3>
                <span className="badge badge-neutral text-[10px] font-mono">{inventory?.totalSellers || 0} Vendors</span>
              </div>

              {/* Open Drawer Button */}
              <button
                type="button"
                onClick={() => setIsVendorsDrawerOpen(true)}
                className="w-full py-2 px-3 bg-[#f7fafa] hover:bg-[#e7e9ec] border border-slate-300 rounded-lg flex items-center justify-between text-xs text-[#0f1111] font-medium transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#007185]" />
                  <span>View All Vendors ({inventory?.totalSellers || 0})</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              <div
                onClick={() => setIsVendorsDrawerOpen(true)}
                className="p-2 rounded bg-slate-50 border border-slate-200 cursor-pointer hover:border-slate-400 transition-all text-xs"
              >
                <div className="font-bold text-[#0f1111]">
                  New & Used ({inventory?.totalSellers || 1}) from ${currentPrice.toFixed(2)}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">& FREE Shipping ›</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sellers on Amazon & Alternative Items View */}
        <SellersOnAmazon
          product={product}
          inventory={inventory}
          selectedImage={selectedImage}
          categoryProducts={categoryProducts}
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* DaisyUI Vendors Side Drawer Overlay */}
      <VendorsDrawer
        isOpen={isVendorsDrawerOpen}
        onClose={() => setIsVendorsDrawerOpen(false)}
        inventory={inventory}
        selectedVariant={selectedVariant}
        productTitle={product.title || "Product Details"}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};
