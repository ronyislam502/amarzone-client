"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Copy,
  Check,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  FileText,
  Package,
  Store,
  CreditCard,
  Calendar,
  RotateCcw,
  AlertCircle,
  MessageSquare,
  Loader2,
  Star,
} from "lucide-react";
import CreateProductReviewModal from "./CreateProductReviewModal";
import CreateServiceReviewModal from "./CreateServiceReviewModal";
import { useMyOrdersQuery } from "@/src/redux/features/order/orderApi";
import { useCreateConversationMutation } from "@/src/redux/features/chat/chatApi";
import { TOrder } from "@/src/types/order";
import { TColumn } from "@/src/types/table";
import { toast } from "react-toastify";
import AZTable from "@/src/components/ui/shared/AZTable";
import { OrderDetailsModal } from "@/src/components/ui/analistics/admin/orders/OrderDetailsModal";
import CustomerOrdersStats from "./CustomerOrdersStats";
import CustomerOrdersFilterBar, {
  OrderStatusFilter,
  PaymentStatusFilter,
} from "./CustomerOrdersFilterBar";

/* ─── helpers ─────────────────────────────────────────────────── */

const getOrderStatusCell = (status: string) => {
  const s = status?.toUpperCase();
  if (s === "DELIVERED")
    return (
      <span className="badge badge-success text-slate-950 font-black badge-sm gap-1">
        <CheckCircle2 className="w-3 h-3" /> Delivered
      </span>
    );
  if (s === "OUT_OF_DELIVERY")
    return (
      <span className="badge badge-info text-white font-bold badge-sm gap-1">
        <Truck className="w-3 h-3" /> Out for Delivery
      </span>
    );
  if (s === "IN_TRANSIT")
    return (
      <span className="badge badge-secondary text-white font-bold badge-sm gap-1">
        <Truck className="w-3 h-3" /> In Transit
      </span>
    );
  if (s === "SHIPPED")
    return (
      <span className="badge badge-info text-white font-bold badge-sm gap-1">
        <Truck className="w-3 h-3" /> Shipped
      </span>
    );
  if (s === "UNSHIPPED")
    return (
      <span className="badge badge-warning text-slate-950 font-bold badge-sm">
        Unshipped
      </span>
    );
  if (s === "REFUNDED")
    return (
      <span className="badge badge-warning text-slate-950 font-bold badge-sm">
        Refunded
      </span>
    );
  if (s === "PROCESSING" || s === "CONFIRMED")
    return (
      <span className="badge badge-warning text-slate-950 font-bold badge-sm">
        {s}
      </span>
    );
  if (s === "CANCELLED")
    return (
      <span className="badge badge-error text-white font-bold badge-sm">
        Cancelled
      </span>
    );
  return (
    <span className="badge badge-outline border-amber-400/40 text-amber-400 font-bold badge-sm">
      {status || "Pending"}
    </span>
  );
};

const getPaymentStatusCell = (status: string) => {
  const s = status?.toUpperCase();
  if (s === "PAID")
    return (
      <span className="badge badge-success text-slate-950 font-black badge-sm gap-1">
        <Check className="w-3 h-3 stroke-[2.5]" /> Paid
      </span>
    );
  if (s === "REFUNDED")
    return (
      <span className="badge badge-warning text-slate-950 font-bold badge-sm gap-1">
        <RotateCcw className="w-3 h-3" /> Refunded
      </span>
    );
  return (
    <span className="badge badge-error text-white font-bold badge-sm gap-1">
      <AlertCircle className="w-3 h-3" /> Unpaid
    </span>
  );
};

/* ─── component ───────────────────────────────────────────────── */

const LIMIT = 10;

