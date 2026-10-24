'use client';

import AZStats, { TAZStat } from "@/components/shared/AZStats";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { TDepartment } from "@/types/department";
import { TMeta } from "@/types/global";
import {
    Layers,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
} from "lucide-react";

export interface DepartmentsStatsProps {
    totalDepartments?: number;
    activeDepartments?: number;
    archivedDepartments?: number;
    coverageRate?: string;
    departments?: TDepartment[];
    isLoading?: boolean;
    meta?: TMeta;
}

const DepartmentsStats = ({
    totalDepartments,
    activeDepartments,
    archivedDepartments,
    coverageRate,
    departments: initialDepartments,
    isLoading: propIsLoading,
    meta: propMeta,
}: DepartmentsStatsProps = {}) => {
    // Skip duplicate network query if parent (DepartmentsData) already provides data
    const shouldSkip = Boolean(initialDepartments !== undefined && propIsLoading !== undefined);
    const { data: departmentsData, isLoading: queryLoading } = useAllDepartmentsQuery({}, { skip: shouldSkip });

    const isLoading = propIsLoading !== undefined ? propIsLoading : queryLoading;
    const rawData = departmentsData?.data;
    const resolvedData: TDepartment[] = Array.isArray(rawData)
        ? rawData
        : (rawData as any)?.data || [];

    const departments = initialDepartments || resolvedData || [];
    const meta = propMeta || departmentsData?.meta;

    const computedTotal = totalDepartments ?? meta?.total ?? departments.length;

    const computedActive =
        activeDepartments ??
        departments.filter((dept) => !dept.isDeleted).length;

    const computedArchived =
        archivedDepartments ??
        departments.filter((dept) => dept.isDeleted).length;

    const computedCoverageRate =
        coverageRate ??
        (computedTotal > 0
            ? `${((computedActive / computedTotal) * 100).toFixed(1)}%`
            : "100%");

    const stats: TAZStat[] = [
        {
            label: "Total Departments",
            value: isLoading ? "—" : computedTotal,
            description: "Taxonomy categories",
            descriptionIcon: (
                <span className="text-amber-400">↗︎</span>
            ),
            icon: <Layers className="w-6 h-6" />,
            lineColor: "via-amber-400/60",
            glowColor: "from-amber-500/20",
            valueColor: "text-amber-400",
            iconWrapperColor: "bg-amber-400/10",
            iconBorderColor: "border-amber-400/20",
            iconColor: "text-amber-400",
        },
        {
            label: "Active Divisions",
            value: isLoading ? "—" : computedActive,
            description: "Published in catalog",
            descriptionIcon: <span>●</span>,
            icon: <CheckCircle2 className="w-6 h-6" />,
            lineColor: "via-emerald-400/60",
            glowColor: "from-emerald-500/20",
            valueColor: "text-emerald-400",
            iconWrapperColor: "bg-emerald-500/10",
            iconBorderColor: "border-emerald-500/20",
            iconColor: "text-emerald-400",
        },
        {
            label: "Archived Divisions",
            value: isLoading ? "—" : computedArchived,
            description: "Hidden or deactivated",
            descriptionIcon: <span>●</span>,
            icon: <AlertTriangle className="w-6 h-6" />,
            lineColor: "via-rose-400/60",
            glowColor: "from-rose-500/20",
            valueColor: "text-rose-400",
            iconWrapperColor: "bg-rose-500/10",
            iconBorderColor: "border-rose-500/20",
            iconColor: "text-rose-400",
        },
        {
            label: "Taxonomy Health",
            value: isLoading ? "—" : computedCoverageRate,
            description: "Catalog active ratio",
            descriptionIcon: <span>★</span>,
            icon: <Sparkles className="w-6 h-6" />,
            lineColor: "via-cyan-400/60",
            glowColor: "from-cyan-500/20",
            valueColor: "text-cyan-400",
            iconWrapperColor: "bg-cyan-500/10",
            iconBorderColor: "border-cyan-500/20",
            iconColor: "text-cyan-400",
        },
    ];

    return <AZStats stats={stats} />;
};

export default DepartmentsStats;
