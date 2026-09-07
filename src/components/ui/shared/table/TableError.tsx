
import { AlertCircle, RefreshCw } from "lucide-react";

export type TTableErrorProps = {
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
}

const TableError = ({
  errorMessage = "Failed to load data from server.",
  onRetry,
  className = "",
}: TTableErrorProps) => {
  return (
    <div className={`card bg-base-100 shadow-xl border border-error/20 ${className}`}>
      <div className="card-body">
        <div className="alert alert-error shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 shrink-0 text-error-content" />
            <div>
              <h3 className="font-bold text-sm">Error Loading Records</h3>
              <p className="text-xs opacity-90">{errorMessage}</p>
            </div>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="btn btn-sm btn-ghost border border-error-content/30 gap-2 hover:bg-error-content/10 font-bold text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TableError;
