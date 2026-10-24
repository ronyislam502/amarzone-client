"use client"

import AZProductsPage from "@/components/shared/AZProductsPage";
import { useAllProductsByDepartmentQuery } from "@/redux/features/product/productApi";
import ProductFilterSidebar from "./productsFilter";
import { useParams, useSearchParams } from "next/navigation";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";



const DepProductsPage = () => {
    const params = useParams();

    const departmentSlug = params.slug || params.name;
    const { data: departmentsData } = useAllDepartmentsQuery({});
    const currentDepartment = departmentsData?.data?.find(
        (dept: any) => dept.slug === departmentSlug || dept.name.toLowerCase() === String(departmentSlug).toLowerCase()
    );

    const {
        data: DepProductsData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useAllProductsByDepartmentQuery(currentDepartment?._id, {
        skip: !currentDepartment?._id
    });

    const products = DepProductsData?.data?.flatMap((product: any) =>
        product?.variants?.map((variant: any) => {
            const {
                variants,
                ...productInfo
            } = product;

            return {
                ...productInfo,
                productId: product._id,
                _id: variant._id,
                variantId: variant._id,
                asin: variant.asin,
                sku: variant.sku,
                attributes: variant.attributes,
                images: variant.images,
                thumbnail: variant.images?.[0] || product.thumbnail,
                price: variant.price,
                rating: variant.rating,
                isBuyBoxEligible: variant.isBuyBoxEligible,

            };
        }),
    );

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-6">
            <div className="col-span-1"><ProductFilterSidebar /></div>
            <div className="col-span-3"><AZProductsPage products={products} /></div>
        </div>
    )
}

export default DepProductsPage;