"use client";

import React, { useState, useMemo, useEffect } from "react";
import { BarChart3, Info } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

export interface TBarChartItem {
    id?: string | number;
    label: string;
    value: number;
    secondaryLabel?: string;
    meta?: string | number;
    color?: string;
    gradient?: string;
    badgeNumber?: number;
}

export interface TBarChartTab {
    key: string;
    label: string;
    icon?: React.ReactNode;
    layout?: "horizontal" | "vertical";
    data: TBarChartItem[];
    colorGradient?: string;
    valueFormatter?: (val: number) => string;
    unitLabel?: string;
    emptyMessage?: string;
}

export interface BarChartProps {
    /** Single dataset */
    data?: TBarChartItem[];
    /** Multiple datasets with tab switcher */
    tabs?: TBarChartTab[];
    /** Layout mode */
    layout?: "horizontal" | "vertical";
    /** Currently active tab */
    defaultTab?: string;
    activeTab?: string;
    onTabChange?: (key: string) => void;

    /** Visual customizations */
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    headerRight?: React.ReactNode;
    colorGradient?: string;
    showRankBadges?: boolean;
    valueFormatter?: (val: number) => string;
    unitLabel?: string;

    /** Dimensions & Modes */
    compact?: boolean;
    maxVal?: number;
    height?: number | string;
    containerCard?: boolean;
    emptyMessage?: string;
    className?: string;
}

const DEFAULT_GRADIENT_PALETTES = [
    { start: "#8b5cf6", end: "#ec4899" }, // purple to pink
    { start: "#06b6d4", end: "#3b82f6" }, // cyan to blue
    { start: "#10b981", end: "#14b8a6" }, // emerald to teal
    { start: "#f59e0b", end: "#fbbf24" }, // amber
    { start: "#6366f1", end: "#a855f7" }, // indigo to purple
    { start: "#f43f5e", end: "#fb7185" }, // rose
];

