import React from "react";
import { BuyBoxAddToListProps } from "./types";

export const BuyBoxAddToList: React.FC<BuyBoxAddToListProps> = ({ onAddToList }) => {
  return (
    <div className="border-t border-base-300 pt-3">
      <button
        type="button"
        onClick={onAddToList}
        className="btn btn-sm btn-outline w-full rounded-md font-normal bg-base-200 hover:bg-base-300 border-base-300 text-xs text-base-content h-8 min-h-0"
      >
        Add to List
      </button>
    </div>
  );
};

export default BuyBoxAddToList;
