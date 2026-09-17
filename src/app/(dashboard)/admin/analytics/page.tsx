"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
    Bell,
    Store,
    Users,
    CheckCheck,
    Trash2,
    Sparkles,
    Radio,
    Search,
    ArrowUpRight,
    UserCheck,
    Calendar,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
} from "lucide-react";
import { useNotification } from "@/src/context/NotificationContext";
import { TNotification } from "@/src/types/notification";
import { useDashboardStatsQuery } from "@/redux/features/dashboard/dashboardApi";
import { TDashboardDateRange, TDashboardStatsData } from "@/src/types/dashboard";
import { AdminDashboardHeader } from "@/src/components/ui/analistics/admin/overview/AdminDashboardHeader";
import { AdminOverviewStats } from "@/src/components/ui/analistics/admin/overview/AdminOverviewStats";
import { AdminLineChart } from "@/src/components/ui/analistics/admin/overview/AdminLineChart";
import { AdminPieChart } from "@/src/components/ui/analistics/admin/overview/AdminPieChart";
import { AdminBarChart } from "@/src/components/ui/analistics/admin/overview/AdminBarChart";
import { AdminTopPerformance } from "@/src/components/ui/analistics/admin/overview/AdminTopPerformance";
import { AdminDeepAnalytics } from "@/src/components/ui/analistics/admin/overview/AdminDeepAnalytics";

