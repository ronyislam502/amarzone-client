'use client';

import React, { useState } from 'react';
import {
    DollarSign,
    ShoppingBag,
    Package,
    Star,
    PlusCircle,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Download,
    Sparkles,
    Store,
    ArrowUpRight,
    ExternalLink,
    RefreshCw
} from 'lucide-react';

interface VendorOrder {
    id: string;
    productName: string;
    productImage: string;
    customerName: string;
    customerAvatar: string;
    date: string;
    amount: number;
    paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
    fulfillmentStatus: 'UNSHIPPED' | 'SHIPPED' | 'DELIVERED';
}

const VENDOR_ORDERS: VendorOrder[] = [
    {
        id: 'ORD-9842',
        productName: 'Sony WH-1000XM5 Wireless Headphones',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80',
        customerName: 'Eleanor Vance',
        customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        date: 'Today, 14:32',
        amount: 398.00,
        paymentStatus: 'PAID',
        fulfillmentStatus: 'UNSHIPPED',
    },
    {
        id: 'ORD-9841',
        productName: 'MacBook Pro 16" M3 Max Dual-Tone',
        productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&auto=format&fit=crop&q=80',
        customerName: 'Marcus Sterling',
        customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        date: 'Today, 11:15',
        amount: 2499.00,
        paymentStatus: 'PAID',
        fulfillmentStatus: 'SHIPPED',
    },
    {
        id: 'ORD-9840',
        productName: 'Apple Watch Ultra 2 Titanium Case',
        productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80',
        customerName: 'Sophia Lin',
        customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        date: 'Yesterday, 18:40',
        amount: 799.00,
        paymentStatus: 'PAID',
        fulfillmentStatus: 'DELIVERED',
    },
    {
        id: 'ORD-9839',
        productName: 'Logitech MX Master 3S Wireless Mouse',
        productImage: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=150&auto=format&fit=crop&q=80',
        customerName: 'David K. Miller',
        customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        date: 'Yesterday, 09:12',
        amount: 99.00,
        paymentStatus: 'PAID',
        fulfillmentStatus: 'UNSHIPPED',
    },
];

interface CatalogProduct {
    id: string;
    name: string;
    price: number;
    stock: number;
    status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
    salesCount: number;
    image: string;
}

const CATALOG_PRODUCTS: CatalogProduct[] = [
    {
        id: 'P-101',
        name: 'Sony WH-1000XM5 Headphones',
        price: 398.00,
        stock: 84,
        status: 'IN_STOCK',
        salesCount: 420,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80',
    },
    {
        id: 'P-102',
        name: 'MacBook Pro 16" M3 Max',
        price: 2499.00,
        stock: 5,
        status: 'LOW_STOCK',
        salesCount: 890,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&auto=format&fit=crop&q=80',
    },
    {
        id: 'P-103',
        name: 'Apple Watch Ultra 2 Titanium',
        price: 799.00,
        stock: 0,
        status: 'OUT_OF_STOCK',
        salesCount: 1100,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80',
    },
];

