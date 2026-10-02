"use client";

import React from "react";

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
  const normalizedValue = Math.max(0, Math.min(maxValue, value));
  const percent = maxValue > 0 ? (normalizedValue / maxValue) * 100 : 0;

  const radius = (size - strokeWidth) / 2 - 4;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const arcRatio = arcDegree / 360;

  // Arc length and offset
  const arcLength = circumference * arcRatio;
  const strokeDashoffset = arcLength - (percent / 100) * arcLength;

  const gradId = React.useId();

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className="relative flex items-center justify-center select-none"
        style={{ width: size, height: size }}
      >
        <svg
          className="w-full h-full transform -rotate-135"
          viewBox={`0 0 ${size} ${size}`}
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Foreground Value Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
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