const AdminAnalystics: React.FC = () => {
    const [selectedRange, setSelectedRange] = useState<TDashboardDateRange>("30_days");
    const [customStartDate, setCustomStartDate] = useState<string>("");
    const [customEndDate, setCustomEndDate] = useState<string>("");

    // Query real dashboard statistics from backend /dashboard/stats API
    const {
        data: apiResponse,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useDashboardStatsQuery({
        range: selectedRange,
        startDate: selectedRange === "custom" ? customStartDate : undefined,
        endDate: selectedRange === "custom" ? customEndDate : undefined,
    });

    const statsData: TDashboardStatsData | undefined = apiResponse?.data;

    // Real-time socket & notifications context
    const {
        notifications,
        unreadCount,
        status,
        markAsRead,
        markAllAsRead,
        clearAll,
        refetchNotifications,
    } = useNotification();

    const [activeTab, setActiveTab] = useState<"all" | "vendor" | "customer" | "unread">("all");
    const [searchTerm, setSearchTerm] = useState("");

    const isConnected = status === "connected";

    // Filter notifications for the hub
    const filteredNotifications = useMemo(() => {
        return notifications.filter((n) => {
            const matchesSearch =
                !searchTerm ||
                n.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.type?.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (activeTab === "unread") return !n.isRead;
            if (activeTab === "vendor") {
                return n.type === "NEW_ACCOUNT" && n.message?.toLowerCase().includes("vendor");
            }
            if (activeTab === "customer") {
                return n.type === "NEW_ACCOUNT" && n.message?.toLowerCase().includes("customer");
            }
            return true;
        });
    }, [notifications, activeTab, searchTerm]);

    const vendorNotifsCount = useMemo(
        () =>
            notifications.filter(
                (n) => n.type === "NEW_ACCOUNT" && n.message?.toLowerCase().includes("vendor")
            ).length,
        [notifications]
    );

    const customerNotifsCount = useMemo(
        () =>
            notifications.filter(
                (n) => n.type === "NEW_ACCOUNT" && n.message?.toLowerCase().includes("customer")
            ).length,
        [notifications]
    );

    const formatTimeAgo = (dateString?: string) => {
        if (!dateString) return "Just now";
        const diffMs = Date.now() - new Date(dateString).getTime();
        const diffSec = Math.floor(diffMs / 1000);
        if (diffSec < 60) return "Just now";
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHrs = Math.floor(diffMin / 60);
        if (diffHrs < 24) return `${diffHrs}h ago`;
        const diffDays = Math.floor(diffHrs / 24);
        return `${diffDays}d ago`;
    };

    return (
        <div className="space-y-6 pb-14 w-full">
            {/* 1. Header with Live Telemetry, Range Filtering (Today, 7D, 30D, Custom) & Refresh */}
            <AdminDashboardHeader
                selectedRange={selectedRange}
                onRangeChange={(newRange, start, end) => {
                    setSelectedRange(newRange);
                    if (start && end) {
                        setCustomStartDate(start);
                        setCustomEndDate(end);
                    }
                }}
                onRefresh={() => refetch()}
                isFetching={isFetching}
                socketConnected={isConnected}
                customStartDate={customStartDate}
                customEndDate={customEndDate}
            />

            {/* Loading Skeleton */}
            {isLoading && (
                <div className="space-y-6 animate-pulse">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-32 rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 p-5"
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-80 rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10" />
                        <div className="h-80 rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10" />
                    </div>
                </div>
            )}

            {/* Error Retry Banner */}
            {isError && !isLoading && (
                <div className="card bg-[#170d2f] border border-rose-500/30 shadow-2xl p-6 rounded-2xl sm:rounded-3xl">
                    <div className="flex items-center gap-3 text-rose-400">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-sm font-extrabold text-white">
                                Failed to Retrieve Live Statistics
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {(error as { data?: { message?: string } })?.data?.message ||
                                    "An unexpected error occurred while communicating with /stats."}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="btn btn-sm btn-outline border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl gap-2 font-bold"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Retry</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Dashboard Content when Loaded */}
            {statsData && !isLoading && (
                <>
                    {/* 2. Primary KPI Cards & Pipeline Progression Strip */}
                    <AdminOverviewStats
                        overviewCards={statsData.overviewCards}
                        users={statsData.users}
                        products={statsData.products}
                        inventory={statsData.inventory}
                    />

                    {/* 3. Time Series Analytics: Revenue Over Time & Orders Over Time Line Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Line Chart 1: Revenue over time */}
                        <AdminLineChart
                            title="Revenue Over Time"
                            subtitle="Daily gross revenue curve across the active timeframe."
                            forcedMetric="revenue"
                            revenueData={
                                statsData.charts?.revenueChart ||
                                statsData.ordersAnalytics?.revenuePerDay?.map((d) => ({
                                    label: d.date,
                                    value: d.revenue,
                                }))
                            }
                        />

                        {/* Line Chart 2: Orders over time */}
                        <AdminLineChart
                            title="Orders Over Time"
                            subtitle="Daily fulfillment order velocity across the active timeframe."
                            forcedMetric="orders"
                            ordersData={
                                statsData.charts?.ordersChart ||
                                statsData.ordersAnalytics?.ordersPerDay?.map((d) => ({
                                    label: d.date,
                                    value: d.count,
                                }))
                            }
                        />
                    </div>

                    {/* 4. Distribution & Rankings: Orders by status (Pie Chart) & Sales by department/category (Bar Chart) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Orders by status → Pie Chart */}
                        <AdminPieChart
                            orderStatusData={statsData.charts?.orderStatusPieChart}
                            paymentStatusData={statsData.charts?.paymentStatusPieChart}
                        />

                        {/* Sales by department & Sales by category → Bar Chart */}
                        <AdminBarChart
                            departmentSalesData={statsData.charts?.departmentSalesChart}
                            categorySalesData={statsData.charts?.categorySalesChart}
                            userGrowthData={statsData.charts?.userGrowthChart}
                            defaultView="departments"
                        />
                    </div>

                    {/* 5. Deep System Analytics (Vendor Performance, Customer Growth, Product Performance, Order/Payment Statistics, Detailed Statistics) */}
                    <AdminDeepAnalytics
                        overviewCards={statsData.overviewCards}
                        users={statsData.users}
                        products={statsData.products}
                        inventory={statsData.inventory}
                        payments={statsData.payments}
                        topLists={statsData.topLists}
                        reviews={statsData.reviews}
                        marketplaceHealth={statsData.marketplaceHealth}
                    />

                    {/* 6. Top Performance Leaderboards & Trust Score */}
                    <AdminTopPerformance
                        topLists={statsData.topLists}
                        reviews={statsData.reviews}
                        marketplaceHealth={statsData.marketplaceHealth}
                    />
                </>
            )}

            {/* 6. Live Notifications & Activity Hub (Preserves #notifications-section) */}
            <div
                id="notifications-section"
                className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl"
            >
                {/* Glowing top line */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-gradient-to-br from-amber-500/10 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

                <div className="relative z-10 p-5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-amber-400">
                                <Bell className="w-4 h-4" />
                            </span>
                            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                                Live Notification & Event Feed
                            </h2>
                            {unreadCount > 0 && (
                                <span className="badge badge-warning text-slate-950 font-black text-xs">
                                    {unreadCount} unread
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-400">
                            Real-time socket alerts for merchant onboarding, buyer registrations, and order triggers.
                        </p>
                    </div>

                    {/* Quick Hub Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={() => refetchNotifications()}
                            className="btn btn-ghost btn-xs sm:btn-sm gap-1.5 text-slate-200 border border-white/10 hover:border-amber-400/50 hover:text-white font-bold rounded-xl"
                            title="Refresh database notifications"
                        >
                            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                            <span>Sync DB</span>
                        </button>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                className="btn btn-ghost btn-xs sm:btn-sm gap-1 text-slate-300 hover:text-white border border-white/10 rounded-xl"
                            >
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Mark all read</span>
                            </button>
                        )}

                        {notifications.length > 0 && (
                            <button
                                type="button"
                                onClick={clearAll}
                                className="btn btn-ghost btn-xs sm:btn-sm text-slate-400 hover:text-rose-400 border border-white/10 rounded-xl"
                                title="Clear all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Tabs & Search */}
                <div className="relative z-10 p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#120824]/50">
                    <div className="flex items-center gap-1 bg-[#120824] border border-white/15 rounded-xl p-1 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab("all")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "all"
                                ? "bg-amber-400 text-slate-950 font-black shadow-sm"
                                : "text-slate-300 hover:text-white"
                                }`}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("vendor")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "vendor"
                                ? "bg-amber-400 text-slate-950 font-black shadow-sm"
                                : "text-slate-300 hover:text-white"
                                }`}
                        >
                            Vendors ({vendorNotifsCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("customer")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "customer"
                                ? "bg-amber-400 text-slate-950 font-black shadow-sm"
                                : "text-slate-300 hover:text-white"
                                }`}
                        >
                            Customers ({customerNotifsCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("unread")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "unread"
                                ? "bg-amber-400 text-slate-950 font-black shadow-sm"
                                : "text-slate-300 hover:text-white"
                                }`}
                        >
                            Unread ({unreadCount})
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-sm w-full pl-9 rounded-xl bg-[#120824] border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                        />
                    </div>
                </div>

                {/* Notifications List */}
                <div className="relative z-10 divide-y divide-white/5 max-h-[460px] overflow-y-auto">
                    {filteredNotifications.length === 0 ? (
                        <div className="py-16 text-center text-slate-400 space-y-2">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                                <Bell className="w-6 h-6" />
                            </div>
                            <h3 className="text-sm font-extrabold text-white">
                                {searchTerm
                                    ? `No alerts matching "${searchTerm}"`
                                    : activeTab === "unread"
                                        ? "All alerts have been reviewed"
                                        : "No notifications recorded yet"}
                            </h3>
                            <p className="text-xs max-w-sm mx-auto text-slate-400">
                                New real-time notifications from Socket.IO will appear here instantly.
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((item: TNotification) => {
                            const isVendor = item.message?.toLowerCase().includes("vendor");
                            const isCustomer = item.message?.toLowerCase().includes("customer");

                            return (
                                <div
                                    key={item.id}
                                    className={`p-4 sm:p-5 flex items-start gap-4 transition-all hover:bg-white/[0.03] ${!item.isRead ? "bg-amber-400/[0.04]" : ""
                                        }`}
                                >
                                    {/* Icon */}
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isVendor
                                            ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                                            : isCustomer
                                                ? "bg-cyan-400/10 border-cyan-400/30 text-cyan-400"
                                                : "bg-purple-400/10 border-purple-400/30 text-purple-400"
                                            }`}
                                    >
                                        {isVendor ? (
                                            <Store className="w-5 h-5" />
                                        ) : isCustomer ? (
                                            <UserCheck className="w-5 h-5" />
                                        ) : (
                                            <Bell className="w-5 h-5" />
                                        )}
                                    </div>

                                    {/* Body */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="text-xs font-black text-white">
                                                {item.title ||
                                                    (isVendor
                                                        ? "New Vendor Registered"
                                                        : isCustomer
                                                            ? "New Customer Registered"
                                                            : "System Alert")}
                                            </span>

                                            <span
                                                className={`badge badge-xs font-bold uppercase tracking-wider py-1.5 ${isVendor
                                                    ? "badge-warning"
                                                    : isCustomer
                                                        ? "badge-info"
                                                        : "badge-ghost"
                                                    }`}
                                            >
                                                {isVendor ? "Vendor" : isCustomer ? "Customer" : item.type}
                                            </span>

                                            <span className="text-[10px] text-slate-400 ml-auto flex items-center gap-1 font-mono">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatTimeAgo(item.createdAt)}</span>
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                            {item.message}
                                        </p>

                                        {/* Actions */}
                                        <div className="mt-2.5 flex items-center gap-2">
                                            {!item.isRead ? (
                                                <button
                                                    type="button"
                                                    onClick={() => markAsRead(item.id)}
                                                    className="btn btn-xs btn-outline border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-slate-950 gap-1 font-bold text-[10px] rounded-lg cursor-pointer"
                                                >
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    <span>Mark as read</span>
                                                </button>
                                            ) : (
                                                <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                                                    <CheckCheck className="w-3 h-3 text-emerald-400" />
                                                    <span>Read</span>
                                                </span>
                                            )}

                                            {isVendor && (
                                                <Link
                                                    href="/admin/vendors"
                                                    className="btn btn-xs btn-ghost gap-1 text-[10px] text-amber-400 hover:bg-amber-400/10 font-bold rounded-lg"
                                                >
                                                    <span>Review Vendors</span>
                                                    <ArrowUpRight className="w-3 h-3" />
                                                </Link>
                                            )}

                                            {isCustomer && (
                                                <Link
                                                    href="/admin/customers"
                                                    className="btn btn-xs btn-ghost gap-1 text-[10px] text-cyan-400 hover:bg-cyan-400/10 font-bold rounded-lg"
                                                >
                                                    <span>View Customers</span>
                                                    <ArrowUpRight className="w-3 h-3" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {!item.isRead && (
                                        <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-2 animate-pulse" />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalystics;