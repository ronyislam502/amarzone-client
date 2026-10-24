'use client';

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import OrdersStats from "./AdminOrdersStats";
import OrdersTable from "./AdminOrdersTable";
import OrdersFilter, { OrdersFilterState } from "./AdminOrdersFilter";
import { useDebounce } from "@/components/shared/Debaounce";
import { useAllOrdersQuery, useUpdateOrderMutation } from "@/redux/features/order/orderApi";
import { TOrder } from "@/types/order";
import AdminOrdersBread from "./AdminOrdersBread";
import AdminOrdersHeader from "./AdminOrdersHeader";

const LIMIT = 10;

const AdminOrdersData = () => {
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

    // Query server for admin marketplace orders
    const {
        data: ordersData,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useAllOrdersQuery({
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

        // Search filter (Order number, customer name, customer email, vendor name, product title)
        const term = (filters.search || "").trim().toLowerCase();
        if (term) {
            result = result.filter((order) => {
                const orderNo = (order.orderNo || "").toLowerCase();
                const orderId = (order._id || "").toLowerCase();
                const customer = typeof order.customer === "object" ? order.customer : null;
                const customerName = (customer?.name || "").toLowerCase();
                const customerEmail = (customer?.email || "").toLowerCase();
                const vendor = typeof order.vendor === "object" ? order.vendor : null;
                const vendorName = (vendor?.name || "").toLowerCase();

                const productMatch = order.products?.some((p) => {
                    const title = (p.variant?.product?.title || "").toLowerCase();
                    return title.includes(term);
                });

                return (
                    orderNo.includes(term) ||
                    orderId.includes(term) ||
                    customerName.includes(term) ||
                    customerEmail.includes(term) ||
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

    const handleUpdateStatus = async (order: TOrder, status: string) => {
        const orderNo = order.orderNo || `#ORD-${order._id.slice(-6).toUpperCase()}`;
        try {
            const res = await updateOrder({
                id: order._id,
                data: { status },
            }).unwrap();
            toast.success(res?.message || `Order ${orderNo} status updated to ${status}.`);
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update order status.");
        }
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
            <AdminOrdersBread />

            <AdminOrdersHeader />
            {/* Stats Overview */}
            <OrdersStats
                orders={rawOrders}
                isLoading={isLoading}
                meta={meta}
            />

            {/* Filter and Search Bar */}
            <OrdersFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
            />

            {/* Orders Table */}
            <OrdersTable
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
                onUpdateStatus={handleUpdateStatus}
                onCancelOrder={handleCancelOrder}
            />
        </div>
    );
};

export default AdminOrdersData;