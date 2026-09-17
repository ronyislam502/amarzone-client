"use client";

import React from "react";
import {
  Award,
  TrendingUp,
  AlertOctagon,
  ShieldCheck,
  Zap,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { TAccountHealthStatus } from "@/src/types/health";

interface HealthScoreCardProps {
  score?: number;
  status?: TAccountHealthStatus;
}

const HealthScoreCard: React.FC<HealthScoreCardProps> = ({
  score = 1000,
  status = "HEALTHY",
}) => {
  // Score percentage for SVG gauge (0 - 1000)
  const normalizedScore = Math.max(0, Math.min(1000, score));
  const scorePercent = (normalizedScore / 1000) * 100;

  // Circumference for r=70: 2 * Math.PI * 70 ≈ 439.82
  // For a 270-degree arc gauge or full ring:
  // Let's use a 260-degree arc (dasharray: 318, offset based on score)
  const radius = 68;
  const circumference = 2 * Math.PI * radius; // ~427.25
  const strokeDashoffset = circumference - (scorePercent / 100) * (circumference * 0.75);

  const getScoreTheme = () => {
    if (normalizedScore >= 850) {
      return {
        color: "text-emerald-400",
        stroke: "#34d399",
        gradientId: "healthy-gradient",
        fromColor: "#10b981",
        toColor: "#34d399",
        bgBadge: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
        title: "Healthy Account Standing",
        desc: "Your account is performing within top marketplace standards. You are eligible for automated Buy Box assignment and promotional features.",
        buyBoxBadge: {
          eligible: true,
          text: "Buy Box Eligible",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        },
      };
    }
    if (normalizedScore >= 700) {
      return {
        color: "text-amber-400",
        stroke: "#fbbf24",
        gradientId: "at-risk-gradient",
        fromColor: "#f59e0b",
        toColor: "#fbbf24",
        bgBadge: "bg-amber-500/10 border-amber-500/30 text-amber-300",
        title: "At Risk Standing",
        desc: "Performance metrics are slipping near violation limits. Score is below the 850 threshold required for Buy Box algorithm winning.",
        buyBoxBadge: {
          eligible: false,
          text: "Buy Box Ineligible (< 850)",
          icon: <XCircle className="w-4 h-4 text-amber-400" />,
        },
      };
    }
    if (normalizedScore >= 500) {
      return {
        color: "text-orange-400",
        stroke: "#fb923c",
        gradientId: "critical-gradient",
        fromColor: "#ea580c",
        toColor: "#fb923c",
        bgBadge: "bg-orange-500/10 border-orange-500/30 text-orange-300",
        title: "Critical Account Condition",
        desc: "Multiple SLA thresholds violated. Immediate operational remediation is required to prevent merchant account suspension.",
        buyBoxBadge: {
          eligible: false,
          text: "Buy Box Revoked",
          icon: <XCircle className="w-4 h-4 text-orange-400" />,
        },
      };
    }
    return {
      color: "text-rose-400",
      stroke: "#f43f5e",
      gradientId: "suspended-gradient",
      fromColor: "#e11d48",
      toColor: "#f43f5e",
      bgBadge: "bg-rose-500/20 border-rose-500/40 text-rose-300",
      title: "Suspended Account Status",
      desc: "Account health fallen below 500. Product listings and storefront privileges have been deactivated.",
      buyBoxBadge: {
        eligible: false,
        text: "Account Inactive",
        icon: <AlertOctagon className="w-4 h-4 text-rose-400" />,
      },
    };
  };

  const theme = getScoreTheme();

  return (
    <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-7">
      {/* Top glowing line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent pointer-events-none z-20" />
      {/* Ambient glow */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-bl from-emerald-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Radial Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <div className="relative w-52 h-52 flex items-center justify-center">
            {/* SVG Circular Progress Meter */}
            <svg className="w-full h-full transform -rotate-135" viewBox="0 0 160 160">
              <defs>
                <linearGradient id="healthy-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="at-risk-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <linearGradient id="critical-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
                <linearGradient id="suspended-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>

              {/* Background Track (270 degree arc) */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="12"
                strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                strokeLinecap="round"
              />

              {/* Foreground Animated Value Arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={`url(#${theme.gradientId})`}
                strokeWidth="12"
                strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Center Score Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                Score
              </span>
              <span className={`text-4xl sm:text-5xl font-black tracking-tight ${theme.color}`}>
                {normalizedScore}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                of 1000 Max
              </span>
            </div>
          </div>

          {/* Quick status pill under gauge */}
          <div className="mt-2 text-center">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${theme.bgBadge}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {status}
            </span>
          </div>
        </div>

        {/* Right: Comprehensive Standing Details & Tier Progress */}
        <div className="lg:col-span-8 space-y-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                  Account Standing Assessment
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {theme.title}
                </h3>
              </div>

              {/* Buy Box readiness badge */}
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold ${
                  theme.buyBoxBadge.eligible
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                }`}
              >
                {theme.buyBoxBadge.icon}
                <span>{theme.buyBoxBadge.text}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300/85 leading-relaxed">
              {theme.desc}
            </p>
          </div>

          {/* Health Tier Progress Bar */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">Marketplace Performance Tiers</span>
              <span className="text-slate-200">
                Target: <span className="text-emerald-400 font-extrabold">≥ 850</span> for Buy Box
              </span>
            </div>

            {/* Segmented Color Bar */}
            <div className="relative w-full h-3.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10 flex">
              {/* Suspended Segment 0 - 500 (50%) */}
              <div className="h-full w-1/2 bg-gradient-to-r from-rose-600 to-rose-500 rounded-l-full relative group">
                <span className="sr-only">Suspended (&lt;500)</span>
              </div>
              {/* Critical Segment 500 - 700 (20%) */}
              <div className="h-full w-[20%] bg-gradient-to-r from-orange-500 to-amber-500 relative">
                <span className="sr-only">Critical (500-699)</span>
              </div>
              {/* At Risk Segment 700 - 850 (15%) */}
              <div className="h-full w-[15%] bg-gradient-to-r from-amber-500 to-yellow-400 relative">
                <span className="sr-only">At Risk (700-849)</span>
              </div>
              {/* Healthy Segment 850 - 1000 (15%) */}
              <div className="h-full w-[15%] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-r-full relative">
                <span className="sr-only">Healthy (850-1000)</span>
              </div>

              {/* Current Pointer Marker */}
              <div
                className="absolute top-0 bottom-0 w-2.5 -ml-1 bg-white border border-slate-900 rounded-full shadow-lg transition-all duration-1000"
                style={{ left: `${Math.max(2, Math.min(98, scorePercent))}%` }}
                title={`Your Score: ${normalizedScore}`}
              />
            </div>

            {/* Tier Legend Labels */}
            <div className="grid grid-cols-4 text-[11px] font-bold text-slate-400 pt-1">
              <div className="text-left text-rose-400">&lt; 500 Suspended</div>
              <div className="text-left text-orange-400">500-699 Critical</div>
              <div className="text-left text-amber-400">700-849 At Risk</div>
              <div className="text-right text-emerald-400">850-1000 Healthy</div>
            </div>
          </div>

          {/* Quick Score Formula Summary */}
          <div className="bg-black/25 border border-white/5 rounded-xl p-3 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200">How the score is calculated:</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Starting from 1,000 points, deductions apply for high defect rate (-30pts/%), late shipments (-5pts/%), seller cancellations (-20pts/%), invalid tracking (-5pts/%), and low service review ratings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthScoreCard;
