'use client';

import { useMemo, useState } from "react";
import InventoryStats from "./InventoryStats";
import InventoryFilter, { InventoryFilterState } from "./InventoryFilter";
import InventoryTable from "./InventoryTable";
import { useMyInventoryQuery } from "@/redux/features/inventory/inventoryApi";
import { useDebounce } from "@/components/shared/Debaounce";
import { TInventory } from "@/types/inventory";

const LIMIT = 10;

const InventoryData = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<InventoryFilterState>({
        search: "",
        stockStatus: "",
        buyBoxStatus: "",
        sort: "",
    });

    const debouncedSearch = useDebounce(
        filters.search || "",
        500
    );

    // Query server with debounced search, sort, page, limit
    const {
        data: inventoryData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useMyInventoryQuery({
        search: debouncedSearch,
        sort: filters.sort,
        page: String(page),
        limit: String(LIMIT),
    });

    const rawInventories = (inventoryData?.data as TInventory[]) || [];
    const meta = inventoryData?.meta;

    // Client-side fallback filtering and sorting for instant responsiveness
    const filteredInventories = useMemo(() => {
        let result = [...rawInventories];

        // Search filter (Product Title, Brand, ASIN, SKU)
        const term = (filters.search || "").trim().toLowerCase();
        if (term) {
            result = result.filter((item) => {
                const asin = (item.asin || "").toLowerCase();
                const variant = typeof item.variant === "object" ? (item.variant as any) : null;
                const sku = (variant?.sku || "").toLowerCase();
                const product = typeof variant?.product === "object" ? (variant?.product as any) : null;
                const title = (product?.title || "").toLowerCase();
                const brand = (product?.brand || "").toLowerCase();

                return (
                    asin.includes(term) ||
                    sku.includes(term) ||
                    title.includes(term) ||
                    brand.includes(term)
                );
            });
        }

        // Stock Status filter
        if (filters.stockStatus) {
            result = result.filter((item) => {
                const qty = item.seller?.quantity ?? 0;
                if (filters.stockStatus === "in_stock") {
                    return qty > 5;
                }
                if (filters.stockStatus === "low_stock") {
                    return qty > 0 && qty <= 5;
                }
                if (filters.stockStatus === "out_of_stock") {
                    return qty <= 0;
                }
                return true;
            });
        }

        // Buy Box Status filter
        if (filters.buyBoxStatus) {
            result = result.filter((item) => {
                const isWinner = item.seller?.isBuyBoxWinner === true;
                if (filters.buyBoxStatus === "winner") {
                    return isWinner;
                }
                if (filters.buyBoxStatus === "competing") {
                    return !isWinner;
                }
                return true;
            });
        }

        // Client Sort Order
        if (filters.sort === "price_asc") {
            result.sort((a, b) => (a.seller?.price ?? 0) - (b.seller?.price ?? 0));
        } else if (filters.sort === "price_desc") {
            result.sort((a, b) => (b.seller?.price ?? 0) - (a.seller?.price ?? 0));
        } else if (filters.sort === "qty_desc") {
            result.sort((a, b) => (b.seller?.quantity ?? 0) - (a.seller?.quantity ?? 0));
        } else if (filters.sort === "qty_asc") {
            result.sort((a, b) => (a.seller?.quantity ?? 0) - (b.seller?.quantity ?? 0));
        } else if (filters.sort === "oldest") {
            result.sort(
                (a, b) =>
                    new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            );
        }

        return result;
    }, [rawInventories, filters.search, filters.stockStatus, filters.buyBoxStatus, filters.sort]);

    const handleFilterChange = (newFilters: Partial<InventoryFilterState>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setPage(1);
    };

    const handleResetFilters = () => {
        setFilters({
            search: "",
            stockStatus: "",
            buyBoxStatus: "",
            sort: "",
        });
        setPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <InventoryStats
                inventories={rawInventories}
                isLoading={isLoading}
                meta={meta}
            />

            {/* Filter and Search Bar */}
            <InventoryFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
            />

            {/* Inventory Offerings Table */}
            <InventoryTable
                inventories={filteredInventories}
                meta={meta}
                isLoading={isLoading}
                isError={isError}
                error={error}
                refetch={refetch}
                isFetching={isFetching}
                page={page}
                limit={LIMIT}
                onPageChange={setPage}
            />
        </div>
    );
};

export default InventoryData;