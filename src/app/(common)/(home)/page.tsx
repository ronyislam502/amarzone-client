// import DepartmentQuickLinks from "@/src/components/ui/home/DepartmentQuickLinks";
// import CategoryShortcuts from "@/src/components/ui/home/CategoryShortcuts";
// import HomeHeroCarousel from "@/src/components/ui/home/HomeHeroCarousel";
// import BentoPromoShowcase from "@/src/components/ui/home/BentoPromoShowcase";
import RollbacksBentoGrid from "@/src/components/ui/home/RollbacksBentoGrid";
import ProductCarouselSection from "@/src/components/ui/home/ProductCarouselSection";
import SplitCategorySpotlight from "@/src/components/ui/home/SplitCategorySpotlight";
import FeaturedProductsSection from "@/src/components/ui/home/FeaturedProductsSection";
import CreatorVideoShowcase from "@/src/components/ui/home/CreatorVideoShowcase";
import DepartmentSpotlight from "@/src/components/ui/home/DepartmentSpotlight";

const HomePage = () => {
    return (
        <main className="min-h-screen bg-[#f3f4f6]/60 text-slate-800 font-sans antialiased">
            {/* 1. Full-Width Department & Service Quick-Links Strip (Walmart Sub-nav) */}
            {/* <DepartmentQuickLinks /> */}

            {/* Main Marketplace Content Container - Ultra-Wide 1720px */}
            <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-8 space-y-10 sm:space-y-12">
                {/* 2. Circular Department Shortcuts Row */}
                {/* <CategoryShortcuts /> */}

                {/* 3. Hero Carousel Banner with Live Product Previews & Slider Controls */}
                {/* <HomeHeroCarousel /> */}

                {/* 4. 3-Column Asymmetric Bento Promotional Showcase */}
                {/* <BentoPromoShowcase /> */}

                {/* 5. Walmart's Signature 5-Column 2x2 "Rollbacks & more" Bento Grid */}
                <RollbacksBentoGrid />

                {/* 6. Flash Deals Horizontal Scroll Carousel with Countdown Timer */}
                <ProductCarouselSection
                    id="flash-deals"
                    title="Flash Deals & Daily Rollbacks"
                    subtitle="Fresh rollbacks updated daily. Limited quantities while supplies last."
                    badgeText="Up to 45% Off"
                    badgeIcon="zap"
                    showCountdown
                    isRollback
                    viewAllLink="/#featured-catalog"
                />

                {/* 7. Split 60/40 Category Spotlight (Entertainment / Game Day) */}
                <SplitCategorySpotlight
                    title="Host game day with ease"
                    bannerTitle="Touchdowns, blockbusters & high-fidelity audio"
                    bannerSubtitle="Upgrade your entertainment hub with crystal-clear 4K displays, Dolby soundbars, and quick party essentials."
                    bannerCta="Shop entertainment"
                    bannerLink="/?department=electronics"
                />

                {/* 8. Curated Everyday Essentials Catalog (Interactive Category Filter Tabs) */}
                <FeaturedProductsSection />

                {/* 9. Best Sellers in Store Horizontal Scroll Carousel */}
                <ProductCarouselSection
                    id="best-sellers"
                    title="Best Sellers in Store"
                    subtitle="Highest rated products across verified vendors based on recent customer orders."
                    badgeText="Top Ranked"
                    badgeIcon="sparkles"
                    viewAllLink="/#featured-catalog"
                />

                {/* 10. Featured in Videos / Social Creator Showcase */}
                <CreatorVideoShowcase />

                {/* 11. Department Spotlight (Pet Healthcare & Essentials) */}
                <DepartmentSpotlight />
            </div>
        </main>
    );
};

export default HomePage;