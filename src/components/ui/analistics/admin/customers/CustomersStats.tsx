import { Users, CheckCircle2, ShieldCheck, Heart } from "lucide-react";

interface CustomersStatsProps {
  totalCustomers?: number;
  activeCustomers?: number;
  verifiedProfiles?: number;
  retentionRate?: string;
}

const CustomersStats = ({
  totalCustomers = 0,
  activeCustomers = 0,
  verifiedProfiles = 0,
  retentionRate = "96.4%",
}: CustomersStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat 1: Total Customers */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">Total Customers</span>
            <div className="text-3xl font-black text-amber-400 tracking-tight">{totalCustomers}</div>
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <span className="text-emerald-400">↗︎</span> Registered shopper accounts
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20 text-amber-400 shadow-sm shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stat 2: Active Shoppers */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">Active Accounts</span>
            <div className="text-3xl font-black text-emerald-400 tracking-tight">{activeCustomers}</div>
            <div className="text-[11px] font-bold text-emerald-400/90 flex items-center gap-1">
              <span>●</span> Compliant consumer standing
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 shadow-sm shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stat 3: Verified Profiles */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">Verified Profiles</span>
            <div className="text-3xl font-black text-indigo-400 tracking-tight">{verifiedProfiles}</div>
            <div className="text-[11px] font-bold text-indigo-300/90 flex items-center gap-1">
              <span>●</span> Complete address on file
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 shadow-sm shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stat 4: Retention Rate */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">Retention Rate</span>
            <div className="text-3xl font-black text-purple-400 tracking-tight">{retentionRate}</div>
            <div className="text-[11px] font-bold text-purple-300/90 flex items-center gap-1">
              <span className="text-emerald-400">↗︎</span> High repeat order rate
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 shadow-sm shrink-0">
            <Heart className="w-6 h-6 fill-purple-400 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersStats;
