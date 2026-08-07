'use client';

import React from 'react';
import { PlusCircle, ShoppingBag, ShieldCheck, DollarSign, Activity, Users, Settings } from 'lucide-react';
import Link from 'next/link';

interface QuickAction {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    badge?: string;
    accentColor: string;
}

const ACTIONS: QuickAction[] = [
    {
        title: 'Add New Product',
        description: 'Upload catalog items & set stock',
        icon: <PlusCircle className="w-5 h-5 text-amber-400" />,
        href: '/dashboard/products/new',
        accentColor: 'border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10',
    },
    {
        title: 'Manage Orders',
        description: 'Process pending & unshipped orders',
        icon: <ShoppingBag className="w-5 h-5 text-emerald-400" />,
        href: '/dashboard/orders',
        badge: '14 Pending',
        accentColor: 'border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10',
    },
    {
        title: 'Payout Request',
        description: 'Transfer seller earnings to bank',
        icon: <DollarSign className="w-5 h-5 text-indigo-400" />,
        href: '/dashboard/payouts',
        accentColor: 'border-indigo-500/30 hover:border-indigo-400 hover:bg-indigo-500/10',
    },
    {
        title: 'System Health',
        description: 'Monitor SLA & account status',
        icon: <Activity className="w-5 h-5 text-cyan-400" />,
        href: '/dashboard/health',
        badge: '99.8% Healthy',
        accentColor: 'border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10',
    },
];

export const QuickActionsWidget: React.FC = () => {
    return (
        <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold text-slate-100 tracking-tight">
                    Quick Actions
                </h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Shortcuts
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ACTIONS.map((action, idx) => (
                    <Link
                        key={idx}
                        href={action.href}
                        className={`p-3.5 rounded-2xl bg-slate-950/40 border transition-all duration-300 flex items-start justify-between gap-3 group active:scale-95 ${action.accentColor}`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-slate-800/80 border border-white/10 group-hover:scale-110 transition-transform">
                                {action.icon}
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                                    {action.title}
                                </h4>
                                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                                    {action.description}
                                </p>
                            </div>
                        </div>

                        {action.badge && (
                            <span className="badge badge-warning badge-xs text-[9px] font-bold px-1.5 py-0.5 shrink-0">
                                {action.badge}
                            </span>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuickActionsWidget;
