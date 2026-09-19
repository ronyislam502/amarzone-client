"use client";

import React, { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Layers,
  Lightbulb,
  ArrowRight,
  Copy,
  Check,
  Zap,
  Brain,
  Compass,
  BarChart3,
  RefreshCw,
  FileText,
  Target,
  ChevronDown,
  ChevronUp,
  Activity,
  DollarSign,
  Store,
  ShieldCheck,
  Info,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetDashboardInsightsMutation,
  TDashboardInsightsInput,
  TDashboardInsightsOutput,
} from "@/redux/features/ai/aiApi";

interface AiDashboardInsightsWidgetProps {
  stats: Record<string, any>;
  role?: "ADMIN" | "VENDOR";
  defaultTimeframe?: "daily" | "weekly" | "monthly" | "yearly" | "custom";
  title?: string;
  subtitle?: string;
  className?: string;
  initiallyOpen?: boolean;
}

type TFocusArea =
  | "all"
  | "revenue"
  | "operations"
  | "vendor_performance"
  | "customer_satisfaction";

type TInsightTab =
  | "summary"
  | "recommendations"
  | "warnings"
  | "growth"
  | "insights"
  | "report";

const FOCUS_AREAS: { id: TFocusArea; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "all", label: "Omni-Discipline", icon: Compass },
  { id: "revenue", label: "Revenue & GMV", icon: DollarSign },
  { id: "operations", label: "Operations & SLA", icon: Activity },
  { id: "vendor_performance", label: "Vendor Network", icon: Store },
  { id: "customer_satisfaction", label: "Customer Sentiment", icon: ShieldCheck },
];

