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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Stat 1: Total Customers */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-info">
            <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center border border-info/20">
              <Users className="w-6 h-6 text-info" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Total Customers</div>
          <div className="stat-value text-2xl text-info">{totalCustomers}</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            ↗︎ Registered shopper accounts
          </div>
        </div>
      </div>

      {/* Stat 2: Active Shoppers */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-success">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center border border-success/20">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Active Accounts</div>
          <div className="stat-value text-2xl text-success">{activeCustomers}</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            Compliant consumer standing
          </div>
        </div>
      </div>

      {/* Stat 3: Verified Shipping Profiles */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-primary">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Verified Profiles</div>
          <div className="stat-value text-2xl text-primary">{verifiedProfiles}</div>
          <div className="stat-desc font-bold text-primary flex items-center gap-1 mt-1">
            Complete address on file
          </div>
        </div>
      </div>

      {/* Stat 4: Loyalty & Retention */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
              <Heart className="w-6 h-6 text-secondary fill-secondary" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Retention Rate</div>
          <div className="stat-value text-2xl text-secondary">{retentionRate}</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            High repeat order rate
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersStats;
