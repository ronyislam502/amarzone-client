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
import Cookies from "js-cookie";
import { useAppSelector } from '@/src/redux/hooks';
import { logout, selectCurrentUser } from '@/src/redux/features/auth/authSlice';
import { useDispatch } from 'react-redux';

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
    const dispatch = useDispatch();

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
        dispatch(logout());
        Cookies.remove("refreshToken");
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
        <div data-theme="dark" className="drawer lg:drawer-open min-h-screen bg-[#090d16] text-slate-100">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

            {/* Main Content Page Wrapper */}
            <div className="drawer-content flex flex-col min-w-0">
                {/* Top Navigation Header Bar */}
                <header className="w-full navbar relative bg-[#090d16] text-slate-100 border-b border-white/10 px-4 sm:px-6 justify-between sticky top-0 z-30 shadow-xl overflow-hidden backdrop-blur-xl">
                    {/* Base Radial Mesh Background Gradient */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.18),rgba(255,255,255,0))] pointer-events-none" />

                    {/* Ambient Light Orbs */}
                    <div className="absolute -top-20 -left-16 w-60 h-60 bg-gradient-to-br from-amber-500/20 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                    {/* Dot Grid overlay */}
                    <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

                    {/* Glowing bottom border accent ray */}
                    <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none z-20" />

                    {/* Left: Mobile Drawer Trigger & Title */}
                    <div className="relative z-10 flex items-center gap-3">
                        <label
                            htmlFor="dashboard-drawer"
                            aria-label="open sidebar"
                            className="btn btn-square btn-ghost btn-sm lg:hidden text-amber-400 hover:bg-white/10 hover:text-amber-300 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </label>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400/90">
                                    Dashboard
                                </span>
                            </div>
                            <span className="text-sm font-extrabold text-white capitalize tracking-tight">
                                {role.toLowerCase().replace('_', ' ')} Portal
                            </span>
                        </div>
                    </div>

                    {/* Right: Notification Bell & User Profile */}
                    <div className="relative z-10 flex items-center gap-3">
                        <NotificationBell className="text-slate-200" />
                        <div className="hidden md:flex flex-col text-right pl-3 border-l border-white/10">
                            <span className="text-xs font-extrabold text-slate-100 tracking-wide">
                                {user?.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page View Body */}
                <div className="flex-1 bg-[#090d16]">
                    {children}
                </div>
            </div>

            {/* Sidebar Drawer Container */}
            <div className="drawer-side z-40">
                <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <aside className="w-80 min-h-full bg-[#0c1021] text-slate-100 flex flex-col justify-between border-r border-white/10 shadow-2xl font-sans antialiased">
                    {/* Inner Content Wrapper */}
                    <div className="flex flex-col justify-between h-full p-4">
                        <div className="w-full flex flex-col">
                            {/* Brand Logo Header */}
                            <div className="w-full flex items-center justify-between px-3 py-3 mb-3 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 shadow-md">
                                <Link href="/" className="flex items-center gap-3 group">
                                    <Image
                                        src="https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png"
                                        alt="Amarzone Logo"
                                        width={180}
                                        height={60}
                                        className="object-contain group-hover:scale-105 transition-transform brightness-110"
                                        style={{ width: "auto", height: "auto" }}
                                        priority
                                    />
                                </Link>
                            </div>

                            {/* Dynamic Navigation Menu Items */}
                            <div className="w-full mt-1 space-y-4 max-h-[calc(100vh-270px)] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                                {sidebarItems.map((section, sIdx) => (
                                    <div key={sIdx} className="w-full space-y-1.5">
                                        <div className="flex items-center gap-2 px-2.5 py-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400/80">
                                                {section.title}
                                            </span>
                                        </div>
                                        <ul className="w-full bg-white/[0.03] backdrop-blur-md rounded-2xl p-1.5 space-y-1 border border-white/10 shadow-md list-none m-0">
                                            {section.items.map((item, iIdx) => {
                                                const Icon = item.icon;
                                                const isActive = ('exact' in item && item.exact)
                                                    ? pathname === item.href
                                                    : pathname.startsWith(item.href);

                                                return (
                                                    <li key={item.href || iIdx} className="w-full list-none">
                                                        <Link
                                                            href={item.href}
                                                            className={`w-full h-10 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all duration-200 ${isActive
                                                                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/25 font-black border border-amber-400/40'
                                                                : 'text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/15 border border-transparent'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                                                                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.iconClass || 'text-slate-300'}`} />
                                                                <span className="truncate">{item.label}</span>
                                                            </div>

                                                            {item.badge && (
                                                                <span className={`badge ${item.badge.className || 'badge-primary'} ml-auto shrink-0 font-bold text-[9px] border border-white/20 shadow-xs`}>
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
                        <div className="w-full pt-3 mt-3 border-t border-white/10 space-y-2.5 bg-white/[0.03] backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                            <div className="flex items-center justify-between px-1 text-xs">
                                <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Logged user</span>
                                <span className="font-extrabold text-amber-400 text-[11px] truncate max-w-[130px]">
                                    {user?.name || user?.email || 'User'}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="btn btn-error btn-outline btn-block btn-sm gap-2 text-xs font-bold rounded-xl border-error/40 hover:bg-error hover:text-white hover:border-error transition-all duration-200"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DashboardSidebar;
