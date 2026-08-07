'use client';

import React, { useState } from 'react';
import { TrendingUp, Calendar, DollarSign, ShoppingBag, Layers } from 'lucide-react';

interface ChartPoint {
    month: string;
    revenue: number;
    orders: number;
    commission: number;
}

const MONTHLY_DATA: ChartPoint[] = [
    { month: 'Jan', revenue: 24500, orders: 420, commission: 2450 },
    { month: 'Feb', revenue: 31200, orders: 510, commission: 3120 },
    { month: 'Mar', revenue: 28900, orders: 480, commission: 2890 },
    { month: 'Apr', revenue: 42100, orders: 690, commission: 4210 },
    { month: 'May', revenue: 38400, orders: 620, commission: 3840 },
    { month: 'Jun', revenue: 56700, orders: 890, commission: 5670 },
    { month: 'Jul', revenue: 64200, orders: 980, commission: 6420 },
    { month: 'Aug', revenue: 78500, orders: 1150, commission: 7850 },
];

export const SalesChartWidget: React.FC = () => {
    const [activeMetric, setActiveMetric] = useState<'revenue' | 'orders' | 'commission'>('revenue');
    const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

    const maxValue = Math.max(...MONTHLY_DATA.map((d) => d[activeMetric]));

    const formatVal = (val: number) => {
        if (activeMetric === 'orders') return val.toLocaleString();
        return `$${val.toLocaleString()}`;
    };

    return (
        <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between">
            {/* Top Bar Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-100 tracking-tight">
                            Marketplace Performance Analytics
                        </h3>
                    </div>
                    <p className="text-slate-400 text-xs">
                        Real-time revenue growth, order distribution, and commission metrics
                    </p>
                </div>

                {/* Metric Selector Tabs */}
                <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-white/10">
                    <button
                        type="button"
                        onClick={() => setActiveMetric('revenue')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeMetric === 'revenue'
                                ? 'bg-amber-400 text-slate-950 shadow-md'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Revenue</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveMetric('orders')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeMetric === 'orders'
                                ? 'bg-amber-400 text-slate-950 shadow-md'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Orders</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveMetric('commission')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            activeMetric === 'commission'
                                ? 'bg-amber-400 text-slate-950 shadow-md'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Commission</span>
                    </button>
                </div>
            </div>

            {/* Hover Tooltip Overlay */}
            <div className="h-10 mb-2 flex items-center justify-between text-xs px-2 bg-slate-950/40 rounded-xl border border-white/5">
                <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {hoveredPoint ? `Month: ${hoveredPoint.month}` : 'Hover over bars for details'}
                </span>
                {hoveredPoint ? (
                    <span className="font-extrabold text-amber-400 text-sm">
                        {formatVal(hoveredPoint[activeMetric])}
                    </span>
                ) : (
                    <span className="text-slate-500 font-medium">8 Month Overview</span>
                )}
            </div>

            {/* Visual Bar Chart Render */}
            <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-white/10 relative">
                {/* Background grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                    <div className="border-b border-white w-full" />
                    <div className="border-b border-white w-full" />
                    <div className="border-b border-white w-full" />
                    <div className="border-b border-white w-full" />
                </div>

                {MONTHLY_DATA.map((item, idx) => {
                    const heightPercent = Math.round((item[activeMetric] / maxValue) * 100);

                    return (
                        <div
                            key={idx}
                            className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative z-10"
                            onMouseEnter={() => setHoveredPoint(item)}
                            onMouseLeave={() => setHoveredPoint(null)}
                        >
                            {/* Bar Container */}
                            <div className="w-full max-w-[42px] bg-slate-800/60 rounded-t-xl overflow-hidden relative flex items-end transition-all group-hover:bg-slate-800 h-full">
                                <div
                                    style={{ height: `${heightPercent}%` }}
                                    className="w-full bg-gradient-to-t from-amber-500 via-amber-400 to-amber-300 rounded-t-xl transition-all duration-500 group-hover:brightness-125 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                                />
                            </div>
                            <span className="text-[11px] font-bold text-slate-400 mt-2 transition-colors group-hover:text-amber-400">
                                {item.month}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Summary Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-950/40 border border-white/5">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Total YTD</span>
                    <span className="text-slate-100 font-extrabold text-sm mt-0.5 block">$364,500</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/40 border border-white/5">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Avg Monthly</span>
                    <span className="text-emerald-400 font-extrabold text-sm mt-0.5 block">$45,562</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/40 border border-white/5">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Growth</span>
                    <span className="text-amber-400 font-extrabold text-sm mt-0.5 block">+28.4%</span>
                </div>
            </div>
        </div>
    );
};

export default SalesChartWidget;