const CustomerOrdersData: React.FC = () => {
  const router = useRouter();
  const [createConversationApi] = useCreateConversationMutation();
  const [messagingOrderId, setMessagingOrderId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatusFilter>("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Review modal state
  const [reviewOrder, setReviewOrder] = useState<TOrder | null>(null);
  const [reviewVariantId, setReviewVariantId] = useState<string | undefined>(undefined);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isServiceReviewModalOpen, setIsServiceReviewModalOpen] = useState(false);

  const handleMessageVendor = async (order: TOrder, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const vendorId =
      typeof order.vendor === "object"
        ? order.vendor?._id
        : order.vendor;

    if (!vendorId) {
      toast.error("Vendor information is unavailable for this order.");
      return;
    }

    try {
      setMessagingOrderId(order._id);
      const res = await createConversationApi({
        participants: [String(vendorId)],
        conversationType: "ORDER",
        order: order._id,
      }).unwrap();

      if (res?.data?._id) {
        toast.success(`Connected to vendor for Order #${order.orderNo}`);
        router.push(`/customer/chat?conversationId=${res.data._id}`);
      } else {
        router.push(`/customer/chat`);
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to start vendor chat"
      );
    } finally {
      setMessagingOrderId(null);
    }
  };

  // Overview stats query
  const { data: statsRes, isLoading: isStatsLoading } = useMyOrdersQuery(
    {
      limit: "all",
    },
    { refetchOnMountOrArgChange: true }
  );
  const summaryOrders: TOrder[] = statsRes?.data || [];

  // Convert sort key to Mongoose sort string for QueryBuilder
  const sortParam =
    sortBy === "oldest"
      ? "createdAt"
      : sortBy === "highest_amount"
        ? "-totalPrice"
        : sortBy === "lowest_amount"
          ? "totalPrice"
          : "-createdAt";

  // Server-side query matching the CategoriesData pattern
  const {
    data: ordersRes,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useMyOrdersQuery(
    {
      search: searchTerm.trim() || undefined,
      page: String(currentPage),
      limit: String(LIMIT),
      status: statusFilter !== "ALL" ? statusFilter : undefined,
      paymentStatus: paymentFilter !== "ALL" ? paymentFilter : undefined,
      sort: sortParam,
    },
    { refetchOnMountOrArgChange: true }
  );

  const orders: TOrder[] = ordersRes?.data || [];
  const meta = ordersRes?.meta;

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setPaymentFilter("ALL");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 1600);
      toast.success(`Copied #${text}`, {
        position: "bottom-right",
        autoClose: 1400,
      });
    }
  };

  /* ─── table columns ───────────────────────────────────────────── */

  const columns: TColumn<TOrder>[] = [
    {
      header: "Order & Date",
      accessor: (order) => {
        const d = order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          : "—";

        return (
          <div className="space-y-0.5 min-w-[130px]">
            <div className="flex items-center gap-1.5 font-mono text-xs font-black text-emerald-400">
              <span>#{order.orderNo || order._id.slice(-8)}</span>
              <button
                type="button"
                onClick={(e) =>
                  handleCopy(order.orderNo || order._id, e)
                }
                title="Copy order number"
                className="text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                {copiedId === (order.orderNo || order._id) ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
              <span>{d}</span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Items",
      accessor: (order) => {
        const firstItem = order.products?.[0];
        const prod = (firstItem as any)?.variant?.product || (firstItem as any)?.product;
        const variant = (firstItem as any)?.variant;
        const totalItems = order.totalQuantity || order.products?.length || 1;
        const extraCount = (order.products?.length || 1) - 1;

        const thumb = prod?.thumbnail || variant?.thumbnail || null;
        const title =
          prod?.title || variant?.title || (firstItem as any)?.title || "Product item";

        return (
          <div className="flex items-center gap-3 min-w-[190px] max-w-[260px]">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
              {thumb ? (
                <img
                  src={thumb}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div
                className="font-bold text-xs text-white truncate hover:text-emerald-400 transition-colors cursor-pointer"
                title={title}
                onClick={() => {
                  setSelectedOrder(order);
                  setIsModalOpen(true);
                }}
              >
                {title}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="badge badge-outline border-white/15 text-slate-300 font-bold badge-xs text-[9px] px-1.5 py-0.5">
                  {totalItems} {totalItems === 1 ? "unit" : "units"}
                </span>
                {extraCount > 0 && (
                  <span className="text-slate-400 text-[10px]">
                    +{extraCount} more
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Vendor",
      accessor: (order) => (
        <div className="space-y-0.5 min-w-[110px] max-w-[150px]">
          <div
            className="font-bold text-xs text-purple-300 flex items-center gap-1 truncate"
            title={order.vendor?.name}
          >
            <Store className="w-3 h-3 text-purple-400 shrink-0" />
            <span className="truncate">
              {order.vendor?.name || "Amarzone Direct"}
            </span>
          </div>
          {order.vendor?.email && (
            <div
              className="text-[10px] text-slate-400 truncate"
              title={order.vendor.email}
            >
              {order.vendor.email}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Total",
      accessor: (order) => (
        <div className="space-y-0.5">
          <div className="font-mono text-xs font-black text-emerald-400">
            ${(order.totalPrice || 0).toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400">
            incl. ${(order.tax || 0).toFixed(2)} tax
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (order) => getOrderStatusCell(order.status || "PENDING"),
    },
    {
      header: "Payment",
      accessor: (order) => getPaymentStatusCell(order.paymentStatus || "PENDING"),
    },
    {
      header: "Actions",
      align: "right",
      accessor: (order) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={(e) => handleMessageVendor(order, e)}
            disabled={messagingOrderId === order._id}
            title="Message Vendor about this order"
            className="btn btn-ghost btn-xs font-bold text-primary gap-1 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 rounded-xl cursor-pointer transition-all"
          >
            {messagingOrderId === order._id ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <MessageSquare className="w-3 h-3" />
            )}
            <span className="hidden xl:inline">Message</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedOrder(order);
              setIsModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-emerald-400 gap-1 hover:bg-emerald-400/10 border border-emerald-400/20 hover:border-emerald-400/40 rounded-xl cursor-pointer transition-all"
          >
            <Eye className="w-3 h-3" />
            <span>Details</span>
          </button>

          {order.status?.toUpperCase() === "DELIVERED" && (
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setReviewOrder(order);
                  const firstV = order.products?.[0]?.variant;
                  const vId = typeof firstV === "object" ? firstV?._id : firstV;
                  setReviewVariantId(vId ? String(vId) : undefined);
                  setIsReviewModalOpen(true);
                }}
                title="Rate and review this product"
                className="btn btn-ghost btn-xs font-bold text-amber-400 gap-1 hover:bg-amber-400/10 border border-amber-400/20 hover:border-amber-400/40 rounded-xl cursor-pointer transition-all px-2"
              >
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="hidden xl:inline">Product</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setReviewOrder(order);
                  setIsServiceReviewModalOpen(true);
                }}
                title="Rate and review the seller's service"
                className="btn btn-ghost btn-xs font-bold text-indigo-400 gap-1 hover:bg-indigo-400/10 border border-indigo-400/20 hover:border-indigo-400/40 rounded-xl cursor-pointer transition-all px-2"
              >
                <Store className="w-3 h-3" />
                <span className="hidden xl:inline">Service</span>
              </button>
            </div>
          )}

          {order.invoiceUrl && (
            <a
              href={order.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View / Download Invoice PDF"
              className="btn btn-ghost btn-xs text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition-all"
            >
              <FileText className="w-3 h-3 text-amber-400" />
            </a>
          )}
        </div>
      ),
    },
  ];

  /* ─── render ─────────────────────────────────────────────────── */
  return (
    <>
      {/* Stats bar — overview statistics */}
      <CustomerOrdersStats orders={summaryOrders} isLoading={isStatsLoading} />

      {/* Main card */}
      <div
        className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl
          [&_.input]:bg-[#120824] [&_.input]:border-white/15 [&_.input]:text-slate-200 [&_.input]:placeholder:text-slate-500 [&_.input:focus]:border-emerald-400
          [&_thead_th]:text-slate-300 [&_thead_th]:bg-white/[0.03] [&_thead_th]:border-b [&_thead_th]:border-white/10
          [&_tbody_tr]:border-b [&_tbody_tr]:border-white/5 [&_tbody_tr:hover]:bg-white/[0.05] [&_tbody_tr]:text-slate-200
          [&_.border-base-200]:!border-white/10 [&_.border-base-300]:!border-white/10
          [&_.card-title]:!text-white [&_p]:!text-slate-300
          [&_.select]:bg-[#120824] [&_.select]:border-white/15 [&_.select]:text-slate-200 [&_.select]:focus:border-emerald-400
          [&_.join-item.btn-outline]:bg-white/5 [&_.join-item.btn-outline]:border-white/15 [&_.join-item.btn-outline]:text-slate-200 [&_.join-item.btn-outline:hover]:bg-white/10
          [&_.join-item.btn-primary]:bg-emerald-400 [&_.join-item.btn-primary]:text-slate-950 [&_.join-item.btn-primary]:border-emerald-400
          [&_strong]:text-emerald-400
          [&_.btn-square.btn-ghost]:border-white/15 [&_.btn-square.btn-ghost]:bg-white/5 [&_.btn-square.btn-ghost]:text-emerald-400"
      >
        {/* Top glowing accent border */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none z-20" />
        {/* Glow orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-emerald-500/10 via-teal-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-gradient-to-tl from-indigo-600/15 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        {/* Filter toolbar */}
        <CustomerOrdersFilterBar
          searchTerm={searchTerm}
          onSearchChange={(v) => {
            setSearchTerm(v);
            setCurrentPage(1);
          }}
          statusFilter={statusFilter}
          onStatusChange={(v) => {
            setStatusFilter(v);
            setCurrentPage(1);
          }}
          paymentFilter={paymentFilter}
          onPaymentChange={(v) => {
            setPaymentFilter(v);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          onSortChange={(s) => {
            setSortBy(s);
            setCurrentPage(1);
          }}
          onReset={handleReset}
          onRefresh={refetch}
          isFetching={isFetching}
          totalCount={meta?.total ?? orders.length}
        />

        {/* Table */}
        <div className="relative z-10">
          <AZTable<TOrder>
            title="My Orders"
            subtitle={`Showing ${orders.length} of ${meta?.total ?? orders.length} orders`}
            icon={<ShoppingBag className="w-5 h-5 text-emerald-400" />}
            badgeText={`${meta?.total ?? orders.length} Orders`}
            className="!bg-transparent !shadow-none !border-none text-slate-100"
            columns={columns}
            data={orders}
            keyExtractor={(order) => order._id}
            isLoading={isLoading}
            isError={isError}
            errorMessage="Failed to load your orders. Please try again."
            onRetry={refetch}
            onRefresh={refetch}
            isRefreshing={isFetching}
            emptyTitle="No Orders Found"
            emptyMessage={
              searchTerm || statusFilter !== "ALL" || paymentFilter !== "ALL"
                ? "No orders match your current filters. Try adjusting them."
                : "You haven't placed any orders yet. Start shopping!"
            }
            emptyIcon={<ShoppingBag className="w-8 h-8 text-slate-500" />}
            emptyAction={
              searchTerm ||
                statusFilter !== "ALL" ||
                paymentFilter !== "ALL" ? (
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-sm btn-outline border-emerald-400/40 text-emerald-400 hover:bg-emerald-400 hover:text-slate-950 font-bold rounded-xl"
                >
                  Reset Filters
                </button>
              ) : undefined
            }
            pagination={{
              page: currentPage,
              limit: LIMIT,
              total: meta?.total ?? orders.length,
              onPageChange: setCurrentPage,
            }}
          />
        </div>
      </div>

      {/* Order Details Modal (reusing admin modal — same data shape) */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        onOpenReview={(variantId) => {
          setReviewOrder(selectedOrder);
          setReviewVariantId(variantId);
          setIsReviewModalOpen(true);
        }}
      />

      {/* Product Review Modal */}
      <CreateProductReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewOrder(null);
          setReviewVariantId(undefined);
        }}
        order={reviewOrder}
        initialProductId={reviewVariantId}
        onSuccess={() => refetch()}
      />

      {/* Service Review Modal */}
      <CreateServiceReviewModal
        isOpen={isServiceReviewModalOpen}
        onClose={() => {
          setIsServiceReviewModalOpen(false);
          if (!isReviewModalOpen) setReviewOrder(null);
        }}
        order={reviewOrder}
        onSuccess={() => refetch()}
      />
    </>
  );
};

export default CustomerOrdersData;
