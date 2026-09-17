import { Store, CheckCircle2, Users, ShieldCheck } from "lucide-react";

interface VendorsStatsProps {
  totalVendors?: number;
  activeVendors?: number;
  newVendorsCount?: number;
  complianceRate?: string;
}

const VendorsStats = ({
  totalVendors = 0,
  activeVendors = 0,
  newVendorsCount = 12,
  complianceRate = "99.8%",
}: VendorsStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat 1: Total Vendors */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">Total Vendors</span>
            <div className="text-3xl font-black text-amber-400 tracking-tight">{totalVendors}</div>
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <span className="text-emerald-400">↗︎</span> Registered merchant stores
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20 text-amber-400 shadow-sm shrink-0">
            <Store className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stat 2: Active Storefronts */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">Active Merchants</span>
            <div className="text-3xl font-black text-emerald-400 tracking-tight">{activeVendors}</div>
            <div className="text-[11px] font-bold text-emerald-400/90 flex items-center gap-1">
              <span>●</span> Authorized merchant accounts
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 shadow-sm shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stat 3: Newly Registered */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-sky-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">New Partners</span>
            <div className="text-3xl font-black text-sky-400 tracking-tight">{newVendorsCount}</div>
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <span className="text-sky-400">✓</span> Onboarded this month
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 text-sky-400 shadow-sm shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stat 4: Compliance & Health */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">Compliance Rate</span>
            <div className="text-3xl font-black text-purple-300 tracking-tight">{complianceRate}</div>
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <span>★</span> Enterprise SLA compliance
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-300 shadow-sm shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorsStats;
