'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ShoppingBag,
    Package,
    Heart,
    Wallet,
    MessageSquare,
    User,
    Clock,
    CheckCircle2,
    Truck,
    AlertCircle,
    Star,
    Sparkles,
    Search,
    Filter,
    Download,
    Eye,
    RefreshCw,
    Plus,
    Copy,
    Send,
    MapPin,
    Bell,
    ShieldCheck,
    CreditCard,
    ChevronRight,
    ArrowUpRight,
    ExternalLink,
    Tag,
    Gift
} from 'lucide-react';
import Image from 'next/image';
import { useMyProfileQuery } from '@/redux/features/user/userApi';

interface Order {
    id: string;
    date: string;
    itemsCount: number;
    itemsSummary: string;
    total: number;
    status: 'DELIVERED' | 'IN_TRANSIT' | 'PROCESSING' | 'CANCELLED';
    estimatedDelivery: string;
    vendor: string;
    trackingNumber: string;
}

const USER_ORDERS: Order[] = [
    {
        id: 'ORD-9842',
        date: 'Today, 14:32',
        itemsCount: 2,
        itemsSummary: 'Sony WH-1000XM5 Wireless Headphones + Travel Case',
        total: 398.00,
        status: 'IN_TRANSIT',
        estimatedDelivery: 'Today by 5:00 PM',
        vendor: 'TechVerse Global',
        trackingNumber: 'TRK-88219402',
    },
    {
        id: 'ORD-9841',
        date: '04 Aug, 2026',
        itemsCount: 1,
        itemsSummary: 'MacBook Pro 16" M3 Max Dual-Tone - 32GB RAM',
        total: 2499.00,
        status: 'DELIVERED',
        estimatedDelivery: 'Delivered on Aug 06',
        vendor: 'Apple Authorized Store',
        trackingNumber: 'TRK-77491029',
    },
    {
        id: 'ORD-9840',
        date: '28 Jul, 2026',
        itemsCount: 3,
        itemsSummary: 'Ergonomic Mesh Chair + Desk Pad + LED Lamp',
        total: 349.50,
        status: 'DELIVERED',
        estimatedDelivery: 'Delivered on Jul 30',
        vendor: 'ErgoComfort Inc',
        trackingNumber: 'TRK-66182930',
    },
    {
        id: 'ORD-9839',
        date: '15 Jul, 2026',
        itemsCount: 1,
        itemsSummary: 'Mechanical Wireless Keyboard RGB (Hot-swappable)',
        total: 129.99,
        status: 'PROCESSING',
        estimatedDelivery: 'Expected Aug 10',
        vendor: 'Keychron Store',
        trackingNumber: 'TRK-55201948',
    },
    {
        id: 'ORD-9838',
        date: '02 Jun, 2026',
        itemsCount: 1,
        itemsSummary: 'USB-C Thunderbolt 4 Docking Station',
        total: 189.00,
        status: 'CANCELLED',
        estimatedDelivery: 'Refund Processed',
        vendor: 'Anker Official',
        trackingNumber: 'TRK-44102938',
    },
];

interface WishlistItem {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviewsCount: number;
    image: string;
    inStock: boolean;
    discount: string;
}

const WISHLIST_ITEMS: WishlistItem[] = [
    {
        id: 'W-101',
        title: 'Sony WH-1000XM5 Noise Canceling Headphones',
        price: 398.00,
        originalPrice: 449.00,
        rating: 4.8,
        reviewsCount: 1240,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
        inStock: true,
        discount: '11% OFF',
    },
    {
        id: 'W-102',
        title: 'Apple Watch Ultra 2 Titanium GPS + Cellular',
        price: 799.00,
        originalPrice: 849.00,
        rating: 4.9,
        reviewsCount: 890,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80',
        inStock: true,
        discount: '6% OFF',
    },
    {
        id: 'W-103',
        title: 'Logitech MX Master 3S Ergonomic Mouse',
        price: 99.00,
        originalPrice: 119.00,
        rating: 4.7,
        reviewsCount: 2310,
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&auto=format&fit=crop&q=80',
        inStock: true,
        discount: '17% OFF',
    },
    {
        id: 'W-104',
        title: 'Samsung Odyssey G9 49" Curved Gaming Monitor',
        price: 1199.00,
        originalPrice: 1399.00,
        rating: 4.6,
        reviewsCount: 450,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80',
        inStock: false,
        discount: '14% OFF',
    },
];

interface SupportChatMessage {
    id: string;
    sender: 'user' | 'agent';
    senderName: string;
    avatar: string;
    message: string;
    time: string;
}

