'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    isPositive?: boolean;
    subtitle?: string;
    icon: React.ReactNode;
    accentColor?: 'amber' | 'emerald' | 'indigo' | 'purple' | 'rose' | 'cyan';
}

const COLOR_MAP = {
    amber: {
        bg: 'from-amber-500/10 via-amber-500/5 to-transparent',
        border: 'border-amber-500/30 hover:border-amber-500/60',
        iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
        accentText: 'text-amber-400',
    },
    emerald: {
        bg: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
        border: 'border-emerald-500/30 hover:border-emerald-500/60',
        iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
        accentText: 'text-emerald-400',
    },
    indigo: {
        bg: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
        border: 'border-indigo-500/30 hover:border-indigo-500/60',
        iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
        glow: 'shadow-[0_0_30px_rgba(99,102,241,0.15)]',
        accentText: 'text-indigo-400',
    },
    purple: {
        bg: 'from-purple-500/10 via-purple-500/5 to-transparent',
        border: 'border-purple-500/30 hover:border-purple-500/60',
        iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
        glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]',
        accentText: 'text-purple-400',
    },
    rose: {
        bg: 'from-rose-500/10 via-rose-500/5 to-transparent',
        border: 'border-rose-500/30 hover:border-rose-500/60',
        iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
        glow: 'shadow-[0_0_30px_rgba(244,63,94,0.15)]',
        accentText: 'text-rose-400',
    },
    cyan: {
        bg: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
        border: 'border-cyan-500/30 hover:border-cyan-500/60',
        iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        glow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)]',
        accentText: 'text-cyan-400',
    },
};

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    isPositive = true,
    subtitle = 'vs last period',
    icon,
    accentColor = 'amber',
}) => {
    const colorStyle = COLOR_MAP[accentColor];

    return (
        <div
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorStyle.bg} bg-slate-900/90 border ${colorStyle.border} p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${colorStyle.glow} group`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                        {title}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-2 tracking-tight">
                        {value}
                    </h3>
                </div>

                <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border ${colorStyle.iconBg} shrink-0 transition-transform group-hover:scale-110`}
                >
                    {icon}
                </div>
            </div>

            {(change || subtitle) && (
                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-white/5 text-xs">
                    {change && (
                        <span
                            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold text-[11px] ${
                                isPositive
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                        >
                            {isPositive ? (
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            ) : (
                                <ArrowDownRight className="w-3.5 h-3.5" />
                            )}
                            {change}
                        </span>
                    )}
                    {subtitle && <span className="text-slate-400 text-[11px]">{subtitle}</span>}
                </div>
            )}
        </div>
    );
};

export default StatCard;
