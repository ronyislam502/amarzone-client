import AZProductCard from "@/components/shared/AZProductCard";
import { useAllProductsQuery } from "@/redux/features/product/productApi";
import { Sparkles } from "lucide-react";


const RecommendedProd = () => {

    const { data: recommendedData, isLoading: isLoadingRecommended } =
        useAllProductsQuery({});

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Recommended Products on Amarzone
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendedData?.data?.slice(20, 24).map((product) => (
                    <AZProductCard key={product?._id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default RecommendedProd;