"use client";

import React, { useState, useMemo } from "react";
import { BarChart3, Info } from "lucide-react";

export interface TBarChartItem {
  id?: string | number;
  label: string;
  value: number;
  secondaryLabel?: string; // e.g. "units sold" or "5 orders"
  meta?: string | number; // e.g. "5 orders"
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

export const BarChart: React.FC<BarChartProps> = ({
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

  const currentTabKey = controlledTab || internalTab;
  const activeTabConfig = hasTabs
    ? tabs.find((t) => t.key === currentTabKey) || tabs[0]
    : null;

  const handleTabSelect = (key: string) => {
    setInternalTab(key);
    onTabChange?.(key);
  };

  // Determine active raw points
  const rawItems = useMemo(() => {
    if (activeTabConfig) return activeTabConfig.data || [];
    return data || [];
  }, [activeTabConfig, data]);

  // Determine layout: from active tab config or prop or fallback to horizontal
  const activeLayout =
    activeTabConfig?.layout || customLayout || "horizontal";

  // Max value calculation for relative bars
  const maxVal = useMemo(() => {
    if (customMaxVal !== undefined && customMaxVal > 0) return customMaxVal;
    if (rawItems.length === 0) return 1;
    return Math.max(...rawItems.map((d) => d.value), 1);
  }, [rawItems, customMaxVal]);

  const valueFormatter =
    customValFormatter ||
    activeTabConfig?.valueFormatter ||
    ((v: number) => `${v.toLocaleString()} ${unitLabel || ""}`.trim());

  // Default gradients depending on mode
  const gradientClass =
    customGradient ||
    activeTabConfig?.colorGradient ||
    (activeLayout === "vertical"
      ? "from-amber-500/30 via-amber-400/80 to-amber-300"
      : "from-cyan-500 via-blue-400 to-emerald-400");

  const hasData = rawItems.length > 0;

  const content = (
    <>
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
          className={`relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 ${
            containerCard ? "border-b border-white/10" : ""
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
                <h2 className={`${compact ? "text-xs font-black text-white" : "text-base sm:text-lg font-black text-white tracking-tight"}`}>
                  {title || (activeTabConfig ? activeTabConfig.label : "Performance Rankings")}
                </h2>
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {subtitle}
              </p>
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
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
      <div className="relative z-10 mt-4 flex-1">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-14 text-center text-slate-400 space-y-2">
            <Info className="w-7 h-7 text-purple-400/60" />
            <div className="text-sm font-extrabold text-white">No Ranking Records</div>
            <div className="text-xs max-w-xs text-slate-400">
              {activeTabConfig?.emptyMessage || emptyMessage}
            </div>
          </div>
        ) : activeLayout === "horizontal" ? (
          /* Horizontal Progress Bar Ranking Meters */
          <div className={`${compact ? "space-y-2.5" : "space-y-3.5"}`}>
            {rawItems.map((item, index) => {
              const percentage = Math.max((item.value / maxVal) * 100, 4);
              const itemGradient = item.gradient || gradientClass;

              if (compact) {
                return (
                  <div key={item.id ?? item.label ?? index} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-slate-200 truncate max-w-[160px]">
                        {item.label}
                      </span>
                      <span className="font-mono font-bold text-amber-400 text-[10px]">
                        {valueFormatter(item.value)}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${itemGradient} rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id ?? item.label ?? index}
                  className="p-3 rounded-2xl bg-[#120824]/60 border border-white/5 hover:border-white/15 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {showRankBadges && (
                        <span className="w-5 h-5 rounded-md bg-white/5 border border-white/10 text-cyan-300 font-mono text-[10px] font-black flex items-center justify-center shrink-0">
                          #{item.badgeNumber ?? index + 1}
                        </span>
                      )}
                      <span className="font-extrabold text-slate-100 truncate max-w-[180px] sm:max-w-[280px]">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono">
                      {item.meta && (
                        <span className="text-[11px] text-slate-400 hidden sm:inline">
                          {item.meta}
                        </span>
                      )}
                      <span className="font-black text-amber-400">
                        {valueFormatter(item.value)}
                      </span>
                      {item.secondaryLabel && (
                        <span className="text-[10px] text-slate-400">
                          {item.secondaryLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meter Bar */}
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${itemGradient} shadow-sm transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Vertical Column Bars */
          <div className="space-y-4">
            <div
              className={`flex items-end justify-between gap-2 pt-6 px-2 ${
                height ? "" : "h-56"
              }`}
              style={height ? { height } : undefined}
            >
              {rawItems.map((item, idx) => {
                const heightPct = Math.max((item.value / maxVal) * 100, 6);
                const itemGradient = item.gradient || gradientClass;

                return (
                  <div
                    key={item.id ?? item.label ?? idx}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-black text-amber-400 bg-[#120824] px-2 py-0.5 rounded border border-white/15 whitespace-nowrap shadow-lg">
                      {valueFormatter(item.value)}
                    </div>

                    {/* Bar Column */}
                    <div className="w-full max-w-[42px] h-full flex items-end justify-center">
                      <div
                        className={`w-full rounded-t-xl bg-gradient-to-t ${itemGradient} group-hover:brightness-110 transition-all duration-300 shadow-lg relative`}
                        style={{ height: `${heightPct}%` }}
                      >
                        {/* Top glowing cap */}
                        <div className="absolute top-0 inset-x-0 h-1 rounded-t-xl bg-white/70" />
                      </div>
                    </div>

                    {/* Label */}
                    <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-white truncate max-w-[48px]">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (!containerCard) {
    return <div className={`w-full relative ${className}`}>{content}</div>;
  }

  return (
    <div
      className={`card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between ${className}`}
    >
      {content}
    </div>
  );
};

export default BarChart;
