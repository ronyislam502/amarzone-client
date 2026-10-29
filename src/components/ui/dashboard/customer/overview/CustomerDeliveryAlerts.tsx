"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
    Truck,
    ArrowUpRight,
    CheckCircle2,
    Package,
    Clock,
    Sparkles,
} from "lucide-react";
import { TOrder } from "@/types/order";

export interface CustomerDeliveryAlertsProps {
    orders?: (TOrder | any)[];
    isLoading?: boolean;
}

export const CustomerDeliveryAlerts: React.FC<CustomerDeliveryAlertsProps> = ({
    orders = [],
    isLoading = false,
}) => {
    // Determine active shipments from orders
    const activeShipments = useMemo(() => {
        return orders.filter((order) => {
            const status = (order.status || "").toUpperCase();
            return (
                status === "SHIPPED" ||
                status === "IN_TRANSIT" ||
                status === "OUT_OF_DELIVERY" ||
                status === "PROCESSING" ||
                status === "PENDING"
            );
        });
    }, [orders]);

    const hasActiveDeliveries = activeShipments.length > 0;

    return (
        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
            {/* Glowing top line */}
            <div
                className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent ${
                    hasActiveDeliveries ? "via-sky-400/60" : "via-emerald-400/60"
                } to-transparent pointer-events-none z-20`}
            />
            <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-base font-extrabold text-white">
                                Active Shipments Tracker
                            </h3>
                            <p className="text-xs text-slate-400">
                                Live courier status, estimated dispatch, and ongoing deliveries.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/customer/orders"
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group transition-colors"
                    >
                        <span>Tracker Hub</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Status Summary Banner */}
                <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 gap-2">
                    <div className="flex items-center gap-2 text-xs">
                        <Sparkles className="w-4 h-4 text-sky-400" />
                        <span className="text-slate-300 font-bold">Courier Dispatch Status:</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="badge badge-sm bg-sky-400/15 border-sky-400/30 text-sky-300 font-mono font-black text-xs">
                            {isLoading ? "—" : `${activeShipments.length} Active Shipment${activeShipments.length === 1 ? "" : "s"}`}
                        </span>
                    </div>
                </div>

                {/* Content: Active Deliveries or Up to date */}
                {isLoading ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                        <div className="w-7 h-7 rounded-full border-2 border-sky-400 border-t-transparent animate-spin mb-2" />
                        <span className="text-xs text-slate-400">Tracking live packages...</span>
                    </div>
                ) : !hasActiveDeliveries ? (
                    <div className="py-7 px-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center flex flex-col items-center justify-center space-y-2">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-extrabold text-white">All Deliveries Up to Date</h4>
                        <p className="text-xs text-slate-400 max-w-xs">
                            You have no packages currently in transit. All past orders have reached their destination safely.
                        </p>
                        <Link
                            href="/products"
                            className="btn btn-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg mt-1 font-bold"
                        >
                            Shop Trending Deals
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {activeShipments.slice(0, 3).map((order, idx) => {
                            const orderIdentifier =
                                order.orderNo || (order._id ? `#${order._id.slice(-6)}` : `#${idx + 1}`);
                            const vendorName =
                                order.vendor?.name ||
                                order.vendor?.storeName ||
                                (typeof order.vendor === "string" ? "Vendor" : "AmarZone Merchant");
                            const status = (order.status || "PENDING").toUpperCase();

                            return (
                                <div
                                    key={order._id || idx}
                                    className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/20 flex items-center justify-between gap-3 text-xs"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                                            <Package className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-white truncate max-w-[180px] sm:max-w-xs">
                                                Order {orderIdentifier}
                                            </p>
                                            <p className="text-[10px] text-sky-400 font-semibold flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{status} • {vendorName}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/customer/orders"
                                        className="btn btn-xs btn-outline border-sky-400/40 text-sky-300 hover:bg-sky-400 hover:text-slate-950 rounded-lg font-bold shrink-0"
                                    >
                                        Track
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDeliveryAlerts;

