"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useAllOrdersQuery } from "@/src/redux/features/order/orderApi";
import { TOrder } from "@/src/types/order";
import { TColumn } from "@/src/types/table";
import AZTable from "../../../shared/AZTable";
import { TABLE_CARD_CN } from "@/src/lib/tableStyles";
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
  Truck,
} from "lucide-react";
import Modal from "../../../shared/Modal";
import UpdateOrder from "../../vendor/orders/UpdateOrder";
import { toast } from "react-toastify";

export interface OrdersDataProps {
  onOrdersLoaded?: (orders: TOrder[]) => void;
  registerExportHandler?: (handler: () => void) => void;
  registerRefreshHandler?: (handler: () => void) => void;
}

const LIMIT = 10;

export const OrdersData: React.FC<OrdersDataProps> = ({
  registerExportHandler,
  registerRefreshHandler,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("ALL");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedOrderNo, setCopiedOrderNo] = useState<string | null>(null);

  // Selected Order for Modal Details
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

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
    data: ordersResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllOrdersQuery({
    search: searchTerm.trim() || undefined,
    page: String(currentPage),
    limit: String(LIMIT),
    status: selectedOrderStatus !== "ALL" ? selectedOrderStatus : undefined,
    paymentStatus: selectedPaymentStatus !== "ALL" ? selectedPaymentStatus : undefined,
    sort: sortParam,
  });

  const ordersList: TOrder[] = ordersResponse?.data || [];
  const meta = ordersResponse?.meta;

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

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedOrderStatus("ALL");
    setSelectedPaymentStatus("ALL");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // CSV Export handler
  const handleExportCsv = useCallback(() => {
    if (ordersList.length === 0) {
      toast.info("No orders available to export.");
      return;
    }

    const headers = [
      "Order Number",
      "Customer Name",
      "Customer Email",
      "Vendor Name",
      "Vendor Email",
      "Total Quantity",
      "Gross Total ($)",
      "Commission ($)",
      "Vendor Amount ($)",
      "Order Status",
      "Payment Status",
      "Transaction ID",
      "Date Placed",
    ];

    const rows = ordersList.map((order) => [
      `"${order.orderNo || ""}"`,
      `"${order.customer?.name || ""}"`,
      `"${order.customer?.email || ""}"`,
      `"${order.vendor?.name || ""}"`,
      `"${order.vendor?.email || ""}"`,
      order.totalQuantity || 0,
      (order.totalPrice || 0).toFixed(2),
      (order.commission || 0).toFixed(2),
      (order.vendorAmount || 0).toFixed(2),
      `"${order.status || ""}"`,
      `"${order.paymentStatus || ""}"`,
      `"${order.transactionId || ""}"`,
      `"${order.createdAt ? new Date(order.createdAt).toISOString() : ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `amarzone_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${ordersList.length} orders to CSV!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  }, [ordersList]);

  // Register export and refresh handlers with parent
  useEffect(() => {
    if (registerExportHandler) {
      registerExportHandler(handleExportCsv);
    }
  }, [registerExportHandler, handleExportCsv]);

  useEffect(() => {
    if (registerRefreshHandler) {
      registerRefreshHandler(() => refetch());
    }
  }, [registerRefreshHandler, refetch]);

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

          <button
            type="button"
            onClick={() => {
              setSelectedOrder(order);
              setIsUpdateModalOpen(true);
            }}
            className="btn btn-ghost btn-xs font-bold text-cyan-400 gap-1 hover:bg-cyan-400/10 border border-cyan-400/20 hover:border-cyan-400/40 rounded-xl cursor-pointer transition-all"
            title="Assign tracking and dispatch order"
          >
            <Truck className="w-3 h-3" />
            <span>Dispatch</span>
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
      <div className={TABLE_CARD_CN}>
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
          onSortChange={(s) => {
            setSortBy(s);
            setCurrentPage(1);
          }}
          onResetFilters={handleResetFilters}
        />

        {/* Table Content */}
        <div className="relative z-10">
          <AZTable<TOrder>
            title="Marketplace Orders Directory"
            subtitle={`Displaying ${meta?.total ?? ordersList.length} matching order records`}
            icon={<ShoppingBag className="w-5 h-5 text-amber-400" />}
            badgeText={`${meta?.total ?? ordersList.length} Orders`}
            className="!bg-transparent !shadow-none !border-none text-slate-100"
            columns={columns}
            data={ordersList}
            keyExtractor={(order) => order._id}
            isLoading={isLoading}
            isError={isError}
            errorMessage={(error as any)?.data?.message}
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
              limit: LIMIT,
              total: meta?.total ?? ordersList.length,
              onPageChange: setCurrentPage,
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
        onOpenUpdate={() => {
          setIsDetailsModalOpen(false);
          setIsUpdateModalOpen(true);
        }}
      />

      {/* Dispatch & Tracking Update Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedOrder(null);
        }}
        size="md"
        className="!bg-[#170d2f] !border-white/10 text-slate-100 shadow-2xl relative overflow-hidden rounded-3xl"
      >
        {selectedOrder && (
          <UpdateOrder
            order={selectedOrder}
            onSuccess={() => {
              setIsUpdateModalOpen(false);
              setSelectedOrder(null);
              refetch();
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default OrdersData;
