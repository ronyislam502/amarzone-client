"use client";

import { useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useMyProfileQuery } from "@/src/redux/features/user/userApi";
import { TVendor } from "@/src/types/vendor";
import VendorProfileBread from "./VendorProfileBread";
import VendorProfileHeader from "./VendorProfileHeader";
import VendorProfileStats from "./VendorProfileStats";
import VendorProfileDetails from "./VendorProfileDetails";
import VendorProfileEditModal from "./VendorProfileEditModal";
import VendorProfileSkeleton from "./VendorProfileSkeleton";

const VendorProfileContainer = () => {
  const [isEditStoreModalOpen, setIsEditStoreModalOpen] =
    useState<boolean>(false);

  const {
    data: profileApiResponse,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileFetchError,
    refetch: refetchVendorProfile,
    isFetching: isRefetchingProfile,
  } = useMyProfileQuery({});

  const vendorProfileData: TVendor | undefined = profileApiResponse?.data;

  const handleOpenEditStoreModal = () => {
    setIsEditStoreModalOpen(true);
  };

  const handleCloseEditStoreModal = () => {
    setIsEditStoreModalOpen(false);
  };

  const handleRefreshProfileClick = () => {
    refetchVendorProfile();
  };

  // Loading State
  if (isProfileLoading) {
    return (
      <div className="space-y-6 w-full pb-10">
        <VendorProfileBread />
        <VendorProfileSkeleton />
      </div>
    );
  }

  // Error State
  if (isProfileError || !vendorProfileData) {
    const backendErrorMessage =
      (profileFetchError as { data?: { message?: string } })?.data?.message ||
      "Unable to load vendor store profile details. Please verify your merchant credentials.";

    return (
      <div className="space-y-6 w-full pb-10">
        <VendorProfileBread />

        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-xl font-black text-white">
              Failed to Load Store Profile
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {backendErrorMessage}
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={handleRefreshProfileClick}
              className="btn btn-sm gap-2 font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-0 rounded-xl"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Loading Profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Breadcrumb Navigation */}
      <VendorProfileBread />

      {/* Hero Header with Banner and Logo */}
      <VendorProfileHeader
        vendorProfile={vendorProfileData}
        onOpenEditModal={handleOpenEditStoreModal}
        onRefreshProfile={handleRefreshProfileClick}
        isRefreshingProfile={isRefetchingProfile}
      />

      {/* High-Level Overview Stats */}
      <VendorProfileStats vendorProfile={vendorProfileData} />

      {/* Main Store Details Grid, Branding Assets & Quick Shortcuts */}
      <VendorProfileDetails
        vendorProfile={vendorProfileData}
        onOpenEditModal={handleOpenEditStoreModal}
      />

      {/* Edit Store Profile Modal Dialog */}
      <VendorProfileEditModal
        vendorProfile={vendorProfileData}
        isModalOpen={isEditStoreModalOpen}
        onCloseModal={handleCloseEditStoreModal}
        onProfileUpdatedSuccess={refetchVendorProfile}
      />
    </div>
  );
};

export default VendorProfileContainer;
