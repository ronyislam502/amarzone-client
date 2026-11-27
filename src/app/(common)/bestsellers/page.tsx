import React, { Suspense } from "react";
import BestSellersPage from "@/components/ui/bestsellers/BestSellersPage";

export const metadata = {
    title: "Amazon Best Sellers: The most popular items on Amarzone",
    description: "Our most popular products based on sales. Updated frequently.",
};

export default function BestSellers() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f7f8f9] p-8 text-center text-slate-500">Loading Best Sellers...</div>}>
            <BestSellersPage />
        </Suspense>
    );
}
