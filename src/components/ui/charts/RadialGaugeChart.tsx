"use client";

import React, { useId, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const useIsMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
import {
  RadialBarChart as RechartsRadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

// Export built-in Recharts components for direct use
export {
  RechartsRadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
};

export interface RadialGaugeChartProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  arcDegree?: number; // default 270 degrees
  title?: string;
  subtitle?: string;
  gradientFrom?: string;
  gradientTo?: string;
  badge?: React.ReactNode;
  valueFormatter?: (val: number) => React.ReactNode;
  className?: string;
}

export const RadialGaugeChart: React.FC<RadialGaugeChartProps> = ({
  value,
  maxValue = 1000,
  size = 180,
  strokeWidth = 14,
  arcDegree = 270,
  title = "Score",
  subtitle = `of ${maxValue} Max`,
  gradientFrom = "#10b981",
  gradientTo = "#34d399",
  badge,
  valueFormatter = (v) => v,
  className = "",
}) => {
  const isMounted = useIsMounted();

  const normalizedValue = Math.max(0, Math.min(maxValue, value));
  const rawId = useId();
  const gradId = `gaugeGrad_${rawId.replace(/:/g, "_")}`;

  // Start and end angle calculation for centered arc
  // A 270 degree arc has a 90 degree opening at the bottom.
  // In Cartesian/SVG polar: bottom is 270 (or -90). Opening from 225 deg to 315 deg (or -45 deg).
  const startAngle = 180 + (360 - arcDegree) / 2;
  const endAngle = startAngle - arcDegree;

  const data = [
    {
      name: title,
      value: normalizedValue,
      fill: `url(#${gradId})`,
    },
  ];

  const outerRadius = Math.max(10, size / 2 - 4);
  const innerRadius = Math.max(5, outerRadius - strokeWidth);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className="relative flex items-center justify-center select-none"
        style={{ width: size, height: size }}
      >
        {!isMounted ? (
          <div
            className="w-full h-full rounded-full bg-white/[0.03] animate-pulse flex items-center justify-center"
            style={{ width: size, height: size }}
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadialBarChart
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              barSize={strokeWidth}
              data={data}
              startAngle={startAngle}
              endAngle={endAngle}
            >
              <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={gradientFrom} />
                  <stop offset="100%" stopColor={gradientTo} />
                </linearGradient>
              </defs>
              <PolarAngleAxis
                type="number"
                domain={[0, maxValue]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background={{ fill: "rgba(255, 255, 255, 0.08)" }}
                dataKey="value"
                cornerRadius={strokeWidth / 2}
                animationDuration={900}
              />
            </RechartsRadialBarChart>
          </ResponsiveContainer>
        )}

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none select-none">
          {title && (
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">
              {title}
            </span>
          )}
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
            {valueFormatter(normalizedValue)}
          </span>
          {subtitle && (
            <span className="text-[10px] font-semibold text-slate-400">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {badge && <div className="mt-1">{badge}</div>}
    </div>
  );
};

export const GaugeChart = RadialGaugeChart;
export default RadialGaugeChart;
