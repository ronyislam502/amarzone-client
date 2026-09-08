import { Download, Plus, RotateCcw, ShieldAlert, Sparkles, UserCheck } from "lucide-react";

export interface AdminsHeaderProps {
  onExportCsv?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onOpenCreateModal?: () => void;
}

const AdminsHeader = ({
  onExportCsv,
  onRefresh,
  isRefreshing = false,
  onOpenCreateModal,
}: AdminsHeaderProps) => {
  return (
    <div className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-secondary gap-1 px-3 py-2 text-xs font-black shadow text-white">
              <Sparkles className="w-3.5 h-3.5" />
              Platform Governance
            </span>
            <span className="badge badge-success badge-outline gap-1 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-success animate-ping" />
              Operational Authority
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight">
            Admins & <span className="text-secondary">Staff Directory</span>
          </h1>
          <p className="text-base-content/70 text-xs sm:text-sm max-w-2xl">
            Oversee administrative personnel, manage platform access privileges, audit contact credentials, and onboard authorized staff members.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="btn btn-ghost btn-sm gap-2 border border-base-300 hover:bg-base-200 cursor-pointer"
            >
              <RotateCcw
                className={`w-4 h-4 text-secondary ${
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
              className="btn btn-outline btn-secondary btn-sm gap-2 font-bold shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          )}

          {onOpenCreateModal && (
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="btn btn-secondary btn-sm gap-2 font-bold shadow-md cursor-pointer text-white"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Admin</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminsHeader;
