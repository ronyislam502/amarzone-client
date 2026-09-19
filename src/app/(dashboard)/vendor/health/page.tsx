"use client";

import React, { useState } from "react";
import HealthBread from "@/src/components/ui/analistics/vendor/health/HealthBread";
import HealthHeader from "@/src/components/ui/analistics/vendor/health/HealthHeader";
import HealthScoreCard from "@/src/components/ui/analistics/vendor/health/HealthScoreCard";
import HealthMetricsGrid from "@/src/components/ui/analistics/vendor/health/HealthMetricsGrid";
import HealthBuyBoxEligibility from "@/src/components/ui/analistics/vendor/health/HealthBuyBoxEligibility";
import HealthViolationsList from "@/src/components/ui/analistics/vendor/health/HealthViolationsList";
import HealthActionTips from "@/src/components/ui/analistics/vendor/health/HealthActionTips";
import {
  useGetMyHealthQuery,
  useGetMyViolationsQuery,
} from "@/src/redux/features/health/healthApi";
import { AlertCircle, RefreshCw, ShieldAlert } from "lucide-react";

const VendorHealthPage = () => {
  const {
    data: healthResponse,
    isLoading: isHealthLoading,
    isFetching: isHealthFetching,
    error: healthError,
    refetch: refetchHealth,
  } = useGetMyHealthQuery();

  const {
    data: violationsResponse,
    isLoading: isViolationsLoading,
    isFetching: isViolationsFetching,
    refetch: refetchViolations,
  } = useGetMyViolationsQuery();

  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const healthData = healthResponse?.data;
  const violationsData = violationsResponse?.data || [];

  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    await Promise.all([refetchHealth(), refetchViolations()]);
    setTimeout(() => {
      setIsManualRefreshing(false);
    }, 600);
  };

  const isRefreshing = isHealthFetching || isViolationsFetching || isManualRefreshing;

  return (
    <div className="space-y-6 w-full pb-10 text-slate-100">
      {/* 1. Breadcrumbs */}
      <HealthBread />

      {/* 2. Hero Header with Live Status & Refresh */}
      <HealthHeader
        status={healthData?.status}
        calculatedAt={healthData?.calculatedAt}
        isFetching={isRefreshing}
        onRefresh={handleRefresh}
      />

      {/* Loading Skeleton */}
      {isHealthLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-64 bg-[#170d2f]/70 border border-white/10 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-44 bg-[#170d2f]/70 border border-white/10 rounded-2xl"
              />
            ))}
          </div>
          <div className="h-56 bg-[#170d2f]/70 border border-white/10 rounded-2xl" />
        </div>
      ) : healthError ? (
        /* Error fallback banner */
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-rose-300">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Unable to load account health data</h4>
              <p className="text-xs text-rose-300/80">
                Please check your network connection or verify you are authenticated as a registered vendor.
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="btn btn-sm bg-rose-500 hover:bg-rose-600 text-white border-0 rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <>
          {/* 3. Central Account Health Score Gauge & Standing Tier */}
          <HealthScoreCard
            score={healthData?.score}
            status={healthData?.status}
          />

          {/* 4. The 4 Core SLA Marketplace Metrics */}
          <HealthMetricsGrid
            orderDefectRate={healthData?.orderDefectRate}
            lateShipmentRate={healthData?.lateShipmentRate}
            cancellationRate={healthData?.cancellationRate}
            validTrackingRate={healthData?.validTrackingRate}
          />

          {/* 5. Buy Box Readiness & Qualification Checklist */}
          <HealthBuyBoxEligibility health={healthData} />

          {/* 6. Active Policy Violations & Warning Strikes */}
          <HealthViolationsList
            violations={violationsData}
            isLoading={isViolationsLoading}
          />

          {/* 7. Actionable SLA Protection Advice */}
          <HealthActionTips />
        </>
      )}
    </div>
  );
};

export default VendorHealthPage;
