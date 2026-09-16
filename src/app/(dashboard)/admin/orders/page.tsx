"use client";

import React, { useMemo } from "react";
import {
  OrdersBread,
  OrdersHeader,
  OrdersStats,
  OrdersData,
} from "@/src/components/ui/Dashboard/admin/orders";
import { useAllOrdersQuery } from "@/src/redux/features/order/orderApi";
import { TOrder } from "@/src/types/order";
import { toast } from "react-toastify";

export default function AdminOrdersPage() {
  const {
    data: ordersResponse,
    refetch,
    isFetching,
  } = useAllOrdersQuery({});

  const ordersList: TOrder[] = useMemo(() => {
    return ordersResponse?.data || [];
  }, [ordersResponse]);

  // Compute live dashboard metrics from orders
  const metrics = useMemo(() => {
    const totalOrders = ordersList.length;
    let grossRevenue = 0;
    let totalCommission = 0;
    let pendingOrdersCount = 0;

    ordersList.forEach((order) => {
      grossRevenue += Number(order.totalPrice) || 0;
      totalCommission += Number(order.commission) || 0;

      const st = order.status?.toUpperCase();
      if (st === "PENDING" || st === "UNSHIPPED" || st === "PROCESSING" || st === "CONFIRMED") {
        pendingOrdersCount++;
      }
    });

    return {
      totalOrders,
      grossRevenue,
      totalCommission,
      pendingOrdersCount,
    };
  }, [ordersList]);

  // Export filtered orders as CSV
  const handleExportCsv = () => {
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
  };

  return (
    <div className="space-y-6 w-full pb-10">
      <OrdersBread />
      <OrdersHeader
        totalOrders={metrics.totalOrders}
        onExportCsv={handleExportCsv}
        onRefresh={refetch}
        isRefreshing={isFetching}
      />
      <OrdersStats
        totalOrders={metrics.totalOrders}
        grossRevenue={metrics.grossRevenue}
        totalCommission={metrics.totalCommission}
        pendingOrdersCount={metrics.pendingOrdersCount}
      />
      <OrdersData />
    </div>
  );
}
