import React from "react";
import { FolderOpen } from "lucide-react";

export type TTableEmptyProps = {
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const TableEmpty = ({
  emptyTitle = "No Records Found",
  emptyMessage = "There are no records to display at this time.",
  emptyIcon,
  emptyAction,
  searchValue,
  onSearchChange,
}: TTableEmptyProps) => {
  return (
    <div className="text-center py-12 space-y-3 bg-white/[0.02] rounded-2xl border border-dashed border-white/10 my-4">
      <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto text-amber-400 shadow-sm">
        {emptyIcon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h3 className="font-extrabold text-sm text-white">{emptyTitle}</h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto">
        {searchValue
          ? `No records matching "${searchValue}". Try clearing your search.`
          : emptyMessage}
      </p>
      {searchValue && onSearchChange ? (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          className="btn btn-xs bg-amber-400/15 border border-amber-400/30 text-amber-300 hover:bg-amber-400/25 font-bold mt-2 rounded-lg"
        >
          Clear Search
        </button>
      ) : (
        emptyAction
      )}
    </div>
  );
}

export default TableEmpty;