const VendorDashboardPage = () => {
    const [selectedTab, setSelectedTab] = useState<'overview' | 'inventory' | 'payouts'>('overview');

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* HERO STORE HEADER CARD (DaisyUI Card) */}
            <div className="card bg-base-100 shadow-xl border border-base-200">
                <div className="card-body flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="avatar online">
                            <div className="w-16 rounded-2xl ring ring-warning ring-offset-base-100 ring-offset-2">
                                <img
                                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80"
                                    alt="Store Logo"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="badge badge-warning gap-1 font-black text-xs">
                                    <Store className="w-3.5 h-3.5" />
                                    Apex Electronics Store
                                </span>
                                <span className="badge badge-success badge-outline font-bold text-xs">
                                    VERIFIED SELLER
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                                Vendor Store <span className="text-warning">Dashboard</span>
                            </h1>
                            <p className="text-base-content/70 text-xs sm:text-sm">
                                Manage store catalog, fulfill pending orders, and request earnings withdrawals.
                            </p>
                        </div>
                    </div>

                    {/* DaisyUI Action Buttons & Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div role="tablist" className="tabs tabs-boxed bg-base-200 p-1">
                            <button
                                role="tab"
                                type="button"
                                onClick={() => setSelectedTab('overview')}
                                className={`tab tab-sm font-bold ${selectedTab === 'overview' ? 'tab-active' : ''}`}
                            >
                                Store Overview
                            </button>
                            <button
                                role="tab"
                                type="button"
                                onClick={() => setSelectedTab('inventory')}
                                className={`tab tab-sm font-bold ${selectedTab === 'inventory' ? 'tab-active' : ''}`}
                            >
                                Catalog Stock
                            </button>
                            <button
                                role="tab"
                                type="button"
                                onClick={() => setSelectedTab('payouts')}
                                className={`tab tab-sm font-bold ${selectedTab === 'payouts' ? 'tab-active' : ''}`}
                            >
                                Payouts
                            </button>
                        </div>

                        <button type="button" className="btn btn-warning btn-sm gap-2 font-black">
                            <PlusCircle className="w-4 h-4" />
                            <span>Add Product</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* DAISYUI STATS GRID FOR VENDORS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Stat 1: Total Store Sales */}
                <div className="stats bg-base-100 shadow-lg border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-warning">
                            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center border border-warning/30">
                                <DollarSign className="w-6 h-6 text-warning" />
                            </div>
                        </div>
                        <div className="stat-title text-xs font-extrabold uppercase">Net Store Revenue</div>
                        <div className="stat-value text-2xl text-warning">$78,450.00</div>
                        <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
                            ↗︎ 14.2% vs last month
                        </div>
                    </div>
                </div>

                {/* Stat 2: Orders Processed */}
                <div className="stats bg-base-100 shadow-lg border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-success">
                            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center border border-success/30">
                                <ShoppingBag className="w-6 h-6 text-success" />
                            </div>
                        </div>
                        <div className="stat-title text-xs font-extrabold uppercase">Total Store Orders</div>
                        <div className="stat-value text-2xl text-success">1,150</div>
                        <div className="stat-desc font-bold text-warning flex items-center gap-1 mt-1">
                            14 pending shipment
                        </div>
                    </div>
                </div>

                {/* Stat 3: Available Payout Balance */}
                <div className="stats bg-base-100 shadow-lg border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-info">
                            <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center border border-info/30">
                                <DollarSign className="w-6 h-6 text-info" />
                            </div>
                        </div>
                        <div className="stat-title text-xs font-extrabold uppercase">Available Payout</div>
                        <div className="stat-value text-2xl text-info">$12,380.00</div>
                        <div className="stat-desc font-bold text-info flex items-center gap-1 mt-1">
                            Ready for bank transfer
                        </div>
                    </div>
                </div>

                {/* Stat 4: Catalog Stock Items */}
                <div className="stats bg-base-100 shadow-lg border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-accent">
                            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30">
                                <Package className="w-6 h-6 text-accent" />
                            </div>
                        </div>
                        <div className="stat-title text-xs font-extrabold uppercase">Catalog Stock</div>
                        <div className="stat-value text-2xl text-accent">240 Items</div>
                        <div className="stat-desc font-bold text-error flex items-center gap-1 mt-1">
                            8 low-stock warnings
                        </div>
                    </div>
                </div>

                {/* Stat 5: Store Feedback Rating */}
                <div className="stats bg-base-100 shadow-lg border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center border border-secondary/30">
                                <Star className="w-6 h-6 text-secondary fill-secondary" />
                            </div>
                        </div>
                        <div className="stat-title text-xs font-extrabold uppercase">Store Feedback</div>
                        <div className="stat-value text-2xl text-secondary">4.9 / 5.0</div>
                        <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
                            Based on 1,840 reviews
                        </div>
                    </div>
                </div>

                {/* Stat 6: Return Rate Health */}
                <div className="stats bg-base-100 shadow-lg border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                                <TrendingUp className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <div className="stat-title text-xs font-extrabold uppercase">Return & Refund Rate</div>
                        <div className="stat-value text-2xl text-primary">1.2%</div>
                        <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
                            Well below 3.0% threshold
                        </div>
                    </div>
                </div>
            </div>

            {/* DAISYUI TABLE: RECENT VENDOR ORDERS */}
            <div className="card bg-base-100 shadow-xl border border-base-200">
                <div className="card-body">
                    <div className="flex items-center justify-between pb-3 border-b border-base-200">
                        <div>
                            <h2 className="card-title text-base font-extrabold">Recent Customer Orders</h2>
                            <p className="text-xs text-base-content/70">Orders placed for your store products</p>
                        </div>
                        <button type="button" className="btn btn-ghost btn-sm text-warning font-bold gap-1">
                            <span>View All Orders</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full text-xs">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Product</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Payment</th>
                                    <th>Fulfillment</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {VENDOR_ORDERS.map((order) => (
                                    <tr key={order.id}>
                                        <td className="font-mono font-bold text-warning">{order.id}</td>
                                        <td>
                                            <div className="flex items-center gap-2.5">
                                                <img
                                                    src={order.productImage}
                                                    alt={order.productName}
                                                    className="w-9 h-9 rounded-lg object-cover border border-base-300"
                                                />
                                                <span className="font-bold truncate max-w-[180px]">
                                                    {order.productName}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="avatar">
                                                    <div className="w-7 h-7 rounded-full">
                                                        <img src={order.customerAvatar} alt={order.customerName} />
                                                    </div>
                                                </div>
                                                <span className="font-semibold">{order.customerName}</span>
                                            </div>
                                        </td>
                                        <td className="text-base-content/70">{order.date}</td>
                                        <td className="font-extrabold">${order.amount.toFixed(2)}</td>
                                        <td>
                                            <span className="badge badge-success badge-sm font-bold">
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td>
                                            {order.fulfillmentStatus === 'UNSHIPPED' && (
                                                <span className="badge badge-warning badge-outline badge-sm font-bold">
                                                    UNSHIPPED
                                                </span>
                                            )}
                                            {order.fulfillmentStatus === 'SHIPPED' && (
                                                <span className="badge badge-info badge-outline badge-sm font-bold">
                                                    SHIPPED
                                                </span>
                                            )}
                                            {order.fulfillmentStatus === 'DELIVERED' && (
                                                <span className="badge badge-success badge-outline badge-sm font-bold">
                                                    DELIVERED
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {order.fulfillmentStatus === 'UNSHIPPED' ? (
                                                <button type="button" className="btn btn-warning btn-xs font-bold">
                                                    Ship Order
                                                </button>
                                            ) : (
                                                <button type="button" className="btn btn-ghost btn-xs">
                                                    Details
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* DAISYUI CARDS: CATALOG INVENTORY STATUS & STORE RATING REVIEWS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Inventory Management */}
                <div className="card bg-base-100 shadow-xl border border-base-200 lg:col-span-2">
                    <div className="card-body">
                        <div className="flex items-center justify-between pb-3 border-b border-base-200">
                            <h2 className="card-title text-base font-extrabold flex items-center gap-2">
                                <Package className="w-5 h-5 text-warning" />
                                Catalog Inventory & Stock Levels
                            </h2>
                            <span className="badge badge-neutral text-xs font-bold">240 Total Items</span>
                        </div>

                        <div className="space-y-3 pt-2">
                            {CATALOG_PRODUCTS.map((prod) => (
                                <div key={prod.id} className="card bg-base-200 shadow-sm p-3 flex-row items-center justify-between gap-3 border border-base-300">
                                    <div className="flex items-center gap-3">
                                        <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover border border-base-300" />
                                        <div>
                                            <h3 className="font-bold text-xs">{prod.name}</h3>
                                            <span className="text-[10px] text-base-content/60 font-semibold">${prod.price.toFixed(2)} • {prod.salesCount} sold</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {prod.status === 'IN_STOCK' && (
                                            <span className="badge badge-success badge-sm font-bold">{prod.stock} in stock</span>
                                        )}
                                        {prod.status === 'LOW_STOCK' && (
                                            <span className="badge badge-warning badge-sm font-bold">Only {prod.stock} left</span>
                                        )}
                                        {prod.status === 'OUT_OF_STOCK' && (
                                            <span className="badge badge-error badge-sm font-bold">Out of stock</span>
                                        )}

                                        <button type="button" className="btn btn-outline btn-xs font-bold">
                                            Restock
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Store Review & Rating Breakdown (DaisyUI Rating) */}
                <div className="card bg-base-100 shadow-xl border border-base-200 lg:col-span-1">
                    <div className="card-body justify-between">
                        <div>
                            <h2 className="card-title text-base font-extrabold mb-2">
                                Customer Ratings & Feedback
                            </h2>
                            <div className="flex items-center gap-2 my-2">
                                <div className="rating rating-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <input
                                            key={i}
                                            type="radio"
                                            name="rating-2"
                                            className="mask mask-star-2 bg-warning"
                                            checked={i < 5}
                                            readOnly
                                        />
                                    ))}
                                </div>
                                <span className="font-extrabold text-sm text-warning">4.9 out of 5</span>
                            </div>
                            <p className="text-xs text-base-content/70">
                                Based on 1,840 verified customer reviews this month.
                            </p>
                        </div>

                        <div className="space-y-3 my-3">
                            <div className="alert alert-info py-2 text-xs shadow-sm">
                                <Sparkles className="w-4 h-4" />
                                <span>&quot;Lightning fast 24h shipping and pristine packaging!&quot;</span>
                            </div>
                            <div className="alert alert-success py-2 text-xs shadow-sm">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>&quot;Genuine product with official manufacturer warranty.&quot;</span>
                            </div>
                        </div>

                        <button type="button" className="btn btn-warning btn-block btn-sm font-bold">
                            View All Customer Feedback
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboardPage;
