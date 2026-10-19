"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSingleProductQuery } from "@/redux/features/product/productApi";
import { useAllVariantsByProductQuery } from "@/redux/features/variant/variantApi";
import { useGetInventoryByVariantAsinQuery } from "@/redux/features/inventory/inventoryApi";
import { useGetSingleProductReviewQuery } from "@/redux/features/review/reviewApi";
import { TProduct, TVariant } from "@/types/product";
import { TInventory } from "@/types/inventory";
import { TReview } from "@/types/review";
import { TCartItem } from "@/types/order";
import { ProductBreadcrumbs } from "@/components/ui/product/ProductBreadcrumbs";
import { ProductImageGallery } from "@/components/ui/product/ProductImageGallery";
import { ProductHeaderInfo } from "@/components/ui/product/ProductHeaderInfo";
import { ProductPriceBlock } from "@/components/ui/product/ProductPriceBlock";
import { ProductVariantSelector } from "@/components/ui/product/ProductVariantSelector";
import { ProductFeaturesList } from "@/components/ui/product/ProductFeaturesList";
import { ProductBuyBox } from "@/components/ui/product/ProductBuyBox";
import { ProductDetailsTable } from "@/components/ui/product/ProductDetailsTable";
import { ProductDescriptionSection } from "@/components/ui/product/ProductDescriptionSection";
import { ProductSellerOffers } from "@/components/ui/product/ProductSellerOffers";
import { ProductReviewSection } from "@/components/ui/product/ProductReviewSection";
import { ProductPageSkeleton } from "@/src/components/ui/skeleton";
import { AlertTriangle, ArrowLeft, ShoppingCart, Zap, Sparkles, ChevronRight } from "lucide-react";
import { useAppDispatch } from "@/src/redux/hooks";
import { addToCart } from "@/redux/features/order/orderSlice";
import { toast } from "react-toastify";


function SingleProductPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const productId = (params?.id as string) || "";
  const queryVariantId = searchParams?.get("variantId") || searchParams?.get("variant") || "";

  // 1. Fetch Product details
  const {
    data: productResponse,
    isLoading: isLoadingProduct,
    isError: isProductError,
  } = useSingleProductQuery(productId, { skip: !productId });

  const product: TProduct | undefined = productResponse?.data;

  // 1. Fetch product variants via router.get("/variant-product/:id", VariantControllers.allVariantsByProduct)
  const {
    data: variantsResponse,
    isLoading: isLoadingVariants,
  } = useAllVariantsByProductQuery(productId, { skip: !productId });

  const variants: TVariant[] = useMemo(() => {
    if (Array.isArray(variantsResponse?.data?.data)) {
      return variantsResponse.data.data;
    }
    if (Array.isArray(variantsResponse?.data)) {
      return variantsResponse.data;
    }
    return product?.variants || [];
  }, [variantsResponse, product?.variants]);

  // Selected Variant State: tracks user's explicit selection or URL query variantId.
  const [selectedVariant, setSelectedVariant] = useState<TVariant | null>(null);

  // Reset selected variant when navigating to a different product
  useEffect(() => {
    setSelectedVariant(null);
  }, [productId]);

  // Synchronize selected variant when queryVariantId changes in URL
  useEffect(() => {
    if (queryVariantId && variants.length > 0) {
      const match = variants.find(
        (v) => v._id === queryVariantId || v.asin === queryVariantId || v.sku === queryVariantId
      );
      if (match) {
        setSelectedVariant(match);
      }
    }
  }, [queryVariantId, variants]);

  const activeVariant: TVariant | undefined = useMemo(() => {
    if (selectedVariant) {
      const match = variants.find(
        (v) => v._id === selectedVariant._id || (v.asin && v.asin === selectedVariant.asin)
      );
      if (match) return match;
      return selectedVariant;
    }
    if (queryVariantId) {
      const match = variants.find(
        (v) => v._id === queryVariantId || v.asin === queryVariantId || v.sku === queryVariantId
      );
      if (match) return match;
    }
    return variants.length > 0 ? variants[0] : undefined;
  }, [variants, selectedVariant, queryVariantId]);

  // 2. Fetch sellers or vendors based on selected variant via router.get("/variant/:asin", InventoryControllers.getInventoryByVariantAsin)
  const activeAsin = activeVariant?.asin || activeVariant?._id || "";
  const {
    data: inventoryResponseData,
    currentData: inventoryCurrentData,
    isFetching: isLoadingInventory,
  } = useGetInventoryByVariantAsinQuery(activeAsin, {
    skip: !activeAsin,
    refetchOnMountOrArgChange: true,
  });

  // The server returns: { data: { asin, buyBoxWinner, totalSellers, sellers } }
  // We trust the server to return only listings matching the requested ASIN with isStock: true.
  const inventoryResult: {
    asin?: string;
    buyBoxWinner?: TInventory | null;
    totalSellers?: number;
    sellers?: TInventory[];
  } | null = useMemo(() => {
    const raw = inventoryCurrentData ?? inventoryResponseData;
    if (!raw) return null;
    const body = (raw as any)?.data ?? raw;
    // Guard against showing stale inventory data from previously selected variant
    if (body?.asin && activeAsin && body.asin !== activeAsin && body.asin !== activeVariant?._id) {
      return null;
    }
    return body;
  }, [inventoryCurrentData, inventoryResponseData, activeAsin, activeVariant?._id]);

  // Sellers: display all verified sellers/vendors available for this variant
  const sellers: TInventory[] = useMemo(() => {
    const list = inventoryResult?.sellers;
    if (Array.isArray(list) && list.length > 0) {
      return list.filter(
        (listing: TInventory) => listing?.seller != null
      );
    }
    // Fallback: use variant's embedded inventory if available and not yet replaced
    if (Array.isArray(activeVariant?.inventory) && activeVariant.inventory.length > 0) {
      return activeVariant.inventory.filter((listing: any) => listing?.seller != null);
    }
    return [];
  }, [inventoryResult, activeVariant?.inventory]);

  // BuyBoxWinner: prefer server-designated winner, then flagged winner, then lowest price
  const buyBoxWinner: TInventory | null = useMemo(() => {
    const serverWinner = inventoryResult?.buyBoxWinner as TInventory | null | undefined;
    if (serverWinner && serverWinner._id) {
      return serverWinner;
    }
    if (sellers.length === 0) return null;
    return (
      sellers.find((l) => l.seller?.isBuyBoxWinner) ||
      [...sellers].sort((a, b) => (a.seller?.price ?? 0) - (b.seller?.price ?? 0))[0]
    );
  }, [inventoryResult, sellers]);

  const totalSellers = inventoryResult?.totalSellers ?? sellers.length;

  // 3. Fetch reviews for the product variant via router.get("/variant-reviews/:id", ProductReviewControllers.getSingleProductReview)
  const activeVariantId = activeVariant?._id || "";
  const {
    data: reviewsResponse,
    currentData: reviewsCurrentData,
    isLoading: isLoadingReviews,
  } = useGetSingleProductReviewQuery(activeVariantId, {
    skip: !activeVariantId,
    refetchOnMountOrArgChange: true,
  });

  const rawReviewsData = reviewsCurrentData ?? reviewsResponse;
  const reviewPayload = (rawReviewsData as any)?.data ?? rawReviewsData;

  const reviews: TReview[] = useMemo(() => {
    if (!rawReviewsData) return [];
    if (Array.isArray(reviewPayload?.data)) return reviewPayload.data;
    if (Array.isArray(reviewPayload)) return reviewPayload;
    if (Array.isArray((rawReviewsData as any)?.data)) return (rawReviewsData as any).data;
    if (Array.isArray(rawReviewsData)) return rawReviewsData;
    return [];
  }, [rawReviewsData, reviewPayload]);

  const totalRatings: number = useMemo(() => {
    if (typeof reviewPayload?.totalRatings === "number") return reviewPayload.totalRatings;
    if (typeof reviewPayload?.meta?.total === "number") return reviewPayload.meta.total;
    if (typeof (rawReviewsData as any)?.totalRatings === "number") return (rawReviewsData as any).totalRatings;
    if (typeof (rawReviewsData as any)?.meta?.total === "number") return (rawReviewsData as any).meta.total;
    if (Array.isArray(reviews) && reviews.length > 0) return reviews.length;
    return 0;
  }, [reviewPayload, rawReviewsData, reviews]);

  const averageRating: string = useMemo(() => {
    if (reviewPayload?.averageRating && !isNaN(parseFloat(String(reviewPayload.averageRating))) && parseFloat(String(reviewPayload.averageRating)) > 0) {
      return parseFloat(String(reviewPayload.averageRating)).toFixed(1);
    }
    if ((rawReviewsData as any)?.averageRating && !isNaN(parseFloat(String((rawReviewsData as any).averageRating))) && parseFloat(String((rawReviewsData as any).averageRating)) > 0) {
      return parseFloat(String((rawReviewsData as any).averageRating)).toFixed(1);
    }
    if (reviews.length === 0) return "0.0";
    const sum = reviews.reduce((acc: number, r: any) => acc + (Number(r?.rating) || 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviewPayload, rawReviewsData, reviews]);

  // Pricing: use winner price if available, otherwise lowest seller or product fallback
  const winnerPrice =
    buyBoxWinner?.seller?.price ??
    (sellers[0]?.seller?.price ?? product?.minPrice ?? 29.99);

  // Fallback / Loading Skeleton
  if (isLoadingProduct || (isLoadingVariants && !product)) {
    return <ProductPageSkeleton />;
  }

  // Not Found / Error State
  if (isProductError || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center select-none">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 space-y-4 inline-block max-w-lg">
          <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">
            Product Not Found
          </h2>
          <p className="text-xs text-slate-600">
            We couldn&apos;t find the product you requested. It may have been removed
            or the link might be broken.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Amarzone Home</span>
          </Link>
        </div>
      </div>
    );
  }

  // Mobile Sticky Quick Actions Handler
  const handleMobileAddToCart = () => {
    try {
      const variantId = activeVariant?._id || variants[0]?._id || product.variants?.[0]?._id;
      const vendorId =
        buyBoxWinner?.seller?.vendor?._id ||
        product.author?.id ||
        product.author?._id;

      const categoryName =
        typeof product.category === "object"
          ? product.category?.name
          : typeof product.category === "string"
            ? product.category
            : "General";

      const cartItem: TCartItem = {
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
        category: categoryName,
        price: winnerPrice,
        originalPrice:
          product.minPrice && product.minPrice > winnerPrice
            ? product.minPrice
            : Number((winnerPrice * 1.15).toFixed(2)),
        quantity: 1,
        maxQuantity: buyBoxWinner?.seller?.quantity || 10,
        seller: buyBoxWinner?.seller,
        vendor: buyBoxWinner?.seller?.vendor || product.author,
        vendorId: vendorId,
        inStock: buyBoxWinner?.seller?.isStock ?? true,
        shippingTime: buyBoxWinner?.seller?.shippingTime ?? 2,
        attributes: activeVariant?.attributes || [],
        isSelected: true,
      };
      dispatch(addToCart(cartItem));
      toast.success(`Added "${product.title.slice(0, 24)}..." to cart!`, {
        position: "bottom-right",
      });
    } catch {
      toast.info("Item added to cart!");
    }
  };

  const handleMobileBuyNow = () => {
    handleMobileAddToCart();
    setTimeout(() => {
      router.push("/cart?checkout=true");
    }, 400);
  };

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 pb-24 lg:pb-12 space-y-6">
        {/* Breadcrumb Navigation */}
        <ProductBreadcrumbs
          departmentName={product.department?.name}
          departmentId={product.department?._id}
          categoryName={product.category?.name}
          categoryId={product.category?._id}
          productTitle={product.title}
        />

        {/* 3-Column Hero Section (Amazon Reference Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Column 1: Image Gallery (Left ~42%) */}
          <div className="lg:col-span-5">
            <ProductImageGallery
              images={activeVariant?.images || []}
              thumbnail={activeVariant?.thumbnail || product.thumbnail}
              title={product.title}
              isBestSeller={product.isBestSeller}
              isPrivateLevel={activeVariant?.isPrivateLevel}
            />
          </div>

          {/* Column 2: Product Core Info & Options (Center ~33%) */}
          <div className="lg:col-span-4 space-y-1">
            <ProductHeaderInfo
              brand={product.brand}
              title={product.title}
              averageRating={averageRating}
              totalRatings={totalRatings}
              categoryName={product.category?.name}
              isBestSeller={product.isBestSeller}
            />

            <ProductPriceBlock
              price={winnerPrice}
              originalPrice={winnerPrice * 1.15}
            />

            {variants && variants.length > 0 && activeVariant && (
              <ProductVariantSelector
                variants={variants}
                selectedVariant={activeVariant}
                averageRating={averageRating}
                totalRatings={totalRatings}
                onSelectVariant={(v) => {
                  setSelectedVariant(v);
                  router.replace(`/products/${productId}?variantId=${v._id}`, { scroll: false });
                }}
              />
            )}

            <ProductFeaturesList features={product.features} />
          </div>

          {/* Column 3: Buy Box (Right ~25%) */}
          <div className="lg:col-span-3">
            <div className="sticky top-20">
              <ProductBuyBox
                buyBoxListing={buyBoxWinner}
                totalSellers={totalSellers}
                product={product}
                selectedVariant={activeVariant}
                isLoadingInventory={isLoadingInventory || isLoadingProduct}
              />

              {/* Multi-Vendor Comparison: Other Sellers on Amarzone */}
              {sellers.length > 1 && (
                <ProductSellerOffers
                  sellers={sellers}
                  buyBoxWinnerId={buyBoxWinner?._id}
                  product={product}
                  selectedVariant={activeVariant}
                />
              )}

              {/* AI Product Assistant Advisor Card */}
              <div className="mt-4 p-4 rounded-2xl bg-[#170d2f] text-white border border-amber-400/25 shadow-lg space-y-3 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30 shrink-0">
                    <Sparkles className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>Amarzone AI Advisor</span>
                      <span className="badge badge-warning text-[9px] font-black px-1.5 py-0 text-slate-950">
                        Instant
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Have questions about this item?
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(
                          new CustomEvent("open-ai-shopping-assistant", {
                            detail: {
                              productId: product._id,
                              productTitle: product.title,
                              category: product.category?.name,
                              seedQuery: `Tell me the key highlights, compatibility, and user sentiment for ${product.title}`,
                            },
                          })
                        );
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-sm active:scale-98"
                  >
                    <span>Ask AI About This Product</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(
                          new CustomEvent("open-ai-shopping-assistant", {
                            detail: {
                              productId: product._id,
                              productTitle: product.title,
                              category: product.category?.name,
                              seedQuery: `Compare ${product.title} with top market alternatives in this category`,
                            },
                          })
                        );
                      }
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-[11px] font-semibold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Compare with Alternatives</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Product Details & Specifications */}
        <ProductDetailsTable
          product={product}
          selectedVariant={activeVariant}
        />

        {/* Product Editorial Description */}
        <ProductDescriptionSection product={product} />


        {/* Bottom Section: Customer Reviews & Rating Breakdown */}
        <ProductReviewSection
          reviews={reviews}
          averageRating={averageRating}
          totalRatings={totalRatings}
          isLoading={isLoadingReviews}
          productTitle={product?.title}
          selectedVariant={activeVariant}
        />
      </div>

      {/* Sticky Bottom Bar for Mobile Viewports (Amazon App UX) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 lg:hidden shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            Price
          </span>
          <span className="text-base font-extrabold text-slate-900">
            ${winnerPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end max-w-xs">
          <button
            type="button"
            onClick={handleMobileAddToCart}
            className="flex-1 py-2 px-3 rounded-full bg-[#ffd814] active:bg-[#f0b800] text-slate-900 text-xs font-bold flex items-center justify-center gap-1 border border-[#fcd200] shadow-xs cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            onClick={handleMobileBuyNow}
            className="flex-1 py-2 px-3 rounded-full bg-[#ffa41c] active:bg-[#ee7d00] text-slate-900 text-xs font-bold flex items-center justify-center gap-1 border border-[#ff8f00] shadow-xs cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-900" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default function SingleProductPage() {
  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <SingleProductPageContent />
    </Suspense>
  );
}
