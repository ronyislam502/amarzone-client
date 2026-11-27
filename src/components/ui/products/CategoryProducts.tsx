"use client";

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import AZProductsPage from "@/components/shared/AZProductsPage";
import { useAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useAllVariantsProductsByCategoryQuery } from "@/redux/features/variant/variantApi";

interface CategoryProductsProps {
    categoryId?: string;
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({ categoryId: propCatId }) => {
    const params = useParams();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [filters, setFilters] = useState<any>({
        search: searchParams.get("search") || "",
        department: searchParams.get("department") || "",
        category: propCatId || searchParams.get("category") || "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        rating: null,
        sort: "",
    });

    const categorySlug =
        propCatId ||
        filters.category ||
        params?.slug ||
        params?.id ||
        (params as any)?.["category.name"];

    const { data: categoriesData, isLoading: isCatListLoading } = useAllCategoriesQuery({ limit: 200 });
    const currentCategory = categoriesData?.data?.find(
        (cat: any) =>
            cat._id === categorySlug ||
            cat.name.toLowerCase() === String(categorySlug).toLowerCase()
    );

    const catId = currentCategory?._id || (categorySlug && categorySlug.length === 24 ? categorySlug : undefined);

    const {
        data: catProductsData,
        isLoading: isProductsLoading,
        isFetching,
        isError,
        refetch,
    } = useAllVariantsProductsByCategoryQuery(
        {
            id: catId,
            page,
            limit,
            search: filters.search || undefined,
            sort: filters.sort || undefined,
            department: filters.department || undefined,
            brand: filters.brand || undefined,
            minPrice: filters.minPrice || undefined,
            maxPrice: filters.maxPrice || undefined,
            rating: filters.rating !== null ? filters.rating : undefined,
        },
        { skip: !catId }
    );

    const rawProducts = (catProductsData?.data || []).slice(0, limit);
    const apiMeta = catProductsData?.meta;
    const meta = apiMeta
        ? {
            ...apiMeta,
            limit,
            totalPage: Math.ceil((apiMeta.total ?? 0) / limit),
        }
        : undefined;

    return (
        <div className="w-full">
            <AZProductsPage
                products={rawProducts}
                isLoading={isCatListLoading || isProductsLoading}
                isFetching={isFetching}
                isError={isError}
                refetch={refetch}
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={(newLimit) => { setLimit(newLimit); setPage(1); }}
                meta={meta}
                filters={{ ...filters, category: catId || "" }}
                onFiltersChange={(newFilters) => {
                    setFilters(newFilters);
                    setPage(1);
                }}
            />
        </div>
    );
};

export default CategoryProducts;
