'use client';

import React, { useState, Suspense } from 'react';
import { useDashboardStatsQuery } from '@/redux/features/dashboard/dashboardApi';
import AdminDataSection from '@/components/dashboard/admin/AdminDataSection';
import VendorDataSection from '@/components/dashboard/admin/VendorDataSection';
import ProductDataSection from '@/components/dashboard/admin/ProductDataSection';
import TableSkeleton from '@/components/shared/TableSkeleton';
import {
    DollarSign,
    ShoppingBag,
    Users,
    Store,
    Layers,
    ShieldAlert,
    Sparkles,
    CheckCircle2,
    Clock,
    Download,
    UserCheck,
    TrendingUp,
    ExternalLink
} from 'lucide-react';

interface OrderItem {
    id: string;
    customerName: string;
    customerAvatar: string;
    email: string;
    date: string;
    totalAmount: number;
    paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
    deliveryStatus: 'DELIVERED' | 'SHIPPED' | 'PROCESSING' | 'CANCELLED';
    itemsCount: number;
}

const RECENT_ORDERS: OrderItem[] = [
    {
        id: 'ORD-9842',
        customerName: 'Eleanor Vance',
        customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        email: 'eleanor.v@example.com',
        date: 'Today, 14:32',
        totalAmount: 349.99,
        paymentStatus: 'PAID',
        deliveryStatus: 'PROCESSING',
        itemsCount: 3,
    },
    {
        id: 'ORD-9841',
        customerName: 'Marcus Sterling',
        customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        email: 'marcus.s@example.com',
        date: 'Today, 11:15',
        totalAmount: 1250.00,
        paymentStatus: 'PAID',
        deliveryStatus: 'SHIPPED',
        itemsCount: 1,
    },
    {
        id: 'ORD-9840',
        customerName: 'Sophia Lin',
        customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        email: 'sophia.lin@example.com',
        date: 'Yesterday, 18:40',
        totalAmount: 89.50,
        paymentStatus: 'PAID',
        deliveryStatus: 'DELIVERED',
        itemsCount: 2,
    },
    {
        id: 'ORD-9839',
        customerName: 'David K. Miller',
        customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        email: 'd.miller@example.com',
        date: 'Yesterday, 09:12',
        totalAmount: 520.00,
        paymentStatus: 'PENDING',
        deliveryStatus: 'PROCESSING',
        itemsCount: 4,
    },
    {
        id: 'ORD-9838',
        customerName: 'Amara Chen',
        customerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        email: 'amara.c@example.com',
        date: '05 Aug, 2026',
        totalAmount: 210.75,
        paymentStatus: 'REFUNDED',
        deliveryStatus: 'CANCELLED',
        itemsCount: 1,
    },
];

