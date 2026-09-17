import {
  ShieldCheck,
  UserCheck,
  MailCheck,
  Lock,
} from "lucide-react";
import { TAdmin } from "@/src/types/admin";

interface AdminProfileStatsProps {
  adminProfile: TAdmin;
}

const AdminProfileStats = ({ adminProfile }: AdminProfileStatsProps) => {
  const isAdministratorActive = !adminProfile.isDeleted;
  const adminRoleTitle =
    adminProfile.user?.role === "SUPER_ADMIN"
      ? "Super Administrator"
      : "Platform Admin";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat 1: System Standing */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              System Standing
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
              {isAdministratorActive ? "Active Operator" : "Inactive"}
            </div>
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <span className="text-emerald-400">●</span> Full management privileges
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20 text-amber-400 shadow-sm shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stat 2: Access Clearance */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Access Clearance
            </span>
            <div
              className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight truncate max-w-[170px]"
              title={adminRoleTitle}
            >
              {adminRoleTitle}
            </div>
            <div className="text-[11px] font-bold text-emerald-400/90 flex items-center gap-1">
              <span>✓</span> Root governance scope
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 shadow-sm shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stat 3: Communication Channels */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Official Channels
            </span>
            <div className="text-xl sm:text-2xl font-black text-indigo-400 tracking-tight">
              Email & Phone
            </div>
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <span className="text-indigo-400">✓</span> System alerts configured
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 shadow-sm shrink-0">
            <MailCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stat 4: Security Policy */}
      <div className="card relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#170d2f] border border-white/10 shadow-2xl p-5">
        {/* Top glowing accent border line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent pointer-events-none z-20" />
        {/* Ambient background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        {/* High-tech dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Security Policy
            </span>
            <div className="text-xl sm:text-2xl font-black text-purple-300 tracking-tight">
              Protected
            </div>
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <span>★</span> Zero-exposure standard
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-300 shadow-sm shrink-0">
            <Lock className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileStats;
