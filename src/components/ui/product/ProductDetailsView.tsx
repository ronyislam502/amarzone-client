"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { VendorsDrawer } from "./VendorsDrawer";
import { ProductReviewsSection } from "./ProductReviewsSection";
import { ProductSpecsTable } from "./ProductSpecsTable";
import { ProductBuyBox } from "./ProductBuyBox";
import { RelatedProductsCarousel } from "./RelatedProductsCarousel";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useCreateOrderMutation } from "@/redux/features/order/orderApi";

import {
  TProduct as TParentProduct,
  TVariant,
  TAttribute as TVariantAttribute,
} from "@/types/product";
import { TSeller, TInventoryResult } from "@/types/inventory";

import {
  ProductToast,
  ProductBreadcrumbs,
  ProductGallery,
  ProductInfoTitle,
  ProductPriceSection,
  ProductVariantSwatches,
  ProductFeaturesList,
  ProductDescriptionBox,
  ProductOrderSuccess,
  ProductOtherSellersCard,
} from "./details";

const stripePromise = loadStripe(
  "pk_test_51U3cGxCw4lXjRfDbLQoMrfqUrzWLp7FYsYT7ofqu0PdFs9XEScdfbpS8a4ZBk72d3IViXlc65BvaX1M1V1MsKm2y00hIe1Jz6O"
);

export type { TParentProduct, TVariant, TVariantAttribute, TSeller, TInventoryResult };

export interface ProductDetailsViewProps {
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
  const [isVendorsDrawerOpen, setIsVendorsDrawerOpen] = useState<boolean>(false);
  const [addedToCartToast, setAddedToCartToast] = useState<string | null>(null);

  const [showInlinePayment, setShowInlinePayment] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [paymentEmail, setPaymentEmail] = useState<string>("");
  const [createdOrderNo, setCreatedOrderNo] = useState<string>("");

  // Sync main image when selected variant changes
  useEffect(() => {
    if (selectedVariant) {
      const mainImg = selectedVariant.thumbnail || selectedVariant.images?.[0] || "";
      setSelectedImage(mainImg);
    } else if (product) {
      setSelectedImage(product.thumbnail || "");
    }
  }, [selectedVariant, product]);

  const allImages = [
    product?.thumbnail,
    selectedVariant?.thumbnail,
    ...(selectedVariant?.images || []),
  ].filter(Boolean) as string[];

  // Deduplicate images
  const uniqueImages = Array.from(new Set(allImages));

  const buyBoxWinnerSeller =
    inventory?.buyBoxWinner?.seller ||
    inventory?.sellers?.find((s) => s.seller?.isBuyBoxWinner === true)?.seller ||
    inventory?.sellers?.[0]?.seller;

  const buyBox = buyBoxWinnerSeller;
  const currentPrice = buyBoxWinnerSeller?.price || 39.99;
  const priceParts = currentPrice.toFixed(2).split(".");
  const dollars = priceParts[0];
  const cents = priceParts[1];

  // Dynamic attribute values for active variant
  const activeColorAttr =
    selectedVariant?.attributes?.map((a) => a.value).join(" / ") ||
    "Standard Edition";

  const user = useAppSelector(selectCurrentUser);
  const [createOrder, { isLoading: buyLoading }] = useCreateOrderMutation();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please log in as a customer to purchase products.");
      return;
    }

    if (user.role !== "CUSTOMER") {
      toast.error("Only customers are authorized to buy products.");
      return;
    }

    const vendorId = buyBoxWinnerSeller?.vendor?._id;
    if (!vendorId) {
      toast.error("Unable to identify vendor for this product.");
      return;
    }

    setPaymentEmail(user.email || "");
    setPaymentSuccess(false);
    setShowInlinePayment(true);
  };

  const handlePayAndOrder = async (stripe: any, elements: any, cardElement: any) => {
    if (!paymentEmail) {
      toast.error("Email address is required.");
      return;
    }

    const vendorId = buyBoxWinnerSeller?.vendor?._id;
    if (!vendorId) {
      toast.error("Unable to identify vendor for this product.");
      return;
    }

    setConfirmLoading(true);
    try {
      // 1. Create order
      const orderPayload = {
        vendor: vendorId,
        products: [
          {
            product: product._id,
            variant: selectedVariant?._id || product._id,
            varient: selectedVariant?._id || product._id,
            quantity,
          },
        ],
      };

      const orderResult = await createOrder(orderPayload).unwrap();
      const orderNo = orderResult?.data?.orderNo;
      const clientSecret = orderResult?.data?.clientSecret;

      if (!clientSecret) {
        toast.error("Failed to initialize order.");
        setConfirmLoading(false);
        return;
      }

      // 2. Confirm payment intent using Stripe Elements
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: paymentEmail,
          },
        },
      });

      if (paymentResult.error) {
        toast.error(paymentResult.error.message || "Payment confirmation failed.");
      } else {
        if (paymentResult.paymentIntent.status === "succeeded") {
          setCreatedOrderNo(orderNo || "N/A");
          setPaymentSuccess(true);
          toast.success("Order placed and payment processed successfully!");
        } else {
          toast.error("Payment was not completed successfully.");
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Payment process failed.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleAddToCart = (vendorName?: string) => {
    const seller = vendorName || buyBox?.vendor?.name || "Verified Partner";
    toast.success(`Added ${quantity} unit(s) from ${seller} to Cart!`, {
      position: "bottom-right",
      autoClose: 2500,
    });
    setAddedToCartToast(`Added ${quantity} item(s) to Cart!`);
    setTimeout(() => setAddedToCartToast(null), 3000);
  };

  const productTitle = product.title || (product as any).name || "Product Details";

  return (
    <div className="bg-[#f3f4f6]/50 min-h-screen text-slate-800 font-sans antialiased">
      {/* Toast Notification */}
      <ProductToast message={addedToCartToast} />

      {/* Ultra-Wide Main Content Container */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Breadcrumbs Navigation */}
        <ProductBreadcrumbs
          departmentName={product.department?.name}
          categoryName={product.category?.name}
          productTitle={productTitle}
        />

        {/* 3-Column Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* COLUMN 1: GALLERY & MEDIA (5 Cols) */}
          <div className="lg:col-span-5">
            <ProductGallery
              allImages={uniqueImages}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              productTitle={productTitle}
              isPrivateLevel={selectedVariant?.isPrivateLevel}
            />
          </div>

          {/* COLUMN 2: PRODUCT DETAILS & SPECS (4 Cols) */}
          <div className="lg:col-span-4 space-y-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
            <ProductInfoTitle
              title={productTitle}
              brand={product.brand}
              categoryName={product.category?.name}
            />

            <ProductPriceSection
              dollars={dollars}
              cents={cents}
              currentPrice={currentPrice}
              showReturnsInfo={showReturnsInfo}
              setShowReturnsInfo={setShowReturnsInfo}
              totalSellers={inventory?.totalSellers}
              onOpenVendorsDrawer={() => setIsVendorsDrawerOpen(true)}
            />

            <ProductVariantSwatches
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelectVariant={onSelectVariant}
              selectedImage={selectedImage}
              currentPrice={currentPrice}
              activeColorAttr={activeColorAttr}
            />

            <ProductFeaturesList
              features={product.features}
              description={product.description}
            />

            <ProductSpecsTable
              product={product}
              selectedVariant={selectedVariant}
            />

            <ProductDescriptionBox description={product.description} />
          </div>

          {/* COLUMN 3: BUY BOX & MULTI-VENDOR (3 Cols) */}
          <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-6">
            {paymentSuccess ? (
              <ProductOrderSuccess
                orderNo={createdOrderNo}
                totalPrice={quantity * currentPrice}
                onReset={() => {
                  setPaymentSuccess(false);
                  setShowInlinePayment(false);
                }}
              />
            ) : (
              <Elements stripe={stripePromise}>
                <ProductBuyBox
                  dollars={dollars}
                  cents={cents}
                  inventoryLoading={inventoryLoading}
                  buyBox={buyBox}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  handleAddToCart={handleAddToCart}
                  handleBuyNow={handleBuyNow}
                  buyLoading={buyLoading}
                  paymentEmail={paymentEmail}
                  setPaymentEmail={setPaymentEmail}
                  showInlinePayment={showInlinePayment}
                  setShowInlinePayment={setShowInlinePayment}
                  handlePayAndOrder={handlePayAndOrder}
                  confirmLoading={confirmLoading}
                />
              </Elements>
            )}

            <ProductOtherSellersCard
              totalSellers={inventory?.totalSellers}
              currentPrice={currentPrice}
              onOpenVendorsDrawer={() => setIsVendorsDrawerOpen(true)}
            />
          </div>
        </div>

        {/* Related Category Products Carousel ("Customers also viewed") */}
        <RelatedProductsCarousel
          products={categoryProducts}
          categoryName={product.category?.name}
        />

        {/* Customer Product Reviews Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-2xs">
          <ProductReviewsSection
            productId={product._id}
            productTitle={productTitle}
            vendorId={buyBox?.vendor?._id}
          />
        </div>
      </div>

      {/* Vendors Multi-Seller Drawer */}
      <VendorsDrawer
        isOpen={isVendorsDrawerOpen}
        onClose={() => setIsVendorsDrawerOpen(false)}
        inventory={inventory}
        selectedVariant={selectedVariant}
        productTitle={productTitle}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default ProductDetailsView;