const PENDING_VENDORS = [
    {
        id: 'VEND-881',
        storeName: 'Nexus Tech Gadgets',
        ownerName: 'Liam Hemsworth',
        email: 'liam.n@example.com',
        category: 'Consumer Electronics',
        submittedDate: '10 mins ago',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
        id: 'VEND-882',
        storeName: 'Velvet Threads Fashion',
        ownerName: 'Chloe Bennett',
        email: 'chloe.v@example.com',
        category: 'Apparel & Accessories',
        submittedDate: '2 hours ago',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
        id: 'VEND-883',
        storeName: 'Aura Home & Decor',
        ownerName: 'Oliver Vance',
        email: 'oliver.a@example.com',
        category: 'Home & Living',
        submittedDate: '5 hours ago',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
];

const AdminDashboardPage = () => {
    const { data: statsData } = useDashboardStatsQuery(undefined);
    const [activeTab, setActiveTab] = useState<'month' | 'week' | 'year'>('month');

    const stats = statsData?.data;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* HERO EXECUTIVE HEADER CARD (DaisyUI Card) */}
            <div className="card bg-base-100 shadow-xl border border-base-200">
                <div className="card-body flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="badge badge-primary gap-1 px-3 py-2 text-xs font-black shadow">
                                <Sparkles className="w-3.5 h-3.5" />
                                DaisyUI Executive Control
                            </span>
                            <span className="badge badge-success badge-outline gap-1 font-bold text-xs">
                                <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                                Live Production Telemetry
                            </span>
                        </div>

                        <h1 className="text-3xl font-black tracking-tight">
                            Admin <span className="text-primary">Dashboard</span> Overview
                        </h1>
                        <p className="text-base-content/70 text-xs sm:text-sm max-w-2xl">
                            Real-time gross merchandise value, marketplace transaction logs, vendor applications, and platform commission.
                        </p>
                    </div>

                    {/* DaisyUI Tabs & Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div role="tablist" className="tabs tabs-boxed bg-base-200 p-1">
                            <button
                                role="tab"
                                type="button"
                                onClick={() => setActiveTab('week')}
                                className={`tab tab-sm font-bold ${activeTab === 'week' ? 'tab-active' : ''}`}
                            >
                                This Week
                            </button>
                            <button
                                role="tab"
                                type="button"
                                onClick={() => setActiveTab('month')}
                                className={`tab tab-sm font-bold ${activeTab === 'month' ? 'tab-active' : ''}`}
                            >
                                This Month
                            </button>
                            <button
                                role="tab"
                                type="button"
                                onClick={() => setActiveTab('year')}
                                className={`tab tab-sm font-bold ${activeTab === 'year' ? 'tab-active' : ''}`}
                            >
                                YTD Year
                            </button>
                        </div>

                        <button type="button" className="btn btn-primary btn-sm gap-2">
                            <Download className="w-4 h-4" />
                            <span>Export Report</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* DAISYUI STATS COMPONENT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Stat 1 */}
                <div className="stats bg-base-100 shadow-lg border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-warning">
                            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center border border-warning/30">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="stat-title text-xs font-extrabold uppercase">Gross Revenue (GMV)</div>
                        <div className="stat-value text-2xl text-warning">
                            {stats?.totalRevenue ? `$${stats.totalRevenue.toLocaleString()}` : '$1,842,500'}
                        </div>
                        <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
                            ↗︎ 18.4% vs last period
                        </div>
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="stats bg-base-100 shadow-lg border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-success">
                            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center border border-success/30">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="stat-title text-xs font-extrabold uppercase">Total Orders</div>
                        <div className="stat-value text-2xl text-success">
                            {stats?.totalOrders ? stats.totalOrders.toLocaleString() : '12,480'}
                        </div>
                        <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
                            ↗︎ 12.1% (142 pending fulfillment)
                        </div>
                    </div>
                </div>

                {/* Stat 3 */}
                <div className="stats bg-base-100 shadow-lg border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-info">
                            <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center border border-info/30">
                                <Store className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="stat-title text-xs font-extrabold uppercase">Verified Vendors</div>
                        <div className="stat-value text-2xl text-info">
                            {stats?.totalVendors ? `${stats.totalVendors}` : '428'} Stores
                        </div>
                        <div className="stat-desc font-bold text-warning flex items-center gap-1 mt-1">
                            3 applications pending review
                        </div>
                    </div>
                </div>

                {/* Stat 4 */}
                <div className="stats bg-base-100 shadow-lg border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-accent">
                            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30">
                                <Users className="w-6 h-6 text-accent" />
                            </div>
                        </div>
                        <div className="stat-title text-xs font-extrabold uppercase">Active Customers</div>
                        <div className="stat-value text-2xl text-accent">
                            {stats?.totalCustomers ? stats.totalCustomers.toLocaleString() : '48,920'}
                        </div>
                        <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
                            ↗︎ 8.5% new buyers registered
                        </div>
                    </div>
                </div>

                {/* Stat 5 */}
                <div className="stats bg-base-100 shadow-lg border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center border border-secondary/30">
                                <Layers className="w-6 h-6 text-secondary" />
                            </div>
                        </div>
                        <div className="stat-title text-xs font-extrabold uppercase">Net Platform Fee</div>
                        <div className="stat-value text-2xl text-secondary">
                            {stats?.netCommission ? `$${stats.netCommission.toLocaleString()}` : '$184,250'}
                        </div>
                        <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
                            ↗︎ 22.8% (10% average fee cut)
                        </div>
                    </div>
                </div>

                {/* Stat 6 */}
                <div className="stats bg-base-100 shadow-lg border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-error">
                            <div className="w-12 h-12 rounded-xl bg-error/20 flex items-center justify-center border border-error/30">
                                <ShieldAlert className="w-6 h-6 text-error" />
                            </div>
                        </div>
                        <div className="stat-title text-xs font-extrabold uppercase">Open Disputes</div>
                        <div className="stat-value text-2xl text-error">3 Open</div>
                        <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
                            99.8% Healthy SLA (1.2h response)
                        </div>
                    </div>
                </div>
            </div>

            {/* DAISYUI CARDS: CATEGORY DISTRIBUTION & SALES HIGHLIGHTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Category Progress Breakdown (DaisyUI Progress Bars) */}
                <div className="card bg-base-100 shadow-xl border border-base-200 lg:col-span-2">
                    <div className="card-body">
                        <div className="flex items-center justify-between pb-3 border-b border-base-200">
                            <h2 className="card-title text-base font-extrabold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Category Revenue Performance
                            </h2>
                            <span className="badge badge-neutral text-xs font-bold">8 Categories</span>
                        </div>

                        <div className="space-y-4 pt-3">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span>Consumer Electronics</span>
                                    <span className="text-primary">$700,150 (38%)</span>
                                </div>
                                <progress className="progress progress-primary w-full h-3" value="38" max="100" />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span>Apparel & Fashion</span>
                                    <span className="text-secondary">$442,200 (24%)</span>
                                </div>
                                <progress className="progress progress-secondary w-full h-3" value="24" max="100" />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span>Home & Living</span>
                                    <span className="text-accent">$331,650 (18%)</span>
                                </div>
                                <progress className="progress progress-accent w-full h-3" value="18" max="100" />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span>Beauty & Personal Care</span>
                                    <span className="text-warning">$221,100 (12%)</span>
                                </div>
                                <progress className="progress progress-warning w-full h-3" value="12" max="100" />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span>Sports & Outdoors</span>
                                    <span className="text-info">$147,400 (8%)</span>
                                </div>
                                <progress className="progress progress-info w-full h-3" value="8" max="100" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Marketplace Quick Summary */}
                <div className="card bg-base-100 shadow-xl border border-base-200 lg:col-span-1">
                    <div className="card-body justify-between">
                        <div>
                            <h2 className="card-title text-base font-extrabold mb-2">
                                Marketplace Telemetry
                            </h2>
                            <p className="text-xs text-base-content/70">
                                Live operational stats across customer orders and payout distributions.
                            </p>
                        </div>

                        <div className="space-y-3 my-4">
                            <div className="alert alert-success shadow-sm py-3 text-xs">
                                <CheckCircle2 className="w-4 h-4" />
                                <div>
                                    <span className="font-bold block">Payout Batch Prepared</span>
                                    <span className="text-[10px]">5 seller payouts ready for release.</span>
                                </div>
                            </div>

                            <div className="alert alert-info shadow-sm py-3 text-xs">
                                <Clock className="w-4 h-4" />
                                <div>
                                    <span className="font-bold block">System Audit Complete</span>
                                    <span className="text-[10px]">Security scan returned 0 vulnerabilities.</span>
                                </div>
                            </div>
                        </div>

                        <button type="button" className="btn btn-warning btn-block btn-sm">
                            Manage All Marketplace Tasks
                        </button>
                    </div>
                </div>
            </div>

            {/* DAISYUI TABLE: RECENT ORDERS */}
            <div className="card bg-base-100 shadow-xl border border-base-200">
                <div className="card-body">
                    <div className="flex items-center justify-between pb-3 border-b border-base-200">
                        <div>
                            <h2 className="card-title text-base font-extrabold">Recent Platform Orders</h2>
                            <p className="text-xs text-base-content/70">Latest transaction fulfillment status</p>
                        </div>
                        <button type="button" className="btn btn-ghost btn-sm text-primary font-bold gap-1">
                            <span>View All</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full text-xs">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Payment Status</th>
                                    <th>Delivery Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RECENT_ORDERS.map((order) => (
                                    <tr key={order.id}>
                                        <td className="font-mono font-bold text-primary">{order.id}</td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="w-8 h-8 rounded-full">
                                                        <img src={order.customerAvatar} alt={order.customerName} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{order.customerName}</div>
                                                    <div className="text-[10px] text-base-content/60">{order.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{order.date}</td>
                                        <td className="font-extrabold">${order.totalAmount.toFixed(2)}</td>
                                        <td>
                                            {order.paymentStatus === 'PAID' && (
                                                <span className="badge badge-success badge-sm font-bold">PAID</span>
                                            )}
                                            {order.paymentStatus === 'PENDING' && (
                                                <span className="badge badge-warning badge-sm font-bold">PENDING</span>
                                            )}
                                            {order.paymentStatus === 'REFUNDED' && (
                                                <span className="badge badge-error badge-sm font-bold">REFUNDED</span>
                                            )}
                                        </td>
                                        <td>
                                            {order.deliveryStatus === 'DELIVERED' && (
                                                <span className="badge badge-success badge-outline badge-sm font-bold">DELIVERED</span>
                                            )}
                                            {order.deliveryStatus === 'SHIPPED' && (
                                                <span className="badge badge-info badge-outline badge-sm font-bold">SHIPPED</span>
                                            )}
                                            {order.deliveryStatus === 'PROCESSING' && (
                                                <span className="badge badge-warning badge-outline badge-sm font-bold">PROCESSING</span>
                                            )}
                                            {order.deliveryStatus === 'CANCELLED' && (
                                                <span className="badge badge-error badge-outline badge-sm font-bold">CANCELLED</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* DYNAMIC ADMIN DATA SECTION WITH REACT SUSPENSE LOADING */}
            <Suspense fallback={<TableSkeleton columns={6} rows={5} showAvatar={true} title="Administrator Directory" />}>
                <AdminDataSection />
            </Suspense>

            {/* DYNAMIC VENDOR DATA SECTION WITH REACT SUSPENSE LOADING */}
            <Suspense fallback={<TableSkeleton columns={6} rows={5} showAvatar={true} showActions={true} />}>
                <VendorDataSection />
            </Suspense>

            {/* DYNAMIC PRODUCT DATA SECTION WITH REACT SUSPENSE LOADING */}
            <Suspense fallback={<TableSkeleton columns={6} rows={5} showAvatar={true} title="Product Inventory Catalog" />}>
                <ProductDataSection />
            </Suspense>
        </div>
    );
};

export default AdminDashboardPage;
