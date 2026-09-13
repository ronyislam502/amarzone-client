"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

export type TOrderStatusTab = "pending" | "unshipped" | "canceled" | "shipped";

interface OrdersStatusTabsProps {
  activeTab: TOrderStatusTab;
  onTabChange: (tab: TOrderStatusTab) => void;
  counts?: {
    pending?: number;
    unshipped?: number;
    canceled?: number;
    shipped?: number;
  };
}

export const OrdersStatusTabs: React.FC<OrdersStatusTabsProps> = ({
  activeTab = "pending",
  onTabChange,
  counts = { pending: 1, unshipped: 21, canceled: 0, shipped: 142 },
}) => {
  const tabs = [
    {
      id: "pending" as TOrderStatusTab,
      label: "Pending",
      count: counts.pending,
      highlightCount: true,
    },
    {
      id: "unshipped" as TOrderStatusTab,
      label: "Unshipped",
      count: counts.unshipped,
      highlightCount: true,
    },
    {
      id: "canceled" as TOrderStatusTab,
      label: "Canceled",
      count: counts.canceled,
      highlightCount: false,
    },
    {
      id: "shipped" as TOrderStatusTab,
      label: "Shipped",
      count: counts.shipped,
      highlightCount: false,
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 gap-3">
      {/* Tabs list */}
      <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`pb-3 pt-1 text-sm font-semibold transition-all relative flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={
                    isActive || tab.highlightCount
                      ? "text-amber-400 font-bold"
                      : "text-slate-400 font-medium"
                  }
                >
                  {tab.count}
                </span>
              )}
              <span>{tab.label}</span>

              {/* Active Tab Underline Indicator */}
              {isActive && (
                <span className="absolute bottom-0 inset-x-0 h-[2.5px] bg-amber-400 rounded-t-full shadow-[0_-2px_8px_rgba(251,191,36,0.6)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right Link */}
      <div className="pb-3 text-xs flex items-center self-end sm:self-auto">
        <a
          href="#fba-orders"
          className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-0.5 hover:underline transition-colors"
        >
          <span>View FBA orders</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default OrdersStatusTabs;
