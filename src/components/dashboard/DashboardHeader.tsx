'use client';

import React, { useState } from 'react';
import {
    Sparkles,
    Search,
    Bell,
    User,
    Shield,
    Store,
    Calendar,
    ChevronDown,
    SlidersHorizontal
} from 'lucide-react';

export type ActiveRole = 'ADMIN' | 'VENDOR' | 'CUSTOMER';

interface DashboardHeaderProps {
    activeRole: ActiveRole;
    onRoleChange: (role: ActiveRole) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    activeRole,
    onRoleChange,
}) => {
    const [selectedRange, setSelectedRange] = useState('Last 30 Days');

    return (
        <div className="relative rounded-3xl bg-slate-900/90 border border-white/10 p-6 backdrop-blur-2xl shadow-2xl overflow-hidden mb-8">
            {/* Background Ambient Orbs */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: User Greeting & Badges */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="badge badge-warning gap-1.5 px-3 py-2 text-xs font-bold shadow-md">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Amarzone Executive Control</span>
                        </div>
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            Live Production System
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-100">
                        Marketplace <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-orange-400">Dashboard</span>
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
                        Comprehensive real-time telemetry, revenue analytics, store health, and order fulfillment.
                    </p>
                </div>

                {/* Right: Controls & Role Switcher */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Role View Switcher */}
                    <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 shadow-inner">
                        <button
                            type="button"
                            onClick={() => onRoleChange('ADMIN')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                activeRole === 'ADMIN'
                                    ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <Shield className="w-3.5 h-3.5" />
                            <span>Admin View</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => onRoleChange('VENDOR')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                activeRole === 'VENDOR'
                                    ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <Store className="w-3.5 h-3.5" />
                            <span>Vendor View</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => onRoleChange('CUSTOMER')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                activeRole === 'CUSTOMER'
                                    ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <User className="w-3.5 h-3.5" />
                            <span>Customer View</span>
                        </button>
                    </div>

                    {/* Date Range Dropdown */}
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn bg-slate-950/80 hover:bg-slate-800 border-white/10 text-slate-200 text-xs font-bold gap-2 rounded-2xl px-4"
                        >
                            <Calendar className="w-4 h-4 text-amber-400" />
                            <span>{selectedRange}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-slate-900 border border-white/10 rounded-2xl z-[10] w-44 p-2 shadow-2xl text-xs"
                        >
                            {['Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year'].map((range) => (
                                <li key={range}>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRange(range)}
                                        className={`font-semibold ${selectedRange === range ? 'text-amber-400 font-bold' : 'text-slate-300'}`}
                                    >
                                        {range}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
