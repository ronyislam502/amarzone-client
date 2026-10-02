"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, Calendar, Info } from "lucide-react";

export interface TLineChartPoint {
  label: string; // e.g. "2026-03-15" or "Mon" or "Sep 12"
  value: number;
}

export interface TLineChartTab {
  key: string;
  label: string;
  icon?: React.ReactNode;
  data: TLineChartPoint[];
  strokeColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  valueFormatter?: (val: number) => string;
  yAxisFormatter?: (val: number) => string;
  badgeText?: string;
}

export interface LineChartProps {
  /** Single dataset */
  data?: TLineChartPoint[];
  /** Multiple tabs for switching datasets */
  tabs?: TLineChartTab[];
  /** Currently active tab key (controlled or default) */
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (key: string) => void;
  /** Force a single tab / metric mode */
  forcedTab?: string;

  /** Visual customizations */
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerRight?: React.ReactNode;
  strokeColor?: string;
  gradientFrom?: string;
  gradientTo?: string;

  /** Formatting */
  valueFormatter?: (val: number) => string;
  yAxisFormatter?: (val: number) => string;
  unitLabel?: string; // e.g. "orders" or "$"

  /** Dimensions & Modes */
  compact?: boolean;
  svgWidth?: number;
  svgHeight?: number;
  containerCard?: boolean;
  showSummaryStats?: boolean;
  showGrid?: boolean;
  showDots?: boolean;
  showTooltip?: boolean;
  showXAxis?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data = [],
  tabs,
  defaultTab,
  activeTab: controlledTab,
  onTabChange,
  forcedTab,

  title,
  subtitle,
  icon,
  headerRight,
  strokeColor: customStroke,
  gradientFrom: customGradFrom,
  gradientTo: customGradTo,

  valueFormatter: customValFormatter,
  yAxisFormatter: customYFormatter,
  unitLabel,

