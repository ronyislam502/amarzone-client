import { Download, RotateCcw, Sparkles, Store } from "lucide-react";

export interface VendorsHeaderProps {
  onExportCsv?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const VendorsHeader = ({
  onExportCsv,
  onRefresh,
  isRefreshing = false,
}: VendorsHeaderProps) => {
  return (
    <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl">
      {/* Top glowing accent border line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

      {/* Ambient background glow orbs */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* High-tech dot matrix overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

      <div className="card-body relative z-10 flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-7">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-warning gap-1 px-3 py-2 text-xs font-black shadow text-slate-900">
              <Sparkles className="w-3.5 h-3.5" />
              Multi-Vendor Ecosystem
            </span>
            <span className="badge badge-success badge-outline gap-1 font-bold text-xs bg-success/10 border-success/30 text-success">
              <span className="w-2 h-2 rounded-full bg-success animate-ping" />
              Partner Onboarding & Governance
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Vendors <span className="text-amber-400">Directory</span>
          </h1>
          <p className="text-slate-300/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Oversee registered merchant storefronts, inspect store branding assets, monitor contact channels, and govern vendor accounts across departments.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="btn btn-ghost btn-sm gap-2 border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer rounded-xl"
            >
              <RotateCcw
                className={`w-4 h-4 text-amber-400 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              <span>Refresh</span>
            </button>
          )}

          {onExportCsv && (
            <button
              type="button"
              onClick={onExportCsv}
              className="btn btn-outline btn-sm gap-2 font-bold border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-slate-950 transition-all shadow-sm cursor-pointer rounded-xl"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorsHeader;
