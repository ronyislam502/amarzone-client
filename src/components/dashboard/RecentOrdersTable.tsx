'use client';

import React from 'react';
import { ExternalLink, CheckCircle2, Clock, Truck, AlertTriangle } from 'lucide-react';

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

const PAYMENT_BADGES = {
    PAID: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    PENDING: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    REFUNDED: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

const DELIVERY_BADGES = {
    DELIVERED: { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: <CheckCircle2 className="w-3 h-3" /> },
    SHIPPED: { color: 'bg-info/20 text-info border-info/40', icon: <Truck className="w-3 h-3" /> },
    PROCESSING: { color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: <Clock className="w-3 h-3" /> },
    CANCELLED: { color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', icon: <AlertTriangle className="w-3 h-3" /> },
};

export const RecentOrdersTable: React.FC = () => {
    return (
        <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            {/* Table Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-lg font-extrabold text-slate-100 tracking-tight">
                        Recent Orders
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">
                        Latest transaction details & fulfillment status
                    </p>
                </div>
                <button
                    type="button"
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                    <span>View All Orders</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                            <th className="pb-2 pl-3">Order ID</th>
                            <th className="pb-2">Customer</th>
                            <th className="pb-2">Date</th>
                            <th className="pb-2">Amount</th>
                            <th className="pb-2">Payment</th>
                            <th className="pb-2">Delivery</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {RECENT_ORDERS.map((order) => {
                            const delBadge = DELIVERY_BADGES[order.deliveryStatus];
                            return (
                                <tr
                                    key={order.id}
                                    className="bg-slate-950/40 hover:bg-slate-800/50 transition-colors rounded-xl overflow-hidden group"
                                >
                                    <td className="py-3.5 pl-3 rounded-l-xl font-mono font-bold text-amber-400">
                                        {order.id}
                                    </td>
                                    <td className="py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <img
                                                src={order.customerAvatar}
                                                alt={order.customerName}
                                                className="w-7 h-7 rounded-full object-cover border border-white/10"
                                            />
                                            <div>
                                                <span className="font-bold text-slate-200 block">
                                                    {order.customerName}
                                                </span>
                                                <span className="text-[10px] text-slate-400 block">
                                                    {order.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3.5 text-slate-400 text-[11px] font-medium">
                                        {order.date}
                                    </td>
                                    <td className="py-3.5 font-extrabold text-slate-100">
                                        ${order.totalAmount.toFixed(2)}
                                        <span className="text-[10px] font-normal text-slate-400 block">
                                            {order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'}
                                        </span>
                                    </td>
                                    <td className="py-3.5">
                                        <span
                                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${PAYMENT_BADGES[order.paymentStatus]}`}
                                        >
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="py-3.5 pr-3 rounded-r-xl">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] border ${delBadge.color}`}
                                        >
                                            {delBadge.icon}
                                            <span>{order.deliveryStatus}</span>
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrdersTable;
