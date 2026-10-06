"use client";

import React from "react";
import { Package, MessageSquareText, Info } from "lucide-react";

export type VendorTabType = "products" | "reviews" | "about";

interface VendorTabsProps {
  activeTab: VendorTabType;
  onChangeTab: (tab: VendorTabType) => void;
  productsCount?: number;
  reviewsCount?: number;
}

export const VendorTabs: React.FC<VendorTabsProps> = ({
  activeTab,
  onChangeTab,
  productsCount = 0,
  reviewsCount = 0,
}) => {
  const tabs: {
    id: VendorTabType;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }[] = [
    {
      id: "products",
      label: "All Products",
      icon: Package,
      badge: productsCount,
    },
    {
      id: "reviews",
      label: "Customer Reviews",
      icon: MessageSquareText,
      badge: reviewsCount,
    },
    {
      id: "about",
      label: "About & Policies",
      icon: Info,
    },
  ];

  return (
    <div className="w-full border-b border-slate-200 bg-white sticky top-0 z-30 select-none shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 sm:space-x-8 -mb-px overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeTab(tab.id)}
                className={`group py-4 px-3 sm:px-1 inline-flex items-center gap-2 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "border-amber-500 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? "text-amber-500 stroke-[2.4]"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-black transition-colors ${
                      isActive
                        ? "bg-amber-100 text-amber-900"
                        : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default VendorTabs;
