"use client";

import { useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useMyProfileQuery } from "@/src/redux/features/user/userApi";
import { TAdmin } from "@/src/types/admin";
import AdminProfileBread from "./AdminProfileBread";
import AdminProfileHeader from "./AdminProfileHeader";
import AdminProfileStats from "./AdminProfileStats";
import AdminProfileDetails from "./AdminProfileDetails";
import AdminProfileEditModal from "./AdminProfileEditModal";
import AdminProfileSkeleton from "./AdminProfileSkeleton";

const AdminProfileContainer = () => {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] =
    useState<boolean>(false);

  const {
    data: profileApiResponse,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileFetchError,
    refetch: refetchAdminProfile,
    isFetching: isRefetchingProfile,
  } = useMyProfileQuery({});

  const adminProfileData: TAdmin | undefined = profileApiResponse?.data;

  const handleOpenEditProfileModal = () => {
    setIsEditProfileModalOpen(true);
  };

  const handleCloseEditProfileModal = () => {
    setIsEditProfileModalOpen(false);
  };

  const handleRefreshProfileClick = () => {
    refetchAdminProfile();
  };

  // Loading State
  if (isProfileLoading) {
    return (
      <div className="space-y-6 w-full pb-10">
        <AdminProfileBread />
        <AdminProfileSkeleton />
      </div>
    );
  }

  // Error State
  if (isProfileError || !adminProfileData) {
    const backendErrorMessage =
      (profileFetchError as { data?: { message?: string } })?.data?.message ||
      "Unable to load administrator profile details. Please verify your administrative credentials.";

    return (
      <div className="space-y-6 w-full pb-10">
        <AdminProfileBread />

        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-xl font-black text-white">
              Failed to Load Admin Profile
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
      <AdminProfileBread />

      {/* Hero Header Card */}
      <AdminProfileHeader
        adminProfile={adminProfileData}
        onOpenEditModal={handleOpenEditProfileModal}
        onRefreshProfile={handleRefreshProfileClick}
        isRefreshingProfile={isRefetchingProfile}
      />

      {/* High-Level Overview Stats */}
      <AdminProfileStats adminProfile={adminProfileData} />

      {/* Main Admin Details Grid, Permissions & Quick Shortcuts */}
      <AdminProfileDetails
        adminProfile={adminProfileData}
        onOpenEditModal={handleOpenEditProfileModal}
      />

      {/* Edit Admin Profile Modal Dialog */}
      <AdminProfileEditModal
        adminProfile={adminProfileData}
        isModalOpen={isEditProfileModalOpen}
        onCloseModal={handleCloseEditProfileModal}
        onProfileUpdatedSuccess={refetchAdminProfile}
      />
    </div>
  );
};

export default AdminProfileContainer;
