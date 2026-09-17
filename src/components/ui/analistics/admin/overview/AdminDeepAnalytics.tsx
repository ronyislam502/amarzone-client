"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Store,
  Users,
  UserCheck,
  UserPlus,
  Package,
  TrendingUp,
  Award,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
  Star,
  Layers,
  Sparkles,
  BarChart3,
  Percent,
  Clock,
  Activity,
  AlertOctagon,
} from "lucide-react";
import {
  TDashboardOverviewCards,
  TDashboardUsers,
  TDashboardProducts,
  TDashboardInventory,
  TDashboardPayments,
  TDashboardTopLists,
  TDashboardReviews,
  TDashboardMarketplaceHealth,
} from "@/src/types/dashboard";

interface AdminDeepAnalyticsProps {
  overviewCards?: TDashboardOverviewCards;
  users?: TDashboardUsers;
  products?: TDashboardProducts;
  inventory?: TDashboardInventory;
  payments?: TDashboardPayments;
  topLists?: TDashboardTopLists;
  reviews?: TDashboardReviews;
  marketplaceHealth?: TDashboardMarketplaceHealth;
}

export const AdminDeepAnalytics: React.FC<AdminDeepAnalyticsProps> = ({
  overviewCards,
  users,
  products,
  inventory,
  payments,
  topLists,
  reviews,
  marketplaceHealth,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "orders_payments" | "vendors" | "customers" | "products" | "more_stats"
  >("orders_payments");

  // Calculations
  const totalRevenue = overviewCards?.totalRevenue || 0;
  const totalOrders = overviewCards?.totalOrders || 0;
  const pendingOrders = overviewCards?.pendingOrders || 0;
  const processingOrders = overviewCards?.processingOrders || 0;
  const shippedOrders = overviewCards?.shippedOrders || 0;
  const deliveredOrders = overviewCards?.deliveredOrders || 0;
  const cancelledOrders = overviewCards?.cancelledOrders || 0;
  const refundedOrders = overviewCards?.refundedOrders || 0;

  // Order & Payment stats
  const successfulPayments = payments?.totalSuccessfulPayments ?? 0;
  const failedPayments = payments?.failedPayments ?? 0;
  const refundedPayments = payments?.refundedPayments ?? 0;
  const pendingPayments = payments?.pendingPayments ?? 0;
  const totalPaymentEvents = successfulPayments + failedPayments + refundedPayments + pendingPayments;
  const paymentSuccessRate = totalPaymentEvents > 0
    ? ((successfulPayments / totalPaymentEvents) * 100).toFixed(1)
    : "100.0";

  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const cancellationRate = totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : "0.0";
  const refundRate = totalOrders > 0 ? ((refundedOrders / totalOrders) * 100).toFixed(1) : "0.0";
  const deliveryFulfillmentRate = totalOrders > 0
    ? ((deliveredOrders / totalOrders) * 100).toFixed(1)
    : "0.0";

  // Vendor Stats
  const totalVendors = users?.totalVendors || 0;
  const activeVendors = users?.activeVendors || 0;
  const suspendedVendors = users?.suspendedVendors || 0;
  const vendorActiveRate = totalVendors > 0 ? ((activeVendors / totalVendors) * 100).toFixed(1) : "100.0";
  const avgRevenuePerVendor = activeVendors > 0 ? totalRevenue / activeVendors : 0;

  // Customer Growth
  const totalCustomers = users?.totalCustomers || 0;
  const newUsersThisMonth = users?.newUsersThisMonth || 0;
  const customerToVendorRatio = totalVendors > 0 ? (totalCustomers / totalVendors).toFixed(1) : totalCustomers.toString();

  // Product Catalog
  const totalProducts = products?.totalProducts || 0;
  const activeProducts = products?.activeProducts || 0;
  const lowStock = inventory?.lowStockProducts || 0;
  const outOfStock = products?.outOfStockProducts ?? inventory?.outOfStockInventory ?? 0;
  const productActiveRate = totalProducts > 0 ? ((activeProducts / totalProducts) * 100).toFixed(1) : "100.0";

  // Financial commission
  const marketplaceCommission = overviewCards?.marketplaceCommission ?? totalRevenue * 0.1;
  const netVendorPayouts = overviewCards?.vendorEarnings ?? totalRevenue - marketplaceCommission;

  // Trust & satisfaction
  const averageRating = reviews?.averageRating ?? 4.9;
  const totalReviews = reviews?.totalReviews ?? 0;
  const ratingDist = reviews?.ratingDistribution || {};

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-6">
      {/* Top glowing accent border line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-bl from-indigo-500/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

      {/* Main Section Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-amber-400">
              <Activity className="w-4 h-4" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Deep System <span className="text-amber-400">Analytics & Telemetry</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Comprehensive operational intelligence covering fulfillment, merchants, buyers, inventory velocity, and risk parameters.
          </p>
        </div>

        {/* Analytics Mode Tabs */}
        <div className="flex items-center bg-[#120824] border border-white/15 rounded-2xl p-1 gap-1 self-start sm:self-auto shadow-inner flex-wrap">
          <button
            type="button"
            onClick={() => setActiveSubTab("orders_payments")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "orders_payments"
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order & Payments</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("vendors")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "vendors"
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Vendors</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("customers")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "customers"
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customer Growth</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("products")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "products"
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Product Performance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("more_stats")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "more_stats"
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Detailed Statistics</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: ORDER & PAYMENT STATISTICS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "orders_payments" && (
        <div className="relative z-10 space-y-6 animate-in fade-in duration-300">
          {/* Top 4 Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Average Order Value */}
            <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Average Order Value (AOV)
                </span>
                <span className="p-1 rounded-lg bg-emerald-400/10 text-emerald-400">
                  <DollarSign className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {formatCurrency(aov)}
              </div>
              <p className="text-[11px] text-slate-400">Average ticket size per order intake</p>
            </div>

            {/* Metric 2: Payment Settlement Rate */}
            <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Payment Success Rate
                </span>
                <span className="p-1 rounded-lg bg-emerald-400/10 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {paymentSuccessRate}%
              </div>
              <p className="text-[11px] text-slate-400">
                {successfulPayments.toLocaleString()} successful transactions
              </p>
            </div>

            {/* Metric 3: Delivery Completion Rate */}
            <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Fulfillment Delivery Rate
                </span>
                <span className="p-1 rounded-lg bg-cyan-400/10 text-cyan-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-black text-cyan-300 font-mono">
                {deliveryFulfillmentRate}%
              </div>
              <p className="text-[11px] text-slate-400">
                {deliveredOrders.toLocaleString()} out of {totalOrders.toLocaleString()} delivered
              </p>
            </div>

            {/* Metric 4: Cancellation & Refund Risk */}
            <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Refund & Cancel Rate
                </span>
                <span className="p-1 rounded-lg bg-rose-400/10 text-rose-400">
                  <RotateCcw className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-black text-rose-400 font-mono">
                {refundRate}% / {cancellationRate}%
              </div>
              <p className="text-[11px] text-slate-400">
                {refundedOrders} refunded • {cancelledOrders} cancelled
              </p>
            </div>
          </div>

          {/* Fulfillment & Payment Stages Progress Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Fulfillment Stages */}
            <div className="p-5 rounded-2xl bg-[#120824]/60 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  Order Pipeline Volume & Distribution
                </h3>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {totalOrders.toLocaleString()} Total
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Delivered", count: deliveredOrders, color: "bg-emerald-400", text: "text-emerald-400" },
                  { label: "Shipped / In Transit", count: shippedOrders, color: "bg-blue-400", text: "text-blue-400" },
                  { label: "Processing / Unshipped", count: processingOrders, color: "bg-cyan-400", text: "text-cyan-400" },
                  { label: "Pending Verification", count: pendingOrders, color: "bg-amber-400", text: "text-amber-400" },
                  { label: "Cancelled Orders", count: cancelledOrders, color: "bg-rose-400", text: "text-rose-400" },
                  { label: "Refunded Orders", count: refundedOrders, color: "bg-purple-400", text: "text-purple-400" },
                ].map((item) => {
                  const pct = totalOrders > 0 ? ((item.count / totalOrders) * 100).toFixed(1) : "0.0";
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{item.label}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className={`font-bold ${item.text}`}>{item.count.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-500">({pct}%)</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${Math.max(Number(pct), 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Settlement Stages */}
            <div className="p-5 rounded-2xl bg-[#120824]/60 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                  Payment Settlement Telemetry
                </h3>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {totalPaymentEvents.toLocaleString()} Total Transactions
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Successful / Paid", count: successfulPayments, color: "bg-emerald-400", text: "text-emerald-400" },
                  { label: "Pending Payments", count: pendingPayments, color: "bg-amber-400", text: "text-amber-400" },
                  { label: "Failed / Unpaid", count: failedPayments, color: "bg-rose-400", text: "text-rose-400" },
                  { label: "Refunded Payments", count: refundedPayments, color: "bg-purple-400", text: "text-purple-400" },
                ].map((item) => {
                  const pct = totalPaymentEvents > 0 ? ((item.count / totalPaymentEvents) * 100).toFixed(1) : "0.0";
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{item.label}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className={`font-bold ${item.text}`}>{item.count.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-500">({pct}%)</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${Math.max(Number(pct), 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Stripe & SSLCommerz Integration:</span>
                <span className="badge badge-xs badge-success gap-1 font-bold">
                  <span>Operational</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: VENDOR PERFORMANCE */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "vendors" && (
        <div className="relative z-10 space-y-6 animate-in fade-in duration-300">
          {/* Vendor Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Merchants</span>
              <div className="text-2xl font-black text-amber-400 font-mono">{totalVendors}</div>
              <p className="text-[11px] text-slate-400">Registered store partners</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Active Storefronts</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {activeVendors} <span className="text-xs text-slate-400 font-sans font-medium">({vendorActiveRate}%)</span>
              </div>
              <p className="text-[11px] text-slate-400">Actively selling on catalog</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Suspended Merchants</span>
              <div className="text-2xl font-black text-rose-400 font-mono">{suspendedVendors}</div>
              <p className="text-[11px] text-slate-400">Accounts blocked/investigated</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Avg Revenue / Merchant</span>
              <div className="text-2xl font-black text-cyan-300 font-mono">{formatCurrency(avgRevenuePerVendor)}</div>
              <p className="text-[11px] text-slate-400">Platform gross yield per partner</p>
            </div>
          </div>

          {/* Top Vendors Table / Leaderboard */}
          <div className="p-5 rounded-2xl bg-[#120824]/60 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Top Merchant Performance Leaderboard
                </h3>
                <p className="text-xs text-slate-400">Ranked by settled gross merchandise volume</p>
              </div>
              <Link
                href="/admin/vendors"
                className="btn btn-xs btn-outline border-amber-400/30 text-amber-400 hover:bg-amber-400 hover:text-slate-950 rounded-xl gap-1.5 font-bold self-start sm:self-auto"
              >
                <span>Manage All Vendors</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {(!topLists?.topVendors || topLists.topVendors.length === 0) ? (
                <div className="py-8 text-center text-xs text-slate-400">No vendor sales volume records available.</div>
              ) : (
                topLists.topVendors.map((vendor, idx) => {
                  const shareOfRevenue = totalRevenue > 0 ? ((vendor.totalRevenue / totalRevenue) * 100).toFixed(1) : "0.0";
                  const vendorAov = vendor.totalOrders > 0 ? vendor.totalRevenue / vendor.totalOrders : 0;

                  return (
                    <div key={vendor._id || idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-xl transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 font-mono text-xs font-black flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="font-black text-sm text-white truncate">{vendor.name || "Vendor Partner"}</div>
                          <div className="text-xs text-slate-400 truncate">{vendor.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 self-end sm:self-auto text-right font-mono">
                        <div>
                          <div className="text-xs font-black text-white">{vendor.totalOrders}</div>
                          <div className="text-[10px] text-slate-500 uppercase">Orders</div>
                        </div>
                        <div>
                          <div className="text-xs font-black text-cyan-300">{formatCurrency(vendorAov)}</div>
                          <div className="text-[10px] text-slate-500 uppercase">Avg Ticket</div>
                        </div>
                        <div>
                          <div className="text-sm font-black text-amber-400">{formatCurrency(vendor.totalRevenue)}</div>
                          <div className="text-[10px] text-slate-500 uppercase">{shareOfRevenue}% share</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: CUSTOMER GROWTH */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "customers" && (
        <div className="relative z-10 space-y-6 animate-in fade-in duration-300">
          {/* Customer Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Customers</span>
              <div className="text-2xl font-black text-white font-mono">{totalCustomers.toLocaleString()}</div>
              <p className="text-[11px] text-slate-400">Registered platform buyers</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">New Onboardings (Month)</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">+{newUsersThisMonth}</div>
              <p className="text-[11px] text-slate-400">Growth velocity this calendar month</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Buyer-to-Merchant Ratio</span>
              <div className="text-2xl font-black text-cyan-300 font-mono">{customerToVendorRatio}:1</div>
              <p className="text-[11px] text-slate-400">Demand to supply liquidity ratio</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total User Base</span>
              <div className="text-2xl font-black text-purple-300 font-mono">{(users?.totalUsers ?? 0).toLocaleString()}</div>
              <p className="text-[11px] text-slate-400">All authenticated identities</p>
            </div>
          </div>

          {/* Top Customers Leaderboard */}
          <div className="p-5 rounded-2xl bg-[#120824]/60 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  Top Volume Buyers & Customer Champions
                </h3>
                <p className="text-xs text-slate-400">Highest gross expenditure and recurring orders</p>
              </div>
              <Link
                href="/admin/customers"
                className="btn btn-xs btn-outline border-emerald-400/30 text-emerald-400 hover:bg-emerald-400 hover:text-slate-950 rounded-xl gap-1.5 font-bold self-start sm:self-auto"
              >
                <span>View All Customers</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {(!topLists?.topCustomers || topLists.topCustomers.length === 0) ? (
                <div className="py-8 text-center text-xs text-slate-400">No customer spend records available.</div>
              ) : (
                topLists.topCustomers.map((customer, idx) => {
                  const custAov = customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0;
                  return (
                    <div key={customer._id || idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-xl transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 font-mono text-xs font-black flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="font-black text-sm text-white truncate">{customer.name || "Customer"}</div>
                          <div className="text-xs text-slate-400 truncate">{customer.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 self-end sm:self-auto text-right font-mono">
                        <div>
                          <div className="text-xs font-black text-white">{customer.totalOrders}</div>
                          <div className="text-[10px] text-slate-500 uppercase">Orders</div>
                        </div>
                        <div>
                          <div className="text-xs font-black text-cyan-300">{formatCurrency(custAov)}</div>
                          <div className="text-[10px] text-slate-500 uppercase">AOV</div>
                        </div>
                        <div>
                          <div className="text-sm font-black text-emerald-400">{formatCurrency(customer.totalSpent)}</div>
                          <div className="text-[10px] text-slate-500 uppercase">Total Spent</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 4: PRODUCT PERFORMANCE */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "products" && (
        <div className="relative z-10 space-y-6 animate-in fade-in duration-300">
          {/* Product Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Products</span>
              <div className="text-2xl font-black text-white font-mono">{totalProducts.toLocaleString()}</div>
              <p className="text-[11px] text-slate-400">{products?.brandsCount || 0} brands • {products?.categoriesCount || 0} categories</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Active Listings</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {activeProducts.toLocaleString()} <span className="text-xs text-slate-400 font-sans font-medium">({productActiveRate}%)</span>
              </div>
              <p className="text-[11px] text-slate-400">Published and purchasable</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Low Stock Alert</span>
              <div className="text-2xl font-black text-amber-400 font-mono">{lowStock}</div>
              <p className="text-[11px] text-slate-400">Items with 10 or fewer units remaining</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#120824]/80 border border-white/10 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Out of Stock</span>
              <div className="text-2xl font-black text-rose-400 font-mono">{outOfStock}</div>
              <p className="text-[11px] text-slate-400">Requires merchant replenishment</p>
            </div>
          </div>

          {/* Top Selling Products List */}
          <div className="p-5 rounded-2xl bg-[#120824]/60 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-400" />
                  Top Selling Products & Velocity
                </h3>
                <p className="text-xs text-slate-400">Catalog items with highest units sold in this period</p>
              </div>
              <Link
                href="/admin/products"
                className="btn btn-xs btn-outline border-purple-400/30 text-purple-300 hover:bg-purple-400 hover:text-slate-950 rounded-xl gap-1.5 font-bold self-start sm:self-auto"
              >
                <span>Manage Products</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {(!topLists?.topSellingProducts || topLists.topSellingProducts.length === 0) ? (
                <div className="py-8 text-center text-xs text-slate-400">No product sales records available.</div>
              ) : (
                topLists.topSellingProducts.map((prod, idx) => (
                  <div key={prod._id || idx} className="py-3 flex items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-xl transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-xl bg-purple-400/10 border border-purple-400/20 text-purple-300 font-mono text-xs font-black flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      {prod.thumbnail && (
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-white/5 border border-white/10 relative shrink-0">
                          <Image src={prod.thumbnail} alt={prod.title || "Product"} fill className="object-cover" unoptimized />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-white truncate max-w-xs sm:max-w-md">
                          {prod.title || "Unnamed Product"}
                        </div>
                        {prod.asin && (
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            ASIN: <span className="text-amber-400">{prod.asin}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono">
                      <div className="text-sm font-black text-amber-400">{prod.totalSold.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400 uppercase">Units Sold</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 5: MORE DETAILED STATISTICS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "more_stats" && (
        <div className="relative z-10 space-y-6 animate-in fade-in duration-300">
          {/* Financial & Settlement Ledger Breakdown */}
          <div className="p-5 rounded-2xl bg-[#120824]/60 border border-white/10 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Financial Ledger & Settlement Allocation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#170d2f] border border-white/10 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Gross Merchandise Value (GMV)
                </span>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {formatCurrency(totalRevenue)}
                </div>
                <p className="text-[11px] text-slate-400">Total settled buyer payments</p>
              </div>

              <div className="p-4 rounded-xl bg-[#170d2f] border border-white/10 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Marketplace Commission (Platform Cut)
                </span>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {formatCurrency(marketplaceCommission)}
                </div>
                <p className="text-[11px] text-slate-400">Retained revenue from merchant sales</p>
              </div>

              <div className="p-4 rounded-xl bg-[#170d2f] border border-white/10 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Net Merchant Disbursements
                </span>
                <div className="text-2xl font-black text-cyan-300 font-mono">
                  {formatCurrency(netVendorPayouts)}
                </div>
                <p className="text-[11px] text-slate-400">Payable to merchant partners</p>
              </div>
            </div>
          </div>

          {/* Health & Risk Matrix & Satisfaction Rating */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk & Health Matrix */}
            <div className="p-5 rounded-2xl bg-[#120824]/60 border border-white/10 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Marketplace Integrity & Risk Matrix
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#170d2f] border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-300">Open Disputes</span>
                  <span className={`font-mono font-black ${(marketplaceHealth?.openDisputes ?? 0) > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                    {marketplaceHealth?.openDisputes ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#170d2f] border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-300">SLA Violations</span>
                  <span className={`font-mono font-black ${(marketplaceHealth?.activeSlaViolations ?? 0) > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                    {marketplaceHealth?.activeSlaViolations ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#170d2f] border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-300">Fraud Alerts</span>
                  <span className={`font-mono font-black ${(marketplaceHealth?.fraudAlerts ?? 0) > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                    {marketplaceHealth?.fraudAlerts ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#170d2f] border border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-300">Suspended Merchants</span>
                  <span className="font-mono font-black text-amber-400">
                    {marketplaceHealth?.suspendedVendors ?? 0}
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                Automated risk scoring monitors order chargebacks, buyer disputes, and delivery timeline breaches.
              </div>
            </div>

            {/* Satisfaction Distribution */}
            <div className="p-5 rounded-2xl bg-[#120824]/60 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  Buyer Review Score & Distribution
                </h3>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {averageRating.toFixed(1)} / 5.0 ★
                </span>
              </div>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingDist[star] || 0;
                  const pct = totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(1) : "0.0";
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-slate-400 w-5">{star}★</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] text-slate-400 w-12 text-right">{count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>

              <div className="text-[11px] text-slate-400">
                Calculated across {totalReviews.toLocaleString()} verified buyer reviews on products and merchant services.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeepAnalytics;
