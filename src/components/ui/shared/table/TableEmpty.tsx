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
    <div className="text-center py-12 space-y-3 bg-base-200/50 rounded-2xl border border-dashed border-base-300 my-2">
      <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center mx-auto text-base-content/50">
        {emptyIcon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h3 className="font-extrabold text-sm text-base-content">{emptyTitle}</h3>
      <p className="text-xs text-base-content/60 max-w-sm mx-auto">
        {searchValue
          ? `No records matching "${searchValue}". Try clearing your search.`
          : emptyMessage}
      </p>
      {searchValue && onSearchChange ? (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          className="btn btn-xs btn-outline btn-primary font-bold mt-2"
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
