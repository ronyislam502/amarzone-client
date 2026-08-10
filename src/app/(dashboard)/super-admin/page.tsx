'use client';

import React, { useState } from 'react';
import {
    ShieldCheck,
    Users,
    Store,
    DollarSign,
    Activity,
    Lock,
    Key,
    Server,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    Download,
    RefreshCw,
    Sparkles,
    Settings,
    UserCheck,
    BarChart3,
    Check,
} from 'lucide-react';
import { ROLE_DETAILS, TUserRole } from '@/components/utilities/constant';

interface RBACPermission {
    feature: string;
    description: string;
    super_admin: boolean;
    admin: boolean;
    vendor: boolean;
    customer: boolean;
}

const PERMISSIONS_MATRIX: RBACPermission[] = [
    {
        feature: 'Root System Control & RBAC Configuration',
        description: 'Manage system roles, security policies, and root configurations',
        super_admin: true,
        admin: false,
        vendor: false,
        customer: false,
    },
    {
        feature: 'Global Financial Payout Approvals',
        description: 'Approve or reject vendor payout requests and commission rates',
        super_admin: true,
        admin: true,
        vendor: false,
        customer: false,
    },
    {
        feature: 'Vendor Onboarding & Moderation',
        description: 'Verify, suspend, or manage seller accounts on the platform',
        super_admin: true,
        admin: true,
        vendor: false,
        customer: false,
    },
    {
        feature: 'Storefront Product & Inventory Management',
        description: 'Add, update, or remove products and track inventory',
        super_admin: true,
        admin: true,
        vendor: true,
        customer: false,
    },
    {
        feature: 'Order Fulfillment & Shipping Updates',
        description: 'Process store orders and update package tracking status',
        super_admin: true,
        admin: true,
        vendor: true,
        customer: false,
    },
    {
        feature: 'Personal Shopping, Wishlist & Orders',
        description: 'Browse catalog, place orders, write reviews, manage wallet',
        super_admin: true,
        admin: true,
        vendor: true,
        customer: true,
    },
];

