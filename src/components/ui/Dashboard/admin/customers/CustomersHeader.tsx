import { Download, RotateCcw, Sparkles, Users } from "lucide-react";

export interface CustomersHeaderProps {
  onExportCsv?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const CustomersHeader = ({
  onExportCsv,
  onRefresh,
  isRefreshing = false,
}: CustomersHeaderProps) => {
  return (
    <div className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-info gap-1 px-3 py-2 text-xs font-black shadow text-white">
              <Sparkles className="w-3.5 h-3.5" />
              Customer Base Management
            </span>
            <span className="badge badge-success badge-outline gap-1 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-success animate-ping" />
              Verified Consumer Accounts
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight">
            Customers <span className="text-info">Directory</span>
          </h1>
          <p className="text-base-content/70 text-xs sm:text-sm max-w-2xl">
            Monitor registered consumer accounts, review verified shipping destinations, evaluate engagement channels, and govern customer account states.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="btn btn-ghost btn-sm gap-2 border border-base-300 hover:bg-base-200 cursor-pointer"
            >
              <RotateCcw
                className={`w-4 h-4 text-info ${
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
              className="btn btn-info btn-sm gap-2 font-bold shadow-md cursor-pointer text-white"
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

export default CustomersHeader;
