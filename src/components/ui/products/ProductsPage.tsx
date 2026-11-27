"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AZProductsPage from "@/components/shared/AZProductsPage";
import {
    useAllVariantsProductsQuery,
    useAllVariantsProductsByDepartmentQuery,
    useAllVariantsProductsByCategoryQuery,
} from "@/redux/features/variant/variantApi";

interface FilterState {
    search: string;
    department: string;
    category: string;
    brand: string;
    minPrice: string;
    maxPrice: string;
    rating: number | null;
    sort: string;
}

const DEFAULT_FILTERS: FilterState = {
    search: "",
    department: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    rating: null,
    sort: "",
};

const ProductsPage = () => {
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

    useEffect(() => {
        const deptParam = searchParams.get("department");
        const catParam = searchParams.get("category");
        const searchParam = searchParams.get("search") || searchParams.get("searchTerm");

        if (deptParam || catParam || searchParam) {
            setFilters((prev) => ({
                ...prev,
                ...(deptParam ? { department: deptParam } : {}),
                ...(catParam ? { category: catParam } : {}),
                ...(searchParam ? { search: searchParam } : {}),
            }));
            setPage(1);
        }
    }, [searchParams]);

    const hasCategoryFilter = Boolean(filters.category);
    const hasDepartmentFilter = Boolean(filters.department) && !hasCategoryFilter;
    const hasAllFilter = !hasCategoryFilter && !hasDepartmentFilter;

    // 1. Dedicated query for category-wise products
    const {
        data: catProductsData,
        isLoading: isCatLoading,
        isFetching: isCatFetching,
        isError: isCatError,
        refetch: refetchCat,
    } = useAllVariantsProductsByCategoryQuery(
        {
            id: filters.category,
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
        { skip: !hasCategoryFilter }
    );

    // 2. Dedicated query for department-wise products
    const {
        data: deptProductsData,
        isLoading: isDeptLoading,
        isFetching: isDeptFetching,
        isError: isDeptError,
        refetch: refetchDept,
    } = useAllVariantsProductsByDepartmentQuery(
        {
            id: filters.department,
            page,
            limit,
            search: filters.search || undefined,
            sort: filters.sort || undefined,
            brand: filters.brand || undefined,
            minPrice: filters.minPrice || undefined,
            maxPrice: filters.maxPrice || undefined,
            rating: filters.rating !== null ? filters.rating : undefined,
        },
        { skip: !hasDepartmentFilter }
    );

    // 3. General query when neither category nor department filter is active
    const {
        data: allProductsData,
        isLoading: isAllLoading,
        isFetching: isAllFetching,
        isError: isAllError,
        refetch: refetchAll,
    } = useAllVariantsProductsQuery(
        {
            page,
            limit,
            search: filters.search || undefined,
            sort: filters.sort || undefined,
            brand: filters.brand || undefined,
            minPrice: filters.minPrice || undefined,
            maxPrice: filters.maxPrice || undefined,
            rating: filters.rating !== null ? filters.rating : undefined,
        },
        { skip: !hasAllFilter }
    );

    const productsData = hasCategoryFilter
        ? catProductsData
        : hasDepartmentFilter
        ? deptProductsData
        : allProductsData;

    const isLoading = hasCategoryFilter
        ? isCatLoading
        : hasDepartmentFilter
        ? isDeptLoading
        : isAllLoading;

    const isFetching = hasCategoryFilter
        ? isCatFetching
        : hasDepartmentFilter
        ? isDeptFetching
        : isAllFetching;

    const isError = hasCategoryFilter
        ? isCatError
        : hasDepartmentFilter
        ? isDeptError
        : isAllError;

    const refetch = hasCategoryFilter
        ? refetchCat
        : hasDepartmentFilter
        ? refetchDept
        : refetchAll;

    // Slice to exactly `limit` so each page always shows the correct count
    const rawProducts = (productsData?.data || []).slice(0, limit);

    // Recalculate meta so pagination controls use the client-side limit
    const apiMeta = productsData?.meta;
    const meta = apiMeta
        ? {
            ...apiMeta,
            limit,
            totalPage: Math.ceil((apiMeta.total ?? 0) / limit),
        }
        : undefined;

    const handleFiltersChange = (newFilters: FilterState) => {
        setFilters(newFilters);
        setPage(1);
    };

    return (
        <AZProductsPage
            products={rawProducts}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
            refetch={refetch}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={(newLimit) => { setLimit(newLimit); setPage(1); }}
            meta={meta}
            filters={filters}
            onFiltersChange={handleFiltersChange}
        />
    );
};

export default ProductsPage;
