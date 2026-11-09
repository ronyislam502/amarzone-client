"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
    ShoppingBag,
    ArrowUpRight,
    Package,
    Clock,
    Download,
    Store,
    CheckCircle2,
    Truck,
    AlertCircle,
    RotateCcw,
    XCircle,
} from "lucide-react";
import { TOrder } from "@/types/order";
import AZTable from "@/components/shared/AZTable";
import { TColumn } from "@/types/table";

export interface CustomerRecentOrdersProps {
    orders?: (TOrder | any)[];
    isLoading?: boolean;
}

const ORDER_STATUS_CONFIG: Record<
    string,
    { label: string; badgeClass: string; icon: React.ReactNode }
> = {
    DELIVERED: {
        label: "Delivered",
        badgeClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
        icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
    },
    SHIPPED: {
        label: "Shipped",
        badgeClass: "bg-sky-500/15 border-sky-500/30 text-sky-300",
        icon: <Truck className="w-3 h-3 text-sky-400" />,
    },
    IN_TRANSIT: {
        label: "In Transit",
        badgeClass: "bg-sky-500/15 border-sky-500/30 text-sky-300",
        icon: <Truck className="w-3 h-3 text-sky-400" />,
    },
    OUT_OF_DELIVERY: {
        label: "Out For Delivery",
        badgeClass: "bg-blue-500/15 border-blue-500/30 text-blue-300",
        icon: <Truck className="w-3 h-3 text-blue-400" />,
    },
    UNSHIPPED: {
        label: "Unshipped",
        badgeClass: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
        icon: <Package className="w-3 h-3 text-cyan-400" />,
    },
    PROCESSING: {
        label: "Processing",
        badgeClass: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
        icon: <Package className="w-3 h-3 text-cyan-400" />,
    },
    PENDING: {
        label: "Pending",
        badgeClass: "bg-amber-500/15 border-amber-500/30 text-amber-300",
        icon: <Clock className="w-3 h-3 text-amber-400" />,
    },
    CANCELLED: {
        label: "Cancelled",
        badgeClass: "bg-rose-500/15 border-rose-500/30 text-rose-300",
        icon: <XCircle className="w-3 h-3 text-rose-400" />,
    },
    REFUNDED: {
        label: "Refunded",
        badgeClass: "bg-purple-500/15 border-purple-500/30 text-purple-300",
        icon: <RotateCcw className="w-3 h-3 text-purple-400" />,
    },
};

