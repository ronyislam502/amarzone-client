'use client';

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import ProductsFilter, { ProductsFilterState } from "./ProductsFilter";
import { useAllProductsQuery, useDeleteProductMutation } from "@/redux/features/product/productApi";
import { useDebounce } from "@/components/shared/Debaounce";
import ProductsTable, { TProduct } from "./ProductsTable";
import ProductsStats from "./ProductsStats";



const LIMIT = 10;

const ProductsData = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<ProductsFilterState>({
        search: "",
        status: "",
        department: "",
        sort: "",
    });

    const [deleteProduct] = useDeleteProductMutation();
    const debouncedSearch = useDebounce(filters.search || "", 500);

    const {
        data: productsData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useAllProductsQuery({
        search: debouncedSearch,
        sort: filters.sort,
        page: String(page),
        limit: String(LIMIT),
        status: filters.status,
        department: filters.department,
    });

    const rawProducts: TProduct[] = (productsData?.data as TProduct[] | undefined) || [];
    const meta = productsData?.meta;

    // Pure client-side filtering & sorting fallback for instant responsiveness
    const filteredProducts = useMemo(() => {
        let result = [...rawProducts];

        // Search filter (searches title, brand, tags, features)
        const term = (filters.search || "").trim().toLowerCase();
        if (term) {
            result = result.filter((prod) => {
                const title = (prod.title || "").toLowerCase();
                const brand = (prod.brand || "").toLowerCase();
                const tags = Array.isArray(prod.tags) ? prod.tags.join(" ").toLowerCase() : "";
                const features = Array.isArray(prod.features) ? prod.features.join(" ").toLowerCase() : "";
                return (
                    title.includes(term) ||
                    brand.includes(term) ||
                    tags.includes(term) ||
                    features.includes(term)
                );
            });
        }

        // Department filter
        if (filters.department) {
            result = result.filter((prod) => {
                const dept = prod.department;
                const deptId =
                    typeof dept === "object" && dept !== null
                        ? dept._id
                        : dept;
                return String(deptId || "") === String(filters.department);
            });
        }

        // Status filter
        if (filters.status) {
            if (filters.status === "active") {
                result = result.filter((prod) => !prod.isDeleted);
            } else if (filters.status === "inactive") {
                result = result.filter((prod) => Boolean(prod.isDeleted));
            } else if (filters.status === "best_seller") {
                result = result.filter((prod) => Boolean(prod.isBestSeller));
            }
        }

        // Sort order
        if (filters.sort === "title_asc") {
            result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        } else if (filters.sort === "title_desc") {
            result.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        } else if (filters.sort === "brand_asc") {
            result.sort((a, b) => (a.brand || "").localeCompare(b.brand || ""));
        } else if (filters.sort === "oldest") {
            result.sort(
                (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            );
        }

        return result;
    }, [rawProducts, filters.search, filters.department, filters.status, filters.sort]);

    const handleFilterChange = (newFilters: Partial<ProductsFilterState>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setPage(1);
    };

    const handleResetFilters = () => {
        setFilters({
            search: "",
            status: "",
            department: "",
            sort: "",
        });
        setPage(1);
    };

    const handleDeleteProduct = async (productId: string, productTitle: string) => {
        const confirmed = window.confirm(
            `Are you sure you want to remove "${productTitle || "this product"}" from the catalog?`
        );
        if (!confirmed) return;

        try {
            const res = await deleteProduct(productId).unwrap();
            toast.success(res?.message || "Product removed successfully.");
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to remove product.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <ProductsStats
                products={rawProducts}
                isLoading={isLoading}
                meta={meta}
            />

            {/* Filter and Search Bar */}
            <ProductsFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
            />

            {/* Products Table */}
            <ProductsTable
                products={filteredProducts}
                meta={meta}
                isLoading={isLoading}
                isError={isError}
                error={error}
                refetch={refetch}
                isFetching={isFetching}
                page={page}
                limit={LIMIT}
                onPageChange={setPage}
                onDeleteProduct={handleDeleteProduct}
            />
        </div>
    );
};

export default ProductsData;
