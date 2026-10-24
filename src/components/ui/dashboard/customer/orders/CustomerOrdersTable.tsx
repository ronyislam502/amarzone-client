'use client';

import { useState } from "react";
import {
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    Eye,
    Mail,
    Package,
    RotateCcw,
    ShoppingBag,
    Store,
    Trash2,
    Truck,
    XCircle,
} from "lucide-react";
import Image from "next/image";
import { TOrder } from "@/types/order";
import { TColumn } from "@/types/table";
import AZTable from "@/components/shared/AZTable";
import AZModal from "@/components/shared/AZModal";
import { TMeta } from "@/types/global";

export interface CustomerOrdersTableProps {
    orders?: TOrder[];
    meta?: TMeta;
    isLoading?: boolean;
    isError?: boolean;
    error?: unknown;
    refetch?: () => void;
    isFetching?: boolean;
    page?: number;
    limit?: number;
    onPageChange?: (page: number) => void;
    onViewOrder?: (order: TOrder) => void;
    onCancelOrder?: (orderId: string, orderNo: string) => void;
}

const CustomerOrdersTable = ({
    orders = [],
    meta,
    isLoading = false,
    isError = false,
    error,
    refetch,
    isFetching = false,
    page = 1,
    limit = 10,
    onPageChange,
    onViewOrder,
    onCancelOrder,
}: CustomerOrdersTableProps) => {
    const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);

    const handleView = (order: TOrder) => {
        if (onViewOrder) {
            onViewOrder(order);
        } else {
            setSelectedOrder(order);
        }
    };

    const getFulfillmentBadge = (status: string) => {
        const normalized = (status || "").toUpperCase();
        switch (normalized) {
            case "DELIVERED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        Delivered
                    </span>
                );
            case "SHIPPED":
            case "IN_TRANSIT":
            case "OUT_OF_DELIVERY":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm">
                        <Truck className="w-3 h-3" />
                        {normalized.replace(/_/g, " ")}
                    </span>
                );
            case "CANCELLED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm">
                        <XCircle className="w-3 h-3" />
                        Cancelled
                    </span>
                );
            case "REFUNDED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm">
                        <RotateCcw className="w-3 h-3" />
                        Refunded
                    </span>
                );
            case "PENDING":
            case "UNSHIPPED":
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm">
                        <Clock className="w-3 h-3" />
                        {normalized === "UNSHIPPED" ? "Preparing" : (normalized || "PENDING")}
                    </span>
                );
        }
    };

    const getPaymentBadge = (status: string) => {
        const normalized = (status || "").toUpperCase();
        switch (normalized) {
            case "PAID":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        Paid
                    </span>
                );
            case "UNPAID":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm">
                        <XCircle className="w-3 h-3" />
                        Unpaid
                    </span>
                );
            case "REFUNDED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm">
                        <RotateCcw className="w-3 h-3" />
                        Refunded
                    </span>
                );
            case "PENDING":
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-sm">
                        <Clock className="w-3 h-3" />
                        Pending
                    </span>
                );
        }
    };

    const columns: TColumn<TOrder>[] = [
        {
            header: "Order Reference",
            accessor: (order) => {
                const firstProduct = order.products?.[0]?.variant?.product;
                const itemCount = order.totalQuantity || order.products?.length || 1;
                const displayOrderNo = order.orderNo || `#ORD-${order._id.slice(-6).toUpperCase()}`;

                return (
                    <div className="flex items-center gap-3 max-w-sm">
                        <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                            {firstProduct?.thumbnail ? (
                                <Image
                                    src={firstProduct.thumbnail}
                                    alt={firstProduct.title || "Product"}
                                    width={48}
                                    height={48}
                                    unoptimized
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-0.5">
                            <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                                <span>{displayOrderNo}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Package className="w-3 h-3 text-amber-400/80 shrink-0" />
                                <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Seller Store",
            accessor: (order) => {
                const vendor =
                    typeof order.vendor === "object" ? order.vendor : null;
                const vendorName = vendor?.name || "Marketplace Merchant";
                const vendorEmail = vendor?.email || "";

                return (
                    <div className="space-y-0.5">
                        <div className="font-bold text-sm text-white flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>{vendorName}</span>
                        </div>
                        {vendorEmail && (
                            <div className="text-[11px] text-slate-400 truncate max-w-[150px] flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                                <span>{vendorEmail}</span>
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            header: "Total Amount",
            accessor: (order) => {
                const total = Number(order.totalPrice || 0);

                return (
                    <div className="space-y-0.5">
                        <div className="font-black text-sm text-amber-400">
                            ${total.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                            Includes taxes & fees
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Payment",
            accessor: (order) => getPaymentBadge(order.paymentStatus),
        },
        {
            header: "Delivery Status",
            accessor: (order) => getFulfillmentBadge(order.status),
        },
        {
            header: "Order Date",
            accessor: (order) => {
                const dateStr = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })
                    : "N/A";

                return (
                    <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{dateStr}</span>
                    </div>
                );
            },
        },
        {
            header: "Actions",
            accessor: (order) => {
                const displayOrderNo = order.orderNo || `#ORD-${order._id.slice(-6).toUpperCase()}`;
                const canCancel =
                    order.status === "PENDING" || order.status === "UNSHIPPED";

                return (
                    <div className="flex items-center gap-2">
                        {/* Quick View Details */}
                        <button
                            onClick={() => handleView(order)}
                            title="View Order Details"
                            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200 cursor-pointer"
                        >
                            <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Cancel Order (Allowed if pending or unshipped) */}
                        {onCancelOrder && canCancel && (
                            <button
                                onClick={() => onCancelOrder(order._id, displayOrderNo)}
                                title="Cancel Order"
                                className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:border-rose-400/50 hover:bg-rose-500/20 text-rose-400 transition-all duration-200 cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    const totalCount = meta?.total ?? orders.length;

    return (
        <div>
            <AZTable
                title="Purchase History"
                subtitle="Your previous orders, logistics courier tracking, receipts, and order updates."
                badgeText={totalCount}
                icon={<ShoppingBag className="w-5 h-5 text-amber-400" />}
                data={orders}
                columns={columns}
                keyExtractor={(order: TOrder) => order._id}
                isLoading={isLoading}
                isError={isError}
                errorMessage={
                    (error as any)?.data?.message || "Failed to load your purchase history."
                }
                onRetry={refetch}
                onRefresh={refetch}
                isRefreshing={isFetching}
                searchPlaceholder="Search orders by order #, product title..."
                emptyTitle="No Orders Placed Yet"
                emptyMessage="You haven't placed any orders yet or no purchases match your search filters."
                emptyIcon={<ShoppingBag className="w-6 h-6 text-amber-400" />}
                pagination={
                    onPageChange && meta && meta.total > 0
                        ? {
                            page,
                            limit,
                            total: meta.total,
                            onPageChange,
                        }
                        : undefined
                }
            />

            {/* View Order Details Modal */}
            <AZModal
                isOpen={Boolean(selectedOrder)}
                onClose={() => setSelectedOrder(null)}
                title={
                    <div className="flex items-center gap-2">
                        <span>Order Details</span>
                        {selectedOrder && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 text-[10px] font-black uppercase tracking-wider font-mono">
                                {selectedOrder.orderNo || `#ORD-${selectedOrder._id.slice(-6).toUpperCase()}`}
                            </span>
                        )}
                    </div>
                }
                description={
                    selectedOrder?.createdAt
                        ? `Placed on ${new Date(selectedOrder.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}`
                        : "Order summary and receipt breakdown"
                }
                icon={<ShoppingBag className="w-5 h-5 text-amber-400" />}
                size="lg"
            >
                {selectedOrder && (
                    <div className="space-y-4 pt-1">
                        {/* Status Highlights */}
                        <div className="p-3.5 rounded-2xl bg-[#100722] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400 font-medium">Delivery Status:</span>
                                {getFulfillmentBadge(selectedOrder.status)}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400 font-medium">Payment Status:</span>
                                {getPaymentBadge(selectedOrder.paymentStatus)}
                            </div>
                        </div>

                        {/* Merchant Seller Info */}
                        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1 text-xs">
                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                                <Store className="w-3 h-3" />
                                Fulfilled By
                            </span>
                            <p className="font-bold text-white text-xs truncate">
                                {(typeof selectedOrder.vendor === "object" && selectedOrder.vendor?.name) || "Marketplace Merchant"}
                            </p>
                            {typeof selectedOrder.vendor === "object" && selectedOrder.vendor?.email && (
                                <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-slate-500" />
                                    {selectedOrder.vendor.email}
                                </p>
                            )}
                        </div>

                        {/* Ordered Items List */}
                        <div className="space-y-2">
                            <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <Package className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Purchased Products ({selectedOrder.products?.length || 0})</span>
                                </span>
                                <span className="text-[11px] text-slate-400">
                                    Total Units: {selectedOrder.totalQuantity || 1}
                                </span>
                            </div>

                            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                                {selectedOrder.products?.map((item, idx) => {
                                    const prod = item.variant?.product;
                                    const price = Number(item.price ?? item.variant?.price ?? 0);
                                    const qty = Number(item.quantity || 1);

                                    return (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-white/10"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-lg bg-slate-950 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative">
                                                    {prod?.thumbnail ? (
                                                        <Image
                                                            src={prod.thumbnail}
                                                            alt={prod.title || "Item"}
                                                            width={40}
                                                            height={40}
                                                            unoptimized
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="w-4 h-4 text-amber-400" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 space-y-0.5">
                                                    <p className="text-xs font-bold text-white truncate max-w-xs">
                                                        {prod?.title || "Product"}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400">
                                                        ${price.toFixed(2)} × {qty}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-black text-amber-400 shrink-0">
                                                ${(price * qty).toFixed(2)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Courier Tracking */}
                        {selectedOrder.tracking && (
                            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs space-y-1">
                                <span className="text-sky-400 font-bold flex items-center gap-1.5">
                                    <Truck className="w-3.5 h-3.5" />
                                    Shipment Tracking
                                </span>
                                <div className="flex flex-wrap items-center gap-3 pt-1 text-slate-200">
                                    <span><strong>Carrier:</strong> {selectedOrder.tracking.courierName || "Standard Courier"}</span>
                                    <span><strong>Tracking Code:</strong> {selectedOrder.tracking.trackingNumber}</span>
                                </div>
                            </div>
                        )}

                        {/* Financial Summary */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900/80 to-slate-900/90 border border-amber-500/30 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between font-bold text-slate-300">
                                <span>Items Subtotal:</span>
                                <span>${Number(selectedOrder.totalPrice || 0).toFixed(2)}</span>
                            </div>
                            {Number(selectedOrder.tax || 0) > 0 && (
                                <div className="flex items-center justify-between text-slate-400">
                                    <span>Tax:</span>
                                    <span>+${Number(selectedOrder.tax).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-sm">
                                <span className="font-extrabold text-white flex items-center gap-1">
                                    <DollarSign className="w-4 h-4 text-amber-400" />
                                    Total Paid:
                                </span>
                                <span className="font-black text-amber-400 text-base">
                                    ${Number(selectedOrder.totalPrice || 0).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end pt-2 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                )}
            </AZModal>
        </div>
    );
};

export default CustomerOrdersTable;
