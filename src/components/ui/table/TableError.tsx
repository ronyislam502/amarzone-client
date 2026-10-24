
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
    <div className={`card bg-[#170d2f] border border-rose-500/20 shadow-xl rounded-2xl p-4 my-4 ${className}`}>
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 shrink-0 text-rose-400" />
          <div>
            <h3 className="font-bold text-sm text-rose-300">Error Loading Records</h3>
            <p className="text-xs text-rose-300/80">{errorMessage}</p>
          </div>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn btn-sm bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30 gap-2 font-bold text-xs rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default TableError;