const PAYMENT_STATUS_CLASSES: Record<string, string> = {
    PAID: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    UNPAID: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    REFUNDED: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

export const CustomerRecentOrders: React.FC<CustomerRecentOrdersProps> = ({
    orders = [],
    isLoading = false,
}) => {
    const [searchValue, setSearchValue] = useState("");

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
        }).format(val || 0);
    };

    const formatDate = (dateStr?: string | Date) => {
        if (!dateStr) return "Recent";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const filteredOrders = useMemo(() => {
        const list = Array.isArray(orders) ? orders : [];
        if (!searchValue.trim()) {
            return list.slice(0, 8);
        }
        const term = searchValue.toLowerCase();
        return list
            .filter((o) => {
                const orderNo = (o.orderNo || o._id || "").toLowerCase();
                const vendorName = (
                    o.vendor?.name ||
                    o.vendor?.storeName ||
                    (typeof o.vendor === "string" ? o.vendor : "")
                ).toLowerCase();
                const status = (o.status || "").toLowerCase();
                const paymentStatus = (o.paymentStatus || "").toLowerCase();
                return (
                    orderNo.includes(term) ||
                    vendorName.includes(term) ||
                    status.includes(term) ||
                    paymentStatus.includes(term)
                );
            })
            .slice(0, 8);
    }, [orders, searchValue]);

    const columns: TColumn<TOrder | any>[] = useMemo(
        () => [
            {
                header: "Order Ref",
                accessor: (order, idx) => {
                    const displayRef =
                        order.orderNo || (order._id ? `#${order._id.slice(-6).toUpperCase()}` : `#${idx + 1}`);
                    return (
                        <div className="font-mono">
                            <div className="font-black text-white text-xs hover:text-amber-400 transition-colors">
                                {displayRef}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 font-sans mt-0.5">
                                <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                <span>{formatDate(order.createdAt)}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                header: "Merchant",
                accessor: (order) => {
                    const vendorName =
                        order.vendor?.name ||
                        order.vendor?.storeName ||
                        (typeof order.vendor === "string" ? "Vendor" : "AmarZone Merchant");
                    return (
                        <div className="flex items-center gap-2 min-w-0 max-w-[150px]">
                            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <Store className="w-3 h-3 text-slate-400" />
                            </div>
                            <div className="min-w-0">
                                <span className="truncate block font-semibold text-slate-200 text-xs">
                                    {vendorName}
                                </span>
                                {order.vendor?.email && (
                                    <span className="text-[10px] text-slate-400 truncate block">
                                        {order.vendor.email}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                },
            },
            {
                header: "Items",
                align: "center",
                accessor: (order) => {
                    const count = Array.isArray(order.products) ? order.products.length : 1;
                    const qty = Number(order.totalQuantity ?? count);
                    return (
                        <span className="text-xs font-mono font-bold text-slate-300">
                            {qty} {qty === 1 ? "item" : "items"}
                        </span>
                    );
                },
            },
            {
                header: "Total",
                align: "right",
                accessor: (order) => {
                    const orderPrice = Number(order.totalPrice ?? 0);
                    return (
                        <div className="font-mono font-black text-amber-400 text-xs">
                            {formatCurrency(orderPrice)}
                        </div>
                    );
                },
            },
            {
                header: "Status",
                align: "center",
                accessor: (order) => {
                    const statusKey = (order.status || "PENDING").toUpperCase();
                    const statusConfig = ORDER_STATUS_CONFIG[statusKey] || {
                        label: statusKey,
                        badgeClass: "bg-slate-500/15 border-slate-500/30 text-slate-300",
                        icon: <AlertCircle className="w-3 h-3 text-slate-400" />,
                    };
                    return (
                        <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.badgeClass}`}
                        >
                            {statusConfig.icon}
                            <span>{statusConfig.label}</span>
                        </span>
                    );
                },
            },
            {
                header: "Payment",
                align: "center",
                accessor: (order) => {
                    const payKey = (order.paymentStatus || "UNPAID").toUpperCase();
                    const payBadgeClass =
                        PAYMENT_STATUS_CLASSES[payKey] || PAYMENT_STATUS_CLASSES.UNPAID;
                    return (
                        <span
                            className={`badge badge-xs uppercase font-bold px-2 py-0.5 border ${payBadgeClass}`}
                        >
                            {order.paymentStatus || "UNPAID"}
                        </span>
                    );
                },
            },
            {
                header: "Action",
                align: "right",
                accessor: (order) => {
                    const hasInvoice = Boolean(order.invoiceUrl && order.invoiceUrl.trim());
                    return (
                        <div className="flex items-center justify-end gap-1.5">
                            {hasInvoice ? (
                                <a
                                    href={order.invoiceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    title="Download Invoice"
                                    className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-400/50 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-all duration-200 cursor-pointer"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                </a>
                            ) : null}
                            <Link
                                href="/customer/orders"
                                className="btn btn-xs gap-1 font-bold text-amber-400 hover:text-slate-950 bg-amber-400/10 hover:bg-amber-400 border border-amber-400/20 rounded-lg transition-all"
                            >
                                <span>Track</span>
                                <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </div>
                    );
                },
            },
        ],
        []
    );

    return (
        <div className="w-full">
            <AZTable<TOrder | any>
                title="Recent Purchases"
                subtitle="Latest marketplace purchases, shipment tracking, and receipts."
                badgeText={orders.length > 0 ? orders.length : undefined}
                icon={<ShoppingBag className="w-5 h-5 text-amber-400" />}
                data={filteredOrders}
                columns={columns}
                keyExtractor={(order, idx) => order._id || String(idx)}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="Search purchases by order #, merchant, status..."
                headerActions={
                    <Link
                        href="/customer/orders"
                        className="btn btn-xs sm:btn-sm gap-1 text-amber-400 hover:bg-amber-400 hover:text-slate-950 font-bold border border-amber-400/30 rounded-xl transition-all"
                    >
                        <span>View All Orders</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                }
                emptyTitle="No Orders Placed Yet"
                emptyMessage="You have not placed any orders yet. Discover trending deals and products from top vendors across AmarZone."
                emptyIcon={<Package className="w-6 h-6 text-amber-400" />}
                emptyAction={
                    <Link
                        href="/products"
                        className="btn btn-xs btn-outline border-amber-400/40 text-amber-300 hover:bg-amber-400 hover:text-slate-950 rounded-lg font-bold"
                    >
                        Explore Marketplace
                    </Link>
                }
                isLoading={isLoading}
                className="my-0"
            />
        </div>
    );
};

export default CustomerRecentOrders;
