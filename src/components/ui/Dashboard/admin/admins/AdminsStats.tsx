import { UserCheck, ShieldCheck, CheckCircle2, Lock } from "lucide-react";

interface AdminsStatsProps {
  totalAdmins?: number;
  activeAdmins?: number;
  superAdmins?: number;
  securityRate?: string;
}

const AdminsStats = ({
  totalAdmins = 0,
  activeAdmins = 0,
  superAdmins = 0,
  securityRate = "99.8%",
}: AdminsStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Stat 1: Total Admins */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
              <UserCheck className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Total Staff</div>
          <div className="stat-value text-2xl text-secondary">{totalAdmins}</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            ↗︎ Administrative accounts
          </div>
        </div>
      </div>

      {/* Stat 2: Active Admins */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-success">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center border border-success/20">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Active Admins</div>
          <div className="stat-value text-2xl text-success">{activeAdmins}</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            Operational and authorized
          </div>
        </div>
      </div>

      {/* Stat 3: Super Admins */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-primary">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Super Admins</div>
          <div className="stat-value text-2xl text-primary">{superAdmins}</div>
          <div className="stat-desc font-bold text-primary flex items-center gap-1 mt-1">
            Full root system access
          </div>
        </div>
      </div>

      {/* Stat 4: Security Compliance */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-warning">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center border border-warning/20">
              <Lock className="w-6 h-6 text-warning" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Compliance Score</div>
          <div className="stat-value text-2xl text-warning">{securityRate}</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            Encrypted session audit
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminsStats;
