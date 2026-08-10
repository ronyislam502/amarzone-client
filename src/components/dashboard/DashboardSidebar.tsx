'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    ShieldCheck,
    LogOut,
    Menu,
    ChevronDown,
    Check,
} from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser, TUser } from '@/redux/features/auth/authSlice';


interface DynamicSidebarProps {
    children: React.ReactNode;
}

export const DashboardSidebar: React.FC<DynamicSidebarProps> = ({ children }) => {
    const pathname = usePathname();
    const user = useAppSelector(selectCurrentUser);




    return (
        /* DaisyUI Component Drawer Implementation */
        <div className="drawer lg:drawer-open min-h-screen bg-base-300 text-base-content">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

            {/* Main Content Page Wrapper */}
            <div className="drawer-content flex flex-col min-w-0">
                {/* Mobile Drawer Navigation Header Bar */}
                <div className="w-full navbar bg-base-100 border-b border-base-200 lg:hidden px-4 justify-between">
                    <div className="flex items-center gap-2">
                        <label htmlFor="dashboard-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <Menu className="w-5 h-5 text-primary" />
                        </label>
                        <Link href="/" className="inline-flex items-center">
                            <Image
                                src="https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png"
                                alt="Amarzone Logo"
                                width={180}
                                height={60}
                                className="object-contain"
                            />
                        </Link>
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
                            {filteredSections.map((section, sIdx) => (
                                <div key={sIdx}>
                                    <div className="menu-title text-[10px] font-black uppercase text-base-content/60 tracking-wider px-2 py-1">
                                        {section.title}
                                    </div>
                                    <ul className="menu menu-sm bg-base-100 rounded-box shadow-sm p-1.5 gap-0.5 border border-base-300">
                                        {section.items.map((item) => {
                                            const Icon = item.icon;
                                            const isActive = item.exact
                                                ? pathname === item.href
                                                : pathname.startsWith(item.href);

                                            return (
                                                <li key={item.id}>
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
                            {/* <span className="font-extrabold text-primary text-[11px]">
                                {currentUser?.name || currentUser?.email || 'User'}
                            </span> */}
                        </div>
                        {/* <button
                            type="button"
                            onClick={handleSignOut}
                            className="btn btn-error btn-outline btn-block btn-sm gap-2 text-xs font-bold"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button> */}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DashboardSidebar;
