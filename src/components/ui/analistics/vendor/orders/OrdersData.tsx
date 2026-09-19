"use client";

import React, { useState, useMemo } from "react";
import {
  Package,
  Edit2,
  PlusCircle,
  X,
  Copy,
  Check,
  User,
  Store,
  Calendar,
  Truck,
  CreditCard,
  FileText,
  Clock,
  ExternalLink,
  Receipt,
  Mail,
  Hash,
  RefreshCw,
  Eye,
} from "lucide-react";
import { TColumn } from "@/src/types/table";
import AZTable from "../../../shared/AZTable";
import { useMyOrdersQuery, useSingleOrderQuery } from "@/src/redux/features/order/orderApi";
import Modal from "../../../shared/Modal";
import UpdateOrderForm from "./UpdateOrder";
import { toast } from "react-toastify";

export type TOrderStatusKey = "PENDING" | "UNSHIPPED" | "SHIPPED" | "DELIVERED" | "CANCELED" | "ALL";

export interface TPendingOrderRecord {
  id: string;
  orderNo: string;
  orderDate: {
    relative: string;
    date: string;
    time: string;
  };
  fulfillmentMethod: string;
  salesChannel: string;
  product: {
    title: string;
    thumbnail: string;
    asin: string;
    sku: string;
    quantity: number;
    subtotal: number;
  };
  orderType: string;
  status: "Pending" | "Unshipped" | "Shipped" | "Cancelled" | "Delivered" | "In Transit" | "Out of Delivery" | "Refunded";
  statusSubtext: string;
}

interface OrdersDataProps {
  initialStatus?: TOrderStatusKey;
  activeStatus?: TOrderStatusKey;
  onStatusChange?: (status: TOrderStatusKey) => void;
}

const LIMIT = 10;

const OrdersData: React.FC<OrdersDataProps> = ({
  initialStatus = "PENDING",
  activeStatus: controlledStatus,
  onStatusChange,
}) => {
  const [internalStatus, setInternalStatus] = useState<TOrderStatusKey>(initialStatus);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TPendingOrderRecord | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsOrderId, setDetailsOrderId] = useState<string | null>(null);

  const activeStatus = controlledStatus !== undefined ? controlledStatus : internalStatus;

  const handleStatusSelect = (status: TOrderStatusKey) => {
    if (controlledStatus === undefined) {
      setInternalStatus(status);
    }
    onStatusChange?.(status);
    setPage(1);
  };

  // Queries /orders/my-orders
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyOrdersQuery(
    {
      status: activeStatus === "ALL" ? undefined : activeStatus === "CANCELED" ? "CANCELLED" : activeStatus,
      searchTerm: searchTerm.trim() || undefined,
      page,
      limit: LIMIT,
    },
    { refetchOnMountOrArgChange: true }
  );

  // Process data from API or baseline
  const ordersList = useMemo<TPendingOrderRecord[]>(() => {
    const rawOrders = apiResponse?.data;
    if (Array.isArray(rawOrders)) {
      if (rawOrders.length === 0 && !isLoading) {
        return [];
      }
      return rawOrders.map((ord: any) => {
        const firstItem = ord.products?.[0];
        const prodObj = firstItem?.variant?.product || firstItem?.product;
        const variantObj = firstItem?.variant;

        const createdDate = ord.createdAt ? new Date(ord.createdAt) : new Date();
        const diffMinutes = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60));
        const relativeTime =
          diffMinutes < 60
            ? `${diffMinutes || 1} minutes ago`
            : diffMinutes < 1440
              ? `${Math.floor(diffMinutes / 60)} hours ago`
              : `${Math.floor(diffMinutes / 1440)} days ago`;

        const upperStatus = ord.status?.toUpperCase() || "PENDING";

        // Map server status directly — no client-side overrides
        const statusMap: Record<string, { display: TPendingOrderRecord["status"]; subtext: string }> = {
          PENDING: { display: "Pending", subtext: "Awaiting payment verification" },
          UNSHIPPED: { display: "Unshipped", subtext: "Ready to confirm & ship" },
          SHIPPED: { display: "Shipped", subtext: "Carrier dispatch confirmed" },
          IN_TRANSIT: { display: "In Transit", subtext: "Package in transit" },
          OUT_OF_DELIVERY: { display: "Out of Delivery", subtext: "Out for delivery" },
          DELIVERED: { display: "Delivered", subtext: "Successfully delivered" },
          CANCELLED: { display: "Cancelled", subtext: "Order voided" },
          CANCELED: { display: "Cancelled", subtext: "Order voided" },
          REFUNDED: { display: "Refunded", subtext: "Payment refunded" },
        };

        const mapped = statusMap[upperStatus] || { display: "Pending", subtext: "Awaiting processing" };

        return {
          id: ord._id,
          orderNo: ord.orderNo || `114-${ord._id.slice(-7)}`,
          orderDate: {
            relative: relativeTime,
            date: createdDate.toLocaleDateString("en-US"),
            time: createdDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) + " PST",
          },
          fulfillmentMethod: "Seller",
          salesChannel: "Amarzone.com",
          product: {
            title: prodObj?.title || variantObj?.title || "Order Item",
            thumbnail:
              prodObj?.thumbnail ||
              variantObj?.thumbnail ||
              (variantObj?.images && variantObj.images[0]) ||
              "",
            asin: variantObj?.asin || "",
            sku: variantObj?.sku || "",
            quantity: firstItem?.quantity || ord.totalQuantity || 1,
            subtotal: ord.vendorAmount || ord.totalPrice || firstItem?.price || 0,
          },
          orderType: "Standard",
          status: mapped.display,
          statusSubtext: mapped.subtext,
        };
      });
    }

    return [];
  }, [apiResponse]);


  // Column Definitions matching DepartmentsData pattern
  const columns: TColumn<TPendingOrderRecord>[] = [
    {
      header: "Order Date",
      accessor: (order) => (
        <div className="space-y-0.5">
          <div className="font-extrabold text-white text-xs">{order.orderDate.relative}</div>
          <div className="text-[11px] text-slate-300 font-medium">{order.orderDate.date}</div>
          <div className="text-[10px] text-slate-400">{order.orderDate.time}</div>
        </div>
      ),
    },
    {
      header: "Order Details",
      accessor: (order) => (
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => {
              setDetailsOrderId(order.id);
              setIsDetailsModalOpen(true);
            }}
            className="font-black text-xs text-amber-400 hover:text-amber-300 hover:underline tracking-tight text-left cursor-pointer transition-colors"
          >
            {order.orderNo}
          </button>
          <div className="text-[11px] text-slate-300">
            Fulfillment: <span className="font-semibold text-white">{order.fulfillmentMethod}</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Channel: <span className="text-slate-300 font-medium">{order.salesChannel}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Image",
      align: "center",
      accessor: (order) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/15 bg-slate-900 mx-auto shrink-0 shadow-sm">
          {order.product.thumbnail ? (
            <img
              src={order.product.thumbnail}
              alt={order.product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              <Package className="w-5 h-5" />
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Product Name",
      accessor: (order) => (
        <div className="space-y-1 max-w-sm">
          <div
            onClick={() => {
              setDetailsOrderId(order.id);
              setIsDetailsModalOpen(true);
            }}
            className="font-bold text-xs text-white hover:text-amber-400 line-clamp-2 transition-colors leading-snug cursor-pointer"
          >
            {order.product.title}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-400 pt-0.5">
            <div>
              ASIN: <span className="font-semibold text-slate-200">{order.product.asin}</span>
            </div>
            <div>
              SKU: <span className="font-semibold text-slate-200">{order.product.sku}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <div>
              Qty: <span className="font-extrabold text-white">{order.product.quantity}</span>
            </div>
            <span className="text-white/20">•</span>
            <div>
              Subtotal:{" "}
              <span className="font-extrabold text-amber-400">
                ${order.product.subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Order Type",
      accessor: (order) => (
        <span className="text-xs text-slate-200 font-medium">{order.orderType}</span>
      ),
    },
    {
      header: "Order Status",
      accessor: (order) => {
        const s = order.status.toUpperCase().replace(/ /g, "_");
        const badgeMap: Record<string, string> = {
          PENDING: "bg-amber-400 text-slate-950",
          UNSHIPPED: "bg-sky-400 text-slate-950",
          SHIPPED: "bg-indigo-500 text-white",
          IN_TRANSIT: "bg-violet-500 text-white",
          OUT_OF_DELIVERY: "bg-orange-500 text-white",
          DELIVERED: "bg-emerald-500 text-slate-950",
          CANCELLED: "bg-rose-500 text-white",
          CANCELED: "bg-rose-500 text-white",
          REFUNDED: "bg-slate-400 text-slate-950",
        };
        const badgeClass = badgeMap[s] || "bg-amber-400 text-slate-950";

        return (
          <div className="space-y-1">
            <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider shadow-sm ${badgeClass}`}>
              {order.status}
            </span>
            <div className="text-[11px] text-cyan-400 flex items-center gap-0.5 font-medium">
              <span>{order.statusSubtext}</span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Actions",
      align: "right",
      accessor: (order) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => {
              setDetailsOrderId(order.id);
              setIsDetailsModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-cyan-400 gap-1 hover:bg-cyan-400/10 border border-cyan-400/20 hover:border-cyan-400/40 rounded-lg cursor-pointer transition-all"
          >
            <Eye className="w-3 h-3" />
            <span>View</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedOrder(order);
              setIsEditModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-amber-400 gap-1 hover:bg-amber-400/10 border border-amber-400/20 hover:border-amber-400/40 rounded-lg cursor-pointer transition-all"
          >
            <Edit2 className="w-3 h-3" />
            <span>Manage</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Main Orders Directory Table Container matching DepartmentsData exact classes */}
      <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl [&_.input]:bg-[#120824] [&_.input]:border-white/15 [&_.input]:text-slate-200 [&_.input]:placeholder:text-slate-500 [&_.input:focus]:border-amber-400 [&_thead_th]:text-slate-300 [&_thead_th]:bg-white/[0.03] [&_thead_th]:border-b [&_thead_th]:border-white/10 [&_tbody_tr]:border-b [&_tbody_tr]:border-white/5 [&_tbody_tr:hover]:bg-white/[0.05] [&_tbody_tr]:text-slate-200 [&_.border-base-200]:!border-white/10 [&_.border-base-300]:!border-white/10 [&_.card-title]:!text-white [&_p]:!text-slate-300 [&_.select]:bg-[#120824] [&_.select]:border-white/15 [&_.select]:text-slate-200 [&_.select]:focus:border-amber-400 [&_.join-item.btn-outline]:bg-white/5 [&_.join-item.btn-outline]:border-white/15 [&_.join-item.btn-outline]:text-slate-200 [&_.join-item.btn-outline:hover]:bg-white/10 [&_.join-item.btn-primary]:bg-amber-400 [&_.join-item.btn-primary]:text-slate-950 [&_.join-item.btn-primary]:border-amber-400 [&_strong]:text-amber-400 [&_.btn-square.btn-ghost]:border-white/15 [&_.btn-square.btn-ghost]:bg-white/5 [&_.btn-square.btn-ghost]:text-amber-400 [&_.badge-primary]:bg-amber-400 [&_.badge-primary]:text-slate-950 [&_.badge-primary]:border-none">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

        {/* Ambient background glow orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10">
          {/* Status Tabs Filter within Table Header */}
          <div className="px-6 pt-5 pb-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/10">
            {[
              { key: "PENDING" as TOrderStatusKey, label: "Pending" },
              { key: "UNSHIPPED" as TOrderStatusKey, label: "Unshipped" },
              { key: "SHIPPED" as TOrderStatusKey, label: "Shipped" },
              { key: "DELIVERED" as TOrderStatusKey, label: "Delivered" },
              { key: "CANCELED" as TOrderStatusKey, label: "Canceled" },
              { key: "ALL" as TOrderStatusKey, label: "All Orders" },
            ].map((tab) => {
              const isActive = activeStatus === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleStatusSelect(tab.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${isActive
                    ? "bg-amber-400 text-slate-950 shadow-md font-black"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <AZTable
            title="Orders Directory"
            subtitle="Manage customer orders, verify payments, track carrier dispatches, and review fulfillment."
            badgeText={apiResponse?.meta?.total ?? ordersList.length}
            icon={<Package className="w-5 h-5 text-amber-400" />}
            className="!bg-transparent !shadow-none !border-none text-slate-100"
            data={ordersList}
            columns={columns}
            keyExtractor={(order) => order.id}
            searchValue={searchTerm}
            onSearchChange={(v) => {
              setSearchTerm(v);
              setPage(1);
            }}
            searchPlaceholder="Search by Order ID, ASIN, SKU, or Product title..."
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
            isLoading={isLoading}
            emptyMessage={`There are currently no orders under the "${activeStatus}" filter.`}
            emptyIcon={<Package className="w-8 h-8 text-amber-400" />}
            pagination={{
              page,
              limit: LIMIT,
              total: apiResponse?.meta?.total ?? ordersList.length,
              onPageChange: setPage,
            }}
          />
        </div>
      </div>

      {/* REUSABLE UPDATE ORDER MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedOrder(null);
        }}
        size="md"
        className="!bg-[#170d2f] !border-white/10 text-slate-100 shadow-2xl relative overflow-hidden rounded-3xl"
      >
        {selectedOrder && (
          <UpdateOrderForm
            order={selectedOrder}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setSelectedOrder(null);
              refetch();
            }}
          />
        )}
      </Modal>

      {/* ORDER DETAILS MODAL — fetches real-time status from server */}
      {isDetailsModalOpen && detailsOrderId && (
        <OrderDetailsView
          orderId={detailsOrderId}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setDetailsOrderId(null);
          }}
        />
      )}
    </>
  );
};

/* ──────────────────────────────────────────────────────────────────────────────
   OrderDetailsView — Fetches fresh order data from the server via
   useSingleOrderQuery so the displayed status always reflects the real-time
   server-side order_status (source of truth).
   ────────────────────────────────────────────────────────────────────────────── */

interface OrderDetailsViewProps {
  orderId: string;
  onClose: () => void;
}

const OrderDetailsView: React.FC<OrderDetailsViewProps> = ({ orderId, onClose }) => {
  const { data: response, isLoading, isError, refetch } = useSingleOrderQuery(orderId, {
    refetchOnMountOrArgChange: true,
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const order = response?.data;

  const handleCopy = (text: string, label: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 1800);
      toast.success(`Copied ${label}: ${text}`, {
        position: "bottom-right",
        autoClose: 1600,
      });
    }
  };

  const getOrderStatusBadge = (status: string) => {
    const s = status?.toUpperCase();
    const map: Record<string, string> = {
      PENDING: "bg-amber-400 text-slate-950 font-black",
      UNSHIPPED: "bg-sky-400 text-slate-950 font-black",
      SHIPPED: "bg-indigo-500 text-white font-bold",
      IN_TRANSIT: "bg-violet-500 text-white font-bold",
      OUT_OF_DELIVERY: "bg-orange-500 text-white font-bold",
      DELIVERED: "bg-emerald-500 text-slate-950 font-black",
      CANCELLED: "bg-rose-500 text-white font-bold",
      REFUNDED: "bg-slate-400 text-slate-950 font-bold",
    };
    return map[s] || "border border-amber-400/40 text-amber-400 font-bold";
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return "bg-emerald-500 text-slate-950 font-black";
      case "REFUNDED":
        return "bg-amber-400 text-slate-950 font-bold";
      default:
        return "bg-rose-500 text-white font-bold";
    }
  };

  const formattedCreatedDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const shippedDateStr = order?.shippedDate
    ? `${new Date(order.shippedDate.from).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(order.shippedDate.to).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : "N/A";

  const deliveryDateStr = order?.deliveryDate
    ? `${new Date(order.deliveryDate.from).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(order.deliveryDate.to).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : "N/A";

  // Order lifecycle steps for the status tracker
  const STATUS_STEPS = [
    { key: "PENDING", label: "Order Placed" },
    { key: "UNSHIPPED", label: "Confirmed" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "IN_TRANSIT", label: "In Transit" },
    { key: "OUT_OF_DELIVERY", label: "Out for Delivery" },
    { key: "DELIVERED", label: "Delivered" },
  ];

  const currentStepIndex = order
    ? STATUS_STEPS.findIndex((s) => s.key === order.status?.toUpperCase())
    : -1;

  const isCancelledOrRefunded =
    order?.status?.toUpperCase() === "CANCELLED" || order?.status?.toUpperCase() === "REFUNDED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-[#170d2f] border border-white/10 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative text-slate-100">
        {/* Top accent border */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Loading / Error State */}
        {isLoading ? (
          <div className="relative z-10 flex flex-col items-center justify-center py-32 gap-4">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="text-sm text-slate-400">Loading order details from server…</span>
          </div>
        ) : isError || !order ? (
          <div className="relative z-10 flex flex-col items-center justify-center py-32 gap-4">
            <Package className="w-10 h-10 text-rose-400" />
            <span className="text-sm text-slate-300">Failed to load order details.</span>
            <button
              type="button"
              onClick={() => refetch()}
              className="btn btn-sm bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl border-none"
            >
              Retry
            </button>
            <button type="button" onClick={onClose} className="text-xs text-slate-400 hover:text-white mt-1">
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="relative z-10 flex items-center justify-between p-5 sm:p-6 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-base sm:text-lg font-black text-amber-400">
                    #{order.orderNo}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.orderNo, "Order #")}
                    className="text-slate-400 hover:text-white cursor-pointer"
                    title="Copy Order #"
                  >
                    {copiedField === "Order #" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* SERVER-SIDE STATUS — source of truth */}
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider shadow-sm ${getOrderStatusBadge(order.status)}`}>
                    {order.status}
                  </span>

                  <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider shadow-sm ${getPaymentStatusBadge(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Placed on {formattedCreatedDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => refetch()}
                  title="Refresh order status"
                  className="btn btn-sm btn-circle btn-ghost bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-sm btn-circle btn-ghost bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="relative z-10 overflow-y-auto p-5 sm:p-6 space-y-6 flex-1 text-xs">
              {/* Real-Time Status Tracker */}
              {!isCancelledOrRefunded && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span>Order Status Tracker</span>
                    <span className="text-[10px] text-slate-400 font-normal ml-2">(Real-time from server)</span>
                  </h4>
                  <div className="flex items-center gap-0 w-full">
                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      return (
                        <React.Fragment key={step.key}>
                          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                                isCurrent
                                  ? "bg-emerald-400 border-emerald-400 text-slate-950 ring-4 ring-emerald-400/20"
                                  : isCompleted
                                  ? "bg-emerald-500/80 border-emerald-500 text-white"
                                  : "bg-white/5 border-white/15 text-slate-500"
                              }`}
                            >
                              {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[9px] sm:text-[10px] font-bold text-center leading-tight max-w-[60px] ${
                                isCurrent ? "text-emerald-400" : isCompleted ? "text-slate-300" : "text-slate-500"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                          {idx < STATUS_STEPS.length - 1 && (
                            <div
                              className={`flex-1 h-0.5 mx-1 rounded ${
                                idx < currentStepIndex ? "bg-emerald-500/60" : "bg-white/10"
                              }`}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cancelled / Refunded Banner */}
              {isCancelledOrRefunded && (
                <div className={`p-4 rounded-2xl border space-y-1 ${
                  order.status?.toUpperCase() === "CANCELLED"
                    ? "bg-rose-500/10 border-rose-500/30"
                    : "bg-amber-400/10 border-amber-400/30"
                }`}>
                  <div className={`flex items-center gap-2 font-bold text-sm ${
                    order.status?.toUpperCase() === "CANCELLED" ? "text-rose-400" : "text-amber-400"
                  }`}>
                    <Package className="w-4 h-4" />
                    <span>Order {order.status}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    This order has been {order.status?.toLowerCase()}. No further status updates are expected.
                  </p>
                </div>
              )}

              {/* Customer & Vendor Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <User className="w-4 h-4" />
                    <span>Customer Details</span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div className="font-semibold text-white text-sm">
                      {order.customer?.name || "Customer Account"}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{order.customer?.email || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                    <Store className="w-4 h-4" />
                    <span>Vendor Details</span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div className="font-semibold text-white text-sm">
                      {order.vendor?.name || "Marketplace Vendor"}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{order.vendor?.email || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-amber-400" />
                  <span>Purchased Items ({order.products?.length || 0})</span>
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
                  <table className="table w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400">
                        <th className="py-2.5 px-3">Item / Product</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Unit Price</th>
                        <th className="py-2.5 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products && order.products.length > 0 ? (
                        order.products.map((item: any, idx: number) => {
                          const variantObj = typeof item.variant === "object" ? item.variant : null;
                          const productObj = variantObj?.product;
                          const title =
                            productObj?.title ||
                            (variantObj?.sku ? `Variant ${variantObj.sku}` : `Product Variant #${idx + 1}`);
                          const thumbnail = productObj?.thumbnail || variantObj?.thumbnail;
                          const itemPrice = item.price || 0;
                          const lineTotal = itemPrice * (item.quantity || 1);

                          return (
                            <tr key={idx} className="border-b border-white/5 last:border-none">
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-3">
                                  {thumbnail ? (
                                    <img
                                      src={thumbnail}
                                      alt={title}
                                      className="w-10 h-10 object-contain rounded-lg bg-white/10 p-0.5 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                                      <Package className="w-4 h-4" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-semibold text-white max-w-sm truncate" title={title}>
                                      {title}
                                    </div>
                                    {variantObj?.sku && (
                                      <div className="text-[10px] text-slate-400 font-mono">
                                        SKU: {variantObj.sku}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-center font-bold text-white">
                                {item.quantity}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                                ${itemPrice.toFixed(2)}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400">
                                ${lineTotal.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-4 text-slate-400">
                            No product lines recorded for this order.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financials */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  <span>Financial Summary</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Items</span>
                    <div className="text-base font-black text-white mt-0.5">{order.totalQuantity}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Order Total</span>
                    <div className="text-base font-black text-emerald-400 mt-0.5">
                      ${order.totalPrice?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Tax</span>
                    <div className="text-base font-black text-amber-400 mt-0.5">
                      ${order.tax?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Vendor Payout</span>
                    <div className="text-base font-black text-purple-300 mt-0.5">
                      ${order.vendorAmount?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping & Delivery Schedules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Estimated Shipping Window</span>
                  </div>
                  <div className="text-white font-medium pl-5">{shippedDateStr}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Estimated Delivery Window</span>
                  </div>
                  <div className="text-white font-medium pl-5">{deliveryDateStr}</div>
                </div>
              </div>

              {/* Tracking Details */}
              {order.tracking && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                      <Truck className="w-4 h-4" />
                      <span>Courier & Tracking</span>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-400/20 text-cyan-300">
                      {order.tracking.courierName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 font-mono text-white text-xs">
                    <span>Tracking Number:</span>
                    <span className="font-bold text-amber-300">{order.tracking.trackingNumber}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(order.tracking?.trackingNumber || "", "Tracking Number")}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {order.tracking.notes && (
                    <div className="text-slate-400 text-[11px] pt-1 italic">
                      Notes: {order.tracking.notes}
                    </div>
                  )}
                </div>
              )}

              {/* Payment & Invoice */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Transaction Reference</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-slate-200">
                    <span className="truncate max-w-xs">{order.transactionId || "No transaction reference"}</span>
                    {order.transactionId && (
                      <button
                        type="button"
                        onClick={() => handleCopy(order.transactionId, "Transaction ID")}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                {order.invoiceUrl ? (
                  <a
                    href={order.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm gap-2 font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl border-none shadow-sm shrink-0"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Invoice</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">Invoice PDF pending generation</span>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="relative z-10 flex items-center justify-end p-4 border-t border-white/10 bg-white/[0.02]">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-sm btn-ghost text-slate-300 hover:text-white font-bold rounded-xl border border-white/10"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersData;
