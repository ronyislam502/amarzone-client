'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu } from 'lucide-react';
import { superAdminSidebarItems } from '../../utilities/superAdminSidebar';
import { adminSidebarItems } from '../../utilities/adminSidebar';
import { vendorSidebarItems } from '../../utilities/vendorSidebar';
import { customerSidebarItems } from '../../utilities/customerSidebar';
import { NotificationBell } from '../notification/NotificationBell';


import { useAppSelector } from '@/src/redux/hooks';
import { selectCurrentUser } from '@/src/redux/features/auth/authSlice';

type TDynamicSidebarProps = {
    children: React.ReactNode;
}

type TRole = "SUPER_ADMIN" | "ADMIN" | "VENDOR" | "CUSTOMER";

type TUser = {
    name: string;
    email: string;
    role: TRole;
};

export const DashboardSidebar = ({ children }: TDynamicSidebarProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const reduxUser = useAppSelector(selectCurrentUser);

    // Automatically resolve role based on current user or active URL route
    let role: TRole = "CUSTOMER";
    if (reduxUser?.role) {
        role = reduxUser.role.toUpperCase() as TRole;
    } else if (pathname.startsWith("/admin")) {
        role = "ADMIN";
    } else if (pathname.startsWith("/vendor")) {
        role = "VENDOR";
    }

    const user: TUser = {
        name: reduxUser?.name || (role === "ADMIN" ? "Admin Administrator" : role === "VENDOR" ? "Store Partner" : "John Doe"),
        email: reduxUser?.email || (role === "ADMIN" ? "admin@amarzone.com" : role === "VENDOR" ? "vendor@amarzone.com" : "customer@amarzone.com"),
        role,
    };

    const handleSignOut = () => {
        router.push("/login");
    };

    let sidebarItems;
    switch (role) {
        case 'SUPER_ADMIN':
            sidebarItems = superAdminSidebarItems;
            break;
        case 'ADMIN':
            sidebarItems = adminSidebarItems;
            break;
        case 'VENDOR':
            sidebarItems = vendorSidebarItems;
            break;
        case 'CUSTOMER':
        default:
            sidebarItems = customerSidebarItems;
            break;
    }

    return (
        /* DaisyUI Component Drawer Implementation */
        <div className="drawer lg:drawer-open min-h-screen bg-base-300 text-base-content">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

            {/* Main Content Page Wrapper */}
            <div className="drawer-content flex flex-col min-w-0">
                {/* Top Navigation Header Bar */}
                <div className="w-full navbar bg-base-100 border-b border-base-200 px-4 sm:px-6 justify-between sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-2">
                        <label htmlFor="dashboard-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost lg:hidden">
                            <Menu className="w-5 h-5 text-primary" />
                        </label>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-base-content/50 uppercase tracking-wider">Dashboard</span>
                            <span className="text-sm font-extrabold text-base-content capitalize">{role.toLowerCase().replace('_', ' ')} Portal</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <NotificationBell />
                        <div className="hidden md:flex flex-col text-right">
                            <span className="text-xs font-extrabold text-base-content">{user?.name}</span>
                            <span className="text-[10px] text-base-content/60">{user?.email}</span>
                        </div>
                    </div>
                </div>

                {/* Page View Body */}
                <div className="flex-1">
                    {children}
                </div>
            </div>

            {/* Sidebar Drawer Container */}
            <div className="drawer-side z-40">
                <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <aside className="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col justify-between border-r border-base-300 shadow-2xl">
                    <div>
                        {/* Brand Logo Header */}
                        <div className="flex items-center justify-between px-2 py-3 mb-2 border-b border-base-300">
                            <Link href="/" className="flex items-center gap-3 group">
                                <Image
                                    src="https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png"
                                    alt="Amarzone Logo"
                                    width={180}
                                    height={60}
                                    className="object-contain group-hover:scale-105 transition-transform"
                                />
                            </Link>
                        </div>

                        {/* Dynamic Navigation Menu Items */}
                        <div className="mt-2 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                            {sidebarItems.map((section, sIdx) => (
                                <div key={sIdx}>
                                    <div className="menu-title text-[10px] font-black uppercase text-base-content/60 tracking-wider px-2 py-1">
                                        {section.title}
                                    </div>
                                    <ul className="menu menu-sm bg-base-100 rounded-box shadow-sm p-1.5 gap-0.5 border border-base-300">
                                        {section.items.map((item, iIdx) => {
                                            const Icon = item.icon;
                                            const isActive = ('exact' in item && item.exact)
                                                ? pathname === item.href
                                                : pathname.startsWith(item.href);

                                            return (
                                                <li key={item.href || iIdx}>
                                                    <Link
                                                        href={item.href}
                                                        className={`flex items-center justify-between text-xs py-2 px-3 rounded-lg font-bold transition-all ${isActive
                                                            ? 'active bg-primary text-primary-content shadow-md font-extrabold'
                                                            : 'hover:bg-base-200 text-base-content'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2.5 truncate">
                                                            <Icon className={`w-4 h-4 ${isActive ? 'text-primary-content' : item.iconClass}`} />
                                                            <span className="truncate">{item.label}</span>
                                                        </div>

                                                        {item.badge && (
                                                            <span className={`badge ${item.badge.className || 'badge-primary'} ml-auto font-bold text-[9px]`}>
                                                                {item.badge.text}
                                                            </span>
                                                        )}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer User Info & Sign Out */}
                    <div className="pt-4 border-t border-base-300 mt-4 space-y-2">
                        <div className="flex items-center justify-between px-2 text-xs">
                            <span className="text-base-content/60 font-semibold text-[10px] uppercase">Logged user</span>
                            <span className="font-extrabold text-primary text-[11px]">
                                {user?.name || user?.email || 'User'}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="btn btn-error btn-outline btn-block btn-sm gap-2 text-xs font-bold"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DashboardSidebar;