export default function SuperAdminDashboard() {
    const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');

    return (
        <div className="space-y-8 py-2">
            {/* Header Title Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100 p-6 rounded-3xl border border-base-300 shadow-md">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="badge badge-secondary gap-1 font-black text-xs uppercase px-3 py-2 shadow-sm">
                            <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Control
                        </span>
                        <span className="badge badge-outline badge-xs font-mono">v3.8.0-ROOT</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">
                        Super Admin Governance Hub
                    </h1>
                    <p className="text-xs text-base-content/70">
                        Full system administration, security policies, and Role-Based Access Control (RBAC).
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="btn btn-sm btn-outline gap-2">
                        <RefreshCw className="w-3.5 h-3.5" /> Sync Permissions
                    </button>
                    <button className="btn btn-sm btn-secondary gap-2 shadow-lg">
                        <Key className="w-3.5 h-3.5" /> Security Audit
                    </button>
                </div>
            </div>

            {/* Core System Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card bg-base-100 border border-base-300 p-5 shadow-md">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-base-content/60 uppercase">Platform Volume</span>
                        <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black mt-2">$1,428,900</h2>
                    <p className="text-[10px] text-success font-bold mt-1">↑ +24.8% from last month</p>
                </div>

                <div className="card bg-base-100 border border-base-300 p-5 shadow-md">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-base-content/60 uppercase">Active Vendors</span>
                        <div className="p-2.5 rounded-xl bg-warning/10 text-warning">
                            <Store className="w-5 h-5" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black mt-2">248 Sellers</h2>
                    <p className="text-[10px] text-base-content/60 font-bold mt-1">12 pending verification</p>
                </div>

                <div className="card bg-base-100 border border-base-300 p-5 shadow-md">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-base-content/60 uppercase">Registered Customers</span>
                        <div className="p-2.5 rounded-xl bg-info/10 text-info">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black mt-2">18,920</h2>
                    <p className="text-[10px] text-info font-bold mt-1">+1,240 new this week</p>
                </div>

                <div className="card bg-base-100 border border-base-300 p-5 shadow-md">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-base-content/60 uppercase">System Uptime</span>
                        <div className="p-2.5 rounded-xl bg-success/10 text-success">
                            <Server className="w-5 h-5" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black mt-2">99.98% SLA</h2>
                    <p className="text-[10px] text-success font-bold mt-1">All cluster nodes operational</p>
                </div>
            </div>

            {/* Role Overview Cards */}
            <div className="space-y-4">
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-secondary" /> System Roles Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(Object.keys(ROLE_DETAILS) as TUserRole[]).map((rKey) => {
                        const r = ROLE_DETAILS[rKey];
                        return (
                            <div key={rKey} className="card bg-base-100 border border-base-300 p-5 shadow-md relative overflow-hidden">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`badge ${r.badgeClass} font-black text-xs`}>
                                        {r.label}
                                    </span>
                                    <span className="text-xs font-mono font-bold opacity-60">{r.role}</span>
                                </div>
                                <p className="text-xs text-base-content/70 mt-1 min-h-[32px]">
                                    {r.description}
                                </p>
                                <div className="mt-4 pt-3 border-t border-base-200 flex justify-between items-center text-xs">
                                    <span className="text-base-content/60 font-semibold">Landing:</span>
                                    <code className="bg-base-200 px-2 py-0.5 rounded text-[10px] font-bold text-primary">
                                        {r.defaultDashboard}
                                    </code>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* RBAC Governance Permissions Matrix Table */}
            <div className="card bg-base-100 border border-base-300 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-base-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-extrabold flex items-center gap-2">
                            <Lock className="w-5 h-5 text-secondary" /> Role-Based Access Control (RBAC) Permission Matrix
                        </h3>
                        <p className="text-xs text-base-content/60 mt-1">
                            Current authority grid enforcing dashboard navigation and route protection across all system roles.
                        </p>
                    </div>

                    <div className="badge badge-secondary badge-lg font-extrabold gap-2">
                        <Sparkles className="w-4 h-4" /> Active Policy Enforced
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-base-200/80 text-xs font-black uppercase text-base-content/70">
                                <th>Feature Capability</th>
                                <th className="text-center">Super Admin</th>
                                <th className="text-center">Admin</th>
                                <th className="text-center">Vendor</th>
                                <th className="text-center">Customer</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {PERMISSIONS_MATRIX.map((perm, idx) => (
                                <tr key={idx} className="hover:bg-base-200/50 transition-colors">
                                    <td className="font-semibold py-4">
                                        <div className="font-extrabold text-sm">{perm.feature}</div>
                                        <div className="text-[11px] text-base-content/60">{perm.description}</div>
                                    </td>

                                    <td className="text-center">
                                        {perm.super_admin ? (
                                            <div className="badge badge-success gap-1 font-bold text-[10px]">
                                                <CheckCircle2 className="w-3 h-3" /> ALLOWED
                                            </div>
                                        ) : (
                                            <div className="badge badge-error badge-outline gap-1 font-bold text-[10px]">
                                                <XCircle className="w-3 h-3" /> DENIED
                                            </div>
                                        )}
                                    </td>

                                    <td className="text-center">
                                        {perm.admin ? (
                                            <div className="badge badge-success gap-1 font-bold text-[10px]">
                                                <CheckCircle2 className="w-3 h-3" /> ALLOWED
                                            </div>
                                        ) : (
                                            <div className="badge badge-error badge-outline gap-1 font-bold text-[10px]">
                                                <XCircle className="w-3 h-3" /> DENIED
                                            </div>
                                        )}
                                    </td>

                                    <td className="text-center">
                                        {perm.vendor ? (
                                            <div className="badge badge-success gap-1 font-bold text-[10px]">
                                                <CheckCircle2 className="w-3 h-3" /> ALLOWED
                                            </div>
                                        ) : (
                                            <div className="badge badge-error badge-outline gap-1 font-bold text-[10px]">
                                                <XCircle className="w-3 h-3" /> DENIED
                                            </div>
                                        )}
                                    </td>

                                    <td className="text-center">
                                        {perm.customer ? (
                                            <div className="badge badge-success gap-1 font-bold text-[10px]">
                                                <CheckCircle2 className="w-3 h-3" /> ALLOWED
                                            </div>
                                        ) : (
                                            <div className="badge badge-error badge-outline gap-1 font-bold text-[10px]">
                                                <XCircle className="w-3 h-3" /> DENIED
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