export const AZBarChart: React.FC<BarChartProps> = ({
    data = [],
    tabs,
    layout: customLayout,
    defaultTab,
    activeTab: controlledTab,
    onTabChange,

    title,
    subtitle,
    icon,
    headerRight,
    colorGradient: customGradient,
    showRankBadges = true,
    valueFormatter: customValFormatter,
    unitLabel,

    compact = false,
    maxVal: customMaxVal,
    height,
    containerCard = true,
    emptyMessage = "No ranking or category records found in the active timeframe.",
    className = "",
}) => {
    const hasTabs = Array.isArray(tabs) && tabs.length > 0;
    const initialTabKey = defaultTab || (hasTabs ? tabs[0].key : "");
    const [internalTab, setInternalTab] = useState<string>(initialTabKey);

    // Sync internal tab if defaultTab changes
    useEffect(() => {
        if (defaultTab) {
            setInternalTab(defaultTab);
        }
    }, [defaultTab]);

    const currentTabKey = controlledTab || internalTab;
    const activeTabConfig = hasTabs
        ? tabs.find((t) => t.key === currentTabKey) || tabs[0]
        : null;

    const handleTabSelect = (key: string) => {
        setInternalTab(key);
        onTabChange?.(key);
    };

    const rawItems = useMemo(() => {
        if (activeTabConfig) return activeTabConfig.data || [];
        return data || [];
    }, [activeTabConfig, data]);

    const activeLayout = activeTabConfig?.layout || customLayout || "horizontal";
    const parsedGradient = useMemo(() => {
        const grad = customGradient || activeTabConfig?.colorGradient;
        if (!grad) return null;
        if (grad.includes("emerald") || grad.includes("teal"))
            return { start: "#10b981", end: "#14b8a6" };
        if (grad.includes("amber"))
            return { start: "#f59e0b", end: "#fbbf24" };
        if (grad.includes("purple") || grad.includes("pink"))
            return { start: "#8b5cf6", end: "#ec4899" };
        if (grad.includes("cyan") || grad.includes("blue"))
            return { start: "#06b6d4", end: "#3b82f6" };
        return null;
    }, [customGradient, activeTabConfig?.colorGradient]);

    const valueFormatter =
        customValFormatter ||
        activeTabConfig?.valueFormatter ||
        ((v: number) => {
            const num = Number(v);
            const formatted = isNaN(num) ? "0" : num.toLocaleString();
            const unit = activeTabConfig?.unitLabel || unitLabel || "";
            return unit ? `${formatted} ${unit}` : formatted;
        });

    const hasData = rawItems.length > 0;

    // Safe dynamic max calculation to avoid [0, 0] division by zero in Recharts linear scales
    const domainMax = useMemo(() => {
        if (typeof customMaxVal === "number" && customMaxVal > 0) return customMaxVal;
        const maxDataVal = rawItems.reduce(
            (max, item) => Math.max(max, Number(item.value) || 0),
            0
        );
        if (maxDataVal <= 0) return 5;
        // Provide clean headroom so bars never touch or overflow the chart edge
        const magnitude = Math.pow(10, Math.floor(Math.log10(maxDataVal)));
        const step = magnitude >= 10 ? magnitude / 2 : 1;
        const headroom = Math.ceil((maxDataVal * 1.1) / step) * step;
        return Math.max(headroom, maxDataVal + 1);
    }, [customMaxVal, rawItems]);

    // Chart height calculations
    const calculatedHeight = useMemo(() => {
        if (height) return typeof height === "number" ? height : parseInt(height, 10) || 280;
        if (activeLayout === "horizontal") {
            const perBar = compact ? 38 : 48;
            return Math.max(compact ? 180 : 260, rawItems.length * perBar + 40);
        }
        return compact ? 200 : 280;
    }, [height, activeLayout, compact, rawItems.length]);

    const uniqueId = React.useId().replace(/:/g, "_");

    return (
        <div
            className={`card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between ${className}`}
        >
            {/* Top glowing accent border line */}
            {containerCard && (
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent pointer-events-none z-20" />
            )}

            {/* Ambient background glow */}
            {containerCard && (
                <>
                    <div className="absolute -top-12 -left-12 w-48 h-48 bg-gradient-to-br from-purple-600/15 via-pink-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />
                </>
            )}

            {/* Header with Switcher */}
            {(title || subtitle || hasTabs || headerRight) && (
                <div
                    className={`relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 ${containerCard ? "border-b border-white/10" : ""
                        }`}
                >
                    <div>
                        {(title || icon) && (
                            <div className="flex items-center gap-2">
                                {icon ? (
                                    <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-purple-400">
                                        {icon}
                                    </span>
                                ) : (
                                    <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-purple-400">
                                        <BarChart3 className="w-4 h-4" />
                                    </span>
                                )}
                                <h2
                                    className={`${compact
                                        ? "text-xs font-black text-white"
                                        : "text-base sm:text-lg font-black text-white tracking-tight"
                                        }`}
                                >
                                    {title || (activeTabConfig ? activeTabConfig.label : "Performance Rankings")}
                                </h2>
                            </div>
                        )}
                        {subtitle && (
                            <p className="text-xs text-slate-400 mt-1 max-w-xl">{subtitle}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {headerRight}

                        {/* View Mode Switcher */}
                        {hasTabs && (
                            <div className="flex items-center bg-[#120824] border border-white/15 rounded-2xl p-1 gap-1 self-start sm:self-auto shadow-inner flex-wrap">
                                {tabs.map((tab) => {
                                    const isSelected = tab.key === currentTabKey;
                                    return (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            onClick={() => handleTabSelect(tab.key)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${isSelected
                                                ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                                                : "text-slate-300 hover:text-white"
                                                }`}
                                        >
                                            {tab.icon}
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="relative z-10 mt-4 flex-1 w-full min-w-0">
                {!hasData ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center text-slate-400 space-y-2">
                        <Info className="w-7 h-7 text-purple-400/60" />
                        <div className="text-sm font-extrabold text-white">No Ranking Records</div>
                        <div className="text-xs max-w-xs text-slate-400">
                            {activeTabConfig?.emptyMessage || emptyMessage}
                        </div>
                    </div>
                ) : activeLayout === "horizontal" ? (
                    /* Recharts Horizontal Bar Chart (vertical layout in recharts) */
                    <div className="w-full" style={{ height: calculatedHeight }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={rawItems}
                                margin={{
                                    top: 5,
                                    right: compact ? 15 : 30,
                                    left: compact ? 0 : 15,
                                    bottom: 5,
                                }}
                            >
                                <defs>
                                    {rawItems?.map((item, idx) => {
                                        const pal =
                                            parsedGradient ||
                                            DEFAULT_GRADIENT_PALETTES[
                                            idx % DEFAULT_GRADIENT_PALETTES.length
                                            ];
                                        return (
                                            <linearGradient
                                                key={`hgrad-${idx}`}
                                                id={`barGrad_h_${uniqueId}_${idx}`}
                                                x1="0"
                                                y1="0"
                                                x2="1"
                                                y2="0"
                                            >
                                                <stop offset="0%" stopColor={pal.start} />
                                                <stop offset="100%" stopColor={pal.end} />
                                            </linearGradient>
                                        );
                                    })}
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    horizontal={false}
                                    stroke="rgba(255, 255, 255, 0.06)"
                                />
                                <XAxis
                                    type="number"
                                    stroke="#94a3b8"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                                    domain={[0, customMaxVal ? customMaxVal : domainMax]}
                                    allowDecimals={false}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="label"
                                    stroke="#cbd5e1"
                                    fontSize={compact ? 10 : 11}
                                    tickLine={false}
                                    axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                                    width={compact ? 80 : 120}
                                    tick={({ x, y, payload }) => {
                                        const valStr = String(payload?.value ?? "");
                                        const idx = rawItems.findIndex(
                                            (item) => String(item.label) === valStr
                                        );
                                        const item = idx >= 0 ? rawItems[idx] : undefined;
                                        const badge = item?.badgeNumber ?? (idx >= 0 ? idx + 1 : 1);
                                        const truncated =
                                            valStr.length > 15
                                                ? `${valStr.slice(0, 14)}…`
                                                : valStr;
                                        return (
                                            <g transform={`translate(${x || 0},${y || 0})`}>
                                                <text
                                                    x={-8}
                                                    y={3}
                                                    textAnchor="end"
                                                    fill="#cbd5e1"
                                                    fontSize={compact ? 10 : 11}
                                                    fontWeight={600}
                                                >
                                                    {showRankBadges ? `#${badge} ${truncated}` : truncated}
                                                </text>
                                            </g>
                                        );
                                    }}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (!active || !payload || !payload.length) return null;
                                        const item = payload[0].payload as TBarChartItem;
                                        return (
                                            <div className="bg-[#120824]/95 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-2xl space-y-1 min-w-[150px]">
                                                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                                    {item.badgeNumber !== undefined && (
                                                        <span className="text-[10px] text-cyan-300 font-mono">
                                                            #{item.badgeNumber}
                                                        </span>
                                                    )}
                                                    <span>{item.label}</span>
                                                </div>
                                                <div className="text-sm font-black font-mono text-amber-400">
                                                    {valueFormatter(item.value)}
                                                </div>
                                                {item.secondaryLabel && (
                                                    <div className="text-[10px] text-slate-400">
                                                        {item.secondaryLabel}
                                                    </div>
                                                )}
                                                {item.meta && (
                                                    <div className="text-[10px] text-purple-300 font-mono">
                                                        {item.meta}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }}
                                    cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
                                />
                                <Bar
                                    dataKey="value"
                                    radius={[0, 6, 6, 0]}
                                    maxBarSize={compact ? 18 : 24}
                                    animationDuration={800}
                                >
                                    {rawItems.map((item, idx) => (
                                        <Cell
                                            key={`cell-${idx}`}
                                            fill={item.color || `url(#barGrad_h_${uniqueId}_${idx})`}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    /* Recharts Vertical Column Chart (horizontal layout in recharts) */
                    <div className="w-full" style={{ height: calculatedHeight }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="horizontal"
                                data={rawItems}
                                margin={{
                                    top: 15,
                                    right: 20,
                                    left: compact ? 0 : 10,
                                    bottom: compact ? 15 : 25,
                                }}
                            >
                                <defs>
                                    {rawItems?.map((item, idx) => {
                                        const pal =
                                            parsedGradient ||
                                            DEFAULT_GRADIENT_PALETTES[
                                            idx % DEFAULT_GRADIENT_PALETTES.length
                                            ];
                                        return (
                                            <linearGradient
                                                key={`vgrad-${idx}`}
                                                id={`barGrad_v_${uniqueId}_${idx}`}
                                                x1="0"
                                                y1="1"
                                                x2="0"
                                                y2="0"
                                            >
                                                <stop offset="0%" stopColor={pal.start} stopOpacity={0.6} />
                                                <stop offset="100%" stopColor={pal.end} />
                                            </linearGradient>
                                        );
                                    })}
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="rgba(255, 255, 255, 0.06)"
                                />
                                <XAxis
                                    dataKey="label"
                                    stroke="#94a3b8"
                                    fontSize={compact ? 10 : 11}
                                    tickLine={false}
                                    axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                                    interval={0}
                                    tick={({ x, y, payload }) => {
                                        const valStr = String(payload?.value ?? "");
                                        const truncated =
                                            valStr.length > 10
                                                ? `${valStr.slice(0, 9)}…`
                                                : valStr;
                                        return (
                                            <text
                                                x={x || 0}
                                                y={Number(y || 0) + 12}
                                                textAnchor="middle"
                                                fill="#94a3b8"
                                                fontSize={compact ? 10 : 11}
                                            >
                                                {truncated}
                                            </text>
                                        );
                                    }}
                                />
                                <YAxis
                                    type="number"
                                    stroke="#94a3b8"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                                    domain={[0, customMaxVal ? customMaxVal : domainMax]}
                                    allowDecimals={false}
                                    tickFormatter={(val) => {
                                        const num = Number(val);
                                        if (isNaN(num)) return String(val ?? "");
                                        return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
                                    }}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (!active || !payload || !payload.length) return null;
                                        const item = payload[0].payload as TBarChartItem;
                                        return (
                                            <div className="bg-[#120824]/95 backdrop-blur-md border border-white/20 p-2.5 rounded-xl shadow-2xl space-y-1">
                                                <div className="text-xs font-bold text-white">
                                                    {item.label}
                                                </div>
                                                <div className="text-xs font-black font-mono text-amber-400">
                                                    {valueFormatter(item.value)}
                                                </div>
                                                {item.secondaryLabel && (
                                                    <div className="text-[10px] text-slate-400">
                                                        {item.secondaryLabel}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }}
                                    cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
                                />
                                <Bar
                                    dataKey="value"
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={compact ? 24 : 38}
                                    animationDuration={800}
                                >
                                    {rawItems?.map((item, idx) => (
                                        <Cell
                                            key={`cell-${idx}`}
                                            fill={item.color || `url(#barGrad_v_${uniqueId}_${idx})`}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AZBarChart;
