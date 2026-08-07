'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Store,
    Users,
    ShoppingBag,
    Layers,
    DollarSign,
    ShieldAlert,
    BarChart3,
    Settings,
    LogOut,
    Activity,
    ShieldCheck
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
    const pathname = usePathname();

    return (
        <aside className="w-72 bg-base-300 min-h-screen text-base-content flex flex-col justify-between p-4 border-r border-base-200">
            <div>
                {/* Brand Header */}
                <div className="flex items-center gap-3 px-3 py-4 border-b border-base-200">
                    <div className="avatar placeholder">
                        <div className="w-10 rounded-xl bg-primary text-primary-content font-black text-xl shadow-lg">
                            <span>A</span>
                        </div>
                    </div>
                    <div>
                        <h1 className="font-extrabold text-lg leading-tight">
                            Amarzone<span className="text-primary">.</span>
                        </h1>
                        <span className="badge badge-primary badge-xs font-bold tracking-widest uppercase">
                            Admin Control
                        </span>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="card bg-base-100 shadow-md my-4 p-3 border border-base-200">
                    <div className="flex items-center gap-3">
                        <div className="avatar online">
                            <div className="w-10 rounded-xl ring ring-primary ring-offset-base-100 ring-offset-1">
                                <img
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                                    alt="Admin Avatar"
                                />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="font-bold text-xs truncate">System Administrator</h2>
                            <span className="badge badge-warning badge-sm gap-1 font-extrabold text-[10px] mt-0.5">
                                <ShieldCheck className="w-3 h-3" /> SUPER ADMIN
                            </span>
                        </div>
                    </div>
                </div>

                {/* DaisyUI Menu Navigation */}
                <ul className="menu menu-md bg-base-100 rounded-box shadow-md p-2 gap-1">
                    <li className="menu-title text-[10px] font-black uppercase text-base-content/60">
                        Main Overview
                    </li>
                    <li>
                        <Link href="/admin" className={pathname === '/admin' ? 'active font-bold' : ''}>
                            <LayoutDashboard className="w-4 h-4 text-primary" />
                            <span>Admin Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/analytics" className={pathname === '/admin/analytics' ? 'active font-bold' : ''}>
                            <BarChart3 className="w-4 h-4 text-secondary" />
                            <span>Analytics</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/health" className={pathname === '/admin/health' ? 'active font-bold' : ''}>
                            <Activity className="w-4 h-4 text-success" />
                            <span>System Health</span>
                            <span className="badge badge-success badge-sm ml-auto font-bold">99.8%</span>
                        </Link>
                    </li>

                    <li className="menu-title text-[10px] font-black uppercase text-base-content/60 mt-3">
                        Management
                    </li>
                    <li>
                        <Link href="/admin/vendors" className={pathname.startsWith('/admin/vendors') ? 'active font-bold' : ''}>
                            <Store className="w-4 h-4 text-warning" />
                            <span>Vendors</span>
                            <span className="badge badge-warning badge-sm ml-auto font-bold">12 New</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/customers" className={pathname.startsWith('/admin/customers') ? 'active font-bold' : ''}>
                            <Users className="w-4 h-4 text-info" />
                            <span>Customers</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/categories" className={pathname.startsWith('/admin/categories') ? 'active font-bold' : ''}>
                            <Layers className="w-4 h-4 text-accent" />
                            <span>Categories</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/products" className={pathname.startsWith('/admin/products') ? 'active font-bold' : ''}>
                            <ShoppingBag className="w-4 h-4 text-primary" />
                            <span>Products</span>
                        </Link>
                    </li>

                    <li className="menu-title text-[10px] font-black uppercase text-base-content/60 mt-3">
                        Finance & SLA
                    </li>
                    <li>
                        <Link href="/admin/payouts" className={pathname.startsWith('/admin/payouts') ? 'active font-bold' : ''}>
                            <DollarSign className="w-4 h-4 text-success" />
                            <span>Payout Requests</span>
                            <span className="badge badge-info badge-sm ml-auto font-bold">5 Pending</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/disputes" className={pathname.startsWith('/admin/disputes') ? 'active font-bold' : ''}>
                            <ShieldAlert className="w-4 h-4 text-error" />
                            <span>Disputes</span>
                            <span className="badge badge-error badge-sm ml-auto font-bold">3 Open</span>
                        </Link>
                    </li>

                    <li className="menu-title text-[10px] font-black uppercase text-base-content/60 mt-3">
                        System Config
                    </li>
                    <li>
                        <Link href="/admin/settings" className={pathname.startsWith('/admin/settings') ? 'active font-bold' : ''}>
                            <Settings className="w-4 h-4 text-base-content/70" />
                            <span>Settings</span>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Footer Sign out Button */}
            <div className="pt-4 border-t border-base-200">
                <Link href="/login" className="btn btn-error btn-outline btn-block gap-2 text-xs">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </Link>
            </div>
        </aside>
    );
};

export default AdminSidebar;