export const AiDashboardInsightsWidget: React.FC<AiDashboardInsightsWidgetProps> = ({
  stats,
  role = "ADMIN",
  defaultTimeframe = "monthly",
  title,
  subtitle,
  className = "",
  initiallyOpen = true,
}) => {
  const [timeframe, setTimeframe] = useState<TDashboardInsightsInput["timeframe"]>(defaultTimeframe);
  const [focusArea, setFocusArea] = useState<TFocusArea>("all");
  const [activeTab, setActiveTab] = useState<TInsightTab>("summary");
  const [isExpanded, setIsExpanded] = useState<boolean>(initiallyOpen);
  const [copied, setCopied] = useState<boolean>(false);

  const [getDashboardInsights, { data: apiResponse, isLoading, isError, error }] =
    useGetDashboardInsightsMutation();

  const insights: TDashboardInsightsOutput | undefined = apiResponse?.data;

  const handleGenerate = async (overrideFocus?: TFocusArea, overrideTimeframe?: TDashboardInsightsInput["timeframe"]) => {
    try {
      const activeStats = stats || {};
      await getDashboardInsights({
        stats: activeStats,
        timeframe: overrideTimeframe || timeframe,
        focusArea: overrideFocus || focusArea,
      }).unwrap();
      toast.success("✨ Executive Intelligence synthesized successfully!", { autoClose: 2500 });
      if (!isExpanded) setIsExpanded(true);
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to generate AI insights. Please try again."
      );
    }
  };

  const handleCopyReport = () => {
    if (!insights) return;
    const reportText = insights.naturalLanguageReport || insights.executiveSummary;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    toast.success("Executive briefing copied to clipboard!", { autoClose: 2000 });
    setTimeout(() => setCopied(false), 2500);
  };

  // Safe normalized insights list
  const normalizedInsights = (insights?.businessInsights || []).map((item) => {
    if (typeof item === "string") {
      return { category: "Strategic Pulse", observation: item, impact: "Direct business impact" };
    }
    return {
      category: item.category || "General",
      observation: item.observation || "",
      impact: item.impact || "",
    };
  });

  return (
    <div
      className={`card relative overflow-hidden bg-gradient-to-br from-[#170d2f] via-[#140b2a] to-[#0f0720] border border-violet-500/25 shadow-2xl rounded-2xl sm:rounded-3xl transition-all duration-300 ${className}`}
    >
      {/* Top glowing laser line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 via-violet-400 to-transparent pointer-events-none z-20" />

      {/* Ambient background glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 p-5 sm:p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-600 to-amber-500 text-white shadow-lg shadow-violet-600/30 shrink-0">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-sm font-black bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 border-0 shadow-sm px-2.5">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Executive Intelligence
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
                {role === "ADMIN" ? "Platform Governance" : "Store Growth Advisor"}
              </span>
              {insights && (
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live Diagnostic Ready
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              {title || (role === "ADMIN" ? "Executive AI Strategic Briefing" : "Store AI Growth & Operations Diagnostic")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300/80 max-w-2xl mt-0.5">
              {subtitle ||
                "Deep-dive synthesized telemetry across revenue vectors, inventory turnover, fulfillment SLA compliance, and conversion bottlenecks."}
            </p>
          </div>
        </div>

        {/* Controls & Generate Trigger */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-end md:self-center">
          {/* Timeframe selector */}
          <select
            value={timeframe}
            onChange={(e) => {
              const newTf = e.target.value as TDashboardInsightsInput["timeframe"];
              setTimeframe(newTf);
              if (insights) handleGenerate(focusArea, newTf);
            }}
            disabled={isLoading}
            className="select select-sm select-bordered bg-[#120824] border-white/15 text-slate-200 text-xs font-bold rounded-xl focus:border-amber-400 focus:outline-none"
          >
            <option value="daily">Daily Pulse</option>
            <option value="weekly">Weekly Horizon</option>
            <option value="monthly">Monthly Cycle</option>
            <option value="yearly">Yearly Trajectory</option>
          </select>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="btn btn-sm bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black border-0 rounded-xl shadow-lg shadow-amber-500/25 gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : insights ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate Analysis</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>Run AI Diagnostic</span>
              </>
            )}
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-sm btn-ghost btn-square text-slate-400 hover:text-white border border-white/10 rounded-xl"
            title={isExpanded ? "Collapse Widget" : "Expand Widget"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Focus Area Filter Chips */}
      <div className="relative z-10 px-5 sm:px-6 py-3 bg-[#110724]/80 border-b border-white/5 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          Focus Vector:
        </span>
        {FOCUS_AREAS.map((item) => {
          const Icon = item.icon;
          const isActive = focusArea === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setFocusArea(item.id);
                if (insights) handleGenerate(item.id, timeframe);
              }}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isActive
                  ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/20 font-black"
                  : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {isExpanded && (
        <div className="relative z-10 p-5 sm:p-6 space-y-6">
          {/* Loading State: Neural Synthesis Screen */}
          {isLoading && (
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-violet-600 animate-spin flex items-center justify-center p-1">
                  <div className="w-full h-full bg-[#170d2f] rounded-full flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-amber-400 animate-pulse" />
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full blur-xl bg-amber-400/30 animate-ping pointer-events-none" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-white">
                  Synthesizing Multidimensional Business Intelligence
                </h4>
                <p className="text-xs text-slate-400 max-w-md">
                  Analyzing transaction volume, SLA fulfillment velocities, inventory turnover, and market elasticity vectors...
                </p>
              </div>
              <div className="w-64 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
                <div className="w-full h-full bg-gradient-to-r from-amber-400 via-violet-400 to-emerald-400 animate-pulse" />
              </div>
            </div>
          )}

          {/* Initial Pre-generation Welcome Hero (When no insights have been fetched yet) */}
          {!insights && !isLoading && !isError && (
            <div className="rounded-2xl bg-black/30 border border-white/10 p-6 sm:p-8 text-center space-y-5">
              <div className="inline-flex p-4 rounded-3xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                <Zap className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-xl mx-auto">
                <h3 className="text-xl font-black text-white">
                  Ready to Extract Actionable Strategic Directives
                </h3>
                <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
                  Run the AI diagnostic to obtain an executive summary, prioritize high-impact growth opportunities, surface operational risks before they become SLA violations, and receive concrete next steps.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleGenerate("all")}
                  className="btn bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black rounded-xl border-0 shadow-lg shadow-amber-500/20 gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Full Intelligence Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerate("revenue")}
                  className="btn btn-outline border-white/20 hover:border-amber-400 text-slate-200 hover:text-white rounded-xl text-xs gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  <span>Focus on Revenue & GMV</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerate("operations")}
                  className="btn btn-outline border-white/20 hover:border-violet-400 text-slate-200 hover:text-white rounded-xl text-xs gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-violet-400" />
                  <span>Focus on SLA & Operations</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {isError && !isLoading && (
            <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Diagnostic Generation Error</h4>
                  <p className="text-xs text-rose-300/80">
                    {(error as any)?.data?.message || "Failed to process metrics diagnostic."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="btn btn-sm btn-outline border-rose-500/40 text-rose-300 hover:bg-rose-500 hover:text-white rounded-xl text-xs"
              >
                Retry
              </button>
            </div>
          )}

          {/* Active Diagnostic View (When insights are available) */}
          {insights && !isLoading && (
            <div className="space-y-6">
              {/* 1. Executive Summary Hero Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1d103b] to-[#120826] border border-amber-400/30 p-5 sm:p-6 shadow-xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-4xl">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-warning font-black text-slate-950 text-[10px] uppercase tracking-wider px-2 py-0.5">
                        Executive Briefing
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        Horizon: {timeframe?.toUpperCase()} &bull; Scope: {focusArea.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                      {insights.executiveSummary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                    <button
                      type="button"
                      onClick={handleCopyReport}
                      className="btn btn-sm btn-outline border-white/20 hover:border-amber-400 text-slate-200 hover:text-white rounded-xl text-xs gap-1.5 font-bold cursor-pointer"
                      title="Copy Executive Report"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-amber-400" />
                          <span>Copy Briefing</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Sub-tab Navigation */}
              <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("summary")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "summary"
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Strategic Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("recommendations")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "recommendations"
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Recommendations ({insights.recommendations?.length || 0})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("warnings")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "warnings"
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Risk Warnings ({insights.warnings?.length || 0})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("growth")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "growth"
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Growth Plays ({insights.growthOpportunities?.length || 0})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("insights")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "insights"
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Key Observations ({normalizedInsights.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("report")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "report"
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Full Report</span>
                </button>
              </div>

              {/* TAB 1: STRATEGIC OVERVIEW (Combined Dashboard) */}
              {activeTab === "summary" && (
                <div className="space-y-6">
                  {/* Top Recommendations Spotlight */}
                  {insights.recommendations && insights.recommendations.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                          <Target className="w-4 h-4 text-amber-400" />
                          <span>Highest Priority Directives</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setActiveTab("recommendations")}
                          className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>View All ({insights.recommendations.length})</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.recommendations.slice(0, 2).map((rec, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-black/25 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-3"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`badge badge-sm font-black text-[10px] px-2 py-0.5 border ${
                                    rec.priority === "HIGH"
                                      ? "bg-rose-500/15 text-rose-300 border-rose-500/40"
                                      : rec.priority === "MEDIUM"
                                      ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                                      : "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                                  }`}
                                >
                                  {rec.priority} PRIORITY
                                </span>
                                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                  {rec.expectedImpact}
                                </span>
                              </div>
                              <h5 className="text-sm font-bold text-white">{rec.title}</h5>
                              <p className="text-xs text-slate-300 leading-relaxed">{rec.action}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Warnings / Critical Alerts Spotlight */}
                  {insights.warnings && insights.warnings.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          <span>Operational Threat Radar</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setActiveTab("warnings")}
                          className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>Review All ({insights.warnings.length})</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.warnings.slice(0, 2).map((w, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                              w.severity === "CRITICAL"
                                ? "bg-rose-950/25 border-rose-500/40"
                                : w.severity === "WARNING"
                                ? "bg-amber-950/25 border-amber-500/40"
                                : "bg-sky-950/25 border-sky-500/40"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`badge badge-sm font-black text-[10px] px-2 py-0.5 ${
                                  w.severity === "CRITICAL"
                                    ? "bg-rose-500 text-slate-950"
                                    : w.severity === "WARNING"
                                    ? "bg-amber-400 text-slate-950"
                                    : "bg-sky-400 text-slate-950"
                                }`}
                              >
                                {w.severity}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]">
                                {w.metricTrigger}
                              </span>
                            </div>
                            <h5 className="text-sm font-bold text-white">{w.alert}</h5>
                            <div className="text-xs text-slate-300 p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{w.suggestedRemediation}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Growth Opportunities Preview */}
                  {insights.growthOpportunities && insights.growthOpportunities.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <span>High-Yield Growth Horizons</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setActiveTab("growth")}
                          className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>Explore All ({insights.growthOpportunities.length})</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.growthOpportunities.slice(0, 2).map((opp, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/20 to-black/30 border border-emerald-500/25 space-y-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5" />
                                {opp.estimatedPotential}
                              </span>
                              <span className="badge badge-outline badge-success badge-xs font-bold text-[9px]">
                                EXPANSION
                              </span>
                            </div>
                            <h5 className="text-sm font-bold text-white">{opp.opportunity}</h5>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {opp.actionableNextStep}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ALL RECOMMENDATIONS */}
              {activeTab === "recommendations" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insights.recommendations?.map((rec, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-black/30 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-3.5"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`badge badge-sm font-black text-[10px] px-2.5 py-0.5 border ${
                                rec.priority === "HIGH"
                                  ? "bg-rose-500/15 text-rose-300 border-rose-500/40"
                                  : rec.priority === "MEDIUM"
                                  ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                                  : "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                              }`}
                            >
                              {rec.priority} PRIORITY
                            </span>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                              {rec.expectedImpact}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white">{rec.title}</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">{rec.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ALL RISK WARNINGS */}
              {activeTab === "warnings" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insights.warnings?.map((w, idx) => (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl border space-y-3.5 ${
                          w.severity === "CRITICAL"
                            ? "bg-rose-950/25 border-rose-500/40"
                            : w.severity === "WARNING"
                            ? "bg-amber-950/25 border-amber-500/40"
                            : "bg-sky-950/25 border-sky-500/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`badge badge-sm font-black text-[10px] px-2.5 py-0.5 ${
                              w.severity === "CRITICAL"
                                ? "bg-rose-500 text-slate-950"
                                : w.severity === "WARNING"
                                ? "bg-amber-400 text-slate-950"
                                : "bg-sky-400 text-slate-950"
                            }`}
                          >
                            {w.severity}
                          </span>
                          <span className="text-xs font-mono text-slate-300 bg-black/40 px-2 py-0.5 rounded-md border border-white/5">
                            Trigger: {w.metricTrigger}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">{w.alert}</h4>
                        <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                          <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Recommended Remediation Protocol</span>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed">
                            {w.suggestedRemediation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ALL GROWTH OPPORTUNITIES */}
              {activeTab === "growth" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insights.growthOpportunities?.map((opp, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/20 via-black/30 to-black/40 border border-emerald-500/30 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                              <Zap className="w-4 h-4" />
                              {opp.estimatedPotential}
                            </span>
                            <span className="badge badge-success badge-sm font-black text-slate-950">
                              ROI PLAY
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white">{opp.opportunity}</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {opp.actionableNextStep}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: KEY OBSERVATIONS & BUSINESS INSIGHTS */}
              {activeTab === "insights" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {normalizedInsights.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="badge badge-outline badge-warning badge-xs font-bold text-[10px]">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium leading-relaxed">
                          {item.observation}
                        </p>
                        {item.impact && (
                          <div className="pt-2 border-t border-white/5 text-[11px] text-amber-400 font-bold flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>Impact: {item.impact}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: FULL NATURAL LANGUAGE REPORT */}
              {activeTab === "report" && (
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                        Executive Natural Language Memorandum
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyReport}
                      className="btn btn-xs btn-outline border-white/20 text-slate-300 hover:text-white gap-1.5"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? "Copied" : "Copy Memorandum"}</span>
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-mono bg-black/30 p-4 rounded-xl border border-white/5 max-h-96 overflow-y-auto">
                    {insights.naturalLanguageReport || insights.executiveSummary}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiDashboardInsightsWidget;
