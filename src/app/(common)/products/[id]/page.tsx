"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSingleProductQuery } from "@/redux/features/product/productApi";
import { useGetInventoryByAsinQuery } from "@/redux/features/inventory/inventoryApi";
import { useVariantReviewsQuery } from "@/redux/features/review/reviewApi";
import { TProduct, TVariant } from "@/types/product";
import {
  ProductBreadcrumbs,
  ProductImageGallery,
  ProductHeaderInfo,
  ProductPriceBlock,
  ProductVariantSelector,
  ProductFeaturesList,
  ProductBuyBox,
  ProductDetailsTable,
  ProductDescriptionSection,
  ProductSellerOffers,
  ProductReviewSection,
  ProductPageSkeleton,
} from "@/components/ui/product";
import { AlertTriangle, ArrowLeft, ShoppingCart, Zap } from "lucide-react";
import { useAppDispatch } from "@/src/redux/hooks";
import { addToCart } from "@/redux/features/order/orderSlice";
import { toast } from "react-toastify";

export default function SingleProductPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const productId = (params?.id as string) || "";

  // 1. Fetch Product details
  const {
    data: productResponse,
    isLoading: isLoadingProduct,
    isError: isProductError,
  } = useSingleProductQuery(productId, { skip: !productId });

  const product: TProduct | undefined = productResponse?.data;

  // Selected Variant State (defaults to first variant in array)
  const [selectedVariant, setSelectedVariant] = useState<TVariant | null>(null);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  const activeVariant: TVariant | undefined =
    selectedVariant || (product?.variants && product.variants[0]);

  // 2. Fetch Inventory / Sellers by selected variant's ASIN
  const activeAsin = activeVariant?.asin || "";
  const {
    data: inventoryResponse,
    isLoading: isLoadingInventory,
  } = useGetInventoryByAsinQuery(activeAsin, {
    skip: !activeAsin,
  });

  const inventoryData = inventoryResponse?.data;
  const buyBoxWinner = inventoryData?.buyBoxWinner || null;
  const totalSellers = inventoryData?.totalSellers || 0;
  const sellers = inventoryData?.sellers || [];

  // 3. Fetch Variant Reviews by selected variant's ID
  const activeVariantId = activeVariant?._id || "";
  const {
    data: reviewsResponse,
    isLoading: isLoadingReviews,
  } = useVariantReviewsQuery(
    { variantId: activeVariantId },
    { skip: !activeVariantId }
  );

  const reviewPayload = reviewsResponse?.data;
  const reviews = reviewPayload?.data || [];
  const averageRating =
    reviewPayload?.averageRating || product?.averageRating || "4.50";
  const totalRatings =
    reviewPayload?.totalRatings || product?.reviewCount || reviews.length || 0;

  // Pricing: use winner price if available, otherwise lowest seller or product fallback
  const winnerPrice =
    buyBoxWinner?.seller?.price ??
    (sellers[0]?.seller?.price ?? product?.minPrice ?? 29.99);

  // Fallback / Loading Skeleton
  if (isLoadingProduct) {
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
      const variantId = activeVariant?._id || product.variants?.[0]?._id;
      const vendorId =
        buyBoxWinner?.seller?.vendor?._id ||
        (product.author as any)?.id ||
        (product.author as any)?._id;

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

            {product.variants && product.variants.length > 0 && activeVariant && (
              <ProductVariantSelector
                variants={product.variants}
                selectedVariant={activeVariant}
                onSelectVariant={(v) => setSelectedVariant(v)}
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
                isLoadingInventory={isLoadingInventory}
              />
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

        {/* Multi-Vendor Comparison: Other Sellers on Amarzone */}
        {sellers.length > 0 && (
          <ProductSellerOffers
            sellers={sellers}
            buyBoxWinnerId={buyBoxWinner?._id}
            product={product}
          />
        )}

        {/* Bottom Section: Customer Reviews & Rating Breakdown */}
        <ProductReviewSection
          reviews={reviews}
          averageRating={averageRating}
          totalRatings={totalRatings}
          isLoading={isLoadingReviews}
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
