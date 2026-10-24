'use client';

import { useState } from "react";
import {
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    Edit2,
    Eye,
    Mail,
    Package,
    RotateCcw,
    ShoppingBag,
    Trash2,
    Truck,
    User,
    XCircle,
    Phone,
} from "lucide-react";
import Image from "next/image";
import { TOrder } from "@/types/order";
import { TColumn } from "@/types/table";
import AZTable from "@/components/shared/AZTable";
import AZModal from "@/components/shared/AZModal";
import AZSelect from "@/components/shared/form/AZSelect";
import { TMeta } from "@/types/global";

export interface VendorOrdersTableProps {
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
    onUpdateStatus?: (order: TOrder, newStatus: string) => void;
    onCancelOrder?: (orderId: string, orderNo: string) => void;
}

const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "UNSHIPPED", label: "Unshipped / Packaging" },
    { value: "SHIPPED", label: "Shipped / Dispatched" },
    { value: "IN_TRANSIT", label: "In Transit" },
    { value: "OUT_OF_DELIVERY", label: "Out For Delivery" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "REFUNDED", label: "Refunded" },
];

const VendorOrdersTable = ({
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
    onUpdateStatus,
    onCancelOrder,
}: VendorOrdersTableProps) => {
    const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
    const [statusEditOrder, setStatusEditOrder] = useState<TOrder | null>(null);
    const [newStatus, setNewStatus] = useState<string>("");

    const handleView = (order: TOrder) => {
        if (onViewOrder) {
            onViewOrder(order);
        } else {
            setSelectedOrder(order);
        }
    };

    const handleOpenStatusEdit = (order: TOrder) => {
        setStatusEditOrder(order);
        setNewStatus(order.status || "PENDING");
    };

    const handleSaveStatus = () => {
        if (statusEditOrder && newStatus && onUpdateStatus) {
            onUpdateStatus(statusEditOrder, newStatus);
            setStatusEditOrder(null);
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
                        {normalized || "PENDING"}
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
            header: "Customer",
            accessor: (order) => {
                const customer =
                    typeof order.customer === "object" ? order.customer : null;
                const name = customer?.name || "Customer";
                const email = customer?.email || "No email linked";

                return (
                    <div className="space-y-0.5">
                        <div className="font-bold text-sm text-white flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                            <span>{name}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate max-w-[150px]">{email}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Your Earnings",
            accessor: (order) => {
                const gross = Number(order.totalPrice || 0);
                const comm = Number(order.commission || 0);
                const netEarnings = Number(order.vendorAmount ?? (gross - comm));

                return (
                    <div className="space-y-0.5">
                        <div className="font-black text-sm text-emerald-400 flex items-center gap-0.5">
                            <DollarSign className="w-3.5 h-3.5 shrink-0" />
                            <span>{netEarnings.toFixed(2)}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                            Gross: ${gross.toFixed(2)}
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
            header: "Fulfillment Status",
            accessor: (order) => getFulfillmentBadge(order.status),
        },
        {
            header: "Placed Date",
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

                        {/* Quick Edit Status */}
                        {onUpdateStatus && (
                            <button
                                onClick={() => handleOpenStatusEdit(order)}
                                title="Update Fulfillment Status"
                                className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-amber-400/10 text-slate-300 hover:text-amber-400 transition-all duration-200 cursor-pointer"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                            </button>
                        )}

                        {/* Cancel Order */}
                        {onCancelOrder && (
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
                title="Store Orders"
                subtitle="Live merchant orders, packaging status, dispatch tracking, and net payout earnings."
                badgeText={totalCount}
                icon={<ShoppingBag className="w-5 h-5 text-amber-400" />}
                data={orders}
                columns={columns}
                keyExtractor={(order: TOrder) => order._id}
                isLoading={isLoading}
                isError={isError}
                errorMessage={
                    (error as any)?.data?.message || "Failed to load store orders."
                }
                onRetry={refetch}
                onRefresh={refetch}
                isRefreshing={isFetching}
                searchPlaceholder="Search orders by order #, customer, product..."
                emptyTitle="No Store Orders Found"
                emptyMessage="No merchant orders match your active filters or search criteria."
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
                        : "Order summary and item breakdown"
                }
                icon={<ShoppingBag className="w-5 h-5 text-amber-400" />}
                size="lg"
            >
                {selectedOrder && (
                    <div className="space-y-4 pt-1">
                        {/* Status Highlights */}
                        <div className="p-3.5 rounded-2xl bg-[#100722] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400 font-medium">Fulfillment Status:</span>
                                {getFulfillmentBadge(selectedOrder.status)}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400 font-medium">Payment Status:</span>
                                {getPaymentBadge(selectedOrder.paymentStatus)}
                            </div>
                        </div>

                        {/* Customer Info Card */}
                        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5 text-xs">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                                <User className="w-3 h-3" />
                                Customer Contact Information
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                <div>
                                    <span className="text-[11px] text-slate-400">Recipient Name:</span>
                                    <p className="font-bold text-white text-xs truncate">
                                        {(typeof selectedOrder.customer === "object" && selectedOrder.customer?.name) || "Customer"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400">Email Address:</span>
                                    <p className="text-[11px] text-slate-300 truncate flex items-center gap-1 font-medium">
                                        <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                                        {(typeof selectedOrder.customer === "object" && selectedOrder.customer?.email) || "N/A"}
                                    </p>
                                </div>
                                {typeof selectedOrder.customer === "object" && (selectedOrder.customer as any)?.phone && (
                                    <div className="sm:col-span-2">
                                        <span className="text-[11px] text-slate-400">Phone:</span>
                                        <p className="text-[11px] text-slate-300 flex items-center gap-1 font-medium">
                                            <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                                            {(selectedOrder.customer as any).phone}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Ordered Items List */}
                        <div className="space-y-2">
                            <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <Package className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Ordered Products ({selectedOrder.products?.length || 0})</span>
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

                        {/* Tracking Information (if available) */}
                        {selectedOrder.tracking && (
                            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs space-y-1">
                                <span className="text-sky-400 font-bold flex items-center gap-1.5">
                                    <Truck className="w-3.5 h-3.5" />
                                    Courier Logistics
                                </span>
                                <div className="flex flex-wrap items-center gap-3 pt-1 text-slate-200">
                                    <span><strong>Carrier:</strong> {selectedOrder.tracking.courierName || "Standard"}</span>
                                    <span><strong>Tracking #:</strong> {selectedOrder.tracking.trackingNumber}</span>
                                </div>
                            </div>
                        )}

                        {/* Financial Breakdown */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-900/80 to-slate-900/90 border border-emerald-500/30 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between font-bold text-slate-300">
                                <span>Order Gross Total:</span>
                                <span>${Number(selectedOrder.totalPrice || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400">
                                <span>Platform Fee / Commission:</span>
                                <span>-${Number(selectedOrder.commission || 0).toFixed(2)}</span>
                            </div>
                            <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-sm">
                                <span className="font-extrabold text-white flex items-center gap-1">
                                    <DollarSign className="w-4 h-4 text-emerald-400" />
                                    Net Vendor Payout:
                                </span>
                                <span className="font-black text-emerald-400 text-base">
                                    ${Number(selectedOrder.vendorAmount ?? (Number(selectedOrder.totalPrice || 0) - Number(selectedOrder.commission || 0))).toFixed(2)}
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

            {/* Quick Status Update Modal */}
            <AZModal
                isOpen={Boolean(statusEditOrder)}
                onClose={() => setStatusEditOrder(null)}
                title={
                    <div className="flex items-center gap-2">
                        <span>Update Order Status</span>
                        {statusEditOrder && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 text-[10px] font-black uppercase tracking-wider font-mono">
                                {statusEditOrder.orderNo || `#ORD-${statusEditOrder._id.slice(-6).toUpperCase()}`}
                            </span>
                        )}
                    </div>
                }
                description="Change order fulfillment status in the delivery pipeline"
                icon={<Edit2 className="w-5 h-5 text-amber-400" />}
                size="md"
            >
                {statusEditOrder && (
                    <div className="space-y-4 pt-1">
                        <AZSelect
                            name="newStatusSelect"
                            label="Fulfillment Status"
                            placeholder="Select status..."
                            options={statusOptions}
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        />

                        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => setStatusEditOrder(null)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSaveStatus}
                                disabled={!newStatus || newStatus === statusEditOrder.status}
                                className="px-5 py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 border border-amber-400/40 shadow-lg shadow-amber-400/20 transition-all cursor-pointer disabled:opacity-50"
                            >
                                Save Status
                            </button>
                        </div>
                    </div>
                )}
            </AZModal>
        </div>
    );
};

export default VendorOrdersTable;
