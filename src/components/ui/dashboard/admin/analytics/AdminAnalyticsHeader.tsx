"use client";

import React, { useState, useEffect } from "react";
import {
    Sparkles,
    Calendar,
    Clock,
} from "lucide-react";
import { TDashboardDateRange } from "@/types/dashboard";
import AZHeader from "@/components/shared/AZHeader";
import AZInput from "@/components/shared/form/AZInput";

export type TAnalyticsDateRange = TDashboardDateRange | "15_days";

export interface AdminAnalyticsHeaderProps {
    selectedRange: TAnalyticsDateRange;
    onRangeChange: (range: TAnalyticsDateRange, startDate?: string, endDate?: string) => void;
    onRefresh: () => void;
    isFetching?: boolean;
    socketConnected?: boolean;
    customStartDate?: string;
    customEndDate?: string;
}

const RANGE_OPTIONS: { label: string; value: TAnalyticsDateRange }[] = [
    { label: "Today", value: "today" },
    { label: "7 Days", value: "7_days" },
    { label: "15 Days", value: "15_days" },
    { label: "30 Days", value: "30_days" },
    { label: "Custom", value: "custom" },
];

export const AdminAnalyticsHeader: React.FC<AdminAnalyticsHeaderProps> = ({
    selectedRange,
    onRangeChange,
    onRefresh,
    isFetching = false,
    socketConnected = false,
    customStartDate = "",
    customEndDate = "",
}) => {
    const [startDate, setStartDate] = useState(customStartDate);
    const [endDate, setEndDate] = useState(customEndDate);
    const [showCustomPicker, setShowCustomPicker] = useState(selectedRange === "custom");

    useEffect(() => {
        setShowCustomPicker(selectedRange === "custom");
    }, [selectedRange]);

    useEffect(() => {
        if (customStartDate) setStartDate(customStartDate);
        if (customEndDate) setEndDate(customEndDate);
    }, [customStartDate, customEndDate]);

    const handleApplyCustom = (e: React.FormEvent) => {
        e.preventDefault();
        if (startDate && endDate) {
            onRangeChange("custom", startDate, endDate);
        }
    };

    return (
        <div className="w-full">
            <AZHeader
                badgeLabel="Executive Analytics"
                badgeIcon={<Sparkles className="w-3.5 h-3.5" />}
                statusLabel={socketConnected ? "Live Telemetry: Online" : "Real API Verified"}
                title="Marketplace"
                highlightTitle="Control Hub"
                description="Deep operational analytics dashboard visualizing revenue streams, order distribution cycles, merchant statistics, department/category volumes, and platform inventory health."
                onRefresh={onRefresh}
                isRefreshing={isFetching}
                actions={
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center bg-[#120824] border border-white/15 rounded-2xl p-1 gap-1 shadow-inner">
                            <div className="px-2 text-slate-400 flex items-center gap-1 text-xs font-bold">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                <span className="hidden sm:inline">Range:</span>
                            </div>
                            {RANGE_OPTIONS.map((opt) => {
                                const isActive = selectedRange === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            if (opt.value === "custom") {
                                                setShowCustomPicker(true);
                                                onRangeChange("custom", startDate, endDate);
                                            } else {
                                                setShowCustomPicker(false);
                                                onRangeChange(opt.value);
                                            }
                                        }}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                            isActive
                                                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                                                : "text-slate-300 hover:text-white hover:bg-white/5"
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                }
            >
                {/* Expandable Custom Date Range Selector */}
                {showCustomPicker && (
                    <form
                        onSubmit={handleApplyCustom}
                        className="flex flex-wrap items-end gap-3 px-6 pb-6 pt-3 border-t border-white/10 text-xs animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold pb-2 self-center sm:self-auto">
                            <Calendar className="w-4 h-4" />
                            <span>Custom Date Window:</span>
                        </div>

                        <div className="w-40 sm:w-48 [&_input]:bg-[#120824] [&_input]:text-white [&_input]:border-white/20 [&_input]:h-9 [&_input]:py-1 [&_input]:text-xs [&_input]:rounded-xl [&_label]:py-0.5">
                            <AZInput
                                name="customStartDate"
                                label={<span className="text-[11px] font-bold text-slate-300">From</span>}
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="w-40 sm:w-48 [&_input]:bg-[#120824] [&_input]:text-white [&_input]:border-white/20 [&_input]:h-9 [&_input]:py-1 [&_input]:text-xs [&_input]:rounded-xl [&_label]:py-0.5">
                            <AZInput
                                name="customEndDate"
                                label={<span className="text-[11px] font-bold text-slate-300">To</span>}
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2 pb-0.5">
                            <button
                                type="submit"
                                disabled={!startDate || !endDate}
                                className="btn btn-sm bg-amber-400 text-slate-950 hover:bg-amber-300 font-black rounded-xl px-4 cursor-pointer shadow-md disabled:opacity-50 h-9 min-h-0"
                            >
                                Apply Filter
                            </button>
                            {(startDate || endDate) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStartDate("");
                                        setEndDate("");
                                        onRangeChange("30_days");
                                        setShowCustomPicker(false);
                                    }}
                                    className="btn btn-sm btn-ghost text-slate-400 hover:text-white rounded-xl px-3 h-9 min-h-0 text-xs cursor-pointer"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </AZHeader>
        </div>
    );
};

export default AdminAnalyticsHeader;
