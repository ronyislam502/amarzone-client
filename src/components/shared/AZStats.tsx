
import { ReactNode } from "react";

export interface TAZStat {
    label: string;
    value: number | string;
    description: string;
    descriptionIcon?: ReactNode;
    icon: ReactNode;
    lineColor: string;
    glowColor: string;
    valueColor: string;
    iconWrapperColor: string;
    iconBorderColor: string;
    iconColor: string;
}

interface AZStatsProps {
    stats: TAZStat[];
}

const AZStats = ({ stats }: AZStatsProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5"
                >
                    {/* Top glowing accent border line */}
                    <div
                        className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent ${stat.lineColor} to-transparent pointer-events-none z-20`}
                    />

                    {/* Ambient background glow */}
                    <div
                        className={`absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br ${stat.glowColor} to-transparent rounded-full blur-2xl pointer-events-none`}
                    />

                    {/* High-tech dot matrix overlay */}
                    <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                                {stat.label}
                            </span>

                            <div
                                className={`text-3xl font-black ${stat.valueColor} tracking-tight`}
                            >
                                {stat.value}
                            </div>

                            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                {stat.descriptionIcon}
                                {stat.description}
                            </div>
                        </div>

                        <div
                            className={`w-12 h-12 rounded-xl ${stat.iconWrapperColor} flex items-center justify-center border ${stat.iconBorderColor} ${stat.iconColor} shadow-sm shrink-0`}
                        >
                            {stat.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AZStats;

