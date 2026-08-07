'use client';

import React from 'react';
import { Search, Bell, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';

export const AdminTopbar: React.FC = () => {
    return (
        <div className="navbar bg-base-100 shadow-md border-b border-base-200 px-6 sticky top-0 z-20">
            {/* Navbar Start: Search input with DaisyUI classes */}
            <div className="navbar-start gap-2">
                <div className="form-control w-full max-w-xs relative">
                    <input
                        type="text"
                        placeholder="Search marketplace (Ctrl + K)..."
                        className="input input-bordered input-sm w-full pl-9 pr-4 rounded-xl"
                    />
                    <Search className="w-4 h-4 text-base-content/50 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
            </div>

            {/* Navbar Center: System Status Badge */}
            <div className="navbar-center hidden lg:flex">
                <div className="badge badge-success badge-outline gap-2 py-3 px-4 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                    <span>System SLA Uptime 99.98%</span>
                </div>
            </div>

            {/* Navbar End: Notifications & User Profile */}
            <div className="navbar-end gap-3">
                {/* Refresh Button */}
                <button type="button" className="btn btn-ghost btn-circle btn-sm" title="Refresh Dashboard">
                    <RefreshCw className="w-4 h-4 text-base-content/70" />
                </button>

                {/* Notifications Dropdown with DaisyUI Indicator & Card */}
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm">
                        <div className="indicator">
                            <Bell className="w-4 h-4 text-base-content/80" />
                            <span className="badge badge-warning badge-xs indicator-item font-bold">3</span>
                        </div>
                    </div>

                    <div
                        tabIndex={0}
                        className="dropdown-content card card-compact bg-base-100 border border-base-200 z-[50] w-80 shadow-2xl mt-3"
                    >
                        <div className="card-body">
                            <div className="flex items-center justify-between pb-2 border-b border-base-200">
                                <h3 className="card-title text-xs font-black flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-warning" /> Notifications
                                </h3>
                                <span className="badge badge-warning badge-sm font-bold">3 Unread</span>
                            </div>

                            <div className="space-y-2 text-xs">
                                <div className="alert alert-warning py-2 text-[11px] shadow-sm">
                                    <span>New Vendor Application: Nexus Tech Gadgets</span>
                                </div>
                                <div className="alert alert-success py-2 text-[11px] shadow-sm">
                                    <span>Order Sales Peak: +45% in last hour</span>
                                </div>
                                <div className="alert alert-info py-2 text-[11px] shadow-sm">
                                    <span>Dispute Opened for Order #ORD-9838</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Avatar Badge */}
                <div className="flex items-center gap-2 pl-2 border-l border-base-200">
                    <div className="avatar online">
                        <div className="w-9 rounded-xl">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                                alt="Admin Avatar"
                            />
                        </div>
                    </div>
                    <div className="hidden md:flex flex-col text-left">
                        <span className="text-xs font-bold leading-tight">Super Admin</span>
                        <span className="text-[10px] text-base-content/60">admin@amarzone.com</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTopbar;
