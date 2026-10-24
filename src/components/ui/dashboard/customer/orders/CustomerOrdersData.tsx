'use client';

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import CustomerOrdersBread from "./CustomerOrdersBread";
import CustomerOrdersHeader from "./CustomerOrdersHeader";
import CustomerOrdersStats from "./CustomerOrdersStats";
import CustomerOrdersFilter, { OrdersFilterState } from "./CustomerOrdersFilter";
import CustomerOrdersTable from "./CustomerOrdersTable";
import { useDebounce } from "@/components/shared/Debaounce";
import { useMyOrdersQuery, useUpdateOrderMutation } from "@/redux/features/order/orderApi";
import { TOrder } from "@/types/order";

const LIMIT = 10;

const CustomerOrdersData = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<OrdersFilterState>({
        search: "",
        status: "",
        paymentStatus: "",
        sort: "",
    });

    const [updateOrder] = useUpdateOrderMutation();
    const debouncedSearch = useDebounce(
        filters.search || "",
        500
    );

    // Query server for customer purchases scoped to authenticated user
    const {
        data: ordersData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useMyOrdersQuery({
        search: debouncedSearch,
        sort: filters.sort,
        page: String(page),
        limit: String(LIMIT),
        status: filters.status,
    });

    const rawOrders = (ordersData?.data as TOrder[]) || [];
    const meta = ordersData?.meta;

    // Client-side fallback filtering/sorting
    const filteredOrders = useMemo(() => {
        let result = [...rawOrders];

        // Search filter (Order number, product title, seller name)
        const term = (filters.search || "").trim().toLowerCase();
        if (term) {
            result = result.filter((order) => {
                const orderNo = (order.orderNo || "").toLowerCase();
                const orderId = (order._id || "").toLowerCase();
                const vendor = typeof order.vendor === "object" ? order.vendor : null;
                const vendorName = (vendor?.name || "").toLowerCase();

                const productMatch = order.products?.some((p) => {
                    const title = (p.variant?.product?.title || "").toLowerCase();
                    return title.includes(term);
                });

                return (
                    orderNo.includes(term) ||
                    orderId.includes(term) ||
                    vendorName.includes(term) ||
                    Boolean(productMatch)
                );
            });
        }

        // Fulfillment status filter
        if (filters.status) {
            result = result.filter((order) => {
                const status = (order.status || "").toUpperCase();
                return status === filters.status.toUpperCase();
            });
        }

        // Payment status filter
        if (filters.paymentStatus) {
            result = result.filter((order) => {
                const paymentStatus = (order.paymentStatus || "").toUpperCase();
                return paymentStatus === filters.paymentStatus.toUpperCase();
            });
        }

        // Sort order
        if (filters.sort === "oldest") {
            result.sort(
                (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            );
        } else if (filters.sort === "total_desc") {
            result.sort((a, b) => Number(b.totalPrice || 0) - Number(a.totalPrice || 0));
        } else if (filters.sort === "total_asc") {
            result.sort((a, b) => Number(a.totalPrice || 0) - Number(b.totalPrice || 0));
        } else {
            // Default newest first
            result.sort(
                (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            );
        }

        return result;
    }, [rawOrders, filters.search, filters.status, filters.paymentStatus, filters.sort]);

    const handleFilterChange = (newFilters: Partial<OrdersFilterState>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setPage(1);
    };

    const handleResetFilters = () => {
        setFilters({
            search: "",
            status: "",
            paymentStatus: "",
            sort: "",
        });
        setPage(1);
    };

    const handleCancelOrder = async (orderId: string, orderNo: string) => {
        const confirmed = window.confirm(
            `Are you sure you want to cancel order "${orderNo || "this order"}"?`
        );
        if (!confirmed) return;

        try {
            const res = await updateOrder({
                id: orderId,
                data: { status: "CANCELLED" },
            }).unwrap();
            toast.success(res?.message || `Order ${orderNo} cancelled successfully.`);
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to cancel order.");
        }
    };

    return (
        <div className="space-y-6">
            <CustomerOrdersBread />

            <CustomerOrdersHeader
                onRefresh={refetch}
                isRefreshing={isFetching}
            />

            {/* Stats Overview */}
            <CustomerOrdersStats
                orders={rawOrders}
                isLoading={isLoading}
                meta={meta}
            />

            {/* Filter and Search Bar */}
            <CustomerOrdersFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
            />

            {/* Orders Table */}
            <CustomerOrdersTable
                orders={filteredOrders}
                meta={meta}
                isLoading={isLoading}
                isError={isError}
                error={error}
                refetch={refetch}
                isFetching={isFetching}
                page={page}
                limit={LIMIT}
                onPageChange={setPage}
                onCancelOrder={handleCancelOrder}
            />
        </div>
    );
};

export default CustomerOrdersData;
