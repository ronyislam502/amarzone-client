'use client';

import React from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building,
    Globe,
    Shield,
    Store,
    Sparkles,
    CheckCircle2,
    Calendar,
    Hash,
    Truck,
    CreditCard,
    DollarSign,
    ShieldAlert,
    ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { TUserProfile, TUserRole } from '@/types/profile';

interface ProfileOverviewProps {
    profile: TUserProfile;
    role: TUserRole;
    onEdit: () => void;
}

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({ profile, role, onEdit }) => {
    const address = profile.address;
    const hasAddress = Boolean(
        address?.street || address?.state || address?.postalCode || address?.country
    );

    // Formatted dates
    const createdDate = profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : 'N/A';

    const updatedDate = profile.updatedAt
        ? new Date(profile.updatedAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : 'Recently';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Personal & Address Information */}
            <div className="lg:col-span-2 space-y-6">
                {/* Personal Information Card */}
                <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-7">
                    {/* Top glowing line */}
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

                    <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-extrabold text-white">
                                    Personal & Account Details
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Primary contact credentials and platform identifiers
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onEdit}
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                        >
                            Edit Details
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-amber-400" />
                                Full Name
                            </span>
                            <p className="text-sm font-extrabold text-white">{profile.name || 'Not provided'}</p>
                        </div>

                        {/* Email Address */}
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-amber-400" />
                                Email Address
                            </span>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-extrabold text-white truncate max-w-[200px]">
                                    {profile.email}
                                </p>
                                <span className="badge badge-success badge-xs font-bold text-[9px] shrink-0">
                                    Verified
                                </span>
                            </div>
                        </div>

                        {/* Contact Phone */}
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-amber-400" />
                                Contact Phone
                            </span>
                            <p className="text-sm font-extrabold text-white">
                                {profile.phone || (
                                    <span className="text-slate-500 font-normal italic">No phone added</span>
                                )}
                            </p>
                        </div>

                        {/* Platform Role */}
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-amber-400" />
                                Account Role
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-extrabold text-white uppercase">{role}</span>
                                <span className="badge badge-warning badge-xs font-black text-[9px]">
                                    Active Authority
                                </span>
                            </div>
                        </div>

                        {/* Account ID */}
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Hash className="w-3.5 h-3.5 text-amber-400" />
                                Account ID
                            </span>
                            <p className="text-xs font-mono font-medium text-slate-300 truncate">
                                {profile._id}
                            </p>
                        </div>

                        {/* Timeline */}
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                                Registration Timeline
                            </span>
                            <p className="text-xs text-slate-300">
                                Joined <span className="font-bold text-white">{createdDate}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Address & Location Card */}
                <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-7">
                    {/* Top glowing line */}
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/40 to-transparent pointer-events-none" />

                    <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-400 flex items-center justify-center">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-extrabold text-white">
                                    {role === 'VENDOR' ? 'Dispatch & Operating Address' : 'Address & Delivery Location'}
                                </h3>
                                <p className="text-xs text-slate-400">
                                    {role === 'VENDOR'
                                        ? 'Registered business premises and return warehouse'
                                        : 'Primary billing and parcel delivery address'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onEdit}
                            className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                        >
                            {hasAddress ? 'Edit Address' : '+ Add Address'}
                        </button>
                    </div>

                    {hasAddress ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-sky-400" />
                                    Street Address
                                </span>
                                <p className="text-xs font-bold text-white">
                                    {address?.street || 'Not specified'}
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                    <Building className="w-3 h-3 text-sky-400" />
                                    State / City
                                </span>
                                <p className="text-xs font-bold text-white">
                                    {address?.state || 'Not specified'}
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                    <Hash className="w-3 h-3 text-sky-400" />
                                    Postal / ZIP
                                </span>
                                <p className="text-xs font-bold text-white">
                                    {address?.postalCode || 'Not specified'}
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                    <Globe className="w-3 h-3 text-sky-400" />
                                    Country
                                </span>
                                <p className="text-xs font-bold text-white">
                                    {address?.country || 'Not specified'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-sky-400/10 text-sky-400 flex items-center justify-center mx-auto">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-white">No Address Registered</h4>
                                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                    Add your street, state, postal code, and country to enable swift checkout and accurate logistics tracking.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={onEdit}
                                className="btn btn-sm btn-ghost border border-white/10 text-sky-400 hover:bg-sky-400/10 hover:text-sky-300 font-bold rounded-xl"
                            >
                                + Set Up Address Now
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right 1 Col: Role-Specific Hub Card */}
            <div className="space-y-6">
                {/* Admin Role Specific Card */}
                {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
                    <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6">
                        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

                        <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-white">Administrative Scope</h3>
                                <p className="text-[11px] text-slate-400">Assigned Platform Privileges</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white">User & Staff Management</span>
                                    <p className="text-[11px] text-slate-400">
                                        Authority to inspect, onboard, and manage platform administrators and accounts.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white">Catalog & Moderation</span>
                                    <p className="text-[11px] text-slate-400">
                                        Supervise product listings, manage departments, and audit vendor catalog entries.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white">Financial & SLA Payouts</span>
                                    <p className="text-[11px] text-slate-400">
                                        Approve vendor withdrawal requests and enforce platform compliance standards.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">Governance Console</span>
                            <Link
                                href="/admin"
                                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                            >
                                <span>Go to Dashboard</span>
                                <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Vendor Role Specific Card */}
                {role === 'VENDOR' && (
                    <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6">
                        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-warning/40 to-transparent pointer-events-none" />

                        <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-warning/10 border border-warning/20 text-warning flex items-center justify-center">
                                <Store className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-white">Merchant Identity</h3>
                                <p className="text-[11px] text-slate-400">Store Profile & SLA Standards</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white">Fulfillment Standards</span>
                                    <p className="text-[11px] text-slate-400">
                                        Maintain a minimum 98% on-time dispatch rate to qualify for prime merchant placements.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <DollarSign className="w-4 h-4 text-info shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white">Payout Settlements</span>
                                    <p className="text-[11px] text-slate-400">
                                        Earnings are automatically cleared 7 days post delivery confirmation.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white">Store Dispute Guard</span>
                                    <p className="text-[11px] text-slate-400">
                                        Resolve customer inquiries within 48 business hours to prevent automatic refunds.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">Store Inventory</span>
                            <Link
                                href="/vendor/products"
                                className="text-xs font-bold text-warning hover:text-amber-300 flex items-center gap-1 transition-colors"
                            >
                                <span>Manage Products</span>
                                <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Customer Role Specific Card */}
                {role === 'CUSTOMER' && (
                    <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6">
                        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-info/40 to-transparent pointer-events-none" />

                        <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-info/10 border border-info/20 text-info flex items-center justify-center">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-white">Customer Privileges</h3>
                                <p className="text-[11px] text-slate-400">Amarzone Member Protection</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <Shield className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white">Buyer Protection Guarantee</span>
                                    <p className="text-[11px] text-slate-400">
                                        Every order placed on Amarzone is safeguarded with money-back security.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <CreditCard className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white">Amarzone Wallet Ready</span>
                                    <p className="text-[11px] text-slate-400">
                                        Use store wallet credit for lightning-fast checkout and instantaneous refunds.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <Truck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-white">Priority Dispatch</span>
                                    <p className="text-[11px] text-slate-400">
                                        Orders routed directly to verified local dispatch hubs.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">Customer Orders</span>
                            <Link
                                href="/customer/orders"
                                className="text-xs font-bold text-info hover:text-sky-300 flex items-center gap-1 transition-colors"
                            >
                                <span>Track My Orders</span>
                                <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileOverview;
