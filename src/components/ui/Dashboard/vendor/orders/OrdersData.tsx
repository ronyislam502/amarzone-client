"use client";

import React, { useState, useMemo } from "react";
import {
  Package,
  Calendar,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronDown,
  Layers,
  Filter,
} from "lucide-react";
import { TColumn } from "@/src/types/table";
import AZTable from "../../../shared/AZTable";
import { useMyOrdersQuery } from "@/src/redux/features/order/orderApi";
import OrderDetailsModal from "./OrderDetailsModal";
import { TPendingOrderRecord } from "./PendingOrdersTable";

export type TOrderStatusKey = "PENDING" | "UNSHIPPED" | "SHIPPED" | "DELIVERED" | "CANCELED" | "ALL";

interface OrdersDataProps {
  initialStatus?: TOrderStatusKey;
  activeStatus?: TOrderStatusKey;
  onStatusChange?: (status: TOrderStatusKey) => void;
}

const OrdersData: React.FC<OrdersDataProps> = ({
  initialStatus = "PENDING",
  activeStatus: controlledStatus,
  onStatusChange,
}) => {
  const [internalStatus, setInternalStatus] = useState<TOrderStatusKey>(initialStatus);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<TPendingOrderRecord | null>(null);

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
      limit,
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

        let displayStatus: "Pending" | "Unshipped" | "Shipped" | "Cancelled" = "Pending";
        let subtext = "Awaiting payment verification";

        const upperStatus = ord.status?.toUpperCase();
        if (upperStatus === "UNSHIPPED") {
          displayStatus = "Unshipped";
          subtext = "Ready to confirm & ship";
        } else if (upperStatus === "SHIPPED") {
          displayStatus = "Shipped";
          subtext = "Carrier dispatch confirmed";
        } else if (upperStatus === "DELIVERED") {
          displayStatus = "Shipped";
          subtext = "Successfully delivered";
        } else if (upperStatus === "CANCELLED" || upperStatus === "CANCELED") {
          displayStatus = "Cancelled";
          subtext = "Order voided";
        }

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
          status: (upperStatus === "DELIVERED" ? "Delivered" : displayStatus) as any,
          statusSubtext: subtext,
        };
      });
    }

    return [];
  }, [apiResponse]);

  // Filtered orders based on selected status and search
  const filteredOrders = useMemo(() => {
    let list = ordersList;

    if (activeStatus !== "ALL") {
      list = list.filter((ord) => {
        const s = ord.status.toUpperCase();
        if (activeStatus === "CANCELED") return s === "CANCELLED" || s === "CANCELED";
        return s === activeStatus;
      });
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNo.toLowerCase().includes(q) ||
          o.product.title.toLowerCase().includes(q) ||
          o.product.asin.toLowerCase().includes(q) ||
          o.product.sku.toLowerCase().includes(q)
      );
    }

    return list;
  }, [ordersList, activeStatus, searchTerm]);

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
            onClick={() => setSelectedOrder(order)}
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
            onClick={() => setSelectedOrder(order)}
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
        const s = order.status.toUpperCase();
        let badgeClass = "bg-amber-400 text-slate-950";
        if (s === "UNSHIPPED") badgeClass = "bg-sky-400 text-slate-950";
        else if (s === "SHIPPED") badgeClass = "bg-indigo-500 text-white";
        else if (s === "DELIVERED") badgeClass = "bg-emerald-500 text-slate-950";
        else if (s === "CANCELLED" || s === "CANCELED") badgeClass = "bg-rose-500 text-white";

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
        <button
          type="button"
          onClick={() => setSelectedOrder(order)}
          className="btn btn-ghost btn-xs font-bold text-amber-400 gap-1 hover:bg-amber-400/10 border border-amber-400/20 hover:border-amber-400/40 rounded-xl cursor-pointer transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>More info</span>
          <ChevronDown className="w-3 h-3" />
        </button>
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
            badgeText={filteredOrders.length}
            icon={<Package className="w-5 h-5 text-amber-400" />}
            className="!bg-transparent !shadow-none !border-none text-slate-100"
            data={filteredOrders}
            columns={columns}
            keyExtractor={(order) => order.id}
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by Order ID, ASIN, SKU, or Product title..."
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
            isLoading={isLoading}
            emptyTitle={`No ${activeStatus.charAt(0) + activeStatus.slice(1).toLowerCase()} Orders`}
            emptyMessage={`There are currently no orders under the "${activeStatus}" filter.`}
            emptyIcon={<Package className="w-8 h-8 text-amber-400" />}
            pagination={{
              page,
              limit,
              total: apiResponse?.meta?.total ?? filteredOrders.length,
              onPageChange: setPage,
              onLimitChange: (newLimit) => {
                setLimit(newLimit);
                setPage(1);
              },
            }}
          />
        </div>
      </div>

      {/* Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};

export default OrdersData;
