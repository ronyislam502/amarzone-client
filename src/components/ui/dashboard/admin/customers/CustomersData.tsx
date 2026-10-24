'use client';

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import CustomersStats from "./CustomersStats";
import CustomersTable from "./CustomersTable";
import CustomersFilter, { CustomersFilterState } from "./CustomersFilter";
import { useAllCustomersQuery, useDeleteCustomerMutation } from "@/redux/features/customer/customerApi";
import { useDebounce } from "@/components/shared/Debaounce";
import { TCustomer } from "@/types/customer";

const LIMIT = 10;

const CustomersData = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<CustomersFilterState>({
        search: "",
        status: "",
        sort: "",
    });

    const [deleteCustomer] = useDeleteCustomerMutation();
    const debouncedSearch = useDebounce(
        filters.search || "",
        500
    );

    const {
        data: customersData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useAllCustomersQuery({
        search: debouncedSearch,
        sort: filters.sort,
        page: String(page),
        limit: String(LIMIT),
    });

    const rawCustomers = (customersData?.data as TCustomer[]) || [];
    const meta = customersData?.meta;

    // Client-side fallback filtering and sorting
    const filteredCustomers = useMemo(() => {
        let result = [...rawCustomers];

        // Search filter
        const term = (filters.search || "").trim().toLowerCase();
        if (term) {
            result = result.filter((customer) => {
                const name = (customer.name || "").toLowerCase();
                const email = (customer.email || "").toLowerCase();
                const phone = (customer.phone || "").toLowerCase();
                const street = (customer.address?.street || "").toLowerCase();
                const state = (customer.address?.state || "").toLowerCase();
                const country = (customer.address?.country || "").toLowerCase();
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
            result = result.filter((customer) => {
                const isSuspended = customer.isDeleted;
                const status = typeof customer.user === "object" ? customer.user?.status : undefined;
                if (filters.status === "active") {
                    return !isSuspended && status !== "blocked" && status !== "inactive";
                }
                if (filters.status === "inactive") {
                    return isSuspended || status === "blocked" || status === "inactive";
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
    }, [rawCustomers, filters.search, filters.status, filters.sort]);

    const handleFilterChange = (newFilters: Partial<CustomersFilterState>) => {
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

    const handleDeleteCustomer = async (customerId: string, customerName: string) => {
        const confirmed = window.confirm(
            `Are you sure you want to suspend account privileges for ${customerName || "this customer"}?`
        );
        if (!confirmed) return;

        try {
            const res = await deleteCustomer(customerId).unwrap();
            toast.success(res?.message || "Customer account status updated successfully.");
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update customer account status.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <CustomersStats
                customers={rawCustomers}
                isLoading={isLoading}
                meta={meta}
            />

            {/* Filter and Search Bar */}
            <CustomersFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
            />

            {/* Customers Table */}
            <CustomersTable
                customers={filteredCustomers}
                meta={meta}
                isLoading={isLoading}
                isError={isError}
                error={error}
                refetch={refetch}
                isFetching={isFetching}
                page={page}
                limit={LIMIT}
                onPageChange={setPage}
                onDeleteCustomer={handleDeleteCustomer}
            />
        </div>
    );
};

export default CustomersData;
