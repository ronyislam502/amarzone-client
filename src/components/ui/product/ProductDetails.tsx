"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSingleProductQuery } from "@/redux/features/product/productApi";
import { useAllVariantsByProductQuery } from "@/redux/features/variant/variantApi";
import { useAllReviewsByProductQuery } from "@/redux/features/review/reviewApi";
import { useGetInventoryByVariantQuery } from "@/redux/features/inventory/inventoryApi";
import { TVariant } from "@/types/product";
import ProductBread from "./ProductBread";
import ProductImageGallery from "./ProductImageGallery";
import ProductHeader from "./ProductHeader";
import ProductPriceBlock from "./ProductPrice";
import ProductVariantSelector from "./ProductVariantSelector";
import ProductFeatures from "./ProductFeatures";
import ProductBuyBox from "./ProductBuyBox";
import ProductSellerOffers from "./ProdVariantVendors";
import ProductAIAdvisor from "./ProductAIAdvisor";
import ProductDetailsTable from "./ProductDetailsTable";
import ProductDescriptionSection from "./ProductDescriptionSection";
import ProdVariantReviews from "./ProdVariantReviews";
import { ShoppingCart, Zap } from "lucide-react";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = params?.id as string | undefined;
  const variantIdFromQuery = searchParams.get("variantId") || searchParams.get("variant");

  const [selectedVariant, setSelectedVariant] = useState<TVariant | null>(null);

  // 1. Fetch single product details directly from database
  const {
    data: singleProductData,
    isLoading: isLoadingProduct,
  } = useSingleProductQuery(productId, { skip: !productId });

  // 2. Fetch all variants for this product from database
  const {
    data: productVariantsData,
    isLoading: isLoadingVariants,
  } = useAllVariantsByProductQuery(productId, { skip: !productId });

  const variants = (productVariantsData?.data as any[]) || [];

  // Determine active variant strictly from database variants
  const activeVariant: TVariant | null = useMemo(() => {
    if (selectedVariant) return selectedVariant;
    if (variantIdFromQuery && variants.length > 0) {
      const match = variants.find((v) => v._id === variantIdFromQuery);
      if (match) return match;
    }
    return variants.length > 0 ? variants[0] : null;
  }, [selectedVariant, variantIdFromQuery, variants]);

  // Real product data from activeVariant populated product or single product query
  const product = (activeVariant as any)?.product || singleProductData?.data || null;

  const variantId = activeVariant?._id;
  const variantAsin = activeVariant?.asin;

  // 3. Query real reviews by variant from database
  const {
    data: productReviewsData,
    isLoading: isLoadingReviews,
  } = useAllReviewsByProductQuery(variantId, {
    skip: !variantId,
  });

  // 4. Query real inventory sellers by variant ASIN from database
  const {
    data: inventoryData,
    isLoading: isLoadingInventory,
  } = useGetInventoryByVariantQuery(variantAsin, {
    skip: !variantAsin,
  });


  // Database sellers list for the active variant
  const sellers: any[] = useMemo(() => {
    if (Array.isArray(inventoryData?.data)) {
      return inventoryData.data;
    }
    if (Array.isArray((inventoryData?.data as any)?.sellers)) {
      return (inventoryData?.data as any).sellers;
    }
    return [];
  }, [inventoryData]);

  const totalSellers =
    inventoryData?.meta?.total ??
    (Array.isArray(sellers) ? sellers.length : 0);

  // Variant-wise Buy Box Winner resolution from database listings
  const buyBoxWinner = useMemo(() => {
    if (!sellers || sellers.length === 0) {
      return (inventoryData?.data as any)?.buyBoxWinner || null;
    }

    // 1. Explicit winner marked in database: seller.isBuyBoxWinner === true
    const explicitWinner = sellers.find(
      (item: any) => item?.seller?.isBuyBoxWinner === true
    );
    if (explicitWinner) return explicitWinner;

    // 2. Winner attached to API response object (if any)
    if ((inventoryData?.data as any)?.buyBoxWinner) {
      return (inventoryData?.data as any).buyBoxWinner;
    }

    // 3. Platform Buy Box rule: lowest-priced in-stock seller for this variant
    const inStockSellers = sellers.filter((item: any) => {
      const s = item?.seller;
      if (!s) return false;
      const isStock =
        s.isStock !== false &&
        (s.quantity === undefined || Number(s.quantity) > 0);
      const hasValidPrice =
        typeof s.price === "number" && !isNaN(s.price) && s.price > 0;
      return isStock && hasValidPrice;
    });

    if (inStockSellers.length > 0) {
      return inStockSellers.reduce((best: any, current: any) => {
        const bestPrice = Number(best?.seller?.price) || Infinity;
        const currentPrice = Number(current?.seller?.price) || Infinity;
        return currentPrice < bestPrice ? current : best;
      }, inStockSellers[0]);
    }

    // 4. Fallback: lowest price among any listings with valid price > 0
    const pricedSellers = sellers.filter((item: any) => {
      const p = item?.seller?.price;
      return typeof p === "number" && !isNaN(p) && p > 0;
    });

    if (pricedSellers.length > 0) {
      return pricedSellers.reduce((best: any, current: any) => {
        const bestPrice = Number(best?.seller?.price) || Infinity;
        const currentPrice = Number(current?.seller?.price) || Infinity;
        return currentPrice < bestPrice ? current : best;
      }, pricedSellers[0]);
    }

    // 5. Final fallback: first available seller
    return sellers[0] || null;
  }, [sellers, inventoryData]);

  const sellerInfo = (buyBoxWinner as any)?.seller;

  // Database reviews list (no fallback mock reviews)
  const rawReviews = productReviewsData?.data;
  const reviews = Array.isArray(rawReviews)
    ? rawReviews
    : Array.isArray((rawReviews as any)?.data)
      ? (rawReviews as any).data
      : [];

  // Variant images resolution directly from database
  const resolvedImages = useMemo(() => {
    if (Array.isArray(activeVariant?.images) && activeVariant.images.length > 0) {
      return activeVariant.images;
    }
    if (product?.thumbnail) {
      return [product.thumbnail];
    }
    return [];
  }, [activeVariant, product]);

  // Resolved dynamic values strictly from database
  const resolvedTitle = product?.title || "";
  const resolvedBrand = product?.brand || "";
  const resolvedCategory = (product?.category as any)?.name || "";
  const resolvedDepartment = (product?.department as any)?.name || "";

  const resolvedPrice =
    typeof sellerInfo?.price === "number"
      ? sellerInfo.price
      : typeof activeVariant?.price === "number"
        ? activeVariant.price
        : 0;

  const resolvedOriginalPrice =
    typeof sellerInfo?.originalPrice === "number"
      ? sellerInfo.originalPrice
      : resolvedPrice > 0
        ? Math.round(resolvedPrice * 1.15 * 100) / 100
        : 0;

  const resolvedVendor =
    (typeof sellerInfo?.vendor === "object" && sellerInfo?.vendor !== null
      ? (sellerInfo?.vendor as any)?.name
      : typeof sellerInfo?.vendor === "string"
        ? sellerInfo?.vendor
        : sellerInfo?.fulfillmentBy) || "Amarzone Verified Seller";

  const resolvedVendorId =
    typeof sellerInfo?.vendor === "object" && sellerInfo?.vendor !== null
      ? (sellerInfo?.vendor as any)?._id
      : typeof sellerInfo?.vendor === "string"
        ? sellerInfo?.vendor
        : undefined;

  const resolvedReviewsCount = reviews.length;
  const resolvedRating = useMemo(() => {
    if (reviews.length === 0) return Number(activeVariant?.rating || 0);
    const sum = reviews.reduce((acc: number, r: any) => acc + (Number(r?.rating) || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews, activeVariant]);

  const handleVariantSelection = (newVariant: TVariant) => {
    setSelectedVariant(newVariant);
    if (productId && newVariant._id) {
      router.replace(`/products/${productId}?variantId=${newVariant._id}`, {
        scroll: false,
      });
    }
  };

  const handleMobileAddToCart = () => {
    toast.success("Added to Cart!", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  if ((isLoadingVariants || isLoadingProduct) && !product && variants.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#e77600] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!isLoadingVariants && !isLoadingProduct && !product && variants.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
          <p className="text-xs text-slate-500">The requested product could not be found in the database.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen text-[#0f1111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 pb-24 lg:pb-12 space-y-6">
        {/* Breadcrumb Navigation */}
        <ProductBread
          departmentName={product?.department?.name || resolvedDepartment}
          departmentId={product?.department?._id}
          categoryName={product?.category?.name || resolvedCategory}
          categoryId={product?.category?._id}
          productTitle={product?.title || resolvedTitle}
        />

        {/* 3-Column Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Column 1: Image Gallery (Left ~42%) */}
          <div className="lg:col-span-5">
            <ProductImageGallery
              key={activeVariant?._id || "main-gallery"}
              images={resolvedImages}
              thumbnail={resolvedImages[0] || product?.thumbnail}
              title={product?.title || resolvedTitle}
              isBestSeller={product?.isBestSeller}
              isPrivateLevel={activeVariant?.isPrivateLevel}
            />
          </div>

          {/* Column 2: Product Core Info & Options (Center ~33%) */}
          <div className="lg:col-span-4 space-y-1">
            <ProductHeader
              brand={product?.brand || resolvedBrand}
              title={product?.title || resolvedTitle}
              averageRating={resolvedRating}
              totalRatings={resolvedReviewsCount}
              categoryName={product?.category?.name || resolvedCategory}
              isBestSeller={product?.isBestSeller}
            />

            <ProductPriceBlock
              price={resolvedPrice}
              originalPrice={resolvedOriginalPrice}
            />

            <ProductVariantSelector
              variants={variants}
              selectedVariant={activeVariant}
              averageRating={resolvedRating}
              totalRatings={resolvedReviewsCount}
              onSelectVariant={handleVariantSelection}
            />

            <ProductFeatures features={product?.features} />
          </div>

          {/* Column 3: Buy Box (Right ~25%) */}
          <div className="lg:col-span-3">
            <div className="sticky top-20 space-y-4">
              <ProductBuyBox
                buyBoxListing={buyBoxWinner}
                price={resolvedPrice}
                vendorName={resolvedVendor}
                vendorId={resolvedVendorId}
                totalSellers={totalSellers}
                product={product}
                selectedVariant={activeVariant}
                isLoadingInventory={isLoadingInventory || isLoadingVariants}
                inStock={true}
              />

              {/* Multi-Vendor Comparison: Other Sellers on Amarzone */}
              {totalSellers > 1 && (
                <ProductSellerOffers
                  sellers={sellers as any}
                  buyBoxWinnerId={(buyBoxWinner as any)?._id}
                  product={product}
                  selectedVariant={activeVariant}
                />
              )}

              {/* AI Product Assistant Advisor Card */}
              <ProductAIAdvisor
                productTitle={resolvedTitle}
                categoryName={resolvedCategory}
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

        {/* Bottom Section: Customer Reviews & Rating Breakdown */}
        <div id="customer-reviews">
          <ProdVariantReviews
            reviews={reviews}
            averageRating={resolvedRating}
            totalRatings={resolvedReviewsCount}
            isLoading={isLoadingReviews}
            productTitle={product?.title || resolvedTitle}
            selectedVariant={activeVariant}
          />
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile Viewports */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 lg:hidden shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            Price
          </span>
          <span className="text-base font-extrabold text-slate-900">
            {resolvedPrice > 0 ? `$${resolvedPrice.toFixed(2)}` : "Unavailable"}
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
            className="flex-1 py-2 px-3 rounded-full bg-[#ffa41c] active:bg-[#ee7d00] text-slate-900 text-xs font-bold flex items-center justify-center gap-1 border border-[#ff8f00] shadow-xs cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-900" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;