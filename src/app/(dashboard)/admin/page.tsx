'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Bell,
    Store,
    Users,
    CheckCheck,
    Trash2,
    Sparkles,
    Radio,
    Search,
    ShieldAlert,
    Package,
    ArrowUpRight,
    UserCheck,
    Calendar,
    Filter,
    CheckCircle2
} from 'lucide-react';
import { useNotification } from '@/src/context/NotificationContext';
import { TNotification } from '@/src/types/notification';

const AdminDashboard = () => {
    const {
        notifications,
        unreadCount,
        status,
        markAsRead,
        markAllAsRead,
        clearAll,
        sendTestNotification,
    } = useNotification();

    const [activeTab, setActiveTab] = useState<'all' | 'vendor' | 'customer' | 'unread'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const isConnected = status === 'connected';

    // Counts for stats cards
    const vendorNotifsCount = useMemo(
        () =>
            notifications.filter(
                (n) =>
                    n.type === 'NEW_ACCOUNT' &&
                    n.message?.toLowerCase().includes('vendor')
            ).length,
        [notifications]
    );

    const customerNotifsCount = useMemo(
        () =>
            notifications.filter(
                (n) =>
                    n.type === 'NEW_ACCOUNT' &&
                    n.message?.toLowerCase().includes('customer')
            ).length,
        [notifications]
    );

    // Filtered notifications
    const filteredNotifications = useMemo(() => {
        return notifications.filter((n) => {
            const matchesSearch =
                !searchTerm ||
                n.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.type?.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (activeTab === 'unread') return !n.isRead;
            if (activeTab === 'vendor') {
                return (
                    n.type === 'NEW_ACCOUNT' &&
                    n.message?.toLowerCase().includes('vendor')
                );
            }
            if (activeTab === 'customer') {
                return (
                    n.type === 'NEW_ACCOUNT' &&
                    n.message?.toLowerCase().includes('customer')
                );
            }
            return true;
        });
    }, [notifications, activeTab, searchTerm]);

    const formatTimeAgo = (dateString?: string) => {
        if (!dateString) return 'Just now';
        const diffMs = Date.now() - new Date(dateString).getTime();
        const diffSec = Math.floor(diffMs / 1000);
        if (diffSec < 60) return 'Just now';
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHrs = Math.floor(diffMin / 60);
        if (diffHrs < 24) return `${diffHrs}h ago`;
        const diffDays = Math.floor(diffHrs / 24);
        return `${diffDays}d ago`;
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Top Overview Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute right-1/3 -bottom-16 w-64 h-64 bg-warning/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="badge badge-primary badge-sm font-bold uppercase tracking-wider">
                                Live Overview
                            </span>
                            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur border border-white/10 text-white">
                                <span
                                    className={`w-2 h-2 rounded-full ${
                                        isConnected
                                            ? 'bg-emerald-400 animate-pulse'
                                            : status === 'connecting'
                                            ? 'bg-amber-400'
                                            : 'bg-rose-400'
                                    }`}
                                />
                                <span>Socket: {isConnected ? 'Live & Connected' : status}</span>
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            Admin Operations & Activity Hub
                        </h1>
                        <p className="text-sm text-gray-400 mt-1 max-w-xl">
                            Real-time platform telemetry. Track newly registered vendors, customers, live order activities, and alerts across Amarzone.
                        </p>
                    </div>

                    {/* Quick Simulation & Mark All Read */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() =>
                                sendTestNotification({
                                    type: 'NEW_ACCOUNT',
                                    message: `A new vendor account (Apex Store #${Math.floor(100 + Math.random() * 900)}) has been created.`,
                                })
                            }
                            className="btn btn-warning btn-sm gap-1.5 text-slate-950 font-black shadow-lg shadow-warning/20 hover:scale-102 transition"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Simulate Vendor Signup</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Alerts */}
                <div className="card bg-base-100 border border-base-200 shadow-sm p-5 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
                            Total Alerts
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold">
                            <Bell className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-3xl font-black text-base-content">{notifications.length}</span>
                        <p className="text-[11px] text-base-content/50 mt-0.5">Persistent across sessions</p>
                    </div>
                </div>

                {/* Unread Alerts */}
                <div className="card bg-base-100 border border-base-200 shadow-sm p-5 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
                            Unread Alerts
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-error/15 text-error flex items-center justify-center font-bold">
                            <Radio className="w-4 h-4 animate-pulse" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-3xl font-black text-error">{unreadCount}</span>
                        <p className="text-[11px] text-base-content/50 mt-0.5">Require administrator review</p>
                    </div>
                </div>

                {/* Vendor Signups */}
                <div className="card bg-base-100 border border-base-200 shadow-sm p-5 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
                            New Vendors
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-warning/15 text-warning flex items-center justify-center font-bold">
                            <Store className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-3xl font-black text-warning">{vendorNotifsCount}</span>
                        <p className="text-[11px] text-base-content/50 mt-0.5">Storefront registrations</p>
                    </div>
                </div>

                {/* Customer Signups */}
                <div className="card bg-base-100 border border-base-200 shadow-sm p-5 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
                            New Customers
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-info/15 text-info flex items-center justify-center font-bold">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-3xl font-black text-info">{customerNotifsCount}</span>
                        <p className="text-[11px] text-base-content/50 mt-0.5">Buyer member signups</p>
                    </div>
                </div>
            </div>

            {/* Main Notifications Section */}
            <div id="notifications-section" className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
                {/* Header & Controls */}
                <div className="p-5 border-b border-base-200 bg-base-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-base-content tracking-tight">
                                Live Notification Stream
                            </h2>
                            <p className="text-xs text-base-content/60">
                                Real-time WebSocket feed. Instant updates when vendors or customers register.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                className="btn btn-sm btn-ghost gap-1.5 text-xs font-bold hover:text-primary"
                            >
                                <CheckCheck className="w-4 h-4" />
                                <span>Mark All Read</span>
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button
                                type="button"
                                onClick={clearAll}
                                className="btn btn-sm btn-ghost text-error gap-1.5 text-xs font-bold hover:bg-error/10"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Clear All</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="p-4 border-b border-base-200 bg-base-200/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Tabs */}
                    <div className="join bg-base-300/80 p-1 rounded-xl w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab('all')}
                            className={`join-item px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'all'
                                    ? 'bg-base-100 text-primary shadow-sm font-extrabold'
                                    : 'text-base-content/70 hover:text-base-content'
                            }`}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('vendor')}
                            className={`join-item px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'vendor'
                                    ? 'bg-base-100 text-warning shadow-sm font-extrabold'
                                    : 'text-base-content/70 hover:text-base-content'
                            }`}
                        >
                            Vendors ({vendorNotifsCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('customer')}
                            className={`join-item px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'customer'
                                    ? 'bg-base-100 text-info shadow-sm font-extrabold'
                                    : 'text-base-content/70 hover:text-base-content'
                            }`}
                        >
                            Customers ({customerNotifsCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('unread')}
                            className={`join-item px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                activeTab === 'unread'
                                    ? 'bg-base-100 text-error shadow-sm font-extrabold'
                                    : 'text-base-content/70 hover:text-base-content'
                            }`}
                        >
                            Unread ({unreadCount})
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Filter alerts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-sm input-bordered w-full pl-9 rounded-xl bg-base-100 text-xs focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                {/* Notifications List */}
                <div className="divide-y divide-base-200 max-h-[500px] overflow-y-auto">
                    {filteredNotifications.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-3 text-base-content/40">
                                <Bell className="w-8 h-8" />
                            </div>
                            <h3 className="text-sm font-bold text-base-content">
                                {searchTerm
                                    ? `No notifications matching "${searchTerm}"`
                                    : activeTab === 'unread'
                                    ? 'All notifications have been read'
                                    : 'No notifications yet'}
                            </h3>
                            <p className="text-xs text-base-content/50 mt-1 max-w-sm mx-auto">
                                New alerts will appear here in real-time as vendors register, buyers make purchases, or users join Amarzone.
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((item: TNotification) => {
                            const isVendor = item.message?.toLowerCase().includes('vendor');
                            const isCustomer = item.message?.toLowerCase().includes('customer');

                            return (
                                <div
                                    key={item.id}
                                    className={`p-4 sm:p-5 flex items-start gap-4 transition-all hover:bg-base-200/40 ${
                                        !item.isRead ? 'bg-primary/5' : ''
                                    }`}
                                >
                                    {/* Icon */}
                                    <div
                                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                                            isVendor
                                                ? 'bg-warning/15 border-warning/30 text-warning'
                                                : isCustomer
                                                ? 'bg-info/15 border-info/30 text-info'
                                                : 'bg-primary/15 border-primary/30 text-primary'
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

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="text-xs font-black text-base-content">
                                                {item.title ||
                                                    (isVendor
                                                        ? 'New Vendor Registered'
                                                        : isCustomer
                                                        ? 'New Customer Registered'
                                                        : 'System Notification')}
                                            </span>

                                            {/* Tag Badge */}
                                            <span
                                                className={`badge badge-xs font-bold uppercase tracking-wider py-1.5 ${
                                                    isVendor
                                                        ? 'badge-warning'
                                                        : isCustomer
                                                        ? 'badge-info'
                                                        : 'badge-ghost'
                                                }`}
                                            >
                                                {isVendor
                                                    ? 'Vendor Account'
                                                    : isCustomer
                                                    ? 'Customer Account'
                                                    : item.type}
                                            </span>

                                            <span className="text-[11px] text-base-content/50 ml-auto flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatTimeAgo(item.createdAt)}</span>
                                            </span>
                                        </div>

                                        <p className="text-xs sm:text-sm text-base-content/85 leading-relaxed font-medium">
                                            {item.message}
                                        </p>

                                        {/* Action footer */}
                                        <div className="mt-2.5 flex items-center gap-2">
                                            {!item.isRead ? (
                                                <button
                                                    type="button"
                                                    onClick={() => markAsRead(item.id)}
                                                    className="btn btn-xs btn-outline btn-primary gap-1 font-bold text-[10px]"
                                                >
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    <span>Mark as read</span>
                                                </button>
                                            ) : (
                                                <span className="text-[10px] text-base-content/40 font-semibold flex items-center gap-1">
                                                    <CheckCheck className="w-3 h-3 text-success" />
                                                    <span>Read</span>
                                                </span>
                                            )}

                                            {isVendor && (
                                                <Link
                                                    href="/admin/vendors"
                                                    className="btn btn-xs btn-ghost gap-1 text-[10px] text-warning hover:bg-warning/10 font-bold"
                                                >
                                                    <span>Review Vendors</span>
                                                    <ArrowUpRight className="w-3 h-3" />
                                                </Link>
                                            )}

                                            {isCustomer && (
                                                <Link
                                                    href="/admin/customers"
                                                    className="btn btn-xs btn-ghost gap-1 text-[10px] text-info hover:bg-info/10 font-bold"
                                                >
                                                    <span>View Customers</span>
                                                    <ArrowUpRight className="w-3 h-3" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {/* Unread indicator bullet */}
                                    {!item.isRead && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-2 animate-pulse" />
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

export default AdminDashboard;