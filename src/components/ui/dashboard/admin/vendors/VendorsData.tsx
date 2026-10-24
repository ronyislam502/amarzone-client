'use client';

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import VendorsStats from "./VendorsStats";
import VendorsFilter, { VendorsFilterState } from "./VendorsFilter";
import VendorsTable from "./VendorsTable";
import { useAllVendorsQuery, useDeleteVendorMutation } from "@/redux/features/vendor/vendorApi";
import { useDebounce } from "@/components/shared/Debaounce";
import { TVendor } from "@/types/vendor";

const LIMIT = 10;

const VendorsData = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<VendorsFilterState>({
        search: "",
        status: "",
        sort: "",
    });

    const [deleteVendor] = useDeleteVendorMutation();

    const debouncedSearch = useDebounce(
        filters.search || "",
        500
    );

    // Query server with debounced search term, sort, page, limit, status
    const {
        data: vendorsData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useAllVendorsQuery({
        search: debouncedSearch,
        sort: filters.sort,
        page: String(page),
        limit: String(LIMIT),
        status: filters.status,
    });
    console.log('vendors', vendorsData)

    const rawVendors = (vendorsData?.data as TVendor[]) || [];
    const meta = vendorsData?.meta;

    // Client-side fallback filtering and sorting for instant responsiveness
    const filteredVendors = useMemo(() => {
        let result = [...rawVendors];

        // Search query filter (store name, email, phone, location/address)
        const term = (filters.search || "").trim().toLowerCase();
        if (term) {
            result = result.filter((vendor) => {
                const name = (vendor.name || "").toLowerCase();
                const email = (vendor.email || "").toLowerCase();
                const phone = (vendor.phone || "").toLowerCase();
                const street = (vendor.address?.street || "").toLowerCase();
                const state = (vendor.address?.state || "").toLowerCase();
                const country = (vendor.address?.country || "").toLowerCase();

                return (
                    name.includes(term) ||
                    email.includes(term) ||
                    phone.includes(term) ||
                    street.includes(term) ||
                    state.includes(term) ||
                    country.includes(term)
                );
            });
        }

        // Status filter
        if (filters.status) {
            result = result.filter((vendor) => {
                const isSuspended = vendor.isDeleted;
                const userStatus = typeof vendor.user === "object" ? vendor.user?.status?.toLowerCase() : undefined;
                if (filters.status === "active") {
                    return !isSuspended && userStatus !== "blocked" && userStatus !== "suspended" && userStatus !== "inactive";
                }
                if (filters.status === "inactive") {
                    return isSuspended || userStatus === "blocked" || userStatus === "suspended" || userStatus === "inactive";
                }
                return true;
            });
        }

        // Sort order
        if (filters.sort === "name_asc") {
            result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        } else if (filters.sort === "name_desc") {
            result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        } else if (filters.sort === "oldest") {
            result.sort(
                (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            );
        }

        return result;
    }, [rawVendors, filters.search, filters.status, filters.sort]);

    const handleFilterChange = (newFilters: Partial<VendorsFilterState>) => {
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

    const handleDeleteVendor = async (vendorId: string, vendorName: string) => {
        const confirmed = window.confirm(
            `Are you sure you want to suspend or revoke merchant "${vendorName || "this vendor"}"?`
        );
        if (!confirmed) return;

        try {
            const res = await deleteVendor(vendorId).unwrap();
            toast.success(res?.message || "Merchant suspended successfully.");
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to suspend merchant.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Merchant Statistics Overview */}
            <VendorsStats
                vendors={rawVendors}
                isLoading={isLoading}
                meta={meta}
            />

            {/* Merchant Directory Filters */}
            <VendorsFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
            />

            {/* Merchant Stores Table */}
            <VendorsTable
                vendors={filteredVendors}
                meta={meta}
                isLoading={isLoading}
                isError={isError}
                error={error}
                refetch={refetch}
                isFetching={isFetching}
                page={page}
                limit={LIMIT}
                onPageChange={setPage}
                onDeleteVendor={handleDeleteVendor}
            />
        </div>
    );
};

export default VendorsData;