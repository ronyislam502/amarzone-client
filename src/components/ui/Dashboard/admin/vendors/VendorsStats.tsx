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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Stat 1: Total Vendors */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-warning">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center border border-warning/20">
              <Store className="w-6 h-6 text-warning" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Total Vendors</div>
          <div className="stat-value text-2xl text-warning">{totalVendors}</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            ↗︎ Registered merchant stores
          </div>
        </div>
      </div>

      {/* Stat 2: Active Storefronts */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-success">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center border border-success/20">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Active Stores</div>
          <div className="stat-value text-2xl text-success">{activeVendors}</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            Operating storefronts
          </div>
        </div>
      </div>

      {/* Stat 3: Newly Registered */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-info">
            <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center border border-info/20">
              <Users className="w-6 h-6 text-info" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">New Partners</div>
          <div className="stat-value text-2xl text-info">{newVendorsCount}</div>
          <div className="stat-desc font-bold text-info flex items-center gap-1 mt-1">
            Onboarded this month
          </div>
        </div>
      </div>

      {/* Stat 4: Compliance & Health */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
              <ShieldCheck className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Compliance Rate</div>
          <div className="stat-value text-2xl text-secondary">{complianceRate}</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            Enterprise SLA compliance
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorsStats;
