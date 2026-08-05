"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Check, ShieldCheck, ShoppingCart, Truck, Store } from "lucide-react";

interface TVariantAttribute {
  type: string;
  value: string;
}

interface TVariant {
  asin: string;
  sku: string;
  attributes: TVariantAttribute[];
  thumbnail: string;
  images: string[];
  isPrivateLevel?: boolean;
}

interface TParentProduct {
  _id: string;
  title: string;
  description: string;
  brand: string;
  features: string[];
  department?: { name: string };
  category?: { name: string; variantAttributes?: string[] };
  tags?: string[];
  variants: TVariant[];
}

interface TSeller {
  vendor?: { name: string; avatar?: string };
  price: number;
  quantity: number;
  isStock: boolean;
  fulfillmentBy: string;
  shippingTime: number;
  isBuyBoxWinner?: boolean;
}

interface TInventoryResult {
  asin: string;
  buyBoxWinner: { seller: TSeller } | null;
  totalSellers: number;
  sellers: { _id: string; seller: TSeller }[];
}

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<TParentProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<TVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [inventory, setInventory] = useState<TInventoryResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [inventoryLoading, setInventoryLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch Parent Product
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`http://localhost:9000/api/v1/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProduct(data.data);
          if (data.data.variants && data.data.variants.length > 0) {
            const firstVar = data.data.variants[0];
            setSelectedVariant(firstVar);
            setSelectedImage(firstVar.thumbnail || firstVar.images?.[0] || "");
          }
        } else {
          setError(data.message || "Failed to load product details.");
        }
      })
      .catch(() => setError("Error connecting to server."))
      .finally(() => setLoading(false));
  }, [productId]);

  // Fetch Inventory when selectedVariant changes
  useEffect(() => {
    if (!selectedVariant?.asin) return;
    setInventoryLoading(true);
    fetch(`http://localhost:9000/api/v1/inventories/variant/${selectedVariant.asin}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInventory(data.data);
        }
      })
      .catch((err) => console.error("Error fetching variant inventory:", err))
      .finally(() => setInventoryLoading(false));
  }, [selectedVariant]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        <div className="loading loading-spinner loading-lg text-amber-500 mb-4"></div>
        <p className="font-medium">Loading Product Details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-red-500">
        <p className="text-xl font-bold">Product Not Found</p>
        <p className="mt-2 text-slate-600">{error || "Unable to load product information."}</p>
      </div>
    );
  }

  const buyBox = inventory?.buyBoxWinner?.seller;
  const allImages = [
    selectedVariant?.thumbnail,
    ...(selectedVariant?.images || []),
  ].filter(Boolean) as string[];

  // Group attributes dynamically across all variants (NO hardcoded field names)
  const dynamicAttributeGroups: Record<string, string[]> = {};
  if (product.variants && Array.isArray(product.variants)) {
    product.variants.forEach((v) => {
      v.attributes?.forEach((attr) => {
        if (!dynamicAttributeGroups[attr.type]) {
          dynamicAttributeGroups[attr.type] = [];
        }
        if (!dynamicAttributeGroups[attr.type].includes(attr.value)) {
          dynamicAttributeGroups[attr.type].push(attr.value);
        }
      });
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-800">
      {/* Breadcrumb Header */}
      <div className="text-sm text-slate-500 mb-6">
        <span>{product.department?.name || "Department"}</span> &gt;{" "}
        <span>{product.category?.name || "Category"}</span> &gt;{" "}
        <span className="text-slate-800 font-semibold">{product.brand}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Variant Images Gallery */}
        <div className="lg:col-span-5">
          <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-xs text-center mb-4">
            {selectedImage ? (
              <div className="relative w-full h-80 sm:h-96">
                <Image
                  src={selectedImage}
                  alt={product.title}
                  fill
                  className="object-contain rounded-xl"
                  unoptimized
                />
              </div>
            ) : (
              <div className="h-80 sm:h-96 flex items-center justify-center bg-slate-50 text-slate-400 font-medium">
                No Image Available
              </div>
            )}
          </div>

          {/* Thumbnails list */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${
                    selectedImage === imgUrl
                      ? "border-amber-500 shadow-sm"
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={imgUrl} alt={`Thumbnail ${idx}`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Middle Column: Parent Product Info & Fully Dynamic Variant Attribute Groups */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
              {product.brand}
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">{product.title}</h1>
            <p className="text-xs text-slate-400 mt-1">ASIN: {selectedVariant?.asin || "N/A"}</p>
          </div>

          <hr className="border-slate-100" />

          {/* Dynamic Variant Attributes Selectors (Generated dynamically per Category attributes) */}
          {Object.keys(dynamicAttributeGroups).length > 0 && (
            <div className="space-y-3">
              {Object.entries(dynamicAttributeGroups).map(([attrType, values]) => {
                const currentVal = selectedVariant?.attributes?.find(
                  (a) => a.type.toLowerCase() === attrType.toLowerCase()
                )?.value;

                return (
                  <div key={attrType}>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {attrType}: <span className="font-normal text-amber-600">{currentVal}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {values.map((val) => {
                        const matchingVariant = product.variants.find((v) =>
                          v.attributes?.some(
                            (a) =>
                              a.type.toLowerCase() === attrType.toLowerCase() &&
                              a.value.toLowerCase() === val.toLowerCase()
                          )
                        );
                        const isSelected = currentVal?.toLowerCase() === val.toLowerCase();

                        return (
                          <button
                            key={val}
                            onClick={() => {
                              if (matchingVariant) {
                                setSelectedVariant(matchingVariant);
                                setSelectedImage(
                                  matchingVariant.thumbnail || matchingVariant.images?.[0] || ""
                                );
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                              isSelected
                                ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* All Variant Options fallback */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                All Available Variants ({product.variants.length})
              </label>
              <div className="flex flex-wrap gap-1.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.asin === v.asin;
                  const labelText =
                    v.attributes?.map((a) => a.value).join(" / ") || v.sku;
                  return (
                    <button
                      key={v.asin}
                      onClick={() => {
                        setSelectedVariant(v);
                        setSelectedImage(v.thumbnail || v.images?.[0] || "");
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {labelText}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Key Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">About this item</h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Parent Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Description</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>
          </div>
        </div>

        {/* Right Column: Inventory & Buy Box Card */}
        <div className="lg:col-span-3">
          <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm flex flex-col gap-4">
            {inventoryLoading ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                <div className="loading loading-spinner loading-md text-amber-500 mb-2"></div>
                Fetching seller prices...
              </div>
            ) : buyBox ? (
              <>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900">${buyBox.price}</span>
                  <span className="text-xs text-slate-500 font-medium">USD</span>
                </div>

                <div className="text-xs">
                  {buyBox.isStock ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> In Stock ({buyBox.quantity} available)
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">Currently Out of Stock</span>
                  )}
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1 text-slate-600 border border-slate-100">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Store className="w-3.5 h-3.5 text-amber-600" />
                    <span>Sold by: {buyBox.vendor?.name || "Featured Seller"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Ships in {buyBox.shippingTime || 2} business days</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Fulfillment by {buyBox.fulfillmentBy}</span>
                  </div>
                </div>

                <button
                  disabled={!buyBox.isStock}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>

                {/* Multiple Sellers Count */}
                {inventory && inventory.totalSellers > 1 && (
                  <div className="border-t border-slate-100 pt-3 text-center text-xs">
                    <span className="text-slate-500">Other Sellers ({inventory.totalSellers - 1}):</span>
                    <div className="mt-2 space-y-1.5">
                      {inventory.sellers.map((s) => (
                        <div
                          key={s._id}
                          className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg"
                        >
                          <span className="font-medium text-slate-700">
                            {s.seller.vendor?.name || "Vendor"}
                          </span>
                          <span className="font-bold text-slate-900">${s.seller.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">
                <p className="font-semibold text-slate-700">No Active Sellers</p>
                <p className="mt-1">No vendors are currently selling this variant.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