export default function UserDashboardPage() {
    const { data: userData } = useMyProfileQuery({});
    const user = userData?.data;
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'wallet' | 'support' | 'profile'>('overview');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(USER_ORDERS[0]);
    const [orderFilter, setOrderFilter] = useState<string>('ALL');
    const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

    // Live chat state
    const [chatMessages, setChatMessages] = useState<SupportChatMessage[]>([
        {
            id: '1',
            sender: 'agent',
            senderName: 'Amarzone Support (Sarah)',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
            message: 'Hello Alex! I see your order #ORD-9842 is out for delivery today. How can I assist you?',
            time: '14:35',
        },
        {
            id: '2',
            sender: 'user',
            senderName: 'Alex Morgan',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            message: 'Hi Sarah! Can I leave specific delivery instructions for the driver?',
            time: '14:37',
        },
        {
            id: '3',
            sender: 'agent',
            senderName: 'Amarzone Support (Sarah)',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
            message: 'Absolutely! I have added the note to place the package at your front porch.',
            time: '14:38',
        },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const userMsg: SupportChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            senderName: 'Alex Morgan',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            message: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setChatMessages((prev) => [...prev, userMsg]);
        setNewMessage('');

        // Simulated quick reply
        setTimeout(() => {
            const agentReply: SupportChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'agent',
                senderName: 'Amarzone Support (Sarah)',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
                message: 'Thank you for updating us! We will notify the driver immediately.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setChatMessages((prev) => [...prev, agentReply]);
        }, 1200);
    };

    const handleCopyCoupon = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCoupon(code);
        setTimeout(() => setCopiedCoupon(null), 2000);
    };

    const filteredOrders = USER_ORDERS.filter((order) => {
        if (orderFilter === 'ALL') return true;
        return order.status === orderFilter;
    });

    return (
        <div className="space-y-6 pb-12">
            {/* Top Navigation / Breadcrumb Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="breadcrumbs text-xs text-base-content/70">
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/user">Dashboard</Link></li>
                            <li className="font-bold text-primary capitalize">{activeTab}</li>
                        </ul>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">
                        Customer <span className="text-primary">Dashboard</span>
                    </h1>
                </div>

                {/* Quick Navigation Action Buttons (DaisyUI Join) */}
                <div className="join shadow-md">
                    <button
                        type="button"
                        onClick={() => setActiveTab('overview')}
                        className={`join-item btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
                    >
                        Overview
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className={`join-item btn btn-sm ${activeTab === 'orders' ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
                    >
                        Orders
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('wishlist')}
                        className={`join-item btn btn-sm ${activeTab === 'wishlist' ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
                    >
                        Wishlist
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('wallet')}
                        className={`join-item btn btn-sm ${activeTab === 'wallet' ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
                    >
                        Wallet
                    </button>
                </div>
            </div>

            {/* DaisyUI Alert Notification Banner */}
            <div className="alert alert-info shadow-lg border border-info/30 text-xs sm:text-sm">
                <Truck className="w-5 h-5 text-info-content shrink-0" />
                <div className="flex-1">
                    <span className="font-extrabold">Active Shipment Update:</span> Order{' '}
                    <span className="badge badge-neutral badge-sm font-mono mx-1">#ORD-9842</span> is out for delivery today. Estimated by 5:00 PM.
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab('orders');
                        setSelectedOrder(USER_ORDERS[0]);
                    }}
                    className="btn btn-xs btn-primary gap-1 font-bold"
                >
                    <Eye className="w-3 h-3" /> Track Order
                </button>
            </div>

            {/* DaisyUI Hero / Profile Card Header */}
            <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                <div className="card-body p-6 sm:p-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Profile Info */}
                        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                            <div className="avatar online">
                                <div className="w-20 sm:w-24 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-2 shadow-xl">
                                    <Image
                                        src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"}
                                        width={100}
                                        height={100}
                                        alt={user?.name || "Customer Avatar"}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <h2 className="text-2xl font-extrabold tracking-tight">{user?.name}</h2>
                                    <span className="badge badge-warning gap-1 font-black text-xs">
                                        <Sparkles className="w-3 h-3" /> GOLD VIP
                                    </span>
                                </div>
                                <p className="text-xs text-base-content/70">{user?.email}• Member since Jan 2024</p>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                                    <span className="badge badge-outline badge-sm gap-1 text-[11px]">
                                        <MapPin className="w-3 h-3 text-error" /> New York, USA
                                    </span>
                                    <span className="badge badge-success badge-outline badge-sm gap-1 text-[11px]">
                                        <ShieldCheck className="w-3 h-3" /> Verified Buyer
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Profile Progress & Stats */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-6 bg-base-200/60 p-4 rounded-2xl border border-base-300">
                            {/* DaisyUI Radial Progress */}
                            <div className="flex items-center gap-3">
                                <div
                                    className="radial-progress text-primary font-bold text-xs"
                                    style={{ '--value': 88, '--size': '3.8rem', '--thickness': '6px' } as React.CSSProperties}
                                    role="progressbar"
                                >
                                    88%
                                </div>
                                <div className="text-left text-xs">
                                    <span className="font-extrabold block">Profile Score</span>
                                    <span className="text-base-content/60 text-[10px]">Almost Complete</span>
                                </div>
                            </div>

                            <div className="divider lg:divider-horizontal my-0"></div>

                            {/* Loyalty Points */}
                            <div className="text-center sm:text-left">
                                <span className="text-[10px] uppercase tracking-wider text-base-content/60 font-bold">Reward Balance</span>
                                <div className="text-xl font-black text-warning flex items-center gap-1">
                                    <Gift className="w-5 h-5" /> 1,450 <span className="text-xs font-semibold">PTS</span>
                                </div>
                                <span className="text-[10px] text-success font-semibold">Worth $14.50 Cashback</span>
                            </div>
                        </div>
                    </div>

                    {/* DaisyUI Steps: Loyalty Tier Progress */}
                    <div className="mt-6 pt-6 border-t border-base-200">
                        <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-extrabold text-base-content/80">Loyalty Tier Status</span>
                            <span className="text-primary font-bold">350 PTS to Platinum</span>
                        </div>
                        <ul className="steps steps-vertical sm:steps-horizontal w-full text-xs">
                            <li className="step step-primary font-bold">Bronze Member</li>
                            <li className="step step-primary font-bold">Silver Tier</li>
                            <li className="step step-primary font-black" data-content="★">Gold VIP</li>
                            <li className="step font-medium text-base-content/40">Platinum Elite</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* DaisyUI Stats Overview Grid */}
            <div className="stats stats-vertical lg:stats-horizontal shadow-xl bg-base-100 border border-base-200 w-full">
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div className="stat-title text-xs font-bold uppercase">Total Lifetime Orders</div>
                    <div className="stat-value text-primary text-3xl font-black">28</div>
                    <div className="stat-desc font-semibold text-success">+3 orders this month</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <Wallet className="w-8 h-8" />
                    </div>
                    <div className="stat-title text-xs font-bold uppercase">Amarzone Wallet</div>
                    <div className="stat-value text-secondary text-3xl font-black">$320.00</div>
                    <div className="stat-desc font-semibold text-info">Ready to spend</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-warning">
                        <Heart className="w-8 h-8" />
                    </div>
                    <div className="stat-title text-xs font-bold uppercase">Saved Wishlist</div>
                    <div className="stat-value text-warning text-3xl font-black">12</div>
                    <div className="stat-desc font-semibold text-secondary">2 price drops active</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-success">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <div className="stat-title text-xs font-bold uppercase">Support Tickets</div>
                    <div className="stat-value text-success text-3xl font-black">1 Open</div>
                    <div className="stat-desc font-semibold text-success">Agent assigned</div>
                </div>
            </div>

            {/* Main Tabs Navigation (DaisyUI Tabs) */}
            <div className="tabs tabs-box bg-base-100 p-2 shadow-md rounded-2xl border border-base-200">
                <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className={`tab gap-2 font-bold text-xs sm:text-sm py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'tab-active btn-primary text-primary-content shadow-md' : ''
                        }`}
                >
                    <Sparkles className="w-4 h-4" /> Overview
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className={`tab gap-2 font-bold text-xs sm:text-sm py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'tab-active btn-primary text-primary-content shadow-md' : ''
                        }`}
                >
                    <Package className="w-4 h-4" /> My Orders
                    <span className="badge badge-sm badge-warning font-black">5</span>
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('wishlist')}
                    className={`tab gap-2 font-bold text-xs sm:text-sm py-3 rounded-xl transition-all ${activeTab === 'wishlist' ? 'tab-active btn-primary text-primary-content shadow-md' : ''
                        }`}
                >
                    <Heart className="w-4 h-4" /> Wishlist
                    <span className="badge badge-sm badge-secondary font-black">4</span>
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('wallet')}
                    className={`tab gap-2 font-bold text-xs sm:text-sm py-3 rounded-xl transition-all ${activeTab === 'wallet' ? 'tab-active btn-primary text-primary-content shadow-md' : ''
                        }`}
                >
                    <Wallet className="w-4 h-4" /> Wallet & Coupons
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('support')}
                    className={`tab gap-2 font-bold text-xs sm:text-sm py-3 rounded-xl transition-all ${activeTab === 'support' ? 'tab-active btn-primary text-primary-content shadow-md' : ''
                        }`}
                >
                    <MessageSquare className="w-4 h-4" /> Support & Chat
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={`tab gap-2 font-bold text-xs sm:text-sm py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'tab-active btn-primary text-primary-content shadow-md' : ''
                        }`}
                >
                    <User className="w-4 h-4" /> Profile & Settings
                </button>
            </div>

            {/* TAB CONTENT 1: OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Live Order Shipment Tracking Widget (DaisyUI Steps & Card) */}
                    <div className="card bg-base-100 shadow-xl border border-base-200">
                        <div className="card-body">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-base-200 pb-4">
                                <div>
                                    <span className="badge badge-primary font-mono text-[10px] font-bold uppercase tracking-wider">
                                        Live Shipment Tracker
                                    </span>
                                    <h3 className="card-title text-lg font-black mt-1">
                                        Order #ORD-9842 <span className="text-xs font-normal text-base-content/70">(Sony WH-1000XM5)</span>
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-base-content/60 font-semibold block">Expected Delivery</span>
                                    <span className="badge badge-success font-extrabold gap-1 text-xs">
                                        <Clock className="w-3 h-3" /> Today by 5:00 PM
                                    </span>
                                </div>
                            </div>

                            {/* DaisyUI Steps for Tracking */}
                            <div className="py-6 overflow-x-auto">
                                <ul className="steps steps-horizontal w-full text-xs">
                                    <li className="step step-primary font-bold">Order Placed</li>
                                    <li className="step step-primary font-bold">Payment Verified</li>
                                    <li className="step step-primary font-bold">Shipped from Hub</li>
                                    <li className="step step-primary font-black" data-content="🚚">Out for Delivery</li>
                                    <li className="step font-medium text-base-content/40">Delivered</li>
                                </ul>
                            </div>

                            <div className="flex items-center justify-between bg-base-200/50 p-4 rounded-xl text-xs">
                                <div className="flex items-center gap-3">
                                    <div className="avatar">
                                        <div className="w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                                            <Truck className="w-5 h-5 mx-auto my-2" />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-extrabold text-sm block">Express Courier Services</span>
                                        <span className="text-base-content/70">Tracking Code: <code className="font-bold text-primary">TRK-88219402</code></span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab('orders');
                                        setSelectedOrder(USER_ORDERS[0]);
                                    }}
                                    className="btn btn-sm btn-outline btn-primary gap-1"
                                >
                                    Details <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Grid: Recent Orders Preview & Quick Vouchers */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Orders Preview (DaisyUI Table) */}
                        <div className="lg:col-span-2 card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body">
                                <div className="flex items-center justify-between pb-3 border-b border-base-200">
                                    <h3 className="card-title text-base font-black flex items-center gap-2">
                                        <ShoppingBag className="w-4 h-4 text-primary" /> Recent Orders
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('orders')}
                                        className="btn btn-ghost btn-xs text-primary font-bold"
                                    >
                                        View All ({USER_ORDERS.length})
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full text-xs">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Item Summary</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th className="text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {USER_ORDERS.slice(0, 4).map((order) => (
                                                <tr key={order.id} className="hover">
                                                    <td className="font-mono font-bold">{order.id}</td>
                                                    <td className="max-w-[200px] truncate font-medium">
                                                        {order.itemsSummary}
                                                    </td>
                                                    <td className="font-extrabold text-sm">${order.total.toFixed(2)}</td>
                                                    <td>
                                                        {order.status === 'DELIVERED' && (
                                                            <span className="badge badge-success badge-sm font-bold gap-1">
                                                                <CheckCircle2 className="w-3 h-3" /> Delivered
                                                            </span>
                                                        )}
                                                        {order.status === 'IN_TRANSIT' && (
                                                            <span className="badge badge-info badge-sm font-bold gap-1">
                                                                <Truck className="w-3 h-3" /> In Transit
                                                            </span>
                                                        )}
                                                        {order.status === 'PROCESSING' && (
                                                            <span className="badge badge-warning badge-sm font-bold gap-1">
                                                                <Clock className="w-3 h-3" /> Processing
                                                            </span>
                                                        )}
                                                        {order.status === 'CANCELLED' && (
                                                            <span className="badge badge-error badge-sm font-bold gap-1">
                                                                <AlertCircle className="w-3 h-3" /> Cancelled
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setActiveTab('orders');
                                                            }}
                                                            className="btn btn-ghost btn-xs text-primary font-bold"
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Available Coupons & Perks (DaisyUI Cards) */}
                        <div className="card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body space-y-3">
                                <h3 className="card-title text-base font-black flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-secondary" /> Active Coupons
                                </h3>

                                <div className="alert alert-secondary py-3 text-xs shadow-sm flex-col items-start gap-1">
                                    <div className="flex items-center justify-between w-full">
                                        <span className="font-mono font-black text-sm bg-base-100 px-2 py-0.5 rounded text-secondary">
                                            AMARZONE20
                                        </span>
                                        <span className="badge badge-warning font-bold text-[10px]">20% OFF</span>
                                    </div>
                                    <p className="text-[11px]">Valid on all electronics orders above $100.</p>
                                    <button
                                        type="button"
                                        onClick={() => handleCopyCoupon('AMARZONE20')}
                                        className="btn btn-xs btn-outline btn-secondary self-end gap-1 mt-1"
                                    >
                                        <Copy className="w-3 h-3" /> {copiedCoupon === 'AMARZONE20' ? 'Copied!' : 'Copy Code'}
                                    </button>
                                </div>

                                <div className="alert alert-warning py-3 text-xs shadow-sm flex-col items-start gap-1">
                                    <div className="flex items-center justify-between w-full">
                                        <span className="font-mono font-black text-sm bg-base-100 px-2 py-0.5 rounded text-warning">
                                            FREESHIP50
                                        </span>
                                        <span className="badge badge-success font-bold text-[10px]">FREE SHIPPING</span>
                                    </div>
                                    <p className="text-[11px]">Zero shipping fee on fashion & home items.</p>
                                    <button
                                        type="button"
                                        onClick={() => handleCopyCoupon('FREESHIP50')}
                                        className="btn btn-xs btn-outline btn-warning self-end gap-1 mt-1"
                                    >
                                        <Copy className="w-3 h-3" /> {copiedCoupon === 'FREESHIP50' ? 'Copied!' : 'Copy Code'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DaisyUI Timeline: Order Activity Feed */}
                    <div className="card bg-base-100 shadow-xl border border-base-200">
                        <div className="card-body">
                            <h3 className="card-title text-base font-black mb-4">
                                Recent Activity Timeline
                            </h3>

                            <ul className="timeline timeline-vertical lg:timeline-horizontal">
                                <li>
                                    <div className="timeline-start text-xs font-bold text-base-content/70">Today, 14:32</div>
                                    <div className="timeline-middle text-primary">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div className="timeline-end timeline-box text-xs bg-base-200">
                                        Order <span className="font-mono font-bold">#ORD-9842</span> dispatched via Express Courier.
                                    </div>
                                    <hr className="bg-primary" />
                                </li>
                                <li>
                                    <hr className="bg-primary" />
                                    <div className="timeline-start text-xs font-bold text-base-content/70">04 Aug, 2026</div>
                                    <div className="timeline-middle text-success">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div className="timeline-end timeline-box text-xs bg-base-200">
                                        Delivered MacBook Pro 16" to shipping address.
                                    </div>
                                    <hr className="bg-primary" />
                                </li>
                                <li>
                                    <hr className="bg-primary" />
                                    <div className="timeline-start text-xs font-bold text-base-content/70">01 Aug, 2026</div>
                                    <div className="timeline-middle text-warning">
                                        <Gift className="w-5 h-5" />
                                    </div>
                                    <div className="timeline-end timeline-box text-xs bg-base-200">
                                        Earned <span className="font-bold text-warning">500 Loyalty Reward Points</span>.
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT 2: ORDERS & TRACKING */}
            {activeTab === 'orders' && (
                <div className="space-y-6">
                    {/* Orders Search & Filter Toolbar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-base-100 p-4 rounded-2xl shadow-md border border-base-200">
                        {/* Search Input (DaisyUI Input) */}
                        <div className="form-control w-full sm:w-80 relative">
                            <input
                                type="text"
                                placeholder="Search by Order ID or Item..."
                                className="input input-bordered input-sm w-full pl-9 rounded-xl"
                            />
                            <Search className="w-4 h-4 text-base-content/50 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>

                        {/* Status Filter Buttons (DaisyUI Join) */}
                        <div className="join w-full sm:w-auto">
                            {['ALL', 'IN_TRANSIT', 'DELIVERED', 'PROCESSING', 'CANCELLED'].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setOrderFilter(status)}
                                    className={`join-item btn btn-xs sm:btn-sm font-bold ${orderFilter === status ? 'btn-primary' : 'btn-ghost bg-base-200/50'
                                        }`}
                                >
                                    {status.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Orders List Table */}
                        <div className="lg:col-span-2 card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body">
                                <h3 className="card-title text-base font-black mb-2">Order History</h3>
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full text-xs">
                                        <thead>
                                            <tr>
                                                <th>Order Details</th>
                                                <th>Date</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th className="text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className={`hover cursor-pointer ${selectedOrder?.id === order.id ? 'bg-primary/10' : ''
                                                        }`}
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    <td>
                                                        <span className="font-mono font-bold text-primary block">{order.id}</span>
                                                        <span className="text-[11px] text-base-content/70 max-w-[180px] block truncate">
                                                            {order.itemsSummary}
                                                        </span>
                                                    </td>
                                                    <td>{order.date}</td>
                                                    <td className="font-extrabold text-sm">${order.total.toFixed(2)}</td>
                                                    <td>
                                                        {order.status === 'DELIVERED' && (
                                                            <span className="badge badge-success badge-sm font-bold">Delivered</span>
                                                        )}
                                                        {order.status === 'IN_TRANSIT' && (
                                                            <span className="badge badge-info badge-sm font-bold">In Transit</span>
                                                        )}
                                                        {order.status === 'PROCESSING' && (
                                                            <span className="badge badge-warning badge-sm font-bold">Processing</span>
                                                        )}
                                                        {order.status === 'CANCELLED' && (
                                                            <span className="badge badge-error badge-sm font-bold">Cancelled</span>
                                                        )}
                                                    </td>
                                                    <td className="text-right">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedOrder(order);
                                                            }}
                                                            className="btn btn-xs btn-outline btn-primary"
                                                        >
                                                            Select
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Order Detail & Live Tracking Panel */}
                        <div className="card bg-base-100 shadow-xl border border-base-200">
                            {selectedOrder ? (
                                <div className="card-body space-y-4">
                                    <div className="flex items-center justify-between border-b border-base-200 pb-3">
                                        <div>
                                            <span className="text-[10px] uppercase font-extrabold text-base-content/60">Selected Details</span>
                                            <h4 className="font-black text-lg font-mono text-primary">{selectedOrder.id}</h4>
                                        </div>
                                        <button type="button" className="btn btn-ghost btn-xs text-info gap-1 font-bold">
                                            <Download className="w-3.5 h-3.5" /> Invoice
                                        </button>
                                    </div>

                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between py-1 border-b border-base-200/50">
                                            <span className="text-base-content/70">Vendor:</span>
                                            <span className="font-bold">{selectedOrder.vendor}</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-base-200/50">
                                            <span className="text-base-content/70">Tracking Code:</span>
                                            <span className="font-mono font-bold text-primary">{selectedOrder.trackingNumber}</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-base-200/50">
                                            <span className="text-base-content/70">Estimated Arrival:</span>
                                            <span className="font-bold text-success">{selectedOrder.estimatedDelivery}</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-base-200/50">
                                            <span className="text-base-content/70">Total Amount:</span>
                                            <span className="font-black text-base">${selectedOrder.total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Tracking Timeline */}
                                    <div className="bg-base-200/60 p-4 rounded-xl space-y-3">
                                        <h5 className="font-bold text-xs flex items-center gap-1.5">
                                            <Truck className="w-4 h-4 text-primary" /> Live Package Telemetry
                                        </h5>

                                        <ul className="steps steps-vertical w-full text-xs">
                                            <li className="step step-primary font-bold">Order Received</li>
                                            <li className="step step-primary font-bold">Packaged & Labeled</li>
                                            <li className={`step ${selectedOrder.status === 'IN_TRANSIT' || selectedOrder.status === 'DELIVERED' ? 'step-primary font-bold' : ''}`}>
                                                In Transit to Hub
                                            </li>
                                            <li className={`step ${selectedOrder.status === 'DELIVERED' ? 'step-primary font-bold' : ''}`}>
                                                Final Delivery
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="pt-2 flex gap-2">
                                        <button type="button" className="btn btn-sm btn-primary flex-1 gap-1 font-bold">
                                            <RefreshCw className="w-3.5 h-3.5" /> Reorder Items
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('support')}
                                            className="btn btn-sm btn-outline flex-1 gap-1 font-bold"
                                        >
                                            <MessageSquare className="w-3.5 h-3.5" /> Get Help
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="card-body text-center py-12 text-base-content/60">
                                    Select an order from the list to view live tracking details.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT 3: WISHLIST */}
            {activeTab === 'wishlist' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black flex items-center gap-2">
                            <Heart className="w-5 h-5 text-secondary" /> Saved Wishlist Items ({WISHLIST_ITEMS.length})
                        </h3>
                        <button type="button" className="btn btn-sm btn-outline btn-secondary gap-1">
                            <ShoppingBag className="w-4 h-4" /> Move All to Cart
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {WISHLIST_ITEMS.map((item) => (
                            <div key={item.id} className="card bg-base-100 shadow-xl border border-base-200 group hover:-translate-y-1 transition-all duration-300">
                                <figure className="relative h-48 bg-base-200 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <span className="badge badge-secondary font-extrabold text-xs absolute top-3 left-3 shadow-md">
                                        {item.discount}
                                    </span>
                                    <button
                                        type="button"
                                        className="btn btn-circle btn-xs btn-error absolute top-3 right-3 opacity-80 hover:opacity-100"
                                        title="Remove from wishlist"
                                    >
                                        ✕
                                    </button>
                                </figure>

                                <div className="card-body p-4 space-y-2">
                                    <h4 className="card-title text-sm font-bold line-clamp-2">{item.title}</h4>

                                    {/* DaisyUI Rating */}
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="rating rating-xs">
                                            <input type="radio" name={`rating-${item.id}`} className="mask mask-star-2 bg-orange-400" readOnly />
                                            <input type="radio" name={`rating-${item.id}`} className="mask mask-star-2 bg-orange-400" readOnly />
                                            <input type="radio" name={`rating-${item.id}`} className="mask mask-star-2 bg-orange-400" readOnly />
                                            <input type="radio" name={`rating-${item.id}`} className="mask mask-star-2 bg-orange-400" readOnly />
                                            <input type="radio" name={`rating-${item.id}`} className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        </div>
                                        <span className="font-bold">{item.rating}</span>
                                        <span className="text-base-content/50">({item.reviewsCount})</span>
                                    </div>

                                    <div className="flex items-baseline gap-2 pt-1">
                                        <span className="text-lg font-black text-primary">${item.price.toFixed(2)}</span>
                                        <span className="text-xs line-through text-base-content/50">${item.originalPrice.toFixed(2)}</span>
                                    </div>

                                    <div className="card-actions pt-2">
                                        <button
                                            type="button"
                                            disabled={!item.inStock}
                                            className={`btn btn-sm w-full gap-2 font-bold ${item.inStock ? 'btn-primary' : 'btn-disabled'
                                                }`}
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB CONTENT 4: WALLET & COUPONS */}
            {activeTab === 'wallet' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Balance Card (DaisyUI Hero / Card) */}
                        <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-2xl">
                            <div className="card-body p-6 justify-between space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-xs font-bold uppercase opacity-80">Amarzone Digital Pay</span>
                                        <h3 className="text-3xl font-black mt-1">$320.00</h3>
                                    </div>
                                    <CreditCard className="w-8 h-8 opacity-90" />
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-bold opacity-75">Card Holder</span>
                                    <p className="font-bold tracking-widest text-sm uppercase">Alex Morgan</p>
                                    <p className="font-mono text-xs opacity-80">•••• •••• •••• 4920</p>
                                </div>

                                <div className="card-actions justify-end gap-2">
                                    <button type="button" className="btn btn-sm btn-neutral font-bold gap-1">
                                        <Plus className="w-4 h-4" /> Add Money
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Redeem Code Form (DaisyUI Form & Join) */}
                        <div className="lg:col-span-2 card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body space-y-4">
                                <h3 className="card-title text-base font-black">Redeem Gift Card or Voucher</h3>
                                <p className="text-xs text-base-content/70">
                                    Enter your 16-digit voucher code or promo coupon to instantly add credits to your wallet balance.
                                </p>

                                <form onSubmit={(e) => e.preventDefault()} className="form-control">
                                    <div className="join w-full max-w-md">
                                        <input
                                            type="text"
                                            placeholder="e.g. AMARZONE-2026-GIFT"
                                            className="input input-bordered join-item w-full uppercase font-mono text-xs font-bold"
                                        />
                                        <button type="submit" className="btn btn-primary join-item font-bold">
                                            Redeem Now
                                        </button>
                                    </div>
                                </form>

                                <div className="divider my-1"></div>

                                {/* Transaction History Table */}
                                <h4 className="font-bold text-xs uppercase text-base-content/60">Recent Wallet Transactions</h4>
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full text-xs">
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                                <th>Date</th>
                                                <th className="text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><span className="badge badge-success badge-sm font-bold">+ Credit</span></td>
                                                <td>Cashback Refund on Order #ORD-9838</td>
                                                <td>02 Jun, 2026</td>
                                                <td className="text-right font-bold text-success">+$189.00</td>
                                            </tr>
                                            <tr>
                                                <td><span className="badge badge-warning badge-sm font-bold">- Debit</span></td>
                                                <td>Purchased Sony WH-1000XM5 Headphones</td>
                                                <td>Today, 14:32</td>
                                                <td className="text-right font-bold text-error">-$398.00</td>
                                            </tr>
                                            <tr>
                                                <td><span className="badge badge-success badge-sm font-bold">+ Credit</span></td>
                                                <td>Monthly VIP Loyalty Bonus Deposit</td>
                                                <td>01 Aug, 2026</td>
                                                <td className="text-right font-bold text-success">+$50.00</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT 5: SUPPORT & CHAT */}
            {activeTab === 'support' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Active Tickets List */}
                    <div className="card bg-base-100 shadow-xl border border-base-200">
                        <div className="card-body space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="card-title text-base font-black">Support Tickets</h3>
                                <button type="button" className="btn btn-xs btn-primary gap-1">
                                    <Plus className="w-3.5 h-3.5" /> New Ticket
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="p-3 bg-primary/10 rounded-xl border border-primary/30 space-y-1 cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-xs font-bold text-primary">#TCK-9921</span>
                                        <span className="badge badge-warning badge-sm font-bold">Open</span>
                                    </div>
                                    <h4 className="font-bold text-xs">Delivery Instructions for #ORD-9842</h4>
                                    <span className="text-[10px] text-base-content/60 block">Last activity: 14:38</span>
                                </div>

                                <div className="p-3 bg-base-200/50 rounded-xl space-y-1 opacity-75 cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-xs font-bold text-base-content/70">#TCK-8810</span>
                                        <span className="badge badge-success badge-sm font-bold">Resolved</span>
                                    </div>
                                    <h4 className="font-bold text-xs">Refund status for returned dock</h4>
                                    <span className="text-[10px] text-base-content/60 block">Closed on Jun 05</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live DaisyUI Chat Widget */}
                    <div className="lg:col-span-2 card bg-base-100 shadow-xl border border-base-200">
                        <div className="card-body p-4 sm:p-6 flex flex-col h-[520px]">
                            {/* Chat Header */}
                            <div className="flex items-center justify-between border-b border-base-200 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="avatar online">
                                        <div className="w-10 rounded-full">
                                            <img
                                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                                                alt="Agent"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Amarzone Assistant (Sarah)</h4>
                                        <span className="badge badge-success badge-xs font-bold">Online • Ticket #TCK-9921</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages (DaisyUI Chat Components) */}
                            <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-2">
                                {chatMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`chat ${msg.sender === 'user' ? 'chat-end' : 'chat-start'}`}
                                    >
                                        <div className="chat-image avatar">
                                            <div className="w-8 rounded-full">
                                                <img src={msg.avatar} alt={msg.senderName} />
                                            </div>
                                        </div>
                                        <div className="chat-header text-[10px] opacity-70 mb-0.5">
                                            {msg.senderName} <time className="ml-1">{msg.time}</time>
                                        </div>
                                        <div
                                            className={`chat-bubble text-xs ${msg.sender === 'user' ? 'chat-bubble-primary font-medium' : 'chat-bubble-neutral'
                                                }`}
                                        >
                                            {msg.message}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Chat Input Form */}
                            <form onSubmit={handleSendMessage} className="form-control border-t border-base-200 pt-3">
                                <div className="join w-full">
                                    <input
                                        type="text"
                                        placeholder="Type your message to support..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="input input-bordered join-item w-full text-xs"
                                    />
                                    <button type="submit" className="btn btn-primary join-item gap-1 font-bold">
                                        <Send className="w-4 h-4" /> Send
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT 6: PROFILE & SETTINGS */}
            {activeTab === 'profile' && (
                <div className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body space-y-6">
                        <h3 className="card-title text-lg font-black border-b border-base-200 pb-3">
                            Account & Security Preferences
                        </h3>

                        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                            {/* Personal Info Grid (DaisyUI Inputs) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs">Full Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Alex Morgan"
                                        className="input input-bordered input-sm rounded-xl font-semibold"
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs">Email Address</span>
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue="alex.morgan@example.com"
                                        className="input input-bordered input-sm rounded-xl font-semibold"
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs">Phone Number</span>
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="+1 (555) 382-9102"
                                        className="input input-bordered input-sm rounded-xl font-semibold"
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-xs">Default Currency</span>
                                    </label>
                                    <select className="select select-bordered select-sm rounded-xl font-semibold">
                                        <option>USD ($)</option>
                                        <option>EUR (€)</option>
                                        <option>GBP (£)</option>
                                        <option>BDT (৳)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="divider"></div>

                            {/* Notification Toggles (DaisyUI Toggles) */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-xs uppercase text-base-content/60">Notification Preferences</h4>

                                <div className="form-control flex-row items-center justify-between p-3 bg-base-200/50 rounded-xl">
                                    <span className="label-text font-bold text-xs">Order Tracking SMS Alerts</span>
                                    <input type="checkbox" className="toggle toggle-primary toggle-sm" defaultChecked />
                                </div>

                                <div className="form-control flex-row items-center justify-between p-3 bg-base-200/50 rounded-xl">
                                    <span className="label-text font-bold text-xs">Promotional Email Newsletters</span>
                                    <input type="checkbox" className="toggle toggle-secondary toggle-sm" defaultChecked />
                                </div>

                                <div className="form-control flex-row items-center justify-between p-3 bg-base-200/50 rounded-xl">
                                    <span className="label-text font-bold text-xs">Two-Factor Authentication (2FA) Security</span>
                                    <input type="checkbox" className="toggle toggle-success toggle-sm" defaultChecked />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" className="btn btn-ghost btn-sm font-bold">
                                    Discard Changes
                                </button>
                                <button type="submit" className="btn btn-primary btn-sm font-bold gap-1">
                                    <ShieldCheck className="w-4 h-4" /> Save Preferences
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
