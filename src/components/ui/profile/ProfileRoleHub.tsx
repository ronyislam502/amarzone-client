'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ShieldCheck,
    Store,
    Users,
    Package,
    Building2,
    Layers,
    DollarSign,
    ShieldAlert,
    Heart,
    Star,
    Wallet,
    CreditCard,
    ShoppingBag,
    PlusCircle,
    ArrowRight,
    Camera,
    Image as ImageIcon,
} from 'lucide-react';
import { TUserProfile, TUserRole } from '@/types/profile';

interface ProfileRoleHubProps {
    profile: TUserProfile;
    role: TUserRole;
    onEdit: () => void;
}

export const ProfileRoleHub: React.FC<ProfileRoleHubProps> = ({ profile, role, onEdit }) => {
    // ADMIN HUB VIEW
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        const adminShortcuts = [
            {
                label: 'Admins & Staff',
                href: '/admin/admins',
                desc: 'Manage administrative personnel & privileges',
                icon: ShieldCheck,
                badge: 'Governance',
                badgeClass: 'badge-secondary',
            },
            {
                label: 'Vendor Management',
                href: '/admin/vendors',
                desc: 'Approve, audit & oversee active merchant accounts',
                icon: Store,
                badge: 'Merchants',
                badgeClass: 'badge-warning',
            },
            {
                label: 'Customer Directory',
                href: '/admin/customers',
                desc: 'Inspect customer accounts, orders & addresses',
                icon: Users,
                badge: 'Members',
                badgeClass: 'badge-info',
            },
            {
                label: 'Departments & Categories',
                href: '/admin/departments',
                desc: 'Organize marketplace hierarchy & taxonomy',
                icon: Building2,
                badge: 'Catalog',
                badgeClass: 'badge-accent',
            },
            {
                label: 'Platform Orders',
                href: '/admin/orders',
                desc: 'Audit fulfillment cycles & customer shipments',
                icon: Package,
                badge: 'Fulfillment',
                badgeClass: 'badge-success',
            },
            {
                label: 'Dispute Arbitration',
                href: '/admin/disputes',
                desc: 'Review claims and mediate customer-vendor disputes',
                icon: ShieldAlert,
                badge: 'Claims',
                badgeClass: 'badge-error',
            },
        ];

        return (
            <div className="space-y-6">
                {/* Header Banner */}
                <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-7">
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white">Administrative Governance Hub</h3>
                                <p className="text-xs text-slate-400">
                                    Full spectrum platform oversight, access control, and operational audit tools
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/admin"
                            className="btn btn-sm btn-ghost border border-white/10 text-amber-400 hover:bg-amber-400/10 hover:text-amber-300 rounded-xl"
                        >
                            <span>Open Dashboard</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </div>

                {/* Shortcuts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adminShortcuts.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={idx}
                                href={item.href}
                                className="group card relative overflow-hidden bg-[#170d2f] border border-white/10 hover:border-amber-400/40 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/10 block"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={`badge ${item.badgeClass} badge-sm font-bold text-[9px]`}>
                                        {item.badge}
                                    </span>
                                </div>
                                <h4 className="text-sm font-extrabold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                                    <span>{item.label}</span>
                                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </h4>
                                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    // VENDOR HUB VIEW
    if (role === 'VENDOR') {
        const vendorShortcuts = [
            {
                label: 'My Products',
                href: '/vendor/products',
                desc: 'Manage live listings, variants & pricing',
                icon: ShoppingBag,
                badge: 'Catalog',
                badgeClass: 'badge-warning',
            },
            {
                label: 'Add New Product',
                href: '/vendor/products/add',
                desc: 'Publish a new item to the Amarzone marketplace',
                icon: PlusCircle,
                badge: 'Create',
                badgeClass: 'badge-success',
            },
            {
                label: 'Inventory & Stock',
                href: '/vendor/inventory',
                desc: 'Real-time stock alerts & replenishment',
                icon: Layers,
                badge: 'Stock',
                badgeClass: 'badge-accent',
            },
            {
                label: 'Store Orders',
                href: '/vendor/orders',
                desc: 'Fulfill customer orders & print shipping manifests',
                icon: Package,
                badge: 'Fulfillment',
                badgeClass: 'badge-info',
            },
            {
                label: 'Earnings & Payouts',
                href: '/vendor/payouts',
                desc: 'Review sales revenue, balance & withdrawals',
                icon: DollarSign,
                badge: 'Finance',
                badgeClass: 'badge-success',
            },
            {
                label: 'Store Disputes',
                href: '/vendor/disputes',
                desc: 'Handle buyer returns & unresolved inquiries',
                icon: ShieldAlert,
                badge: 'Support',
                badgeClass: 'badge-error',
            },
        ];

        return (
            <div className="space-y-6">
                {/* Brand Visual Assets Card */}
                <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-7">
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-warning/60 to-transparent pointer-events-none" />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/10 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-warning/10 border border-warning/20 text-warning flex items-center justify-center shrink-0">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white">Store & Brand Identity</h3>
                                <p className="text-xs text-slate-400">
                                    Visual showcase and storefront branding seen by customers across Amarzone
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onEdit}
                            className="btn btn-sm btn-ghost border border-white/10 text-warning hover:bg-warning/10 hover:text-amber-300 rounded-xl"
                        >
                            <Camera className="w-3.5 h-3.5 mr-1" />
                            <span>Update Branding</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Store Logo Showcase */}
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                                    <ImageIcon className="w-4 h-4 text-warning" />
                                    Store Logo / Mark
                                </span>
                                <span className="text-[10px] text-slate-400">1:1 Square Format</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-warning/30 bg-slate-900 relative shrink-0">
                                    <Image
                                        src={
                                            profile.logo ||
                                            profile.avatar ||
                                            'https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png'
                                        }
                                        alt="Store Logo"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="space-y-1 text-xs">
                                    <p className="font-extrabold text-white">{profile.name || 'Store Name'}</p>
                                    <p className="text-[11px] text-slate-400 leading-tight">
                                        Shown on product detail cards, vendor badges, and merchant storefront.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Store Banner Showcase */}
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                                    <ImageIcon className="w-4 h-4 text-warning" />
                                    Storefront Banner
                                </span>
                                <span className="text-[10px] text-slate-400">Wide 16:9 Format</span>
                            </div>
                            <div className="h-20 w-full rounded-2xl overflow-hidden ring-2 ring-warning/30 bg-slate-900 relative">
                                {profile.banner ? (
                                    <Image
                                        src={profile.banner}
                                        alt="Store Banner"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-amber-500/10 via-orange-600/10 to-transparent text-xs text-slate-400">
                                        <span>Default Thematic Banner Active</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shortcuts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vendorShortcuts.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={idx}
                                href={item.href}
                                className="group card relative overflow-hidden bg-[#170d2f] border border-white/10 hover:border-warning/40 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-warning/10 block"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 text-warning flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={`badge ${item.badgeClass} badge-sm font-bold text-[9px]`}>
                                        {item.badge}
                                    </span>
                                </div>
                                <h4 className="text-sm font-extrabold text-white group-hover:text-warning transition-colors flex items-center gap-1.5">
                                    <span>{item.label}</span>
                                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </h4>
                                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    // CUSTOMER HUB VIEW
    const customerShortcuts = [
        {
            label: 'My Orders',
            href: '/customer/orders',
            desc: 'Inspect active deliveries, tracking codes & parcel history',
            icon: Package,
            badge: 'Orders',
            badgeClass: 'badge-info',
        },
        {
            label: 'Wishlist & Saved',
            href: '/customer/wishlist',
            desc: 'Saved bookmarks and price-drop notifications',
            icon: Heart,
            badge: 'Saved',
            badgeClass: 'badge-error',
        },
        {
            label: 'My Reviews',
            href: '/customer/reviews',
            desc: 'Product ratings and vendor feedback submitted by you',
            icon: Star,
            badge: 'Feedback',
            badgeClass: 'badge-warning',
        },
        {
            label: 'Amarzone Wallet',
            href: '/customer/wallet',
            desc: 'Store balance, instant checkout & promotional credits',
            icon: Wallet,
            badge: 'Wallet',
            badgeClass: 'badge-success',
        },
        {
            label: 'Payment Methods',
            href: '/customer/payment-methods',
            desc: 'Manage saved credit cards & billing methods',
            icon: CreditCard,
            badge: 'Billing',
            badgeClass: 'badge-accent',
        },
        {
            label: 'Disputes & Claims',
            href: '/customer/disputes',
            desc: 'Resolution center for return requests and item guarantees',
            icon: ShieldAlert,
            badge: 'Claims',
            badgeClass: 'badge-error',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-7">
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-info/60 to-transparent pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-info/10 border border-info/20 text-info flex items-center justify-center shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white">Customer Shopping & Hub Center</h3>
                            <p className="text-xs text-slate-400">
                                Order fulfillment shortcuts, wallet credits, and buyer protection services
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="btn btn-sm btn-ghost border border-white/10 text-info hover:bg-info/10 hover:text-sky-300 rounded-xl"
                    >
                        <span>Explore Marketplace</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>

            {/* Shortcuts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customerShortcuts.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            className="group card relative overflow-hidden bg-[#170d2f] border border-white/10 hover:border-info/40 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-info/10 block"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 text-info flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className={`badge ${item.badgeClass} badge-sm font-bold text-[9px]`}>
                                    {item.badge}
                                </span>
                            </div>
                            <h4 className="text-sm font-extrabold text-white group-hover:text-info transition-colors flex items-center gap-1.5">
                                <span>{item.label}</span>
                                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h4>
                            <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default ProfileRoleHub;
