import { Building2, Layers, CheckCircle2, ShieldCheck } from "lucide-react";

interface DepartmentsStatsProps {
  totalDepartments?: number;
}

const DepartmentsStats = ({ totalDepartments }: DepartmentsStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Stat 1: Total Departments */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-primary">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Total Departments</div>
          <div className="stat-value text-2xl text-primary">{totalDepartments ?? 12}</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            ↗︎ Active business units
          </div>
        </div>
      </div>

      {/* Stat 2: Categories Hosted */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-success">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center border border-success/20">
              <Layers className="w-6 h-6 text-success" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Categories Hosted</div>
          <div className="stat-value text-2xl text-success">64</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            Cross-department taxonomy
          </div>
        </div>
      </div>

      {/* Stat 3: Coverage Status */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-warning">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center border border-warning/20">
              <CheckCircle2 className="w-6 h-6 text-warning" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Active Coverage</div>
          <div className="stat-value text-2xl text-warning">100%</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            Fully indexed in catalog
          </div>
        </div>
      </div>

      {/* Stat 4: Structural Compliance */}
      <div className="stats bg-base-100 shadow-lg border border-base-200">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
              <ShieldCheck className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <div className="stat-title text-xs font-extrabold uppercase">Compliance Status</div>
          <div className="stat-value text-2xl text-secondary">99.8%</div>
          <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
            Verified enterprise policy
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsStats;
