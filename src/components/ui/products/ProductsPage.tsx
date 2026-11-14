"use client";

import { useState } from "react";
import AZProductsPage from "@/components/shared/AZProductsPage";
import { useAllVariantsProductsQuery } from "@/redux/features/variant/variantApi";

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
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

    const {
        data: productsData,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useAllVariantsProductsQuery({
        page,
        limit,
        search: filters.search || undefined,
        sort: filters.sort || undefined,
        department: filters.department || undefined,
        category: filters.category || undefined,
        brand: filters.brand || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
    });



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
