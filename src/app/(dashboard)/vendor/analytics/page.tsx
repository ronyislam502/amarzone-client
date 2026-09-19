"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, RefreshCw, AlertCircle } from "lucide-react";
import CustomersBread from "@/src/components/ui/analistics/admin/customers/CustomersBread";
import AnalyticsHeader, {
  TAnalyticsDateRange,
} from "@/src/components/ui/analistics/vendor/analytics/AnalyticsHeader";
import AnalyticsKpiCards from "@/src/components/ui/analistics/vendor/analytics/AnalyticsKpiCards";
import VendorSalesCharts, {
  TChartPoint,
  TStatusPoint,
} from "@/src/components/ui/analistics/vendor/analytics/VendorSalesCharts";
import VendorBarCharts, {
  TGroupSalesPoint,
} from "@/src/components/ui/analistics/vendor/analytics/VendorBarCharts";
import TopProductsTable, {
  TTopSellingProductItem,
} from "@/src/components/ui/analistics/vendor/analytics/TopProductsTable";
import { useMyOrdersQuery } from "@/src/redux/features/order/orderApi";

const VendorAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState<TAnalyticsDateRange>("30_days");
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [customEndDate, setCustomEndDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });

  const {
    data: apiResponse,
    isLoading,
    isFetching,
    refetch,
  } = useMyOrdersQuery({ limit: 1000 }, { refetchOnMountOrArgChange: true });

  const rawOrders: any[] = Array.isArray(apiResponse?.data) ? apiResponse.data : [];

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    const now = new Date();
    let startThreshold = new Date();

    if (dateRange === "today") {
      startThreshold.setHours(0, 0, 0, 0);
      return rawOrders.filter((ord) => new Date(ord.createdAt) >= startThreshold);
    } else if (dateRange === "7_days") {
      startThreshold.setDate(now.getDate() - 7);
      return rawOrders.filter((ord) => new Date(ord.createdAt) >= startThreshold);
    } else if (dateRange === "30_days") {
      startThreshold.setDate(now.getDate() - 30);
      return rawOrders.filter((ord) => new Date(ord.createdAt) >= startThreshold);
    } else if (dateRange === "custom" && customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(customEndDate);
      end.setHours(23, 59, 59, 999);
      return rawOrders.filter((ord) => {
        const d = new Date(ord.createdAt);
        return d >= start && d <= end;
      });
    }

    return rawOrders;
  }, [rawOrders, dateRange, customStartDate, customEndDate]);

  // Compute Core Sales Metrics
  const {
    totalRevenue,
    totalOrders,
    totalUnits,
    aov,
    paidRate,
    revenueOverTime,
    ordersOverTime,
    ordersByStatus,
    departmentSales,
    categorySales,
    topProducts,
  } = useMemo(() => {
    let rev = 0;
    let units = 0;
    let paidCount = 0;

    const dailyMap: Record<string, { revenue: number; orders: number }> = {};
    const statusMap: Record<string, number> = {
      PENDING: 0,
      UNSHIPPED: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };
    const deptMap: Record<string, { id: string; name: string; revenue: number; ordersCount: number }> = {};
    const catMap: Record<string, { id: string; name: string; revenue: number; ordersCount: number }> = {};
    const productMap: Record<string, TTopSellingProductItem> = {};

    filteredOrders.forEach((ord) => {
      const orderPrice = Number(ord.totalPrice || ord.vendorAmount || 0);
      const isPaid = ord.paymentStatus === "PAID";
      if (isPaid) rev += orderPrice;
      if (isPaid) paidCount++;

      // Status tally
      const s = (ord.status || "UNSHIPPED").toUpperCase();
      if (s === "COMPLETE" || s === "DELIVERED") {
        statusMap.DELIVERED = (statusMap.DELIVERED || 0) + 1;
      } else if (s === "SHIPPED") {
        statusMap.SHIPPED = (statusMap.SHIPPED || 0) + 1;
      } else if (s === "UNSHIPPED") {
        statusMap.UNSHIPPED = (statusMap.UNSHIPPED || 0) + 1;
      } else if (s === "CANCELLED" || s === "CANCELED") {
        statusMap.CANCELLED = (statusMap.CANCELLED || 0) + 1;
      } else {
        statusMap.PENDING = (statusMap.PENDING || 0) + 1;
      }

      // Date tally
      const dateKey = new Date(ord.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = { revenue: 0, orders: 0 };
      }
      dailyMap[dateKey].orders += 1;
      if (isPaid) dailyMap[dateKey].revenue += orderPrice;

      // Products breakdown
      if (Array.isArray(ord.products)) {
        ord.products.forEach((pItem: any) => {
          const qty = Number(pItem.quantity || 1);
          units += qty;

          const prod = pItem?.variant?.product;
          const variant = pItem?.variant;
          const prodId = prod?._id || variant?._id || ord._id;
          const prodTitle = prod?.title || variant?.title || "Order Item";
          const thumbnail = prod?.thumbnail || variant?.thumbnail || "";
          const itemPrice = Number(pItem.price || orderPrice / ord.products.length);

          // Department tally
          const deptName = prod?.department?.name || "General Merchandise";
          const deptId = prod?.department?._id || "dept-gen";
          if (!deptMap[deptName]) {
            deptMap[deptName] = { id: deptId, name: deptName, revenue: 0, ordersCount: 0 };
          }
          deptMap[deptName].revenue += isPaid ? itemPrice * qty : 0;
          deptMap[deptName].ordersCount += 1;

          // Category tally
          const catName = prod?.category?.name || "Store Collection";
          const catId = prod?.category?._id || "cat-gen";
          if (!catMap[catName]) {
            catMap[catName] = { id: catId, name: catName, revenue: 0, ordersCount: 0 };
          }
          catMap[catName].revenue += isPaid ? itemPrice * qty : 0;
          catMap[catName].ordersCount += 1;

          // Top products map
          if (!productMap[prodId]) {
            productMap[prodId] = {
              id: prodId,
              title: prodTitle,
              thumbnail,
              asin: variant?.asin || "",
              sku: variant?.sku || "",
              unitsSold: 0,
              totalRevenue: 0,
              avgPrice: itemPrice,
            };
          }
          productMap[prodId].unitsSold += qty;
          productMap[prodId].totalRevenue += itemPrice * qty;
        });
      }
    });

    const ordersCount = filteredOrders.length;
    const computedAov = ordersCount > 0 ? rev / ordersCount : 0;
    const computedPaidRate = ordersCount > 0 ? (paidCount / ordersCount) * 100 : 100;

    // Line chart points
    const revTimeline: TChartPoint[] = Object.keys(dailyMap).map((k) => ({
      label: k,
      value: +dailyMap[k].revenue.toFixed(2),
    }));
    const ordTimeline: TChartPoint[] = Object.keys(dailyMap).map((k) => ({
      label: k,
      value: dailyMap[k].orders,
    }));

    // Status points
    const statusPoints: TStatusPoint[] = Object.keys(statusMap).map((k) => ({
      status: k,
      count: statusMap[k],
    }));

    // Group lists sorted descending by revenue
    const deptList: TGroupSalesPoint[] = Object.values(deptMap).sort((a, b) => b.revenue - a.revenue);
    const catList: TGroupSalesPoint[] = Object.values(catMap).sort((a, b) => b.revenue - a.revenue);
    const rankedProducts = Object.values(productMap).sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 10);

    return {
      totalRevenue: rev,
      totalOrders: ordersCount,
      totalUnits: units,
      aov: computedAov,
      paidRate: computedPaidRate,
      revenueOverTime: revTimeline,
      ordersOverTime: ordTimeline,
      ordersByStatus: statusPoints,
      departmentSales: deptList,
      categorySales: catList,
      topProducts: rankedProducts,
    };
  }, [filteredOrders]);

  return (
    <div className="space-y-6 w-full pb-10 text-slate-100">
      {/* 1. Breadcrumbs */}
      <CustomersBread
        parentHref="/vendor"
        parentLabel="Vendor Dashboard"
        title="Sales & Revenue Analytics"
        icon={<TrendingUp className="w-3.5 h-3.5 text-success" />}
        hoverColor="hover:text-success"
      />

      {/* 2. Interactive Header & Time-horizon Toolbar */}
      <AnalyticsHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onCustomStartDateChange={setCustomStartDate}
        onCustomEndDateChange={setCustomEndDate}
        isFetching={isFetching}
        onRefresh={() => refetch()}
      />

      {/* 3. Executive Sales KPI Cards */}
      <AnalyticsKpiCards
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        totalUnits={totalUnits}
        aov={aov}
        paidRate={paidRate}
      />

      {/* 4. Interactive SVG Line Charts (Revenue/Orders Velocity) & Donut Chart (Status) */}
      <VendorSalesCharts
        revenueOverTime={revenueOverTime}
        ordersOverTime={ordersOverTime}
        ordersByStatus={ordersByStatus}
      />

      {/* 5. Department and Category Performance Bar Charts */}
      <VendorBarCharts
        departmentSales={departmentSales}
        categorySales={categorySales}
      />

      {/* 6. Top-Selling Products & Inventory Revenue Leaders */}
      <TopProductsTable products={topProducts} />
    </div>
  );
};

export default VendorAnalyticsPage;
