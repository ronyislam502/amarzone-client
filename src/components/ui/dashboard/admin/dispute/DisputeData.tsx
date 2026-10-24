'use client';

import { useMemo, useState } from "react";
import DisputeStats from "./DisputeStats";
import DisputeFilter, { DisputeFilterState } from "./DisputeFilter";
import DisputeTable from "./DisputeTable";
import { useAllDisputesQuery } from "@/redux/features/dispute/disputeApi";
import { useDebounce } from "@/components/shared/Debaounce";
import { TDispute } from "@/types/dispute";

const LIMIT = 10;

const DisputeData = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<DisputeFilterState>({
        search: "",
        status: "",
        sort: "",
    });

    const debouncedSearch = useDebounce(
        filters.search || "",
        500
    );

    // Query server with debounced search, sort, page, limit, status
    const {
        data: disputesData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useAllDisputesQuery({
        search: debouncedSearch,
        sort: filters.sort,
        page: String(page),
        limit: String(LIMIT),
        status: filters.status || undefined,
    });

    const rawDisputes = (disputesData?.data as TDispute[]) || [];
    const meta = disputesData?.meta;

    // Client-side fallback filtering/sorting
    const filteredDisputes = useMemo(() => {
        let result = [...rawDisputes];

        // Search filter
        const term = (filters.search || "").trim().toLowerCase();
        if (term) {
            result = result.filter((dispute) => {
                const reason = (dispute.reason || "").toLowerCase();
                const details = (dispute.details || "").toLowerCase();
                const orderId =
                    typeof dispute.order === "object" && dispute.order !== null
                        ? (dispute.order as any)._id || ""
                        : String(dispute.order || "");
                const customerName =
                    typeof dispute.customer === "object" && dispute.customer !== null
                        ? (dispute.customer as any).name || (dispute.customer as any).email || ""
                        : "";
                const vendorName =
                    typeof dispute.vendor === "object" && dispute.vendor !== null
                        ? (dispute.vendor as any).name || (dispute.vendor as any).email || ""
                        : "";

                return (
                    reason.includes(term) ||
                    details.includes(term) ||
                    orderId.toLowerCase().includes(term) ||
                    customerName.toLowerCase().includes(term) ||
                    vendorName.toLowerCase().includes(term)
                );
            });
        }

        // Status filter
        if (filters.status) {
            result = result.filter((dispute) => dispute.status === filters.status);
        }

        // Sort order
        if (filters.sort === "oldest") {
            result.sort(
                (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            );
        } else if (filters.sort === "status") {
            result.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
        } else {
            // Default newest first
            result.sort(
                (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            );
        }

        return result;
    }, [rawDisputes, filters.search, filters.status, filters.sort]);

    const handleFilterChange = (newFilters: Partial<DisputeFilterState>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setPage(1);
    };

    const handleResetFilters = () => {
        setFilters({
            search: "",
            status: "",
            sort: "",
        });
        setPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <DisputeStats
                disputes={rawDisputes}
                isLoading={isLoading}
                meta={meta}
            />

            {/* Filter and Search Bar */}
            <DisputeFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
            />

            {/* Disputes Table */}
            <DisputeTable
                disputes={filteredDisputes}
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

export default DisputeData;
