"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { TRecentOrder } from "@/types/dashboard";
import AZTable from "@/components/shared/AZTable";
import { TColumn } from "@/types/table";

export interface RecentOrdersTableProps {
  orders?: TRecentOrder[];
  isLoading?: boolean;
}

const ORDER_STATUS_CLASSES: Record<string, string> = {
  DELIVERED: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
  SHIPPED: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  UNSHIPPED: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
  PROCESSING: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
  PENDING: "bg-amber-500/15 border-amber-500/30 text-amber-400",
  CANCELLED: "bg-rose-500/15 border-rose-500/30 text-rose-400",
  REFUNDED: "bg-purple-500/15 border-purple-500/30 text-purple-400",
};

const PAYMENT_STATUS_CLASSES: Record<string, string> = {
  PAID: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  UNPAID: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  REFUNDED: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
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
        const customerName = (o.customer?.name || "").toLowerCase();
        const customerEmail = (o.customer?.email || "").toLowerCase();
        const vendorName = (o.vendor?.name || "").toLowerCase();
        const status = (o.status || "").toLowerCase();
        return (
          orderNo.includes(term) ||
          customerName.includes(term) ||
          customerEmail.includes(term) ||
          vendorName.includes(term) ||
          status.includes(term)
        );
      })
      .slice(0, 8);
  }, [orders, searchValue]);

  const columns: TColumn<TRecentOrder>[] = useMemo(
    () => [
      {
        header: "Order Ref",
        accessor: (order) => {
          const displayRef =
            order.orderNo || `#${order._id.slice(-6).toUpperCase()}`;
          return (
            <div className="font-mono">
              <div className="font-black text-white text-xs hover:text-amber-400 transition-colors">
                {displayRef}
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 font-sans">
                <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
          );
        },
      },
      {
        header: "Customer",
        accessor: (order) => {
          return (
            <div className="min-w-0 max-w-[140px]">
              <div className="font-bold text-slate-200 truncate text-xs">
                {order.customer?.name || "Customer"}
              </div>
              {order.customer?.email && (
                <div className="text-[10px] text-slate-400 truncate">
                  {order.customer.email}
                </div>
              )}
            </div>
          );
        },
      },
      {
        header: "Vendor",
        accessor: (order) => {
          return (
            <div className="font-bold text-slate-300 truncate max-w-[120px] text-xs">
              {order.vendor?.name || "Store"}
            </div>
          );
        },
      },
      {
        header: "Total",
        accessor: (order) => {
          return (
            <span className="font-mono font-black text-amber-400 text-xs">
              {formatCurrency(order.totalPrice || 0)}
            </span>
          );
        },
      },
      {
        header: "Status",
        accessor: (order) => {
          const statusKey = order.status?.toUpperCase() || "PENDING";
          const statusBadgeClass =
            ORDER_STATUS_CLASSES[statusKey] || ORDER_STATUS_CLASSES.PENDING;
          return (
            <span
              className={`badge badge-xs uppercase font-extrabold px-2 py-1 border ${statusBadgeClass}`}
            >
              {order.status || "PENDING"}
            </span>
          );
        },
      },
      {
        header: "Payment",
        accessor: (order) => {
          const payKey = order.paymentStatus?.toUpperCase() || "UNPAID";
          const payBadgeClass =
            PAYMENT_STATUS_CLASSES[payKey] || PAYMENT_STATUS_CLASSES.UNPAID;
          return (
            <span
              className={`badge badge-xs uppercase font-bold px-2 py-1 border ${payBadgeClass}`}
            >
              {order.paymentStatus || "UNPAID"}
            </span>
          );
        },
      },
      {
        header: "Action",
        accessor: () => {
          return (
            <Link
              href="/admin/orders"
              className="btn btn-xs gap-1 font-bold text-amber-400 hover:text-slate-950 bg-amber-400/10 hover:bg-amber-400 border border-amber-400/20 rounded-lg transition-all"
            >
              <span>View</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="w-full">
      <AZTable<TRecentOrder>
        title="Recent Order Activity"
        subtitle="Live transactional feed of latest customer checkouts."
        badgeText={orders.length}
        icon={<ShoppingBag className="w-5 h-5 text-amber-400" />}
        data={filteredOrders}
        columns={columns}
        keyExtractor={(order, idx) => order._id || String(idx)}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search recent orders by ref, customer, vendor..."
        headerActions={
          <Link
            href="/admin/orders"
            className="btn btn-xs sm:btn-sm gap-1 text-amber-400 hover:bg-amber-400 hover:text-slate-950 font-bold border border-amber-400/30 rounded-xl transition-all"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        }
        emptyTitle="No Recent Orders"
        emptyMessage="No recent orders recorded in the current range."
        isLoading={isLoading}
      />
    </div>
  );
};

export default RecentOrdersTable;
