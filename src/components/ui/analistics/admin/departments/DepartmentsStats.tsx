import React, { ReactNode } from "react";
import { Building2, Layers, CheckCircle2, ShieldCheck } from "lucide-react";

export type TStatAccentColor = "amber" | "indigo" | "emerald" | "purple" | "rose" | "sky";

export interface DepartmentStatItem {
  id?: string | number;
  title: string;
  value: string | number;
  subtitle?: string;
  subtitleIcon?: ReactNode;
  icon: ReactNode;
  accentColor?: TStatAccentColor;
}

export interface DepartmentsStatsProps {
  totalDepartments?: number;
  totalCategories?: number | string;
  activeCoverage?: string;
  complianceRate?: string;
  stats?: DepartmentStatItem[];
  className?: string;
}

const ACCENT_STYLES: Record<
  TStatAccentColor,
  {
    line: string;
    glow: string;
    value: string;
    iconBg: string;
    iconBorder: string;
    iconText: string;
    subtitleText: string;
  }
> = {
  amber: {
    line: "via-amber-400/60",
    glow: "from-amber-500/20",
    value: "text-amber-400",
    iconBg: "bg-amber-400/10",
    iconBorder: "border-amber-400/20",
    iconText: "text-amber-400",
    subtitleText: "text-slate-400",
  },
  indigo: {
    line: "via-indigo-400/60",
    glow: "from-indigo-500/20",
    value: "text-indigo-400",
    iconBg: "bg-indigo-500/10",
    iconBorder: "border-indigo-500/20",
    iconText: "text-indigo-400",
    subtitleText: "text-indigo-300/90",
  },
  emerald: {
    line: "via-emerald-400/60",
    glow: "from-emerald-500/20",
    value: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/20",
    iconText: "text-emerald-400",
    subtitleText: "text-emerald-400/90",
  },
  purple: {
    line: "via-purple-400/60",
    glow: "from-purple-500/20",
    value: "text-purple-400",
    iconBg: "bg-purple-500/10",
    iconBorder: "border-purple-500/20",
    iconText: "text-purple-400",
    subtitleText: "text-purple-300/90",
  },
  rose: {
    line: "via-rose-400/60",
    glow: "from-rose-500/20",
    value: "text-rose-400",
    iconBg: "bg-rose-500/10",
    iconBorder: "border-rose-500/20",
    iconText: "text-rose-400",
    subtitleText: "text-rose-400/90",
  },
  sky: {
    line: "via-sky-400/60",
    glow: "from-sky-500/20",
    value: "text-sky-400",
    iconBg: "bg-sky-500/10",
    iconBorder: "border-sky-500/20",
    iconText: "text-sky-400",
    subtitleText: "text-sky-300/90",
  },
};

const StatCard = ({ item }: { item: DepartmentStatItem }) => {
  const accent = ACCENT_STYLES[item.accentColor || "amber"];

  return (
    <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-dashboard-category border border-white/10 shadow-2xl p-5">
      {/* Top glowing accent border line */}
      <div
        className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent ${accent.line} to-transparent pointer-events-none z-20`}
      />
      {/* Ambient background glow */}
      <div
        className={`absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br ${accent.glow} to-transparent rounded-full blur-2xl pointer-events-none`}
      />
      {/* High-tech dot matrix overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
            {item.title}
          </span>
          <div className={`text-3xl font-black ${accent.value} tracking-tight`}>
            {item.value}
          </div>
          {item.subtitle && (
            <div className={`text-[11px] font-bold ${accent.subtitleText} flex items-center gap-1`}>
              {item.subtitleIcon}
              <span>{item.subtitle}</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${accent.iconBg} flex items-center justify-center border ${accent.iconBorder} ${accent.iconText} shadow-sm shrink-0`}
        >
          {item.icon}
        </div>
      </div>
    </div>
  );
};

const DepartmentsStats = ({
  totalDepartments,
  totalCategories = 64,
  activeCoverage = "100%",
  complianceRate = "99.8%",
  stats,
  className = "",
}: DepartmentsStatsProps = {}) => {
  const displayStats: DepartmentStatItem[] =
    stats && stats.length > 0
      ? stats
      : [
          {
            id: "total-departments",
            title: "Total Departments",
            value: totalDepartments ?? 12,
            subtitle: "Active business units",
            subtitleIcon: <span className="text-emerald-400">↗︎</span>,
            icon: <Building2 className="w-6 h-6" />,
            accentColor: "amber",
          },
          {
            id: "categories-hosted",
            title: "Categories Hosted",
            value: totalCategories,
            subtitle: "Cross-department taxonomy",
            subtitleIcon: <span>●</span>,
            icon: <Layers className="w-6 h-6" />,
            accentColor: "indigo",
          },
          {
            id: "active-coverage",
            title: "Active Coverage",
            value: activeCoverage,
            subtitle: "Fully indexed in catalog",
            subtitleIcon: <span>●</span>,
            icon: <CheckCircle2 className="w-6 h-6" />,
            accentColor: "emerald",
          },
          {
            id: "compliance-status",
            title: "Compliance Status",
            value: complianceRate,
            subtitle: "Verified enterprise policy",
            subtitleIcon: <span>●</span>,
            icon: <ShieldCheck className="w-6 h-6" />,
            accentColor: "purple",
          },
        ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {displayStats.map((item, idx) => (
        <StatCard key={item.id ?? idx} item={item} />
      ))}
    </div>
  );
};

export default DepartmentsStats;