  compact = false,
  svgWidth = compact ? 400 : 800,
  svgHeight = compact ? 160 : 280,
  containerCard = true,
  showSummaryStats = !compact,
  showGrid = true,
  showDots = true,
  showTooltip = true,
  showXAxis = !compact,
  emptyMessage = "No activity or records found in the active timeframe.",
  className = "",
}) => {
  // Determine if using tabs or single data
  const hasTabs = Array.isArray(tabs) && tabs.length > 0;
  const initialTabKey = defaultTab || (hasTabs ? tabs[0].key : "");
  const [internalTab, setInternalTab] = useState<string>(initialTabKey);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentTabKey = forcedTab || controlledTab || internalTab;
  const activeTabConfig = hasTabs
    ? tabs.find((t) => t.key === currentTabKey) || tabs[0]
    : null;

  const handleTabSelect = (key: string) => {
    setInternalTab(key);
    setHoveredIndex(null);
    onTabChange?.(key);
  };

  // Determine active raw points
  const rawPoints = useMemo(() => {
    if (activeTabConfig) return activeTabConfig.data || [];
    return data || [];
  }, [activeTabConfig, data]);

  // Ensure points are sorted chronologically by label
  const sortedPoints = useMemo(() => {
    return [...rawPoints].sort((a, b) => a.label.localeCompare(b.label));
  }, [rawPoints]);

  // Determine colors & formatters
  const strokeColor =
    customStroke ||
    activeTabConfig?.strokeColor ||
    (currentTabKey.includes("rev") || currentTabKey.includes("dollar") ? "#fbbf24" : "#34d399");

  const gradientFrom =
    customGradFrom ||
    activeTabConfig?.gradientFrom ||
    strokeColor;

  const gradientTo =
    customGradTo ||
    activeTabConfig?.gradientTo ||
    "transparent";

  const valueFormatter =
    customValFormatter ||
    activeTabConfig?.valueFormatter ||
    ((v: number) =>
      currentTabKey.includes("rev") || currentTabKey.includes("price") || currentTabKey.includes("spend")
        ? `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : `${v.toLocaleString()} ${unitLabel || ""}`.trim());

  const yAxisFormatter =
    customYFormatter ||
    activeTabConfig?.yAxisFormatter ||
    ((v: number) =>
      currentTabKey.includes("rev") || currentTabKey.includes("price") || currentTabKey.includes("spend")
        ? `$${Math.round(v)}`
        : Math.round(v).toString());

  // Padding
  const padding = compact
    ? { top: 15, right: 15, bottom: 25, left: 35 }
    : { top: 30, right: 30, bottom: 45, left: 55 };

  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Geometry calculations
  const { points, maxValue, minValue, pathD, areaD } = useMemo(() => {
    if (sortedPoints.length === 0) {
      return { points: [], maxValue: 0, minValue: 0, pathD: "", areaD: "" };
    }

    const values = sortedPoints.map((p) => p.value);
    const max = Math.max(...values, 1);
    const min = 0;

    const computedPoints = sortedPoints.map((item, index) => {
      const x =
        sortedPoints.length === 1
          ? padding.left + chartWidth / 2
          : padding.left + (index / (sortedPoints.length - 1)) * chartWidth;
      const normalizedY = (item.value - min) / (max - min || 1);
      const y = padding.top + chartHeight - normalizedY * chartHeight;
      return { x, y, label: item.label, value: item.value, raw: item };
    });

    if (computedPoints.length === 1) {
      const single = computedPoints[0];
      const pD = `M ${single.x - 40} ${single.y} L ${single.x + 40} ${single.y}`;
      const aD = `M ${single.x - 40} ${single.y} L ${single.x + 40} ${single.y} L ${single.x + 40} ${padding.top + chartHeight} L ${single.x - 40} ${padding.top + chartHeight} Z`;
      return { points: computedPoints, maxValue: max, minValue: min, pathD: pD, areaD: aD };
    }

    // Build smooth cubic bezier curve
    let d = `M ${computedPoints[0].x} ${computedPoints[0].y}`;
    for (let i = 0; i < computedPoints.length - 1; i++) {
      const current = computedPoints[i];
      const next = computedPoints[i + 1];
      const controlX1 = current.x + (next.x - current.x) / 2;
      const controlY1 = current.y;
      const controlX2 = current.x + (next.x - current.x) / 2;
      const controlY2 = next.y;
      d += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
    }

    const last = computedPoints[computedPoints.length - 1];
    const first = computedPoints[0];
    const area = `${d} L ${last.x} ${padding.top + chartHeight} L ${first.x} ${padding.top + chartHeight} Z`;

    return { points: computedPoints, maxValue: max, minValue: min, pathD: d, areaD: area };
  }, [sortedPoints, chartWidth, chartHeight, padding.left, padding.top]);

  const activePoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;
  const totalValue = sortedPoints.reduce((acc, curr) => acc + curr.value, 0);

  // Unique ID for gradient fill in SVG
  const reactGeneratedId = React.useId();
  const gradId = useMemo(
    () => `lineGrad_${reactGeneratedId.replace(/:/g, "_")}`,
    [reactGeneratedId]
  );

  const content = (
    <>
      {/* Optional Top Glowing Line */}
      {containerCard && (
        <div
          className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent to-transparent pointer-events-none z-20 transition-all duration-300"
          style={{
            backgroundImage: `linear-gradient(to right, transparent, ${strokeColor}99, transparent)`,
          }}
        />
      )}

      {/* Ambient background glow */}
      {containerCard && (
        <>
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />
        </>
      )}

      {/* Header with Title and Mode Switcher */}
      {(title || subtitle || hasTabs || headerRight) && (
        <div
          className={`relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 ${
            containerCard ? "border-b border-white/10" : ""
          }`}
        >
          <div>
            {(title || icon) && (
              <div className="flex items-center gap-2">
                {icon ? (
                  <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-amber-400">
                    {icon}
                  </span>
                ) : (
                  <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-amber-400">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                )}
                <h2 className={`${compact ? "text-xs font-black text-white" : "text-base sm:text-lg font-black text-white tracking-tight"}`}>
                  {title || (activeTabConfig ? activeTabConfig.label : "Trend Velocity")}
                </h2>
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          {/* Header Controls (Tabs or Badge or custom) */}
          <div className="flex items-center gap-2">
            {headerRight}

            {hasTabs && (
              forcedTab ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-[#120824] border border-white/15 shadow-inner">
                  {activeTabConfig?.icon}
                  <span style={{ color: strokeColor }}>
                    {activeTabConfig?.badgeText || activeTabConfig?.label}
                  </span>
                </div>
              ) : (
                <div
                  className={`flex items-center bg-[#120824] border border-white/15 ${
                    compact ? "rounded-xl p-0.5 text-[10px]" : "rounded-2xl p-1 text-xs"
                  } gap-1 self-start sm:self-auto shadow-inner`}
                >
                  {tabs.map((tab) => {
                    const isSelected = tab.key === currentTabKey;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => handleTabSelect(tab.key)}
                        className={`${
                          compact ? "px-2 py-0.5 rounded-lg text-[10px]" : "px-3 py-1.5 rounded-xl text-xs"
                        } font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-white/15 text-white shadow-md border border-white/20"
                            : "text-slate-400 hover:text-white"
                        }`}
                        style={isSelected && tab.strokeColor ? { backgroundColor: `${tab.strokeColor}25`, borderColor: `${tab.strokeColor}60`, color: tab.strokeColor } : undefined}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Chart Canvas or Empty State */}
      <div className="relative z-10 mt-3 flex-1">
        {points.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 space-y-2">
            <Info className="w-7 h-7 text-amber-400/60" />
            <div className="text-sm font-extrabold text-white">No Activity in Range</div>
            <div className="text-xs max-w-xs text-slate-400">
              {emptyMessage}
            </div>
          </div>
        ) : (
          <>
            {/* Quick Metrics Bar above chart */}
            {showSummaryStats && (
              <div className="flex items-center justify-between mb-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-medium">Period Total:</span>
                  <span className="font-mono font-extrabold text-white text-sm">
                    {valueFormatter(totalValue)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>Peak:</span>
                  <span className="font-bold" style={{ color: strokeColor }}>
                    {valueFormatter(maxValue)}
                  </span>
                </div>
              </div>
            )}

            {/* SVG Interactive Line Chart */}
            <div className="relative w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto overflow-visible select-none"
              >
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={gradientFrom} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={gradientTo} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines & Y-Axis Labels */}
                {showGrid &&
                  (compact ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1]).map((ratio) => {
                    const y = padding.top + chartHeight - ratio * chartHeight;
                    const labelValue = minValue + ratio * (maxValue - minValue);
                    return (
                      <g key={ratio}>
                        <line
                          x1={padding.left}
                          y1={y}
                          x2={padding.left + chartWidth}
                          y2={y}
                          stroke="rgba(255, 255, 255, 0.08)"
                          strokeDasharray="4 4"
                        />
                        {!compact && (
                          <text
                            x={padding.left - 10}
                            y={y + 4}
                            textAnchor="end"
                            fontSize="10"
                            fill="#94a3b8"
                            fontFamily="monospace"
                            fontWeight="600"
                          >
                            {yAxisFormatter(labelValue)}
                          </text>
                        )}
                      </g>
                    );
                  })}

                {/* Area Gradient Fill */}
                {areaD && <path d={areaD} fill={`url(#${gradId})`} />}

                {/* Smooth Bézier Stroke Line */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={compact ? "2.5" : "3"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Active Hover Vertical Cursor Guide */}
                {showTooltip && activePoint && (
                  <line
                    x1={activePoint.x}
                    y1={padding.top}
                    x2={activePoint.x}
                    y2={padding.top + chartHeight}
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />
                )}

                {/* Interactive Data Point Circles */}
                {showDots &&
                  points.map((p, idx) => {
                    const isHovered = hoveredIndex === idx;
                    return (
                      <g
                        key={p.label + idx}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {/* Invisible wider target area */}
                        <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

                        {/* Outer pulsing ring when hovered */}
                        {isHovered && (
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={compact ? 7 : 9}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="2"
                            opacity="0.6"
                            className="animate-ping"
                          />
                        )}

                        {/* Data Point Node */}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isHovered ? (compact ? 5 : 6) : compact ? 3 : 4}
                          fill="#170d2f"
                          stroke={strokeColor}
                          strokeWidth={isHovered ? 3 : 2}
                          className="transition-all duration-150"
                        />
                      </g>
                    );
                  })}

                {/* X-Axis Date Labels */}
                {showXAxis &&
                  (() => {
                    const count = points.length;
                    const step = count <= 6 ? 1 : Math.ceil(count / 6);
                    return points
                      .filter((_, idx) => idx % step === 0 || idx === count - 1)
                      .map((p) => {
                        const parts = p.label.split("-");
                        const shortDate =
                          parts.length === 3 ? `${parts[1]}/${parts[2]}` : p.label;
                        return (
                          <text
                            key={p.label}
                            x={p.x}
                            y={padding.top + chartHeight + 20}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#94a3b8"
                            fontWeight="700"
                          >
                            {shortDate}
                          </text>
                        );
                      });
                  })()}
              </svg>

              {/* Floating Tooltip */}
              {showTooltip && activePoint && (
                <div
                  className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 z-30 transition-all duration-100"
                  style={{
                    left: `${(activePoint.x / svgWidth) * 100}%`,
                    top: `${(activePoint.y / svgHeight) * 100}%`,
                  }}
                >
                  <div className="bg-[#120824] border border-white/20 rounded-xl p-2.5 shadow-2xl text-xs space-y-1 backdrop-blur-md whitespace-nowrap">
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{activePoint.label}</span>
                    </div>
                    <div className="font-mono font-black text-white text-sm">
                      {valueFormatter(activePoint.value)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );

  if (!containerCard) {
    return <div className={`w-full relative ${className}`}>{content}</div>;
  }

  return (
    <div
      className={`card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 ${className}`}
    >
      {content}
    </div>
  );
};

export default LineChart;
