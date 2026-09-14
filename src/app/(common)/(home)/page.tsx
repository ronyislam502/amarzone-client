"use client";

import React from "react";
import { useAllProductsQuery } from "@/src/redux/features/product/productApi";
import { TProduct } from "@/src/types/product";
import DepartmentQuickLinks from "@/src/components/ui/home/DepartmentQuickLinks";
import CategoryShortcuts from "@/src/components/ui/home/CategoryShortcuts";
import HomeHeroCarousel from "@/src/components/ui/home/HomeHeroCarousel";
import BentoPromoShowcase from "@/src/components/ui/home/BentoPromoShowcase";
import RollbacksBentoGrid from "@/src/components/ui/home/RollbacksBentoGrid";
import ProductCarouselSection from "@/src/components/ui/home/ProductCarouselSection";
import SplitCategorySpotlight from "@/src/components/ui/home/SplitCategorySpotlight";
import FeaturedProductsSection from "@/src/components/ui/home/FeaturedProductsSection";
import CreatorVideoShowcase from "@/src/components/ui/home/CreatorVideoShowcase";
import DepartmentSpotlight from "@/src/components/ui/home/DepartmentSpotlight";
import HomeLoadingSkeleton from "@/src/components/ui/home/HomeLoadingSkeleton";

const HomePage: React.FC = () => {
    // Fetch live products from backend API (router.get("/", ProductControllers.allProducts))
    const { data: apiResponse, isLoading, isError, refetch } = useAllProductsQuery({
        limit: 40,
    });

    const products: TProduct[] = (apiResponse as any)?.data || [];

    return (
        <main className="min-h-screen bg-[#f3f4f6]/60 text-slate-800 font-sans antialiased">
            {/* 1. Full-Width Department & Service Quick-Links Strip (Walmart Sub-nav) */}
            <DepartmentQuickLinks />

            {/* Main Marketplace Content Container - Ultra-Wide 1720px */}
            <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-8 space-y-10 sm:space-y-12">
                {/* 2. Circular Department Shortcuts Row */}
                <CategoryShortcuts />

                {/* 3. Hero Carousel Banner with Live Product Previews & Slider Controls */}
                <HomeHeroCarousel products={products} />

                {/* Loading / Error States */}
                {isLoading ? (
                    <HomeLoadingSkeleton />
                ) : isError ? (
                    <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
                        <p className="text-base font-bold text-slate-800">
                            Unable to load live catalog products at the moment.
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Please check backend server connectivity and try again.
                        </p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="btn btn-sm btn-primary rounded-full mt-4 font-bold"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : (
                    <>
                        {/* 4. 3-Column Asymmetric Bento Promotional Showcase */}
                        <BentoPromoShowcase products={products} />

                        {/* 5. Walmart's Signature 5-Column 2x2 "Rollbacks & more" Bento Grid */}
                        <RollbacksBentoGrid products={products} />

                        {/* 6. Flash Deals Horizontal Scroll Carousel with Countdown Timer */}
                        <ProductCarouselSection
                            id="flash-deals"
                            title="Flash Deals & Daily Rollbacks"
                            subtitle="Fresh rollbacks updated daily. Limited quantities while supplies last."
                            badgeText="Up to 45% Off"
                            badgeIcon="zap"
                            showCountdown
                            isRollback
                            products={products.slice(0, 12)}
                            viewAllLink="/#featured-catalog"
                        />

                        {/* 7. Split 60/40 Category Spotlight (Entertainment / Game Day) */}
                        <SplitCategorySpotlight
                            products={products.slice(12, 15)}
                            title="Host game day with ease"
                            bannerTitle="Touchdowns, blockbusters & high-fidelity audio"
                            bannerSubtitle="Upgrade your entertainment hub with crystal-clear 4K displays, Dolby soundbars, and quick party essentials."
                            bannerCta="Shop entertainment"
                            bannerLink="/?department=electronics"
                        />

                        {/* 8. Curated Everyday Essentials Catalog (Interactive Category Filter Tabs) */}
                        <FeaturedProductsSection products={products} />

                        {/* 9. Best Sellers in Store Horizontal Scroll Carousel */}
                        <ProductCarouselSection
                            id="best-sellers"
                            title="Best Sellers in Store"
                            subtitle="Highest rated products across verified vendors based on recent customer orders."
                            badgeText="Top Ranked"
                            badgeIcon="sparkles"
                            products={products.slice(15, 27)}
                            viewAllLink="/#featured-catalog"
                        />

                        {/* 10. Featured in Videos / Social Creator Showcase */}
                        <CreatorVideoShowcase products={products.slice(27, 35)} />

                        {/* 11. Department Spotlight (Pet Healthcare & Essentials) */}
                        <DepartmentSpotlight products={products} />

                    </>
                )}
            </div>
        </main>
    );
};

export default HomePage;