"use client";

import React, { useState, useMemo } from "react";
import { useAllOrdersQuery } from "@/src/redux/features/order/orderApi";
import { TOrder } from "@/src/types/order";
import { TColumn } from "@/src/types/table";
import AZTable from "../../../shared/AZTable";
import OrdersFilterBar from "./OrdersFilterBar";
import OrderDetailsModal from "./OrderDetailsModal";
import {
  ShoppingBag,
  Eye,
  FileText,
  User,
  Store,
  Calendar,
  DollarSign,
  Package,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";

export interface OrdersDataProps {
  onOrdersLoaded?: (orders: TOrder[]) => void;
}

export const OrdersData: React.FC<OrdersDataProps> = ({ onOrdersLoaded }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("ALL");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [copiedOrderNo, setCopiedOrderNo] = useState<string | null>(null);

  // Selected Order for Modal Details
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch orders from API
  const {
    data: ordersResponse,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useAllOrdersQuery({});

  const allOrdersList: TOrder[] = useMemo(() => {
    const list = ordersResponse?.data || [];
    if (onOrdersLoaded && list.length > 0) {
      onOrdersLoaded(list);
    }
    return list;
  }, [ordersResponse, onOrdersLoaded]);


  // Handle Copy Order Number
  const handleCopyOrderNo = (orderNo: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(orderNo);
      setCopiedOrderNo(orderNo);
      setTimeout(() => setCopiedOrderNo(null), 1600);
      toast.success(`Copied Order #${orderNo}`, {
        position: "bottom-right",
        autoClose: 1400,
      });
    }
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let result = [...allOrdersList];

    // Search filter
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase().trim();
      result = result.filter((order) => {
        const orderNo = order.orderNo?.toLowerCase() || "";
        const customerName = order.customer?.name?.toLowerCase() || "";
        const customerEmail = order.customer?.email?.toLowerCase() || "";
        const vendorName = order.vendor?.name?.toLowerCase() || "";
        const vendorEmail = order.vendor?.email?.toLowerCase() || "";
        const transactionId = order.transactionId?.toLowerCase() || "";

        return (
          orderNo.includes(lower) ||
          customerName.includes(lower) ||
          customerEmail.includes(lower) ||
          vendorName.includes(lower) ||
          vendorEmail.includes(lower) ||
          transactionId.includes(lower)
        );
      });
    }

    // Order status filter
    if (selectedOrderStatus !== "ALL") {
      result = result.filter(
        (order) => order.status?.toUpperCase() === selectedOrderStatus
      );
    }

    // Payment status filter
    if (selectedPaymentStatus !== "ALL") {
      result = result.filter(
        (order) => order.paymentStatus?.toUpperCase() === selectedPaymentStatus
      );
    }

    // Sort
    if (sortBy === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
      );
    } else if (sortBy === "highest_amount") {
      result.sort((a, b) => (b.totalPrice || 0) - (a.totalPrice || 0));
    } else if (sortBy === "lowest_amount") {
      result.sort((a, b) => (a.totalPrice || 0) - (b.totalPrice || 0));
    } else {
      // newest first
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    }

    return result;
  }, [allOrdersList, searchTerm, selectedOrderStatus, selectedPaymentStatus, sortBy]);

  // Client-side pagination slicing
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / limitPerPage));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * limitPerPage;
    return filteredOrders.slice(start, start + limitPerPage);
  }, [filteredOrders, currentPage, limitPerPage]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedOrderStatus("ALL");
    setSelectedPaymentStatus("ALL");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Column definitions for AZTable
  const columns: TColumn<TOrder>[] = [
    {
      header: "Order # & Date",
      accessor: (order) => {
        const dateStr = order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          : "N/A";

        return (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-400">
              <span>#{order.orderNo}</span>
              <button
                type="button"
                onClick={(e) => handleCopyOrderNo(order.orderNo, e)}
                title="Copy Order #"
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                {copiedOrderNo === order.orderNo ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
              <span>{dateStr}</span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Customer",
      accessor: (order) => (
        <div className="space-y-0.5 max-w-[160px]">
          <div className="font-bold text-xs text-white truncate" title={order.customer?.name}>
            {order.customer?.name || "Customer Account"}
          </div>
          <div className="text-[10px] text-slate-400 truncate" title={order.customer?.email}>
            {order.customer?.email || "N/A"}
          </div>
        </div>
      ),
    },
    {
      header: "Vendor",
      accessor: (order) => (
        <div className="space-y-0.5 max-w-[160px]">
          <div className="font-bold text-xs text-purple-300 flex items-center gap-1 truncate" title={order.vendor?.name}>
            <Store className="w-3 h-3 text-purple-400 shrink-0" />
            <span className="truncate">{order.vendor?.name || "Marketplace Vendor"}</span>
          </div>
          <div className="text-[10px] text-slate-400 truncate" title={order.vendor?.email}>
            {order.vendor?.email || "N/A"}
          </div>
        </div>
      ),
    },
    {
      header: "Items",
      accessor: (order) => (
        <div className="flex items-center gap-1.5">
          <span className="badge badge-sm badge-outline border-white/20 text-slate-200 font-bold">
            {order.totalQuantity} {order.totalQuantity === 1 ? "unit" : "units"}
          </span>
          {order.products && order.products.length > 0 && (
            <span className="text-[10px] text-slate-400">
              ({order.products.length} {order.products.length === 1 ? "line" : "lines"})
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Gross Total",
      accessor: (order) => (
        <div className="font-mono text-xs font-black text-emerald-400">
          ${order.totalPrice?.toFixed(2) || "0.00"}
        </div>
      ),
    },
    {
      header: "Commission",
      accessor: (order) => (
        <div className="font-mono text-xs font-bold text-amber-300">
          ${order.commission?.toFixed(2) || "0.00"}
        </div>
      ),
    },
    {
      header: "Order Status",
      accessor: (order) => {
        const st = order.status?.toUpperCase();
        if (st === "DELIVERED") {
          return (
            <span className="badge badge-success text-slate-950 font-black badge-sm gap-1">
              <CheckCircle2 className="w-3 h-3" /> Delivered
            </span>
          );
        }
        if (st === "SHIPPED") {
          return (
            <span className="badge badge-info text-white font-bold badge-sm gap-1">
              <Clock className="w-3 h-3" /> Shipped
            </span>
          );
        }
        if (st === "PROCESSING" || st === "CONFIRMED") {
          return (
            <span className="badge badge-warning text-slate-950 font-bold badge-sm">
              {st}
            </span>
          );
        }
        if (st === "CANCELLED") {
          return (
            <span className="badge badge-error text-white font-bold badge-sm">
              Cancelled
            </span>
          );
        }
        return (
          <span className="badge badge-outline border-amber-400/40 text-amber-400 font-bold badge-sm">
            {order.status || "Pending"}
          </span>
        );
      },
    },
    {
      header: "Payment",
      accessor: (order) => {
        const pm = order.paymentStatus?.toUpperCase();
        if (pm === "PAID") {
          return (
            <span className="badge badge-success text-slate-950 font-black badge-sm gap-1">
              <Check className="w-3 h-3 stroke-[2.5]" /> Paid
            </span>
          );
        }
        if (pm === "REFUNDED") {
          return (
            <span className="badge badge-warning text-slate-950 font-bold badge-sm gap-1">
              <RotateCcw className="w-3 h-3" /> Refunded
            </span>
          );
        }
        return (
          <span className="badge badge-error text-white font-bold badge-sm gap-1">
            <AlertCircle className="w-3 h-3" /> Unpaid
          </span>
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
              setSelectedOrder(order);
              setIsDetailsModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-amber-400 gap-1 hover:bg-amber-400/10 border border-amber-400/20 hover:border-amber-400/40 rounded-xl cursor-pointer transition-all"
          >
            <Eye className="w-3 h-3" />
            <span>Details</span>
          </button>

          {order.invoiceUrl && (
            <a
              href={order.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Download Invoice PDF"
              className="btn btn-ghost btn-xs text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer"
            >
              <FileText className="w-3 h-3 text-amber-400" />
            </a>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl [&_.input]:bg-[#120824] [&_.input]:border-white/15 [&_.input]:text-slate-200 [&_.input]:placeholder:text-slate-500 [&_.input:focus]:border-amber-400 [&_thead_th]:text-slate-300 [&_thead_th]:bg-white/[0.03] [&_thead_th]:border-b [&_thead_th]:border-white/10 [&_tbody_tr]:border-b [&_tbody_tr]:border-white/5 [&_tbody_tr:hover]:bg-white/[0.05] [&_tbody_tr]:text-slate-200 [&_.border-base-200]:!border-white/10 [&_.border-base-300]:!border-white/10 [&_.card-title]:!text-white [&_p]:!text-slate-300 [&_.select]:bg-[#120824] [&_.select]:border-white/15 [&_.select]:text-slate-200 [&_.select]:focus:border-amber-400 [&_.join-item.btn-outline]:bg-white/5 [&_.join-item.btn-outline]:border-white/15 [&_.join-item.btn-outline]:text-slate-200 [&_.join-item.btn-outline:hover]:bg-white/10 [&_.join-item.btn-primary]:bg-amber-400 [&_.join-item.btn-primary]:text-slate-950 [&_.join-item.btn-primary]:border-amber-400 [&_strong]:text-amber-400 [&_.btn-square.btn-ghost]:border-white/15 [&_.btn-square.btn-ghost]:bg-white/5 [&_.btn-square.btn-ghost]:text-amber-400 [&_.badge-primary]:bg-amber-400 [&_.badge-primary]:text-slate-950 [&_.badge-primary]:border-none">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

        {/* Ambient background glow orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        {/* Filter Toolbar */}
        <OrdersFilterBar
          searchTerm={searchTerm}
          onSearchChange={(v) => {
            setSearchTerm(v);
            setCurrentPage(1);
          }}
          selectedOrderStatus={selectedOrderStatus}
          onOrderStatusChange={(st) => {
            setSelectedOrderStatus(st);
            setCurrentPage(1);
          }}
          selectedPaymentStatus={selectedPaymentStatus}
          onPaymentStatusChange={(pm) => {
            setSelectedPaymentStatus(pm);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
        />

        {/* Table Content */}
        <div className="relative z-10">
          <AZTable<TOrder>
            title="Marketplace Orders Directory"
            subtitle={`Displaying ${filteredOrders.length} matching order records`}
            icon={<ShoppingBag className="w-5 h-5 text-amber-400" />}
            badgeText={`${filteredOrders.length} Orders`}
            className="!bg-transparent !shadow-none !border-none text-slate-100"
            columns={columns}
            data={paginatedOrders}
            keyExtractor={(order) => order._id}
            isLoading={isLoading}
            isError={isError}
            onRefresh={refetch}
            isRefreshing={isFetching}
            emptyTitle="No Orders Found"
            emptyMessage="No customer orders match your search and filter criteria."
            emptyAction={
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-sm btn-outline border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-slate-950 font-bold rounded-xl"
              >
                Reset Filters
              </button>
            }
            pagination={{
              page: currentPage,
              limit: limitPerPage,
              total: filteredOrders.length,
              onPageChange: setCurrentPage,
              onLimitChange: (newLimit) => {
                setLimitPerPage(newLimit);
                setCurrentPage(1);
              },
            }}
          />
        </div>
      </div>

      {/* Detailed Order Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </>
  );
};

export default OrdersData;
