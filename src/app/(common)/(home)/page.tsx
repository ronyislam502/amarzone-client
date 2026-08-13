"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useAllProductsQuery } from "@/redux/features/product/productApi";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ShoppingBag,
  Star,
  Tag,
  CheckCircle2,
  X,
  Heart,
  Plus,
  Clock,
  Zap,
  Sparkles,
  Truck,
  RotateCcw,
  Percent,
  TrendingUp,
  ShieldCheck
} from "lucide-react";

// Walmart 6-petal Spark component
function WalmartSpark({ className = "w-5 h-5 text-[#ffc220]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2L13.8 8.5L19.5 5.2L16.2 11L22.5 12.8L16.2 14.6L19.5 20.4L13.8 17.1L12 23.6L10.2 17.1L4.5 20.4L7.8 14.6L1.5 12.8L7.8 11L4.5 5.2L10.2 8.5L12 2Z" />
    </svg>
  );
}

// Walmart Department Circles data
const categoryCircles = [
  { name: "Grocery", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80", slug: "Grocery" },
  { name: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80", slug: "Electronics" },
  { name: "Fashion", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=300&q=80", slug: "Fashion" },
  { name: "Home", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80", slug: "Home" },
  { name: "Patio & Garden", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=300&q=80", slug: "Patio" },
  { name: "Toys & Games", image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=300&q=80", slug: "Toys" },
  { name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&q=80", slug: "Beauty" },
  { name: "Auto & Tires", image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=300&q=80", slug: "Automotive" },
  { name: "Pharmacy", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80", slug: "Pharmacy" },
];

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchFromUrl = searchParams.get("search") || "";
  const departmentFromUrl = searchParams.get("department") || "";
  const deptNameFromUrl = searchParams.get("deptName") || "";
  const categoryFromUrl = searchParams.get("category") || "";
  const categoryNameFromUrl = searchParams.get("categoryName") || "";
  const allFromUrl = searchParams.get("all") === "true";

  const scrollRef = useRef<HTMLDivElement>(null);
  const flashScrollRef = useRef<HTMLDivElement>(null);
  const [localSearch, setLocalSearch] = useState(searchFromUrl);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  // Sync local search state with URL query parameter
  useEffect(() => {
    setLocalSearch(searchFromUrl);
  }, [searchFromUrl]);

  // Construct query arguments for API call
  const activeSearch = searchFromUrl || localSearch;
  const productQueryParams: Record<string, any> = { limit: 16 };
  if (activeSearch) productQueryParams.search = activeSearch;
  if (departmentFromUrl) productQueryParams.department = departmentFromUrl;
  if (categoryFromUrl) productQueryParams.category = categoryFromUrl;

  const hasActiveFilters = Boolean(
    activeSearch || departmentFromUrl || categoryFromUrl || allFromUrl
  );

  // Fetch product data via RTK Query
  const {
    data: productResponse,
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useAllProductsQuery(productQueryParams);

  const products: any[] = productResponse?.data || [];
  const totalProducts = productResponse?.meta?.total || products.length;

  const scrollCategories = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth"
      });
    }
  };

  const scrollFlashDeals = (direction: "left" | "right") => {
    if (flashScrollRef.current) {
      flashScrollRef.current.scrollBy({
        left: direction === "left" ? -360 : 360,
        behavior: "smooth"
      });
    }
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    router.push("/");
  };

  // Determine active header title & description
  const getFilterHeaderText = () => {
    if (deptNameFromUrl && categoryNameFromUrl) {
      return {
        title: `${deptNameFromUrl} › ${categoryNameFromUrl}`,
        subtitle: `Showing products in category "${categoryNameFromUrl}" under "${deptNameFromUrl}"`,
      };
    }
    if (deptNameFromUrl) {
      return {
        title: `All ${deptNameFromUrl} Products`,
        subtitle: `Showing products under the ${deptNameFromUrl} department`,
      };
    }
    if (departmentFromUrl) {
      return {
        title: `Department Products`,
        subtitle: `Showing products under selected department`,
      };
    }
    if (categoryNameFromUrl) {
      return {
        title: `Category: ${categoryNameFromUrl}`,
        subtitle: `Showing products in category "${categoryNameFromUrl}"`,
      };
    }
    if (activeSearch) {
      return {
        title: `Search results for "${activeSearch}"`,
        subtitle: `Showing matched items for "${activeSearch}" in store and online`,
      };
    }
    if (allFromUrl) {
      return {
        title: "All Products Across Departments",
        subtitle: "Showing products from every department in store and online",
      };
    }
    return {
      title: "All Products",
      subtitle: "Showing matched items in store and online",
    };
  };

  const filterHeader = getFilterHeaderText();

  return (
    <div className="bg-[#f2f4f8] min-h-screen text-slate-900 pb-16 font-sans select-none">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 pt-4 space-y-6">

        {/* ACTIVE SEARCH / DEPARTMENT / CATEGORY RESULTS DISPLAY HEADER */}
        {hasActiveFilters ? (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0071dc] flex items-center justify-center font-bold shrink-0">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="text-[#0071dc]">{filterHeader.title}</span>
                  </h1>
                  <p className="text-xs text-slate-500">
                    {filterHeader.subtitle} ({products.length} of {totalProducts} items)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClearSearch}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full text-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <X className="w-4 h-4" />
                <span>All Departments</span>
              </button>
            </div>

            {/* SEARCH PRODUCT GRID */}
            {isProductsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-4 space-y-3 animate-pulse border border-slate-200">
                    <div className="w-full h-44 bg-slate-200 rounded-xl" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => {
                  const isFav = wishlist[product._id];
                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
                    >
                      {/* Top Badges & Favorite */}
                      <div className="flex items-center justify-between mb-2 z-10">
                        <span className="bg-[#0071dc] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Rollback
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product._id)}
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                        </button>
                      </div>

                      {/* Product Image */}
                      <Link href={`/product/${product._id}`} className="block relative w-full h-48 mb-3 overflow-hidden rounded-xl bg-slate-50">
                        <img
                          src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Title & Price */}
                      <div className="space-y-1.5 mb-3 flex-1">
                        <Link
                          href={`/product/${product._id}`}
                          className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 hover:text-[#0071dc] transition-colors"
                        >
                          {product.name}
                        </Link>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 stroke-none" />
                            ))}
                          </div>
                          <span className="font-semibold text-slate-700">4.8</span>
                          <span>(120)</span>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="text-xl font-extrabold text-slate-900">
                            ${product.price ? product.price.toFixed(2) : "19.99"}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            ${((product.price || 19.99) * 1.25).toFixed(2)}
                          </span>
                        </div>

                        <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          <span>Free 2-day shipping</span>
                        </div>
                      </div>

                      {/* Add Button */}
                      <button
                        type="button"
                        className="w-full py-2 bg-[#0071dc] hover:bg-[#005bb5] text-white font-bold rounded-full text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-95"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Add</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-3">
                <div className="text-slate-500 font-bold text-lg">No products found for this selection.</div>
                <button
                  onClick={handleClearSearch}
                  className="px-5 py-2.5 bg-[#0071dc] text-white font-bold text-xs rounded-full hover:bg-[#005bb5] transition-colors"
                >
                  View All Departments
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* 1. WALMART HERO MULTI-TILE GRID SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Main Primary Hero Banner */}
              <div className="lg:col-span-8 bg-gradient-to-br from-[#0071dc] via-[#004f9a] to-[#002d58] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden flex flex-col justify-between min-h-[380px] shadow-lg">
                {/* Background Decorative Spark */}
                <WalmartSpark className="absolute -right-10 -bottom-10 w-96 h-96 text-blue-500/20 pointer-events-none" />

                <div className="relative z-10 space-y-3 max-w-lg">
                  <div className="inline-flex items-center gap-2 bg-[#ffc220] text-[#002d58] font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow">
                    <Zap className="w-3.5 h-3.5 fill-[#002d58]" />
                    <span>Rollback Deals Savings</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
                    Save up to 50% on top tech & home.
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-base font-normal">
                    Shop everyday low prices on TV, laptops, kitchenware, patio items & fresh grocery delivery.
                  </p>
                </div>

                <div className="relative z-10 pt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href="/?search=Deals"
                    className="px-6 py-3 bg-[#ffc220] hover:bg-[#e5ad10] text-[#002d58] font-extrabold text-sm rounded-full transition-transform hover:scale-105 shadow-md flex items-center gap-2"
                  >
                    <span>Shop Rollbacks</span>
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </Link>
                  <Link
                    href="/?search=Grocery"
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm rounded-full backdrop-blur-md transition-colors border border-white/20"
                  >
                    Explore Grocery
                  </Link>
                </div>
              </div>

              {/* Right Side 2 Promo Cards */}
              <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {/* Flash Deals Card */}
                <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-3xl p-6 text-white flex flex-col justify-between min-h-[180px] shadow-md relative overflow-hidden group">
                  <div className="space-y-1 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black/30 px-2.5 py-0.5 rounded-full inline-block">
                      Limited Time
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black">Flash Deals up to 65% off</h3>
                    <p className="text-xs text-amber-100">Score major savings before timers run out.</p>
                  </div>
                  <Link
                    href="/?search=Deals"
                    className="relative z-10 inline-flex items-center gap-1.5 text-xs font-black text-white hover:underline pt-3"
                  >
                    <span>Shop all Flash Deals</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Everyday Low Prices Card */}
                <div className="bg-emerald-700 rounded-3xl p-6 text-white flex flex-col justify-between min-h-[180px] shadow-md relative overflow-hidden">
                  <div className="space-y-1 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-900/50 px-2.5 py-0.5 rounded-full inline-block">
                      Fresh & Fast
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black">Everyday Low Prices</h3>
                    <p className="text-xs text-emerald-100">Stock up on pantry staples & fresh produce.</p>
                  </div>
                  <Link
                    href="/?search=Grocery"
                    className="relative z-10 inline-flex items-center gap-1.5 text-xs font-black text-white hover:underline pt-3"
                  >
                    <span>Order Grocery Pickup</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 2. SHOP BY CATEGORY CIRCLES CAROUSEL */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Shop by Department</h2>
                  <p className="text-xs text-slate-500">Popular categories chosen for you</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollCategories("left")}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCategories("right")}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Circle Items */}
              <div
                ref={scrollRef}
                className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2 scroll-smooth"
              >
                {categoryCircles.map((cat, idx) => (
                  <Link
                    key={idx}
                    href={`/?search=${encodeURIComponent(cat.slug)}`}
                    className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-100 p-1 bg-slate-50 group-hover:border-[#0071dc] group-hover:scale-105 transition-all shadow-sm">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#0071dc] transition-colors text-center">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 3. FLASH DEALS & ROLLBACK CAROUSEL SECTION */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
              {/* Flash Header & Countdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 fill-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                      <span>Flash Deals</span>
                      <span className="text-xs font-bold bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full uppercase">
                        Up to 65% off
                      </span>
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ends in:</span>
                      <span className="font-mono bg-slate-900 text-amber-400 font-bold px-1.5 py-0.5 rounded">
                        04h 18m 52s
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollFlashDeals("left")}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollFlashDeals("right")}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Flash Cards Horizontal Slider */}
              <div
                ref={flashScrollRef}
                className="flex items-stretch gap-4 overflow-x-auto no-scrollbar py-2 scroll-smooth"
              >
                {isProductsLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="w-64 shrink-0 bg-slate-100 rounded-2xl p-4 animate-pulse h-80" />
                  ))
                ) : products.length > 0 ? (
                  products.map((product) => {
                    const isFav = wishlist[product._id];
                    return (
                      <div
                        key={product._id}
                        className="w-64 sm:w-72 shrink-0 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div>
                          {/* Card Badges */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Flash Deal
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleWishlist(product._id)}
                              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
                            >
                              <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                            </button>
                          </div>

                          {/* Image */}
                          <Link href={`/product/${product._id}`} className="block relative w-full h-44 mb-3 overflow-hidden rounded-xl bg-slate-50">
                            <img
                              src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"}
                              alt={product.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>

                          {/* Product Details */}
                          <div className="space-y-1 mb-3">
                            <Link href={`/product/${product._id}`} className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 hover:text-[#0071dc]">
                              {product.name}
                            </Link>

                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                              <span className="font-bold text-slate-800">4.9</span>
                              <span>(240+)</span>
                            </div>

                            {/* Pricing */}
                            <div className="flex items-baseline gap-2 pt-1">
                              <span className="text-2xl font-black text-slate-900">
                                ${product.price ? product.price.toFixed(2) : "24.99"}
                              </span>
                              <span className="text-xs text-slate-400 line-through font-normal">
                                ${((product.price || 24.99) * 1.35).toFixed(2)}
                              </span>
                            </div>
                            <div className="text-[11px] font-bold text-emerald-600">
                              Save ${((product.price || 24.99) * 0.35).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Add Button */}
                        <button
                          type="button"
                          className="w-full py-2 bg-[#0071dc] hover:bg-[#005bb5] text-white font-bold rounded-full text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    );
                  })
                ) : null}
              </div>
            </div>

            {/* 4. SEASONAL FEATURED GRID BANNERS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tile 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-6 border border-blue-100 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white px-2.5 py-0.5 rounded-full inline-block">
                    Tech & Audio
                  </span>
                  <h3 className="text-xl font-black text-slate-900">Noise-Canceling Headphones</h3>
                  <p className="text-xs text-slate-600">Save up to $80 on premium wireless sound.</p>
                </div>
                <Link href="/?search=Electronics" className="text-xs font-black text-[#0071dc] hover:underline pt-4 flex items-center gap-1">
                  <span>Shop Tech Deals</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Tile 2 */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl p-6 border border-amber-100 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white px-2.5 py-0.5 rounded-full inline-block">
                    Home Refresh
                  </span>
                  <h3 className="text-xl font-black text-slate-900">Bedding & Bath Essentials</h3>
                  <p className="text-xs text-slate-600">Luxury sheets, pillows & towels from $12.</p>
                </div>
                <Link href="/?search=Home" className="text-xs font-black text-[#0071dc] hover:underline pt-4 flex items-center gap-1">
                  <span>Shop Home</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Tile 3 */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-100 rounded-3xl p-6 border border-pink-100 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white px-2.5 py-0.5 rounded-full inline-block">
                    Trendy Apparel
                  </span>
                  <h3 className="text-xl font-black text-slate-900">New Fashion Arrivals</h3>
                  <p className="text-xs text-slate-600">Cozy hoodies, denim & everyday styles.</p>
                </div>
                <Link href="/?search=Fashion" className="text-xs font-black text-[#0071dc] hover:underline pt-4 flex items-center gap-1">
                  <span>Shop Fashion</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Tile 4 */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-3xl p-6 border border-emerald-100 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full inline-block">
                    Patio & Garden
                  </span>
                  <h3 className="text-xl font-black text-slate-900">Outdoor Furniture & Grills</h3>
                  <p className="text-xs text-slate-600">Transform your backyard for summer BBQs.</p>
                </div>
                <Link href="/?search=Patio" className="text-xs font-black text-[#0071dc] hover:underline pt-4 flex items-center gap-1">
                  <span>Shop Outdoor</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 5. AMARZONE+ (WALMART+) MEMBERSHIP BANNER */}
            <div className="bg-[#002d58] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-blue-900/50">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <WalmartSpark className="w-8 h-8 text-[#ffc220]" />
                  <span className="text-2xl sm:text-3xl font-black text-white">Amarzone+</span>
                  <span className="bg-[#ffc220] text-[#002d58] text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    Member Perks
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black leading-tight">
                  Free delivery from store, free shipping & video streaming.
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-blue-100 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffc220]" />
                    <span>Free delivery from your store ($35 min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffc220]" />
                    <span>Free shipping with no order minimum</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffc220]" />
                    <span>Save 10¢ per gallon on fuel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ffc220]" />
                    <span>Paramount+ streaming included</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    className="px-8 py-3 bg-[#ffc220] hover:bg-[#e5ad10] text-[#002d58] font-extrabold text-sm rounded-full shadow-lg transition-transform hover:scale-105"
                  >
                    Start Free 30-Day Trial
                  </button>
                </div>
              </div>
            </div>

            {/* 6. POPULAR IN YOUR AREA / MAIN PRODUCT FEED */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Popular In Your Area</h2>
                  <p className="text-xs text-slate-500">Everyday low prices delivered to your doorstep</p>
                </div>
                <Link
                  href="/?search=Deals"
                  className="text-xs font-bold text-[#0071dc] hover:underline flex items-center gap-1"
                >
                  <span>See all products</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Grid Feed */}
              {isProductsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div key={idx} className="bg-slate-100 rounded-2xl p-4 animate-pulse h-80" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product) => {
                    const isFav = wishlist[product._id];
                    return (
                      <div
                        key={product._id}
                        className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div>
                          {/* Card Badges */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="bg-[#0071dc] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Best Seller
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleWishlist(product._id)}
                              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
                            >
                              <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                            </button>
                          </div>

                          {/* Image */}
                          <Link href={`/product/${product._id}`} className="block relative w-full h-44 mb-3 overflow-hidden rounded-xl bg-slate-50">
                            <img
                              src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"}
                              alt={product.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>

                          {/* Product Details */}
                          <div className="space-y-1 mb-3">
                            <Link href={`/product/${product._id}`} className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 hover:text-[#0071dc]">
                              {product.name}
                            </Link>

                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                              <span className="font-bold text-slate-800">4.8</span>
                              <span>(150+)</span>
                            </div>

                            {/* Pricing */}
                            <div className="flex items-baseline gap-2 pt-1">
                              <span className="text-2xl font-black text-slate-900">
                                ${product.price ? product.price.toFixed(2) : "19.99"}
                              </span>
                              <span className="text-xs text-slate-400 line-through font-normal">
                                ${((product.price || 19.99) * 1.2).toFixed(2)}
                              </span>
                            </div>
                            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                              <Truck className="w-3.5 h-3.5" />
                              <span>Free 2-day delivery</span>
                            </div>
                          </div>
                        </div>

                        {/* Add Button */}
                        <button
                          type="button"
                          className="w-full py-2 bg-[#0071dc] hover:bg-[#005bb5] text-white font-bold rounded-full text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-95"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                          <span>Add</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

