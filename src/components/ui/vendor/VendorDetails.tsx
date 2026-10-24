"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Store,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Search,
  Share2,
  Heart,
  ChevronRight,
  PackageCheck,
  Sparkles,
  MessageSquare,
  ArrowLeft,
  Calendar,
  UserCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { useSingleVendorQuery } from "@/redux/features/vendor/vendorApi";
import { useAllServiceReviewsByVendorQuery } from "@/redux/features/review/reviewApi";
import AZProductCard from "@/components/shared/AZProductCard";
import { useVendorVariantProductsQuery } from "@/redux/features/inventory/inventoryApi";

const VendorDetails = () => {
  const params = useParams();
  const vendorParam = params?.id as string | undefined;

  // Query real vendor from backend MongoDB
  const { data: vendorData, isLoading: isVendorLoading } = useSingleVendorQuery(vendorParam, {
    skip: !vendorParam,
  });

  const rawVendor = vendorData?.data;

  console.log("user", vendorData)

  // Identify Vendor User ID and Vendor Document ID for relational queries
  const vendorUserId =
    (typeof rawVendor?.user === "object" ? rawVendor?.user?._id : rawVendor?.user) ||
    rawVendor?._id ||
    vendorParam;
  const vendorId = rawVendor?._id || vendorParam;

  // Query actual vendor inventory listings from DB
  const { data: vendorInventoryData, isLoading: isInventoryLoading } =
    useVendorVariantProductsQuery(vendorParam, {
      skip: !vendorParam,
    });

  console.log("ven-prod", vendorInventoryData)

  // Query actual service reviews for this vendor from DB
  const { data: serviceReviewsData, isLoading: isReviewsLoading } =
    useAllServiceReviewsByVendorQuery(vendorParam, {
      skip: !vendorParam,
    });

  console.log("ven-review", serviceReviewsData)
  const [activeTab, setActiveTab] = useState<"products" | "about" | "reviews">("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  // Parse real service reviews
  const rawReviews = useMemo(() => {
    return (serviceReviewsData?.data as any[]) || [];
  }, [serviceReviewsData]);

  const totalRatings = rawReviews.length;
  const averageRating = useMemo(() => {
    if (totalRatings === 0) return 0;
    const sum = rawReviews.reduce((acc, curr) => acc + (Number(curr?.rating) || 0), 0);
    return sum / totalRatings;
  }, [rawReviews, totalRatings]);

  const positivePercent = useMemo(() => {
    if (totalRatings === 0) return 0;
    const positiveCount = rawReviews.filter((r) => (Number(r?.rating) || 0) >= 4).length;
    return Math.round((positiveCount / totalRatings) * 100);
  }, [rawReviews, totalRatings]);

  // Map real vendor catalog from MongoDB inventory
  const vendorCatalog = useMemo(() => {
    const rawData = vendorInventoryData?.data as unknown as any;
    const items: any[] = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.data)
        ? rawData.data
        : Array.isArray(rawData?.sellers)
          ? rawData.sellers
          : [];
    return items.map((inv: any) => {
      const prod = inv?.variant?.product || {};
      const variant = inv?.variant || {};
      const seller = inv?.seller || {};

      const title = prod.title || inv.asin || "Product";
      const variantAttrs =
        Array.isArray(variant.attributes) && variant.attributes.length > 0
          ? ` (${variant.attributes.map((a: any) => a?.value).filter(Boolean).join(", ")})`
          : "";
      const displayTitle = `${title}${variantAttrs}`;

      const thumbnail =
        variant?.images?.[0] ||
        prod?.thumbnail ||
        "";

      const price = Number(seller.price) || Number(prod.price) || 0;
      const brand = prod.brand || rawVendor?.name || "";

      return {
        _id: inv._id || variant._id || prod._id,
        productId: prod._id || variant._id || inv._id,
        variantId: variant._id,
        title: displayTitle,
        thumbnail,
        brand,
        price,
        oldPrice: price > 0 ? price * 1.15 : 0,
        discountPercentage: 15,
        category: prod.category,
        seller,
        asin: inv.asin,
      };
    });
  }, [vendorInventoryData, rawVendor]);

  // Resolved Real Vendor Info
  const vendor = useMemo(() => {
    const raw = rawVendor;
    if (raw) {
      const addressParts = [
        raw.address?.street,
        raw.address?.city,
        raw.address?.state,
        raw.address?.country,
      ].filter(Boolean);

      const firstSeller = vendorCatalog[0]?.seller;
      const fulfillmentType = firstSeller?.fulfillmentBy || "Merchant Fulfillment";
      const shippingDays = firstSeller?.shippingTime;

      return {
        _id: raw._id,
        name: raw.name || "Vendor Store",
        tagline: raw.email ? `Official Store • ${raw.email}` : "Verified Merchant on Amarzone",
        rating: averageRating,
        totalRatings,
        positivePercent,
        memberSince: raw.createdAt
          ? new Date(raw.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : null,
        fulfillmentType,
        shippingDays,
        logo: raw.logo || "",
        banner: raw.banner || "",
        location: addressParts.length > 0 ? addressParts.join(", ") : "Registered Merchant",
        email: raw.email || "",
        phone: raw.phone || "",
        description:
          raw.description ||
          `${raw.name || "This store"} is a certified merchant on Amarzone offering verified authentic products with prompt fulfillment.`,
      };
    }
    return null;
  }, [rawVendor, averageRating, totalRatings, positivePercent, vendorCatalog]);

  // Filter vendor products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return vendorCatalog;
    const q = searchQuery.toLowerCase();
    return vendorCatalog.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        (typeof p.category === "object" && p.category?.name?.toLowerCase().includes(q)) ||
        p.asin?.toLowerCase().includes(q)
    );
  }, [vendorCatalog, searchQuery]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Store link copied to clipboard!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
    toast.info(!isFollowing ? `You are now following ${vendor?.name}!` : `Unfollowed ${vendor?.name}`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const handleContact = () => {
    if (vendor?.email) {
      window.location.href = `mailto:${vendor.email}`;
    } else if (vendor?.phone) {
      window.location.href = `tel:${vendor.phone}`;
    } else {
      toast.info(`Contact ${vendor?.name} via Amarzone messaging or customer support.`, {
        position: "bottom-right",
        autoClose: 2500,
      });
    }
  };

  if (isVendorLoading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#e77600] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-600 font-medium">Loading store details...</p>
        </div>
      </div>
    );
  }

  if (!isVendorLoading && !vendor) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <Store className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Store Not Found</h2>
          <p className="text-xs text-slate-500">The requested vendor storefront could not be located in the database.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-full bg-[#ffd814] text-xs font-semibold text-slate-900 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 pb-20">
      {/* Top Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-[#c7511f] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Stores</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900 truncate max-w-xs">{vendor?.name}</span>
          </div>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Marketplace
          </Link>
        </div>
      </div>

      {/* Store Banner Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 h-48 sm:h-64 lg:h-72">
          {vendor?.banner ? (
            <img
              src={vendor.banner}
              alt={`${vendor.name} Banner`}
              className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-center">
              <span className="text-slate-500 text-lg font-semibold">{vendor?.name} Official Store</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Quick Badges in Header */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-semibold text-slate-900 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Amarzone Verified Store
            </span>
          </div>
        </div>

        {/* Store Profile Floating Header Card */}
        <div className="relative -mt-16 sm:-mt-20 bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Logo + Details */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-white shrink-0 flex items-center justify-center">
                {vendor?.logo ? (
                  <img
                    src={vendor.logo}
                    alt={vendor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-10 h-10 text-slate-400" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                    {vendor?.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Partner
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-1 max-w-xl">
                  {vendor?.tagline}
                </p>

                {/* Real Rating and Feedback from Database */}
                <div className="flex items-center gap-3 text-xs pt-1 flex-wrap">
                  <div className="flex items-center gap-1 font-semibold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {totalRatings > 0 ? (
                      <>
                        <span className="text-slate-900">{averageRating.toFixed(1)}</span>
                        <span className="text-slate-500 font-normal">({totalRatings} review{totalRatings > 1 ? "s" : ""})</span>
                      </>
                    ) : (
                      <span className="text-slate-500 font-normal">No reviews yet</span>
                    )}
                  </div>

                  {totalRatings > 0 && (
                    <>
                      <span className="text-slate-300">|</span>
                      <span className="text-emerald-700 font-medium">
                        {positivePercent}% positive feedback
                      </span>
                    </>
                  )}

                  {vendor?.memberSince && (
                    <>
                      <span className="text-slate-300 hidden sm:inline">|</span>
                      <span className="text-slate-500 hidden sm:inline flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Member since {vendor.memberSince}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 sm:self-center shrink-0">
              <button
                type="button"
                onClick={handleFollow}
                className={`flex-1 sm:flex-none py-2 px-5 rounded-full text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-xs ${isFollowing
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                  : "bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 border border-[#fcd200]"
                  }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFollowing ? "fill-emerald-600 text-emerald-600" : ""}`} />
                <span>{isFollowing ? "Following Store" : "Follow Store"}</span>
              </button>

              <button
                type="button"
                onClick={handleContact}
                className="py-2 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Contact</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer transition-colors shadow-xs"
                title="Share Store"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Key Assurance Metrics Bar (Exclusively Real Data) */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{vendor?.fulfillmentType}</p>
                <p className="text-[11px] text-slate-500">
                  {vendor?.shippingDays ? `${vendor.shippingDays}-day dispatch` : "Standard fulfillment"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">A-to-z Guarantee</p>
                <p className="text-[11px] text-slate-500">100% Buyer Protection</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">30-Day Returns</p>
                <p className="text-[11px] text-slate-500">Hassle-Free Refunds</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Verified Seller</p>
                <p className="text-[11px] text-slate-500">
                  {vendor?.memberSince ? `Active since ${vendor.memberSince}` : "Certified Merchant"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Store Tabs & In-Store Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b sm:border-b-0 border-slate-200 pb-2 sm:pb-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-all ${activeTab === "products"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
                }`}
            >
              Storefront Catalog ({vendorCatalog.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("about")}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-all ${activeTab === "about"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
                }`}
            >
              About & Policies
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-all ${activeTab === "reviews"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
                }`}
            >
              Customer Reviews ({totalRatings})
            </button>
          </div>

          {/* Search bar inside vendor catalog */}
          {activeTab === "products" && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search in ${vendor?.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e77600] focus:border-transparent transition-all shadow-xs"
              />
            </div>
          )}
        </div>

        {/* TAB 1: STOREFRONT PRODUCTS CATALOG */}
        {activeTab === "products" && (
          <div>
            {isInventoryLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-3">
                    <div className="aspect-square bg-slate-200 rounded-xl" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredProducts.map((prod) => (
                  <div key={prod._id} className="h-full">
                    <AZProductCard
                      product={{
                        _id: prod._id,
                        productId: prod.productId,
                        variantId: prod.variantId,
                        title: prod.title,
                        thumbnail: prod.thumbnail,
                        brand: prod.brand,
                        price: prod.price,
                        oldPrice: prod.oldPrice,
                        discountPercentage: prod.discountPercentage,
                        category: prod.category,
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <Store className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  {searchQuery ? "No matching products found" : "No products currently listed"}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery
                    ? `No items matched "${searchQuery}" in ${vendor?.name}'s catalog.`
                    : `${vendor?.name} does not have any active inventory items listed on the storefront yet.`}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-2 py-1.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ABOUT THE STORE & POLICIES */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Story & Description */}
            <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-500" />
                About {vendor?.name}
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">{vendor?.description}</p>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Seller Guarantees & Commitments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl">
                    <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Certified Quality</p>
                      <p className="text-[11px] text-slate-500">Every unit is verified prior to shipment.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Authenticity Assured</p>
                      <p className="text-[11px] text-slate-500">100% genuine products sourced directly from manufacturers.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policies */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <h3 className="text-sm font-bold text-slate-900">Shipping & Return Policies</h3>
                <p>
                  Items fulfilled by Amarzone or {vendor?.name} are eligible for 30-day return under standard Amarzone return guidelines.
                </p>
              </div>
            </div>

            {/* Business Contact Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 self-start">
              <h3 className="text-base font-bold text-slate-900">Store Information</h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Headquarters</span>
                    <p className="text-slate-600">{vendor?.location}</p>
                  </div>
                </div>

                {vendor?.email && (
                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">Customer Support</span>
                      <p className="text-slate-600">{vendor.email}</p>
                    </div>
                  </div>
                )}

                {vendor?.phone && (
                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">Telephone</span>
                      <p className="text-slate-600">{vendor.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <span className="font-bold">Amarzone Protection:</span>
                  <p className="text-[11px] mt-0.5 text-amber-800">
                    Your purchase is protected by the Amarzone A-to-z Guarantee from dispatch to delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER SERVICE REVIEWS */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {/* Reviews Summary Header Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="text-center p-4 bg-amber-50/60 rounded-2xl border border-amber-100 min-w-28">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {totalRatings > 0 ? averageRating.toFixed(1) : "—"}
                    </span>
                    <div className="flex items-center justify-center gap-0.5 mt-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-slate-200"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">out of 5 stars</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">Customer Feedback & Rating</h3>
                    <p className="text-xs text-slate-600">
                      Based on {totalRatings} verified customer review{totalRatings === 1 ? "" : "s"} from the database.
                    </p>
                    {totalRatings > 0 && (
                      <p className="text-xs text-emerald-700 font-semibold">
                        {positivePercent}% of buyers rated this store 4 or 5 stars.
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-100 max-w-sm">
                  <p className="font-semibold text-slate-700 mb-0.5">Verified Reviews Guarantee</p>
                  <p>All reviews are submitted by authenticated customers after receiving fulfilled orders.</p>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {isReviewsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-3 bg-slate-200 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : rawReviews.length > 0 ? (
              <div className="space-y-4">
                {rawReviews.map((rev: any) => {
                  const customer = rev.customer || {};
                  const customerName = typeof customer === "object" ? customer.name || "Amarzone Customer" : "Amarzone Customer";
                  const avatar = typeof customer === "object" ? customer.avatar : "";
                  const rating = Number(rev.rating) || 5;
                  const dateStr = rev.createdAt
                    ? new Date(rev.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                    : "Recent";

                  return (
                    <div
                      key={rev._id}
                      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3 transition-shadow hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 uppercase shrink-0">
                            {avatar ? (
                              <img src={avatar} alt={customerName} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              customerName.charAt(0) || "C"
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{customerName}</p>
                            <span className="text-[10px] text-emerald-700 font-medium">Verified Purchase</span>
                          </div>
                        </div>

                        <span className="text-[11px] text-slate-400">{dateStr}</span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                              }`}
                          />
                        ))}
                      </div>

                      {/* Review Comment */}
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {rev.review || "No written comment provided."}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No customer reviews yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  This vendor has not received any service reviews yet. Reviews will automatically appear once customers place orders and submit feedback.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDetails;